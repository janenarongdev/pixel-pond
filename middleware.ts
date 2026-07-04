import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Built directly from the edge-safe config (no Prisma adapter) so this
// middleware bundle never pulls in Node-only database code.
const { auth } = NextAuth(authConfig);

const PLAYER_ROUTES = [
  "/dashboard",
  "/fishing",
  "/inventory",
  "/collection",
  "/market",
  "/shop",
  "/profile",
];

const ADMIN_ROUTES = ["/admin"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;
  const role = req.auth?.user?.role;

  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));
  const isPlayerRoute = PLAYER_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (!isAuthenticated && (isPlayerRoute || isAdminRoute)) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && role !== "admin") {
    const dashboardUrl = new URL("/dashboard", req.nextUrl.origin);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/fishing/:path*",
    "/inventory/:path*",
    "/collection/:path*",
    "/market/:path*",
    "/shop/:path*",
    "/profile/:path*",
    "/admin/:path*",
  ],
};
