import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./utils/session";

async function checkToken(request: NextRequest) {
  const headers = request.headers;
  const token = headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return false;
  }
  const payload = await decrypt(token);
  if (!payload) {
    return false;
  }

  return true;
}

export async function middleware(request: NextRequest) {
  const hasValidToken = await checkToken(request);
  if (!hasValidToken) {
    return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/users/:path*", "/api/expenses/:path*"],
};
