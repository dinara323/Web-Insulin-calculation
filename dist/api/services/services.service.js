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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database.service");
const minio_service_1 = require("../../storage/minio.service");
const current_user_1 = require("../../common/current-user");
let ServicesService = class ServicesService {
    constructor(database, minio) {
        this.database = database;
        this.minio = minio;
    }
    async getServices(filter) {
        const values = [];
        const conditions = [`s.status = 'опубликован'`];
        if (filter.name) {
            values.push(`%${filter.name}%`);
            conditions.push(`s.name ILIKE $${values.length}`);
        }
        if (filter.ageFrom !== undefined) {
            values.push(Number(filter.ageFrom));
            conditions.push(`s.age >= $${values.length}`);
        }
        if (filter.ageTo !== undefined) {
            values.push(Number(filter.ageTo));
            conditions.push(`s.age <= $${values.length}`);
        }
        const currentUser = (0, current_user_1.getCurrentUser)();
        values.push(currentUser.id);
        const result = await this.database.query(`
        SELECT
          s.id,
          s.name,
          s.description,
          s.status,
          s.image_url AS "imageUrl",
          s.video_url AS "videoUrl",
          s.age,
          s.weight,
          s.sensitivity_coefficient AS "sensitivityCoefficient",
          s.created_at AS "createdAt",
          s.creator AS "creatorId",
          s.formed_at AS "formedAt",
          (s.creator = $${values.length}) AS "isCreator"
        FROM insulin_services s
        WHERE ${conditions.join(' AND ')}
        ORDER BY s.id DESC
      `, values);
        return result.rows;
    }
    async getFeed(id, next) {
        const currentUser = (0, current_user_1.getCurrentUser)();
        if (id !== undefined) {
            const result = await this.database.query(`
          SELECT
            s.id,
            s.name,
            s.description,
            s.image_url AS "imageUrl",
            s.video_url AS "videoUrl",
            s.age,
            s.weight,
            s.sensitivity_coefficient AS "sensitivityCoefficient",
            s.created_at AS "createdAt",
            s.formed_at AS "formedAt",
            (s.creator = $2) AS "isCreator",
            EXISTS (
              SELECT 1
              FROM insulin_likes l
              WHERE l.service_id = s.id
                AND l.user_id = $2
            ) AS "isLiked",
            (
              SELECT COUNT(*)::int
              FROM insulin_likes l
              WHERE l.service_id = s.id
            ) AS "likesCount"
          FROM insulin_services s
          WHERE s.status = 'опубликован'
            AND s.id = $1
        `, [this.parseId(id), currentUser.id]);
            if (!result.rows[0]) {
                throw new common_1.NotFoundException('Опубликованная услуга не найдена');
            }
            return result.rows[0];
        }
        const order = next === 'true' ? 'ASC' : 'DESC';
        const result = await this.database.query(`
        SELECT
          s.id,
          s.name,
          s.description,
          s.image_url AS "imageUrl",
          s.video_url AS "videoUrl",
          s.age,
          s.weight,
          s.sensitivity_coefficient AS "sensitivityCoefficient",
          s.created_at AS "createdAt",
          s.formed_at AS "formedAt",
          (s.creator = $1) AS "isCreator",
          EXISTS (
            SELECT 1
            FROM insulin_likes l
            WHERE l.service_id = s.id
              AND l.user_id = $1
          ) AS "isLiked",
          (
            SELECT COUNT(*)::int
            FROM insulin_likes l
            WHERE l.service_id = s.id
          ) AS "likesCount"
        FROM insulin_services s
        WHERE s.status = 'опубликован'
        ORDER BY s.id ${order}
        LIMIT 1
      `, [currentUser.id]);
        if (!result.rows[0]) {
            throw new common_1.NotFoundException('Опубликованных услуг нет');
        }
        return result.rows[0];
    }
    async getDraft() {
        const currentUser = (0, current_user_1.getCurrentUser)();
        const result = await this.database.query(`
        SELECT
          s.id,
          s.name,
          s.description,
          s.status,
          s.image_url AS "imageUrl",
          s.video_url AS "videoUrl",
          s.age,
          s.weight,
          s.sensitivity_coefficient AS "sensitivityCoefficient",
          s.created_at AS "createdAt",
          s.creator AS "creatorId"
        FROM insulin_services s
        WHERE s.status = 'черновик'
          AND s.creator = $1
        ORDER BY s.id DESC
        LIMIT 1
      `, [currentUser.id]);
        return result.rows[0] ?? null;
    }
    async create(dto, image, video) {
        const currentUser = (0, current_user_1.getCurrentUser)();
        const existingDraft = await this.database.query(`
          SELECT id
          FROM insulin_services
          WHERE status = 'черновик'
            AND creator = $1
          LIMIT 1
        `, [currentUser.id]);
        if (existingDraft.rows.length > 0) {
            throw new common_1.BadRequestException('Сначала опубликуйте или удалите существующий черновик');
        }
        if (!dto.name || !dto.description) {
            throw new common_1.BadRequestException('Название и описание обязательны');
        }
        if (image && !image.mimetype.startsWith('image/')) {
            throw new common_1.BadRequestException('Первый файл должен быть изображением');
        }
        if (video && !video.mimetype.startsWith('video/')) {
            throw new common_1.BadRequestException('Второй файл должен быть видео');
        }
        const imageUrl = image
            ? await this.minio.upload(image)
            : null;
        const videoUrl = video
            ? await this.minio.upload(video)
            : null;
        const result = await this.database.query(`
        INSERT INTO insulin_services (
          name,
          description,
          status,
          image_url,
          video_url,
          age,
          weight,
          sensitivity_coefficient,
          created_at,
          creator
        )
        VALUES (
          $1, $2, 'черновик', $3, $4, $5, $6, $7, NOW(), $8
        )
        RETURNING
          id,
          name,
          description,
          status,
          image_url AS "imageUrl",
          video_url AS "videoUrl",
          age,
          weight,
          sensitivity_coefficient AS "sensitivityCoefficient",
          created_at AS "createdAt",
          creator AS "creatorId"
      `, [
            dto.name,
            dto.description,
            imageUrl,
            videoUrl,
            this.optionalNumber(dto.age),
            this.optionalNumber(dto.weight),
            this.optionalNumber(dto.sensitivityCoefficient),
            currentUser.id,
        ]);
        return result.rows[0];
    }
    async publish(id) {
        const currentUser = (0, current_user_1.getCurrentUser)();
        const result = await this.database.query(`
        UPDATE insulin_services
        SET
          status = 'опубликован',
          formed_at = NOW()
        WHERE id = $1
          AND creator = $2
          AND status = 'черновик'
        RETURNING
          id,
          name,
          description,
          status,
          formed_at AS "formedAt"
      `, [this.parseId(id), currentUser.id]);
        if (!result.rows[0]) {
            throw new common_1.NotFoundException('Черновик не найден или его нельзя опубликовать');
        }
        return result.rows[0];
    }
    async delete(id) {
        const currentUser = (0, current_user_1.getCurrentUser)();
        const result = await this.database.query(`
        UPDATE insulin_services
        SET status = 'удален'
        WHERE id = $1
          AND creator = $2
          AND status <> 'удален'
        RETURNING id, name, status
      `, [this.parseId(id), currentUser.id]);
        if (!result.rows[0]) {
            throw new common_1.NotFoundException('Услуга не найдена или не принадлежит текущему пользователю');
        }
        return result.rows[0];
    }
    async setLike(id, value) {
        const serviceId = this.parseId(id);
        const currentUser = (0, current_user_1.getCurrentUser)();
        if (value !== 0 && value !== 1) {
            throw new common_1.BadRequestException('Значение value должно быть 0 или 1');
        }
        const service = await this.database.query(`
        SELECT id
        FROM insulin_services
        WHERE id = $1
          AND status = 'опубликован'
      `, [serviceId]);
        if (!service.rows[0]) {
            throw new common_1.NotFoundException('Опубликованная услуга не найдена');
        }
        if (value === 1) {
            await this.database.query(`
          INSERT INTO insulin_likes (user_id, service_id)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
        `, [currentUser.id, serviceId]);
        }
        else {
            await this.database.query(`
          DELETE FROM insulin_likes
          WHERE user_id = $1
            AND service_id = $2
        `, [currentUser.id, serviceId]);
        }
        return {
            serviceId,
            liked: value === 1,
        };
    }
    parseId(id) {
        const parsed = Number(id);
        if (!Number.isInteger(parsed) || parsed <= 0) {
            throw new common_1.BadRequestException('ID должен быть положительным целым числом');
        }
        return parsed;
    }
    optionalNumber(value) {
        if (value === undefined ||
            value === null ||
            value === '') {
            return null;
        }
        const parsed = Number(value);
        if (!Number.isFinite(parsed)) {
            throw new common_1.BadRequestException('Числовое поле заполнено неверно');
        }
        return parsed;
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        minio_service_1.MinioService])
], ServicesService);
//# sourceMappingURL=services.service.js.map