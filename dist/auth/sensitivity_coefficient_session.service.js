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
exports.SessionService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
const crypto_1 = require("crypto");
let SessionService = class SessionService {
    constructor() {
        this.redis = new ioredis_1.default(process.env.REDIS_URL || 'redis://127.0.0.1:6379', { maxRetriesPerRequest: 1 });
        this.ttl = 3600;
        this.redis.on('error', () => console.error('Redis недоступен: проверьте контейнер insulin_redis'));
    }
    async create(user) {
        const id = (0, crypto_1.randomBytes)(32).toString('hex');
        await this.redis.set(`session:${id}`, JSON.stringify(user), 'EX', this.ttl);
        return id;
    }
    async get(id) {
        if (!id || !/^[a-f0-9]{64}$/.test(id))
            return undefined;
        const value = await this.redis.get(`session:${id}`);
        return value ? JSON.parse(value) : undefined;
    }
    async destroy(id) {
        if (id && /^[a-f0-9]{64}$/.test(id))
            await this.redis.del(`session:${id}`);
    }
    async onModuleDestroy() {
        await this.redis.quit();
    }
};
exports.SessionService = SessionService;
exports.SessionService = SessionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SessionService);
//# sourceMappingURL=sensitivity_coefficient_session.service.js.map