import {
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { Client } from 'minio';
import { randomUUID } from 'crypto';
import { UploadedFile } from '../common/sensitivity_coefficient_uploaded-file';
@Injectable()
export class MinioService implements OnModuleInit {
  private readonly client: Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor() {
    const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
    const port = Number(process.env.MINIO_PORT || 9000);
    const useSSL = process.env.MINIO_USE_SSL === 'true';

    this.bucket = process.env.MINIO_BUCKET || 'insulin-media';
    this.publicUrl =
      process.env.MINIO_PUBLIC_URL || 'http://localhost:9000';

    this.client = new Client({
      endPoint: endpoint,
      port,
      useSSL,
      accessKey: process.env.MINIO_ROOT_USER || 'root',
      secretKey:
        process.env.MINIO_ROOT_PASSWORD || 'rootpassword',
    });
  }

  async onModuleInit(): Promise<void> {
    const exists = await this.client.bucketExists(this.bucket);

    if (!exists) {
      await this.client.makeBucket(this.bucket);
    }
  }

async upload(file: UploadedFile): Promise<string> {    const extension = file.originalname.includes('.')
      ? file.originalname.split('.').pop()
      : undefined;

    const objectName = extension
      ? `${randomUUID()}.${extension}`
      : randomUUID();

    await this.client.putObject(
      this.bucket,
      objectName,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype,
      },
    );

    return `${this.publicUrl}/${this.bucket}/${objectName}`;
  }
}