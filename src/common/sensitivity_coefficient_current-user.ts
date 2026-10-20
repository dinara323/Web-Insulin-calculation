import { AsyncLocalStorage } from 'async_hooks';
import { UnauthorizedException } from '@nestjs/common';
export interface CurrentUser {
  id: number;
  name: string;
}
export const userContext = new AsyncLocalStorage<{ user?: CurrentUser }>();
export function optionalCurrentUser(): CurrentUser | undefined {
  return userContext.getStore()?.user;
}
export function getCurrentUser(): CurrentUser {
  const user = optionalCurrentUser();
  if (!user) throw new UnauthorizedException('Необходим вход в систему');
  return user;
}
