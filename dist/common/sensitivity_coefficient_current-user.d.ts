import { AsyncLocalStorage } from 'async_hooks';
export interface CurrentUser {
    id: number;
    name: string;
}
export declare const userContext: AsyncLocalStorage<{
    user?: CurrentUser;
}>;
export declare function optionalCurrentUser(): CurrentUser | undefined;
export declare function getCurrentUser(): CurrentUser;
