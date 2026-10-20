"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const cookieParser = require("cookie-parser");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const core_1 = require("@nestjs/core");
const path_1 = require("path");
const sensitivity_coefficient_app_module_1 = require("./sensitivity_coefficient_app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(sensitivity_coefficient_app_module_1.AppModule);
    app.use(cookieParser());
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true, whitelist: true }));
    app.enableCors({
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Чувствительность к инсулину — ЛР4')
        .setDescription('Выполните register и auth. Браузер автоматически отправляет HttpOnly cookie sessionId. Для Postman скопируйте cookie из Application. Чтение доступно гостю; запись — создателю.')
        .setVersion('4.0')
        .addCookieAuth('sessionId')
        .build();
    swagger_1.SwaggerModule.setup('api', app, swagger_1.SwaggerModule.createDocument(app, config), {
        swaggerOptions: { withCredentials: true, persistAuthorization: true },
    });
    app.enableShutdownHooks();
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