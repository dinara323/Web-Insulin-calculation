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
exports.ServicesController = void 0;
const swagger_1 = require("@nestjs/swagger");
const sensitivity_coefficient_session_guard_1 = require("../../auth/sensitivity_coefficient_session.guard");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const sensitivity_coefficient_services_service_1 = require("./sensitivity_coefficient_services.service");
const sensitivity_coefficient_create_service_dto_1 = require("./dto/sensitivity_coefficient_create-service.dto");
const sensitivity_coefficient_service_filter_dto_1 = require("./dto/sensitivity_coefficient_service-filter.dto");
let ServicesController = class ServicesController {
    constructor(servicesService) {
        this.servicesService = servicesService;
    }
    getServices(filter) {
        return this.servicesService.getServices(filter);
    }
    getFeed(id, next) {
        return this.servicesService.getFeed(id, next);
    }
    getDraft() {
        return this.servicesService.getDraft();
    }
    create(dto, files) {
        return this.servicesService.create(dto, files?.image?.[0], files?.video?.[0]);
    }
    publish(id, dto) {
        return this.servicesService.publish(id, dto);
    }
    delete(id) {
        return this.servicesService.delete(id);
    }
    setLike(id, value) {
        return this.servicesService.setLike(id, Number(value));
    }
};
exports.ServicesController = ServicesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Список опубликованных расчётов, доступен гостю' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sensitivity_coefficient_service_filter_dto_1.ServiceFilterDto]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "getServices", null);
__decorate([
    (0, common_1.Get)('feed'),
    (0, swagger_1.ApiOperation)({ summary: 'Лента: первая, выбранная или следующая карточка' }),
    (0, swagger_1.ApiQuery)({ name: 'id', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'next', required: false, type: Boolean }),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Query)('next')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "getFeed", null);
__decorate([
    (0, common_1.Get)('draft'),
    (0, swagger_1.ApiOperation)({ summary: 'Черновик текущего создателя' }),
    (0, common_1.UseGuards)(sensitivity_coefficient_session_guard_1.SessionGuard),
    (0, swagger_1.ApiCookieAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Нет активной сессии' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "getDraft", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Создать черновик с фото и видео' }),
    (0, common_1.UseGuards)(sensitivity_coefficient_session_guard_1.SessionGuard),
    (0, swagger_1.ApiCookieAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Нет активной сессии' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['name', 'description'],
            properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                age: { type: 'integer' },
                weight: { type: 'integer' },
                image: { type: 'string', format: 'binary' },
                video: { type: 'string', format: 'binary' },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'image', maxCount: 1 },
        { name: 'video', maxCount: 1 },
    ])),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sensitivity_coefficient_create_service_dto_1.CreateServiceDto, Object]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id/publish'),
    (0, swagger_1.ApiOperation)({ summary: 'Заполнить и опубликовать свой черновик' }),
    (0, common_1.UseGuards)(sensitivity_coefficient_session_guard_1.SessionGuard),
    (0, swagger_1.ApiCookieAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Нет активной сессии' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, sensitivity_coefficient_create_service_dto_1.PublishServiceDto]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "publish", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Удалить свой расчёт' }),
    (0, common_1.UseGuards)(sensitivity_coefficient_session_guard_1.SessionGuard),
    (0, swagger_1.ApiCookieAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Нет активной сессии' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/like'),
    (0, swagger_1.ApiOperation)({ summary: 'Поставить или отменить лайк' }),
    (0, common_1.UseGuards)(sensitivity_coefficient_session_guard_1.SessionGuard),
    (0, swagger_1.ApiCookieAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Нет активной сессии' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['value'],
            properties: { value: { type: 'integer', enum: [0, 1] } },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('value')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "setLike", null);
exports.ServicesController = ServicesController = __decorate([
    (0, swagger_1.ApiTags)('Расчёты'),
    (0, common_1.Controller)('api/services'),
    __metadata("design:paramtypes", [sensitivity_coefficient_services_service_1.ServicesService])
], ServicesController);
//# sourceMappingURL=sensitivity_coefficient_services.controller.js.map