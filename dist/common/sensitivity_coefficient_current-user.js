"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userContext = void 0;
exports.optionalCurrentUser = optionalCurrentUser;
exports.getCurrentUser = getCurrentUser;
const async_hooks_1 = require("async_hooks");
const common_1 = require("@nestjs/common");
exports.userContext = new async_hooks_1.AsyncLocalStorage();
function optionalCurrentUser() {
    return exports.userContext.getStore()?.user;
}
function getCurrentUser() {
    const user = optionalCurrentUser();
    if (!user)
        throw new common_1.UnauthorizedException('Необходим вход в систему');
    return user;
}
//# sourceMappingURL=sensitivity_coefficient_current-user.js.map