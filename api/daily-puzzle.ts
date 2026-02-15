import type { VercelRequest, VercelResponse } from '@vercel/node';

const TMDB_KEY = process.env.TMDB_API_KEY!;
const TMDB = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p/w185';
const POSTER = 'https://image.tmdb.org/t/p/w500';

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

// Build a pool of ~400 top-rated movie IDs
async function getMoviePool(): Promise<number[]> {
  const ids: number[] = [];
  // Fetch pages 1-20 in parallel (batches of 5)
  for (let batch = 0; batch < 4; batch++) {
    const pages = Array.from({ length: 5 }, (_, i) => batch * 5 + i + 1);
    const results = await Promise.all(
      pages.map(p => fetchJson(`${TMDB}/movie/top_rated?api_key=${TMDB_KEY}&page=${p}`))
    );
    for (const data of results) {
      for (const movie of data.results) {
        ids.push(movie.id);
      }
    }
  }
  return ids;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const now = new Date();
    const dateStr = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;

    // Cache until end of UTC day
    const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59));
    const maxAge = Math.max(60, Math.floor((endOfDay.getTime() - now.getTime()) / 1000));
    res.setHeader('Cache-Control', `public, s-maxage=${maxAge}, stale-while-revalidate=60`);

    const pool = await getMoviePool();
    const seed = dateSeed(dateStr);
    const rng = mulberry32(seed);

    // Pick 3 unique movies for the 3 games
    const indices = new Set<number>();
    while (indices.size < 3) {
      indices.add(Math.floor(rng() * pool.length));
    }
    const picks = [...indices].map(i => pool[i]);

    // Fetch full details for all 3 movies in parallel
    const movies = await Promise.all(picks.map(async (movieId) => {
      const [details, keywords] = await Promise.all([
        fetchJson(`${TMDB}/movie/${movieId}?api_key=${TMDB_KEY}&append_to_response=credits`),
        fetchJson(`${TMDB}/movie/${movieId}/keywords?api_key=${TMDB_KEY}`),
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
        genre: details.genres?.[0]?.name ?? 'Drama',
        tagline: details.tagline ?? '',
        overview: details.overview ?? '',
        plotKeywords: (keywords.keywords ?? []).slice(0, 5).map((k: { name: string }) => k.name),
        posterUrl: details.poster_path ? `${POSTER}${details.poster_path}` : '',
      };
    }));

    // Genre of the day
    const genres = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Thriller'];
    const genre = genres[Math.floor(rng() * genres.length)];

    res.status(200).json({ date: dateStr, movies, genre });
  } catch (err) {
    console.error('daily-puzzle error:', err);
    res.status(500).json({ error: 'Failed to generate daily puzzle' });
  }
}
