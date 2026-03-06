export type PlanType = "free" | "pro" | "master";

export interface PlanDefinition {
  id: PlanType;
  name: string;
  monthlyPriceUsd: number;
  publishLimit: number | null;
  description: string;
}

export const PLAN_DEFINITIONS: Record<PlanType, PlanDefinition> = {
  free: {
    id: "free",
    name: "Free",
    monthlyPriceUsd: 0,
    publishLimit: 0,
    description: "Can create funnels but cannot publish.",
  },
  pro: {
    id: "pro",
    name: "Pro",
    monthlyPriceUsd: 9.9,
    publishLimit: 2,
    description: "Can publish up to 2 funnels.",
  },
  master: {
    id: "master",
    name: "Master",
    monthlyPriceUsd: 50,
    publishLimit: null,
    description: "Can publish unlimited funnels.",
  },
};

export function canPublishByPlan({
  plan,
  publishedFunnels,
  isSuperadmin,
}: {
  plan: PlanType;
  publishedFunnels: number;
  isSuperadmin?: boolean;
}): { allowed: boolean; reason?: string } {
  if (isSuperadmin) {
    return { allowed: true };
  }

  const definition = PLAN_DEFINITIONS[plan];
  if (!definition) {
    return { allowed: false, reason: "Unknown plan." };
  }

  if (definition.publishLimit === 0) {
    return { allowed: false, reason: "Free plan cannot publish funnels." };
  }

  if (definition.publishLimit !== null && publishedFunnels >= definition.publishLimit) {
    return {
      allowed: false,
      reason: `Plan ${definition.name} allows up to ${definition.publishLimit} published funnels.`,
    };
  }

  return { allowed: true };
}
