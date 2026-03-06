# FunnelCOD - Contract

Last updated: 2026-03-06
Version: 1.1.0

## 1) Scope

This contract defines stable integration points for the current frontend-only app:
- Route contract.
- Local persistence contract (`localStorage`).
- Data shape contract for funnels, elements, and orders.
- Validation contract for COD order capture.

No HTTP API contract exists yet in this version.

## 2) Route contract

### Public and app routes
- `GET /`
- `GET /dashboard`
- `GET /editor/:id`
- `GET /preview/:id`
- `GET /orders`
- `GET /f/:slug`
- Fallback `*` -> 404 UI

### Route params
- `id`: string UUID-like identifier of a funnel.
- `slug`: URL-safe string used to resolve published funnel.

### Route behavior guarantees
- `/editor/:id` redirects to `/dashboard` if funnel is not found.
- `/f/:slug` renders "not found" UI when slug does not exist or funnel is unpublished.

## 3) Persistence contract (localStorage)

### Keys
- `cod_funnels`
- `cod_orders`
- `funnelcod_lang` (optional UI preference key for landing language)

### Key: `cod_funnels`
JSON array of `Funnel`.

`Funnel` minimum shape:
```ts
type Funnel = {
  id: string;
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
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
};
```

`FunnelPage` minimum shape:
```ts
type FunnelPage = {
  id: string;
  name: string;
  slug: string;
  type: "product" | "order" | "thankyou" | "custom";
  sections: Section[];
};
```

`Section -> Row -> Container -> FunnelElement` shape:
```ts
type Section = { id: string; rows: Row[]; props?: Record<string, any> };
type Row = { id: string; containers: Container[] };
type Container = { id: string; elements: FunnelElement[]; width?: string };
type FunnelElement = {
  id: string;
  type: ElementType;
  content?: string;
  props?: Record<string, any>;
};
```

`ElementType` allowed values:
```ts
type ElementType =
  | "headline"
  | "paragraph"
  | "image"
  | "button"
  | "spacer"
  | "video"
  | "countdown"
  | "product-price"
  | "product-image"
  | "order-button"
  | "cod-order-form"
  | "trust-badges"
  | "testimonial"
  | "features-list";
```

### Key: `cod_orders`
JSON array of `Order`.

`Order` minimum shape:
```ts
type Order = {
  id: string;
  funnelId: string;
  funnelName: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  quantity: number;
  productName: string;
  total: number;
  status: "new" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string; // ISO datetime
};
```

## 4) COD form validation contract

Input rules (zod):
- `fullName`: string, trimmed, min 2, max 100.
- `phone`: string, trimmed, min 6, max 20.
- `city`: string, trimmed, min 2, max 100.
- `address`: string, trimmed, min 5, max 300.
- `quantity`: number, min 1, max 99.

On valid submit:
- Creates one `Order` with `status: "new"`.
- Persists into `cod_orders`.

On invalid submit:
- No write to storage.
- Field-level error messages are shown in UI.

## 5) Compatibility rules

Breaking changes (require version bump + migration strategy):
- Renaming/removing storage keys.
- Renaming/removing required fields in `Funnel` or `Order`.
- Changing allowed enum values for `ElementType` or order `status`.
- Changing route patterns (`/editor/:id`, `/f/:slug`, etc.).

Non-breaking changes:
- Adding optional fields.
- Adding new element types while preserving existing rendering behavior.
- Adding new pages/routes without modifying current route signatures.

## 6) Changelog del Contrato

- 2026-03-06: Added optional language preference key `funnelcod_lang` in localStorage.
  - Type: non-breaking
  - Impact: landing can persist selected language between sessions without affecting funnel/order data.

- 2026-03-06: Initial project contract created.
  - Type: non-breaking
  - Impact: establishes first baseline for routes, local storage, data models, and validation.
