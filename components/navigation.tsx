"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NotificationsDropdown } from "@/components/navigation/notifications-dropdown";
import { UserDropdown } from "@/components/navigation/user-dropdown";
import { MobileMenu } from "@/components/navigation/mobile-menu";
import { useAuth } from "@/hooks/use-auth";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const pathname = usePathname();
  const { isAuthenticated, fetchSession } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Try to fetch session on mount
    fetchSession();
  }, [fetchSession]);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/recommendations", label: "Recommendations" },
    { href: "/settings", label: "Settings" },
  ];

  const isActiveLink = (href: string) => pathname === href;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0f0f23]/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-purple-500/5"
          : "bg-[#0f0f23]/60 backdrop-blur-md border-b border-white/5"
      }`}
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 group cursor-pointer"
          >
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 group-hover:from-purple-300 group-hover:to-cyan-300 transition-all">
              Gamerithm
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActiveLink(link.href)
                    ? "text-white bg-white/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5 hover:scale-105"
                }`}
              >
                {link.label}
                {isActiveLink(link.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <NotificationsDropdown hasNotifications={hasNotifications} />
            {isAuthenticated ? (
              <UserDropdown />
            ) : (
              <Link
                href="/auth/steam"
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                Sign in
              </Link>
            )}
            <MobileMenu navLinks={navLinks} />
          </div>
        </div>
      </div>
    </nav>
  );
}
