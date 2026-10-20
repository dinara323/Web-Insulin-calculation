"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const sensitivity_coefficient_auth_module_1 = require("./auth/sensitivity_coefficient_auth.module");
const common_1 = require("@nestjs/common");
const sensitivity_coefficient_insulin_module_1 = require("./insulin/sensitivity_coefficient_insulin.module");
const sensitivity_coefficient_api_module_1 = require("./api/sensitivity_coefficient_api.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [sensitivity_coefficient_auth_module_1.AuthModule, sensitivity_coefficient_insulin_module_1.InsulinModule, sensitivity_coefficient_api_module_1.ApiModule],
    })
], AppModule);
//# sourceMappingURL=sensitivity_coefficient_app.module.js.map