"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NewPostPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  const categories = [
    "General Discussion",
    "Game Recommendation",
    "Looking for Players",
    "Strategy & Tips",
    "Bug Reports",
    "Screenshots & Clips",
  ]

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 5) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle post creation
    console.log({ title, content, category, tags })
    router.push("/community")
  }

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white">
      <Navigation />

      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/community"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer mb-4"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Community
            </Link>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Create New Post
            </h1>
            <p className="text-gray-400 mt-2">Share your thoughts, recommendations, or questions with the community</p>
          </div>

          {/* Post Creation Form */}
          <form onSubmit={handleSubmit}>
            <Card className="bg-[#1a1a2e] border-gray-800 p-6 space-y-6">
              {/* Category Selection */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium text-gray-300">
                  Category
                </Label>
                <Select value={category} onValueChange={setCategory} modal={false}>
                  <SelectTrigger
                    id="category"
                    className="bg-[#0f0f23] border-gray-700 cursor-pointer hover:border-purple-500 transition-colors"
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a2e] border-gray-700">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="cursor-pointer">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-gray-300">
                  Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a descriptive title for your post"
                  className="bg-[#0f0f23] border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 transition-colors cursor-text"
                  required
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium text-gray-300">
                  Content
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post content here... Share your thoughts, experiences, or questions."
                  className="bg-[#0f0f23] border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 transition-colors min-h-[300px] cursor-text"
                  required
                />
                <p className="text-xs text-gray-500">{content.length} characters</p>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags" className="text-sm font-medium text-gray-300">
                  Tags (up to 5)
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                    placeholder="Add tags (press Enter)"
                    className="bg-[#0f0f23] border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 transition-colors cursor-text"
                    disabled={tags.length >= 5}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    disabled={tags.length >= 5}
                    className="bg-purple-600 hover:bg-purple-700 cursor-pointer"
                  >
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-purple-900/30 text-purple-300 border border-purple-500/30 px-3 py-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 hover:text-red-400 cursor-pointer"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={!title || !content || !category}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Publish Post
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-gray-700 text-gray-300 hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </form>

          {/* Tips Card */}
          <Card className="bg-[#1a1a2e] border-gray-800 p-6 mt-6">
            <h3 className="text-lg font-semibold text-purple-400 mb-3">Posting Tips</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">•</span>
                <span>Choose a clear, descriptive title that summarizes your post</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">•</span>
                <span>Use proper formatting and break up long paragraphs for readability</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">•</span>
                <span>Add relevant tags to help others find your post</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">•</span>
                <span>Be respectful and follow community guidelines</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
