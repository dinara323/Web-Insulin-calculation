export declare class CreateServiceDto {
    name: string;
    description: string;
    age?: number;
    weight?: number;
    sensitivityCoefficient?: number;
}
declare const PublishServiceDto_base: import("@nestjs/common").Type<Partial<CreateServiceDto>>;
export declare class PublishServiceDto extends PublishServiceDto_base {
}
export {};
