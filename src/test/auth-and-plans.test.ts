import { beforeEach, describe, expect, it } from "vitest";
import {
  SUPERADMIN_DEFAULT_PASSWORD,
  SUPERADMIN_EMAIL,
  deleteUser,
  ensureAuthSeed,
  getCurrentUser,
  getUsers,
  loginWithPassword,
  registerWithPassword,
  updateUserPlan,
  updateUserStatus,
} from "@/store/auth-store";
import { canPublishByPlan } from "@/lib/plans";
import { createFunnel, setFunnelPublishState } from "@/store/funnel-store";

describe("auth and plan rules", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("keeps superadmin protected from deletion and deactivation", () => {
    ensureAuthSeed();
    const superadmin = getUsers().find((user) => user.role === "superadmin");
    expect(superadmin).toBeTruthy();
    if (!superadmin) return;

    const deleteResult = deleteUser(superadmin.id, superadmin.id);
    expect(deleteResult.ok).toBe(false);

    const statusResult = updateUserStatus(superadmin.id, superadmin.id, "inactive");
    expect(statusResult.ok).toBe(false);
  });

  it("allows superadmin to change normal user plan", () => {
    ensureAuthSeed();
    const superadmin = getUsers().find((user) => user.role === "superadmin");
    if (!superadmin) return;

    const registerResult = registerWithPassword({
      name: "Ana",
      email: "ana@example.com",
      password: "password123",
    });
    expect(registerResult.ok).toBe(true);
    if (!registerResult.user) return;

    const planResult = updateUserPlan(superadmin.id, registerResult.user.id, "master");
    expect(planResult.ok).toBe(true);
    expect(getUsers().find((item) => item.id === registerResult.user?.id)?.plan).toBe("master");
  });

  it("enforces publish limits by plan", () => {
    const freeCheck = canPublishByPlan({ plan: "free", publishedFunnels: 0 });
    expect(freeCheck.allowed).toBe(false);

    const proCheck = canPublishByPlan({ plan: "pro", publishedFunnels: 2 });
    expect(proCheck.allowed).toBe(false);

    const masterCheck = canPublishByPlan({ plan: "master", publishedFunnels: 99 });
    expect(masterCheck.allowed).toBe(true);
  });

  it("blocks third publish for pro users in funnel publish action", () => {
    const ownerId = "pro-user";

    const first = createFunnel("Funnel One", ownerId);
    const second = createFunnel("Funnel Two", ownerId);
    const third = createFunnel("Funnel Three", ownerId);

    expect(
      setFunnelPublishState({
        funnelId: first.id,
        nextPublished: true,
        ownerId,
        userPlan: "pro",
      }).ok,
    ).toBe(true);

    expect(
      setFunnelPublishState({
        funnelId: second.id,
        nextPublished: true,
        ownerId,
        userPlan: "pro",
      }).ok,
    ).toBe(true);

    const thirdResult = setFunnelPublishState({
      funnelId: third.id,
      nextPublished: true,
      ownerId,
      userPlan: "pro",
    });
    expect(thirdResult.ok).toBe(false);
  });

  it("returns a stable user snapshot when auth storage has not changed", () => {
    ensureAuthSeed();
    const loginResult = loginWithPassword({
      email: SUPERADMIN_EMAIL,
      password: SUPERADMIN_DEFAULT_PASSWORD,
    });
    expect(loginResult.ok).toBe(true);

    const firstSnapshot = getCurrentUser();
    const secondSnapshot = getCurrentUser();

    expect(firstSnapshot).toBeTruthy();
    expect(secondSnapshot).toBe(firstSnapshot);
  });
});
