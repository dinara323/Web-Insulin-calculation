import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { ServiceFilterDto } from './dto/service-filter.dto';
import { UploadedFile } from '../../common/uploaded-file';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    getServices(filter: ServiceFilterDto): Promise<Record<string, any>[]>;
    getFeed(id?: string, next?: string): Promise<Record<string, any>>;
    getDraft(): Promise<Record<string, any> | null>;
    create(dto: CreateServiceDto, files: {
        image?: UploadedFile[];
        video?: UploadedFile[];
    }): Promise<Record<string, any>>;
    publish(id: string): Promise<Record<string, any>>;
    delete(id: string): Promise<Record<string, any>>;
    setLike(id: string, value: number): Promise<{
        serviceId: number;
        liked: boolean;
    }>;
}
