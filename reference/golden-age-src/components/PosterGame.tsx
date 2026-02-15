import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Movie } from '../types';
import { PaperCard } from './ui/PaperCard';
import { tmdb } from '../services/tmdb';
import { Home, Search, Eye, Film, ArrowRight } from 'lucide-react';

interface PosterGameProps {
  movie: Movie;
  onExit: () => void;
  onNextMovie: () => void;
}

export const PosterGame: React.FC<PosterGameProps> = ({ movie, onExit, onNextMovie }) => {
  const [guessText, setGuessText] = useState('');
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');

  const maxAttempts = 5;
  
  // Blur levels: 15px -> 10px -> 6px -> 3px -> 1px -> 0px (won)
  const blurLevels = [15, 10, 6, 3, 1, 0];
  const currentBlur = gameState === 'won' || gameState === 'lost' ? 0 : blurLevels[Math.min(attempts, blurLevels.length - 1)];
  const currentGrayscale = gameState === 'won' || gameState === 'lost' ? 0 : Math.max(0, 100 - (attempts * 20));

  // Reset state when movie changes
  useEffect(() => {
    setGuessText('');
    setSuggestions([]);
    setAttempts(0);
    setGameState('playing');
  }, [movie]);

  // Search Debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (guessText.trim().length >= 2 && gameState === 'playing') {
        const results = await tmdb.searchMovies(guessText);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [guessText, gameState]);

  const checkGuess = (title: string) => {
    if (title.toLowerCase().trim() === movie.title.toLowerCase().trim()) {
      setGameState('won');
      setSuggestions([]);
      setGuessText(movie.title);
    } else {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setGuessText('');
      setSuggestions([]);
      if (nextAttempts >= maxAttempts) {
        setGameState('lost');
      }
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkGuess(guessText);
  };

  const handleSelectSuggestion = (title: string) => {
    checkGuess(title);
  };

  const handleHint = () => {
     if (attempts < maxAttempts - 1) {
         setAttempts(a => a + 1);
     } else {
         setGameState('lost');
     }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 items-stretch">
         
         {/* Left: The Visual (Poster) */}
         <div className="flex-1 flex justify-center items-center bg-[#0a0a0a] p-4 border border-[#333] shadow-2xl relative overflow-hidden group">
            {/* Darkroom red light effect */}
            <div className="absolute inset-0 pointer-events-none bg-red-900/10 mix-blend-overlay z-10" />
            
            <div className="relative w-[280px] md:w-[320px] aspect-[2/3] bg-[#111] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-[#222]">
               <motion.img 
                 layout
                 key={movie.poster_path} // Re-animate on new movie
                 src={tmdb.getImageUrl(movie.poster_path, 'original')} 
                 alt="Mystery Poster"
                 className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
                 style={{ 
                    filter: `blur(${currentBlur}px) grayscale(${currentGrayscale}%) contrast(1.2)`,
                    transform: 'scale(1.05)' // slight scale to prevent blur edges showing white
                 }}
               />
               
               {/* Developing liquid overlay effect */}
               <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none" />
            </div>

            {/* Status Indicator */}
            <div className="absolute top-4 left-4 z-20">
                <div className="flex gap-1">
                    {[...Array(maxAttempts)].map((_, i) => (
                        <div 
                            key={i} 
                            className={`w-2 h-2 rounded-full transition-colors ${i < attempts ? 'bg-red-900' : 'bg-red-500/50'}`} 
                        />
                    ))}
                </div>
            </div>
         </div>

         {/* Right: The Controls */}
         <div className="flex-1 flex flex-col justify-center">
            <PaperCard className="w-full">
               <div className="mb-6 border-b-2 border-[#1A1A1A] pb-4">
                  <h2 className="font-display text-2xl text-[#8B0000] mb-1">Visual Decryption</h2>
                  <p className="font-mono-vintage text-xs uppercase tracking-widest text-gray-500">
                     Identify film from recovered assets
                  </p>
               </div>

               {gameState === 'playing' ? (
                 <div className="relative">
                    <form onSubmit={handleManualSubmit} className="flex flex-col gap-4">
                        <div className="relative w-full">
                            <input 
                                type="text" 
                                value={guessText} 
                                onChange={(e) => setGuessText(e.target.value)}
                                placeholder="ENTER FILM TITLE..."
                                className="w-full bg-[#E6E2D6] border-2 border-[#1A1A1A] py-3 pl-3 pr-10 font-mono-vintage text-lg focus:outline-none focus:border-[#8B0000] placeholder-gray-400 uppercase"
                                autoFocus
                                autoComplete="off"
                            />
                            <div className="absolute right-3 top-4 text-gray-400">
                                <Search size={18} />
                            </div>

                            {/* Suggestions Dropdown */}
                            {suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-[#F4F1EA] border-2 border-[#1A1A1A] border-t-0 shadow-xl max-h-60 overflow-y-auto z-50">
                                    {suggestions.map((s) => (
                                        <div 
                                            key={s.id}
                                            className="px-4 py-2 border-b border-[#1A1A1A]/10 hover:bg-[#E6E2D6] cursor-pointer flex justify-between items-center group"
                                            onClick={() => handleSelectSuggestion(s.title)}
                                        >
                                            <span className="font-mono-vintage text-sm uppercase text-[#1A1A1A] group-hover:text-[#8B0000]">
                                                {s.title}
                                            </span>
                                            {s.release_date && (
                                                <span className="text-xs text-gray-400 font-mono-vintage">
                                                    {s.release_date.split('-')[0]}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button 
                                type="submit" 
                                className="flex-1 bg-[#1A1A1A] text-[#F4F1EA] py-3 font-display uppercase tracking-widest hover:bg-[#8B0000] transition-colors"
                            >
                                Identify
                            </button>
                            <button 
                                type="button" 
                                onClick={handleHint}
                                className="px-4 bg-[#C5A059] text-[#1A1A1A] font-bold border-2 border-[#1A1A1A] hover:bg-[#d4b06a] flex items-center justify-center"
                                title="Enhance Image (Costs 1 Attempt)"
                            >
                                <Eye size={20} />
                            </button>
                        </div>
                    </form>
                    <p className="mt-4 font-serif italic text-xs text-gray-500 text-center">
                       {maxAttempts - attempts} attempts remaining before asset is lost.
                    </p>
                 </div>
               ) : (
                  <div className="flex flex-col items-center animate-in zoom-in-95 duration-500">
                     <h3 className={`font-display text-3xl mb-2 ${gameState === 'won' ? 'text-green-700' : 'text-[#8B0000]'}`}>
                        {gameState === 'won' ? 'MATCH CONFIRMED' : 'DECRYPTION FAILED'}
                     </h3>
                     <p className="font-mono-vintage text-lg mb-6 text-center border-b border-gray-300 pb-2 w-full">
                        {movie.title} <span className="text-gray-400 text-sm">({movie.release_date.split('-')[0]})</span>
                     </p>
                     
                     <div className="flex gap-3 w-full">
                        <button onClick={onExit} className="flex-1 bg-[#E6E2D6] text-[#1A1A1A] border-2 border-[#1A1A1A] px-4 py-3 rounded flex items-center justify-center gap-2 hover:bg-[#d4d0c4] transition-colors font-display uppercase tracking-wider text-xs">
                            <Home size={14} /> Archives
                        </button>
                        <button onClick={onNextMovie} className="flex-[2] bg-[#1A1A1A] text-[#F4F1EA] px-4 py-3 rounded flex items-center justify-center gap-2 hover:bg-[#333] transition-colors font-display uppercase tracking-wider text-xs shadow-lg">
                            Next Reel <ArrowRight size={14} />
                        </button>
                     </div>
                  </div>
               )}
            </PaperCard>
         </div>
      </div>
    </div>
  );
};