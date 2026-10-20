import { OnModuleInit } from '@nestjs/common';
import { UploadedFile } from '../common/sensitivity_coefficient_uploaded-file';
export declare class MinioService implements OnModuleInit {
    private readonly client;
    private readonly bucket;
    private readonly publicUrl;
    constructor();
    onModuleInit(): Promise<void>;
    upload(file: UploadedFile): Promise<string>;
}
