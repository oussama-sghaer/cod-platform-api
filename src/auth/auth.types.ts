export type StoreMemberRole = 'OWNER' | 'MANAGER' | 'ASSISTANT' | 'VIEWER';

export interface AuthContext {
  userId: string;
  storeId: string;
  role: StoreMemberRole;
}
