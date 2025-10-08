import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { appId: string; type: string } }
) {
  const { appId, type } = params;

  if (!appId || !type) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  // Steam CDN 이미지 URL 매핑 (고화질 우선순위)
  const imageUrls: Record<string, string> = {
    // 고화질 이미지들 (우선순위 높음)
    library_hero: `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/library_hero.jpg`,
    library: `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/library_600x900_2x.jpg`,
    header: `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`,
    page_bg: `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/page_bg_generated.jpg`,

    // 중간 해상도
    capsule: `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/capsule_616x353.jpg`,
    small_capsule: `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/capsule_467x181.jpg`,
    mini_capsule: `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/capsule_184x69.jpg`,

    // 추가 고화질 옵션들
    library_hero_2x: `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/library_hero_2x.jpg`,
    library_2x: `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/library_600x900_2x.jpg`,
    header_2x: `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header_2x.jpg`,
  };

  const imageUrl = imageUrls[type];

  if (!imageUrl) {
    return NextResponse.json({ error: "Invalid image type" }, { status: 400 });
  }

  try {
    // Steam CDN에서 이미지 가져오기
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      next: {
        revalidate: 86400, // 24시간 캐시
        tags: [`steam-image-${appId}-${type}`],
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const imageBuffer = await response.arrayBuffer();

    // 원본 응답의 Content-Type 유지
    const contentType = response.headers.get("content-type") || "image/jpeg";

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800", // 1일 캐시, 7일 stale
        "CDN-Cache-Control": "max-age=86400",
      },
    });
  } catch (error) {
    console.error(
      `Failed to fetch Steam image for app ${appId}, type ${type}:`,
      error
    );
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}
