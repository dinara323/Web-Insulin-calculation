import { Injectable } from '@nestjs/common';

import { insulinServices } from './insulin.collection';

import {
  InsulinService as InsulinServiceType,
} from './insulin.types';

@Injectable()
export class InsulinService {
  private readonly services = insulinServices;

  getPublishedServices(): InsulinServiceType[] {
    return this.services.filter(
      (service) =>
        service.status === 'опубликован',
    );
  }

  getDraft():
    | InsulinServiceType
    | undefined {
    return this.services.find(
      (service) =>
        service.status === 'черновик',
    );
  }

  getById(
    id: number,
  ):
    | InsulinServiceType
    | undefined {
    return this.services.find(
      (service) =>
        service.id === id &&
        service.status !== 'удален',
    );
  }

  getNext(
    id: number,
  ):
    | InsulinServiceType
    | undefined {
    const published =
      this.getPublishedServices();

    const currentIndex =
      published.findIndex(
        (service) =>
          service.id === id,
      );

    if (currentIndex === -1) {
      return published[0];
    }

    return published[
      (currentIndex + 1) %
        published.length
    ];
  }

  filterByIsf(
    isf?: number,
  ): InsulinServiceType[] {
    const published =
      this.getPublishedServices();

    if (
      isf === undefined ||
      Number.isNaN(isf)
    ) {
      return published;
    }

    return published.filter(
      (service) =>
        service.isf === isf,
    );
  }

  getLikesCount(
    service: InsulinServiceType,
  ): number {
    return service.likes.length;
  }

  addLike(
    id: number,
  ):
    | InsulinServiceType
    | undefined {

    const service =
      this.getById(id);

    if (!service) {
      return undefined;
    }

    const newLikeId =
      service.likes.length > 0
        ? Math.max(
            ...service.likes,
          ) + 1
        : 1;

    service.likes.push(
      newLikeId,
    );

    return service;
  }
}