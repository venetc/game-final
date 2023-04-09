import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

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

  const token = await getToken({
    req,
    secret: "super-secret",
  });

  if (token) {
    return pathname.startsWith("/auth")
      ? NextResponse.redirect(new URL("/", req.url))
      : NextResponse.next();
  } else {
    return !pathname.startsWith("/auth")
      ? NextResponse.redirect(new URL("/auth/sign-up", req.url))
      : NextResponse.next();
  }
}
