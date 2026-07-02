# Mockear customerApi (y cartApi) con MSW

## Contexto

Actualmente no hay backend corriendo, así que las peticiones de `customerApi`
(`getCustomer`, `removeCustomerItem` en
[customer-api-slice.ts](../packages/customer/services/src/lib/customer/customer-api-slice.ts))
y de `cartApi` (misma estructura, en
[cart-api.ts](../packages/checkout/services/src/lib/cart/cart-api.ts)) fallan porque
`fetchBaseQuery({ baseUrl: '/api' })` no tiene nada que responder. El objetivo es
usar **MSW (Mock Service Worker)** para interceptar esas llamadas en el navegador
durante desarrollo (`nx serve`) y devolver datos de ejemplo, sin tocar el backend
real ni añadir infraestructura de mocking en tests (decisión del usuario: solo
navegador).

Se confirmó con el usuario:
- Mockear **tanto `customerApi` como `cartApi`** (comparten el mismo patrón
  `fetchBaseQuery`, así que se dejan ambos listos).
- Solo interceptar en el **navegador** (Vite dev server), no en Vitest.
- Datos mock **genéricos**, respetando los tipos existentes tal cual están hoy
  (incluyendo que `address`/`password` sean `number` en `CustomerItem`).
- El mock **no debe activarse siempre que se corra `nx dev`/`nx serve`**: en el
  futuro se conectará un backend real, así que el modo mock debe quedar aparte,
  invocable con comandos propios (`mock:dev` / `mock:serve`), y `nx dev`/`nx serve`
  normales deben quedar libres para apuntar a un servidor real sin tocar código.

No existe ningún setup de MSW en el repo (`msw` no está instalado; no hay
`mockServiceWorker.js` en ningún `public/`). Solo hay una app consumidora,
`apps/mi-ecommerce`, así que los mocks viven localmente ahí (`src/mocks/`),
sin crear un paquete compartido nuevo.

## Pasos

### 1. Instalar MSW e inicializar el service worker

Desde la raíz del repo:

```bash
npm install --save-dev msw --workspace=@mi-ecommerce/mi-ecommerce
cd apps/mi-ecommerce
npx msw init public --save
cd ../..
```

Esto agrega `msw` como devDependency en
[apps/mi-ecommerce/package.json](../apps/mi-ecommerce/package.json), genera
`apps/mi-ecommerce/public/mockServiceWorker.js` y añade el campo `"msw": { "workerDirectory": ["public"] }`
al `package.json` de la app. Vite sirve `public/` en la raíz por defecto (ya lo
hace hoy con `favicon.ico`), así que el worker queda accesible en
`/mockServiceWorker.js` sin tocar `vite.config.mts`.

### 2. Crear los handlers — `apps/mi-ecommerce/src/mocks/handlers.ts`

Reutiliza los tipos ya exportados por los paquetes de servicios
(`@mi-ecommerce/customer-services`, `@mi-ecommerce/checkout-services`) para que
los datos mock no se desalineen de los contratos reales:

```ts
import { http, HttpResponse } from 'msw';
import type { Cart, CartItem } from '@mi-ecommerce/checkout-services';
import type { Customers, CustomerItem } from '@mi-ecommerce/customer-services';

const mockCartItems: CartItem[] = [
  { id: 'item-1', productName: 'Sample Product', price: 19.99, quantity: 2 },
  { id: 'item-2', productName: 'Another Product', price: 9.99, quantity: 1 },
];

const mockCustomerItem: CustomerItem = {
  id: 'customer-1',
  name: 'Jane Doe',
  address: 123,
  password: 1234,
};

export const handlers = [
  http.get('/api/carts/:cartId', ({ params }) => {
    const cart: Cart = { id: params.cartId as string, items: mockCartItems };
    return HttpResponse.json(cart);
  }),

  http.delete('/api/carts/:cartId/items/:itemId', () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('/api/customers/:id', ({ params }) => {
    const customers: Customers = {
      id: params.id as string,
      customers: [{ ...mockCustomerItem, id: params.id as string }],
    };
    return HttpResponse.json(customers);
  }),

  http.delete('/api/customers/:customerId', () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
```

Los handlers devuelven el `id` de la URL en la respuesta, así que cualquier
`cartId`/`customerId` que se navegue en la app resuelve sin necesitar un id
"mágico" fijo.

### 3. Configurar el worker — `apps/mi-ecommerce/src/mocks/browser.ts`

```ts
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
```

### 4. Arrancar el worker antes del render — modificar `apps/mi-ecommerce/src/main.tsx`

Gatear con `import.meta.env.DEV` **y** una variable propia
(`VITE_ENABLE_MOCKS`, ver paso 5) — no solo con `DEV` — para que el mock no se
active cada vez que alguien corra `nx dev`/`nx serve` normales, sino únicamente
bajo el modo mock dedicado. Se espera a que el worker arranque antes de montar
la app, para que las llamadas de RTK Query que se disparan al montar ya estén
interceptadas:

```tsx
import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { store } from './app/store';

async function enableMocking() {
  if (!import.meta.env.DEV || import.meta.env.VITE_ENABLE_MOCKS !== 'true') {
    return;
  }

  const { worker } = await import('./mocks/browser');
  return worker.start({ onUnhandledRequest: 'bypass' });
}

enableMocking().then(() => {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );

  root.render(
    <StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <App/>
        </BrowserRouter>
      </Provider>
    </StrictMode>
  );
});
```

`onUnhandledRequest: 'bypass'` evita warnings en consola para peticiones no
mockeadas (HMR websocket, favicon, etc.).

### 5. Modo mock separado — `mock:dev` / `mock:serve`

Objetivo: que `nx dev mi-ecommerce` / `nx serve mi-ecommerce` (o sus variantes
`npm run` normales) **no** activen el mock, para que el día que se conecte un
backend real no haya que tocar código — y que exista un comando explícito para
levantar la app con MSW.

**Por qué no un target de Nx llamado `mock:serve`:** el CLI de Nx interpreta
`:` como separador `proyecto:target:configuration`, así que un target
literalmente llamado `mock:serve` obligaría a invocarlo entre comillas
(`nx run mi-ecommerce:"mock:serve"`), y los targets `dev`/`serve` que genera el
plugin inferido de `@nx/vite` son solo el comando `vite` (ver
`node_modules/@nx/vite/dist/src/plugins/plugin.js`, función `serveTarget`) sin
soporte documentado de `configurations` para targets inferidos. En cambio, los
**scripts de npm sí aceptan `:` libremente** en su nombre, y Nx reenvía
cualquier argumento después de `--` al comando `vite` subyacente.

**a) Variable de entorno de modo — `apps/mi-ecommerce/.env.mock`**

```
VITE_ENABLE_MOCKS=true
```

Vite carga automáticamente `.env.mock` (además de `.env`/`.env.local`) cuando
se ejecuta con `--mode mock`, y expone cualquier variable con prefijo `VITE_`
en `import.meta.env` del código cliente.

**b) Scripts en el `package.json` raíz**

```json
"scripts": {
  "mock:dev": "nx dev mi-ecommerce -- --mode mock",
  "mock:serve": "nx serve mi-ecommerce -- --mode mock"
}
```

Con esto:
- `npm run mock:dev` / `npm run mock:serve` → corren Vite en modo `mock`,
  cargan `.env.mock`, y `main.tsx` activa el worker de MSW.
- `npx nx dev mi-ecommerce` / `npx nx serve mi-ecommerce` (sin el flag) →
  siguen funcionando igual que hoy, sin mocks, listos para apuntar a un
  backend real vía `fetchBaseQuery({ baseUrl: '/api' })` con un proxy o backend
  corriendo detrás de `/api`.

## Archivos afectados

- `apps/mi-ecommerce/package.json` — nueva devDependency `msw` + campo `msw.workerDirectory`
- `apps/mi-ecommerce/public/mockServiceWorker.js` — generado por `msw init`, no se edita a mano
- `apps/mi-ecommerce/src/mocks/handlers.ts` — nuevo
- `apps/mi-ecommerce/src/mocks/browser.ts` — nuevo
- `apps/mi-ecommerce/src/main.tsx` — modificado para arrancar el worker (gateado por `DEV` + `VITE_ENABLE_MOCKS`)
- `apps/mi-ecommerce/.env.mock` — nuevo, define `VITE_ENABLE_MOCKS=true`
- `package.json` (raíz) — nuevos scripts `mock:dev` y `mock:serve`

No se requieren cambios en `vite.config.mts`, `tsconfig.app.json` ni en los
`*-api-slice.ts` existentes.

## Verificación

```bash
npm run mock:serve
```

1. Confirmar que existe `apps/mi-ecommerce/public/mockServiceWorker.js` tras el paso 1.
2. Abrir `http://localhost:4200/`, revisar la consola del navegador: debe aparecer `[MSW] Mocking enabled.`
3. Navegar a `http://localhost:4200/cart/test-cart` → la página debe mostrar los items mock ("Sample Product", "Another Product") en vez de error/vacío.
4. Navegar a `http://localhost:4200/customer/test-customer` → debe mostrar el customer mock ("Jane Doe").
5. En la pestaña Network del DevTools, confirmar que `GET /api/carts/test-cart` y `GET /api/customers/test-customer` devuelven `200` y aparecen como interceptadas por el service worker (icono MSW / origen `(ServiceWorker)`).
6. Probar el botón de "remove" en cada página y confirmar que el `DELETE` devuelve `204` y el item desaparece (update optimista de RTK Query).
7. Correr `npx nx serve mi-ecommerce` (sin `mock:`) y confirmar que **no** aparece `[MSW] Mocking enabled.` en consola ni el ícono de service worker en Network — así se verifica que el modo normal quedó libre para un backend real.
8. Opcional: correr `npx nx build mi-ecommerce` y verificar que el bundle de producción no incluye `mocks/browser` (el gate por `DEV` debe eliminarlo en el build).
