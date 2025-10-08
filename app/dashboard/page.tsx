"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useGames } from "@/hooks/use-games";
import { useAuth } from "@/hooks/use-auth";
import { EmptyState } from "@/components/common";
import { FILTER_GENRES, normalizeGenre } from "@/constants/genres";
import { translateLastPlayed } from "@/lib/time-utils";
// Mock game data
const mockGames = [
  {
    id: 1,
    title: "Cyberpunk 2077",
    coverImage: "/cyberpunk-2077-inspired-cover.png",
    playtime: 245,
    genres: ["RPG", "Action"],
    lastPlayed: { type: "days", count: 2 },
  },
  {
    id: 2,
    title: "Counter-Strike 2",
    coverImage: "/counter-strike-2-game-cover.jpg",
    playtime: 1250,
    genres: ["FPS", "Multiplayer"],
    lastPlayed: { type: "days", count: 1 },
  },
  {
    id: 3,
    title: "Baldur's Gate 3",
    coverImage: "/baldurs-gate-3-inspired-cover.png",
    playtime: 180,
    genres: ["RPG", "Strategy"],
    lastPlayed: { type: "days", count: 5 },
  },
  {
    id: 4,
    title: "Elden Ring",
    coverImage: "/generic-fantasy-game-cover.png",
    playtime: 320,
    genres: ["RPG", "Action"],
    lastPlayed: { type: "days", count: 7 },
  },
  {
    id: 5,
    title: "Valorant",
    coverImage: "/valorant-game-cover.png",
    playtime: 890,
    genres: ["FPS", "Multiplayer"],
    lastPlayed: { type: "days", count: 3 },
  },
  {
    id: 6,
    title: "Civilization VI",
    coverImage: "/civilization-6-game-cover.jpg",
    playtime: 450,
    genres: ["Strategy", "Turn-Based"],
    lastPlayed: { type: "days", count: 14 },
  },
];

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedPlaytime, setSelectedPlaytime] = useState<string[]>([]);
  const [showRecentlyPlayed, setShowRecentlyPlayed] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { t } = useTranslation();
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
          coverImage: g.coverImage || "/default-game-cover.svg",
          playtime: g.playtime_hours,
          genres: g.genres,
          lastPlayed: (g.lastPlayed as { type: string; count: number }) || {
            type: "noPlayRecord",
            count: 0,
          },
        }))
      : mockGames;

  const filteredGames = sourceGames.filter((game) => {
    // Genre filtering - normalize Korean genres to English for comparison
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

      <div className="flex flex-col lg:flex-row pt-16">
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="bg-purple-600 hover:bg-purple-700 rounded-full w-12 h-12 shadow-lg cursor-pointer"
          >
            <svg
              className={`w-5 h-5 transition-transform duration-200 text-white ${
                showMobileFilters ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
              />
            </svg>
          </Button>
        </div>

        {/* Sidebar - Desktop: fixed left, Mobile: toggle drawer */}
        <Sidebar
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
          selectedPlaytime={selectedPlaytime}
          setSelectedPlaytime={setSelectedPlaytime}
          showRecentlyPlayed={showRecentlyPlayed}
          setShowRecentlyPlayed={setShowRecentlyPlayed}
          showMobileFilters={showMobileFilters}
          setShowMobileFilters={setShowMobileFilters}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {/* Stats Section */}
          <StatsSection games={games} isAuthenticated={isAuthenticated} />

          {/* Games Grid */}
          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-6">{t("dashboard.title")}</h2>

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

      {/* Floating CTA Button - Hide when mobile filters are open */}
      {/* <FloatingCTA showMobileFilters={showMobileFilters} /> */}
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
  showMobileFilters,
  setShowMobileFilters,
}: {
  selectedGenres: string[];
  setSelectedGenres: (genres: string[]) => void;
  selectedPlaytime: string[];
  setSelectedPlaytime: (playtime: string[]) => void;
  showRecentlyPlayed: boolean;
  setShowRecentlyPlayed: (show: boolean) => void;
  showMobileFilters: boolean;
  setShowMobileFilters: (show: boolean) => void;
}) {
  const { t } = useTranslation();
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

  const FilterContent = () => (
    <div className="space-y-6 lg:space-y-8">
      {/* Genre Filter */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-purple-400">
          {t("dashboard.filters.genre")}
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:space-y-3 lg:gap-0">
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
        <h3 className="text-lg font-semibold mb-4 text-cyan-400">
          {t("dashboard.filters.playtime")}
        </h3>
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
          {t("dashboard.filters.recentlyPlayed")}
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
            {t("dashboard.filters.showOnlyRecent")}
          </Label>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-[#1a1a2e] border-r border-gray-800 h-screen fixed left-0 top-[64px] overflow-y-auto z-40">
        <div className="px-6 pt-4 pb-6">
          <FilterContent />
        </div>
      </aside>

      {/* Mobile Filter Drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
          showMobileFilters ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            showMobileFilters ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setShowMobileFilters(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-[#1a1a2e] rounded-t-2xl p-6 transform transition-transform duration-300 ${
            showMobileFilters ? "translate-y-0" : "translate-y-full"
          }`}
          style={{ maxHeight: "80vh" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {t("dashboard.filters.libraryFilters")}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileFilters(false)}
              className="text-gray-400 hover:text-white"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>

          {/* Filter Content */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight: "calc(80vh - 120px)" }}
          >
            <FilterContent />
          </div>
        </div>
      </div>

      {/* Desktop Spacer */}
      <div className="hidden lg:block w-64 flex-shrink-0" />
    </>
  );
}

function StatsSection({
  games,
  isAuthenticated,
}: {
  games: any[];
  isAuthenticated: boolean;
}) {
  const { t } = useTranslation();
  // Calculate stats from actual game data
  const totalGames = games.length;
  const totalHours = games.reduce(
    (sum, game) => sum + (game.playtime_hours || 0),
    0
  );

  // Calculate most played genre (excluding Unknown)
  const genreCounts = games.reduce((counts, game) => {
    game.genres?.forEach((genre: string) => {
      // Exclude Unknown genre from calculation
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

  // Translate genre to current language
  const translateGenre = (genre: string) => {
    if (genre === "N/A") return "N/A";
    return t(`genres.${genre}`) || genre;
  };

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
      label: t("dashboard.stats.totalGames"),
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
      label: t("dashboard.stats.totalPlaytime"),
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
      label: t("dashboard.stats.mostPlayedGenre"),
      value: isAuthenticated ? translateGenre(mostPlayedGenre) : "N/A",
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

// Fallback cover image mapping (client-side)
function getFallbackCoverImage(appId: number): string {
  const fallbackImages: Record<number, string> = {
    730: "/counter-strike-2-game-cover.jpg",
    1091500: "/cyberpunk-2077-inspired-cover.png",
    1086940: "/baldurs-gate-3-inspired-cover.png",
    1244460: "/generic-fantasy-game-cover.png",
    1172470: "/valorant-game-cover.png",
    289070: "/civilization-6-game-cover.jpg",
  };

  return fallbackImages[appId] || "/default-game-cover.svg";
}

// Custom image component
function GameImage({ game }: { game: (typeof mockGames)[0] }) {
  const [currentSrc, setCurrentSrc] = useState(
    game.coverImage || "/default-game-cover.svg"
  );
  const [isIcon, setIsIcon] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFallbackIndex, setCurrentFallbackIndex] = useState(0);

  // High quality image priority list
  const getHighQualityImageSequence = (appId: number) => [
    `/api/steam/image/${appId}/library_hero`, // Highest quality
    `/api/steam/image/${appId}/library`,
    `/api/steam/image/${appId}/header`,
    `/api/steam/image/${appId}/page_bg`,
    `/api/steam/image/${appId}/capsule`, // Medium resolution
    `/api/steam/image/${appId}/small_capsule`,
    `/api/steam/image/${appId}/mini_capsule`,
  ];

  const handleError = () => {
    if (hasError) return; // Already in error state, prevent duplicate processing

    const appId = (game as any).appid || game.id;
    const highQualitySequence = getHighQualityImageSequence(appId);

    // Starting from original coverImage
    if (currentSrc === game.coverImage) {
      setCurrentSrc(highQualitySequence[0]);
      setCurrentFallbackIndex(1);
      return;
    }

    // Try next image from high quality sequence
    if (currentSrc.includes("/api/steam/image/")) {
      if (currentFallbackIndex < highQualitySequence.length) {
        setCurrentSrc(highQualitySequence[currentFallbackIndex]);
        setCurrentFallbackIndex((prev) => prev + 1);
        return;
      }

      // All high quality images failed, fallback to Steam icon
      setCurrentSrc(
        `https://media.steampowered.com/steamcommunity/public/images/apps/${appId}/${
          (game as any).img_icon_url || "icon"
        }.jpg`
      );
      setIsIcon(true);
      return;
    }

    // Steam icon failed, fallback to local
    if (currentSrc.includes("steamcommunity/public/images/apps/")) {
      setCurrentSrc(getFallbackCoverImage(appId));
      setIsIcon(false);
      return;
    }

    // Final fallback
    setCurrentSrc("/default-game-cover.svg");
    setIsIcon(false);
    setHasError(true);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Check if current image is icon
  useEffect(() => {
    const isIconImage =
      currentSrc.includes("steamcommunity/public/images/apps/") &&
      !currentSrc.includes("header") &&
      !currentSrc.includes("capsule");
    setIsIcon(isIconImage);
  }, [currentSrc]);

  // Try high quality images from component mount
  useEffect(() => {
    if (game.coverImage && !game.coverImage.includes("/default-game-cover")) {
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
  const { t } = useTranslation();

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
    // Open Steam Store URL in new tab
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
          <p className="text-sm text-gray-400">
            {game.playtime} {t("dashboard.gameCard.hoursPlayed")}
          </p>
          <div className="flex flex-wrap gap-2">
            {game.genres.slice(0, 3).map((genre) => {
              const normalizedGenre = normalizeGenre(genre);
              // Display only major genres, exclude Unknown or overly specific genres
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
                  {t(`genres.${normalizedGenre}`) || normalizedGenre}
                </Badge>
              );
            })}
          </div>
          <p className="text-xs text-gray-500">
            {t("dashboard.gameCard.lastPlayed")}:{" "}
            {translateLastPlayed(game.lastPlayed, t)}
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

function FloatingCTA({ showMobileFilters }: { showMobileFilters: boolean }) {
  // Hide on mobile when filters are open, always show on desktop
  if (showMobileFilters) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 sm:bottom-8 z-40">
      <Link href="/recommendations">
        <Button
          size="sm"
          className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-3 py-2 sm:px-8 sm:py-6 text-sm sm:text-lg rounded-full shadow-2xl hover:scale-110 transition-all duration-300 animate-pulse cursor-pointer"
        >
          <svg
            className="w-4 h-4 sm:w-6 sm:h-6 mr-1 sm:mr-2"
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
          <span className="hidden sm:inline">Get AI Recommendations</span>
          <span className="sm:hidden">AI</span>
        </Button>
      </Link>
    </div>
  );
}
