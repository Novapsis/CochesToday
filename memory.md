# Resumen del Proyecto CochesToday - Sesión del 11 de Octubre de 2025

## Estado Inicial
El proyecto partió de una plantilla de Next.js con dependencias rotas y sin configuración de entorno, lo que impedía su ejecución.

## Hitos Alcanzados

### 1. Depuración del Entorno de Desarrollo
- **Conflicto de Dependencias:** Se solucionaron múltiples conflictos de `npm` (`react-day-picker` vs `date-fns`/`react@19`) para poder instalar los paquetes del proyecto.
- **Configuración de Variables de Entorno (`.env`):** Se diagnosticaron y corrigieron varios problemas de conexión con la base de datos de Supabase:
    - Se renombró `.env.local` a `.env` para compatibilidad con Prisma CLI.
    - Se corrigió la contraseña de la base de datos.
    - Se cambió la URL de conexión del *pooler* a la **URL de conexión directa** (puerto 5432) para permitir migraciones de schema.
- **Sincronización de la Base de Datos:** Se ejecutó `prisma db push` con éxito, creando la estructura de tablas inicial en Supabase.

### 2. Migración Completa de Autenticación: Clerk → Supabase
Se realizó una migración integral del sistema de autenticación para eliminar la dependencia de Clerk y centralizar todo en Supabase.
- **Middleware (`middleware.js`):** Se reemplazó el middleware de Clerk por uno nuevo de Supabase para gestionar sesiones y proteger rutas.
- **Lógica de Autenticación (`AuthProvider.jsx`):** Se creó un `AuthProvider` personalizado y robusto que:
    1.  Gestiona el estado de sesión de Supabase.
    2.  Llama a una nueva **Acción de Servidor (`actions/user.js`)** para sincronizar al usuario con la base de datos interna de Prisma, obteniendo su perfil completo (incluyendo el `rol`).
- **Componentes de UI:** Se refactorizaron todos los componentes que usaban Clerk:
    - `app/(auth)/...`: Se reemplazaron las páginas de `sign-in` y `sign-up` por la UI de Supabase.
    - `components/header.jsx`: Se eliminaron `<UserButton>`, `<SignedIn>`, etc., y se reemplazaron con lógica condicional basada en el nuevo `useAuth`.
    - `app/page.js`, `components/car-card.jsx`: Se eliminaron las últimas referencias a Clerk que causaban errores de compilación.
- **Limpieza:** Se desinstaló el paquete `@clerk/nextjs`.

## Estado Actual
El proyecto se encuentra en un estado **estable y funcional**. Arranca correctamente con `npm run dev` y utiliza un sistema de autenticación unificado y moderno basado 100% en Supabase. La base técnica para construir las funcionalidades del marketplace está lista.

# Solución definitiva al error de autenticar con Google

## Síntomas observados
- Google OAuth no creaba sesión ni usuario en `auth.users` tras el login.
- En navegador no aparecía error claro; a veces el flujo volvía a la app sin sesión.
- Logs de Supabase Auth mostraban:
  - `400 Unsupported provider: provider is not enabled` (intentos iniciales)
  - `500 Unable to exchange external code ... oauth2: "invalid_client" "Unauthorized"` (después)
- Tras login con Google, `next/image` fallaba con avatar de Google: dominio no permitido.

## Causa raíz
- Proveedor Google con credenciales/URIs desincronizadas entre Supabase y Google Cloud (provocando `invalid_client`).
- Falta de persistencia de cookies en el callback al redirigir inmediatamente (sesión no se pegaba).
- Falta de dominio `lh3.googleusercontent.com` en `next.config.mjs` para `next/image` (rompía el render del avatar).

## Cambios aplicados (código)
- `app/auth/callback/route.js`
  - Cambiado a `createServerClient` de `@supabase/ssr` con binding de cookies en la respuesta para persistir la sesión antes del redirect.
  - Respeta `?redirect=/ruta` y añade logging: intercambio de código y `checkUser()`.
- `components/auth/AuthProvider.jsx`
  - `signOut()` ahora redirige a la home (`router.replace('/')`) tras cerrar sesión.
- `next.config.mjs`
  - Añadido host de Google para avatares: `lh3.googleusercontent.com` en `images.remotePatterns`.
- `app/(auth)/sign-in/[[...sign-in]]/page.jsx` y `app/(auth)/sign-up/[[...sign-up]]/page.jsx`
  - Formularios más anchos (`max-w-xl`) y sólo Google + Magic Link.
  - `redirectTo` apunta a `/auth/callback?redirect=...`.
- `components/header.jsx`
  - Estilo modernizado; navegación central: `Explorar` y `Publicar`.
  - Eliminado link "Mi Perfil" del menú central para no logeados.
  - En la derecha, para logeados, sólo avatar como acceso al perfil y botón de "Cerrar Sesión".
- `actions/car-listing.js`
  - `getCarFilters()` actualizado a esquema actual (usa `CarBrand` y deduplica `bodyType/fuelType/transmission`).

## Cambios y verificaciones (configuración)
- Supabase Dashboard → Authentication → Providers → Google:
  - Activado "Enabled".
  - Configurados `Client ID` y `Client Secret` correctos desde Google Cloud.
  - Copiada la "Authorize redirect URI" exacta.
- Google Cloud Console → OAuth 2.0 Client (tipo Web application):
  - `Authorized redirect URIs` incluye exactamente:
    - `https://<project-ref>.supabase.co/auth/v1/callback`
  - (Opcional para local) `http://localhost:3000/auth/callback`.
  - Si el Consent Screen está en "Testing", añadir correos en "Test users".
- Supabase Dashboard → Authentication → URL Configuration:
  - `Site URL`: `http://localhost:3000` durante desarrollo.
  - `Redirect URLs`: incluir `http://localhost:3000/**`.

## Validación
- Logs del servidor Next.js muestran:
  - `[auth/callback] code present, attempting session exchange`
  - `[auth/callback] session exchange ok, user id: ...`
  - `[auth/callback] checkUser completed for: ...`
- Usuario aparece en Supabase → Authentication → Users y queda autenticado en la app.
- Avatar de Google renderiza correctamente (sin error de dominio de imágenes).

## Referencias útiles
- Guía completa de diagnóstico: `GOOGLE_AUTH_DEBUG.md`.
- Guía de Storage y subida de imágenes (avatars/cars): `SUPABASE_STORAGE_SETUP.md`.
