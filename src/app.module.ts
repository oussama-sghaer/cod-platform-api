import { Module } from "@nestjs/common"
import { PrismaModule } from "./prisma/prisma.module"
import { AuthModule } from "./auth/auth.module"
import { HealthModule } from "./health/health.module"
import { MeModule } from "./me/me.module"

@Module({
  imports: [PrismaModule, AuthModule, HealthModule, MeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
