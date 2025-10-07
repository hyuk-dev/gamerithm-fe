import { NextResponse } from "next/server";
import {
  OPENID_IDENTIFIER_SELECT,
  OPENID_NS,
  STEAM_OPENID_PROVIDER,
} from "@/constants/steam";
import { getSiteOrigin } from "@/constants/steam";

export async function GET() {
  const origin = getSiteOrigin();
  const returnTo = `${origin}/api/auth/steam/callback`;

  const params = new URLSearchParams({
    "openid.ns": OPENID_NS,
    "openid.mode": "checkid_setup",
    "openid.return_to": returnTo,
    "openid.realm": origin,
    "openid.identity": OPENID_IDENTIFIER_SELECT,
    "openid.claimed_id": OPENID_IDENTIFIER_SELECT,
  });

  const redirectUrl = `${STEAM_OPENID_PROVIDER}?${params.toString()}`;
  return NextResponse.redirect(redirectUrl);
}
