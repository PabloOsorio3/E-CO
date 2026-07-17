# E-CO

Panel de administración (Ionic React + Redux Toolkit) para un negocio tipo restaurante/tienda: productos, marcas, categorías, subcategorías, pagos, pedidos, clientes y usuarios.

## Stack

- **UI/routing**: Ionic React + `@ionic/react-router` + `react-router-dom` v5
- **Estado**: Redux Toolkit (`@reduxjs/toolkit`), un slice por entidad
- **HTTP**: Axios, instancia única con interceptors (`src/api/instance/instance.ts`)
- **Auth**: JWT en `localStorage`, decodificado con `jwt-decode`
- **Notificaciones**: `sonner` (toasts), envuelto en `src/alerts/`
- **Build**: Vite + TypeScript, ESLint flat config (`@typescript-eslint/no-explicit-any` desactivado)

Comandos: `npm run dev`, `npm run build` (`tsc -b && vite build`), `npm run lint`, `npm run preview`.

Variable de entorno: `VITE_API_URL` (fallback `http://localhost:8000/api`).

## Arquitectura por capas

No hay organización por feature: todo está agrupado por tipo de archivo.

```
api/{admin/{get,post,put,delete}, login, signup, instance}/  → llamadas HTTP puras
store/slices/                                                → Redux Toolkit: estado + thunks
interface/                                                   → tipos TS por entidad (Base/Create/Update/Response)
pages/admin/<entidad>/                                       → vista + modal de esa entidad
components/shared/                                           → design system reutilizable (barrel en index.ts)
components/auth/                                             → ProtectedRoute (ver "Deuda técnica")
alerts/{success,error,info}/                                 → wrappers finos sobre sonner
core/current_user.ts                                         → helpers de sesión (token, rol, jwt-decode)
hooks/useAppInit.ts                                           → dispara fetch de catálogos base al montar App
services/                                                     → capa intermedia, casi sin uso real (ver "Deuda técnica")
```

## Convención: CRUD por entidad (patrón a replicar)

Cada entidad (product, brand, category, subcategory, status, payment, order, typeuser) repite el mismo esqueleto de 4 piezas. Al añadir una entidad nueva, seguir este patrón exactamente:

1. **`api/admin/{verbo}/xxx_<entidad>.ts`** — una función por operación HTTP, usando `axiosInstance` de `api/instance/instance.ts`, tipada contra `interface/<entidad>.interface.ts`. Ejemplo: `get_products.ts`, `post_product.ts`, `put_product.ts`, `delete_product.ts`.
2. **`interface/<entidad>.interface.ts`** — tipos `XBase`, `XCreate`, `XUpdate` (campos opcionales), `XResponse` (extiende `XBase` + id), `XDelete`, `XGetById`.
3. **`store/slices/<entidad>.slice.ts`** — un `createAsyncThunk` por operación (fetch/create/update/delete), cada uno con `try/catch` + `rejectWithValue(error.response?.data?.detail || 'mensaje en español')`. `extraReducers` maneja el trío `pending/fulfilled/rejected` actualizando `loading`/`error`/`items`.
4. **Registrar el reducer** en `store/store.ts`.
5. **Página** en `pages/admin/<entidad>/<Entidad>.tsx` — usa `useAppSelector`/`useAppDispatch`, `dispatch(thunk()).unwrap()` dentro de try/catch, muestra `showSuccessAlert`/`showErrorAlert`, y usa los componentes de `components/shared/` (`PageHeader`, `SearchBar`, `LoadingSpinner`, `EmptyState`, `ConfirmModal`, `StatusBadge`) para listar + un `<Entidad>Modal.tsx` para crear/editar.

Notas del patrón:
- Los joins entre entidades (ej. nombre de marca en la tabla de productos) se resuelven en memoria en el componente (`brands.find(...)`), no en el backend. No hay normalización de estado ni `reselect`.
- "Eliminar" en productos es soft-delete: dispara `updateProductThunk` cambiando `status_id`, no un DELETE real.
- Las rutas de `api/` no llevan prefijo `/admin` (ej. `/get_brand`, `/get_products`) — **excepto** `get_customer.ts`, que sí lo lleva (`/admin/get_customers`). Es una inconsistencia a resolver, no un patrón nuevo a seguir.

## Convenciones generales

- Mensajes de error/éxito de UI siempre en español, vía `showSuccessAlert`/`showErrorAlert` (nunca `alert()` nativo ni toasts inline).
- Componentes de página son `React.FC`, un archivo por página bajo `pages/admin/<entidad>/`, con su CSS asociado en `pages/css/<entidad>.css` importado directamente en el componente.
- Auth: token en `localStorage` bajo la key `token`; el interceptor de request en `instance.ts` lo inyecta como `Bearer`; el interceptor de response limpia sesión y redirige a `/` en un 401.
- `useAppInit` (llamado una vez en `App.tsx`) precarga catálogos globales (productos, categorías, subcategorías, marcas, status) — si se agrega una entidad que otras pantallas necesitan resolver por id (como brand/subcategory en Products), agregar su fetch ahí también.

## Estado del proyecto

Rama actual: `feature/customer` (aún no mergeada a `main`). Cambios sin commitear:

- **En progreso**: módulo de clientes (`Customer`) — `src/api/admin/get/get_customer.ts`, `src/store/slices/customer.slice.ts`, `src/pages/admin/customer/`, `src/pages/css/customer.css`, registrado en `store/store.ts` y enrutado en `App.tsx`.
- Modificados: `App.tsx` (ruta `/admin/customers`), `menuAdmin.tsx` + `menu.css` (ítem de menú para clientes, cambios grandes de estilo), `Products.tsx` (ajuste menor), `Login.tsx` (ajuste menor).

**El módulo de clientes todavía no sigue las convenciones del resto del proyecto** — antes de darlo por terminado, alinearlo:
- Falta `interface/customer.interface.ts` (el tipo `Customer` está definido inline en el slice).
- `customer.slice.ts` importa `axios` sin usarlo y no maneja `rejectWithValue` en el catch del thunk (usa `throw Error(error.message)`, con `error` implícitamente `unknown`).
- Queda un `console.log("respuesta", response)` de depuración en el thunk.
- El endpoint `/admin/get_customers` rompe la convención de rutas planas del resto de `api/admin/get/*`.

## Deuda técnica conocida (no introducir más de esto)

- `components/auth/ProtectedRoute.tsx` existe (con soporte de roles) pero **no se usa** en `App.tsx`; las rutas `/admin/*` están montadas sin guard de sesión.
- `services/` solo tiene `login.service.ts` y `product.service.ts`, y `product.service.ts` es un wrapper de una sola función sobre `api/` que nadie más usa — las páginas llaman a los thunks/slices directamente. No expandir esta capa sin decidir primero si se mantiene o se elimina.
