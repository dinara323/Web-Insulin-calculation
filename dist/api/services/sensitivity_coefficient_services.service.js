"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const sensitivity_coefficient_database_service_1 = require("../sensitivity_coefficient_database.service");
const sensitivity_coefficient_entities_1 = require("../sensitivity_coefficient_entities");
const sensitivity_coefficient_minio_service_1 = require("../../storage/sensitivity_coefficient_minio.service");
const sensitivity_coefficient_current_user_1 = require("../../common/sensitivity_coefficient_current-user");
let ServicesService = class ServicesService {
    constructor(database, minio) {
        this.database = database;
        this.minio = minio;
    }
    async present(service) {
        const userId = (0, sensitivity_coefficient_current_user_1.optionalCurrentUser)()?.id;
        const [likesCount, isLiked] = await Promise.all([
            this.database.likes.countBy({ serviceId: service.id }),
            userId
                ? this.database.likes.existsBy({ serviceId: service.id, userId })
                : Promise.resolve(false),
        ]);
        return {
            ...service,
            isCreator: Number(service.creatorId === userId),
            isLiked: Number(isLiked),
            likesCount,
        };
    }
    async getServices(filter) {
        const query = this.database.calculations
            .createQueryBuilder('s')
            .where('s.status = :status', { status: 'опубликован' });
        if (filter.name)
            query.andWhere('s.name ILIKE :name', { name: `%${filter.name}%` });
        const ageFrom = this.optionalNumber(filter.ageFrom);
        const ageTo = this.optionalNumber(filter.ageTo);
        if (ageFrom !== null && ageTo !== null && ageFrom > ageTo)
            throw new common_1.BadRequestException('Неверный диапазон возраста');
        if (ageFrom !== null)
            query.andWhere('s.age >= :ageFrom', { ageFrom });
        if (ageTo !== null)
            query.andWhere('s.age <= :ageTo', { ageTo });
        return Promise.all((await query.orderBy('s.id', 'ASC').getMany()).map((s) => this.present(s)));
    }
    async getFeed(id, next) {
        if (next !== undefined && next !== 'true' && next !== 'false')
            throw new common_1.BadRequestException('next должен быть true или false');
        const repo = this.database.calculations;
        let service;
        if (id !== undefined) {
            const currentId = this.parseId(id);
            const current = await repo.findOneBy({
                id: currentId,
                status: 'опубликован',
            });
            if (!current)
                throw new common_1.NotFoundException('Опубликованная услуга не найдена');
            service =
                next === 'true'
                    ? await repo.findOne({
                        where: { status: 'опубликован', id: (0, typeorm_1.MoreThan)(currentId) },
                        order: { id: 'ASC' },
                    })
                    : current;
            if (!service)
                service = await repo.findOne({
                    where: { status: 'опубликован' },
                    order: { id: 'ASC' },
                });
        }
        else {
            service = await repo.findOne({
                where: { status: 'опубликован' },
                order: { id: 'ASC' },
            });
        }
        if (!service)
            throw new common_1.NotFoundException('Опубликованных услуг нет');
        return this.present(service);
    }
    async getDraft() {
        const service = await this.database.calculations.findOne({
            where: { status: 'черновик', creatorId: (0, sensitivity_coefficient_current_user_1.getCurrentUser)().id },
            order: { id: 'DESC' },
        });
        return service ? this.present(service) : null;
    }
    async create(dto, image, video) {
        const name = dto.name?.trim();
        const description = dto.description?.trim();
        if (!name || !description || name.length > 200 || description.length > 500)
            throw new common_1.BadRequestException('Название (до 200) и описание (до 500 символов) обязательны');
        const age = this.optionalNumber(dto.age);
        const weight = this.optionalNumber(dto.weight);
        const sensitivityCoefficient = this.optionalNumber(dto.sensitivityCoefficient);
        if ((age !== null && age <= 0) ||
            (weight !== null && weight <= 0) ||
            (sensitivityCoefficient !== null && sensitivityCoefficient <= 0))
            throw new common_1.BadRequestException('Числовые поля должны быть положительными');
        if (image && !image.mimetype.startsWith('image/'))
            throw new common_1.BadRequestException('Первый файл должен быть изображением');
        if (video && !video.mimetype.startsWith('video/'))
            throw new common_1.BadRequestException('Второй файл должен быть видео');
        const creatorId = (0, sensitivity_coefficient_current_user_1.getCurrentUser)().id;
        return this.database.source.transaction(async (manager) => {
            const user = await manager.getRepository('InsulinUser').findOne({
                where: { id: creatorId },
                lock: { mode: 'pessimistic_write' },
            });
            if (!user)
                throw new common_1.NotFoundException('Текущий пользователь не найден');
            const repo = manager.getRepository(sensitivity_coefficient_entities_1.InsulinCalculation);
            if (await repo.existsBy({ status: 'черновик', creatorId }))
                throw new common_1.BadRequestException('Сначала опубликуйте или удалите существующий черновик');
            const service = await repo.save(repo.create({
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
            }));
            return { ...service, isCreator: 1, isLiked: 0, likesCount: 0 };
        });
    }
    async publish(id, dto = {}) {
        const current = await this.database.calculations.findOneBy({
            id: this.parseId(id),
            creatorId: (0, sensitivity_coefficient_current_user_1.getCurrentUser)().id,
            status: 'черновик',
        });
        if (!current)
            throw new common_1.NotFoundException('Свой черновик не найден');
        const age = this.optionalNumber(dto.age ?? current.age);
        const weight = this.optionalNumber(dto.weight ?? current.weight);
        if (age === null || weight === null || age <= 0 || weight <= 0)
            throw new common_1.BadRequestException('Для публикации укажите положительные возраст и вес');
        const name = (dto.name ?? current.name).trim();
        const description = (dto.description ?? current.description).trim();
        if (!name || name.length > 200 || description.length > 500)
            throw new common_1.BadRequestException('Проверьте название и описание');
        const sensitivityCoefficient = Math.min(6, Math.max(3, Math.round(2.5 + 0.025 * weight + (age >= 60 ? 0.5 : 0))));
        const result = await this.database.calculations
            .createQueryBuilder()
            .update()
            .set({
            name,
            description,
            age,
            weight,
            sensitivityCoefficient,
            status: 'опубликован',
            formedAt: new Date(),
        })
            .where({
            id: this.parseId(id),
            creatorId: (0, sensitivity_coefficient_current_user_1.getCurrentUser)().id,
            status: 'черновик',
        })
            .returning('*')
            .execute();
        if (!result.affected)
            throw new common_1.NotFoundException('Черновик не найден или его нельзя опубликовать');
        return this.getFeed(id);
    }
    async delete(id) {
        const serviceId = this.parseId(id);
        const result = await this.database.calculations.update({ id: serviceId, creatorId: (0, sensitivity_coefficient_current_user_1.getCurrentUser)().id, status: (0, typeorm_1.Not)('удален') }, { status: 'удален' });
        if (!result.affected)
            throw new common_1.NotFoundException('Услуга не найдена или не принадлежит текущему пользователю');
        return { id: serviceId, status: 'удален' };
    }
    async setLike(id, value) {
        const serviceId = this.parseId(id);
        const userId = (0, sensitivity_coefficient_current_user_1.getCurrentUser)().id;
        if (value !== 0 && value !== 1)
            throw new common_1.BadRequestException('Значение value должно быть 0 или 1');
        if (!(await this.database.calculations.existsBy({
            id: serviceId,
            status: 'опубликован',
        })))
            throw new common_1.NotFoundException('Опубликованная услуга не найдена');
        if (value === 1)
            await this.database.likes
                .createQueryBuilder()
                .insert()
                .values({ serviceId, userId })
                .orIgnore()
                .execute();
        else
            await this.database.likes.delete({ serviceId, userId });
        return { serviceId, liked: value === 1 };
    }
    parseId(id) {
        const parsed = Number(id);
        if (!Number.isSafeInteger(parsed) || parsed <= 0)
            throw new common_1.BadRequestException('ID должен быть положительным целым числом');
        return parsed;
    }
    optionalNumber(value) {
        if (value === undefined || value === null || value === '')
            return null;
        const parsed = Number(value);
        if (!Number.isSafeInteger(parsed))
            throw new common_1.BadRequestException('Ожидается целое число');
        return parsed;
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sensitivity_coefficient_database_service_1.DatabaseService,
        sensitivity_coefficient_minio_service_1.MinioService])
], ServicesService);
//# sourceMappingURL=sensitivity_coefficient_services.service.js.map