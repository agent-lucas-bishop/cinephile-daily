export interface Movie {
  id: number;
  title: string;
  tagline?: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date: string;
  vote_average: number;
  overview: string;
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path?: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
}

export enum GameMode {
  MENU = 'MENU',
  GENRE_SELECT = 'GENRE_SELECT', // New state for picking games within a genre
  POSTER = 'POSTER', // Replaces RATING
  YEAR = 'YEAR',
  CAST = 'CAST',
}

export interface Genre {
  id: number;
  name: string;
}

export interface GameState {
  currentMovie: Movie | null;
  score: number;
  maxScore: number;
  gameOver: boolean;
  won: boolean;
  history: string[]; // Log of messages/guesses
}

export interface TMDBConfig {
  apiKey: string;
}