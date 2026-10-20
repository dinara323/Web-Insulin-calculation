import { ServicesService } from '../api/services/sensitivity_coefficient_services.service';
export declare class InsulinService {
    private readonly api;
    constructor(api: ServicesService);
    private view;
    getPublishedServices(): Promise<{
        sensitivity_coefficient: any;
        moreText: any;
    }[]>;
    getDraft(): Promise<{
        sensitivity_coefficient: any;
        moreText: any;
    }>;
    getById(id: number): Promise<{
        sensitivity_coefficient: any;
        moreText: any;
    }>;
    getNext(id: number): Promise<{
        sensitivity_coefficient: any;
        moreText: any;
    }>;
    filterByAge(ageFrom?: number, ageTo?: number): Promise<{
        sensitivity_coefficient: any;
        moreText: any;
    }[]>;
    addLike(id: number): Promise<void>;
    getLikesCount(service: Record<string, any>): any;
    calculateXE(age: number, weight: number): number;
    calculateDose(xe: number, sensitivity_coefficient: number): number;
}
