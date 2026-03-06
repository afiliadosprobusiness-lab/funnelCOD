# PROJECT_CONTEXT - FunnelCOD

Last updated: 2026-03-06

## Resumen rapido

FunnelCOD es una app frontend (Vite + React + TS) para crear funnels COD, publicarlos segun plan y gestionar pedidos, con autenticacion local (email/password + Google) y consola superadmin.

## Stack real

- Vite 5, React 18, TypeScript
- Tailwind CSS + shadcn-ui (Radix)
- dnd-kit para drag and drop del editor
- framer-motion para animaciones
- zod para validacion del formulario COD
- Vitest (con pruebas criticas de auth/planes)
- Plugin de build activo: `@vitejs/plugin-react-swc`
- Deploy en hosting: Firebase Hosting (CLI)

## Arquitectura

- `src/main.tsx`: bootstrap de app.
- `src/App.tsx`: providers y rutas protegidas.
- `src/pages/*`: vistas por ruta (`LandingPage`, `AuthPage`, `Dashboard`, `Editor`, `Preview`, `Orders`, `SuperadminPage`, `PublishedFunnel`).
- `src/components/auth/*`: guard de rutas y boton Google.
- `src/components/editor/*`: piezas del editor visual y render.
- `src/store/auth-store.ts`: usuarios/sesion/superadmin.
- `src/store/funnel-store.ts`: funnels/pedidos y reglas de publicacion por plan.
- `src/types/*`: tipos compartidos.

## Rutas principales

- `/`
- `/auth`
- `/dashboard` (protegida)
- `/editor/:id` (protegida + ownership)
- `/preview/:id` (protegida + ownership)
- `/orders` (protegida)
- `/superadmin` (solo superadmin)
- `/f/:slug`
- `*` (404)

## Persistencia y contrato de datos

- `localStorage` keys:
  - `cod_funnels`
  - `cod_orders`
  - `cod_users`
  - `cod_session`
  - `funnelcod_lang`
- Modelos base:
  - `Funnel` (con `ownerId?`, `pages`, `product`, `published`).
  - `Order` (con `ownerId?` y estados de pedido).
  - `AppUser` (`provider`, `role`, `plan`, `status`).
  - `AuthSession` (`userId`).

Ver detalle mecanico en `docs/contract.md`.

## Flujos clave

1. Registro/Login en `/auth` (email-password o Google).
2. Dashboard: crear funnels asignados al usuario.
3. Editor: editar funnel con control de ownership.
4. Publicar funnel con limites por plan:
   - Free: no publica.
   - Pro: hasta 2 funnels publicados.
   - Master: ilimitado.
5. Captura de orden COD en `/f/:slug` -> guarda pedido con owner.
6. Gestion de pedidos en `/orders`.
7. Superadmin en `/superadmin`: activar/desactivar usuarios y cambiar planes (no eliminable/desactivable).
8. Landing: orden visual principal actualizado a Hero -> Testimonios -> Features -> How it works -> Pricing -> FAQ.

## Integraciones y env vars

- Sin backend/API activa.
- Google Identity Services opcional para login con Google.
- Firebase Hosting conectado por CLI:
  - Proyecto: `funnelcod-20260306`
  - Archivos: `.firebaserc`, `firebase.json`
- Env var opcional:
  - `VITE_GOOGLE_CLIENT_ID` (documentado en `.env.example`).

## Riesgos y limites actuales

- Datos locales por navegador (sin sincronizacion multiusuario real).
- Seguridad de credenciales limitada por ser frontend-only.
- PII de clientes y datos de usuarios almacenados en localStorage en texto legible por cliente.
