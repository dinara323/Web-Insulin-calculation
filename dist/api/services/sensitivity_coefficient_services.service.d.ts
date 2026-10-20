import { DatabaseService } from '../sensitivity_coefficient_database.service';
import { MinioService } from '../../storage/sensitivity_coefficient_minio.service';
import { CreateServiceDto } from './dto/sensitivity_coefficient_create-service.dto';
import { ServiceFilterDto } from './dto/sensitivity_coefficient_service-filter.dto';
import { UploadedFile } from '../../common/sensitivity_coefficient_uploaded-file';
export declare class ServicesService {
    private readonly database;
    private readonly minio;
    constructor(database: DatabaseService, minio: MinioService);
    private present;
    getServices(filter: ServiceFilterDto): Promise<Record<string, any>[]>;
    getFeed(id?: string, next?: string): Promise<Record<string, any>>;
    getDraft(): Promise<Record<string, any> | null>;
    create(dto: CreateServiceDto, image?: UploadedFile, video?: UploadedFile): Promise<Record<string, any>>;
    publish(id: string, dto?: Partial<CreateServiceDto>): Promise<Record<string, any>>;
    delete(id: string): Promise<Record<string, any>>;
    setLike(id: string, value: number): Promise<{
        serviceId: number;
        liked: boolean;
    }>;
    private parseId;
    private optionalNumber;
}
