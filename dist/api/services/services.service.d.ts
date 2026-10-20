import { DatabaseService } from '../database.service';
import { MinioService } from '../../storage/minio.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { ServiceFilterDto } from './dto/service-filter.dto';
import { UploadedFile } from '../../common/uploaded-file';
type ServiceRow = Record<string, any>;
export declare class ServicesService {
    private readonly database;
    private readonly minio;
    constructor(database: DatabaseService, minio: MinioService);
    getServices(filter: ServiceFilterDto): Promise<ServiceRow[]>;
    getFeed(id?: string, next?: string): Promise<ServiceRow>;
    getDraft(): Promise<ServiceRow | null>;
    create(dto: CreateServiceDto, image?: UploadedFile, video?: UploadedFile): Promise<ServiceRow>;
    publish(id: string): Promise<ServiceRow>;
    delete(id: string): Promise<ServiceRow>;
    setLike(id: string, value: number): Promise<{
        serviceId: number;
        liked: boolean;
    }>;
    private parseId;
    private optionalNumber;
}
export {};
