import { Response } from 'express';
import { InsulinService } from './insulin.service';
export declare class InsulinController {
    private readonly insulinService;
    constructor(insulinService: InsulinService);
    getFeed(id: string | undefined, next: string | undefined, like: string | undefined, res: Response): void;
    getAdd(res: Response): void;
    getTile(isf: string | undefined, res: Response): void;
}
