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

      /*
       * Пользователь нажал лайк.
       * Добавляем лайк только при наличии
       * параметра like=true.
       */
      if (like === 'true') {
        this.insulinService.addLike(
          serviceId,
        );

        /*
         * После добавления лайка
         * переходим на обычный URL.
         *
         * Поэтому F5 уже не добавит
         * повторный лайк.
         */
        return res.redirect(
          `/insulin/feed?id=${serviceId}`,
        );
      }

      /*
       * Переход к следующей услуге.
       */
      if (next === 'true') {
        service =
          this.insulinService.getNext(
            serviceId,
          );
      } else {
        /*
         * Обычное открытие услуги.
         */
        service =
          this.insulinService.getById(
            serviceId,
          );
      }
    } else {
      /*
       * Открываем первую опубликованную
       * услугу.
       */
      service =
        this.insulinService
          .getPublishedServices()[0];
    }

    /*
     * Передаём данные в шаблон.
     */
    return res.render(
      'feed',
      {
        service,

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
    @Query('isf') isf: string | undefined,
    @Res() res: Response,
  ) {
    const isfNumber =
      isf !== undefined
        ? Number(isf)
        : undefined;

    const services =
      this.insulinService.filterByIsf(
        isfNumber,
      );

    /*
     * Рассчитываем количество
     * лайков в контроллере.
     */
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

        isf,
      },
    );
  }
}