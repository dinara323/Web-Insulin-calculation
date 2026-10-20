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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const sensitivity_coefficient_database_service_1 = require("../sensitivity_coefficient_database.service");
const sensitivity_coefficient_current_user_1 = require("../../common/sensitivity_coefficient_current-user");
let UsersService = class UsersService {
    constructor(database) {
        this.database = database;
    }
    async register(dto) {
        const name = dto.name?.trim();
        if (!name || name.length > 100)
            throw new common_1.BadRequestException('Имя обязательно, не более 100 символов');
        return this.database.users.save(this.database.users.create({ name }));
    }
    async auth() {
        const user = await this.database.users.findOneBy({
            id: (0, sensitivity_coefficient_current_user_1.getCurrentUser)().id,
        });
        if (!user)
            throw new common_1.NotFoundException('Текущий пользователь не найден в базе данных');
        return user;
    }
    logout() {
        return { message: 'Выход выполнен' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sensitivity_coefficient_database_service_1.DatabaseService])
], UsersService);
//# sourceMappingURL=sensitivity_coefficient_users.service.js.map