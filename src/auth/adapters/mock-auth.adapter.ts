import { Injectable } from "@nestjs/common"
import { AuthPort } from "../auth.port"
import { AuthContext } from "../auth.types"

@Injectable()
export class MockAuthAdapter implements AuthPort {
  async resolveContext(headers: Record<string, string>): Promise<AuthContext | null> {
    const storeId = headers["x-mock-store-id"]
    if (!storeId) return null
    const userId = process.env.MOCK_USER_ID
    if (!userId) throw new Error("MOCK_USER_ID environment variable is required for MockAuthAdapter")
    return { userId, storeId, role: "OWNER" }
  }
}
