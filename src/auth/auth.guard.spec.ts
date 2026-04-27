import { ExecutionContext, UnauthorizedException } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { AuthGuard } from "./auth.guard"
import { AuthPort } from "./auth.port"
import { AuthContext } from "./auth.types"
import { IS_PUBLIC_KEY } from "./decorators/public.decorator"

const mockExecutionContext = (headers: Record<string, string>): ExecutionContext => {
  const req: any = { headers, authContext: undefined }
  return {
    switchToHttp: () => ({ getRequest: () => req }),
    getHandler: () => ({}) as any,
    getClass: () => ({}) as any,
  } as ExecutionContext
}

describe("AuthGuard", () => {
  it("allows public routes without context", async () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue(true) } as unknown as Reflector
    const port: AuthPort = { resolveContext: jest.fn() }
    const guard = new AuthGuard(reflector, port)

    const ctx = mockExecutionContext({})
    await expect(guard.canActivate(ctx)).resolves.toBe(true)
    expect(port.resolveContext).not.toHaveBeenCalled()
  })

  it("attaches context and allows when adapter returns context", async () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue(false) } as unknown as Reflector
    const ctxData: AuthContext = { userId: "u", storeId: "s", role: "OWNER" }
    const port: AuthPort = { resolveContext: jest.fn().mockResolvedValue(ctxData) }
    const guard = new AuthGuard(reflector, port)

    const execCtx = mockExecutionContext({ "x-mock-store-id": "s" })
    await expect(guard.canActivate(execCtx)).resolves.toBe(true)
    expect(execCtx.switchToHttp().getRequest().authContext).toEqual(ctxData)
  })

  it("throws Unauthorized when adapter returns null on protected route", async () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue(false) } as unknown as Reflector
    const port: AuthPort = { resolveContext: jest.fn().mockResolvedValue(null) }
    const guard = new AuthGuard(reflector, port)

    const ctx = mockExecutionContext({})
    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException)
  })
})
