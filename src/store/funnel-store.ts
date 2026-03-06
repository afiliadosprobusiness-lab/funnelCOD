import { canPublishByPlan, PlanType } from "@/lib/plans";
import { Funnel, FunnelElement, FunnelPage, Order, Section } from "@/types/funnel";
import { v4 as uuid } from "uuid";

const FUNNELS_KEY = "cod_funnels";
const ORDERS_KEY = "cod_orders";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getFunnels(): Funnel[] {
  return safeParse<Funnel[]>(localStorage.getItem(FUNNELS_KEY), []);
}

export function saveFunnels(funnels: Funnel[]) {
  localStorage.setItem(FUNNELS_KEY, JSON.stringify(funnels));
}

export function getFunnelsByOwner(ownerId: string, isSuperadmin = false): Funnel[] {
  const funnels = getFunnels();
  if (isSuperadmin) return funnels;
  return funnels.filter((funnel) => funnel.ownerId === ownerId);
}

export function getFunnel(id: string): Funnel | undefined {
  return getFunnels().find((funnel) => funnel.id === id);
}

export function getFunnelBySlug(slug: string): Funnel | undefined {
  return getFunnels().find((funnel) => funnel.slug === slug);
}

export function claimUnownedData(ownerId: string) {
  const funnels = getFunnels();
  const unownedFunnels = funnels.filter((funnel) => !funnel.ownerId);
  if (unownedFunnels.length > 0) {
    const updatedFunnels = funnels.map((funnel) =>
      funnel.ownerId ? funnel : { ...funnel, ownerId, updatedAt: new Date().toISOString() },
    );
    saveFunnels(updatedFunnels);
  }

  const funnelOwnerMap = new Map(getFunnels().map((funnel) => [funnel.id, funnel.ownerId] as const));
  const orders = getOrders();
  const hasUnownedOrders = orders.some((order) => !order.ownerId);
  if (hasUnownedOrders) {
    const updatedOrders = orders.map((order) => {
      if (order.ownerId) return order;
      const inferredOwner = funnelOwnerMap.get(order.funnelId);
      return { ...order, ownerId: inferredOwner || ownerId };
    });
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
  }
}

export function createDefaultPage(type: FunnelPage["type"], name: string): FunnelPage {
  const pageId = uuid();

  const defaultElements: Record<string, FunnelElement[]> = {
    product: [
      {
        id: uuid(),
        type: "headline",
        content: "Limited Offer - Order Now!",
        props: { level: "h3", align: "center", color: "#dc2626", fontSize: 18 },
      },
      { id: uuid(), type: "headline", content: "Amazing Product", props: { level: "h1", align: "center", fontSize: 36 } },
      { id: uuid(), type: "product-image", props: { src: "", alt: "Product" } },
      {
        id: uuid(),
        type: "paragraph",
        content: "This product will change your life. Premium quality with guaranteed satisfaction. Order now with Cash on Delivery!",
        props: { align: "center" },
      },
      {
        id: uuid(),
        type: "features-list",
        props: {
          items: [
            "Free Shipping",
            "30-Day Money Back Guarantee",
            "Premium Quality Materials",
            "Fast Delivery (2-5 days)",
          ],
        },
      },
      { id: uuid(), type: "product-price", props: { price: 29.99, currency: "$", originalPrice: 59.99 } },
      { id: uuid(), type: "countdown", props: { hours: 2, minutes: 30, seconds: 0 } },
      {
        id: uuid(),
        type: "order-button",
        content: "Order Now - Cash on Delivery",
        props: { align: "center", bgColor: "#2563eb", textColor: "#ffffff" },
      },
      { id: uuid(), type: "trust-badges", props: {} },
      { id: uuid(), type: "testimonial", props: { name: "Sarah K.", text: "Amazing product! Received it in 3 days. Totally worth it!", rating: 5 } },
    ],
    order: [
      { id: uuid(), type: "headline", content: "Complete Your Order", props: { level: "h2", align: "center" } },
      { id: uuid(), type: "cod-order-form", props: {} },
    ],
    thankyou: [
      { id: uuid(), type: "headline", content: "Thank You!", props: { level: "h1", align: "center" } },
      {
        id: uuid(),
        type: "paragraph",
        content: "Your order has been placed successfully. We will contact you shortly to confirm.",
        props: { align: "center" },
      },
    ],
    custom: [{ id: uuid(), type: "headline", content: "New Page", props: { level: "h1", align: "center" } }],
  };

  const section: Section = {
    id: uuid(),
    rows: [
      {
        id: uuid(),
        containers: [
          {
            id: uuid(),
            elements: defaultElements[type] || defaultElements.custom,
          },
        ],
      },
    ],
  };

  return {
    id: pageId,
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    type,
    sections: [section],
  };
}

export function createFunnel(name: string, ownerId: string): Funnel {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const now = new Date().toISOString();
  const funnel: Funnel = {
    id: uuid(),
    ownerId,
    name,
    slug,
    pages: [
      createDefaultPage("product", "Product Page"),
      createDefaultPage("order", "Order Form"),
      createDefaultPage("thankyou", "Thank You"),
    ],
    product: { name: "My Product", price: 29.99, currency: "$" },
    published: false,
    createdAt: now,
    updatedAt: now,
  };

  const funnels = getFunnels();
  funnels.push(funnel);
  saveFunnels(funnels);
  return funnel;
}

export function updateFunnel(updated: Funnel) {
  const now = new Date().toISOString();
  const funnels = getFunnels().map((funnel) =>
    funnel.id === updated.id
      ? { ...updated, ownerId: updated.ownerId || funnel.ownerId, updatedAt: now }
      : funnel,
  );
  saveFunnels(funnels);
}

export function deleteFunnel(id: string) {
  saveFunnels(getFunnels().filter((funnel) => funnel.id !== id));
}

export function duplicateFunnel(id: string, ownerId: string): Funnel | undefined {
  const original = getFunnel(id);
  if (!original) return;
  const now = new Date().toISOString();
  const dup: Funnel = {
    ...JSON.parse(JSON.stringify(original)),
    id: uuid(),
    ownerId,
    name: `${original.name} (Copy)`,
    slug: `${original.slug}-copy-${Date.now()}`,
    published: false,
    createdAt: now,
    updatedAt: now,
  };
  const funnels = getFunnels();
  funnels.push(dup);
  saveFunnels(funnels);
  return dup;
}

export function countPublishedFunnelsByOwner(ownerId: string): number {
  return getFunnels().filter((funnel) => funnel.ownerId === ownerId && funnel.published).length;
}

export function setFunnelPublishState(input: {
  funnelId: string;
  nextPublished: boolean;
  ownerId: string;
  userPlan: PlanType;
  isSuperadmin?: boolean;
}): { ok: boolean; funnel?: Funnel; error?: string } {
  const funnel = getFunnel(input.funnelId);
  if (!funnel) return { ok: false, error: "Funnel not found." };
  if (!input.isSuperadmin && funnel.ownerId !== input.ownerId) {
    return { ok: false, error: "You cannot modify this funnel." };
  }

  if (!input.nextPublished) {
    const updated: Funnel = { ...funnel, published: false, updatedAt: new Date().toISOString() };
    updateFunnel(updated);
    return { ok: true, funnel: updated };
  }

  const publishedCount = getFunnels().filter(
    (item) => item.ownerId === input.ownerId && item.published && item.id !== input.funnelId,
  ).length;
  const permission = canPublishByPlan({
    plan: input.userPlan,
    publishedFunnels: publishedCount,
    isSuperadmin: input.isSuperadmin,
  });

  if (!permission.allowed) {
    return { ok: false, error: permission.reason || "Cannot publish with current plan." };
  }

  const updated: Funnel = { ...funnel, published: true, updatedAt: new Date().toISOString() };
  updateFunnel(updated);
  return { ok: true, funnel: updated };
}

// Orders
export function getOrders(): Order[] {
  return safeParse<Order[]>(localStorage.getItem(ORDERS_KEY), []);
}

export function getOrdersByOwner(ownerId: string, isSuperadmin = false): Order[] {
  const orders = getOrders();
  if (isSuperadmin) return orders;
  return orders.filter((order) => order.ownerId === ownerId);
}

export function saveOrder(order: Omit<Order, "id" | "createdAt">): Order {
  const orders = getOrders();
  const newOrder: Order = { ...order, id: uuid(), createdAt: new Date().toISOString() };
  orders.push(newOrder);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return newOrder;
}

export function updateOrderStatus(orderId: string, status: Order["status"]) {
  const orders = getOrders().map((order) => (order.id === orderId ? { ...order, status } : order));
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function createElement(type: FunnelElement["type"]): FunnelElement {
  const defaults: Record<string, Partial<FunnelElement>> = {
    headline: { content: "Your Headline Here", props: { level: "h2", align: "center", fontSize: 28 } },
    paragraph: {
      content: "Enter your text here. Write compelling copy that converts visitors into buyers.",
      props: { align: "center" },
    },
    image: { props: { src: "", alt: "Image", width: "100%" } },
    button: { content: "Click Me", props: { align: "center", bgColor: "#2563eb", textColor: "#ffffff" } },
    spacer: { props: { height: 40 } },
    video: { props: { url: "", type: "youtube" } },
    countdown: { props: { hours: 2, minutes: 0, seconds: 0 } },
    "product-price": { props: { price: 29.99, currency: "$", originalPrice: 49.99 } },
    "product-image": { props: { src: "", alt: "Product" } },
    "order-button": { content: "Order Now - Cash on Delivery", props: { align: "center", bgColor: "#2563eb", textColor: "#ffffff" } },
    "cod-order-form": { props: {} },
    "trust-badges": { props: {} },
    testimonial: { props: { name: "Happy Customer", text: "Great product! Highly recommended.", rating: 5 } },
    "features-list": { props: { items: ["Feature 1", "Feature 2", "Feature 3"] } },
  };
  const def = defaults[type] || {};
  return { id: uuid(), type, content: def.content, props: def.props || {} };
}