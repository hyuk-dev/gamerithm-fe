"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/navigation";
import Link from "next/link";
import { useGames } from "@/hooks/use-games";
import { useAuth } from "@/hooks/use-auth";
import { EmptyState } from "@/components/common";
import { FILTER_GENRES, normalizeGenre } from "@/constants/genres";
// Mock game data
const mockGames = [
  {
    id: 1,
    title: "Cyberpunk 2077",
    coverImage: "/cyberpunk-2077-inspired-cover.png",
    playtime: 245,
    genres: ["RPG", "Action"],
    lastPlayed: "2 days ago",
  },
  {
    id: 2,
    title: "Counter-Strike 2",
    coverImage: "/counter-strike-2-game-cover.jpg",
    playtime: 1250,
    genres: ["FPS", "Multiplayer"],
    lastPlayed: "1 day ago",
  },
  {
    id: 3,
    title: "Baldur's Gate 3",
    coverImage: "/baldurs-gate-3-inspired-cover.png",
    playtime: 180,
    genres: ["RPG", "Strategy"],
    lastPlayed: "5 days ago",
  },
  {
    id: 4,
    title: "Elden Ring",
    coverImage: "/generic-fantasy-game-cover.png",
    playtime: 320,
    genres: ["RPG", "Action"],
    lastPlayed: "1 week ago",
  },
  {
    id: 5,
    title: "Valorant",
    coverImage: "/valorant-game-cover.png",
    playtime: 890,
    genres: ["FPS", "Multiplayer"],
    lastPlayed: "3 days ago",
  },
  {
    id: 6,
    title: "Civilization VI",
    coverImage: "/civilization-6-game-cover.jpg",
    playtime: 450,
    genres: ["Strategy", "Turn-Based"],
    lastPlayed: "2 weeks ago",
  },
];

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedPlaytime, setSelectedPlaytime] = useState<string[]>([]);
  const [showRecentlyPlayed, setShowRecentlyPlayed] = useState(false);
  const { games, isLoading: isGamesLoading, error, fetchGames } = useGames();
  const { isAuthenticated, isLoading: isAuthLoading, fetchSession } = useAuth();

  useEffect(() => {
    // Check authentication and load games
    const loadData = async () => {
      await fetchSession();
      if (isAuthenticated) {
        await fetchGames();
      }
      setIsLoading(false);
    };

    loadData();
  }, [fetchSession, fetchGames, isAuthenticated]);

  const handleRetry = async () => {
    setIsLoading(true);
    await fetchGames();
    setIsLoading(false);
  };

  const sourceGames =
    games.length > 0
      ? games.map((g, idx) => ({
          id: g.appid,
          title: g.name,
          coverImage: g.coverImage || "/placeholder.svg",
          playtime: g.playtime_hours,
          genres: g.genres,
          lastPlayed: g.lastPlayed || "",
        }))
      : mockGames;

  const filteredGames = sourceGames.filter((game) => {
    // 장르 필터링 - 한글 장르를 영어로 정규화하여 비교
    if (selectedGenres.length > 0) {
      const gameNormalizedGenres = game.genres.map(normalizeGenre);
      const hasGenreMatch = selectedGenres.some((selectedGenre) =>
        gameNormalizedGenres.includes(selectedGenre)
      );
      if (!hasGenreMatch) {
        return false;
      }
    }

    if (selectedPlaytime.length > 0) {
      const hasMatch = selectedPlaytime.some((range) => {
        if (range === "0-10h" && game.playtime <= 10) return true;
        if (range === "10-50h" && game.playtime > 10 && game.playtime <= 50)
          return true;
        if (range === "50h+" && game.playtime > 50) return true;
        return false;
      });
      if (!hasMatch) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white">
      <Navigation />

      <div className="flex pt-16">
        {/* Sidebar */}
        <Sidebar
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
          selectedPlaytime={selectedPlaytime}
          setSelectedPlaytime={setSelectedPlaytime}
          showRecentlyPlayed={showRecentlyPlayed}
          setShowRecentlyPlayed={setShowRecentlyPlayed}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {/* Stats Section */}
          <StatsSection games={games} isAuthenticated={isAuthenticated} />

          {/* Games Grid */}
          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Your Library</h2>

            {/* Show loading state */}
            {isLoading || isAuthLoading || isGamesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
                {[...Array(8)].map((_, i) => (
                  <GameCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <>
                {/* Show not logged in state */}
                {!isAuthenticated ? (
                  <EmptyState type="not-logged-in" />
                ) : error ? (
                  /* Show error state */
                  <EmptyState type="error" onRetry={handleRetry} />
                ) : filteredGames.length === 0 ? (
                  /* Show no games state */
                  <EmptyState type="no-games" onRetry={handleRetry} />
                ) : (
                  /* Show games grid */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
                    {filteredGames.map((game) => (
                      <GameCard key={game.id} game={game} />
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        </main>
      </div>

      {/* Floating CTA Button */}
      <FloatingCTA />
    </div>
  );
}

function Sidebar({
  selectedGenres,
  setSelectedGenres,
  selectedPlaytime,
  setSelectedPlaytime,
  showRecentlyPlayed,
  setShowRecentlyPlayed,
}: {
  selectedGenres: string[];
  setSelectedGenres: (genres: string[]) => void;
  selectedPlaytime: string[];
  setSelectedPlaytime: (playtime: string[]) => void;
  showRecentlyPlayed: boolean;
  setShowRecentlyPlayed: (show: boolean) => void;
}) {
  const playtimeRanges = ["0-10h", "10-50h", "50h+"];

  const toggleGenre = (genre: string) => {
    setSelectedGenres(
      selectedGenres.includes(genre)
        ? selectedGenres.filter((g) => g !== genre)
        : [...selectedGenres, genre]
    );
  };

  const togglePlaytime = (range: string) => {
    setSelectedPlaytime(
      selectedPlaytime.includes(range)
        ? selectedPlaytime.filter((r) => r !== range)
        : [...selectedPlaytime, range]
    );
  };

  return (
    <aside className="hidden lg:block w-64 bg-[#1a1a2e] border-r border-gray-800 p-6 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="space-y-8">
        {/* Genre Filter */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-purple-400">Genre</h3>
          <div className="space-y-3">
            {FILTER_GENRES.map((genre) => (
              <div key={genre} className="flex items-center space-x-2">
                <Checkbox
                  id={`genre-${genre}`}
                  checked={selectedGenres.includes(genre)}
                  onCheckedChange={() => toggleGenre(genre)}
                />
                <Label
                  htmlFor={`genre-${genre}`}
                  className="text-sm cursor-pointer text-gray-300"
                >
                  {genre}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Playtime Filter */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-cyan-400">Playtime</h3>
          <div className="space-y-3">
            {playtimeRanges.map((range) => (
              <div key={range} className="flex items-center space-x-2">
                <Checkbox
                  id={`playtime-${range}`}
                  checked={selectedPlaytime.includes(range)}
                  onCheckedChange={() => togglePlaytime(range)}
                />
                <Label
                  htmlFor={`playtime-${range}`}
                  className="text-sm cursor-pointer text-gray-300"
                >
                  {range}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Played */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-purple-400">
            Recently Played
          </h3>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="recently-played"
              checked={showRecentlyPlayed}
              onCheckedChange={(checked) =>
                setShowRecentlyPlayed(checked as boolean)
              }
            />
            <Label
              htmlFor="recently-played"
              className="text-sm cursor-pointer text-gray-300"
            >
              Show only recent
            </Label>
          </div>
        </div>
      </div>
    </aside>
  );
}

function StatsSection({
  games,
  isAuthenticated,
}: {
  games: any[];
  isAuthenticated: boolean;
}) {
  // Calculate stats from actual game data
  const totalGames = games.length;
  const totalHours = games.reduce(
    (sum, game) => sum + (game.playtime_hours || 0),
    0
  );

  // Calculate most played genre (Unknown 제외)
  const genreCounts = games.reduce((counts, game) => {
    game.genres?.forEach((genre: string) => {
      // Unknown 장르는 제외하고 계산
      if (genre !== "Unknown") {
        counts[genre] = (counts[genre] || 0) + 1;
      }
    });
    return counts;
  }, {} as Record<string, number>);

  const mostPlayedGenre = Object.entries(genreCounts).reduce(
    (max, [genre, count]) =>
      (count as number) > max.count ? { genre, count: count as number } : max,
    { genre: "N/A", count: 0 }
  ).genre;

  const stats = [
    {
      icon: (
        <svg
          className="w-8 h-8 text-purple-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      label: "총 게임 수",
      value: isAuthenticated ? totalGames.toLocaleString() : "0",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-cyan-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      label: "총 플레이 시간",
      value: isAuthenticated ? totalHours.toLocaleString() + "h" : "0h",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-purple-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      ),
      label: "가장 많이 플레이한 장르",
      value: isAuthenticated ? mostPlayedGenre : "N/A",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="bg-[#1a1a2e] border-gray-800 p-6 hover:border-purple-500 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-900 rounded-xl">{stat.icon}</div>
            <div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// fallback 커버 이미지 매핑 (클라이언트 사이드용)
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

// 커스텀 이미지 컴포넌트
function GameImage({ game }: { game: (typeof mockGames)[0] }) {
  const [currentSrc, setCurrentSrc] = useState(
    game.coverImage || "/placeholder.svg"
  );
  const [isIcon, setIsIcon] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFallbackIndex, setCurrentFallbackIndex] = useState(0);

  // 고화질 이미지 우선순위 리스트
  const getHighQualityImageSequence = (appId: number) => [
    `/api/steam/image/${appId}/library_hero`, // 가장 고화질
    `/api/steam/image/${appId}/library`,
    `/api/steam/image/${appId}/header`,
    `/api/steam/image/${appId}/page_bg`,
    `/api/steam/image/${appId}/capsule`, // 중간 해상도
    `/api/steam/image/${appId}/small_capsule`,
    `/api/steam/image/${appId}/mini_capsule`,
  ];

  const handleError = () => {
    if (hasError) return; // 이미 에러 상태면 중복 처리 방지

    const appId = (game as any).appid || game.id;
    const highQualitySequence = getHighQualityImageSequence(appId);

    // 원본 coverImage에서 시작하는 경우
    if (currentSrc === game.coverImage) {
      setCurrentSrc(highQualitySequence[0]);
      setCurrentFallbackIndex(1);
      return;
    }

    // 고화질 이미지 시퀀스에서 다음 이미지 시도
    if (currentSrc.includes("/api/steam/image/")) {
      if (currentFallbackIndex < highQualitySequence.length) {
        setCurrentSrc(highQualitySequence[currentFallbackIndex]);
        setCurrentFallbackIndex((prev) => prev + 1);
        return;
      }

      // 모든 고화질 이미지 실패 시 Steam 아이콘으로
      setCurrentSrc(
        `https://media.steampowered.com/steamcommunity/public/images/apps/${appId}/${
          (game as any).img_icon_url || "icon"
        }.jpg`
      );
      setIsIcon(true);
      return;
    }

    // Steam 아이콘 실패 시 로컬 fallback
    if (currentSrc.includes("steamcommunity/public/images/apps/")) {
      setCurrentSrc(getFallbackCoverImage(appId));
      setIsIcon(false);
      return;
    }

    // 최종 fallback
    setCurrentSrc("/placeholder.svg");
    setIsIcon(false);
    setHasError(true);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // 현재 이미지가 아이콘인지 확인
  useEffect(() => {
    const isIconImage =
      currentSrc.includes("steamcommunity/public/images/apps/") &&
      !currentSrc.includes("header") &&
      !currentSrc.includes("capsule");
    setIsIcon(isIconImage);
  }, [currentSrc]);

  // 컴포넌트 마운트 시 고화질 이미지부터 시도
  useEffect(() => {
    if (game.coverImage && !game.coverImage.includes("/placeholder")) {
      const appId = (game as any).appid || game.id;
      const highQualitySequence = getHighQualityImageSequence(appId);
      setCurrentSrc(highQualitySequence[0]);
      setCurrentFallbackIndex(1);
    }
  }, [game.coverImage, game.id]);

  return (
    <div className="absolute inset-0 w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-cyan-900/20 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={currentSrc}
        alt={game.title}
        className={`absolute inset-0 w-full h-full group-hover:scale-110 transition-transform duration-300 ${
          isIcon ? "object-contain p-4" : "object-cover"
        } ${isLoading ? "opacity-0" : "opacity-100"}`}
        loading="lazy"
        onError={handleError}
        onLoad={handleLoad}
        style={{
          objectPosition: "top center",
        }}
      />
    </div>
  );
}

function GameCard({ game }: { game: (typeof mockGames)[0] }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleCardClick = () => {
    // Steam Store URL로 새 탭에서 열기
    const steamUrl = `https://store.steampowered.com/app/${game.id}`;
    window.open(steamUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <Card
        className="bg-[#1a1a2e] border-gray-800 overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer group h-full"
        onClick={handleCardClick}
      >
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-purple-900/20 to-cyan-900/20">
          <GameImage game={game} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-4 space-y-3">
          <h3 className="text-lg font-bold text-white truncate">
            {game.title}
          </h3>
          <p className="text-sm text-gray-400">{game.playtime} hours played</p>
          <div className="flex flex-wrap gap-2">
            {game.genres.slice(0, 3).map((genre) => {
              const normalizedGenre = normalizeGenre(genre);
              // 주요 장르만 표시하고, Unknown이나 너무 세부적인 장르는 제외
              if (
                normalizedGenre === "Unknown" ||
                normalizedGenre.includes("Steam") ||
                normalizedGenre.includes("Controller") ||
                normalizedGenre.includes("Deck") ||
                normalizedGenre.includes("Cloud") ||
                normalizedGenre.includes("Workshop") ||
                normalizedGenre.includes("Achievements") ||
                normalizedGenre.includes("Trading Cards") ||
                normalizedGenre.includes("Leaderboards") ||
                normalizedGenre.includes("Input")
              ) {
                return null;
              }
              return (
                <Badge
                  key={genre}
                  variant="secondary"
                  className="bg-purple-900/30 text-purple-300 hover:bg-purple-900/50"
                >
                  {normalizedGenre}
                </Badge>
              );
            })}
          </div>
          <p className="text-xs text-gray-500">
            Last played: {game.lastPlayed}
          </p>
        </div>
      </Card>
    </div>
  );
}

function GameCardSkeleton() {
  return (
    <Card className="bg-[#1a1a2e] border-gray-800 overflow-hidden animate-pulse h-full">
      <div className="aspect-video bg-gray-800" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-800 rounded w-3/4" />
        <div className="h-4 bg-gray-800 rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-6 bg-gray-800 rounded w-16" />
          <div className="h-6 bg-gray-800 rounded w-16" />
        </div>
        <div className="h-3 bg-gray-800 rounded w-2/3" />
      </div>
    </Card>
  );
}

function FloatingCTA() {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Link href="/recommendations">
        <Button
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-6 text-lg rounded-full shadow-2xl hover:scale-110 transition-all duration-300 animate-pulse cursor-pointer"
        >
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
          Get AI Recommendations
        </Button>
      </Link>
    </div>
  );
}
