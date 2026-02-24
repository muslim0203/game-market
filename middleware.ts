import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const adminProtectedPaths = ["/admin/dashboard", "/admin/products", "/admin/orders", "/admin/accounts"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!adminProtectedPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token?.userId || token.role !== "ADMIN") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.searchParams.set("callbackUrl", pathname);

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/admin/products/:path*", "/admin/orders/:path*", "/admin/accounts/:path*"]
};
