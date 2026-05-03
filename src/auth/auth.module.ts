import { Module } from "@nestjs/common"
import { APP_GUARD } from "@nestjs/core"
import { AUTH_PORT } from "./auth.token"
import { MockAuthAdapter } from "./adapters/mock-auth.adapter"
import { JwtAuthAdapter } from "./adapters/jwt-auth.adapter"
import { AuthGuard } from "./auth.guard"

@Module({
  providers: [
    MockAuthAdapter,
    JwtAuthAdapter,
    {
      provide: AUTH_PORT,
      useFactory: (mock: MockAuthAdapter, jwt: JwtAuthAdapter) =>
        process.env.AUTH_ADAPTER === "jwt" ? jwt : mock,
      inject: [MockAuthAdapter, JwtAuthAdapter],
    },
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
  exports: [AUTH_PORT],
})
export class AuthModule {}
