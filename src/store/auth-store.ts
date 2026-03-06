import { v4 as uuid } from "uuid";
import { PlanType } from "@/lib/plans";
import { AppUser, AuthActionResult, AuthSession, GoogleProfile, UserStatus } from "@/types/auth";

const USERS_KEY = "cod_users";
const SESSION_KEY = "cod_session";
const AUTH_EVENT = "cod_auth_changed";

const SUPERADMIN_ID = "superadmin-root";
export const SUPERADMIN_EMAIL = "superadmin@funnelcod.local";
export const SUPERADMIN_DEFAULT_PASSWORD = "SuperAdmin#2026";

function encodePassword(password: string): string {
  const bytes = new TextEncoder().encode(password);
  const normalized = Array.from(bytes, (item) => String.fromCharCode(item)).join("");
  return btoa(normalized);
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function emitAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
}

function saveUsers(users: AppUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function saveSession(session: AuthSession | null) {
  if (!session) {
    localStorage.removeItem(SESSION_KEY);
    emitAuthChange();
    return;
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  emitAuthChange();
}

export function ensureAuthSeed() {
  const users = getUsers();
  const existing = users.find((user) => user.id === SUPERADMIN_ID || user.email.toLowerCase() === SUPERADMIN_EMAIL);
  if (existing) {
    const needsPatch = existing.role !== "superadmin" || existing.status !== "active";
    if (needsPatch) {
      const patchedUsers = users.map((user) =>
        user.id === existing.id
          ? {
              ...user,
              id: SUPERADMIN_ID,
              role: "superadmin",
              status: "active",
              plan: "master",
              provider: user.provider || "password",
              updatedAt: new Date().toISOString(),
            }
          : user,
      );
      saveUsers(patchedUsers);
    }
    return;
  }

  const now = new Date().toISOString();
  const superadmin: AppUser = {
    id: SUPERADMIN_ID,
    name: "Super Admin",
    email: SUPERADMIN_EMAIL,
    passwordHash: encodePassword(SUPERADMIN_DEFAULT_PASSWORD),
    provider: "password",
    role: "superadmin",
    plan: "master",
    status: "active",
    createdAt: now,
    updatedAt: now,
  };

  saveUsers([...users, superadmin]);
}

export function getUsers(): AppUser[] {
  return safeParse<AppUser[]>(localStorage.getItem(USERS_KEY), []);
}

function getSession(): AuthSession | null {
  return safeParse<AuthSession | null>(localStorage.getItem(SESSION_KEY), null);
}

export function getCurrentUser(): AppUser | null {
  ensureAuthSeed();
  const session = getSession();
  if (!session?.userId) return null;

  const current = getUsers().find((user) => user.id === session.userId) || null;
  if (!current) {
    saveSession(null);
    return null;
  }

  if (current.status !== "active") {
    saveSession(null);
    return null;
  }

  return current;
}

export function isSuperadmin(user: AppUser | null | undefined): boolean {
  return user?.role === "superadmin";
}

export function subscribeAuthState(listener: () => void): () => void {
  const wrappedStorageListener = () => listener();
  window.addEventListener(AUTH_EVENT, listener);
  window.addEventListener("storage", wrappedStorageListener);
  return () => {
    window.removeEventListener(AUTH_EVENT, listener);
    window.removeEventListener("storage", wrappedStorageListener);
  };
}

function upsertSessionForUser(user: AppUser): AuthActionResult {
  saveSession({ userId: user.id });
  return { ok: true, user };
}

export function logout() {
  saveSession(null);
}

function findUserByEmail(email: string): AppUser | undefined {
  const normalized = email.trim().toLowerCase();
  return getUsers().find((user) => user.email.toLowerCase() === normalized);
}

export function registerWithPassword(input: {
  name: string;
  email: string;
  password: string;
}): AuthActionResult {
  ensureAuthSeed();
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (name.length < 2) return { ok: false, error: "Name must be at least 2 characters." };
  if (!email.includes("@")) return { ok: false, error: "Please enter a valid email." };
  if (password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };
  if (findUserByEmail(email)) return { ok: false, error: "Email is already registered." };

  const now = new Date().toISOString();
  const user: AppUser = {
    id: uuid(),
    name,
    email,
    passwordHash: encodePassword(password),
    provider: "password",
    role: "user",
    plan: "free",
    status: "active",
    createdAt: now,
    updatedAt: now,
  };

  const users = getUsers();
  saveUsers([...users, user]);
  return upsertSessionForUser(user);
}

export function loginWithPassword(input: { email: string; password: string }): AuthActionResult {
  ensureAuthSeed();
  const user = findUserByEmail(input.email);
  if (!user) return { ok: false, error: "Invalid email or password." };
  if (user.provider !== "password") {
    return { ok: false, error: "This account uses Google login." };
  }
  if (user.status !== "active") return { ok: false, error: "Your account is inactive. Contact support." };
  if (user.passwordHash !== encodePassword(input.password)) {
    return { ok: false, error: "Invalid email or password." };
  }
  return upsertSessionForUser(user);
}

export function loginWithGoogle(profile: GoogleProfile): AuthActionResult {
  ensureAuthSeed();
  const email = profile.email.trim().toLowerCase();
  const existing = findUserByEmail(email);

  if (existing) {
    if (existing.status !== "active") {
      return { ok: false, error: "Your account is inactive. Contact support." };
    }
    return upsertSessionForUser(existing);
  }

  const now = new Date().toISOString();
  const user: AppUser = {
    id: uuid(),
    name: profile.name.trim() || email.split("@")[0],
    email,
    provider: "google",
    role: "user",
    plan: "free",
    status: "active",
    createdAt: now,
    updatedAt: now,
  };
  const users = getUsers();
  saveUsers([...users, user]);
  return upsertSessionForUser(user);
}

export function requireSuperadmin(actorId: string): AuthActionResult {
  const actor = getUsers().find((user) => user.id === actorId);
  if (!actor || actor.role !== "superadmin") {
    return { ok: false, error: "Unauthorized action." };
  }
  if (actor.status !== "active") {
    return { ok: false, error: "Superadmin account is inactive." };
  }
  return { ok: true, user: actor };
}

function updateUser(
  actorId: string,
  targetUserId: string,
  updater: (target: AppUser) => AuthActionResult,
): AuthActionResult {
  const auth = requireSuperadmin(actorId);
  if (!auth.ok) return auth;

  const users = getUsers();
  const target = users.find((user) => user.id === targetUserId);
  if (!target) return { ok: false, error: "User not found." };

  const result = updater(target);
  if (!result.ok || !result.user) return result;

  const updatedUsers = users.map((user) => (user.id === targetUserId ? result.user! : user));
  saveUsers(updatedUsers);
  emitAuthChange();
  return { ok: true, user: result.user };
}

export function updateUserPlan(actorId: string, targetUserId: string, plan: PlanType): AuthActionResult {
  return updateUser(actorId, targetUserId, (target) => {
    if (target.id === SUPERADMIN_ID) {
      return { ok: false, error: "Superadmin plan cannot be modified." };
    }
    return {
      ok: true,
      user: {
        ...target,
        plan,
        updatedAt: new Date().toISOString(),
      },
    };
  });
}

export function updateUserStatus(actorId: string, targetUserId: string, status: UserStatus): AuthActionResult {
  return updateUser(actorId, targetUserId, (target) => {
    if (target.id === SUPERADMIN_ID) {
      return { ok: false, error: "Superadmin cannot be deactivated." };
    }
    return {
      ok: true,
      user: {
        ...target,
        status,
        updatedAt: new Date().toISOString(),
      },
    };
  });
}

export function deleteUser(actorId: string, targetUserId: string): AuthActionResult {
  const auth = requireSuperadmin(actorId);
  if (!auth.ok) return auth;
  if (targetUserId === SUPERADMIN_ID) {
    return { ok: false, error: "Superadmin cannot be deleted." };
  }
  const users = getUsers();
  const exists = users.some((user) => user.id === targetUserId);
  if (!exists) return { ok: false, error: "User not found." };
  saveUsers(users.filter((user) => user.id !== targetUserId));
  emitAuthChange();
  return { ok: true };
}
