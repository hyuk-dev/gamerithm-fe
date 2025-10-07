"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Notification {
  id: number;
  type: string;
  user: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationsDropdownProps {
  hasNotifications: boolean;
}

const notifications: Notification[] = [
  {
    id: 1,
    type: "comment",
    user: "Alex Chen",
    message: "commented on your post",
    time: "5 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "upvote",
    user: "Sarah Kim",
    message: "upvoted your recommendation",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "follow",
    user: "Mike Torres",
    message: "started following you",
    time: "3 hours ago",
    read: true,
  },
];

export function NotificationsDropdown({
  hasNotifications,
}: NotificationsDropdownProps) {
  return (
    <Popover modal={false}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer hover:scale-110"
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
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {hasNotifications && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 bg-[#1a1a2e]/98 backdrop-blur-xl border-white/10 text-white p-0"
      >
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Notifications</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-purple-400 hover:text-purple-300 cursor-pointer"
            >
              Mark all read
            </Button>
          </div>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${
                !notif.read ? "bg-purple-500/5" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="/diverse-user-avatars.png"
                    alt={notif.user}
                  />
                  <AvatarFallback>{notif.user[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium text-white">{notif.user}</span>{" "}
                    <span className="text-gray-400">{notif.message}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                </div>
                {!notif.read && (
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-white/10">
          <Button
            variant="ghost"
            className="w-full text-sm text-cyan-400 hover:text-cyan-300 cursor-pointer"
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
