import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PostCardProps {
  id: number;
  author: {
    name: string;
    avatar: string;
    username: string;
  };
  category: string;
  title: string;
  preview: string;
  timestamp: string;
  upvotes: number;
  comments: number;
  tags: string[];
  thumbnail?: string;
  className?: string;
}

export function PostCard({
  id,
  author,
  category,
  title,
  preview,
  timestamp,
  upvotes,
  comments,
  tags,
  thumbnail,
  className,
}: PostCardProps) {
  return (
    <Card
      className={`bg-gray-800 border-gray-700 hover:border-purple-500 transition-all duration-300 hover:-translate-y-1 ${className}`}
    >
      <Link href={`/community/${id}`} className="block">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback>{author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">
                  {author.name}
                </span>
                <Badge
                  variant="secondary"
                  className="text-xs bg-purple-500/20 text-purple-300"
                >
                  {category}
                </Badge>
              </div>
              <p className="text-xs text-gray-400">{timestamp}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white line-clamp-2">
              {title}
            </h3>
            <p className="text-gray-400 text-sm line-clamp-3">{preview}</p>
          </div>

          {thumbnail && (
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={thumbnail}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs border-gray-600 text-gray-300"
                >
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs border-gray-600 text-gray-300"
                >
                  +{tags.length - 3}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
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
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                <span>{upvotes}</span>
              </div>
              <div className="flex items-center gap-1">
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>{comments}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
