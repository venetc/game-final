import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import type { NextRequest } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") || // exclude Next.js internals
    pathname.startsWith("/api") || //  exclude all API routes
    pathname.startsWith("/static") || // exclude static files
    PUBLIC_FILE.test(pathname) // exclude all files in the public folder
  )
    return NextResponse.next();

  const token = await getToken({ req, secret: "super-secret" });

  if (!token) return pathname.startsWith("/auth")
    ? pathname.startsWith('/auth/notification')
      ? NextResponse.redirect(new URL("/auth/sign-up", req.url))
      : NextResponse.next()
    : NextResponse.redirect(new URL("/auth/sign-up", req.url));


  const { isApproved, emailConfirmed } = token;

  if (!isApproved || !emailConfirmed) return pathname.startsWith("/auth/notification")
    ? NextResponse.next()
    : NextResponse.redirect(new URL("/auth/notification", req.url));

  if (pathname.startsWith("/auth")) {
    if (pathname.startsWith("/auth/password-reset")) return NextResponse.next();
    if (pathname.startsWith("/auth/notification")) return NextResponse.redirect(new URL("/", req.url));

    return NextResponse.redirect(new URL("/", req.url));
  }
}
