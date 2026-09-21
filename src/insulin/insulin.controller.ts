import {
  Controller,
  Get,
  Query,
  Res,
} from '@nestjs/common';

import { Response } from 'express';

import { InsulinService } from './insulin.service';

@Controller('insulin')
export class InsulinController {
  constructor(
    private readonly insulinService: InsulinService,
  ) {}

  @Get('feed')
  getFeed(
    @Query('id') id: string | undefined,
    @Query('next') next: string | undefined,
    @Query('like') like: string | undefined,
    @Res() res: Response,
  ) {
    let service;

    if (id) {
      const serviceId = Number(id);

      if (like === 'true') {
        this.insulinService.addLike(
          serviceId,
        );

        return res.redirect(
          `/insulin/feed?id=${serviceId}`,
        );
      }

      if (next === 'true') {
        service =
          this.insulinService.getNext(
            serviceId,
          );
      } else {
        service =
          this.insulinService.getById(
            serviceId,
          );
      }
    } else {
      service =
        this.insulinService
          .getPublishedServices()[0];
    }

    const xe = service
      ? this.insulinService.calculateXE(
          service.age,
          service.weight,
        )
      : 0;

    const dose = service
      ? this.insulinService.calculateDose(
          xe,
          service.sensitivity_coefficient,
        )
      : 0;

    return res.render(
      'feed',
      {
        service,
        xe,
        dose,

        likesCount: service
          ? this.insulinService.getLikesCount(
              service,
            )
          : 0,
      },
    );
  }

  @Get('add')
  getAdd(
    @Res() res: Response,
  ) {
    const draft =
      this.insulinService.getDraft();

    return res.render(
      'add',
      {
        service: draft,

        likesCount: draft
          ? this.insulinService.getLikesCount(
              draft,
            )
          : 0,
      },
    );
  }

  @Get('tile')
  getTile(
    @Query('ageRange') ageRange: string | undefined,
    @Res() res: Response,
  ) {
    let ageFrom: number | undefined;
    let ageTo: number | undefined;
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
      ageTo = 89;
      ageSlider = 2;
    }

    if (ageRange === '3') {
      ageFrom = 80;
      ageTo = undefined;
      ageSlider = 3;
    }

    const services =
      this.insulinService.filterByAge(
        ageFrom,
        ageTo,
      );

    const servicesWithLikes =
      services.map(
        (service) => ({
          ...service,
          likesCount:
            this.insulinService.getLikesCount(
              service,
            ),
        }),
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
}