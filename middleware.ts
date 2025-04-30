import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { updateSession } from "./lib/auth"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/login" ||
    path === "/" ||
    path.startsWith("/forgot-password") ||
    path.startsWith("/api/auth/login") || // Allow access to login API
    !path.startsWith("/dashboard")

  try {
    const session = await updateSession(request)

    // Redirect to login if trying to access a protected route without authentication
    if (!isPublicPath && !session) {
      console.log(`Redirecting to login from ${path} - No session`)
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Redirect to dashboard if already logged in and trying to access login page
    if (isPublicPath && session && (path === "/login" || path === "/forgot-password")) {
      console.log(`Redirecting to dashboard from ${path} - Already logged in`)
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)

    // If there's an error in the middleware, redirect to login for protected routes
    if (!isPublicPath) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next()
  }
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
