import { InsulinService as InsulinServiceType } from './insulin.types';
export declare class InsulinService {
    private readonly services;
    getPublishedServices(): InsulinServiceType[];
    getDraft(): InsulinServiceType | undefined;
    getById(id: number): InsulinServiceType | undefined;
    getNext(id: number): InsulinServiceType | undefined;
    filterByAge(ageFrom?: number, ageTo?: number): InsulinServiceType[];
    calculateXE(age: number, weight: number): number;
    calculateDose(xe: number, sensitivity_coefficient: number): number;
    getLikesCount(service: InsulinServiceType): number;
    addLike(id: number): InsulinServiceType | undefined;
}
