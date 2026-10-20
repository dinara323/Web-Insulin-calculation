"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const sensitivity_coefficient_entities_1 = require("./sensitivity_coefficient_entities");
let DatabaseService = class DatabaseService {
    constructor() {
        this.source = new typeorm_1.DataSource({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT || 5432),
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE || 'insulin_calculation',
            entities: [sensitivity_coefficient_entities_1.InsulinUser, sensitivity_coefficient_entities_1.InsulinCalculation, sensitivity_coefficient_entities_1.InsulinLike],
            synchronize: false,
        });
    }
    get calculations() {
        return this.source.getRepository(sensitivity_coefficient_entities_1.InsulinCalculation);
    }
    get users() {
        return this.source.getRepository(sensitivity_coefficient_entities_1.InsulinUser);
    }
    get likes() {
        return this.source.getRepository(sensitivity_coefficient_entities_1.InsulinLike);
    }
    async onModuleInit() {
        await this.source.initialize();
    }
    async onModuleDestroy() {
        if (this.source.isInitialized)
            await this.source.destroy();
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)()
], DatabaseService);
//# sourceMappingURL=sensitivity_coefficient_database.service.js.map