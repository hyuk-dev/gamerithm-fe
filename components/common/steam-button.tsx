"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/loading-spinner";

interface SteamButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function SteamButton({
  onClick,
  disabled = false,
  isLoading = false,
  className = "",
  children = "Sign in with Steam",
}: SteamButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      size="lg"
      className={`bg-[#171a21] hover:bg-[#1b2838] text-white py-6 text-lg rounded-lg font-semibold transition-all duration-200 border border-white/50 hover:border-white hover:scale-105 cursor-pointer disabled:cursor-wait disabled:opacity-50 ${className}`}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="md" className="mr-3" />
          Connecting...
        </>
      ) : (
        <>
          <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a10 10 0 0 0-10 10 10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm0 1.5a8.5 8.5 0 0 1 8.5 8.5 8.5 8.5 0 0 1-8.5 8.5A8.5 8.5 0 0 1 3.5 12 8.5 8.5 0 0 1 12 3.5zm-1.5 3v1.793L7.707 11.086a2 2 0 0 0-1.414.586l-1.5 1.5a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l1.5-1.5a2 2 0 0 0 .586-1.414L12.5 10.293V6.5h-2z" />
          </svg>
          {children}
        </>
      )}
    </Button>
  );
}
