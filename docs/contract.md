# FunnelCOD - Contract

Last updated: 2026-03-06
Version: 1.2.0

## 1) Scope

This contract defines stable integration points for the current frontend app:
- Route contract.
- Local persistence contract (`localStorage`).
- Data shape contract for funnels, users, session, and orders.
- Validation contract for COD order capture.
- Plan publishing limits.

No HTTP API contract exists yet in this version.

## 2) Route contract

### Public and app routes
- `GET /`
- `GET /auth`
- `GET /dashboard` (auth required)
- `GET /editor/:id` (auth required)
- `GET /preview/:id` (auth required)
- `GET /orders` (auth required)
- `GET /superadmin` (auth + superadmin role required)
- `GET /f/:slug`
- Fallback `*` -> 404 UI

### Route params
- `id`: string UUID-like identifier of a funnel.
- `slug`: URL-safe string used to resolve published funnel.

### Route behavior guarantees
- Protected routes redirect to `/auth` when no active session exists.
- `/superadmin` redirects to `/dashboard` for non-superadmin users.
- `/editor/:id` and `/preview/:id` redirect to `/dashboard` if funnel is not found or user has no access.
- `/f/:slug` renders "not found" UI when slug does not exist or funnel is unpublished.

## 3) Persistence contract (localStorage)

### Keys
- `cod_funnels`
- `cod_orders`
- `cod_users`
- `cod_session`
- `funnelcod_lang` (optional UI preference key for landing language)

### Key: `cod_funnels`
JSON array of `Funnel`.

`Funnel` minimum shape:
```ts
type Funnel = {
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
  status: "new" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string; // ISO datetime
};
```

### Key: `cod_users`
JSON array of `AppUser`.

```ts
type AppUser = {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  provider: "password" | "google";
  role: "user" | "superadmin";
  plan: "free" | "pro" | "master";
  status: "active" | "inactive";
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
};
```

Rules:
- A seed superadmin is always ensured.
- Superadmin cannot be deleted or deactivated by store actions.

### Key: `cod_session`
```ts
type AuthSession = {
  userId: string;
};
```

## 4) Plan publishing contract

- `free`: can create funnels but cannot publish.
- `pro`: can publish up to 2 funnels.
- `master`: unlimited published funnels.
- `superadmin`: bypasses plan publishing limits.

## 5) COD form validation contract

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

## 6) Compatibility rules

Breaking changes (require version bump + migration strategy):
- Renaming/removing storage keys.
- Renaming/removing required fields in `Funnel`, `Order`, `AppUser`, or `AuthSession`.
- Changing allowed enum values for `ElementType`, order `status`, plan ids, role, or provider.
- Changing route patterns (`/editor/:id`, `/f/:slug`, etc.).

Non-breaking changes:
- Adding optional fields.
- Adding new element types while preserving existing rendering behavior.
- Adding new pages/routes without modifying current route signatures.

## 7) Changelog del Contrato

- 2026-03-06: Added auth/session and user-management contract (`cod_users`, `cod_session`), plus superadmin protection.
  - Type: non-breaking
  - Impact: enables login/register/google auth and superadmin controls without breaking existing funnel/order data.

- 2026-03-06: Added plan publishing contract (`free`, `pro`, `master`) and optional ownership fields (`ownerId`) for funnels/orders.
  - Type: non-breaking
  - Impact: enforces publishing limits and multi-user data separation in localStorage.

- 2026-03-06: Added optional language preference key `funnelcod_lang` in localStorage.
  - Type: non-breaking
  - Impact: landing can persist selected language between sessions without affecting funnel/order data.

- 2026-03-06: Initial project contract created.
  - Type: non-breaking
  - Impact: establishes first baseline for routes, local storage, data models, and validation.
