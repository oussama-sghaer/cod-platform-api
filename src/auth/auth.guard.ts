import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import * as AuthPortModule from "./auth.port"
import { AUTH_PORT } from "./auth.token"
import { IS_PUBLIC_KEY } from "./decorators/public.decorator"

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(AUTH_PORT) private readonly authPort: AuthPortModule.AuthPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true

    const req = context.switchToHttp().getRequest()
    const authContext = await this.authPort.resolveContext(req.headers ?? {})
    if (!authContext) throw new UnauthorizedException()

    req.authContext = authContext
    return true
  }
}
