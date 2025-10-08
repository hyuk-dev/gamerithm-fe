import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Gemini API 초기화 (환경변수에서 자동으로 API 키를 가져옴)
const ai = new GoogleGenAI({});

interface SteamGame {
  appid: number;
  name: string;
  playtime_hours: number;
  playtime_formatted: string;
  genres: string[];
  coverImage: string;
  lastPlayed: string;
  lastPlayedTimestamp: number;
  playtime_2weeks: number;
  playtime_minutes: number;
}

// 사용자의 게임 플레이 정보를 가져오는 함수
async function getUserGameData(sessionCookie: string): Promise<SteamGame[]> {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/steam/games`,
      {
        headers: {
          Cookie: `session=${sessionCookie}`,
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch user game data:", response.status);
      return [];
    }

    const data = await response.json();
    return data.games || [];
  } catch (error) {
    console.error("Error fetching user game data:", error);
    return [];
  }
}

// 언어별 프롬프트 생성 함수
function createSystemPrompt(
  userGameInfo: string,
  userPrompt: string,
  language: string
): string {
  const isKorean = language === "ko";

  if (isKorean) {
    return `당신은 게임 추천 전문가입니다. 사용자의 요청과 게임 플레이 이력을 분석하여 개인화된 게임 추천을 제공해주세요.

${userGameInfo}

다음 형식으로 정확히 JSON 응답을 해주세요:

{
  "recommendations": [
    {
      "id": 1,
      "title": "게임 제목",
      "price": "$29.99",
      "bannerImage": "실제_게임_이미지_URL_또는_로컬_이미지_경로",
      "matchScore": 95,
      "aiExplanation": "이 게임을 추천하는 이유를 상세히 설명해주세요.",
      "genres": ["RPG", "Action", "Adventure"],
      "multiplayer": false,
      "releaseDate": "2023-01-01"
    }
  ]
}

추천 기준:
- 최소 8개에서 최대 12개의 게임을 추천해주세요 (다양한 선택지를 제공하기 위해)
- 사용자의 게임 플레이 이력을 분석하여 유사한 게임들을 추천해주세요
- 사용자가 많이 플레이한 장르와 비슷한 게임들을 우선적으로 고려해주세요
- 사용자 요청에 가장 적합한 게임들을 추천해주세요
- 각 게임의 매치 점수는 70-100 사이로 설정해주세요 (사용자 취향과의 일치도 기준)
- 장르는 실제 게임 장르를 사용해주세요
- 설명은 구체적이고 설득력 있게 작성해주세요 (사용자가 좋아할 만한 이유 포함)
- 배너 이미지는 실제 게임 이미지 URL 또는 로컬 이미지 경로를 사용해주세요 (예: "/starfield-space-exploration-game-banner.jpg", "https://cdn.akamai.steamstatic.com/steam/apps/1716740/header.jpg")
- 가격은 현실적인 범위로 설정해주세요
- 출시일은 최근 5년 내의 날짜로 설정해주세요
- 다양한 가격대의 게임을 포함해주세요 (무료부터 프리미엄까지)

사용자 요청: ${userPrompt}`;
  } else {
    return `You are a game recommendation expert. Analyze the user's request and gaming history to provide personalized game recommendations.

${userGameInfo}

Please respond in the following JSON format:

{
  "recommendations": [
    {
      "id": 1,
      "title": "Game Title",
      "price": "$29.99",
      "bannerImage": "actual_game_image_URL_or_local_image_path",
      "matchScore": 95,
      "aiExplanation": "Please explain in detail why you recommend this game.",
      "genres": ["RPG", "Action", "Adventure"],
      "multiplayer": false,
      "releaseDate": "2023-01-01"
    }
  ]
}

Recommendation criteria:
- Recommend at least 8 to maximum 12 games (to provide diverse options)
- Analyze the user's gaming history to recommend similar games
- Prioritize games similar to genres the user has played extensively
- Recommend games that best match the user's request
- Set match scores between 70-100 (based on compatibility with user preferences)
- Use actual game genres
- Write descriptions that are specific and persuasive (including reasons why the user would like them)
- Use actual game image URLs or local image paths for banner images (e.g., "/starfield-space-exploration-game-banner.jpg", "https://cdn.akamai.steamstatic.com/steam/apps/1716740/header.jpg")
- Set realistic price ranges
- Set release dates within the last 5 years
- Include games from various price ranges (from free to premium)

User request: ${userPrompt}`;
  }
}

export async function POST(request: NextRequest) {
  const { userPrompt, language = "ko" } = await request.json();
  const sessionCookie = request.cookies.get("session")?.value;

  try {
    if (!userPrompt || typeof userPrompt !== "string") {
      const errorMessage =
        language === "ko"
          ? "사용자 프롬프트가 필요합니다."
          : "User prompt is required.";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      const errorMessage =
        language === "ko"
          ? "Gemini API 키가 설정되지 않았습니다."
          : "Gemini API key is not configured.";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    // 사용자의 게임 플레이 정보 가져오기
    let userGameData: SteamGame[] = [];
    if (sessionCookie) {
      userGameData = await getUserGameData(sessionCookie);
    }

    // 사용자의 게임 플레이 정보 분석
    const topPlayedGames = userGameData
      .filter((game) => game.playtime_hours > 0)
      .sort((a, b) => b.playtime_hours - a.playtime_hours)
      .slice(0, 5);

    const userGameGenres = topPlayedGames.flatMap((game) => game.genres);
    const uniqueGenres = [...new Set(userGameGenres)];

    // 사용자 게임 정보를 언어별로 문자열로 변환
    const isKorean = language === "ko";
    const userGameInfo =
      topPlayedGames.length > 0
        ? isKorean
          ? `
사용자의 게임 플레이 정보:
- 총 게임 수: ${userGameData.length}개
- 가장 많이 플레이한 게임 Top 5:
${topPlayedGames
  .map(
    (game, index) =>
      `${index + 1}. ${game.name} (${
        game.playtime_formatted
      }) - 장르: ${game.genres.join(", ")}`
  )
  .join("\n")}

- 선호하는 장르: ${uniqueGenres.join(", ")}
- 총 플레이 시간: ${userGameData.reduce(
              (sum, game) => sum + game.playtime_hours,
              0
            )}시간
`
          : `
User's gaming information:
- Total games: ${userGameData.length} games
- Top 5 most played games:
${topPlayedGames
  .map(
    (game, index) =>
      `${index + 1}. ${game.name} (${
        game.playtime_formatted
      }) - Genres: ${game.genres.join(", ")}`
  )
  .join("\n")}

- Preferred genres: ${uniqueGenres.join(", ")}
- Total playtime: ${userGameData.reduce(
              (sum, game) => sum + game.playtime_hours,
              0
            )} hours
`
        : isKorean
        ? `
사용자의 게임 플레이 정보가 없습니다. 일반적인 게임 추천을 제공해주세요.
`
        : `
No user gaming information available. Please provide general game recommendations.
`;

    // Gemini 2.5 Flash 모델 사용 (문서에서 권장하는 최신 모델)

    // 게임 추천을 위한 프롬프트 구성 (언어별)
    const systemPrompt = createSystemPrompt(userGameInfo, userPrompt, language);

    // Gemini API 호출 (최신 SDK 방식)
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: systemPrompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 0, // 속도 우선으로 사고 기능 비활성화
        },
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error("API 응답에서 텍스트를 가져올 수 없습니다.");
    }

    // JSON 파싱 시도
    let recommendations;
    try {
      // JSON 부분만 추출 (```json ``` 제거)
      const jsonMatch =
        text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;
      recommendations = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("JSON 파싱 오류:", parseError);
      console.error("원본 응답:", text);

      // 파싱 실패 시 기본 응답 (언어별)
      const isKorean = language === "ko";
      return NextResponse.json({
        recommendations: [
          {
            id: 1,
            title: "Starfield",
            price: "$69.99",
            bannerImage: "/starfield-space-exploration-game-banner.jpg",
            matchScore: 95,
            aiExplanation: isKorean
              ? "사용자의 요청에 따라 추천된 게임입니다. RPG 요소와 탐험 요소가 풍부한 게임으로, 발더스 게이트 3를 좋아하는 플레이어에게 적합합니다."
              : "A game recommended based on your request. This game is rich in RPG and exploration elements, perfect for players who enjoy Baldur's Gate 3.",
            genres: ["RPG", "Action", "Exploration"],
            multiplayer: false,
            releaseDate: "2023-09-06",
          },
          {
            id: 2,
            title: "Hades II",
            price: "$29.99",
            bannerImage: "/hades-2-roguelike-action-game-banner.jpg",
            matchScore: 92,
            aiExplanation: isKorean
              ? "액션과 전략적 깊이가 있는 게임으로, 사용자의 취향에 맞는 추천입니다."
              : "A game with action and strategic depth, perfect for your preferences.",
            genres: ["Action", "Roguelike", "Indie"],
            multiplayer: false,
            releaseDate: "2024-05-06",
          },
          {
            id: 3,
            title: "Helldivers 2",
            price: "$39.99",
            bannerImage: "/helldivers-2-co-op-shooter-game-banner.jpg",
            matchScore: 89,
            aiExplanation: isKorean
              ? "협동 플레이와 전술적 깊이가 있는 게임으로, 팀워크를 중시하는 플레이어에게 추천합니다."
              : "A game with cooperative play and tactical depth, recommended for players who value teamwork.",
            genres: ["FPS", "Multiplayer", "Co-op"],
            multiplayer: true,
            releaseDate: "2024-02-08",
          },
          {
            id: 4,
            title: "Manor Lords",
            price: "$39.99",
            bannerImage: "/manor-lords-medieval-strategy-game-banner.jpg",
            matchScore: 87,
            aiExplanation: isKorean
              ? "전략과 도시 건설 요소가 결합된 게임으로, 깊이 있는 게임플레이를 원하는 플레이어에게 적합합니다."
              : "A game combining strategy and city-building elements, perfect for players seeking deep gameplay.",
            genres: ["Strategy", "City-Builder", "Medieval"],
            multiplayer: false,
            releaseDate: "2024-04-26",
          },
          {
            id: 5,
            title: "Palworld",
            price: "$29.99",
            bannerImage:
              "/palworld-creature-collection-survival-game-banner.jpg",
            matchScore: 84,
            aiExplanation: isKorean
              ? "생존, 크래프팅, 몬스터 수집이 결합된 독특한 게임으로, 창의적인 게임플레이를 즐기는 플레이어에게 추천합니다."
              : "A unique game combining survival, crafting, and creature collection, recommended for players who enjoy creative gameplay.",
            genres: ["Survival", "Action", "Multiplayer"],
            multiplayer: true,
            releaseDate: "2024-01-19",
          },
          {
            id: 6,
            title: "Baldur's Gate 3",
            price: "$59.99",
            bannerImage: "/baldurs-gate-3-inspired-cover.png",
            matchScore: 98,
            aiExplanation: isKorean
              ? "최고의 RPG 경험을 제공하는 게임으로, 깊이 있는 스토리와 전략적 전투를 즐기는 플레이어에게 완벽합니다."
              : "The ultimate RPG experience, perfect for players who enjoy deep storytelling and strategic combat.",
            genres: ["RPG", "Strategy", "Adventure"],
            multiplayer: true,
            releaseDate: "2023-08-03",
          },
          {
            id: 7,
            title: "Cyberpunk 2077",
            price: "$59.99",
            bannerImage: "/cyberpunk-2077-inspired-cover.png",
            matchScore: 91,
            aiExplanation: isKorean
              ? "사이버펑크 세계관과 깊이 있는 RPG 요소가 결합된 게임으로, 몰입감 있는 스토리를 원하는 플레이어에게 추천합니다."
              : "A game combining cyberpunk worldbuilding with deep RPG elements, recommended for players seeking immersive storytelling.",
            genres: ["RPG", "Action", "Adventure"],
            multiplayer: false,
            releaseDate: "2020-12-10",
          },
          {
            id: 8,
            title: "Elden Ring",
            price: "$59.99",
            bannerImage: "/elden-ring-knight.png",
            matchScore: 96,
            aiExplanation: isKorean
              ? "도전적인 게임플레이와 탐험 요소가 뛰어난 게임으로, 어려운 게임을 즐기는 플레이어에게 완벽한 선택입니다."
              : "An outstanding game with challenging gameplay and exploration elements, perfect for players who enjoy difficult games.",
            genres: ["RPG", "Action", "Adventure"],
            multiplayer: true,
            releaseDate: "2022-02-25",
          },
        ],
      });
    }

    // 응답 구조를 일관성 있게 맞춤 (프론트엔드에서 data.recommendations로 접근)
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("Gemini API 오류:", error);

    // API 오류 시 기본 응답 (언어별)
    const isKorean = language === "ko";
    return NextResponse.json({
      recommendations: [
        {
          id: 1,
          title: "Starfield",
          price: "$69.99",
          bannerImage: "/starfield-space-exploration-game-banner.jpg",
          matchScore: 95,
          aiExplanation: isKorean
            ? "사용자의 요청에 따라 추천된 게임입니다. 현재 API 연결에 문제가 있어 기본 추천을 제공합니다."
            : "A game recommended based on your request. Currently experiencing API connection issues, providing default recommendations.",
          genres: ["RPG", "Action", "Exploration"],
          multiplayer: false,
          releaseDate: "2023-09-06",
        },
        {
          id: 2,
          title: "Hades II",
          price: "$29.99",
          bannerImage: "/hades-2-roguelike-action-game-banner.jpg",
          matchScore: 92,
          aiExplanation: isKorean
            ? "액션과 전략적 깊이가 있는 게임으로, 사용자의 취향에 맞는 추천입니다."
            : "A game with action and strategic depth, perfect for your preferences.",
          genres: ["Action", "Roguelike", "Indie"],
          multiplayer: false,
          releaseDate: "2024-05-06",
        },
        {
          id: 3,
          title: "Helldivers 2",
          price: "$39.99",
          bannerImage: "/helldivers-2-co-op-shooter-game-banner.jpg",
          matchScore: 89,
          aiExplanation: isKorean
            ? "협동 플레이와 전술적 깊이가 있는 게임으로, 팀워크를 중시하는 플레이어에게 추천합니다."
            : "A game with cooperative play and tactical depth, recommended for players who value teamwork.",
          genres: ["FPS", "Multiplayer", "Co-op"],
          multiplayer: true,
          releaseDate: "2024-02-08",
        },
        {
          id: 4,
          title: "Manor Lords",
          price: "$39.99",
          bannerImage: "/manor-lords-medieval-strategy-game-banner.jpg",
          matchScore: 87,
          aiExplanation: isKorean
            ? "전략과 도시 건설 요소가 결합된 게임으로, 깊이 있는 게임플레이를 원하는 플레이어에게 적합합니다."
            : "A game combining strategy and city-building elements, perfect for players seeking deep gameplay.",
          genres: ["Strategy", "City-Builder", "Medieval"],
          multiplayer: false,
          releaseDate: "2024-04-26",
        },
        {
          id: 5,
          title: "Palworld",
          price: "$29.99",
          bannerImage: "/palworld-creature-collection-survival-game-banner.jpg",
          matchScore: 84,
          aiExplanation: isKorean
            ? "생존, 크래프팅, 몬스터 수집이 결합된 독특한 게임으로, 창의적인 게임플레이를 즐기는 플레이어에게 추천합니다."
            : "A unique game combining survival, crafting, and creature collection, recommended for players who enjoy creative gameplay.",
          genres: ["Survival", "Action", "Multiplayer"],
          multiplayer: true,
          releaseDate: "2024-01-19",
        },
        {
          id: 6,
          title: "Baldur's Gate 3",
          price: "$59.99",
          bannerImage: "/baldurs-gate-3-inspired-cover.png",
          matchScore: 98,
          aiExplanation: isKorean
            ? "최고의 RPG 경험을 제공하는 게임으로, 깊이 있는 스토리와 전략적 전투를 즐기는 플레이어에게 완벽합니다."
            : "The ultimate RPG experience, perfect for players who enjoy deep storytelling and strategic combat.",
          genres: ["RPG", "Strategy", "Adventure"],
          multiplayer: true,
          releaseDate: "2023-08-03",
        },
        {
          id: 7,
          title: "Cyberpunk 2077",
          price: "$59.99",
          bannerImage: "/cyberpunk-2077-inspired-cover.png",
          matchScore: 91,
          aiExplanation: isKorean
            ? "사이버펑크 세계관과 깊이 있는 RPG 요소가 결합된 게임으로, 몰입감 있는 스토리를 원하는 플레이어에게 추천합니다."
            : "A game combining cyberpunk worldbuilding with deep RPG elements, recommended for players seeking immersive storytelling.",
          genres: ["RPG", "Action", "Adventure"],
          multiplayer: false,
          releaseDate: "2020-12-10",
        },
        {
          id: 8,
          title: "Elden Ring",
          price: "$59.99",
          bannerImage: "/elden-ring-knight.png",
          matchScore: 96,
          aiExplanation: isKorean
            ? "도전적인 게임플레이와 탐험 요소가 뛰어난 게임으로, 어려운 게임을 즐기는 플레이어에게 완벽한 선택입니다."
            : "An outstanding game with challenging gameplay and exploration elements, perfect for players who enjoy difficult games.",
          genres: ["RPG", "Action", "Adventure"],
          multiplayer: true,
          releaseDate: "2022-02-25",
        },
      ],
    });
  }
}
