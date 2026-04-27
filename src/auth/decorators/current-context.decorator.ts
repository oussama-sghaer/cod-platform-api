import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { AuthContext } from "../auth.types"

export const CurrentContext = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthContext => {
    const req = ctx.switchToHttp().getRequest()
    return req.authContext
  },
)
