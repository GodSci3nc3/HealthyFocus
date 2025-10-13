import { NextResponse } from 'next/server'

export function middleware(request) {
  // Obtener el token del localStorage no es posible en middleware del servidor
  // Vamos a verificar si viene de una redirección de login
  const token = request.cookies.get('auth_token')?.value
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register')
  const isPublicPage = request.nextUrl.pathname === '/' || isAuthPage
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')

  // Si no hay token y trata de acceder a una página protegida
  if (!token && isDashboard) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Si hay token y trata de acceder a login/register, redirigir al dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register']
}