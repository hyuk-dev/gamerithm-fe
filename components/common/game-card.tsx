import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GameCardProps {
  id: number;
  title: string;
  coverImage: string;
  playtime?: number;
  genres: string[];
  lastPlayed?: string;
  className?: string;
}

export function GameCard({
  id,
  title,
  coverImage,
  playtime,
  genres,
  lastPlayed,
  className,
}: GameCardProps) {
  return (
    <Card
      className={`bg-gray-800 border-gray-700 overflow-hidden hover:border-purple-500 transition-all duration-300 hover:-translate-y-1 ${className}`}
    >
      <Link href={`/games/${id}`} className="block">
        <div className="relative aspect-video">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4 space-y-3">
          <h3 className="text-lg font-semibold text-white line-clamp-2">
            {title}
          </h3>

          {playtime && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{playtime} hours played</span>
            </div>
          )}

          {lastPlayed && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Last played {lastPlayed}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-1">
            {genres.slice(0, 3).map((genre) => (
              <Badge
                key={genre}
                variant="secondary"
                className="text-xs bg-gray-700 text-gray-300"
              >
                {genre}
              </Badge>
            ))}
            {genres.length > 3 && (
              <Badge
                variant="secondary"
                className="text-xs bg-gray-700 text-gray-300"
              >
                +{genres.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
}
