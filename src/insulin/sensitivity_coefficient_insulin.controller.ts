import { SessionGuard } from '../auth/sensitivity_coefficient_session.guard';
import { UseGuards, Controller, Get, Query, Res } from '@nestjs/common';

import { Response } from 'express';

import { InsulinService } from './sensitivity_coefficient_insulin.service';

@Controller('insulin')
export class InsulinController {
  constructor(private readonly insulinService: InsulinService) {}

  @Get('auth')
  getAuth(@Res() res: Response) { return res.render('sensitivity_coefficient_auth'); }

  @Get('feed')
  async getFeed(
    @Query('id') id: string | undefined,
    @Query('next') next: string | undefined,
    @Query('like') like: string | undefined,
    @Res() res: Response,
  ) {
    let service;

    if (id) {
      const serviceId = Number(id);

      if (like === 'true') {
        await this.insulinService.addLike(serviceId);

        return res.redirect(`/insulin/feed?id=${serviceId}`);
      }

      if (next === 'true') {
        service = await this.insulinService.getNext(serviceId);
      } else {
        service = await this.insulinService.getById(serviceId);
      }
    } else {
      service = (await this.insulinService.getPublishedServices())[0];
    }

    const xe = service
      ? this.insulinService.calculateXE(service.age, service.weight)
      : 0;

    const dose = service
      ? this.insulinService.calculateDose(xe, service.sensitivity_coefficient)
      : 0;

    return res.render('sensitivity_coefficient_feed', {
      service,
      xe,
      dose,

      likesCount: service ? this.insulinService.getLikesCount(service) : 0,
    });
  }

  @Get('add')
  @UseGuards(SessionGuard)
  async getAdd(@Res() res: Response) {
    const draft = await this.insulinService.getDraft();

    return res.render('sensitivity_coefficient_add', {
      service: draft,

      likesCount: draft ? this.insulinService.getLikesCount(draft) : 0,
    });
  }

  @Get('tile')
  async getTile(
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

    const services = await this.insulinService.filterByAge(ageFrom, ageTo);

    const servicesWithLikes = services.map((service) => ({
      ...service,
      likesCount: this.insulinService.getLikesCount(service),
    }));

    return res.render('sensitivity_coefficient_tile', {
      services: servicesWithLikes,
      ageSlider,
    });
  }
}
