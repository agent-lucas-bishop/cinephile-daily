import type { VercelRequest, VercelResponse } from '@vercel/node';

const TMDB_KEY = process.env.TMDB_API_KEY!;
const TMDB = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p/w185';
const POSTER = 'https://image.tmdb.org/t/p/w500';

// TMDB genre IDs (from their API)
const GENRES: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

// Genres we actually want to feature as daily genres
// (skip TV Movie — too niche; skip Documentary — hard to guess from poster/cast)
const DAILY_GENRE_IDS = [28, 12, 16, 35, 80, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 53, 10752, 37];

// Seeded PRNG (mulberry32)
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dateSeed(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${url}`);
  return res.json();
}

// Shuffle array in-place using seeded RNG
function shuffle<T>(arr: T[], rng: () => number): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface PoolMovie {
  id: number;
  vote_count: number;
  vote_average: number;
  popularity: number;
  original_language: string;
  release_date: string;
  genre_ids: number[];
}

/**
 * Build a genre-filtered pool using TMDB Discover.
 * We pull from two sources:
 *   1. Top rated within the genre (critically acclaimed)
 *   2. Most popular within the genre (high vote count, not necessarily great)
 * This gives us a mix of classics and well-known crowd-pleasers.
 *
 * Foreign films are included only if they're very popular (popularity > 40).
 */
async function getGenrePool(genreId: number): Promise<PoolMovie[]> {
  const seen = new Set<number>();
  const pool: PoolMovie[] = [];

  // Source 1: Top-rated in genre (pages 1-10)
  const topRatedPages = Array.from({ length: 10 }, (_, i) => i + 1);
  const topRatedBatches = [topRatedPages.slice(0, 5), topRatedPages.slice(5)];
  for (const batch of topRatedBatches) {
    const results = await Promise.all(
      batch.map(p =>
        fetchJson(
          `${TMDB}/discover/movie?api_key=${TMDB_KEY}&sort_by=vote_average.desc&vote_count.gte=500&with_genres=${genreId}&page=${p}`
        )
      )
    );
    for (const data of results) {
      for (const m of data.results) {
        if (!seen.has(m.id)) {
          seen.add(m.id);
          pool.push(m);
        }
      }
    }
  }

  // Source 2: Most popular in genre (pages 1-10) — catches big blockbusters
  const popularPages = Array.from({ length: 10 }, (_, i) => i + 1);
  const popularBatches = [popularPages.slice(0, 5), popularPages.slice(5)];
  for (const batch of popularBatches) {
    const results = await Promise.all(
      batch.map(p =>
        fetchJson(
          `${TMDB}/discover/movie?api_key=${TMDB_KEY}&sort_by=popularity.desc&vote_count.gte=200&with_genres=${genreId}&page=${p}`
        )
      )
    );
    for (const data of results) {
      for (const m of data.results) {
        if (!seen.has(m.id)) {
          seen.add(m.id);
          pool.push(m);
        }
      }
    }
  }

  // Filter: foreign films must be very popular to stay in pool
  const filtered = pool.filter(m => {
    if (m.original_language === 'en') return true;
    // Foreign film — only keep if very popular
    return m.popularity > 40;
  });

  return filtered;
}

/**
 * Soft decade diversity: try to avoid all 3 movies from the same decade.
 * Pick from the pool with a preference for spread, but don't hard-fail.
 */
function pickDiverseMovies(pool: PoolMovie[], rng: () => number, count: number): PoolMovie[] {
  if (pool.length <= count) return pool.slice(0, count);

  // Shuffle the pool
  const shuffled = shuffle([...pool], rng);
  const picks: PoolMovie[] = [];
  const decades = new Set<number>();

  // First pass: try to pick from different decades
  for (const m of shuffled) {
    if (picks.length >= count) break;
    const year = new Date(m.release_date).getFullYear();
    const decade = Math.floor(year / 10) * 10;

    if (!decades.has(decade) || picks.length >= count - 1) {
      picks.push(m);
      decades.add(decade);
    }
  }

  // If we didn't get enough (unlikely), just fill from shuffled
  if (picks.length < count) {
    const pickedIds = new Set(picks.map(p => p.id));
    for (const m of shuffled) {
      if (picks.length >= count) break;
      if (!pickedIds.has(m.id)) picks.push(m);
    }
  }

  return picks;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const now = new Date();
    const dateStr = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;

    // Cache until end of UTC day
    const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59));
    const maxAge = Math.max(60, Math.floor((endOfDay.getTime() - now.getTime()) / 1000));
    res.setHeader('Cache-Control', `public, s-maxage=${maxAge}, stale-while-revalidate=60`);

    const seed = dateSeed(dateStr);
    const rng = mulberry32(seed);

    // Pick today's genre
    const genreIdx = Math.floor(rng() * DAILY_GENRE_IDS.length);
    const genreId = DAILY_GENRE_IDS[genreIdx];
    const genre = GENRES[genreId];

    // Build genre-filtered pool
    const pool = await getGenrePool(genreId);

    if (pool.length < 3) {
      // Fallback: if genre is too sparse, use general popular movies
      console.warn(`Genre "${genre}" only has ${pool.length} movies, falling back`);
    }

    // Pick 3 diverse movies
    const picks = pickDiverseMovies(pool, rng, 3);

    // Fetch full details for all 3 movies in parallel
    const movies = await Promise.all(picks.map(async (pick) => {
      const [details, keywords] = await Promise.all([
        fetchJson(`${TMDB}/movie/${pick.id}?api_key=${TMDB_KEY}&append_to_response=credits`),
        fetchJson(`${TMDB}/movie/${pick.id}/keywords?api_key=${TMDB_KEY}`),
      ]);

      const director = details.credits?.crew?.find((c: { job: string }) => c.job === 'Director');
      const writers = details.credits?.crew
        ?.filter((c: { department: string }) => c.department === 'Writing')
        ?.slice(0, 3)
        ?.map((c: { name: string }) => c.name) ?? [];
      const cast = (details.credits?.cast ?? []).slice(0, 6).map((c: { name: string; character: string; profile_path: string | null }) => ({
        name: c.name,
        character: c.character,
        profilePath: c.profile_path,
      }));

      return {
        id: details.id,
        title: details.title,
        year: new Date(details.release_date).getFullYear(),
        director: director?.name ?? 'Unknown',
        directorPhoto: director?.profile_path ? `${IMG}${director.profile_path}` : null,
        cast,
        writers: [...new Set(writers)],
        genre: details.genres?.[0]?.name ?? genre,
        tagline: details.tagline ?? '',
        overview: details.overview ?? '',
        plotKeywords: (keywords.keywords ?? []).slice(0, 5).map((k: { name: string }) => k.name),
        posterUrl: details.poster_path ? `${POSTER}${details.poster_path}` : '',
      };
    }));

    res.status(200).json({ date: dateStr, movies, genre });
  } catch (err) {
    console.error('daily-puzzle error:', err);
    res.status(500).json({ error: 'Failed to generate daily puzzle' });
  }
}
