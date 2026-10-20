"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const path_1 = require("path");
const sensitivity_coefficient_app_module_1 = require("./sensitivity_coefficient_app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(sensitivity_coefficient_app_module_1.AppModule);
    app.setBaseViewsDir((0, path_1.join)(__dirname, '..', 'views'));
    app.setViewEngine('hbs');
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'));
    app.use((req, res, next) => {
        if (req.path === '/') {
            return res.redirect('/insulin/feed');
        }
        next();
    });
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=sensitivity_coefficient_main.js.map