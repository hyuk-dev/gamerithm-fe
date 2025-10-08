"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"

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
]

export default function RecommendationsPage() {
  const [priceRange, setPriceRange] = useState([0, 100])
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [multiplayerFilter, setMultiplayerFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState("match")

  const toggleGenre = (genre: string) => {
    setSelectedGenres(
      selectedGenres.includes(genre) ? selectedGenres.filter((g) => g !== genre) : [...selectedGenres, genre],
    )
  }

  const filteredRecommendations = mockRecommendations
    .filter((game) => {
      const price = Number.parseFloat(game.price.replace("$", ""))
      if (price < priceRange[0] || price > priceRange[1]) return false

      if (selectedGenres.length > 0 && !game.genres.some((g) => selectedGenres.includes(g))) {
        return false
      }

      if (multiplayerFilter === "multiplayer" && !game.multiplayer) return false
      if (multiplayerFilter === "singleplayer" && game.multiplayer) return false

      return true
    })
    .sort((a, b) => {
      if (sortBy === "match") return b.matchScore - a.matchScore
      if (sortBy === "price")
        return Number.parseFloat(a.price.replace("$", "")) - Number.parseFloat(b.price.replace("$", ""))
      if (sortBy === "release") return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      return 0
    })

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white">
      <Navigation />

      <div className="flex pt-16">
        {/* Filters Sidebar */}
        <FiltersSidebar
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedGenres={selectedGenres}
          toggleGenre={toggleGenre}
          multiplayerFilter={multiplayerFilter}
          setMultiplayerFilter={setMultiplayerFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  Your Personalized Game Recommendations
                </h1>
                <p className="text-gray-400 text-lg">Based on your 156 hours of playtime and favorite genres</p>
              </div>
              <Button
                variant="outline"
                className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border-purple-500/50 hover:border-purple-400 text-white"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                Regenerate Recommendations
              </Button>
            </div>
          </div>

          {/* Recommendations Grid */}
          {filteredRecommendations.length === 0 ? (
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
  )
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
}: {
  priceRange: number[]
  setPriceRange: (range: number[]) => void
  selectedGenres: string[]
  toggleGenre: (genre: string) => void
  multiplayerFilter: string
  setMultiplayerFilter: (filter: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
}) {
  const genres = ["RPG", "Action", "FPS", "Strategy", "Roguelike", "Indie", "Survival", "Co-op"]

  return (
    <aside className="hidden lg:block w-80 bg-[#1a1a2e] border-r border-gray-800 p-6 h-[calc(100vh-73px)] overflow-y-auto">
      <div className="space-y-8">
        {/* Sort By */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-purple-400">Sort By</h3>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-[#0f0f23] border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="match">Match Score</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="release">Release Date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-cyan-400">Price Range</h3>
          <div className="space-y-4">
            <Slider value={priceRange} onValueChange={setPriceRange} max={100} step={5} className="w-full" />
            <div className="flex justify-between text-sm text-gray-400">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Genre Filter */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-purple-400">Genre</h3>
          <div className="space-y-3">
            {genres.map((genre) => (
              <div key={genre} className="flex items-center space-x-2">
                <Checkbox
                  id={`genre-${genre}`}
                  checked={selectedGenres.includes(genre)}
                  onCheckedChange={() => toggleGenre(genre)}
                />
                <Label htmlFor={`genre-${genre}`} className="text-sm cursor-pointer text-gray-300">
                  {genre}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Multiplayer Filter */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-cyan-400">Player Mode</h3>
          <Select value={multiplayerFilter} onValueChange={setMultiplayerFilter}>
            <SelectTrigger className="bg-[#0f0f23] border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Games</SelectItem>
              <SelectItem value="multiplayer">Multiplayer Only</SelectItem>
              <SelectItem value="singleplayer">Single-player Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </aside>
  )
}

function RecommendationCard({ game, index }: { game: (typeof mockRecommendations)[0]; index: number }) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  return (
    <Card
      className="bg-[#1a1a2e]/80 backdrop-blur-xl border-0 overflow-hidden hover:scale-[1.02] transition-all duration-300 relative group"
      style={{
        background: "linear-gradient(145deg, rgba(26, 26, 46, 0.8), rgba(15, 15, 35, 0.9))",
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
            src={game.bannerImage || "/placeholder.svg"}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
            <span className="text-lg font-semibold text-purple-400">{game.matchScore}% Match</span>
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
            <span className="text-purple-400 font-semibold">You'll love this because: </span>
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
              {genre}
            </Badge>
          ))}
          {game.multiplayer && (
            <Badge
              variant="secondary"
              className="bg-cyan-900/30 text-cyan-300 hover:bg-cyan-900/50 border border-cyan-500/30"
            >
              Multiplayer
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button className="w-full bg-[#171a21] hover:bg-[#1b2838] text-white">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            View on Steam
          </Button>
          <Button
            variant="outline"
            className={`w-full ${
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
            {isWishlisted ? "Wishlisted" : "Save to Wishlist"}
          </Button>
        </div>

        {/* Why This? Accordion */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="why" className="border-gray-700">
            <AccordionTrigger className="text-cyan-400 hover:text-cyan-300">Why This Game?</AccordionTrigger>
            <AccordionContent className="text-gray-300 space-y-3 text-sm">
              <div>
                <p className="font-semibold text-purple-400 mb-1">Similar Games You Played:</p>
                <p>Baldur's Gate 3, Elden Ring, Cyberpunk 2077</p>
              </div>
              <div>
                <p className="font-semibold text-purple-400 mb-1">Matching Mechanics:</p>
                <p>Deep character customization, branching narratives, exploration-focused gameplay</p>
              </div>
              <div>
                <p className="font-semibold text-purple-400 mb-1">Tone Analysis:</p>
                <p>Matches your preference for immersive worlds with rich lore and player agency</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Card>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-r from-purple-600/20 to-cyan-600/20 flex items-center justify-center">
        <svg className="w-12 h-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">No games match your filters</h3>
      <p className="text-gray-400 mb-6">Try adjusting your filters to see more recommendations</p>
      <Button
        variant="outline"
        className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border-purple-500/50 hover:border-purple-400 text-white"
      >
        Reset Filters
      </Button>
    </div>
  )
}
