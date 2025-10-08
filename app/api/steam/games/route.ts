import { NextRequest, NextResponse } from "next/server";

interface SteamGame {
  appid: number;
  name: string;
  playtime_forever: number;
  playtime_2weeks?: number;
  img_icon_url: string;
  img_logo_url?: string;
  rtime_last_played?: number;
  playtime_windows_forever?: number;
  playtime_mac_forever?: number;
  playtime_linux_forever?: number;
  playtime_deck_forever?: number;
  playtime_disconnected?: number;
  has_community_visible_stats?: boolean;
}

interface SteamOwnedGamesResponse {
  response: {
    game_count: number;
    games: SteamGame[];
  };
}

interface SteamAppDetails {
  [appid: string]: {
    success: boolean;
    data?: {
      name: string;
      genres?: Array<{ id: string; description: string }>;
      categories?: Array<{ id: number; description: string }>;
      tags?: Array<{ id: string; description: string }>;
      header_image?: string;
      capsule_image?: string;
      capsule_imagev5?: string;
      background?: string;
      background_raw?: string;
      screenshots?: Array<{
        id: number;
        path_thumbnail: string;
        path_full: string;
      }>;
      movies?: Array<{
        id: number;
        thumbnail: string;
        webm: { [key: string]: string };
        mp4: { [key: string]: string };
      }>;
    };
  };
}

// Steam Web API를 통해 개별 앱 상세 정보 가져오기 (장르 정보 포함)
async function getSteamAppDetails(
  appIds: number[]
): Promise<Record<number, { genres: string[] }>> {
  const apiKey = process.env.STEAM_API_KEY;
  if (!apiKey) return {};

  const results: Record<number, { genres: string[] }> = {};
  const BATCH_SIZE = 10; // Steam Web API는 더 제한적

  for (let i = 0; i < appIds.length; i += BATCH_SIZE) {
    const batch = appIds.slice(i, i + BATCH_SIZE);

    try {
      // Steam Web API의 GetAppDetails 사용 (실제로는 Store API와 동일한 엔드포인트)
      const promises = batch.map(async (appId) => {
        // Steam Web API에는 GetAppDetails가 없으므로 Store API 사용
        const url = `https://store.steampowered.com/api/appdetails?appids=${appId}&l=korean&cc=kr`;

        const response = await fetch(url, {
          next: {
            revalidate: 3600, // 1시간 캐시
            tags: ["steam-app-details", `steam-app-details-${appId}`],
          },
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data[appId]?.success && data[appId].data) {
            const genres =
              data[appId].data.genres?.map((g: any) => g.description) || [];
            console.log(`Steam Web API for ${appId}:`, {
              genres,
              success: data[appId].success,
            });
            return { appId, genres };
          }
        }
        return { appId, genres: [] };
      });

      const batchResults = await Promise.all(promises);
      batchResults.forEach(({ appId, genres }) => {
        if (genres.length > 0) {
          results[appId] = { genres };
        }
      });

      // API 제한을 피하기 위한 지연
      if (i + BATCH_SIZE < appIds.length) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(
        `Failed to fetch Steam app details for batch ${i}-${i + BATCH_SIZE}:`,
        error
      );
    }
  }

  return results;
}

// 게임 상세 정보를 가져오는 함수 (배치 처리)
async function getGameDetails(appIds: number[]): Promise<SteamAppDetails> {
  const BATCH_SIZE = 20; // Steam Store API 제한에 맞춰 배치 크기 줄임 (안정성 향상)
  const results: SteamAppDetails = {};

  // 앱 ID를 배치로 나누기
  for (let i = 0; i < appIds.length; i += BATCH_SIZE) {
    const batch = appIds.slice(i, i + BATCH_SIZE);

    try {
      // Steam Store API에서 더 많은 정보 요청 (장르, 카테고리, 태그 등)
      const url = `https://store.steampowered.com/api/appdetails?appids=${batch.join(
        ","
      )}&l=korean&cc=kr`;

      const response = await fetch(url, {
        next: {
          revalidate: 7200, // 2시간 캐시 (장르 정보는 자주 변경되지 않음)
          tags: ["steam-details", `steam-details-${batch.join(",")}`],
        },
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.8",
        },
      });

      if (response.ok) {
        const batchResults = await response.json();

        // 디버깅: Steam Store API 응답 확인
        console.log(
          `Steam Store API Response for batch ${i}-${i + BATCH_SIZE}:`,
          Object.keys(batchResults).map((appId) => ({
            appId,
            success: batchResults[appId]?.success,
            hasData: !!batchResults[appId]?.data,
            genres:
              batchResults[appId]?.data?.genres?.map(
                (g: any) => g.description
              ) || [],
            categories:
              batchResults[appId]?.data?.categories?.map(
                (c: any) => c.description
              ) || [],
            tags:
              batchResults[appId]?.data?.tags
                ?.slice(0, 3)
                .map((t: any) => t.description) || [],
          }))
        );

        Object.assign(results, batchResults);
      } else {
        console.warn(
          `Steam Store API error for batch ${i}-${i + BATCH_SIZE}: ${
            response.status
          }`
        );
      }

      // API 제한을 피하기 위한 지연 (Steam API는 분당 200 요청 제한)
      if (i + BATCH_SIZE < appIds.length) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    } catch (error) {
      console.error(
        `Failed to fetch game details for batch ${i}-${i + BATCH_SIZE}:`,
        error
      );
    }
  }

  return results;
}

// Steam Store API에서 장르 정보를 추출하는 함수 (개선된 버전)
function extractGenresFromSteamData(
  details?: SteamAppDetails[string]
): string[] {
  if (!details?.data) return [];

  const genres: string[] = [];
  const data = details.data;

  // 1. genres 필드에서 추출 (가장 정확한 장르 정보)
  if (data.genres && data.genres.length > 0) {
    data.genres.forEach((genre) => {
      if (genre.description && !genres.includes(genre.description)) {
        genres.push(genre.description);
      }
    });
  }

  // 2. categories에서 장르 관련 정보 추출 (더 정교한 필터링)
  if (data.categories && data.categories.length > 0) {
    const genreCategories = data.categories
      .map((cat) => cat.description)
      .filter((desc) => {
        // Steam의 기능성 카테고리 제외하고 장르로 사용할 수 있는 것들만
        const functionalCategories = [
          "Steam Workshop",
          "Steam Cloud",
          "Steam Achievements",
          "Steam Trading Cards",
          "Steam Leaderboards",
          "Steam Input",
          "Partial Controller Support",
          "Full controller support",
          "Remote Play Together",
          "Remote Play on Phone",
          "Remote Play on Tablet",
          "Remote Play on TV",
          "Steam Deck Verified",
          "Steam Deck Playable",
          "Steam Deck Unsupported",
          "Includes level editor",
          "Includes Source SDK",
          "Commentary available",
          "Captions available",
          "Steam Turn Notifications",
        ];

        // 장르로 사용할 수 있는 카테고리들
        const genreCategories = [
          "Single-player",
          "Multi-player",
          "Co-op",
          "Local Co-op",
          "Online Co-op",
          "Cross-Platform Multiplayer",
          "VR Support",
        ];

        return (
          genreCategories.includes(desc) && !functionalCategories.includes(desc)
        );
      })
      .filter((desc) => desc && !genres.includes(desc));

    genres.push(...genreCategories);
  }

  // 3. tags에서 장르 관련 정보 추출 (더 포괄적인 키워드 매칭)
  if (data.tags && data.tags.length > 0) {
    const genreTags = data.tags
      .slice(0, 8) // 상위 8개 태그까지 확인
      .map((tag) => tag.description)
      .filter((desc) => {
        // 더 포괄적인 장르 키워드들
        const genreKeywords = [
          "Action",
          "Adventure",
          "RPG",
          "Strategy",
          "Simulation",
          "Sports",
          "Racing",
          "FPS",
          "TPS",
          "Platformer",
          "Puzzle",
          "Horror",
          "Survival",
          "Stealth",
          "Fighting",
          "Beat 'em up",
          "Shooter",
          "Tactical",
          "Turn-based",
          "Real-time",
          "Roguelike",
          "Roguelite",
          "Metroidvania",
          "Souls-like",
          "Battle Royale",
          "MOBA",
          "MMO",
          "Card Game",
          "Board Game",
          "Party Game",
          "Casual",
          "Indie",
          "Early Access",
          "Free to Play",
          "Massively Multiplayer",
          "Co-op",
          "Multiplayer",
          "Singleplayer",
          "Local Multiplayer",
          "Online Multiplayer",
          "Cross-Platform",
          "VR",
          "Controller Support",
          "Mod Support",
          "Level Editor",
          "Sandbox",
          "Open World",
          "Linear",
          "Story Rich",
          "Atmospheric",
          "Great Soundtrack",
          "Visual Novel",
          "Anime",
          "Mature",
          "Violent",
          "Gore",
          "Sexual Content",
          "Nudity",
          "Strong Language",
          "Drug Reference",
          "Alcohol Reference",
          // 추가 장르 키워드들
          "Arcade",
          "Retro",
          "Pixel Graphics",
          "2D",
          "3D",
          "First Person",
          "Third Person",
          "Top-Down",
          "Side Scroller",
          "Isometric",
          "Turn-Based Strategy",
          "Real-Time Strategy",
          "Tower Defense",
          "City Builder",
          "Life Simulation",
          "Farming",
          "Driving",
          "Flight",
          "Space",
          "Sci-Fi",
          "Fantasy",
          "Medieval",
          "Historical",
          "Modern",
          "Post-Apocalyptic",
          "Zombie",
          "Vampire",
          "Supernatural",
          "Mystery",
          "Thriller",
          "Psychological",
          "Drama",
          "Comedy",
          "Romance",
          "Educational",
          "Trivia",
          "Quiz",
          "Word",
          "Music",
          "Rhythm",
          "Dance",
          "Fitness",
          "Health",
          "Medical",
          "Business",
          "Management",
          "Tycoon",
          "Economy",
          "Trading",
          "Stock Market",
          "Real Estate",
          "Restaurant",
          "Hotel",
          "Theme Park",
          "Zoo",
          "Aquarium",
          "Zoo Tycoon",
          "RollerCoaster Tycoon",
          "SimCity",
          "Cities: Skylines",
          "The Sims",
          "Farming Simulator",
          "Euro Truck Simulator",
          "American Truck Simulator",
          "Microsoft Flight Simulator",
          "Kerbal Space Program",
          "RimWorld",
          "Factorio",
          "Satisfactory",
          "Dyson Sphere Program",
          "Oxygen Not Included",
          "Prison Architect",
          "Two Point Hospital",
          "Project Hospital",
          "Software Inc",
          "Game Dev Tycoon",
          "Mad Games Tycoon",
          "Startup Company",
          "Capitalism 2",
          "Democracy 3",
          "Tropico",
          "Anno",
          "Civilization",
          "Total War",
          "Age of Empires",
          "Command & Conquer",
          "StarCraft",
          "Warcraft",
          "Dune",
          "Red Alert",
          "Company of Heroes",
          "Men of War",
          "Steel Division",
          "Hearts of Iron",
          "Europa Universalis",
          "Crusader Kings",
          "Victoria",
          "Stellaris",
          "Endless Space",
          "Sins of a Solar Empire",
          "Galactic Civilizations",
          "Master of Orion",
          "XCOM",
          "Phoenix Point",
          "Gears Tactics",
          "Mutant Year Zero",
          "Wasteland",
          "Divinity",
          "Pillars of Eternity",
          "Pathfinder",
          "Tyranny",
          "Baldur's Gate",
          "Icewind Dale",
          "Planescape",
          "Neverwinter Nights",
          "Dragon Age",
          "Mass Effect",
          "The Witcher",
          "Elder Scrolls",
          "Fallout",
          "Deus Ex",
          "System Shock",
          "Bioshock",
          "Prey",
          "Dishonored",
          "Thief",
          "Hitman",
          "Splinter Cell",
          "Metal Gear",
          "Assassin's Creed",
          "Watch Dogs",
          "Far Cry",
          "Just Cause",
          "Grand Theft Auto",
          "Red Dead Redemption",
          "Mafia",
          "Sleeping Dogs",
          "Saints Row",
          "Crackdown",
          "Prototype",
          "Infamous",
          "Spider-Man",
          "Batman",
          "Superman",
          "Wonder Woman",
          "X-Men",
          "Marvel",
          "DC Comics",
          "Star Wars",
          "Star Trek",
          "Halo",
          "Gears of War",
          "Call of Duty",
          "Battlefield",
          "Counter-Strike",
          "Half-Life",
          "Portal",
          "Team Fortress",
          "Left 4 Dead",
          "Dying Light",
          "Dead Island",
          "Resident Evil",
          "Silent Hill",
          "Outlast",
          "Amnesia",
          "Alien: Isolation",
          "SOMA",
          "Layers of Fear",
          "Blair Witch",
          "Visage",
          "Song of Horror",
          "The Medium",
          "Little Nightmares",
          "Inside",
          "Limbo",
          "Cuphead",
          "Hollow Knight",
          "Ori",
          "Celeste",
          "Super Meat Boy",
          "Shovel Knight",
          "A Hat in Time",
          "Crash Bandicoot",
          "Spyro",
          "Banjo-Kazooie",
          "Mario",
          "Sonic",
          "Mega Man",
          "Castlevania",
          "Metroid",
          "Dark Souls",
          "Bloodborne",
          "Sekiro",
          "Elden Ring",
          "Nioh",
          "The Surge",
          "Mortal Shell",
          "Code Vein",
          "Lies of P",
          "Steelrising",
          "Thymesia",
          "The Lords of the Fallen",
          "Wo Long",
          "Remnant",
          "Remnant 2",
          "Outriders",
          "Anthem",
          "Destiny",
          "Destiny 2",
          "Borderlands",
          "The Division",
          "The Division 2",
          "Ghost Recon",
          "Rainbow Six",
          "Overwatch",
          "Valorant",
          "Apex Legends",
          "Fortnite",
          "PUBG",
          "Warzone",
          "Vanguard",
          "Modern Warfare",
          "Black Ops",
          "World at War",
          "Advanced Warfare",
          "Infinite Warfare",
          "WWII",
          "Cold War",
          "Vanguard",
          "Warzone",
          "Mobile",
          "Switch",
          "PlayStation",
          "Xbox",
          "PC",
          "Steam",
          "Epic Games",
          "Origin",
          "Uplay",
          "GOG",
          "Humble Bundle",
        ];

        return genreKeywords.some((keyword) =>
          desc.toLowerCase().includes(keyword.toLowerCase())
        );
      })
      .filter((desc) => desc && !genres.includes(desc));

    genres.push(...genreTags);
  }

  // 중복 제거 및 정리
  return [...new Set(genres)].slice(0, 5); // 최대 5개 장르만 반환
}

// 플레이 시간을 포맷팅하는 함수
function formatPlaytime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}일 ${hours % 24}시간`;
  } else if (hours > 0) {
    return `${hours}시간`;
  } else {
    return `${minutes}분`;
  }
}

// 마지막 플레이 시간을 포맷팅하는 함수 (클라이언트에서 번역하도록 구조만 제공)
function formatLastPlayed(timestamp: number): { type: string; count: number } {
  const now = Date.now() / 1000;
  const diff = now - timestamp;

  const days = Math.floor(diff / 86400);
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor(diff / 60);

  if (days > 0) {
    return { type: "days", count: days };
  } else if (hours > 0) {
    return { type: "hours", count: hours };
  } else if (minutes > 0) {
    return { type: "minutes", count: minutes };
  } else {
    return { type: "justNow", count: 0 };
  }
}

// 게임 이름 기반 fallback 장르 매핑 (Steam Store API에서 장르를 가져오지 못한 경우에만 사용)
function getFallbackGenres(gameName: string): string[] {
  const name = gameName.toLowerCase();

  // 주요 게임별 장르 매핑 (더 정확하고 포괄적인 매핑)
  const gameGenreMap: Record<string, string[]> = {
    "counter-strike": ["FPS", "Multiplayer"],
    dota: ["MOBA", "Multiplayer"],
    "half-life": ["FPS", "Action"],
    portal: ["Puzzle", "Platformer"],
    "team fortress": ["FPS", "Multiplayer"],
    "left 4 dead": ["FPS", "Co-op"],
    "garry's mod": ["Sandbox", "Simulation"],
    terraria: ["Adventure", "Sandbox"],
    minecraft: ["Sandbox", "Adventure"],
    "among us": ["Party Game", "Multiplayer"],
    "fall guys": ["Party Game", "Multiplayer"],
    "rocket league": ["Sports", "Racing"],
    warframe: ["Action", "RPG"],
    "path of exile": ["RPG", "Action"],
    "elder scrolls": ["RPG", "Adventure"],
    witcher: ["RPG", "Adventure"],
    cyberpunk: ["RPG", "Action"],
    "baldur's gate": ["RPG", "Strategy"],
    civilization: ["Strategy", "Turn-Based"],
    "total war": ["Strategy", "RTS"],
    "europa universalis": ["Strategy", "Grand Strategy"],
    "crusader kings": ["Strategy", "Grand Strategy"],
    "hearts of iron": ["Strategy", "Grand Strategy"],
    stellaris: ["Strategy", "4X"],
    "age of empires": ["Strategy", "RTS"],
    "command & conquer": ["Strategy", "RTS"],
    simcity: ["Simulation", "City Builder"],
    "cities: skylines": ["Simulation", "City Builder"],
    "the sims": ["Simulation", "Life Simulation"],
    "farming simulator": ["Simulation", "Farming"],
    "euro truck simulator": ["Simulation", "Driving"],
    "american truck simulator": ["Simulation", "Driving"],
    "flight simulator": ["Simulation", "Flight"],
    "kerbal space program": ["Simulation", "Space"],
    rimworld: ["Simulation", "Colony Sim"],
    factorio: ["Simulation", "Automation"],
    satisfactory: ["Simulation", "Automation"],
    "dead by daylight": ["Horror", "Multiplayer"],
    phasmophobia: ["Horror", "Co-op"],
    "resident evil": ["Horror", "Survival"],
    "silent hill": ["Horror", "Survival"],
    outlast: ["Horror", "Survival"],
    amnesia: ["Horror", "Survival"],
    "alien: isolation": ["Horror", "Stealth"],
    soma: ["Horror", "Adventure"],
    "layers of fear": ["Horror", "Psychological"],
    "blair witch": ["Horror", "Adventure"],
    visage: ["Horror", "Psychological"],
    "song of horror": ["Horror", "Adventure"],
    "the medium": ["Horror", "Adventure"],
    "little nightmares": ["Horror", "Platformer"],
    inside: ["Horror", "Platformer"],
    limbo: ["Horror", "Platformer"],
    cuphead: ["Platformer", "Run and Gun"],
    "hollow knight": ["Platformer", "Metroidvania"],
    ori: ["Platformer", "Metroidvania"],
    celeste: ["Platformer", "Precision"],
    "super meat boy": ["Platformer", "Precision"],
    "shovel knight": ["Platformer", "Retro"],
    "a hat in time": ["Platformer", "3D"],
    "crash bandicoot": ["Platformer", "3D"],
    spyro: ["Platformer", "3D"],
    "banjo-kazooie": ["Platformer", "3D"],
    mario: ["Platformer", "3D"],
    sonic: ["Platformer", "Speed"],
    "mega man": ["Platformer", "Run and Gun"],
    castlevania: ["Platformer", "Metroidvania"],
    metroid: ["Platformer", "Metroidvania"],
    "dark souls": ["Action RPG", "Souls-like"],
    bloodborne: ["Action RPG", "Souls-like"],
    sekiro: ["Action RPG", "Souls-like"],
    "elden ring": ["Action RPG", "Souls-like"],
    nioh: ["Action RPG", "Souls-like"],
    "the surge": ["Action RPG", "Souls-like"],
    "mortal shell": ["Action RPG", "Souls-like"],
    "code vein": ["Action RPG", "Souls-like"],
    "lies of p": ["Action RPG", "Souls-like"],
    steelrising: ["Action RPG", "Souls-like"],
    thymesia: ["Action RPG", "Souls-like"],
    "the lords of the fallen": ["Action RPG", "Souls-like"],
    "wo long": ["Action RPG", "Souls-like"],
    remnant: ["Action RPG", "Shooter"],
    "remnant 2": ["Action RPG", "Shooter"],
    outriders: ["Action RPG", "Shooter"],
    anthem: ["Action RPG", "Shooter"],
    destiny: ["Action RPG", "Shooter"],
    "destiny 2": ["Action RPG", "Shooter"],
    borderlands: ["Action RPG", "Shooter"],
    "the division": ["Action RPG", "Shooter"],
    "the division 2": ["Action RPG", "Shooter"],
    "ghost recon": ["Action", "Tactical Shooter"],
    "rainbow six": ["Tactical Shooter", "Multiplayer"],
    "call of duty": ["FPS", "Multiplayer"],
    battlefield: ["FPS", "Multiplayer"],
    overwatch: ["FPS", "Multiplayer"],
    valorant: ["FPS", "Multiplayer"],
    "apex legends": ["FPS", "Battle Royale"],
    fortnite: ["Battle Royale", "Multiplayer"],
    pubg: ["Battle Royale", "Multiplayer"],
    fallout: ["RPG", "Post-Apocalyptic"],
    skyrim: ["RPG", "Fantasy"],
    oblivion: ["RPG", "Fantasy"],
    morrowind: ["RPG", "Fantasy"],
    "dragon age": ["RPG", "Fantasy"],
    "mass effect": ["RPG", "Sci-Fi"],
    "star wars": ["Action", "Sci-Fi"],
    "assassin's creed": ["Action", "Stealth"],
    "watch dogs": ["Action", "Hacking"],
    "far cry": ["Action", "FPS"],
    "just cause": ["Action", "Sandbox"],
    "grand theft auto": ["Action", "Sandbox"],
    "red dead redemption": ["Action", "Western"],
    hitman: ["Action", "Stealth"],
    "splinter cell": ["Stealth", "Action"],
    "metal gear": ["Stealth", "Action"],
    dishonored: ["Stealth", "Action"],
    thief: ["Stealth", "Action"],
    payday: ["Co-op", "Heist"],
    vermintide: ["Co-op", "Action"],
    "back 4 blood": ["Co-op", "Action"],
    "world war z": ["Co-op", "Action"],
    "killing floor": ["Co-op", "Action"],
    "deep rock galactic": ["Co-op", "Action"],
    "sea of thieves": ["Co-op", "Adventure"],
    "monster hunter": ["Action", "Co-op"],
    dauntless: ["Action", "Co-op"],
    "god eater": ["Action", "Co-op"],
    toukiden: ["Action", "Co-op"],
    "final fantasy": ["RPG", "JRPG"],
    persona: ["RPG", "JRPG"],
    "dragon quest": ["RPG", "JRPG"],
    "tales of": ["RPG", "JRPG"],
    atelier: ["RPG", "JRPG"],
    disgaea: ["RPG", "Tactical"],
    "fire emblem": ["RPG", "Tactical"],
    xcom: ["Tactical", "Turn-Based"],
    wasteland: ["RPG", "Turn-Based"],
    divinity: ["RPG", "Turn-Based"],
    "pillars of eternity": ["RPG", "Isometric"],
    pathfinder: ["RPG", "Isometric"],
    tyranny: ["RPG", "Isometric"],
    "wasteland 3": ["RPG", "Turn-Based"],
    "mutant year zero": ["Tactical", "Turn-Based"],
    gloomhaven: ["Tactical", "Turn-Based"],
    "into the breach": ["Tactical", "Turn-Based"],
    "frozen synapse": ["Tactical", "Turn-Based"],
    xenonauts: ["Tactical", "Turn-Based"],
    "jagged alliance": ["Tactical", "Turn-Based"],
    "silent storm": ["Tactical", "Turn-Based"],
    "hammer & sickle": ["Tactical", "Turn-Based"],
    "7.62 hard life": ["Tactical", "Turn-Based"],
    "hired guns": ["Tactical", "Turn-Based"],
    "breach & clear": ["Tactical", "Turn-Based"],
    "phantom doctrine": ["Tactical", "Turn-Based"],
    "invisible inc": ["Tactical", "Turn-Based"],
    "shadow tactics": ["Tactical", "Real-Time"],
    desperados: ["Tactical", "Real-Time"],
    commandos: ["Tactical", "Real-Time"],
    "robin hood": ["Tactical", "Real-Time"],
    helldivers: ["Co-op", "Top-Down Shooter"],
    "helldivers 2": ["Co-op", "Third-Person Shooter"],
    magicka: ["Co-op", "Action"],
    "magicka 2": ["Co-op", "Action"],
    "nine parchments": ["Co-op", "Action"],
    "full metal furies": ["Co-op", "Beat 'em up"],
    "castle crashers": ["Co-op", "Beat 'em up"],
    "battleblock theater": ["Co-op", "Platformer"],
    "alien swarm": ["Co-op", "Top-Down Shooter"],
    "alien swarm: reactive drop": ["Co-op", "Top-Down Shooter"],
    sanctum: ["Co-op", "Tower Defense"],
    "sanctum 2": ["Co-op", "Tower Defense"],
    "orcs must die": ["Tower Defense", "Action"],
    "orcs must die 2": ["Tower Defense", "Co-op"],
    "orcs must die 3": ["Tower Defense", "Action"],
    "dungeon defenders": ["Tower Defense", "Co-op"],
    "dungeon defenders 2": ["Tower Defense", "Co-op"],
    "defense grid": ["Tower Defense", "Strategy"],
    "defense grid 2": ["Tower Defense", "Strategy"],
    anomaly: ["Tower Defense", "Strategy"],
    "anomaly 2": ["Tower Defense", "Strategy"],
    "plants vs zombies": ["Tower Defense", "Strategy"],
    "bloons td": ["Tower Defense", "Strategy"],
    "kingdom rush": ["Tower Defense", "Strategy"],
    gemcraft: ["Tower Defense", "Strategy"],
    "cursed treasure": ["Tower Defense", "Strategy"],
    fieldrunners: ["Tower Defense", "Strategy"],
    "pixeljunk monsters": ["Tower Defense", "Strategy"],
    "south park": ["RPG", "Turn-Based"],
    "south park: the stick of truth": ["RPG", "Turn-Based"],
    "south park: the fractured but whole": ["RPG", "Turn-Based"],
    "south park: phone destroyer": ["Card Game", "Multiplayer"],
    gwent: ["Card Game", "Multiplayer"],
    hearthstone: ["Card Game", "Multiplayer"],
    "magic: the gathering": ["Card Game", "Multiplayer"],
    eternal: ["Card Game", "Multiplayer"],
    shadowverse: ["Card Game", "Multiplayer"],
    faeria: ["Card Game", "Strategy"],
    duelyst: ["Card Game", "Strategy"],
    artifact: ["Card Game", "Strategy"],
    "legends of runeterra": ["Card Game", "Multiplayer"],
    "slay the spire": ["Card Game", "Roguelike"],
    "monster train": ["Card Game", "Roguelike"],
    griftlands: ["Card Game", "Roguelike"],
    "vault of the void": ["Card Game", "Roguelike"],
    "nowhere prophet": ["Card Game", "Roguelike"],
    "ring of pain": ["Card Game", "Roguelike"],
    neoverse: ["Card Game", "Roguelike"],
    cardpocalypse: ["Card Game", "Roguelike"],
    inscryption: ["Card Game", "Horror"],
    "cultist simulator": ["Card Game", "Horror"],
    "weather factory": ["Card Game", "Horror"],
    "book of hours": ["Card Game", "Horror"],
    "fallen london": ["Card Game", "Horror"],
    "sunless sea": ["Adventure", "Horror"],
    "sunless skies": ["Adventure", "Horror"],
  };

  // 게임 이름과 매칭되는 장르 찾기
  for (const [keyword, genres] of Object.entries(gameGenreMap)) {
    if (name.includes(keyword)) {
      return genres;
    }
  }

  // 키워드 기반 장르 추론 (더 포괄적이고 정확한 매칭)
  const genreKeywords = [
    // FPS/Shooter
    {
      keywords: ["shooter", "gun", "rifle", "pistol", "fps", "first person"],
      genre: "FPS",
    },
    { keywords: ["tps", "third person"], genre: "TPS" },

    // RPG
    {
      keywords: [
        "rpg",
        "role",
        "character",
        "level",
        "experience",
        "xp",
        "skill",
        "class",
      ],
      genre: "RPG",
    },
    { keywords: ["jrpg", "japanese"], genre: "JRPG" },
    { keywords: ["action rpg", "arpg"], genre: "Action RPG" },

    // Strategy
    {
      keywords: ["strategy", "tactical", "war", "battle", "command", "conquer"],
      genre: "Strategy",
    },
    { keywords: ["turn based", "turn-based"], genre: "Turn-Based Strategy" },
    {
      keywords: ["real time", "real-time", "rts"],
      genre: "Real-Time Strategy",
    },
    { keywords: ["4x", "civilization", "civ"], genre: "4X Strategy" },

    // Simulation
    {
      keywords: ["simulation", "sim", "manage", "tycoon", "builder", "city"],
      genre: "Simulation",
    },
    { keywords: ["farming", "farm"], genre: "Farming Simulator" },
    { keywords: ["truck", "driving", "vehicle"], genre: "Driving Simulator" },
    { keywords: ["flight", "airplane", "aircraft"], genre: "Flight Simulator" },
    { keywords: ["space", "rocket", "orbit"], genre: "Space Simulator" },

    // Horror
    {
      keywords: [
        "horror",
        "scary",
        "fear",
        "nightmare",
        "ghost",
        "zombie",
        "vampire",
      ],
      genre: "Horror",
    },
    {
      keywords: ["survival horror", "psychological"],
      genre: "Survival Horror",
    },

    // Racing
    {
      keywords: [
        "racing",
        "car",
        "drive",
        "speed",
        "track",
        "formula",
        "nascar",
      ],
      genre: "Racing",
    },
    { keywords: ["kart", "mario kart"], genre: "Kart Racing" },

    // Sports
    {
      keywords: [
        "sports",
        "football",
        "soccer",
        "basketball",
        "baseball",
        "tennis",
        "golf",
      ],
      genre: "Sports",
    },
    { keywords: ["fifa", "pes", "pro evolution"], genre: "Football" },
    { keywords: ["nba", "2k"], genre: "Basketball" },

    // Puzzle
    {
      keywords: ["puzzle", "brain", "logic", "match", "tetris", "sudoku"],
      genre: "Puzzle",
    },
    { keywords: ["match 3", "match-3", "candy crush"], genre: "Match-3" },

    // Adventure
    {
      keywords: ["adventure", "explore", "quest", "journey", "travel"],
      genre: "Adventure",
    },
    {
      keywords: ["point and click", "point-and-click"],
      genre: "Point & Click",
    },
    { keywords: ["visual novel", "vn"], genre: "Visual Novel" },

    // Action
    {
      keywords: ["action", "fight", "combat", "battle", "beat", "brawl"],
      genre: "Action",
    },
    {
      keywords: ["platformer", "platform", "jump", "mario", "sonic"],
      genre: "Platformer",
    },
    {
      keywords: ["fighting", "fighter", "tekken", "street fighter"],
      genre: "Fighting",
    },
    { keywords: ["stealth", "sneak", "assassin", "thief"], genre: "Stealth" },

    // Multiplayer
    {
      keywords: ["multiplayer", "online", "co-op", "coop", "multi", "mmo"],
      genre: "Multiplayer",
    },
    {
      keywords: ["battle royale", "br", "battleground"],
      genre: "Battle Royale",
    },
    { keywords: ["moba", "dota", "league", "lol"], genre: "MOBA" },

    // Indie/Other
    { keywords: ["indie", "independent"], genre: "Indie" },
    { keywords: ["casual", "relaxing", "chill"], genre: "Casual" },
    { keywords: ["arcade", "retro", "classic"], genre: "Arcade" },
    {
      keywords: ["card game", "cards", "hearthstone", "magic"],
      genre: "Card Game",
    },
    { keywords: ["board game", "tabletop"], genre: "Board Game" },
    { keywords: ["party game", "party"], genre: "Party Game" },
    { keywords: ["vr", "virtual reality"], genre: "VR" },
    { keywords: ["roguelike", "roguelite", "procedural"], genre: "Roguelike" },
    { keywords: ["metroidvania", "metroid", "vania"], genre: "Metroidvania" },
    { keywords: ["souls", "souls-like", "dark souls"], genre: "Souls-like" },
    { keywords: ["sandbox", "creative", "build"], genre: "Sandbox" },
    { keywords: ["open world", "openworld"], genre: "Open World" },
    { keywords: ["story", "narrative", "cinematic"], genre: "Story Rich" },
    { keywords: ["atmospheric", "ambient"], genre: "Atmospheric" },
    { keywords: ["music", "rhythm", "dance"], genre: "Music" },
    { keywords: ["educational", "learn", "teach"], genre: "Educational" },
    { keywords: ["trivia", "quiz", "knowledge"], genre: "Trivia" },
    { keywords: ["word", "language", "vocabulary"], genre: "Word Game" },
    { keywords: ["fitness", "exercise", "workout"], genre: "Fitness" },
    {
      keywords: ["business", "management", "economy"],
      genre: "Business Simulation",
    },
    { keywords: ["tycoon", "empire", "monopoly"], genre: "Tycoon" },
    {
      keywords: ["city builder", "citybuilder", "urban"],
      genre: "City Builder",
    },
    {
      keywords: ["life simulation", "lifesim", "life sim"],
      genre: "Life Simulation",
    },
    {
      keywords: ["tower defense", "towerdefense", "td"],
      genre: "Tower Defense",
    },
    { keywords: ["tactical", "tactics", "xcom"], genre: "Tactical" },
    { keywords: ["turn based", "turn-based", "tb"], genre: "Turn-Based" },
    { keywords: ["real time", "real-time", "rt"], genre: "Real-Time" },
    {
      keywords: ["sci-fi", "scifi", "science fiction", "space"],
      genre: "Sci-Fi",
    },
    { keywords: ["fantasy", "magic", "dragon", "wizard"], genre: "Fantasy" },
    {
      keywords: ["medieval", "middle ages", "knight", "castle"],
      genre: "Medieval",
    },
    {
      keywords: ["historical", "history", "ancient", "vintage"],
      genre: "Historical",
    },
    { keywords: ["modern", "contemporary", "present"], genre: "Modern" },
    {
      keywords: ["post-apocalyptic", "postapocalyptic", "apocalypse"],
      genre: "Post-Apocalyptic",
    },
    { keywords: ["zombie", "undead", "walking dead"], genre: "Zombie" },
    { keywords: ["vampire", "blood", "gothic"], genre: "Vampire" },
    {
      keywords: ["supernatural", "paranormal", "occult"],
      genre: "Supernatural",
    },
    { keywords: ["mystery", "detective", "investigation"], genre: "Mystery" },
    { keywords: ["thriller", "suspense", "tension"], genre: "Thriller" },
    { keywords: ["psychological", "mind", "mental"], genre: "Psychological" },
    { keywords: ["drama", "serious", "emotional"], genre: "Drama" },
    { keywords: ["comedy", "funny", "humor", "joke"], genre: "Comedy" },
    { keywords: ["romance", "love", "relationship"], genre: "Romance" },
    { keywords: ["mature", "adult", "18+", "explicit"], genre: "Mature" },
    { keywords: ["violent", "gore", "blood", "death"], genre: "Violent" },
    {
      keywords: ["sexual", "sex", "nudity", "adult content"],
      genre: "Sexual Content",
    },
    {
      keywords: ["language", "profanity", "swearing"],
      genre: "Strong Language",
    },
    { keywords: ["drug", "alcohol", "substance"], genre: "Drug Reference" },
    { keywords: ["anime", "manga", "japanese animation"], genre: "Anime" },
    {
      keywords: ["pixel", "8-bit", "16-bit", "retro graphics"],
      genre: "Pixel Graphics",
    },
    { keywords: ["2d", "2-d", "two dimensional"], genre: "2D" },
    { keywords: ["3d", "3-d", "three dimensional"], genre: "3D" },
    { keywords: ["first person", "fp", "fps"], genre: "First Person" },
    { keywords: ["third person", "tp", "tps"], genre: "Third Person" },
    { keywords: ["top down", "top-down", "bird's eye"], genre: "Top-Down" },
    {
      keywords: ["side scroller", "sidescroller", "side-scroller"],
      genre: "Side Scroller",
    },
    { keywords: ["isometric", "iso", "diagonal"], genre: "Isometric" },
    { keywords: ["linear", "straight", "direct"], genre: "Linear" },
    { keywords: ["open world", "openworld", "free roam"], genre: "Open World" },
    { keywords: ["sandbox", "creative", "build", "craft"], genre: "Sandbox" },
    { keywords: ["story rich", "storyrich", "narrative"], genre: "Story Rich" },
    { keywords: ["atmospheric", "ambient", "moody"], genre: "Atmospheric" },
    {
      keywords: ["great soundtrack", "music", "audio"],
      genre: "Great Soundtrack",
    },
    {
      keywords: ["visual novel", "vn", "text adventure"],
      genre: "Visual Novel",
    },
    { keywords: ["anime", "manga", "japanese"], genre: "Anime" },
    { keywords: ["mature", "adult", "18+"], genre: "Mature" },
    { keywords: ["violent", "gore", "blood"], genre: "Violent" },
    { keywords: ["gore", "blood", "violence"], genre: "Gore" },
    { keywords: ["sexual content", "sex", "nudity"], genre: "Sexual Content" },
    { keywords: ["nudity", "nude", "naked"], genre: "Nudity" },
    {
      keywords: ["strong language", "profanity", "swearing"],
      genre: "Strong Language",
    },
    {
      keywords: ["drug reference", "drugs", "substances"],
      genre: "Drug Reference",
    },
    {
      keywords: ["alcohol reference", "alcohol", "drinking"],
      genre: "Alcohol Reference",
    },
  ];

  // 키워드 매칭으로 장르 추론
  const matchedGenres: string[] = [];

  for (const { keywords, genre } of genreKeywords) {
    if (keywords.some((keyword) => name.includes(keyword))) {
      if (!matchedGenres.includes(genre)) {
        matchedGenres.push(genre);
      }
    }
  }

  // 매칭된 장르가 있으면 반환, 없으면 Unknown
  return matchedGenres.length > 0 ? matchedGenres.slice(0, 3) : ["Unknown"];
}

// 최적의 게임 이미지 선택
function getBestGameImage(
  appId: number,
  details?: SteamAppDetails[string],
  steamGame?: SteamGame
): string {
  // 1. Steam Store API에서 가져온 이미지들 (우선순위 순)
  if (details?.data) {
    const data = details.data;

    // Header 이미지 (가장 고화질)
    if (data.header_image) {
      return data.header_image;
    }

    // Capsule 이미지 (중간 화질)
    if (data.capsule_image) {
      return data.capsule_image;
    }

    // Capsule v5 이미지
    if (data.capsule_imagev5) {
      return data.capsule_imagev5;
    }

    // 첫 번째 스크린샷 (썸네일이 아닌 풀 사이즈)
    if (data.screenshots && data.screenshots.length > 0) {
      return data.screenshots[0].path_full;
    }

    // 첫 번째 트레일러 썸네일
    if (data.movies && data.movies.length > 0) {
      return data.movies[0].thumbnail;
    }
  }

  // 2. Steam 게임 아이콘 사용 (아이콘 형태)
  if (steamGame?.img_icon_url) {
    return `https://media.steampowered.com/steamcommunity/public/images/apps/${appId}/${steamGame.img_icon_url}.jpg`;
  }

  // 3. Steam CDN에서 직접 가져오기 (fallback)
  const steamImages = [
    `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`, // Header (460x215)
    `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/capsule_616x353.jpg`, // Capsule (616x353)
    `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/capsule_467x181.jpg`, // Small capsule (467x181)
    `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/capsule_184x69.jpg`, // Mini capsule (184x69)
  ];

  // 첫 번째 이미지를 기본으로 반환 (실제 존재 여부는 클라이언트에서 검증)
  return steamImages[0];
}

// fallback 커버 이미지 매핑
function getFallbackCoverImage(appId: number): string {
  const fallbackImages: Record<number, string> = {
    730: "/counter-strike-2-game-cover.jpg",
    1091500: "/cyberpunk-2077-inspired-cover.png",
    1086940: "/baldurs-gate-3-inspired-cover.png",
    1244460: "/generic-fantasy-game-cover.png",
    1172470: "/valorant-game-cover.png",
    289070: "/civilization-6-game-cover.jpg",
  };

  return fallbackImages[appId] || "/placeholder.svg";
}

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
    return NextResponse.json(
      { error: "steam_api_key_missing" },
      { status: 500 }
    );
  }

  try {
    // Steam Web API를 통해 사용자의 게임 목록 가져오기
    const ownedGamesUrl = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${encodeURIComponent(
      apiKey
    )}&steamid=${encodeURIComponent(
      steamId
    )}&include_appinfo=true&include_played_free_games=true`;

    const ownedGamesResponse = await fetch(ownedGamesUrl, {
      next: {
        revalidate: 1800, // 30분 캐시
        tags: ["steam-games", `steam-games-${steamId}`],
      },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!ownedGamesResponse.ok) {
      const errorText = await ownedGamesResponse.text();
      console.error(
        `Steam API error: ${ownedGamesResponse.status} - ${errorText}`
      );

      // Steam API 특정 오류 처리
      if (ownedGamesResponse.status === 401) {
        return NextResponse.json(
          { error: "steam_api_key_invalid" },
          { status: 502 }
        );
      } else if (ownedGamesResponse.status === 403) {
        return NextResponse.json(
          { error: "steam_profile_private" },
          { status: 403 }
        );
      }

      return NextResponse.json({ error: "steam_api_error" }, { status: 502 });
    }

    const ownedGamesData: SteamOwnedGamesResponse =
      await ownedGamesResponse.json();

    if (!ownedGamesData.response) {
      return NextResponse.json(
        { error: "steam_api_no_response" },
        { status: 502 }
      );
    }

    if (
      !ownedGamesData.response.games ||
      ownedGamesData.response.games.length === 0
    ) {
      return NextResponse.json({ games: [] });
    }

    const steamGames = ownedGamesData.response.games;

    // 플레이 시간이 있는 게임만 필터링 (성능 최적화)
    const playedGames = steamGames.filter((game) => game.playtime_forever > 0);

    // 상위 100개 게임만 상세 정보 가져오기 (성능 최적화)
    const topGames = playedGames
      .sort((a, b) => b.playtime_forever - a.playtime_forever)
      .slice(0, 100);

    const appIds = topGames.map((game) => game.appid);

    // Steam Store API와 Steam Web API를 병렬로 호출
    const [gameDetails, steamAppDetails] = await Promise.all([
      getGameDetails(appIds),
      getSteamAppDetails(appIds),
    ]);

    console.log("Steam Web API Results:", steamAppDetails);

    // 게임 데이터 변환 (개선된 장르 추출 로직)
    const games = playedGames.map((game) => {
      const details = gameDetails[game.appid.toString()];
      const webApiDetails = steamAppDetails[game.appid];

      // Steam Store API에서 장르 정보 추출 (genres, categories, tags 모두 활용)
      const steamGenres = extractGenresFromSteamData(details);

      // Steam Web API에서 장르 정보 추출
      const webApiGenres = webApiDetails?.genres || [];

      // fallback 장르 매핑 (Steam API에서 가져오지 못한 경우에만 사용)
      const fallbackGenres = getFallbackGenres(game.name);

      // 장르 우선순위: Steam Web API > Steam Store API > Fallback
      let finalGenres =
        webApiGenres.length > 0
          ? webApiGenres
          : steamGenres.length > 0
          ? steamGenres
          : fallbackGenres;

      // Unknown 장르가 있으면 제거 (더 나은 장르 정보가 있는 경우)
      finalGenres = finalGenres.filter((genre) => genre !== "Unknown");

      // 모든 장르가 Unknown이었던 경우에만 Unknown 유지
      if (finalGenres.length === 0) {
        finalGenres = ["Unknown"];
      }

      return {
        appid: game.appid,
        name: game.name,
        playtime_hours: Math.round(game.playtime_forever / 60), // 분을 시간으로 변환
        playtime_formatted: formatPlaytime(game.playtime_forever),
        genres: finalGenres,
        coverImage: getBestGameImage(game.appid, details, game),
        lastPlayed: game.rtime_last_played
          ? formatLastPlayed(game.rtime_last_played)
          : { type: "noPlayRecord", count: 0 },
        lastPlayedTimestamp: game.rtime_last_played || 0,
        playtime_2weeks: game.playtime_2weeks || 0,
        playtime_minutes: game.playtime_forever, // 원본 분 단위 데이터 보존
        playtime_windows: game.playtime_windows_forever || 0,
        playtime_mac: game.playtime_mac_forever || 0,
        playtime_linux: game.playtime_linux_forever || 0,
        playtime_deck: game.playtime_deck_forever || 0,
        playtime_disconnected: game.playtime_disconnected || 0,
        has_community_visible_stats: game.has_community_visible_stats || false,
      };
    });

    // 플레이 시간 순으로 정렬
    games.sort((a, b) => b.playtime_hours - a.playtime_hours);

    return NextResponse.json({ games });
  } catch (error) {
    console.error("Steam API error:", error);
    return NextResponse.json({ error: "request_failed" }, { status: 500 });
  }
}
