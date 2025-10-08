"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navigation } from "@/components/navigation";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

// Mock recommendation data
const mockRecommendations = [
  {
    id: 1,
    title: "Starfield",
    price: "$69.99",
    bannerImage: "/starfield-space-exploration-game-banner.jpg",
    matchScore: 95,
    aiExplanation:
      "You'll love this because it combines the deep RPG mechanics you enjoyed in Baldur's Gate 3 with the exploration freedom of open-world games. The space setting offers a fresh take on the genres you already love.",
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
    aiExplanation:
      "Based on your love for action-packed gameplay and strategic depth, Hades II delivers fast-paced combat with meaningful progression. The roguelike elements ensure every run feels fresh and rewarding.",
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
    aiExplanation:
      "You've spent significant time in multiplayer FPS games like Counter-Strike 2 and Valorant. Helldivers 2 offers cooperative gameplay with tactical depth, perfect for team-based action you enjoy.",
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
    aiExplanation:
      "Your extensive playtime in Civilization VI shows you appreciate deep strategy games. Manor Lords combines city-building with tactical battles in a medieval setting, offering the strategic depth you crave.",
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
    aiExplanation:
      "This unique blend of survival, crafting, and creature collection offers something fresh while maintaining the action and exploration elements you enjoy. The multiplayer aspect adds replay value.",
    genres: ["Survival", "Action", "Multiplayer"],
    multiplayer: true,
    releaseDate: "2024-01-19",
  },
];

export default function RecommendationsPage() {
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [multiplayerFilter, setMultiplayerFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState("match");
  const [userPrompt, setUserPrompt] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecommendations, setGeneratedRecommendations] = useState<
    typeof mockRecommendations
  >([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { t } = useTranslation();
  const { toast } = useToast();

  const toggleGenre = (genre: string) => {
    setSelectedGenres(
      selectedGenres.includes(genre)
        ? selectedGenres.filter((g) => g !== genre)
        : [...selectedGenres, genre]
    );
  };

  const handleGenerateRecommendations = async () => {
    if (!userPrompt.trim()) return;

    setIsGenerating(true);

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userPrompt: userPrompt.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(
          `${t("recommendations.messages.apiError")}: ${response.status}`
        );
      }

      const data = await response.json();

      // API response structure verification and processing
      console.log(t("recommendations.messages.apiResponseData"), data);
      const recommendations = data.recommendations || data;
      console.log(
        t("recommendations.messages.processedRecommendations"),
        recommendations
      );

      // Store recommendation data received from API
      const finalRecommendations = Array.isArray(recommendations)
        ? recommendations
        : [];
      console.log(
        t("recommendations.messages.finalRecommendations"),
        finalRecommendations
      );
      setGeneratedRecommendations(finalRecommendations);
      setShowRecommendations(true);

      toast({
        title: t("recommendations.messages.recommendationsGenerated"),
        description: `${
          Array.isArray(recommendations) ? recommendations.length : 0
        } ${t("recommendations.messages.gamesRecommended")}.`,
      });
    } catch (error) {
      console.error(t("recommendations.messages.generationError"), error);

      // Use mock data when error occurs
      setGeneratedRecommendations(mockRecommendations);
      setShowRecommendations(true);

      toast({
        title: t("recommendations.messages.errorOccurred"),
        description: t("recommendations.messages.defaultRecommendations"),
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Use generatedRecommendations if recommendations are generated, otherwise use mockRecommendations
  const recommendationsToFilter =
    showRecommendations && generatedRecommendations.length > 0
      ? generatedRecommendations
      : mockRecommendations;

  const filteredRecommendations = recommendationsToFilter
    .filter((game) => {
      const price = Number.parseFloat(game.price.replace("$", ""));
      if (price < priceRange[0] || price > priceRange[1]) return false;

      if (
        selectedGenres.length > 0 &&
        !game.genres.some((g) => selectedGenres.includes(g))
      ) {
        return false;
      }

      if (multiplayerFilter === "multiplayer" && !game.multiplayer)
        return false;
      if (multiplayerFilter === "singleplayer" && game.multiplayer)
        return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "match") return b.matchScore - a.matchScore;
      if (sortBy === "price")
        return (
          Number.parseFloat(a.price.replace("$", "")) -
          Number.parseFloat(b.price.replace("$", ""))
        );
      if (sortBy === "release")
        return (
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        );
      return 0;
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
              className={`w-5 h-5 transition-transform duration-200 ${
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

        {/* Filters Sidebar - Desktop: fixed left, Mobile: toggle drawer */}
        <FiltersSidebar
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedGenres={selectedGenres}
          toggleGenre={toggleGenre}
          multiplayerFilter={multiplayerFilter}
          setMultiplayerFilter={setMultiplayerFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          showMobileFilters={showMobileFilters}
          setShowMobileFilters={setShowMobileFilters}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="mb-6">
              <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                {t("recommendations.title")}
              </h1>
              <p className="text-gray-400 text-lg">
                {t("recommendations.subtitle")}
              </p>
            </div>

            {/* Prompt Input Section */}
            <Card className="bg-[#1a1a2e]/80 backdrop-blur-xl border-0 mb-8">
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="prompt"
                      className="text-lg font-semibold text-purple-400 mb-2 block"
                    >
                      {t("recommendations.prompt.label")}
                    </Label>
                    <Textarea
                      id="prompt"
                      placeholder={t("recommendations.prompt.placeholder")}
                      value={userPrompt}
                      onChange={(e) => setUserPrompt(e.target.value)}
                      className="min-h-[120px] bg-[#0f0f23] border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="flex justify-center w-full">
                    <Button
                      onClick={handleGenerateRecommendations}
                      disabled={!userPrompt.trim() || isGenerating}
                      className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-6 py-3 cursor-pointer disabled:cursor-not-allowed text-base"
                    >
                      {isGenerating ? (
                        <>
                          <svg
                            className="animate-spin w-5 h-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {t("recommendations.prompt.generating")}
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5 mr-2"
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
                          {t("recommendations.prompt.generateButton")}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Recommendations Grid */}
          {!showRecommendations ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-r from-purple-600/20 to-cyan-600/20 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {t("recommendations.emptyState.readyToDiscover")}
              </h3>
              <p className="text-gray-400 mb-6">
                {t("recommendations.emptyState.enterPreferences")}
              </p>
            </div>
          ) : filteredRecommendations.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredRecommendations.map((game, index) => (
                <RecommendationCard key={game.id} game={game} index={index} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function FiltersSidebar({
  priceRange,
  setPriceRange,
  selectedGenres,
  toggleGenre,
  multiplayerFilter,
  setMultiplayerFilter,
  sortBy,
  setSortBy,
  showMobileFilters,
  setShowMobileFilters,
}: {
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  selectedGenres: string[];
  toggleGenre: (genre: string) => void;
  multiplayerFilter: string;
  setMultiplayerFilter: (filter: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  showMobileFilters: boolean;
  setShowMobileFilters: (show: boolean) => void;
}) {
  const { t } = useTranslation();
  const genres = [
    "RPG",
    "Action",
    "FPS",
    "Strategy",
    "Roguelike",
    "Indie",
    "Survival",
    "Co-op",
  ];

  const FilterContent = () => (
    <div className="space-y-6 lg:space-y-8">
      {/* Mobile: compact grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 lg:gap-0 lg:space-y-8">
        {/* Sort By */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-purple-400">
            {t("recommendations.filters.sortBy")}
          </h3>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-[#0f0f23] border-gray-700 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="match">
                {t("recommendations.filters.matchScore")}
              </SelectItem>
              <SelectItem value="price">
                {t("recommendations.filters.price")}
              </SelectItem>
              <SelectItem value="release">
                {t("recommendations.filters.releaseDate")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-cyan-400">
            {t("recommendations.filters.priceRange")}
          </h3>
          <div className="space-y-4">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={100}
              step={5}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-400">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Multiplayer Filter */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-cyan-400">
            {t("recommendations.filters.playerMode")}
          </h3>
          <Select
            value={multiplayerFilter}
            onValueChange={setMultiplayerFilter}
          >
            <SelectTrigger className="bg-[#0f0f23] border-gray-700 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("recommendations.filters.allGames")}
              </SelectItem>
              <SelectItem value="multiplayer">
                {t("recommendations.filters.multiplayerOnly")}
              </SelectItem>
              <SelectItem value="singleplayer">
                {t("recommendations.filters.singleplayerOnly")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Genre Filter - separate section on mobile */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-purple-400">
          {t("recommendations.filters.genre")}
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
          {genres.map((genre) => (
            <div key={genre} className="flex items-center space-x-2">
              <Checkbox
                id={`genre-${genre}`}
                checked={selectedGenres.includes(genre)}
                onCheckedChange={() => toggleGenre(genre)}
                className="cursor-pointer"
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
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-80 bg-[#1a1a2e] border-r border-gray-800 h-screen fixed left-0 top-[60px] overflow-y-auto z-40">
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
              {t("recommendations.filters.title")}
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
      <div className="hidden lg:block w-80 flex-shrink-0" />
    </>
  );
}

function RecommendationCard({
  game,
  index,
}: {
  game: (typeof mockRecommendations)[0];
  index: number;
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { t } = useTranslation();

  // Game title image mapping
  const getGameImage = (title: string, bannerImage: string) => {
    // Use actual image URL from API if available
    if (
      bannerImage &&
      bannerImage !== "/placeholder.jpg" &&
      bannerImage !== "/default-game-cover.svg" &&
      bannerImage !== "actual_game_image_URL_or_local_image_path" &&
      (bannerImage.startsWith("http") || bannerImage.startsWith("/"))
    ) {
      return bannerImage;
    }

    // Game title image mapping (includes both local images and Steam CDN URLs)
    const gameImageMap: { [key: string]: string } = {
      // Popular games - local images
      Starfield: "/starfield-space-exploration-game-banner.jpg",
      "Hades II": "/hades-2-roguelike-action-game-banner.jpg",
      "Helldivers 2": "/helldivers-2-co-op-shooter-game-banner.jpg",
      "Manor Lords": "/manor-lords-medieval-strategy-game-banner.jpg",
      Palworld: "/palworld-creature-collection-survival-game-banner.jpg",
      "Baldur's Gate 3": "/baldurs-gate-3-inspired-cover.png",
      "Civilization VI": "/civilization-6-game-cover.jpg",
      "Counter-Strike 2": "/counter-strike-2-game-cover.jpg",
      "Cyberpunk 2077": "/cyberpunk-2077-inspired-cover.png",
      "Elden Ring": "/elden-ring-knight.png",
      "Portal 2": "/portal-2.jpg",
      Valorant: "/valorant-game-cover.png",
      "The Witcher 3": "/witcher-3.jpg",
      Hades: "/hades-game.jpg",

      // Steam CDN images (more game coverage)
      "The Witcher 3: Wild Hunt":
        "https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg",
      "Grand Theft Auto V":
        "https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg",
      "Red Dead Redemption 2":
        "https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg",
      "Elden Ring Steam":
        "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
      "God of War":
        "https://cdn.akamai.steamstatic.com/steam/apps/1593500/header.jpg",
      "Hogwarts Legacy Steam":
        "https://cdn.akamai.steamstatic.com/steam/apps/990080/header.jpg",
      "Spider-Man Remastered":
        "https://cdn.akamai.steamstatic.com/steam/apps/1817070/header.jpg",
      "Final Fantasy VII Remake":
        "https://cdn.akamai.steamstatic.com/steam/apps/1462040/header.jpg",
      "Resident Evil 4":
        "https://cdn.akamai.steamstatic.com/steam/apps/2050650/header.jpg",
      "Dead Space":
        "https://cdn.akamai.steamstatic.com/steam/apps/1693980/header.jpg",
      "Alan Wake 2":
        "https://cdn.akamai.steamstatic.com/steam/apps/1086940/header.jpg",
      "Lies of P":
        "https://cdn.akamai.steamstatic.com/steam/apps/1627720/header.jpg",
      "Armored Core VI":
        "https://cdn.akamai.steamstatic.com/steam/apps/1888160/header.jpg",
      "Diablo IV":
        "https://cdn.akamai.steamstatic.com/steam/apps/1817070/header.jpg",
      "Street Fighter 6":
        "https://cdn.akamai.steamstatic.com/steam/apps/1364780/header.jpg",
      "Baldur's Gate 3 Steam":
        "https://cdn.akamai.steamstatic.com/steam/apps/1086940/header.jpg",
      "Cyberpunk 2077 Steam":
        "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg",
      "The Last of Us Part I":
        "https://cdn.akamai.steamstatic.com/steam/apps/1888930/header.jpg",
      "Sons of the Forest":
        "https://cdn.akamai.steamstatic.com/steam/apps/1326470/header.jpg",
      "Atomic Heart":
        "https://cdn.akamai.steamstatic.com/steam/apps/668580/header.jpg",
      "Wo Long: Fallen Dynasty":
        "https://cdn.akamai.steamstatic.com/steam/apps/1448440/header.jpg",
      "Wild Hearts":
        "https://cdn.akamai.steamstatic.com/steam/apps/1938010/header.jpg",
      Returnal:
        "https://cdn.akamai.steamstatic.com/steam/apps/1649240/header.jpg",
      "Octopath Traveler II":
        "https://cdn.akamai.steamstatic.com/steam/apps/1971650/header.jpg",
      "Hi-Fi RUSH":
        "https://cdn.akamai.steamstatic.com/steam/apps/1817230/header.jpg",
      Forspoken:
        "https://cdn.akamai.steamstatic.com/steam/apps/1680880/header.jpg",
      "Dead Island 2":
        "https://cdn.akamai.steamstatic.com/steam/apps/1716740/header.jpg",
      "Company of Heroes 3":
        "https://cdn.akamai.steamstatic.com/steam/apps/1677280/header.jpg",
      "Age of Empires II: Definitive Edition":
        "https://cdn.akamai.steamstatic.com/steam/apps/813780/header.jpg",
      "Persona 5 Royal":
        "https://cdn.akamai.steamstatic.com/steam/apps/1687950/header.jpg",
      "Monster Hunter Rise":
        "https://cdn.akamai.steamstatic.com/steam/apps/1446780/header.jpg",
      "Dying Light 2":
        "https://cdn.akamai.steamstatic.com/steam/apps/534380/header.jpg",
      "Tiny Tina's Wonderlands":
        "https://cdn.akamai.steamstatic.com/steam/apps/1286680/header.jpg",
      "Total War: Warhammer III":
        "https://cdn.akamai.steamstatic.com/steam/apps/1142710/header.jpg",
      "Lost Ark":
        "https://cdn.akamai.steamstatic.com/steam/apps/1599340/header.jpg",
      "Destiny 2":
        "https://cdn.akamai.steamstatic.com/steam/apps/1085660/header.jpg",
      "Apex Legends":
        "https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg",
      Rust: "https://cdn.akamai.steamstatic.com/steam/apps/252490/header.jpg",
      "ARK: Survival Evolved":
        "https://cdn.akamai.steamstatic.com/steam/apps/346110/header.jpg",
      Warframe:
        "https://cdn.akamai.steamstatic.com/steam/apps/230410/header.jpg",
      "Path of Exile":
        "https://cdn.akamai.steamstatic.com/steam/apps/238960/header.jpg",
      "Dota 2": "https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg",
      "Team Fortress 2":
        "https://cdn.akamai.steamstatic.com/steam/apps/440/header.jpg",
      "Left 4 Dead 2":
        "https://cdn.akamai.steamstatic.com/steam/apps/550/header.jpg",
      "Portal 2 Steam":
        "https://cdn.akamai.steamstatic.com/steam/apps/620/header.jpg",
      "Half-Life 2":
        "https://cdn.akamai.steamstatic.com/steam/apps/220/header.jpg",
      "Garry's Mod":
        "https://cdn.akamai.steamstatic.com/steam/apps/4000/header.jpg",
      Terraria:
        "https://cdn.akamai.steamstatic.com/steam/apps/105600/header.jpg",
      "Stardew Valley":
        "https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg",
      "Hollow Knight":
        "https://cdn.akamai.steamstatic.com/steam/apps/367520/header.jpg",
      Celeste:
        "https://cdn.akamai.steamstatic.com/steam/apps/504230/header.jpg",
      Cuphead:
        "https://cdn.akamai.steamstatic.com/steam/apps/268910/header.jpg",
      "Ori and the Blind Forest":
        "https://cdn.akamai.steamstatic.com/steam/apps/261570/header.jpg",
      "Ori and the Will of the Wisps":
        "https://cdn.akamai.steamstatic.com/steam/apps/1057090/header.jpg",
    };

    // Find image with partial matching
    for (const [gameName, imagePath] of Object.entries(gameImageMap)) {
      if (
        title.toLowerCase().includes(gameName.toLowerCase()) ||
        gameName.toLowerCase().includes(title.toLowerCase())
      ) {
        return imagePath;
      }
    }

    // Return default image
    return "/default-game-cover.svg";
  };

  // Steam URL generation function
  const getSteamUrl = (title: string) => {
    // Steam URL mapping by game title
    const steamUrlMap: { [key: string]: string } = {
      Starfield: "https://store.steampowered.com/app/1716740/Starfield/",
      "Hades II": "https://store.steampowered.com/app/1145350/Hades_II/",
      "Helldivers 2": "https://store.steampowered.com/app/553850/HELLDIVERS_2/",
      "Manor Lords": "https://store.steampowered.com/app/1363080/Manor_Lords/",
      Palworld: "https://store.steampowered.com/app/1623730/Palworld/",
      "Baldur's Gate 3":
        "https://store.steampowered.com/app/1086940/Baldurs_Gate_3/",
      "Civilization VI":
        "https://store.steampowered.com/app/289070/Sid_Meiers_Civilization_VI/",
      "Counter-Strike 2":
        "https://store.steampowered.com/app/730/CounterStrike_2/",
      "Cyberpunk 2077":
        "https://store.steampowered.com/app/1091500/Cyberpunk_2077/",
      "Elden Ring": "https://store.steampowered.com/app/1245620/ELDEN_RING/",
      "Portal 2": "https://store.steampowered.com/app/620/Portal_2/",
      Valorant: "https://playvalorant.com/",
      "The Witcher 3":
        "https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/",
      Hades: "https://store.steampowered.com/app/1145360/Hades/",
    };

    // Find URL with partial matching
    for (const [gameName, url] of Object.entries(steamUrlMap)) {
      if (
        title.toLowerCase().includes(gameName.toLowerCase()) ||
        gameName.toLowerCase().includes(title.toLowerCase())
      ) {
        return url;
      }
    }

    // Default to Steam store search page
    const searchQuery = encodeURIComponent(title);
    return `https://store.steampowered.com/search/?term=${searchQuery}`;
  };

  return (
    <Card
      className="bg-[#1a1a2e]/80 backdrop-blur-xl border-0 overflow-hidden hover:scale-[1.02] transition-all duration-300 relative group"
      style={{
        background:
          "linear-gradient(145deg, rgba(26, 26, 46, 0.8), rgba(15, 15, 35, 0.9))",
        boxShadow: "0 8px 32px 0 rgba(139, 92, 246, 0.1)",
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
      }}
    >
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
      <div className="absolute inset-[1px] rounded-lg bg-[#1a1a2e] -z-10" />

      <div className="space-y-4 p-6">
        {/* Banner Image */}
        <div className="aspect-[16/9] overflow-hidden rounded-lg">
          <img
            src={getGameImage(game.title, game.bannerImage)}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              // 이미지 로드 실패 시 기본 이미지로 대체
              const target = e.target as HTMLImageElement;
              target.src = "/generic-fantasy-game-cover.png";
            }}
          />
        </div>

        {/* Title and Price */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">{game.title}</h3>
            <p className="text-2xl font-bold text-cyan-400">{game.price}</p>
          </div>
        </div>

        {/* Match Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-purple-400">
              {game.matchScore}% {t("recommendations.gameCard.match")}
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-1000"
              style={{ width: `${game.matchScore}%` }}
            />
          </div>
        </div>

        {/* AI Explanation */}
        <div className="bg-[#0f0f23]/50 rounded-lg p-4 border border-purple-500/20">
          <p className="text-sm text-gray-300 leading-relaxed">
            <span className="text-purple-400 font-semibold">
              {t("recommendations.gameCard.youllLoveThis")}{" "}
            </span>
            {game.aiExplanation}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {game.genres.map((genre) => (
            <Badge
              key={genre}
              variant="secondary"
              className="bg-purple-900/30 text-purple-300 hover:bg-purple-900/50 border border-purple-500/30"
            >
              {t(`genres.${genre}`) || genre}
            </Badge>
          ))}
          {game.multiplayer && (
            <Badge
              variant="secondary"
              className="bg-cyan-900/30 text-cyan-300 hover:bg-cyan-900/50 border border-cyan-500/30"
            >
              {t("recommendations.gameCard.multiplayer")}
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            className="w-full bg-[#171a21] hover:bg-[#1b2838] text-white cursor-pointer"
            onClick={() => window.open(getSteamUrl(game.title), "_blank")}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            {t("recommendations.gameCard.viewOnSteam")}
          </Button>
          <Button
            variant="outline"
            className={`w-full cursor-pointer ${
              isWishlisted
                ? "bg-purple-600/20 border-purple-500 text-purple-300"
                : "bg-transparent border-gray-700 text-gray-300 hover:border-purple-500 hover:text-purple-300"
            }`}
            onClick={() => setIsWishlisted(!isWishlisted)}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill={isWishlisted ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {isWishlisted
              ? t("recommendations.gameCard.wishlisted")
              : t("recommendations.gameCard.saveToWishlist")}
          </Button>
        </div>

        {/* Why This? Accordion */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="why" className="border-gray-700">
            <AccordionTrigger className="text-cyan-400 hover:text-cyan-300 cursor-pointer">
              {t("recommendations.gameCard.whyThisGame")}
            </AccordionTrigger>
            <AccordionContent className="text-gray-300 space-y-3 text-sm">
              <div>
                <p className="font-semibold text-purple-400 mb-1">
                  {t("recommendations.gameCard.similarGames")}:
                </p>
                <p>Baldur's Gate 3, Elden Ring, Cyberpunk 2077</p>
              </div>
              <div>
                <p className="font-semibold text-purple-400 mb-1">
                  {t("recommendations.gameCard.matchingMechanics")}:
                </p>
                <p>
                  Deep character customization, branching narratives,
                  exploration-focused gameplay
                </p>
              </div>
              <div>
                <p className="font-semibold text-purple-400 mb-1">
                  {t("recommendations.gameCard.toneAnalysis")}:
                </p>
                <p>
                  Matches your preference for immersive worlds with rich lore
                  and player agency
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Card>
  );
}

function EmptyState() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-r from-purple-600/20 to-cyan-600/20 flex items-center justify-center">
        <svg
          className="w-12 h-12 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">
        {t("recommendations.emptyState.noGamesMatch")}
      </h3>
      <p className="text-gray-400 mb-6">
        {t("recommendations.emptyState.adjustFilters")}
      </p>
      <Button
        variant="outline"
        className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border-purple-500/50 hover:border-purple-400 text-white"
      >
        {t("recommendations.emptyState.resetFilters")}
      </Button>
    </div>
  );
}
