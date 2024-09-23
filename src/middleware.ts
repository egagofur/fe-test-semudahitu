import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  if(pathname === "/") {
    return redirectTo("/dashboard", request);
  }

  const publicRoutes = ["/sign-up", "/register"];
  if (publicRoutes.includes(pathname)) {
    if (token) {
      return redirectTo("/dashboard", request);
    }
    return NextResponse.next();
  }

  if (!token) {
    return redirectTo("/sign-up", request);
  }

  return NextResponse.next();
}

function redirectTo(path: string, request: NextRequest) {
  return NextResponse.redirect(new URL(path, request.url));
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-up", "/register", "/"],
};
