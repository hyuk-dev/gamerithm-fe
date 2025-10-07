import { NextRequest, NextResponse } from "next/server";
import { OPENID_NS, STEAM_OPENID_PROVIDER } from "@/constants/steam";
import { getSiteOrigin } from "@/constants/steam";

function extractSteamIdFromClaimedId(claimedId: string | null): string | null {
  if (!claimedId) return null;
  const match = claimedId.match(
    /https?:\/\/steamcommunity\.com\/openid\/id\/(\d+)/
  );
  return match ? match[1] : null;
}

async function verifyWithProvider(params: URLSearchParams): Promise<boolean> {
  const verifyParams = new URLSearchParams(params);
  verifyParams.set("openid.mode", "check_authentication");

  const res = await fetch(STEAM_OPENID_PROVIDER, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: verifyParams.toString(),
  });

  const text = await res.text();
  return text.includes("is_valid:true");
}

export async function GET(req: NextRequest) {
  const origin = getSiteOrigin();
  const url = new URL(req.url);
  const params = url.searchParams;

  // Basic validation
  if (params.get("openid.ns") !== OPENID_NS) {
    return NextResponse.redirect(`${origin}/login?error=invalid_openid`);
  }

  const isValid = await verifyWithProvider(params);
  if (!isValid) {
    return NextResponse.redirect(`${origin}/login?error=verification_failed`);
  }

  const steamId = extractSteamIdFromClaimedId(params.get("openid.claimed_id"));
  if (!steamId) {
    return NextResponse.redirect(`${origin}/login?error=steamid_missing`);
  }

  // For demo: store session in a simple cookie (httpOnly recommended)
  const response = NextResponse.redirect(`${origin}/dashboard`);
  response.cookies.set(
    "session",
    JSON.stringify({ provider: "steam", steamId }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: origin.startsWith("https"),
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    }
  );
  return response;
}
