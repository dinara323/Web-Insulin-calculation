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
exports.InsulinService = void 0;
const common_1 = require("@nestjs/common");
const sensitivity_coefficient_services_service_1 = require("../api/services/sensitivity_coefficient_services.service");
let InsulinService = class InsulinService {
    constructor(api) {
        this.api = api;
    }
    view(row) {
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
    async getById(id) {
        try {
            return this.view(await this.api.getFeed(String(id)));
        }
        catch (e) {
            if (e instanceof common_1.NotFoundException)
                return undefined;
            throw e;
        }
    }
    async getNext(id) {
        return this.view(await this.api.getFeed(String(id), 'true'));
    }
    async filterByAge(ageFrom, ageTo) {
        return (await this.api.getServices({ ageFrom, ageTo })).map((row) => this.view(row));
    }
    async addLike(id) {
        await this.api.setLike(String(id), 1);
    }
    getLikesCount(service) {
        return service.likesCount ?? 0;
    }
    calculateXE(age, weight) {
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
    calculateDose(xe, sensitivity_coefficient) {
        return xe * sensitivity_coefficient;
    }
};
exports.InsulinService = InsulinService;
exports.InsulinService = InsulinService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sensitivity_coefficient_services_service_1.ServicesService])
], InsulinService);
//# sourceMappingURL=sensitivity_coefficient_insulin.service.js.map