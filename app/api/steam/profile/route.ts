import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("session")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let steamId = "";
  try {
    const session = JSON.parse(sessionCookie);
    steamId = session.steamId as string;
  } catch {
    return NextResponse.json({ error: "invalid_session" }, { status: 400 });
  }

  const apiKey = process.env.STEAM_API_KEY;
  if (!apiKey) {
    // Fallback: minimal profile if key is missing (avoid mock names)
    return NextResponse.json({
      steamId,
      name: "Steam User",
      avatar: "/placeholder-user.jpg",
      username: steamId,
    });
  }

  const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${encodeURIComponent(
    apiKey
  )}&steamids=${encodeURIComponent(steamId)}`;

  try {
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) {
      return NextResponse.json({ error: "steam_api_error" }, { status: 502 });
    }
    const data = await res.json();
    const player = data?.response?.players?.[0];
    if (!player) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const profile = {
      steamId,
      name: player.personaname as string,
      avatar: (player.avatarfull || player.avatar) as string,
      username: player.personaname as string,
      country: (player.loccountrycode as string) || undefined,
    };

    return NextResponse.json(profile);
  } catch (e) {
    return NextResponse.json({ error: "request_failed" }, { status: 500 });
  }
}
