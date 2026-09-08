import { InsulinService as InsulinServiceType } from './insulin.types';
export declare class InsulinService {
    private readonly services;
    getPublishedServices(): InsulinServiceType[];
    getDraft(): InsulinServiceType | undefined;
    getById(id: number): InsulinServiceType | undefined;
    getNext(id: number): InsulinServiceType | undefined;
    filterByIsf(isf?: number): InsulinServiceType[];
    getLikesCount(service: InsulinServiceType): number;
    addLike(id: number): InsulinServiceType | undefined;
}
