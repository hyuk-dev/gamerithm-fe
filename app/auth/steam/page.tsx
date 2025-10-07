"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function SteamAuthPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSteamLogin = () => {
    setIsLoading(true)
    // Simulate Steam OAuth redirect
    setTimeout(() => {
      window.location.href = "/dashboard"
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white flex items-center justify-center px-4">
      <Card className="bg-[#1a1a2e] border-gray-800 p-8 md:p-12 max-w-md w-full space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl">
              <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 0 0-10 10 10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm0 1.5a8.5 8.5 0 0 1 8.5 8.5 8.5 8.5 0 0 1-8.5 8.5A8.5 8.5 0 0 1 3.5 12 8.5 8.5 0 0 1 12 3.5zm-1.5 3v1.793L7.707 11.086a2 2 0 0 0-1.414.586l-1.5 1.5a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l1.5-1.5a2 2 0 0 0 .586-1.414L12.5 10.293V6.5h-2z" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            Connect with Steam
          </h1>

          <p className="text-gray-400 leading-relaxed">
            Sign in with your Steam account to get personalized game recommendations powered by AI.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleSteamLogin}
            disabled={isLoading}
            size="lg"
            className="w-full bg-[#171a21] hover:bg-[#1b2838] text-white py-6 text-lg rounded-lg font-semibold transition-all duration-200 border border-white/50 hover:border-white hover:scale-105 cursor-pointer disabled:cursor-wait disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <svg className="w-6 h-6 mr-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Connecting...
              </>
            ) : (
              <>
                <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 0 0-10 10 10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm0 1.5a8.5 8.5 0 0 1 8.5 8.5 8.5 8.5 0 0 1-8.5 8.5A8.5 8.5 0 0 1 3.5 12 8.5 8.5 0 0 1 12 3.5zm-1.5 3v1.793L7.707 11.086a2 2 0 0 0-1.414.586l-1.5 1.5a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l1.5-1.5a2 2 0 0 0 .586-1.414L12.5 10.293V6.5h-2z" />
                </svg>
                Sign in with Steam
              </>
            )}
          </Button>

          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <svg
                className="w-5 h-5 text-green-400 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Secure OAuth authentication</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <svg
                className="w-5 h-5 text-green-400 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>We never store your password</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <svg
                className="w-5 h-5 text-green-400 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Read-only access to your library</span>
            </div>
          </div>
        </div>

        <div className="pt-4 text-center">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-purple-400 transition-colors cursor-pointer hover:underline"
          >
            ← Back to home
          </Link>
        </div>
      </Card>
    </div>
  )
}
