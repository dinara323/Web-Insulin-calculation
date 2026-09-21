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

  filterByAge(
    ageFrom?: number,
    ageTo?: number,
  ): InsulinServiceType[] {
    const published =
      this.getPublishedServices();

    if (
      ageFrom === undefined ||
      Number.isNaN(ageFrom)
    ) {
      return published;
    }

    if (ageTo === undefined) {
      return published.filter(
        (service) =>
          service.age >= ageFrom,
      );
    }

    return published.filter(
      (service) =>
        service.age >= ageFrom &&
        service.age <= ageTo,
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
    sensitivity_coefficient: number,
  ): number {
    return (
      xe *
      sensitivity_coefficient
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