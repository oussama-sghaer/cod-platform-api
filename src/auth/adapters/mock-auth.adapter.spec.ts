import { MockAuthAdapter } from "./mock-auth.adapter"

describe("MockAuthAdapter", () => {
  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    originalEnv = { ...process.env }
    process.env.MOCK_USER_ID = "00000000-0000-0000-0000-000000000002"
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it("returns OWNER context when x-mock-store-id header is present", async () => {
    const adapter = new MockAuthAdapter()
    const ctx = await adapter.resolveContext({
      "x-mock-store-id": "00000000-0000-0000-0000-000000000001",
    })

    expect(ctx).toEqual({
      userId: "00000000-0000-0000-0000-000000000002",
      storeId: "00000000-0000-0000-0000-000000000001",
      role: "OWNER",
    })
  })

  it("returns null when header is absent", async () => {
    const adapter = new MockAuthAdapter()
    const ctx = await adapter.resolveContext({})
    expect(ctx).toBeNull()
  })
})
