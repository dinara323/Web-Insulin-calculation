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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsulinController = void 0;
const common_1 = require("@nestjs/common");
const insulin_service_1 = require("./insulin.service");
let InsulinController = class InsulinController {
    constructor(insulinService) {
        this.insulinService = insulinService;
    }
    getFeed(id, next, like, res) {
        let service;
        if (id) {
            const serviceId = Number(id);
            if (like === 'true') {
                this.insulinService.addLike(serviceId);
                return res.redirect(`/insulin/feed?id=${serviceId}`);
            }
            if (next === 'true') {
                service =
                    this.insulinService.getNext(serviceId);
            }
            else {
                service =
                    this.insulinService.getById(serviceId);
            }
        }
        else {
            service =
                this.insulinService
                    .getPublishedServices()[0];
        }
        return res.render('feed', {
            service,
            likesCount: service
                ? this.insulinService.getLikesCount(service)
                : 0,
        });
    }
    getAdd(res) {
        const draft = this.insulinService.getDraft();
        return res.render('add', {
            service: draft,
            likesCount: draft
                ? this.insulinService.getLikesCount(draft)
                : 0,
        });
    }
    getTile(isf, res) {
        const isfNumber = isf !== undefined
            ? Number(isf)
            : undefined;
        const services = this.insulinService.filterByIsf(isfNumber);
        const servicesWithLikes = services.map((service) => ({
            ...service,
            likesCount: this.insulinService.getLikesCount(service),
        }));
        return res.render('tile', {
            services: servicesWithLikes,
            isf,
        });
    }
};
exports.InsulinController = InsulinController;
__decorate([
    (0, common_1.Get)('feed'),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Query)('next')),
    __param(2, (0, common_1.Query)('like')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", void 0)
], InsulinController.prototype, "getFeed", null);
__decorate([
    (0, common_1.Get)('add'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InsulinController.prototype, "getAdd", null);
__decorate([
    (0, common_1.Get)('tile'),
    __param(0, (0, common_1.Query)('isf')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InsulinController.prototype, "getTile", null);
exports.InsulinController = InsulinController = __decorate([
    (0, common_1.Controller)('insulin'),
    __metadata("design:paramtypes", [insulin_service_1.InsulinService])
], InsulinController);
//# sourceMappingURL=insulin.controller.js.map