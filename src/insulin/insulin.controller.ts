import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
} from '@nestjs/common';

import { Response } from 'express';

import { InsulinService } from './insulin.service';

@Controller('insulin')
export class InsulinController {
  constructor(
    private readonly insulinService:
      InsulinService,
  ) {}

  // 1. GET — лента
  @Get('feed')
  async getFeed(
    @Query('id')
    id: string | undefined,

    @Query('next')
    next: string | undefined,

    @Res()
    res: Response,
  ) {
    let service;

    if (id) {
      if (next === 'true') {
        service =
          await this.insulinService.getNext(
            Number(id),
          );
      } else {
        service =
          await this.insulinService.getById(
            Number(id),
          );
      }
    } else {
      service =
        await this.insulinService.getFirstPublished();
    }

    if (!service) {
      return res
        .status(404)
        .send('Услуга не найдена');
    }

    const xe =
      this.insulinService.calculateXE(
        service.age,
        service.weight,
      );

    const dose =
      this.insulinService.calculateDose(
        xe,
        service.sensitivityCoefficient,
      );

    const likesCount =
      await this.insulinService.getLikesCount(
        service.id,
      );

    return res.render(
      'feed',
      {
        service,
        xe,
        dose,
        likesCount,
      },
    );
  }

  // 2. GET — добавление
  @Get('add')
  async getAdd(
    @Res()
    res: Response,
  ) {
    const service =
      await this.insulinService.getDraft();

    let selectedCoefficient1 =
      '';

    let selectedCoefficient2 =
      '';

    let selectedCoefficient3 =
      '';

    let selectedCoefficient4 =
      '';

    if (service) {
      if (
        service.sensitivityCoefficient === 1
      ) {
        selectedCoefficient1 =
          'selected';
      }

      if (
        service.sensitivityCoefficient === 2
      ) {
        selectedCoefficient2 =
          'selected';
      }

      if (
        service.sensitivityCoefficient === 3
      ) {
        selectedCoefficient3 =
          'selected';
      }

      if (
        service.sensitivityCoefficient === 4
      ) {
        selectedCoefficient4 =
          'selected';
      }
    }

    return res.render(
      'add',
      {
        service,
        selectedCoefficient1,
        selectedCoefficient2,
        selectedCoefficient3,
        selectedCoefficient4,
      },
    );
  }

  // 3. GET — плитка
  @Get('tile')
  async getTile(
    @Query('ageRange')
    ageRange: string | undefined,

    @Res()
    res: Response,
  ) {
    let ageFrom:
      | number
      | undefined;

    let ageTo:
      | number
      | undefined;

    let ageSlider = 0;

    if (ageRange === '0') {
      ageFrom = 18;
      ageTo = 39;
      ageSlider = 0;
    }

    if (ageRange === '1') {
      ageFrom = 40;
      ageTo = 59;
      ageSlider = 1;
    }

    if (ageRange === '2') {
      ageFrom = 60;
      ageTo = 79;
      ageSlider = 2;
    }

    if (ageRange === '3') {
      ageFrom = 80;
      ageSlider = 3;
    }

    const services =
      await this.insulinService.filterByAge(
        ageFrom,
        ageTo,
      );

    const servicesWithLikes =
      await Promise.all(
        services.map(
          async (service) => ({
            ...service,

            likesCount:
              await this.insulinService.getLikesCount(
                service.id,
              ),
          }),
        ),
      );

    return res.render(
      'tile',
      {
        services:
          servicesWithLikes,

        ageSlider,
      },
    );
  }

  // 4. POST — создание черновика
  @Post('add')
  async createDraft(
    @Body('name')
    name: string,

    @Res()
    res: Response,
  ) {
    await this.insulinService.createDraft(
      name,
    );

    return res.redirect(
      '/insulin/add',
    );
  }

  // 5. POST — публикация
  @Post('publish')
  async publish(
    @Body('id')
    id: string,

    @Body('name')
    name: string,

    @Body('description')
    description: string,

    @Body('age')
    age: string,

    @Body('weight')
    weight: string,

    @Body('sensitivityCoefficient')
    sensitivityCoefficient: string,

    @Res()
    res: Response,
  ) {
    await this.insulinService.publish(
      Number(id),
      name,
      description,
      Number(age),
      Number(weight),
      Number(sensitivityCoefficient),
    );

    return res.redirect(
      `/insulin/feed?id=${id}`,
    );
  }

  // 6. POST — логическое удаление через SQL UPDATE
  @Post('delete')
  async delete(
    @Body('id')
    id: string,

    @Res()
    res: Response,
  ) {
    await this.insulinService.deleteBySql(
      Number(id),
    );

    return res.redirect(
      '/insulin/tile',
    );
  }
}