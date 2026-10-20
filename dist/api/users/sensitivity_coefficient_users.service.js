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
const bcryptjs_1 = require("bcryptjs");
const sensitivity_coefficient_database_service_1 = require("../sensitivity_coefficient_database.service");
let UsersService = class UsersService {
    constructor(database) {
        this.database = database;
    }
    async register(dto) {
        const name = dto.name.trim();
        if (await this.database.users.existsBy({ name }))
            throw new common_1.ConflictException('Имя уже занято');
        try {
            const user = await this.database.users.save(this.database.users.create({
                name,
                passwordHash: await (0, bcryptjs_1.hash)(dto.password, 12),
            }));
            return { id: user.id, name: user.name };
        }
        catch (e) {
            if (e.code === '23505')
                throw new common_1.ConflictException('Имя уже занято');
            throw e;
        }
    }
    async auth(dto) {
        const user = await this.database.users
            .createQueryBuilder('u')
            .addSelect('u.passwordHash')
            .where('u.name = :name', { name: dto.name.trim() })
            .getOne();
        if (!user?.passwordHash ||
            !(await (0, bcryptjs_1.compare)(dto.password, user.passwordHash)))
            throw new common_1.UnauthorizedException('Неверное имя или пароль');
        return { id: user.id, name: user.name };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sensitivity_coefficient_database_service_1.DatabaseService])
], UsersService);
//# sourceMappingURL=sensitivity_coefficient_users.service.js.map