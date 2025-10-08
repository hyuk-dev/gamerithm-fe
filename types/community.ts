import { User } from "./user";

export interface Post {
  id: number;
  author: User;
  category:
    | "Game Recommendation"
    | "Looking for Players"
    | "General Discussion"
    | "Review";
  title: string;
  content: string;
  preview: string;
  timestamp: string;
  upvotes: number;
  comments: number;
  tags: string[];
  thumbnail?: string;
  isUpvoted?: boolean;
  isBookmarked?: boolean;
}

export interface Comment {
  id: number;
  author: User;
  content: string;
  timestamp: string;
  upvotes: number;
  replies?: Comment[];
  isUpvoted?: boolean;
}

export interface CommunityStats {
  totalPosts: number;
  totalComments: number;
  activeUsers: number;
  popularTags: Array<{
    name: string;
    count: number;
  }>;
}
