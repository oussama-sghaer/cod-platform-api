import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { AuthPort } from './auth.port';
import { AuthContext } from './auth.types';

type MockRequest = {
  headers: Record<string, string>;
  authContext?: AuthContext;
};

const mockExecutionContext = (
  headers: Record<string, string>,
): ExecutionContext => {
  const req: MockRequest = { headers, authContext: undefined };
  return {
    switchToHttp: () => ({
      getRequest: <T = MockRequest>() => req as unknown as T,
    }),
    getHandler: () => ({}) as unknown as () => void,
    getClass: () => ({}) as unknown as new (...args: unknown[]) => unknown,
  } as unknown as ExecutionContext;
};

describe('AuthGuard', () => {
  it('allows public routes without context', async () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(true),
    } as unknown as Reflector;
    const resolveContext = jest.fn();
    const port: AuthPort = { resolveContext };
    const guard = new AuthGuard(reflector, port);

    const ctx = mockExecutionContext({});
    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    expect(resolveContext).not.toHaveBeenCalled();
  });

  it('attaches context and allows when adapter returns context', async () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(false),
    } as unknown as Reflector;
    const ctxData: AuthContext = { userId: 'u', storeId: 's', role: 'OWNER' };
    const resolveContext = jest.fn().mockResolvedValue(ctxData);
    const port: AuthPort = { resolveContext };
    const guard = new AuthGuard(reflector, port);

    const execCtx = mockExecutionContext({ 'x-mock-store-id': 's' });
    await expect(guard.canActivate(execCtx)).resolves.toBe(true);
    expect(
      execCtx.switchToHttp().getRequest<MockRequest>().authContext,
    ).toEqual(ctxData);
  });

  it('throws Unauthorized when adapter returns null on protected route', async () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(false),
    } as unknown as Reflector;
    const port: AuthPort = {
      resolveContext: jest.fn().mockResolvedValue(null),
    };
    const guard = new AuthGuard(reflector, port);

    const ctx = mockExecutionContext({});
    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
  });
});
