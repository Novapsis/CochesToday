import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name, options) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session
  const { data: { user } } = await supabase.auth.getUser();

  // Protected routes logic
  const protectedRoutes = ['/admin', '/saved-cars', '/profile', '/publish'];
  const { pathname } = request.nextUrl;

  // Redirigir a login si no está autenticado y accede a rutas protegidas
  if (!user && protectedRoutes.some(path => pathname.startsWith(path))) {
    const url = request.nextUrl.clone()
    url.pathname = '/sign-in'
    url.searchParams.set('redirect', pathname) // Guardar la URL de destino
    return NextResponse.redirect(url)
  }

  // Verificar permisos de admin para rutas /admin
  if (user && pathname.startsWith('/admin')) {
    try {
      // Importar dinámicamente para evitar problemas de edge runtime
      const { db } = await import('@/lib/prisma');
      
      const adminUser = await db.adminUser.findUnique({
        where: { userId: user.id },
      });

      // Si no es admin, redirigir a home
      if (!adminUser) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      // En caso de error, permitir el acceso y dejar que la página maneje la autorización
    }
  }

  return response
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}