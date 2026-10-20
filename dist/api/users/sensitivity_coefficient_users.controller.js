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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sensitivity_coefficient_users_service_1 = require("./sensitivity_coefficient_users.service");
const sensitivity_coefficient_register_user_dto_1 = require("./dto/sensitivity_coefficient_register-user.dto");
const sensitivity_coefficient_session_service_1 = require("../../auth/sensitivity_coefficient_session.service");
const sensitivity_coefficient_session_guard_1 = require("../../auth/sensitivity_coefficient_session.guard");
const sensitivity_coefficient_current_user_1 = require("../../common/sensitivity_coefficient_current-user");
let UsersController = class UsersController {
    constructor(users, sessions) {
        this.users = users;
        this.sessions = sessions;
    }
    register(dto) {
        return this.users.register(dto);
    }
    async auth(dto, req, res) {
        const user = await this.users.auth(dto);
        await this.sessions.destroy(req.cookies?.sessionId);
        const sessionId = await this.sessions.create(user);
        res.cookie('sessionId', sessionId, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.COOKIE_SECURE === 'true',
            maxAge: this.sessions.ttl * 1000,
            path: '/',
        });
        return { user };
    }
    me() {
        return (0, sensitivity_coefficient_current_user_1.getCurrentUser)();
    }
    async logout(req, res) {
        await this.sessions.destroy(req.cookies?.sessionId);
        res.clearCookie('sessionId', {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.COOKIE_SECURE === 'true',
        });
        return { message: 'Выход выполнен' };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Регистрация создателя' }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Создатель зарегистрирован; возвращаются id и name без пароля',
    }),
    (0, swagger_1.ApiConflictResponse)({ description: 'Имя занято' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sensitivity_coefficient_register_user_dto_1.RegisterUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('auth'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: 'Вход: создаёт Redis-сессию и HttpOnly cookie sessionId',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Пользователь вошёл; cookie sessionId установлена, сессия сохранена в Redis',
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Неверные данные' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sensitivity_coefficient_register_user_dto_1.RegisterUserDto, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "auth", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(sensitivity_coefficient_session_guard_1.SessionGuard),
    (0, swagger_1.ApiCookieAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Текущий пользователь сессии' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "me", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiCookieAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Выход: удаление сессии в Redis и куки' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "logout", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Пользователи'),
    (0, common_1.Controller)('api/users'),
    __metadata("design:paramtypes", [sensitivity_coefficient_users_service_1.UsersService,
        sensitivity_coefficient_session_service_1.SessionService])
], UsersController);
//# sourceMappingURL=sensitivity_coefficient_users.controller.js.map