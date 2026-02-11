import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

function getPortalPathForRole(role?: string) {
  switch (role) {
    case "SUPER_ADMIN":
      return "/admin/dashboard";
    case "COLLEGE_ADMIN":
      return "/college";
    case "COMPANY_ADMIN":
      return "/company/dashboard";
    case "STUDENT":
      return "/student/dashboard";
    default:
      return "/login";
  }
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const url = req.nextUrl.clone();
  const { pathname } = url;

  let role: string | undefined;
  if (token) {
    try {
      const decoded: any = jwt.decode(token);
      role = decoded?.role;
    } catch {
      // ignore decode errors, treat as unauthenticated
    }
  }

  const isProtected =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/college") ||
    pathname.startsWith("/company") ||
    pathname.startsWith("/student");

  // If not logged in and hitting a protected route -> login
  if (isProtected && !token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If already logged in and visiting login root, send to their portal
  if ((pathname === "/" || pathname === "/login") && token && role) {
    url.pathname = getPortalPathForRole(role);
    return NextResponse.redirect(url);
  }

  if (!role) {
    // No role information; let backend enforce finer-grained auth
    return NextResponse.next();
  }

  // Admin area: only SUPER_ADMIN (others are redirected to their own portal)
  if (pathname.startsWith("/admin") && role !== "SUPER_ADMIN") {
    url.pathname = getPortalPathForRole(role);
    return NextResponse.redirect(url);
  }

  // College area: SUPER_ADMIN or COLLEGE_ADMIN
  if (
    pathname.startsWith("/college") &&
    role !== "SUPER_ADMIN" &&
    role !== "COLLEGE_ADMIN"
  ) {
    url.pathname = getPortalPathForRole(role);
    return NextResponse.redirect(url);
  }

  // Company area: SUPER_ADMIN or COMPANY_ADMIN
  if (
    pathname.startsWith("/company") &&
    role !== "SUPER_ADMIN" &&
    role !== "COMPANY_ADMIN"
  ) {
    url.pathname = getPortalPathForRole(role);
    return NextResponse.redirect(url);
  }

  // Student area: STUDENT only
  if (pathname.startsWith("/student") && role !== "STUDENT") {
    url.pathname = getPortalPathForRole(role);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/college/:path*",
    "/company/:path*",
    "/student/:path*",
    "/login",
    "/",
  ],
};
