"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Discover Your Next Favorite Game";
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center bg-[#1a1a25] px-4 py-20"
    >
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1
          className={`text-4xl md:text-6xl lg:text-7xl font-bold leading-tight transition-all duration-1000 min-h-[1.2em] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            {displayedText}
            {displayedText.length < fullText.length && (
              <span className="animate-pulse">|</span>
            )}
          </span>
        </h1>

        <p
          className={`text-lg md:text-xl lg:text-2xl text-gray-300 max-w-2xl mx-auto transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Algorithm-Powered Game Discovery
        </p>

        <div
          className={`transition-all duration-1000 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Link href="/auth/steam">
            <Button
              size="lg"
              className="bg-[#171a21] hover:bg-[#1b2838] text-white px-8 py-6 text-lg rounded-lg font-semibold transition-all duration-200 border border-white/50 hover:border-white hover:scale-105 cursor-pointer"
            >
              <svg
                className="w-6 h-6 mr-3"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2a10 10 0 0 0-10 10 10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm0 1.5a8.5 8.5 0 0 1 8.5 8.5 8.5 8.5 0 0 1-8.5 8.5A8.5 8.5 0 0 1 3.5 12 8.5 8.5 0 0 1 12 3.5zm-1.5 3v1.793L7.707 11.086a2 2 0 0 0-1.414.586l-1.5 1.5a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l1.5-1.5a2 2 0 0 0 .586-1.414L12.5 10.293V6.5h-2z" />
              </svg>
              Sign in with Steam
            </Button>
          </Link>
        </div>

        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-6 text-sm md:text-base transition-all duration-1000 delay-600 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-500/50">
            <span className="text-2xl">🔒</span>
            <span className="text-purple-400 font-medium">Secure OAuth</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-500/50">
            <span className="text-2xl">📊</span>
            <span className="text-cyan-400 font-medium">
              Analyze 1000+ Games
            </span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center space-y-2 text-white/70 hover:text-white transition-colors cursor-pointer">
          <span className="text-sm font-medium">Scroll down</span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
