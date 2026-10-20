import { Injectable, CanActivate } from '@nestjs/common';
import { getCurrentUser } from '../common/sensitivity_coefficient_current-user';
@Injectable()
export class SessionGuard implements CanActivate {
  canActivate() {
    getCurrentUser();
    return true;
  }
}
