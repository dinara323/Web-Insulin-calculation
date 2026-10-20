# Лабораторная 4 — cookies

Используются NestJS 10, TypeORM/PostgreSQL, Redis 7, cookie-parser и Swagger 7.
Регистрация: POST /api/users/register, вход: POST /api/users/auth (name, password).
Пароли хешируются bcrypt; существующие пользователи без хеша не могут войти.
Новый создатель регистрируется с уникальным именем. Роль модератора не нужна для основных требований: создатель управляет только своими карточками.

## Запуск

```sh
npm install
npm run redis:up
npm run db:lab4
npm run start:dev
```

Swagger: http://localhost:3000/api (либо порт из PORT).
Для текущей демонстрации запущен порт 3004: http://localhost:3004/api.
Redis URL задаётся REDIS_URL, по умолчанию redis://127.0.0.1:6379.
HttpOnly cookie sessionId действует 1 час, SameSite=Lax, Path=/.
COOKIE_SECURE=true включается при HTTPS. В локальном HTTP false.
В Redis session:<id> содержит JSON пользователя id и name, без пароля.

## Показ

1. Открыть Swagger в инкогнито, зарегистрироваться, выполнить auth.
2. Выполнить GET /api/services в Swagger, открыть Application → Cookies → sessionId.
3. В Postman передавать Cookie: sessionId=<значение из браузера>.
4. GET списка с cookie и без неё возвращает 200; фильтры name, ageFrom, ageTo необязательны.
5. POST /api/services: multipart/form-data, name, description, необязательные image и video; creator назначается из сессии.
6. GET /api/services/draft: черновик текущего создателя.
7. PUT /api/services/{id}/publish без сессии: 401; с сессией владельца: 200. JSON age=65, weight=80 даёт sensitivityCoefficient=5. Можно обновить name и description.
8. Чужой черновик не публикуется. Logout удаляет Redis-сессию и cookie; повторное использование старой cookie даёт 401.
9. В командной строке: docker exec insulin_redis redis-cli --scan --pattern 'session:*'; затем GET session:<id> и TTL session:<id>.

Формула: min(6,max(3,round(2.5+0.025*weight+(age>=60?0.5:0)))). Это согласованный учебный коэффициент.
Лента: GET /api/services/feed и GET /api/services/feed?id=<id>&next=true.
Лайк: POST /api/services/{id}/like, JSON {"value":1}; отмена {"value":0}.
DELETE /api/services/{id} выполняет логическое удаление своей записи.
