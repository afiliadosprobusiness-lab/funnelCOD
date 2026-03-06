# FunnelCOD - Project Context

Last updated: 2026-03-06

## 1) Product purpose

FunnelCOD is a COD (Cash on Delivery) funnel builder frontend.
Users can:
- Register/login (email+password) and login with Google.
- Create and edit funnels.
- Publish funnels according to selected plan limits.
- Collect and manage COD orders.
- Superadmin can manage user status and plans.

The project remains frontend-only (no backend API).

## 2) Tech stack

- Build tool: Vite 5
- UI: React 18 + TypeScript
- Routing: react-router-dom 6
- Styling: Tailwind CSS + shadcn-ui (Radix primitives)
- Motion: framer-motion
- Drag and drop: dnd-kit
- Validation: zod
- IDs: uuid
- Testing: Vitest + Testing Library
- Build plugins: `@vitejs/plugin-react-swc`
- Deploy hosting: Firebase Hosting (CLI)

## 3) Runtime architecture

### Entry points
- `src/main.tsx` mounts `App`.
- `src/App.tsx` wires providers, routes, and guarded pages.

### Main modules
- `src/pages/*`: route-level pages.
- `src/components/editor/*`: editor, renderer, and COD form components.
- `src/components/auth/*`: route guards and Google sign-in UI.
- `src/store/funnel-store.ts`: funnels/orders persistence and plan-based publish rules.
- `src/store/auth-store.ts`: users/session auth logic and superadmin management actions.
- `src/types/*`: shared domain types.
- `src/components/ui/*`: shadcn-ui component set.

### State and persistence
- Browser `localStorage` is the source of persistence.
- Keys:
  - `cod_funnels`
  - `cod_orders`
  - `cod_users`
  - `cod_session`
  - `funnelcod_lang` (optional landing language preference)

## 4) Routes and navigation

- `/`: marketing landing.
- `/auth`: login/register (email-password + Google).
- `/dashboard`: user funnels dashboard (protected).
- `/editor/:id`: visual editor (protected + ownership check).
- `/preview/:id`: preview mode (protected + ownership check).
- `/orders`: orders table (protected, scoped by user unless superadmin).
- `/superadmin`: user admin console (protected, superadmin only).
- `/f/:slug`: public published funnel.
- `*`: 404 page.

## 5) Domain model (summary)

Core entities:
- `Funnel`: metadata, optional `ownerId`, pages, product info, publish flag, timestamps.
- `Order`: optional `ownerId`, customer details, total, status.
- `AppUser`: provider, role, plan, status, timestamps.
- `AuthSession`: `userId` reference.

Plans:
- `free`: can create funnels but cannot publish.
- `pro`: can publish up to 2 funnels.
- `master`: unlimited publishing.

## 6) Main user flows

### Authentication
1. User goes to `/auth`.
2. User signs in with email/password or Google, or registers.
3. Session is saved to `cod_session`.
4. Protected routes become available.

### Funnel management
1. User creates funnel in dashboard.
2. App creates default pages (`product`, `order`, `thankyou`) and assigns ownership.
3. Funnel is persisted to `cod_funnels`.

### Visual editing
1. User opens `/editor/:id`.
2. Editor validates ownership (unless superadmin).
3. User edits sections/elements and saves to localStorage.

### Publish and view
1. User clicks Publish in editor or dashboard.
2. App validates plan publishing limits.
3. If allowed, `published` is set true and funnel is reachable at `/f/:slug`.

### COD order capture
1. Visitor submits COD form in a published funnel.
2. zod validates fields.
3. Order is saved to `cod_orders` with status `new` and owner mapping.
4. Owner (or superadmin) manages statuses in `/orders`.

### Superadmin operations
1. Superadmin logs in to `/auth`.
2. Opens `/superadmin`.
3. Activates/deactivates users and changes plans.
4. Superadmin record is protected against deletion/deactivation.

### Landing marketing flow
1. User sees hero first and immediately after that the testimonials carousel.
2. Then the page continues with features, how-it-works, pricing, and FAQ sections.

## 7) External integrations and env vars

- No backend/API calls.
- Optional Google Identity Services integration for sign-in button.
- Firebase Hosting configured for SPA deploy/rewrite.
  - Firebase project id: `funnelcod-20260306`
  - Config files: `.firebaserc`, `firebase.json`
- Optional env var:
  - `VITE_GOOGLE_CLIENT_ID`
- Landing uses a local hero image and external referential images with fallbacks.

## 8) Quality and testing status

- Test setup exists (`vitest.config.ts`, `src/test/setup.ts`).
- Coverage remains small but includes auth/plan critical rules.

## 9) Known constraints and technical notes

- Data is local per browser/device.
- No server-side validation or secure credential storage (client-only prototype model).
- Session and permissions are local app-level guards.

## 10) Security and privacy baseline

- No secrets committed in source.
- `.env.example` documents Google client id var.
- Customer order data and users are stored in localStorage (client-visible).
- Suitable for prototype/local usage, not compliance-grade production storage.
