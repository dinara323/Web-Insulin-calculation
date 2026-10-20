import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './sensitivity_coefficient_database.service';
import { MinioService } from '../storage/sensitivity_coefficient_minio.service';

@Global()
@Module({
  providers: [DatabaseService, MinioService],
  exports: [DatabaseService, MinioService],
})
export class DatabaseModule {}