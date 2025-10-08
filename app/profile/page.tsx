"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Edit, ExternalLink } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#0f0f23] text-white">
      <Navigation />

      <main className="pt-20">
        <ProfileHeader />
        <StatsCards />
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          <TopGenres />
          <RecentlyPlayed />
          <FavoriteGames />
          <ActivityGraph />
          <Achievements />
        </div>
      </main>
    </div>
  );
}

function ProfileHeader() {
  return (
    <div className="relative">
      <div className="h-64 bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-cyan-900/50" />
      <img
        src="/default-profile-banner.svg"
        alt="Profile Banner"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />

      <div className="max-w-7xl mx-auto px-4">
        <div className="relative -mt-20 flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="relative">
            <img
              src="/default-avatar.svg"
              alt="Profile"
              className="w-40 h-40 rounded-full border-4 border-[#0f0f23] bg-gray-800"
            />
          </div>

          <div className="flex-1 text-center md:text-left pb-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              ProGamer2024
            </h1>
            <p className="text-gray-400 mb-4">Member since January 2024</p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Button
                variant="outline"
                className="bg-purple-600 hover:bg-purple-700 border-0"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Steam Profile
              </Button>
              <Button
                variant="outline"
                className="border-gray-700 hover:bg-gray-800 bg-transparent"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCards() {
  const stats = [
    { label: "Total Games", value: "156", icon: "🎮" },
    { label: "Hours Played", value: "2,340", icon: "⏱️" },
    { label: "Recommendations Received", value: "45", icon: "✨" },
    { label: "Wishlist Items", value: "12", icon: "❤️" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="bg-gray-900/50 border-gray-800 p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">{stat.icon}</div>
              <div>
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TopGenres() {
  const genres = [
    { name: "FPS", percentage: 45, color: "bg-purple-500" },
    { name: "RPG", percentage: 30, color: "bg-cyan-500" },
    { name: "Strategy", percentage: 15, color: "bg-blue-500" },
    { name: "Indie", percentage: 10, color: "bg-pink-500" },
  ];

  return (
    <Card className="bg-gray-900/50 border-gray-800 p-6 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-6">Top Genres</h2>
      <div className="space-y-4">
        {genres.map((genre, index) => (
          <div key={index}>
            <div className="flex justify-between mb-2">
              <span className="font-medium">{genre.name}</span>
              <span className="text-gray-400">{genre.percentage}%</span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${genre.color} transition-all duration-500`}
                style={{ width: `${genre.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function RecentlyPlayed() {
  const [scrollPosition, setScrollPosition] = useState(0);

  const games = [
    {
      title: "Cyberpunk 2077",
      lastPlayed: "2 hours ago",
      image: "/cyberpunk-2077-inspired-cover.png",
    },
    {
      title: "Baldur's Gate 3",
      lastPlayed: "Yesterday",
      image: "/baldurs-gate-3-inspired-cover.png",
    },
    {
      title: "Counter-Strike 2",
      lastPlayed: "2 days ago",
      image: "/counter-strike-2-game-cover.jpg",
    },
    {
      title: "Elden Ring",
      lastPlayed: "3 days ago",
      image: "/elden-ring-knight.png",
    },
    {
      title: "Starfield",
      lastPlayed: "5 days ago",
      image: "/vast-starfield.png",
    },
  ];

  return (
    <Card className="bg-gray-900/50 border-gray-800 p-6 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Recently Played</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="border-gray-700 hover:bg-gray-800 bg-transparent"
            onClick={() => setScrollPosition(Math.max(0, scrollPosition - 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-gray-700 hover:bg-gray-800 bg-transparent"
            onClick={() =>
              setScrollPosition(Math.min(games.length - 3, scrollPosition + 1))
            }
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex gap-4 transition-transform duration-300"
          style={{ transform: `translateX(-${scrollPosition * 33.33}%)` }}
        >
          {games.map((game, index) => (
            <div key={index} className="min-w-[200px] group cursor-pointer">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-2">
                <img
                  src={game.image || "/default-game-cover.svg"}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold truncate">{game.title}</h3>
              <p className="text-sm text-gray-400">{game.lastPlayed}</p>
            </div>
          ))}
          <div className="min-w-[200px] flex items-center justify-center">
            <Button
              variant="outline"
              className="border-gray-700 hover:bg-gray-800 bg-transparent"
            >
              View Full Library
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function FavoriteGames() {
  const favorites = [
    {
      title: "The Witcher 3",
      reason: "Best story and world-building",
      image: "/witcher-3.jpg",
    },
    {
      title: "Portal 2",
      reason: "Perfect puzzle design",
      image: "/portal-2.jpg",
    },
    {
      title: "Hades",
      reason: "Addictive roguelike gameplay",
      image: "/hades-game.jpg",
    },
  ];

  return (
    <Card className="bg-gray-900/50 border-gray-800 p-6 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-6">Favorite Games</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((game, index) => (
          <div key={index} className="group cursor-pointer">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3">
              <img
                src={game.image || "/default-game-cover.svg"}
                alt={game.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                <p className="text-center text-sm">{game.reason}</p>
              </div>
            </div>
            <h3 className="font-semibold text-lg">{game.title}</h3>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ActivityGraph() {
  const data = [
    { day: "Mon", hours: 3 },
    { day: "Tue", hours: 5 },
    { day: "Wed", hours: 2 },
    { day: "Thu", hours: 7 },
    { day: "Fri", hours: 6 },
    { day: "Sat", hours: 8 },
    { day: "Sun", hours: 4 },
  ];

  const maxHours = Math.max(...data.map((d) => d.hours));

  return (
    <Card className="bg-gray-900/50 border-gray-800 p-6 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-6">Gaming Activity (Last 7 Days)</h2>
      <div className="h-64 flex items-end justify-between gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="text-sm font-semibold text-purple-400">
              {item.hours}h
            </div>
            <div
              className="w-full bg-gray-800 rounded-t-lg relative overflow-hidden"
              style={{ height: "200px" }}
            >
              <div
                className={`absolute bottom-0 w-full bg-gradient-to-t from-purple-500 to-cyan-500 transition-all duration-500 ${
                  item.hours >= 5 ? "shadow-lg shadow-purple-500/50" : ""
                }`}
                style={{ height: `${(item.hours / maxHours) * 100}%` }}
              />
            </div>
            <div className="text-sm text-gray-400">{item.day}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Achievements() {
  const badges = [
    {
      name: "Early Adopter",
      description: "Joined in the first month",
      icon: "🌟",
    },
    {
      name: "100 Games Explored",
      description: "Analyzed 100+ games",
      icon: "🎮",
    },
    {
      name: "AI Enthusiast",
      description: "Used AI recommendations 50+ times",
      icon: "🤖",
    },
  ];

  return (
    <Card className="bg-gray-900/50 border-gray-800 p-6 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-6">Achievements</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {badges.map((badge, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer group"
          >
            <div className="text-4xl group-hover:scale-110 transition-transform">
              {badge.icon}
            </div>
            <div>
              <h3 className="font-semibold">{badge.name}</h3>
              <p className="text-sm text-gray-400">{badge.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
