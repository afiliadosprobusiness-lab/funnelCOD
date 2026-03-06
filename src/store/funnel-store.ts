import { Funnel, Order, FunnelPage, Section, Row, Container, FunnelElement } from '@/types/funnel';
import { v4 as uuid } from 'uuid';

const FUNNELS_KEY = 'cod_funnels';
const ORDERS_KEY = 'cod_orders';

export function getFunnels(): Funnel[] {
  const raw = localStorage.getItem(FUNNELS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveFunnels(funnels: Funnel[]) {
  localStorage.setItem(FUNNELS_KEY, JSON.stringify(funnels));
}

export function getFunnel(id: string): Funnel | undefined {
  return getFunnels().find(f => f.id === id);
}

export function getFunnelBySlug(slug: string): Funnel | undefined {
  return getFunnels().find(f => f.slug === slug);
}

export function createDefaultPage(type: FunnelPage['type'], name: string): FunnelPage {
  const pageId = uuid();
  
  const defaultElements: Record<string, FunnelElement[]> = {
    product: [
      { id: uuid(), type: 'headline', content: 'Amazing Product', props: { level: 'h1', align: 'center' } },
      { id: uuid(), type: 'product-image', props: { src: '', alt: 'Product' } },
      { id: uuid(), type: 'paragraph', content: 'This product will change your life. Order now with Cash on Delivery!', props: { align: 'center' } },
      { id: uuid(), type: 'product-price', props: { price: 29.99, currency: '$' } },
      { id: uuid(), type: 'order-button', content: 'Order Now - COD', props: { align: 'center' } },
    ],
    order: [
      { id: uuid(), type: 'headline', content: 'Complete Your Order', props: { level: 'h2', align: 'center' } },
      { id: uuid(), type: 'cod-order-form', props: {} },
    ],
    thankyou: [
      { id: uuid(), type: 'headline', content: 'Thank You! 🎉', props: { level: 'h1', align: 'center' } },
      { id: uuid(), type: 'paragraph', content: 'Your order has been placed successfully. We will contact you shortly to confirm.', props: { align: 'center' } },
    ],
    custom: [
      { id: uuid(), type: 'headline', content: 'New Page', props: { level: 'h1', align: 'center' } },
    ],
  };

  const section: Section = {
    id: uuid(),
    rows: [{
      id: uuid(),
      containers: [{
        id: uuid(),
        elements: defaultElements[type] || defaultElements.custom,
      }],
    }],
  };

  return {
    id: pageId,
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    type,
    sections: [section],
  };
}

export function createFunnel(name: string): Funnel {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const funnel: Funnel = {
    id: uuid(),
    name,
    slug,
    pages: [
      createDefaultPage('product', 'Product Page'),
      createDefaultPage('order', 'Order Form'),
      createDefaultPage('thankyou', 'Thank You'),
    ],
    product: { name: 'My Product', price: 29.99, currency: '$' },
    published: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const funnels = getFunnels();
  funnels.push(funnel);
  saveFunnels(funnels);
  return funnel;
}

export function updateFunnel(updated: Funnel) {
  const funnels = getFunnels().map(f => f.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : f);
  saveFunnels(funnels);
}

export function deleteFunnel(id: string) {
  saveFunnels(getFunnels().filter(f => f.id !== id));
}

export function duplicateFunnel(id: string): Funnel | undefined {
  const original = getFunnel(id);
  if (!original) return;
  const dup: Funnel = {
    ...JSON.parse(JSON.stringify(original)),
    id: uuid(),
    name: `${original.name} (Copy)`,
    slug: `${original.slug}-copy-${Date.now()}`,
    published: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const funnels = getFunnels();
  funnels.push(dup);
  saveFunnels(funnels);
  return dup;
}

// Orders
export function getOrders(): Order[] {
  const raw = localStorage.getItem(ORDERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveOrder(order: Omit<Order, 'id' | 'createdAt'>): Order {
  const orders = getOrders();
  const newOrder: Order = { ...order, id: uuid(), createdAt: new Date().toISOString() };
  orders.push(newOrder);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return newOrder;
}

export function updateOrderStatus(orderId: string, status: Order['status']) {
  const orders = getOrders().map(o => o.id === orderId ? { ...o, status } : o);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function createElement(type: FunnelElement['type']): FunnelElement {
  const defaults: Record<string, Partial<FunnelElement>> = {
    headline: { content: 'Your Headline Here', props: { level: 'h2', align: 'left' } },
    paragraph: { content: 'Enter your text here...', props: { align: 'left' } },
    image: { props: { src: '', alt: 'Image', width: '100%' } },
    button: { content: 'Click Me', props: { align: 'center', variant: 'primary' } },
    spacer: { props: { height: 40 } },
    video: { props: { url: '', type: 'youtube' } },
    countdown: { props: { hours: 2, minutes: 0, seconds: 0 } },
    'product-price': { props: { price: 29.99, currency: '$', originalPrice: 49.99 } },
    'product-image': { props: { src: '', alt: 'Product' } },
    'order-button': { content: 'Order Now - Cash on Delivery', props: { align: 'center' } },
    'cod-order-form': { props: {} },
  };
  const def = defaults[type] || {};
  return { id: uuid(), type, content: def.content, props: def.props || {} };
}
