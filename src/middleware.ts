import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/sign-up", "/sign-in"];
  if (publicRoutes.includes(pathname)) {
    if (token) {
      return redirectTo("/dashboard", request);
    }
    return NextResponse.next();
  }

  if(!token && pathname === '/') {
    return redirectTo("/sign-in", request);
  }

  if(token && pathname === '/') {
    return redirectTo("/dashboard", request);
  }

  if (!token) {
    return redirectTo("/sign-in", request);
  }

  return NextResponse.next();
}

function redirectTo(path: string, request: NextRequest) {
  return NextResponse.redirect(new URL(path, request.url));
}

export const config = {
  matcher: ["/dashboard/:path*", "/", '/sign-in', '/sign-up'],
};
