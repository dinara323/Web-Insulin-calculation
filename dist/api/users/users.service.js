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
const database_service_1 = require("../database.service");
const current_user_1 = require("../../common/current-user");
let UsersService = class UsersService {
    constructor(database) {
        this.database = database;
    }
    async register(dto) {
        const name = dto.name?.trim();
        if (!name) {
            throw new common_1.NotFoundException('Имя пользователя обязательно');
        }
        const result = await this.database.query(`
        INSERT INTO insulin_users (name)
        VALUES ($1)
        RETURNING id, name
      `, [name]);
        return result.rows[0];
    }
    async auth() {
        const currentUser = (0, current_user_1.getCurrentUser)();
        const result = await this.database.query(`
      SELECT id, name
      FROM insulin_users
      WHERE id = $1
    `, [currentUser.id]);
        if (!result.rows[0]) {
            throw new common_1.NotFoundException('Текущий пользователь не найден в базе данных');
        }
        return result.rows[0];
    }
    logout() {
        return { message: 'Выход выполнен' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], UsersService);
//# sourceMappingURL=users.service.js.map