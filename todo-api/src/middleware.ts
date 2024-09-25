import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./utils/session";

export async function middleware(request: NextRequest) {
  const isAuthed = await isAuthenticated(request);
  if (!isAuthed) {
    return NextResponse.json(
      { success: false, message: "authentication failed" },
      { status: 401 },
    );
  }
}

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const headers = request.headers;
  const authorization = headers.get("authorization");
  const token = authorization?.split(" ")[1];

  try {
    const payload = await decrypt(token);
    if (!payload) {
      return false;
    }
  } catch {
    return false;
  }
  return true;
}

export const config = {
  matcher: "/api/tasks",
};
