import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MoreThan, Not } from 'typeorm';
import { DatabaseService } from '../sensitivity_coefficient_database.service';
import { InsulinCalculation } from '../sensitivity_coefficient_entities';
import { MinioService } from '../../storage/sensitivity_coefficient_minio.service';
import { getCurrentUser } from '../../common/sensitivity_coefficient_current-user';
import { CreateServiceDto } from './dto/sensitivity_coefficient_create-service.dto';
import { ServiceFilterDto } from './dto/sensitivity_coefficient_service-filter.dto';
import { UploadedFile } from '../../common/sensitivity_coefficient_uploaded-file';

@Injectable()
export class ServicesService {
  constructor(
    private readonly database: DatabaseService,
    private readonly minio: MinioService,
  ) {}

  private async present(
    service: InsulinCalculation,
  ): Promise<Record<string, any>> {
    const userId = getCurrentUser().id;
    const [likesCount, isLiked] = await Promise.all([
      this.database.likes.countBy({ serviceId: service.id }),
      this.database.likes.existsBy({ serviceId: service.id, userId }),
    ]);
    return {
      ...service,
      isCreator: Number(service.creatorId === userId),
      isLiked: Number(isLiked),
      likesCount,
    };
  }

  async getServices(filter: ServiceFilterDto): Promise<Record<string, any>[]> {
    const query = this.database.calculations
      .createQueryBuilder('s')
      .where('s.status = :status', { status: 'опубликован' });
    if (filter.name)
      query.andWhere('s.name ILIKE :name', { name: `%${filter.name}%` });
    const ageFrom = this.optionalNumber(filter.ageFrom);
    const ageTo = this.optionalNumber(filter.ageTo);
    if (ageFrom !== null && ageTo !== null && ageFrom > ageTo)
      throw new BadRequestException('Неверный диапазон возраста');
    if (ageFrom !== null) query.andWhere('s.age >= :ageFrom', { ageFrom });
    if (ageTo !== null) query.andWhere('s.age <= :ageTo', { ageTo });
    return Promise.all(
      (await query.orderBy('s.id', 'ASC').getMany()).map((s) =>
        this.present(s),
      ),
    );
  }

  async getFeed(id?: string, next?: string): Promise<Record<string, any>> {
    if (next !== undefined && next !== 'true' && next !== 'false')
      throw new BadRequestException('next должен быть true или false');
    const repo = this.database.calculations;
    let service: InsulinCalculation | null;
    if (id !== undefined) {
      const currentId = this.parseId(id);
      const current = await repo.findOneBy({
        id: currentId,
        status: 'опубликован',
      });
      if (!current)
        throw new NotFoundException('Опубликованная услуга не найдена');
      service =
        next === 'true'
          ? await repo.findOne({
              where: { status: 'опубликован', id: MoreThan(currentId) },
              order: { id: 'ASC' },
            })
          : current;
      if (!service)
        service = await repo.findOne({
          where: { status: 'опубликован' },
          order: { id: 'ASC' },
        });
    } else {
      service = await repo.findOne({
        where: { status: 'опубликован' },
        order: { id: 'ASC' },
      });
    }
    if (!service) throw new NotFoundException('Опубликованных услуг нет');
    return this.present(service);
  }

  async getDraft(): Promise<Record<string, any> | null> {
    const service = await this.database.calculations.findOne({
      where: { status: 'черновик', creatorId: getCurrentUser().id },
      order: { id: 'DESC' },
    });
    return service ? this.present(service) : null;
  }

  async create(
    dto: CreateServiceDto,
    image?: UploadedFile,
    video?: UploadedFile,
  ): Promise<Record<string, any>> {
    const name = dto.name?.trim();
    const description = dto.description?.trim();
    if (!name || !description || name.length > 200 || description.length > 500)
      throw new BadRequestException(
        'Название (до 200) и описание (до 500 символов) обязательны',
      );
    const age = this.optionalNumber(dto.age);
    const weight = this.optionalNumber(dto.weight);
    const sensitivityCoefficient = this.optionalNumber(
      dto.sensitivityCoefficient,
    );
    if (
      (age !== null && age <= 0) ||
      (weight !== null && weight <= 0) ||
      (sensitivityCoefficient !== null && sensitivityCoefficient <= 0)
    )
      throw new BadRequestException('Числовые поля должны быть положительными');
    if (image && !image.mimetype.startsWith('image/'))
      throw new BadRequestException('Первый файл должен быть изображением');
    if (video && !video.mimetype.startsWith('video/'))
      throw new BadRequestException('Второй файл должен быть видео');
    const creatorId = getCurrentUser().id;
    return this.database.source.transaction(async (manager) => {
      // Lock the existing user so concurrent requests cannot create two drafts.
      const user = await manager
        .getRepository('InsulinUser')
        .findOne({
          where: { id: creatorId },
          lock: { mode: 'pessimistic_write' },
        });
      if (!user) throw new NotFoundException('Текущий пользователь не найден');
      const repo = manager.getRepository(InsulinCalculation);
      if (await repo.existsBy({ status: 'черновик', creatorId }))
        throw new BadRequestException(
          'Сначала опубликуйте или удалите существующий черновик',
        );
      const service = await repo.save(
        repo.create({
          name,
          description,
          age,
          weight,
          sensitivityCoefficient,
          status: 'черновик',
          creatorId,
          createdAt: new Date(),
          formedAt: null,
          imageUrl: image ? await this.minio.upload(image) : null,
          videoUrl: video ? await this.minio.upload(video) : null,
        }),
      );
      return { ...service, isCreator: 1, isLiked: 0, likesCount: 0 };
    });
  }

  async publish(id: string): Promise<Record<string, any>> {
    const result = await this.database.calculations
      .createQueryBuilder()
      .update()
      .set({ status: 'опубликован', formedAt: new Date() })
      .where({
        id: this.parseId(id),
        creatorId: getCurrentUser().id,
        status: 'черновик',
      })
      .returning('*')
      .execute();
    if (!result.affected)
      throw new NotFoundException(
        'Черновик не найден или его нельзя опубликовать',
      );
    return this.getFeed(id);
  }

  async delete(id: string): Promise<Record<string, any>> {
    const serviceId = this.parseId(id);
    const result = await this.database.calculations.update(
      { id: serviceId, creatorId: getCurrentUser().id, status: Not('удален') },
      { status: 'удален' },
    );
    if (!result.affected)
      throw new NotFoundException(
        'Услуга не найдена или не принадлежит текущему пользователю',
      );
    return { id: serviceId, status: 'удален' };
  }

  async setLike(
    id: string,
    value: number,
  ): Promise<{ serviceId: number; liked: boolean }> {
    const serviceId = this.parseId(id);
    const userId = getCurrentUser().id;
    if (value !== 0 && value !== 1)
      throw new BadRequestException('Значение value должно быть 0 или 1');
    if (
      !(await this.database.calculations.existsBy({
        id: serviceId,
        status: 'опубликован',
      }))
    )
      throw new NotFoundException('Опубликованная услуга не найдена');
    if (value === 1)
      await this.database.likes
        .createQueryBuilder()
        .insert()
        .values({ serviceId, userId })
        .orIgnore()
        .execute();
    else await this.database.likes.delete({ serviceId, userId });
    return { serviceId, liked: value === 1 };
  }

  private parseId(id: string): number {
    const parsed = Number(id);
    if (!Number.isSafeInteger(parsed) || parsed <= 0)
      throw new BadRequestException(
        'ID должен быть положительным целым числом',
      );
    return parsed;
  }
  private optionalNumber(value: unknown): number | null {
    if (value === undefined || value === null || value === '') return null;
    const parsed = Number(value);
    if (!Number.isSafeInteger(parsed))
      throw new BadRequestException('Ожидается целое число');
    return parsed;
  }
}
