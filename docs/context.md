# FunnelCOD - Project Context

Last updated: 2026-03-06

## 1) Product purpose

FunnelCOD is a frontend-only COD (Cash on Delivery) funnel builder.
Users can:
- Create funnels.
- Edit pages with a drag-and-drop visual editor.
- Publish funnels to a public route.
- Collect and manage COD orders.

There is no backend/API integration in the current version.

## 2) Tech stack

- Build tool: Vite 5
- UI: React 18 + TypeScript
- Routing: react-router-dom 6
- Styling: Tailwind CSS + shadcn-ui (Radix primitives)
- Motion: framer-motion
- Drag and drop: dnd-kit
- Validation: zod
- IDs: uuid
- Testing: Vitest + Testing Library (minimal test coverage currently)
- Build plugins: `@vitejs/plugin-react-swc` only (no Lovable-specific tagger plugin)

## 3) Runtime architecture

### Entry points
- `src/main.tsx` mounts `App`.
- `src/App.tsx` wires providers and routes.

### Main modules
- `src/pages/*`: route-level pages.
- `src/components/editor/*`: editor, renderer, and COD form components.
- `src/store/funnel-store.ts`: localStorage persistence and domain actions.
- `src/types/funnel.ts`: shared domain types.
- `src/components/ui/*`: shadcn-ui component set.

### State and persistence
- Primary persistence uses browser `localStorage`.
- Keys:
  - `cod_funnels`
  - `cod_orders`
- Main state in pages is React local state hydrated from `localStorage`.

## 4) Routes and navigation

- `/`: marketing landing page.
- `/dashboard`: list/create/manage funnels.
- `/editor/:id`: visual editor for a funnel.
- `/preview/:id`: preview mode with desktop/mobile viewport switch.
- `/orders`: orders table with status updates and filtering.
- `/f/:slug`: public published funnel page.
- `*`: 404 page.

## 5) Domain model (summary)

Core entities:
- `Funnel`: metadata, slug, pages, product info, publish flag, timestamps.
- `FunnelPage`: page type (`product`, `order`, `thankyou`, `custom`) and sections.
- `Section -> Row -> Container -> FunnelElement`: nested layout model.
- `Order`: COD order captured from order form and tracked by status.

## 6) Main user flows

### Funnel management
1. User creates funnel in dashboard.
2. App creates default pages (`product`, `order`, `thankyou`).
3. Funnel is persisted to `cod_funnels`.

### Visual editing
1. User opens `/editor/:id`.
2. Editor loads funnel from localStorage.
3. User adds/reorders/updates elements (dnd-kit + settings panel).
4. Changes are saved to localStorage with undo/redo history in-memory.

### Publish and view
1. User clicks Publish in editor or dashboard.
2. `published` flag toggles true.
3. Public page available at `/f/:slug` if published.

### COD order capture
1. User submits COD form (`cod-order-form` element) in published funnel.
2. zod validates fields.
3. Order is saved in `cod_orders` with status `new`.
4. Backoffice user manages statuses in `/orders`.

### Landing marketing flow
1. User enters `/` and sees dark-mode landing with strong CTA.
2. Navbar links (`features`, `how-it-works`, `testimonials`, `pricing`, `faq`) scroll smoothly to sections.
3. Language selector toggles `es/en` copy across all landing sections and persists preference in `localStorage` under `funnelcod_lang`.
4. Testimonials are displayed as social-style cards in a horizontal scroller with left/right controls (no visual duplication).
5. Pricing section is structured as 4 cards (`Basic`, `Pro`, `Advanced`, `Enterprise`) aligned to current scope and Peru/Latam positioning.
6. FAQ section uses accordion interaction with expanded question set.

## 7) External integrations and env vars

- No external API calls.
- Landing uses local SVG visuals for core feature blocks and external avatar photos with local fallback.
- No required environment variables.
- React Query provider exists but no active `useQuery` / `useMutation` usage yet.

## 8) Quality and testing status

- Test setup exists (`vitest.config.ts`, `src/test/setup.ts`).
- Current test coverage is effectively placeholder (`src/test/example.test.ts`).
- Build was executed successfully (`npm run build`) after landing updates.
- Tests were executed successfully (`npm run test`).

## 9) Known constraints and technical notes

- Data is local per browser/device due localStorage persistence.
- No authentication/authorization model.
- Public funnel and order data are not server-backed.
- Many shadcn components are scaffolded but not all are used in active flows.
- Some UI strings show character encoding artifacts from source text.
- Marketing landing has dynamic SEO tags updated at runtime based on selected language.

## 10) Security and privacy baseline

- No secrets or API keys in current code path.
- Customer order data (PII) is stored in plain localStorage, so it is client-visible.
- This is suitable for prototype/local usage, not for production data compliance.
