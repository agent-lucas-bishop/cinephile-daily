import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Movie } from '../types';
import { PaperCard } from './ui/PaperCard';
import { tmdb } from '../services/tmdb';
import { ArrowUp, ArrowDown, Check, Home, XCircle, ArrowRight } from 'lucide-react';

interface YearGameProps {
  movie: Movie;
  onExit: () => void;
  onNextMovie: () => void;
}

export const YearGame: React.FC<YearGameProps> = ({ movie, onExit, onNextMovie }) => {
  const [yearGuess, setYearGuess] = useState<string>('');
  const [guesses, setGuesses] = useState<{year: number, diff: number}[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  
  const correctYear = new Date(movie.release_date).getFullYear();
  const maxAttempts = 5;

  useEffect(() => {
    setYearGuess('');
    setGuesses([]);
    setGameState('playing');
  }, [movie]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!yearGuess) return;
    const val = parseInt(yearGuess);
    if (isNaN(val)) return;

    if (val === correctYear) {
      setGameState('won');
    } else if (guesses.length + 1 >= maxAttempts) {
      setGameState('lost');
    }

    setGuesses([...guesses, { year: val, diff: val - correctYear }]);
    setYearGuess('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
         
         {/* Left: The Visual (Poster) - Reduced size by ~30% */}
         <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative w-[200px] md:w-[240px] aspect-[2/3] bg-black shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-white transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
               <motion.img 
                 key={movie.poster_path}
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 src={tmdb.getImageUrl(movie.poster_path)} 
                 alt={movie.title}
                 className={`w-full h-full object-cover transition-all duration-1000 ${gameState === 'playing' ? 'blur-md grayscale' : 'blur-0'}`}
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            </div>
         </div>

         {/* Right: The Game Interaction */}
         <div className="flex-1 flex flex-col justify-center">
            <PaperCard variant="ticket" className="w-full max-w-md mx-auto lg:mx-0">
               <div className="text-center mb-5">
                  <div className="inline-block border-y-2 border-[#1A1A1A] py-1 mb-3">
                     <h2 className="font-display text-2xl md:text-3xl uppercase tracking-tighter text-[#1A1A1A]">{movie.title}</h2>
                  </div>
                  <p className="font-serif italic text-gray-500 text-sm">"Identify the year of release"</p>
               </div>

               {gameState === 'playing' ? (
                 <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3 mb-6">
                    <input 
                      type="number" 
                      value={yearGuess}
                      onChange={(e) => setYearGuess(e.target.value)}
                      placeholder="YYYY"
                      className="bg-transparent border-b-4 border-[#1A1A1A] w-40 text-center font-mono-vintage text-4xl focus:outline-none focus:border-[#C5A059] placeholder-gray-300"
                      autoFocus
                    />
                    <button 
                       type="submit"
                       className="bg-[#1A1A1A] text-[#F4F1EA] px-6 py-2 font-display uppercase tracking-[0.2em] text-base hover:bg-[#8B0000] transition-colors mt-2 shadow-lg"
                    >
                       Stamp Date
                    </button>
                 </form>
               ) : (
                  <div className="flex flex-col items-center gap-3 mb-6 animate-in zoom-in-95 duration-300">
                     <div className={`text-2xl font-display ${gameState === 'won' ? 'text-green-700' : 'text-[#8B0000]'}`}>
                        {gameState === 'won' ? 'Correct!' : 'Time Up.'}
                     </div>
                     <div className="font-mono-vintage text-base">
                        Released: <span className="font-bold">{correctYear}</span>
                     </div>
                     <div className="flex gap-3 w-full mt-4">
                        <button onClick={onExit} className="flex-1 bg-white border border-[#1A1A1A] text-[#1A1A1A] px-4 py-2 rounded shadow hover:bg-gray-50 text-xs flex items-center justify-center gap-2 uppercase font-bold tracking-wider">
                          <Home size={14} /> Menu
                        </button>
                        <button onClick={onNextMovie} className="flex-[2] bg-[#1A1A1A] text-[#F4F1EA] px-4 py-2 rounded shadow hover:bg-[#2a2a2a] text-xs flex items-center justify-center gap-2 uppercase font-bold tracking-wider">
                          Next Premiere <ArrowRight size={14} />
                        </button>
                     </div>
                  </div>
               )}

               {/* Timeline / History */}
               <div className="border-t-2 border-dashed border-gray-300 pt-5">
                  <div className="flex justify-center gap-2 flex-wrap">
                     {guesses.map((g, i) => (
                        <motion.div 
                           key={i}
                           initial={{ scale: 0 }}
                           animate={{ scale: 1 }}
                           className={`
                              relative w-10 h-10 rounded-full flex items-center justify-center border-2 font-mono-vintage font-bold text-xs
                              ${g.diff === 0 ? 'bg-[#C5A059] border-[#C5A059] text-white' : 'bg-white border-gray-300 text-gray-600'}
                           `}
                        >
                           {g.year}
                           {g.diff !== 0 && (
                              <div className={`
                                 absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white shadow
                                 ${g.diff > 0 ? 'bg-[#8B0000]' : 'bg-[#1A1A1A]'}
                              `}>
                                 {g.diff > 0 ? <ArrowDown size={8} /> : <ArrowUp size={8} />}
                              </div>
                           )}
                        </motion.div>
                     ))}
                     {[...Array(maxAttempts - guesses.length)].map((_, i) => (
                        <div key={`empty-${i}`} className="w-10 h-10 rounded-full border-2 border-gray-100 bg-gray-50/50" />
                     ))}
                  </div>
               </div>

            </PaperCard>
         </div>

      </div>
    </div>
  );
};