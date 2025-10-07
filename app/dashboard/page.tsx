"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/navigation"
import Link from "next/link"

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
]

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedPlaytime, setSelectedPlaytime] = useState<string[]>([])
  const [showRecentlyPlayed, setShowRecentlyPlayed] = useState(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const filteredGames = mockGames.filter((game) => {
    if (selectedGenres.length > 0 && !game.genres.some((g) => selectedGenres.includes(g))) {
      return false
    }
    if (selectedPlaytime.length > 0) {
      const hasMatch = selectedPlaytime.some((range) => {
        if (range === "0-10h" && game.playtime <= 10) return true
        if (range === "10-50h" && game.playtime > 10 && game.playtime <= 50) return true
        if (range === "50h+" && game.playtime > 50) return true
        return false
      })
      if (!hasMatch) return false
    }
    return true
  })

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
          <StatsSection />

          {/* Games Grid */}
          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Your Library</h2>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <GameCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Floating CTA Button */}
      <FloatingCTA />
    </div>
  )
}

function Sidebar({
  selectedGenres,
  setSelectedGenres,
  selectedPlaytime,
  setSelectedPlaytime,
  showRecentlyPlayed,
  setShowRecentlyPlayed,
}: {
  selectedGenres: string[]
  setSelectedGenres: (genres: string[]) => void
  selectedPlaytime: string[]
  setSelectedPlaytime: (playtime: string[]) => void
  showRecentlyPlayed: boolean
  setShowRecentlyPlayed: (show: boolean) => void
}) {
  const genres = ["FPS", "RPG", "Strategy", "Action", "Multiplayer", "Turn-Based"]
  const playtimeRanges = ["0-10h", "10-50h", "50h+"]

  const toggleGenre = (genre: string) => {
    setSelectedGenres(
      selectedGenres.includes(genre) ? selectedGenres.filter((g) => g !== genre) : [...selectedGenres, genre],
    )
  }

  const togglePlaytime = (range: string) => {
    setSelectedPlaytime(
      selectedPlaytime.includes(range) ? selectedPlaytime.filter((r) => r !== range) : [...selectedPlaytime, range],
    )
  }

  return (
    <aside className="hidden lg:block w-64 bg-[#1a1a2e] border-r border-gray-800 p-6 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="space-y-8">
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
                <Label htmlFor={`playtime-${range}`} className="text-sm cursor-pointer text-gray-300">
                  {range}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Played */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-purple-400">Recently Played</h3>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="recently-played"
              checked={showRecentlyPlayed}
              onCheckedChange={(checked) => setShowRecentlyPlayed(checked as boolean)}
            />
            <Label htmlFor="recently-played" className="text-sm cursor-pointer text-gray-300">
              Show only recent
            </Label>
          </div>
        </div>
      </div>
    </aside>
  )
}

function StatsSection() {
  const stats = [
    {
      icon: (
        <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      label: "Total Games",
      value: "156",
    },
    {
      icon: (
        <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      label: "Total Hours",
      value: "3,245",
    },
    {
      icon: (
        <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      ),
      label: "Most Played",
      value: "FPS",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-[#1a1a2e] border-gray-800 p-6 hover:border-purple-500 transition-colors">
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
  )
}

function GameCard({ game }: { game: (typeof mockGames)[0] }) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      <Link href={`/game/${game.id}`}>
        <Card className="bg-[#1a1a2e] border-gray-800 overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer group">
          <div className="aspect-video overflow-hidden">
            <img
              src={game.coverImage || "/placeholder.svg"}
              alt={game.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="p-4 space-y-3">
            <h3 className="text-lg font-bold text-white truncate">{game.title}</h3>
            <p className="text-sm text-gray-400">{game.playtime} hours played</p>
            <div className="flex flex-wrap gap-2">
              {game.genres.map((genre) => (
                <Badge
                  key={genre}
                  variant="secondary"
                  className="bg-purple-900/30 text-purple-300 hover:bg-purple-900/50"
                >
                  {genre}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-gray-500">Last played: {game.lastPlayed}</p>
          </div>
        </Card>
      </Link>
    </div>
  )
}

function GameCardSkeleton() {
  return (
    <Card className="bg-[#1a1a2e] border-gray-800 overflow-hidden animate-pulse">
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
  )
}

function FloatingCTA() {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Link href="/recommendations">
        <Button
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-6 text-lg rounded-full shadow-2xl hover:scale-110 transition-all duration-300 animate-pulse cursor-pointer"
        >
          <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
  )
}
