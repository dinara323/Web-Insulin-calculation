"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiModule = void 0;
const common_1 = require("@nestjs/common");
const sensitivity_coefficient_database_module_1 = require("./sensitivity_coefficient_database.module");
const sensitivity_coefficient_services_module_1 = require("./services/sensitivity_coefficient_services.module");
const sensitivity_coefficient_users_module_1 = require("./users/sensitivity_coefficient_users.module");
let ApiModule = class ApiModule {
};
exports.ApiModule = ApiModule;
exports.ApiModule = ApiModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sensitivity_coefficient_database_module_1.DatabaseModule,
            sensitivity_coefficient_services_module_1.ServicesModule,
            sensitivity_coefficient_users_module_1.UsersModule,
        ],
    })
], ApiModule);
//# sourceMappingURL=sensitivity_coefficient_api.module.js.map