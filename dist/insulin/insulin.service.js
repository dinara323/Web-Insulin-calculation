"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsulinService = void 0;
const common_1 = require("@nestjs/common");
const insulin_collection_1 = require("./insulin.collection");
let InsulinService = class InsulinService {
    constructor() {
        this.services = insulin_collection_1.insulinServices;
    }
    getPublishedServices() {
        return this.services.filter((service) => service.status === 'опубликован');
    }
    getDraft() {
        return this.services.find((service) => service.status === 'черновик');
    }
    getById(id) {
        return this.services.find((service) => service.id === id &&
            service.status !== 'удален');
    }
    getNext(id) {
        const published = this.getPublishedServices();
        const currentIndex = published.findIndex((service) => service.id === id);
        if (currentIndex === -1) {
            return published[0];
        }
        return published[(currentIndex + 1) % published.length];
    }
    filterByIsf(isf) {
        const published = this.getPublishedServices();
        if (isf === undefined ||
            Number.isNaN(isf)) {
            return published;
        }
        return published.filter((service) => service.isf === isf);
    }
    getLikesCount(service) {
        return service.likes.length;
    }
};
exports.InsulinService = InsulinService;
exports.InsulinService = InsulinService = __decorate([
    (0, common_1.Injectable)()
], InsulinService);
//# sourceMappingURL=insulin.service.js.map