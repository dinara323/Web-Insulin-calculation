export declare class InsulinUser {
    id: number;
    name: string;
    passwordHash: string | null;
}
export declare class InsulinCalculation {
    id: number;
    name: string;
    description: string;
    status: string;
    imageUrl: string | null;
    videoUrl: string | null;
    age: number | null;
    weight: number | null;
    sensitivityCoefficient: number | null;
    createdAt: Date;
    creatorId: number;
    formedAt: Date | null;
    creator: InsulinUser;
}
export declare class InsulinLike {
    userId: number;
    serviceId: number;
    user: InsulinUser;
    calculation: InsulinCalculation;
}
