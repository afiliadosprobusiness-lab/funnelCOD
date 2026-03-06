import { PlanType } from "@/lib/plans";

export type AuthProvider = "password" | "google";
export type UserStatus = "active" | "inactive";
export type UserRole = "user" | "superadmin";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  provider: AuthProvider;
  role: UserRole;
  plan: PlanType;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  userId: string;
}

export interface GoogleProfile {
  email: string;
  name: string;
  picture?: string;
}

export interface AuthActionResult {
  ok: boolean;
  user?: AppUser;
  error?: string;
}
