import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {
  Repository,
  DataSource,
  Between,
  MoreThanOrEqual,
} from 'typeorm';

import { InsulinServiceEntity } from './entities/insulin-service.entity';
import { InsulinLike } from './entities/insulin-like.entity';

@Injectable()
export class InsulinService {
  private readonly defaultImageUrl =
    'http://localhost:9000/media/breakfast.png';

  private readonly defaultVideoUrl =
    'http://localhost:9000/media/breakfast.mp4';

  constructor(
    @InjectRepository(InsulinServiceEntity)
    private readonly serviceRepository:
      Repository<InsulinServiceEntity>,

    @InjectRepository(InsulinLike)
    private readonly likeRepository:
      Repository<InsulinLike>,

    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getFirstPublished() {
    return this.serviceRepository.findOne({
      where: {
        status: 'опубликован',
      },

      order: {
        id: 'ASC',
      },
    });
  }

  async getPublishedServices() {
    return this.serviceRepository.find({
      where: {
        status: 'опубликован',
      },

      order: {
        id: 'ASC',
      },
    });
  }

  async getDraft() {
    return this.serviceRepository.findOne({
      where: {
        status: 'черновик',
        creator: 1,
      },
    });
  }

  async getById(id: number) {
    return this.serviceRepository.findOne({
      where: {
        id,
        status: 'опубликован',
      },
    });
  }

  async getNext(id: number) {
    const services =
      await this.serviceRepository.find({
        where: {
          status: 'опубликован',
        },

        order: {
          id: 'ASC',
        },
      });

    const currentIndex =
      services.findIndex(
        (service) =>
          service.id === id,
      );

    if (services.length === 0) {
      return undefined;
    }

    if (
      currentIndex === -1 ||
      currentIndex ===
        services.length - 1
    ) {
      return services[0];
    }

    return services[
      currentIndex + 1
    ];
  }

  async filterByAge(
    ageFrom?: number,
    ageTo?: number,
  ) {
    if (
      ageFrom === undefined
    ) {
      return this.getPublishedServices();
    }

    if (
      ageTo === undefined
    ) {
      return this.serviceRepository.find({
        where: {
          status: 'опубликован',
          age: MoreThanOrEqual(ageFrom),
        },

        order: {
          id: 'ASC',
        },
      });
    }

    return this.serviceRepository.find({
      where: {
        status: 'опубликован',
        age: Between(
          ageFrom,
          ageTo,
        ),
      },

      order: {
        id: 'ASC',
      },
    });
  }

  async createDraft(
    name: string,
  ) {
    const draft =
      this.serviceRepository.create({
        name,

        description: '',

        status: 'черновик',

        imageUrl:
          this.defaultImageUrl,

        videoUrl:
          this.defaultVideoUrl,

        age: null,

        weight: null,

        sensitivityCoefficient:
          null,

        creator: 1,

        createdAt:
          new Date(),

        formedAt: null,
      });

    return this.serviceRepository.save(
      draft,
    );
  }

  async publish(
    id: number,
    name: string,
    description: string,
    age: number,
    weight: number,
    sensitivityCoefficient: number,
  ) {
    const service =
      await this.serviceRepository.findOne({
        where: {
          id,
          status: 'черновик',
          creator: 1,
        },
      });

    if (!service) {
      return undefined;
    }

    service.name = name;

    service.description =
      description;

    service.age = age;

    service.weight = weight;

    service.sensitivityCoefficient =
      sensitivityCoefficient;

    service.status =
      'опубликован';

    service.formedAt =
      new Date();

    return this.serviceRepository.save(
      service,
    );
  }

  async deleteBySql(
    id: number,
  ) {
    await this.dataSource.query(
      `
        UPDATE insulin_services
        SET status = 'удален'
        WHERE id = $1
          AND status = 'опубликован'
      `,
      [id],
    );
  }

  calculateXE(
    age: number,
    weight: number,
  ): number {
    let ageAdjustment = 0;

    if (age >= 60) {
      ageAdjustment = 0.5;
    }

    let xe =
      Math.round(
        2.5 +
          0.025 * weight +
          ageAdjustment,
      );

    if (xe < 3) {
      xe = 3;
    }

    if (xe > 6) {
      xe = 6;
    }

    return xe;
  }

  calculateDose(
    xe: number,
    sensitivityCoefficient: number,
  ): number {
    return (
      xe *
      sensitivityCoefficient
    );
  }

  async getLikesCount(
    serviceId: number,
  ): Promise<number> {
    return this.likeRepository.count({
      where: {
        serviceId,
      },
    });
  }
}