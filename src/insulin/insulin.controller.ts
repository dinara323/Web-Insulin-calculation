import {
  Controller,
  Get,
  Query,
  Render,
} from '@nestjs/common';

import { InsulinService } from './insulin.service';

@Controller('insulin')
export class InsulinController {
  constructor(
    private readonly insulinService: InsulinService,
  ) {}

  @Get('feed')
  @Render('feed')
  getFeed(
    @Query('id') id?: string,
    @Query('next') next?: string,
  ) {
    let service;

    if (id) {
      const serviceId = Number(id);

      if (next === 'true') {
        service =
          this.insulinService.getNext(serviceId);
      } else {
        service =
          this.insulinService.getById(serviceId);
      }
    } else {
      service =
        this.insulinService
          .getPublishedServices()[0];
    }

    return {
      service,

      likesCount: service
        ? this.insulinService.getLikesCount(
            service,
          )
        : 0,
    };
  }

  @Get('add')
  @Render('add')
  getAdd() {
    const draft =
      this.insulinService.getDraft();

    return {
      service: draft,

      likesCount: draft
        ? this.insulinService.getLikesCount(
            draft,
          )
        : 0,
    };
  }

  @Get('tile')
@Render('tile')
getTile(
  @Query('isf') isf?: string,
) {
  const isfNumber =
    isf && isf.trim() !== ''
      ? Number(isf)
      : undefined;

  const services =
    this.insulinService.filterByIsf(
      isfNumber,
    );

  return {
    services,
    isf,
  };
}
}