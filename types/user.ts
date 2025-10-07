export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  username: string;
  steamId?: string;
  joinedAt: string;
  lastActive?: string;
}

export interface UserProfile extends User {
  bio?: string;
  location?: string;
  favoriteGenres: string[];
  totalPlaytime: number;
  gamesPlayed: number;
  achievements: number;
  friends: User[];
  isFollowing?: boolean;
}

export interface Notification {
  id: number;
  type: "comment" | "upvote" | "follow" | "mention" | "recommendation";
  user: User;
  message: string;
  time: string;
  read: boolean;
  relatedId?: number;
}
