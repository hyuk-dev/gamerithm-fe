"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { SteamButton } from "@/components/common/steam-button";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function SteamAuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, isLoading: isAuthLoading, fetchSession } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 인증 상태 확인
    fetchSession();
  }, [fetchSession]);

  useEffect(() => {
    // 로그인 상태면 대시보드로 리다이렉트
    if (!isAuthLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  const handleSteamLogin = () => {
    setIsLoading(true);
    window.location.href = "/api/auth/steam/start";
  };

  // 로그인 상태면 로딩 표시
  if (isAuthLoading || isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f0f23] text-white flex items-center justify-center px-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white flex items-center justify-center px-4">
      <Card className="bg-[#1a1a2e] border-gray-800 p-8 md:p-12 max-w-md w-full space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl">
              <svg
                className="w-16 h-16 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2a10 10 0 0 0-10 10 10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm0 1.5a8.5 8.5 0 0 1 8.5 8.5 8.5 8.5 0 0 1-8.5 8.5A8.5 8.5 0 0 1 3.5 12 8.5 8.5 0 0 1 12 3.5zm-1.5 3v1.793L7.707 11.086a2 2 0 0 0-1.414.586l-1.5 1.5a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l1.5-1.5a2 2 0 0 0 .586-1.414L12.5 10.293V6.5h-2z" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            Connect with Steam
          </h1>

          <p className="text-gray-400 leading-relaxed">
            Sign in with your Steam account to get personalized game
            recommendations powered by AI.
          </p>
        </div>

        <div className="space-y-4">
          <SteamButton
            onClick={handleSteamLogin}
            isLoading={isLoading}
            className="w-full"
          />

          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <svg
                className="w-5 h-5 text-green-400 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
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
  );
}
