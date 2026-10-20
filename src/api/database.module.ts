import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MinioService } from '../storage/minio.service';

@Global()
@Module({
  providers: [DatabaseService, MinioService],
  exports: [DatabaseService, MinioService],
})
export class DatabaseModule {}