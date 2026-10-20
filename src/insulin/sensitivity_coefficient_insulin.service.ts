import { Injectable, NotFoundException } from '@nestjs/common';
import { ServicesService } from '../api/services/sensitivity_coefficient_services.service';

@Injectable()
export class InsulinService {
  constructor(private readonly api: ServicesService) {}
  private view(row: Record<string, any>) {
    return {
      ...row,
      sensitivity_coefficient: row.sensitivityCoefficient,
      moreText: row.description,
    };
  }
  async getPublishedServices() {
    return (await this.api.getServices({})).map((row) => this.view(row));
  }
  async getDraft() {
    const row = await this.api.getDraft();
    return row ? this.view(row) : undefined;
  }
  async getById(id: number) {
    try {
      return this.view(await this.api.getFeed(String(id)));
    } catch (e) {
      if (e instanceof NotFoundException) return undefined;
      throw e;
    }
  }
  async getNext(id: number) {
    return this.view(await this.api.getFeed(String(id), 'true'));
  }
  async filterByAge(ageFrom?: number, ageTo?: number) {
    return (await this.api.getServices({ ageFrom, ageTo })).map((row) =>
      this.view(row),
    );
  }
  async addLike(id: number) {
    await this.api.setLike(String(id), 1);
  }
  getLikesCount(service: Record<string, any>) {
    return service.likesCount ?? 0;
  }
  calculateXE(age: number, weight: number): number {
    let ageAdjustment = 0;

    if (age >= 60) {
      ageAdjustment = 0.5;
    }

    let xe = Math.round(2.5 + 0.025 * weight + ageAdjustment);

    if (xe < 3) {
      xe = 3;
    }

    if (xe > 6) {
      xe = 6;
    }

    return xe;
  }

  calculateDose(xe: number, sensitivity_coefficient: number): number {
    return xe * sensitivity_coefficient;
  }
}
