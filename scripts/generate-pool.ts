/**
 * Generate static movie pools per genre from TMDB.
 * Run periodically (monthly?) to refresh the pool.
 * Output: api/movie-pools.json
 */

const TMDB_KEY = process.env.TMDB_API_KEY!;
const TMDB = 'https://api.themoviedb.org/3';

const DAILY_GENRE_IDS = [28, 12, 16, 35, 80, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 53, 10752, 37];

const GENRES: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History', 27: 'Horror',
  10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction',
  53: 'Thriller', 10752: 'War', 37: 'Western',
};

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${url}`);
  return res.json();
}

async function getGenrePool(genreId: number): Promise<number[]> {
  const seen = new Set<number>();
  const pool: { id: number; original_language: string; popularity: number }[] = [];

  // Top rated (10 pages)
  for (let p = 1; p <= 10; p++) {
    const data = await fetchJson(
      `${TMDB}/discover/movie?api_key=${TMDB_KEY}&sort_by=vote_average.desc&vote_count.gte=500&with_genres=${genreId}&page=${p}`
    );
    for (const m of data.results) {
      if (!seen.has(m.id)) { seen.add(m.id); pool.push(m); }
    }
    // Rate limit
    await new Promise(r => setTimeout(r, 100));
  }

  // Popular (10 pages)
  for (let p = 1; p <= 10; p++) {
    const data = await fetchJson(
      `${TMDB}/discover/movie?api_key=${TMDB_KEY}&sort_by=popularity.desc&vote_count.gte=200&with_genres=${genreId}&page=${p}`
    );
    for (const m of data.results) {
      if (!seen.has(m.id)) { seen.add(m.id); pool.push(m); }
    }
    await new Promise(r => setTimeout(r, 100));
  }

  // Filter foreign films
  const filtered = pool.filter(m => m.original_language === 'en' || m.popularity > 40);

  // Return just IDs (sorted for stable output)
  return filtered.map(m => m.id).sort((a, b) => a - b);
}

async function main() {
  if (!TMDB_KEY) { console.error('Set TMDB_API_KEY env var'); process.exit(1); }

  const pools: Record<string, number[]> = {};

  for (const genreId of DAILY_GENRE_IDS) {
    const name = GENRES[genreId];
    console.log(`Fetching ${name} (${genreId})...`);
    pools[String(genreId)] = await getGenrePool(genreId);
    console.log(`  → ${pools[String(genreId)].length} movies`);
  }

  const output = {
    generated: new Date().toISOString(),
    version: 1,
    pools,
  };

  const fs = await import('fs');
  const path = await import('path');
  const outPath = path.join(import.meta.dirname, '..', 'api', 'movie-pools.json');
  fs.writeFileSync(outPath, JSON.stringify(output));
  console.log(`\nWritten to ${outPath}`);
  
  const total = Object.values(pools).reduce((s, p) => s + p.length, 0);
  console.log(`Total: ${total} movie IDs across ${DAILY_GENRE_IDS.length} genres`);
}

main().catch(e => { console.error(e); process.exit(1); });
