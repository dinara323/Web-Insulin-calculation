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
exports.MinioService = void 0;
const common_1 = require("@nestjs/common");
const minio_1 = require("minio");
const crypto_1 = require("crypto");
let MinioService = class MinioService {
    constructor() {
        const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
        const port = Number(process.env.MINIO_PORT || 9000);
        const useSSL = process.env.MINIO_USE_SSL === 'true';
        this.bucket = process.env.MINIO_BUCKET || 'insulin-media';
        this.publicUrl =
            process.env.MINIO_PUBLIC_URL || 'http://localhost:9000';
        this.client = new minio_1.Client({
            endPoint: endpoint,
            port,
            useSSL,
            accessKey: process.env.MINIO_ROOT_USER || 'root',
            secretKey: process.env.MINIO_ROOT_PASSWORD || 'rootpassword',
        });
    }
    async onModuleInit() {
        const exists = await this.client.bucketExists(this.bucket);
        if (!exists) {
            await this.client.makeBucket(this.bucket);
        }
    }
    async upload(file) {
        const extension = file.originalname.includes('.')
            ? file.originalname.split('.').pop()
            : undefined;
        const objectName = extension
            ? `${(0, crypto_1.randomUUID)()}.${extension}`
            : (0, crypto_1.randomUUID)();
        await this.client.putObject(this.bucket, objectName, file.buffer, file.size, {
            'Content-Type': file.mimetype,
        });
        return `${this.publicUrl}/${this.bucket}/${objectName}`;
    }
};
exports.MinioService = MinioService;
exports.MinioService = MinioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MinioService);
//# sourceMappingURL=minio.service.js.map