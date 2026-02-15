export interface WatchProvider {
  id: number;
  name: string;
  logoUrl: string;
  type: 'stream' | 'rent' | 'buy';
}

export interface CastMember {
  name: string;
  character: string;
  profilePath: string | null;
}

export interface Movie {
  id: number;
  title: string;
  year: number;
  director: string;
  directorPhoto: string | null;
  cast: CastMember[];
  writers: string[];
  genre: string;
  tagline: string;
  overview?: string;
  plotKeywords: string[];
  posterUrl: string;
  rating: number;
  watchProviders: WatchProvider[];
}

export function getHeadshotUrl(profilePath: string | null): string | null {
  if (!profilePath) return null;
  return `https://image.tmdb.org/t/p/w185${profilePath}`;
}
