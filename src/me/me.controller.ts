import { Controller, Get } from '@nestjs/common';
import { CurrentContext } from '../auth/decorators/current-context.decorator';
import { AuthContext } from '../auth/auth.types';

@Controller('me')
export class MeController {
  @Get()
  me(@CurrentContext() ctx: AuthContext) {
    return ctx;
  }
}
