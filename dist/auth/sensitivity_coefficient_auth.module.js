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
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const sensitivity_coefficient_session_service_1 = require("./sensitivity_coefficient_session.service");
const sensitivity_coefficient_session_guard_1 = require("./sensitivity_coefficient_session.guard");
const sensitivity_coefficient_current_user_1 = require("../common/sensitivity_coefficient_current-user");
let AuthModule = class AuthModule {
    constructor(sessions) {
        this.sessions = sessions;
    }
    configure(consumer) {
        consumer
            .apply(async (req, res, next) => {
            try {
                const user = await this.sessions.get(req.cookies?.sessionId);
                sensitivity_coefficient_current_user_1.userContext.run({ user }, () => next());
            }
            catch (error) {
                next(error);
            }
        })
            .forRoutes('*');
    }
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [sensitivity_coefficient_session_service_1.SessionService, sensitivity_coefficient_session_guard_1.SessionGuard],
        exports: [sensitivity_coefficient_session_service_1.SessionService, sensitivity_coefficient_session_guard_1.SessionGuard],
    }),
    __metadata("design:paramtypes", [sensitivity_coefficient_session_service_1.SessionService])
], AuthModule);
//# sourceMappingURL=sensitivity_coefficient_auth.module.js.map