import { NextResponse } from "next/server";

export function middleware(request: Request) {
  // Store current request url in a custom header, which you can read later
  const url = new URL(request.url);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", url.pathname);

  return NextResponse.next({
    request: {
      // Apply new request headers
      headers: requestHeaders,
    },
  });
}
