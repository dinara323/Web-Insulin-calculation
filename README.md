# Расчёт инсулина — лабораторные №2 и №3

NestJS, TypeScript, PostgreSQL, TypeORM, Handlebars и MinIO.
API и страницы используют одну базу данных. HTTP-методы и URL исходного проекта сохранены.
Расчёт дозы — учебный пример из исходной лабораторной.

## Запуск

В WSL используйте Linux Node.js (`nvm use 20`), затем `npm install`.
Настройте локальный `.env`: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`,
`DB_DATABASE`; для MinIO — `MINIO_ENDPOINT`, `MINIO_PORT`, `MINIO_USE_SSL`,
`MINIO_ROOT_USER`, `MINIO_ROOT_PASSWORD`, `MINIO_BUCKET`, `MINIO_PUBLIC_URL`.
Секреты в репозиторий не добавляются.

Запустите PostgreSQL с существующими таблицами и MinIO (`docker compose up -d`).
В текущем compose описан только MinIO: PostgreSQL запускается отдельно.
Автоматическое изменение схемы отключено (`synchronize: false`), существующие данные сохраняются.
Пользователь с ID 1 должен существовать: `getCurrentUser()` — фиксированная заглушка лабораторной.
Для просмотра медиа bucket должен допускать чтение или ссылки должны обслуживаться отдельно;
приложение не меняет политику доступа к bucket автоматически.

```sh
npm run build
npm run start:dev
```

Страницы: `/insulin/feed`, `/insulin/add`, `/insulin/tile`.
Форма `/insulin/add` отображает текущий черновик; создание и публикация выполняются через API.

## HTTP API

| Метод | URL | Назначение |
|---|---|---|
| GET | `/api/services` | Опубликованные расчёты; фильтры `name`, `ageFrom`, `ageTo` |
| GET | `/api/services/feed` | Первая карточка; `id` — конкретная; `id=…&next=true` — следующая с циклическим переходом |
| GET | `/api/services/draft` | Черновик текущего пользователя или пустое значение |
| POST | `/api/services` | Создать черновик; `multipart/form-data`: `name`, `description`, `age`, `weight`, `sensitivityCoefficient`, файлы `image`, `video` |
| PUT | `/api/services/:id/publish` | Опубликовать собственный черновик |
| DELETE | `/api/services/:id` | Логически удалить собственную запись |
| POST | `/api/services/:id/like` | JSON `{"value":1}` — лайк, `{"value":0}` — отмена |
| POST | `/api/users/register` | JSON `{"name":"Имя"}` |
| POST | `/api/users/auth` | Заглушка входа, возвращает пользователя 1 |
| POST | `/api/users/logout` | Заглушка выхода |

Создание возвращает 201, GET/PUT/DELETE — 200; ошибки ввода — 400, отсутствующая запись — 404.
`status`, `creatorId`, `createdAt`, `formedAt` задаются сервером.
Поля `isCreator` и `isLiked` в карточках возвращаются как 0/1.
У пользователя может быть один черновик: проверка защищена блокировкой строки пользователя в транзакции.
Числовые поля соответствуют существующим целочисленным столбцам БД.

## Таблицы

| Таблица | Поля |
|---|---|
| `insulin_users` | `id` integer PK, `name` varchar(100) |
| `insulin_services` | `id` integer PK, `name` varchar(200), `description` varchar(500), `status` varchar(20), `image_url`/`video_url` varchar(500) nullable, `age`/`weight`/`sensitivity_coefficient` integer nullable, `created_at` timestamp, `creator` integer, `formed_at` timestamp nullable |
| `insulin_likes` | `user_id`, `service_id` integer, составной PK |

Связи описаны в TypeORM: создатель → пользователь, лайк → пользователь и расчёт.
В существующей локальной БД внешние ключи отсутствуют; приложение не меняет схему автоматически.

## Postman

Локальная JSON-коллекция находится в `postman/`, все 10 исходных запросов сохранены.
`baseUrl=http://localhost:3000`; список сохраняет `publishedServiceId`, создание — `serviceId`.
Для файлов включите поля `image`, `video` в Body → form-data и выберите локальные файлы.
Коэффициент передаётся под именем `sensitivityCoefficient`.
Сценарий: список → лента → черновик → создание → публикация → список → лайк → отмена лайка.
Удаление выполняйте только для собственной тестовой записи.
Для перехода ленты используйте `/api/services/feed?id={{publishedServiceId}}&next=true`.
JSON-коллекция на диске и открытый workspace Postman сохраняются отдельно.

## Проверка

`npm run build` — сборка. `npm run test:e2e -- --runInBand` — 7 проверок с PostgreSQL:
валидация, один черновик, публикация/фильтр/страницы, следующая карточка и цикл,
идемпотентный лайк, логическое удаление, регистрация/заглушки входа и выхода.
Тестовые записи создаются внутри одной транзакции и откатываются в конце;
счётчики sequence могут увеличиваться. Загрузка MinIO в тестах подменена: реальный upload ими не проверяется.

## Имена файлов

Исходники, тесты, шаблоны, стили и файл коллекции Postman переименованы с префиксом
`sensitivity_coefficient_`. Это рабочие файлы с реализацией, без файлов-переадресаций.
Импорты, ссылки на шаблоны и стили, точка запуска Nest и настройки тестов обновлены.
Служебные имена package.json, package-lock.json, README.md, конфигурации Nest,
TypeScript, Jest, Docker и .env оставлены стандартными.
