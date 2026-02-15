import type { VercelRequest, VercelResponse } from '@vercel/node';

const TMDB_KEY = process.env.TMDB_API_KEY!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const query = req.query.q;
  if (!query || typeof query !== 'string' || query.length < 1) {
    return res.status(200).json({ results: [] });
  }

  try {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}&page=1`;
    const data = await fetch(url).then(r => r.json());
    const results = (data.results ?? []).slice(0, 8).map((m: { id: number; title: string; release_date?: string }) => ({
      id: m.id,
      title: m.title,
      year: m.release_date ? new Date(m.release_date).getFullYear() : null,
    }));

    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=60');
    res.status(200).json({ results });
  } catch {
    res.status(500).json({ results: [] });
  }
}
