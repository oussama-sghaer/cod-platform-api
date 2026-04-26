import { AuthContext } from "./auth.types"

export interface AuthPort {
  resolveContext(headers: Record<string, string>): Promise<AuthContext | null>
}
