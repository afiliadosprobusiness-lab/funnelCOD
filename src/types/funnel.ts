export type ElementType =
  | 'headline'
  | 'paragraph'
  | 'image'
  | 'button'
  | 'spacer'
  | 'video'
  | 'countdown'
  | 'product-price'
  | 'product-image'
  | 'order-button'
  | 'cod-order-form'
  | 'trust-badges'
  | 'testimonial'
  | 'features-list';

export interface FunnelElement {
  id: string;
  type: ElementType;
  content?: string;
  props?: Record<string, any>;
}

export interface Container {
  id: string;
  elements: FunnelElement[];
  width?: string;
}

export interface Row {
  id: string;
  containers: Container[];
}

export interface Section {
  id: string;
  rows: Row[];
  props?: Record<string, any>;
}

export interface FunnelPage {
  id: string;
  name: string;
  slug: string;
  type: 'product' | 'order' | 'thankyou' | 'custom';
  sections: Section[];
}

export interface Funnel {
  id: string;
  ownerId?: string;
  name: string;
  slug: string;
  pages: FunnelPage[];
  product?: {
    name: string;
    price: number;
    currency: string;
    image?: string;
  };
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'new' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  ownerId?: string;
  funnelId: string;
  funnelName: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  quantity: number;
  productName: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
}
