import Link from "next/link";
import { useEffect } from "react";
import { useSteamProfile } from "@/hooks/use-steam-profile";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserDropdown() {
  const { profile, fetchProfile } = useSteamProfile();
  const { logout } = useAuth();

  useEffect(() => {
    if (!profile) fetchProfile();
  }, [profile, fetchProfile]);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          aria-label="User menu"
          className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-purple-400/50 transition-all cursor-pointer"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={profile?.avatar || "/diverse-user-avatars.png"}
              alt={profile?.name || "User"}
            />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white">
              {profile?.name?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-[#1a1a2e]/95 backdrop-blur-xl border-white/10 text-white"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile?.name || "User"}
            </p>
            <p className="text-xs leading-none text-gray-400">
              {profile?.username || "steam"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        <Link href={`/profile/${profile?.username || "me"}`}>
          <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Profile
          </DropdownMenuItem>
        </Link>
        <Link href="/settings">
          <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem
          onClick={logout}
          className="focus:bg-red-500/20 focus:text-red-400 cursor-pointer text-red-400"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
