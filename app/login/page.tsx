"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function SteamLoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSteamLogin = () => {
    setIsLoading(true)
    // Simulate Steam OAuth redirect
    // In production, this would redirect to: https://steamcommunity.com/openid/login
    setTimeout(() => {
      window.location.href = "/dashboard"
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white flex items-center justify-center px-4">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 cursor-pointer hover:opacity-80 transition-opacity">
              Gamerithm
            </h1>
          </Link>
          <p className="text-gray-400">AI-Powered Game Recommendations</p>
        </div>

        {/* Login Card */}
        <Card className="bg-[#1a1a2e]/80 backdrop-blur-xl border-gray-800 p-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Sign in to Continue</h2>
              <p className="text-gray-400 text-sm">
                Connect your Steam account to get personalized game recommendations
              </p>
            </div>

            {/* Steam Login Button */}
            <Button
              size="lg"
              onClick={handleSteamLogin}
              disabled={isLoading}
              className="w-full bg-[#171a21] hover:bg-[#1b2838] text-white py-6 text-lg font-semibold rounded-lg transition-colors duration-200"
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
                  Connecting to Steam...
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

            {/* Security Info */}
            <div className="space-y-3 pt-4 border-t border-gray-700">
              <div className="flex items-start gap-3 text-sm">
                <svg
                  className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-gray-300">Secure OAuth Authentication</p>
                  <p className="text-gray-500">We never see or store your Steam password</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm">
                <svg
                  className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-gray-300">Privacy Protected</p>
                  <p className="text-gray-500">We only access your public game library</p>
                </div>
              </div>
            </div>

            {/* Back to Home */}
            <div className="text-center pt-4">
              <Link href="/" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">
                ← Back to Home
              </Link>
            </div>
          </div>
        </Card>

        {/* Terms */}
        <p className="text-center text-xs text-gray-500 mt-6">
          By signing in, you agree to our{" "}
          <a href="#" className="text-purple-400 hover:text-purple-300">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-cyan-400 hover:text-cyan-300">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}
