import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("session")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const session = JSON.parse(sessionCookie);
    return NextResponse.json({ authenticated: true, session });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}
