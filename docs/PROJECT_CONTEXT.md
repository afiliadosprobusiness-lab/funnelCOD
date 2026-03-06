# PROJECT_CONTEXT - FunnelCOD

Last updated: 2026-03-06

## Resumen rapido

FunnelCOD es una app frontend (Vite + React + TS) para crear funnels COD, publicarlos y registrar ordenes, todo en `localStorage`.

## Stack real

- Vite 5, React 18, TypeScript
- Tailwind CSS + shadcn-ui (Radix)
- dnd-kit para drag and drop del editor
- framer-motion para animaciones
- zod para validacion del formulario COD
- Vitest (setup presente, cobertura minima)
- Plugin de build activo: `@vitejs/plugin-react-swc` (sin taggers externos)

## Arquitectura

- `src/main.tsx`: bootstrap de app.
- `src/App.tsx`: providers y rutas.
- `src/pages/*`: vistas por ruta (`LandingPage`, `Dashboard`, `Editor`, `Preview`, `Orders`, `PublishedFunnel`).
- `src/components/editor/*`: piezas del editor visual y render de elementos.
- `src/store/funnel-store.ts`: capa de persistencia local y acciones de dominio.
- `src/types/funnel.ts`: tipos compartidos.

## Rutas principales

- `/`
- `/dashboard`
- `/editor/:id`
- `/preview/:id`
- `/orders`
- `/f/:slug`
- `*` (404)

## Persistencia y contrato de datos

- `localStorage` keys:
  - `cod_funnels`
  - `cod_orders`
  - `funnelcod_lang` (preferencia de idioma en landing)
- Modelos base:
  - `Funnel` con `pages`, `product`, `published`, timestamps.
  - `FunnelElement` por tipo + props dinamicas.
  - `Order` con estado (`new`, `confirmed`, `shipped`, `delivered`, `cancelled`).

Ver contrato detallado en `docs/contract.md`.

## Flujos clave

1. Crear funnel en dashboard -> se generan paginas default.
2. Editar funnel en `/editor/:id` -> agregar/reordenar/editar elementos.
3. Publicar funnel -> disponible en `/f/:slug`.
4. Capturar orden COD desde formulario -> guardar en `cod_orders`.
5. Gestionar ordenes en `/orders` (filtro + cambio de estado).
6. Landing en dark mode con selector de idioma (`es/en`), anchors funcionales, testimonios con scroll horizontal manual y FAQ en acordeon.
7. Las tarjetas de testimonios muestran nombre, cargo y handle, con contenido orientado a uso real del producto.

## Integraciones y env vars

- No hay backend/API activa.
- Landing usa una imagen hero local, imagenes referenciales externas para features/testimonios y fallbacks locales.
- No hay variables de entorno requeridas.
- React Query esta montado, pero sin queries/mutations implementadas.

## Riesgos y limites actuales

- Datos locales por navegador (no sincronizacion multiusuario).
- Sin autenticacion/autorizacion.
- PII de clientes almacenada en localStorage en texto plano.
- Cobertura de tests actual muy baja.
