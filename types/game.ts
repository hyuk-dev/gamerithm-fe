export interface Game {
  id: number;
  title: string;
  coverImage: string;
  playtime?: number;
  genres: string[];
  lastPlayed?: string;
  rating?: number;
  releaseDate?: string;
  description?: string;
  developer?: string;
  publisher?: string;
  price?: number;
  discount?: number;
}

export interface GameRecommendation extends Game {
  matchScore: number;
  reasons: string[];
}

export interface GameLibrary {
  games: Game[];
  totalPlaytime: number;
  favoriteGenres: string[];
  averageRating: number;
}
