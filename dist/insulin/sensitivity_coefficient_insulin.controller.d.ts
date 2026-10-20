import { Response } from 'express';
import { InsulinService } from './sensitivity_coefficient_insulin.service';
export declare class InsulinController {
    private readonly insulinService;
    constructor(insulinService: InsulinService);
    getAuth(res: Response): void;
    getFeed(id: string | undefined, next: string | undefined, like: string | undefined, res: Response): Promise<void>;
    getAdd(res: Response): Promise<void>;
    getTile(ageRange: string | undefined, res: Response): Promise<void>;
}
