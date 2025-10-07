"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

const mockPosts = [
  {
    id: 1,
    author: { name: "Alex Chen", avatar: "/diverse-user-avatars.png", username: "alexchen" },
    category: "Game Recommendation",
    title: "Just finished Baldur's Gate 3 - Absolutely Mind-Blowing!",
    preview:
      "After 180 hours, I finally completed my first playthrough. The depth of choice and consequence is unmatched. If you love RPGs with meaningful decisions...",
    timestamp: "2 hours ago",
    upvotes: 245,
    comments: 67,
    tags: ["RPG", "Strategy", "Story-Rich"],
    thumbnail: "/baldurs-gate-3-inspired-cover.png",
  },
  {
    id: 2,
    author: { name: "Sarah Kim", avatar: "/diverse-gaming-avatars.png", username: "sarahk" },
    category: "Looking for Players",
    title: "LF2M for Valorant Ranked - Plat+ Only",
    preview:
      "Need two more for a full stack. Looking for chill but competitive players. Must have mic and positive attitude. DM me your rank...",
    timestamp: "4 hours ago",
    upvotes: 89,
    comments: 23,
    tags: ["FPS", "Multiplayer", "Competitive"],
    thumbnail: "/valorant-game-cover.png",
  },
  {
    id: 3,
    author: { name: "Mike Torres", avatar: "/diverse-user-avatars.png", username: "miket" },
    category: "Strategy & Tips",
    title: "Elden Ring Boss Guide: How I Beat Malenia in 3 Tries",
    preview:
      "After struggling for weeks, I finally found a strategy that works. Here's my step-by-step guide with build recommendations...",
    timestamp: "1 day ago",
    upvotes: 512,
    comments: 134,
    tags: ["RPG", "Action", "Guide"],
    thumbnail: "/elden-ring-knight.png",
  },
]

const trendingTopics = [
  { tag: "Baldur's Gate 3", count: 234 },
  { tag: "Elden Ring", count: 189 },
  { tag: "Valorant", count: 156 },
  { tag: "Cyberpunk 2077", count: 142 },
  { tag: "Counter-Strike 2", count: 128 },
]

const activeUsers = [
  { name: "Alex Chen", avatar: "/diverse-user-avatars.png", badge: "Most Helpful" },
  { name: "Sarah Kim", avatar: "/diverse-gaming-avatars.png", badge: "Top Contributor" },
  { name: "Mike Torres", avatar: "/diverse-user-avatars.png", badge: "Community Star" },
]

export default function CommunityPage() {
  const [sortBy, setSortBy] = useState("hot")

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white">
      <Navigation />

      <div className="pt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/20 to-cyan-900/20 border-b border-gray-800 py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
              Gamerithm Community
            </h1>
            <p className="text-gray-400 text-lg">Connect with gamers, share recommendations, discuss games</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-6">
            {/* Top Bar with Tabs and Create Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <Tabs defaultValue="feed" className="w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <TabsList className="bg-[#1a1a2e] border border-gray-800">
                    <TabsTrigger value="feed" className="cursor-pointer">
                      Feed
                    </TabsTrigger>
                    <TabsTrigger value="discussions" className="cursor-pointer">
                      Discussions
                    </TabsTrigger>
                    <TabsTrigger value="reviews" className="cursor-pointer">
                      Reviews
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Select value={sortBy} onValueChange={setSortBy} modal={false}>
                      <SelectTrigger className="bg-[#1a1a2e] border-gray-700 cursor-pointer w-full sm:w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a2e] border-gray-700">
                        <SelectItem value="hot" className="cursor-pointer">
                          🔥 Hot
                        </SelectItem>
                        <SelectItem value="new" className="cursor-pointer">
                          ✨ New
                        </SelectItem>
                        <SelectItem value="top-today" className="cursor-pointer">
                          📈 Top Today
                        </SelectItem>
                        <SelectItem value="top-week" className="cursor-pointer">
                          🏆 Top Week
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Link href="/community/new" className="w-full sm:w-auto">
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 cursor-pointer hover:scale-105 transition-all">
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Post
                      </Button>
                    </Link>
                  </div>
                </div>

                <TabsContent value="feed" className="space-y-4">
                  {mockPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PostCard({ post }: { post: (typeof mockPosts)[0] }) {
  const [upvoted, setUpvoted] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  return (
    <Link href={`/community/${post.id}`}>
      <Card className="bg-[#1a1a2e] border-gray-800 p-6 hover:border-purple-500/50 transition-all cursor-pointer group">
        <div className="flex gap-4">
          {/* Thumbnail */}
          {post.thumbnail && (
            <div className="hidden sm:block w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={post.thumbnail || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          )}

          <div className="flex-1 space-y-3">
            {/* Author & Meta */}
            <div className="flex items-center gap-3">
              <Link
                href={`/profile/${post.author.username}`}
                className="flex items-center gap-2 hover:opacity-80 cursor-pointer"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                  <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-white">{post.author.name}</span>
              </Link>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">{post.timestamp}</span>
            </div>

            {/* Title & Preview */}
            <div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-2">{post.preview}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="border-gray-700 text-gray-400 text-xs cursor-pointer hover:border-cyan-500 hover:text-cyan-400"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Engagement */}
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setUpvoted(!upvoted)
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all cursor-pointer hover:scale-105 ${
                  upvoted ? "bg-purple-900/30 text-purple-400" : "bg-[#0f0f23] text-gray-400 hover:bg-purple-900/20"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill={upvoted ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                <span className="text-sm font-medium">{post.upvotes + (upvoted ? 1 : 0)}</span>
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0f0f23] text-gray-400 hover:bg-cyan-900/20 hover:text-cyan-400 transition-all cursor-pointer hover:scale-105"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span className="text-sm font-medium">{post.comments}</span>
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setBookmarked(!bookmarked)
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all cursor-pointer hover:scale-105 ${
                  bookmarked ? "bg-cyan-900/30 text-cyan-400" : "bg-[#0f0f23] text-gray-400 hover:bg-cyan-900/20"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill={bookmarked ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0f0f23] text-gray-400 hover:bg-purple-900/20 hover:text-purple-400 transition-all cursor-pointer hover:scale-105"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                <span className="text-sm">Share</span>
              </button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
