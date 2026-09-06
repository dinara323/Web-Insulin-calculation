import { InsulinService } from './insulin.service';
export declare class InsulinController {
    private readonly insulinService;
    constructor(insulinService: InsulinService);
    getFeed(id?: string, next?: string): {
        service: any;
        likesCount: number;
    };
    getAdd(): {
        service: import("./insulin.types").InsulinService;
        likesCount: number;
    };
    getTile(isf?: string): {
        services: import("./insulin.types").InsulinService[];
        isf: string;
    };
}
