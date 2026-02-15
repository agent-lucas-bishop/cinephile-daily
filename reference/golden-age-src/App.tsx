import React, { useState, useEffect } from 'react';
import { Layout } from './components/ui/Layout';
import { PaperCard } from './components/ui/PaperCard';
import { PosterGame } from './components/PosterGame';
import { YearGame } from './components/YearGame';
import { CastGame } from './components/CastGame';
import { GameMode, Movie, Genre } from './types';
import { tmdb } from './services/tmdb';
import { COLORS } from './constants';
import { Film, Calendar, Eye, Ticket, ArrowLeft, Clapperboard } from 'lucide-react';
import { motion } from 'framer-motion';

const App = () => {
  const [mode, setMode] = useState<GameMode>(GameMode.MENU);
  const [dailyGenres, setDailyGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [variation, setVariation] = useState(0);

  useEffect(() => {
    // Load genres on mount
    setDailyGenres(tmdb.getDailyGenres());
  }, []);

  const selectGenre = (genre: Genre) => {
    setSelectedGenre(genre);
    setMode(GameMode.GENRE_SELECT);
    setVariation(0); // Reset variation when changing genre
  };

  const loadGame = async (selectedMode: GameMode, variationIndex: number = 0) => {
    if (!selectedGenre) return;

    setLoading(true);
    try {
      // Fetch movie based on Game Mode AND Genre ID to ensure uniqueness
      // Use variation to allow fetching different movies for the same day
      const movie = await tmdb.getDailyMovie(selectedMode, selectedGenre.id, variationIndex);
      setCurrentMovie(movie);
      setMode(selectedMode);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleNextMovie = () => {
    const nextVariation = variation + 1;
    setVariation(nextVariation);
    loadGame(mode, nextVariation);
  };

  const returnToGenreSelect = () => {
    setMode(GameMode.GENRE_SELECT);
    setCurrentMovie(null);
    setVariation(0);
  };

  const returnToMenu = () => {
    setMode(GameMode.MENU);
    setSelectedGenre(null);
    setCurrentMovie(null);
    setVariation(0);
  };

  // -- RENDER: Loading Screen --
  if (loading) {
    return (
      <Layout>
         <div className="flex flex-col items-center justify-center h-[60vh]">
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
              <Film size={64} color={COLORS.gold} />
            </motion.div>
            <p className="mt-8 font-display text-2xl text-[#F4F1EA] animate-pulse tracking-widest uppercase">
              Retrieving Archives...
            </p>
         </div>
      </Layout>
    );
  }

  // -- RENDER: Main Menu (Genre Selection) --
  if (mode === GameMode.MENU) {
    return (
      <Layout>
        <header className="text-center mb-12 relative w-full">
           <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#C5A059] -z-10 opacity-30"></div>
           <div className="inline-block bg-[#0a0a0a] px-8 py-4 border-y-4 border-double border-[#C5A059] shadow-[0_0_50px_rgba(197,160,89,0.1)]">
              <h1 className="font-display text-5xl md:text-7xl text-[#F4F1EA] tracking-tighter">
                CINÉPHILE
              </h1>
              <p className="font-mono-vintage text-[#C5A059] mt-2 tracking-[0.3em] text-sm md:text-base">
                THE DAILY EDITION
              </p>
           </div>
        </header>

        <div className="w-full max-w-4xl">
           <div className="text-center mb-8">
              <span className="font-mono-vintage text-[#F4F1EA] bg-[#1A1A1A] px-4 py-1 border border-[#333] uppercase text-xs tracking-widest">
                 Select Category
              </span>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dailyGenres.map((genre, idx) => (
                <button key={genre.id} onClick={() => selectGenre(genre)} className="group text-left h-full">
                  <PaperCard className="h-full flex flex-col items-center text-center transition-all group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(197,160,89,0.2)] py-12">
                     <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ring-4 ring-[#1A1A1A]/10">
                        <Clapperboard color={COLORS.gold} size={24} />
                     </div>
                     <h3 className="font-display text-3xl mb-2 group-hover:text-[#8B0000] transition-colors uppercase">
                        {genre.name}
                     </h3>
                     <div className="mt-auto pt-4 opacity-50 group-hover:opacity-100 transition-opacity font-mono-vintage text-[10px] uppercase tracking-widest text-[#8B0000]">
                        Open Case Files &rarr;
                     </div>
                  </PaperCard>
                </button>
              ))}
           </div>
        </div>
        
        <footer className="mt-20 text-center opacity-30 hover:opacity-100 transition-opacity">
           <p className="font-mono-vintage text-[10px] text-[#C5A059]">
              SECURE CONNECTION ESTABLISHED • TMDB API V3
           </p>
        </footer>
      </Layout>
    );
  }

  // -- RENDER: Game Selection (Sub-Menu) --
  if (mode === GameMode.GENRE_SELECT && selectedGenre) {
    return (
       <Layout>
          <div className="w-full flex justify-start mb-6">
             <button onClick={returnToMenu} className="flex items-center gap-2 text-[#C5A059] hover:text-[#F4F1EA] transition-colors font-mono-vintage text-sm uppercase tracking-wider">
                <ArrowLeft size={16} /> Change Category
             </button>
          </div>

          <div className="text-center mb-10">
             <h2 className="font-display text-4xl md:text-5xl text-[#F4F1EA]">{selectedGenre.name}</h2>
             <div className="w-24 h-1 bg-[#8B0000] mx-auto mt-2"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
             {/* Game 1: The Dossier */}
             <button onClick={() => loadGame(GameMode.CAST)} className="group text-left h-full">
               <PaperCard className="h-full flex flex-col items-center text-center transition-all group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(197,160,89,0.2)]">
                  <div className="w-16 h-16 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ring-4 ring-[#1A1A1A]/10">
                     <Ticket color={COLORS.gold} size={32} />
                  </div>
                  <h3 className="font-display text-2xl mb-2 group-hover:text-[#8B0000] transition-colors">The Dossier</h3>
                  <p className="font-serif italic text-gray-600 text-sm">
                    Identify the motion picture using classified cast photos and visual evidence.
                  </p>
                  <div className="mt-auto pt-6 opacity-0 group-hover:opacity-100 transition-opacity font-mono-vintage text-xs uppercase tracking-widest text-[#8B0000]">
                     Inspect Files &rarr;
                  </div>
               </PaperCard>
             </button>

             {/* Game 2: Visual Decryption (Poster) */}
             <button onClick={() => loadGame(GameMode.POSTER)} className="group text-left h-full">
               <PaperCard className="h-full flex flex-col items-center text-center transition-all group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(197,160,89,0.2)]">
                  <div className="w-16 h-16 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ring-4 ring-[#1A1A1A]/10">
                     <Eye color={COLORS.gold} size={32} />
                  </div>
                  <h3 className="font-display text-2xl mb-2 group-hover:text-[#8B0000] transition-colors">Visual Decryption</h3>
                  <p className="font-serif italic text-gray-600 text-sm">
                    Recover a film title from damaged, blurred visual assets.
                  </p>
                  <div className="mt-auto pt-6 opacity-0 group-hover:opacity-100 transition-opacity font-mono-vintage text-xs uppercase tracking-widest text-[#8B0000]">
                     Decrypt Now &rarr;
                  </div>
               </PaperCard>
             </button>

             {/* Game 3: Premiere Night */}
             <button onClick={() => loadGame(GameMode.YEAR)} className="group text-left h-full">
               <PaperCard className="h-full flex flex-col items-center text-center transition-all group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(197,160,89,0.2)]">
                  <div className="w-16 h-16 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ring-4 ring-[#1A1A1A]/10">
                     <Calendar color={COLORS.gold} size={32} />
                  </div>
                  <h3 className="font-display text-2xl mb-2 group-hover:text-[#8B0000] transition-colors">Premiere Night</h3>
                  <p className="font-serif italic text-gray-600 text-sm">
                    Pinpoint the exact year of release on the timeline.
                  </p>
                  <div className="mt-auto pt-6 opacity-0 group-hover:opacity-100 transition-opacity font-mono-vintage text-xs uppercase tracking-widest text-[#8B0000]">
                     Time Travel &rarr;
                  </div>
               </PaperCard>
             </button>
          </div>
       </Layout>
    );
  }

  // -- RENDER: Active Game --
  return (
    <Layout backdropPath={currentMovie?.backdrop_path}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full"
      >
        <div className="mb-4">
           <button onClick={returnToGenreSelect} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs font-mono-vintage uppercase tracking-widest">
              <ArrowLeft size={12} /> Return to {selectedGenre?.name}
           </button>
        </div>
        
        {currentMovie && (
          <>
            {mode === GameMode.POSTER && (
              <PosterGame 
                movie={currentMovie} 
                onExit={returnToGenreSelect}
                onNextMovie={handleNextMovie}
              />
            )}
            {mode === GameMode.YEAR && (
              <YearGame 
                movie={currentMovie} 
                onExit={returnToGenreSelect}
                onNextMovie={handleNextMovie}
              />
            )}
            {mode === GameMode.CAST && (
              <CastGame 
                movie={currentMovie} 
                onExit={returnToGenreSelect}
                onNextMovie={handleNextMovie}
              />
            )}
          </>
        )}
      </motion.div>
    </Layout>
  );
};

export default App;