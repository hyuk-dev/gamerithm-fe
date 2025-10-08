"use client";

import type React from "react";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PostDetailPage() {
  const params = useParams();
  const [upvoted, setUpvoted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentText, setCommentText] = useState("");

  // Mock post data
  const post = {
    id: params.id,
    author: {
      name: "Alex Chen",
      avatar: "/diverse-user-avatars.png",
      username: "alexchen",
    },
    category: "Game Recommendation",
    title: "Just finished Baldur's Gate 3 - Absolutely Mind-Blowing!",
    content: `After 180 hours, I finally completed my first playthrough of Baldur's Gate 3, and I'm absolutely blown away by the experience. This game has set a new standard for RPGs.

**What Makes It Special:**

The depth of choice and consequence is unmatched. Every decision feels meaningful, and the game remembers everything. I found myself genuinely caring about the characters and their stories.

The combat system is incredibly deep. It's based on D&D 5e rules, which means there's a ton of tactical depth. Each encounter feels like a puzzle to solve.

**My Favorite Moments:**

Without spoiling anything, Act 2 has some of the most memorable gaming moments I've experienced in years. The way the story branches and comes together is masterful.

**Recommendation:**

If you love RPGs with meaningful choices, deep character development, and tactical combat, this is a must-play. Just be prepared to lose track of time - those 180 hours flew by!

What are your thoughts on BG3? What was your favorite moment?`,
    timestamp: "2 hours ago",
    upvotes: 245,
    comments: 67,
    tags: ["RPG", "Strategy", "Story-Rich"],
    thumbnail: "/baldurs-gate-3-inspired-cover.png",
  };

  const mockComments = [
    {
      id: 1,
      author: {
        name: "Sarah Kim",
        avatar: "/diverse-gaming-avatars.png",
        username: "sarahk",
      },
      content:
        "Completely agree! The character development in this game is incredible. Shadowheart's story arc had me in tears.",
      timestamp: "1 hour ago",
      upvotes: 23,
    },
    {
      id: 2,
      author: {
        name: "Mike Torres",
        avatar: "/diverse-user-avatars.png",
        username: "miket",
      },
      content:
        "180 hours and you only did one playthrough? I'm on my third run and still discovering new things. The replayability is insane!",
      timestamp: "45 minutes ago",
      upvotes: 15,
    },
  ];

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setCommentText("");
  };

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white">
      <Navigation />

      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back Button */}
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer mb-6"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Community
          </Link>

          {/* Post Card */}
          <Card className="bg-[#1a1a2e] border-gray-800 p-8 mb-6">
            {/* Category Badge */}
            <Badge
              variant="secondary"
              className="bg-purple-900/30 text-purple-300 mb-4"
            >
              {post.category}
            </Badge>

            {/* Title */}
            <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>

            {/* Author & Meta */}
            <div className="flex items-center gap-3 mb-6">
              <Link
                href={`/profile/${post.author.username}`}
                className="flex items-center gap-2 hover:opacity-80 cursor-pointer"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={post.author.avatar || "/placeholder.svg"}
                    alt={post.author.name}
                  />
                  <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-white">
                    {post.author.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    @{post.author.username}
                  </p>
                </div>
              </Link>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">{post.timestamp}</span>
            </div>

            {/* Thumbnail */}
            {post.thumbnail && (
              <div className="w-full h-64 rounded-lg overflow-hidden mb-6">
                <img
                  src={post.thumbnail || "/default-game-cover.svg"}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-invert max-w-none mb-6">
              <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {post.content}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="border-gray-700 text-gray-400 cursor-pointer hover:border-cyan-500 hover:text-cyan-400"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <Separator className="bg-gray-800 mb-6" />

            {/* Engagement Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setUpvoted(!upvoted)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer hover:scale-105 ${
                  upvoted
                    ? "bg-purple-900/30 text-purple-400"
                    : "bg-[#0f0f23] text-gray-400 hover:bg-purple-900/20"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill={upvoted ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                <span className="font-medium">
                  {post.upvotes + (upvoted ? 1 : 0)}
                </span>
              </button>

              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer hover:scale-105 ${
                  bookmarked
                    ? "bg-cyan-900/30 text-cyan-400"
                    : "bg-[#0f0f23] text-gray-400 hover:bg-cyan-900/20"
                }`}
              >
                <svg
                  className="w-5 h-5"
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
                <span className="font-medium">Save</span>
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0f0f23] text-gray-400 hover:bg-purple-900/20 hover:text-purple-400 transition-all cursor-pointer hover:scale-105">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                <span className="font-medium">Share</span>
              </button>
            </div>
          </Card>

          {/* Comments Section */}
          <Card className="bg-[#1a1a2e] border-gray-800 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              Comments{" "}
              <span className="text-gray-500">({mockComments.length})</span>
            </h2>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts..."
                className="bg-[#0f0f23] border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 transition-colors mb-3 cursor-text"
                rows={4}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post Comment
                </Button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {mockComments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <Link
                    href={`/profile/${comment.author.username}`}
                    className="cursor-pointer"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={comment.author.avatar || "/placeholder.svg"}
                        alt={comment.author.name}
                      />
                      <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1">
                    <div className="bg-[#0f0f23] rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Link
                          href={`/profile/${comment.author.username}`}
                          className="font-medium text-white hover:text-purple-400 cursor-pointer"
                        >
                          {comment.author.name}
                        </Link>
                        <span className="text-xs text-gray-500">
                          @{comment.author.username}
                        </span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-2 ml-4">
                      <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-purple-400 cursor-pointer">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                        {comment.upvotes}
                      </button>
                      <button className="text-xs text-gray-500 hover:text-cyan-400 cursor-pointer">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
