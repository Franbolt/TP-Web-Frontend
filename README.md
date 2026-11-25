# TP Web — Frontend (Angular)

SPA que consume **exclusivamente** la API del backend de este TP. Permite listar, crear, editar y borrar categorías y recetas, filtrar recetas por categoría y mostrar errores del servidor.

## Stack

Angular 22 (componentes standalone, zoneless), `signals` para el estado de pantalla, formularios reactivos, `HttpClient` y `Router`. Node 24 fijado en `.nvmrc`.

## Requisitos

- Node.js 24
- Backend corriendo en `http://localhost:3000` (o la URL de Render si se usa producción)

## Arranco local

```bash
npm install
npm start          # http://localhost:4200
```

La URL de la API se define en `src/environments/environment.ts` (`http://localhost:3000`). Para desarrollo no hace falta tocar nada.

## Rutas

| Ruta | Componente | Función |
| --- | --- | --- |
| `/` | redirect | va a `/categorias` |
| `/categorias` | `Categorias` | listado, alta/borrado y link a edición |
| `/categorias/nueva` | `CategoriaForm` | alta de categoría |
| `/categorias/:id/editar` | `CategoriaForm` | edición de categoría |
| `/recetas` | `Recetas` | listado con filtro por categoría |
| `/recetas/nueva` | `RecetaForm` | alta de receta |
| `/recetas/:id/editar` | `RecetaForm` | edición de receta |

El menú usa `routerLink` y el layout tiene un único `<router-outlet />` en `app.html`.

## Estructura

```text
src/app/
  app.routes.ts       rutas de la SPA
  app.config.ts       provideRouter + provideHttpClient
  app.html            menú y router-outlet
  models/             interfaces Categoria, Receta, RecetaData
  services/           CategoriasService y RecetasService (CRUD + filtro)
  categorias/         listado y formulario de categoría
  recetas/            listado y formulario de receta
src/environments/     apiUrl de desarrollo y de producción
public/_redirects     redirección SPA para Netlify
```

## Servicios y formularios

- Los servicios usan `inject(HttpClient)` y arman las URLs con `environment.apiUrl` + `/categorias` o `/recetas`.
- El filtro de recetas llama a `GET /recetas?categoria=1`; el `<select>` usa esa misma selección.
- En el formulario de receta el `<select>` usa `[ngValue]`: con `[value]` el `idCategoria` viajaba como string y el backend respondía `400`. Con `[ngValue]` llega como número.
- Validaciones: categoría `nombre` obligatorio (máx. 50); receta `idCategoria`, `nombre` (máx. 100), `tiempo`, `porciones` (mín. 1) e `ingredientes`/`preparacion` obligatorios.
- Los errores de la API se muestran con el `message` que devuelve el backend. En especial, el `409` al borrar una categoría con recetas.

## Build

```bash
npm run build
```

Angular 22 deja el sitio en `dist/tp-web-frontend/browser` (no en `dist/` directamente).

## Deploy en Netlify

- `netlify.toml` fija `command = "npm run build"` y `publish = "dist/tp-web-frontend/browser"`, para que no dependa de la UI.
- `public/_redirects` contiene `/* /index.html 200`: sin esto, entrar directo a `/recetas/nueva` daría 404 en Netlify (en `ng serve` funcionaba porque el dev server ya hace ese fallback).
- `environment.production.ts` apunta a `https://tp-web-backend-jejw.onrender.com` y `angular.json` lo reemplaza automáticamente en el build de producción.
- El sitio debe estar **público** en `Project configuration → General → Visitor access → Project visibility`.
- URL desplegada: `https://tp-web-frontend.netlify.app/`

## Scripts

`npm start`, `npm run build`, `npm test`.

## Documentación

- [Componentes](https://angular.dev/guide/components) · [Templates y `@if`/`@for`](https://angular.dev/guide/templates)
- [Formularios reactivos](https://angular.dev/guide/forms) · [HttpClient](https://angular.dev/guide/http) · [Routing](https://angular.dev/guide/routing)
- [Redirects de Netlify](https://docs.netlify.com/routing/redirects/)
