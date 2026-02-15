import { Movie, GameMode, Genre } from "../types";
import { FALLBACK_MOVIE } from "../constants";

const BASE_URL = "https://api.themoviedb.org/3";
const DEFAULT_KEY = "1b60f1a86097cd27733e0a24ff9253e2"; 

// Selected list of standard TMDB movie genres
export const GENRES: Genre[] = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

export class TMDBService {
  private apiKey: string | null = null;

  constructor() {
    this.apiKey = DEFAULT_KEY;
  }

  setApiKey(key: string) {
    this.apiKey = key;
  }

  private async fetchWithAuth(endpoint: string) {
    if (!this.apiKey) {
      console.warn("TMDB API Key missing.");
      throw new Error("API Key missing");
    }
    const url = `${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${this.apiKey}&language=en-US`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  }

  /**
   * Deterministically gets 3 genres for the day based on date
   */
  getDailyGenres(): Genre[] {
    const today = new Date().toISOString().split('T')[0];
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
      hash = ((hash << 5) - hash) + today.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash);
    
    // Shuffle copy of genres using seed
    const shuffled = [...GENRES].sort((a, b) => {
       const noiseA = Math.sin(seed + a.id) * 10000;
       const noiseB = Math.sin(seed + b.id) * 10000;
       return (noiseA - Math.floor(noiseA)) - (noiseB - Math.floor(noiseB));
    });

    return shuffled.slice(0, 3);
  }

  /**
   * Generates a daily movie based on the current date, game mode, AND genre.
   * @param variation An index to offset the seed, allowing for "Next Movie" functionality
   */
  async getDailyMovie(mode: GameMode, genreId: number, variation: number = 0): Promise<Movie> {
    if (!this.apiKey) {
      console.warn("No API Key provided. Using fallback data.");
      return new Promise((resolve) => setTimeout(() => resolve(FALLBACK_MOVIE), 800));
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      // Seed now includes variation to generate different movies when requested
      const seedStr = `${today}-${genreId}-${mode}-${variation}`;
      
      let hash = 5381;
      for (let i = 0; i < seedStr.length; i++) {
        hash = ((hash << 5) + hash) + seedStr.charCodeAt(i);
      }
      const seed = Math.abs(hash);

      const pseudoRandom = (input: number) => {
        const x = Math.sin(input) * 10000;
        return x - Math.floor(x);
      };

      const randomVal1 = pseudoRandom(seed);
      const randomVal2 = pseudoRandom(seed + 1337);

      // We restrict to top 10 pages to ensure quality within the genre
      const page = Math.floor(randomVal1 * 10) + 1; 
      
      const discoverUrl = `/discover/movie?with_genres=${genreId}&sort_by=vote_count.desc&include_adult=false&include_video=false&page=${page}&vote_count.gte=500`;
      
      const data = await this.fetchWithAuth(discoverUrl);
      const results = data.results;
      
      if (!results || results.length === 0) return FALLBACK_MOVIE;
      
      const index = Math.floor(randomVal2 * results.length);
      const movieSummary = results[index];

      // Fetch full details including credits
      const fullMovie = await this.fetchWithAuth(`/movie/${movieSummary.id}?append_to_response=credits,images`);
      
      return fullMovie as Movie;

    } catch (error) {
      console.error("TMDB Daily Fetch Error:", error);
      return FALLBACK_MOVIE;
    }
  }

  async searchMovies(query: string): Promise<Movie[]> {
    if (!this.apiKey || !query || query.length < 2) return [];
    try {
        const url = `/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`;
        const data = await this.fetchWithAuth(url);
        // Return top 5 results
        return (data.results || []).slice(0, 5);
    } catch (e) {
        console.error("Search Error:", e);
        return [];
    }
  }

  getImageUrl(path: string | undefined, size: 'w500' | 'w780' | 'original' | 'w185' = 'w500') {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }
  
  getProfileUrl(path: string | undefined) {
     if (!path) return "https://ui-avatars.com/api/?background=1A1A1A&color=F4F1EA&bold=true&name=?";
     return `https://image.tmdb.org/t/p/w185${path}`;
  }
}

export const tmdb = new TMDBService();