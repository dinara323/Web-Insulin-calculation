import { Global, Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { SessionService } from './sensitivity_coefficient_session.service';
import { SessionGuard } from './sensitivity_coefficient_session.guard';
import { userContext } from '../common/sensitivity_coefficient_current-user';
@Global()
@Module({
  providers: [SessionService, SessionGuard],
  exports: [SessionService, SessionGuard],
})
export class AuthModule implements NestModule {
  constructor(private readonly sessions: SessionService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(async (req, res, next) => {
        try {
          const user = await this.sessions.get(req.cookies?.sessionId);
          userContext.run({ user }, () => next());
        } catch (error) {
          next(error);
        }
      })
      .forRoutes('*');
  }
}
