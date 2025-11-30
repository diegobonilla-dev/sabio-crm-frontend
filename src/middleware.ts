import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Clave secreta para verificar JWT (debe coincidir con el backend)
const getSecretKey = () => {
  const secret = process.env.JWT_SECRET || 'estaEsUnaClaveSecretaLargaYComplejaParaSaBio123';
  return new TextEncoder().encode(secret);
};

// Rutas que requieren autenticación
const protectedRoutes = ['/admin', '/crm', '/fincas', '/settings'];

// Rutas solo para usuarios NO autenticados
const authRoutes = ['/login'];

// Rutas que requieren rol específico de admin
const adminOnlyRoutes = ['/admin/usuarios'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Obtener token de la cookie
  const token = request.cookies.get('sabio-auth-token')?.value;

  // Verificar si es una ruta protegida
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Verificar si es una ruta de autenticación
  const isAuthRoute = authRoutes.some(route =>
    pathname.startsWith(route)
  );

  // CASO 1: Ruta protegida sin token → Redirigir a login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // CASO 2: Hay token, verificarlo
  if (token) {
    try {
      // Verificar y decodificar el JWT
      const { payload } = await jwtVerify(token, getSecretKey());

      // Si está autenticado y trata de ir a /login → Redirigir a dashboard
      if (isAuthRoute) {
        const adminUrl = new URL('/admin', request.url);
        return NextResponse.redirect(adminUrl);
      }

      // Verificar rutas que requieren rol de administrador
      const isAdminOnlyRoute = adminOnlyRoutes.some(route =>
        pathname.startsWith(route)
      );

      if (isAdminOnlyRoute && payload.role !== 'sabio_admin') {
        // Usuario no es admin, redirigir a página principal con código 403
        const adminUrl = new URL('/admin', request.url);
        return NextResponse.redirect(adminUrl);
      }

      // Token válido, agregar información del usuario a los headers
      // Esto permite que los componentes server-side accedan a la info del usuario
      const response = NextResponse.next();
      response.headers.set('x-user-id', payload.id as string);
      response.headers.set('x-user-email', payload.email as string);
      response.headers.set('x-user-role', payload.role as string);

      return response;

    } catch (error) {
      // Token inválido o expirado
      console.error('Error verificando JWT:', error);

      // Si está en ruta protegida, redirigir a login y limpiar cookie
      if (isProtectedRoute) {
        const loginUrl = new URL('/login', request.url);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('sabio-auth-token');
        return response;
      }

      // Si está en ruta pública, solo limpiar cookie
      const response = NextResponse.next();
      response.cookies.delete('sabio-auth-token');
      return response;
    }
  }

  // Sin token en ruta pública → Permitir acceso
  return NextResponse.next();
}

// Configurar qué rutas ejecutan el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
