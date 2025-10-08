import { NextResponse } from "next/server";
import { getSiteOrigin } from "@/constants/steam";

export async function POST() {
  const origin = getSiteOrigin();
  const res = NextResponse.redirect(`${origin}/`);
  res.cookies.set("session", "", { path: "/", maxAge: 0 });
  return res;
}
