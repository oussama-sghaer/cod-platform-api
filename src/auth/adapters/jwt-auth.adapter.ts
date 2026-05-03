import { Injectable } from '@nestjs/common';
import { AuthPort } from '../auth.port';
import { AuthContext } from '../auth.types';

@Injectable()
export class JwtAuthAdapter implements AuthPort {
  resolveContext(
    _headers: Record<string, string>,
  ): Promise<AuthContext | null> {
    return Promise.reject(
      new Error('JwtAuthAdapter not implemented — Increment 8'),
    );
  }
}
