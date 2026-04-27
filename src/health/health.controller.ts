import { Controller, Get } from "@nestjs/common"
import { Public } from "../auth/decorators/public.decorator"

@Controller("health")
export class HealthController {
  @Public()
  @Get()
  health() {
    return {
      status: "ok",
      service: "cod-platform-api",
      version: process.env.npm_package_version ?? "0.0.0",
      timestamp: new Date().toISOString(),
    }
  }
}
