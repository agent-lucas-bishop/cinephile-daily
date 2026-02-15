import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Movie } from '../types';
import { PaperCard } from './ui/PaperCard';
import { tmdb } from '../services/tmdb';
import { Star, Home, XCircle, AlertCircle } from 'lucide-react';

interface RatingGameProps {
  movie: Movie;
  onExit: () => void;
}

export const RatingGame: React.FC<RatingGameProps> = ({ movie, onExit }) => {
  const [guess, setGuess] = useState(5.0);
  const [range, setRange] = useState<[number, number]>([0, 10]);
  const [attempts, setAttempts] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [history, setHistory] = useState<{guess: number, result: string}[]>([]);
  
  const targetRating = movie.vote_average;
  const maxAttempts = 2;

  const handleGuess = () => {
    const formattedGuess = Number(guess.toFixed(1));
    const dist = Math.abs(formattedGuess - targetRating);
    
    // Win condition (within 0.3 is decent challenge)
    if (dist <= 0.3) { 
      setGameState('won');
      return;
    }

    // Check if this was the last attempt
    if (attempts + 1 >= maxAttempts) {
      setGameState('lost');
      return;
    }

    let newMin = range[0];
    let newMax = range[1];
    let result = '';

    // Logic for "Random Closure"
    if (formattedGuess < targetRating) {
      result = 'Higher';
      newMin = formattedGuess;
      const potentialNewMax = targetRating + (Math.random() * (range[1] - targetRating));
      if (potentialNewMax < newMax) newMax = potentialNewMax;
    } else {
      result = 'Lower';
      newMax = formattedGuess;
      const potentialNewMin = range[0] + (Math.random() * (targetRating - range[0]));
      if (potentialNewMin > newMin) newMin = potentialNewMin;
    }

    setRange([Number(newMin.toFixed(1)), Number(newMax.toFixed(1))]);
    setHistory([...history, { guess: formattedGuess, result }]);
    setAttempts(p => p + 1);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <PaperCard className="w-full overflow-hidden">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Header Area: Poster & Title combined on Mobile for space */}
          <div className="flex md:flex-col gap-4 md:w-1/3 shrink-0 items-start">
             {/* Poster */}
             <div className="relative w-24 md:w-full aspect-[2/3] shrink-0 shadow-lg border-2 border-[#1A1A1A] bg-black overflow-hidden">
                <img 
                  src={tmdb.getImageUrl(movie.poster_path, 'w500')} 
                  alt={`Poster`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 pointer-events-none" />
             </div>

             {/* Title & Info */}
             <div className="flex flex-col justify-center min-h-[96px] md:min-h-0 w-full">
                <div className="inline-block px-2 py-0.5 border border-[#1A1A1A] rounded-full text-[10px] font-mono-vintage uppercase tracking-widest mb-2 text-[#8B0000] w-fit">
                   Audience Score
                </div>
                <h3 className="font-display text-xl md:text-2xl text-[#1A1A1A] leading-tight mb-1 line-clamp-2 md:line-clamp-none">{movie.title}</h3>
                
                {/* Tagline Added Here */}
                {movie.tagline && (
                  <p className="font-serif italic text-sm text-gray-600 leading-tight mt-1 line-clamp-3 md:line-clamp-none">
                    "{movie.tagline}"
                  </p>
                )}

                <div className="flex gap-1 mt-3">
                   {[...Array(maxAttempts)].map((_, i) => (
                     <div 
                       key={i} 
                       className={`w-3 h-3 rounded-full border border-[#1A1A1A] transition-colors ${i < attempts ? 'bg-[#8B0000]' : 'bg-[#F4F1EA]'}`} 
                     />
                   ))}
                </div>
             </div>
          </div>

          {/* Game Area */}
          <div className="flex-1 flex flex-col justify-center pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-gray-200 md:pl-6">
            
            {/* The Gauge */}
            <div className="w-full mb-6">
              <div className="relative h-20 md:h-24 w-full bg-[#1A1A1A] rounded shadow-inner border-4 border-[#333] flex items-center justify-center px-6 overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]"></div>

                <div className="relative w-full h-full">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#555] -translate-y-1/2 z-0"></div>

                  <motion.div 
                    initial={false}
                    animate={{ width: `${(range[0] / 10) * 100}%` }}
                    transition={{ type: "spring", bounce: 0, duration: 0.8 }}
                    className="absolute left-0 top-0 bottom-0 bg-black/80 z-10 border-r-2 border-[#8B0000]"
                  />
                  <motion.div 
                    initial={false}
                    animate={{ width: `${(1 - range[1] / 10) * 100}%` }}
                    transition={{ type: "spring", bounce: 0, duration: 0.8 }}
                    className="absolute right-0 top-0 bottom-0 bg-black/80 z-10 border-l-2 border-[#8B0000]"
                  />

                  {/* Ticks */}
                  <div className="absolute inset-0 flex justify-between items-center pointer-events-none z-0 px-1">
                    {[...Array(11)].map((_, i) => (
                      <div key={i} className="flex flex-col items-center gap-1 h-full justify-center pt-1">
                         <div className="h-1.5 w-0.5 bg-[#666]" />
                         {i % 2 === 0 && <span className="text-[8px] text-[#666] font-mono-vintage absolute bottom-1">{i}</span>}
                      </div>
                    ))}
                  </div>

                  {/* Thumb */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-6 h-12 md:w-8 md:h-16 z-20 cursor-grab active:cursor-grabbing"
                    style={{ marginLeft: '-12px' }}
                    animate={{ left: `${(guess / 10) * 100}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                     <div className="w-full h-full bg-[#F4F1EA] rounded shadow-md border-2 border-[#C5A059] flex items-center justify-center">
                        <div className="h-6 w-1 bg-[#1A1A1A]/20 rounded-full"></div>
                     </div>
                  </motion.div>

                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={0.1}
                    value={guess}
                    disabled={gameState !== 'playing'}
                    onChange={(e) => setGuess(parseFloat(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                  />
                  
                   {/* True Rating Reveal */}
                   {(gameState !== 'playing') && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-1/2 -translate-y-1/2 z-40 pointer-events-none"
                      style={{ left: `${(targetRating / 10) * 100}%`, marginLeft: '-16px' }}
                    >
                      <Star fill="#C5A059" stroke="#F4F1EA" strokeWidth={1} size={32} className="drop-shadow-[0_0_15px_rgba(197,160,89,1)]" />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Digital Readout */}
              <div className="mt-4 flex justify-center items-end gap-2">
                 <div className="bg-[#0a0a0a] border border-[#555] rounded px-4 py-1 shadow-inner min-w-[100px] text-center">
                    <span className="font-mono-vintage text-3xl text-[#C5A059] tabular-nums tracking-widest text-shadow-glow">
                      {guess.toFixed(1)}
                    </span>
                 </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-4">
              {gameState === 'playing' ? (
                 <>
                   <button 
                     onClick={handleGuess}
                     className="bg-[#8B0000] text-[#F4F1EA] font-display uppercase tracking-widest text-lg px-8 py-3 rounded hover:bg-[#9E1B1B] active:scale-95 transition-all w-full"
                   >
                     {attempts === 0 ? 'Submit Assessment' : 'Final Verdict'}
                   </button>
                   
                   <div className="h-6 flex justify-center">
                      <AnimatePresence mode="wait">
                        {history.length > 0 && (
                           <motion.div 
                             key="hint"
                             initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                             className="flex items-center gap-2 text-[#8B0000] font-mono-vintage text-xs"
                           >
                              <AlertCircle size={12} />
                              <span>ACTUAL IS {history[history.length-1].result.toUpperCase()}</span>
                           </motion.div>
                        )}
                      </AnimatePresence>
                   </div>
                 </>
              ) : (
                <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in-95 duration-300">
                   <div className={`text-2xl font-display ${gameState === 'won' ? 'text-green-700' : 'text-[#8B0000]'}`}>
                      {gameState === 'won' ? 'Exact Match!' : 'Review Closed.'}
                   </div>
                   <div className="font-mono-vintage text-xs text-gray-600">
                      Actual: <span className="font-bold text-[#1A1A1A] text-base">{targetRating.toFixed(1)}</span>
                   </div>
                   
                   <p className="font-serif italic text-sm text-gray-500 mt-2">
                     Check back tomorrow for a new film.
                   </p>

                   <div className="flex gap-2 w-full mt-2 justify-center">
                      <button 
                        onClick={onExit}
                        className="flex items-center justify-center gap-2 bg-[#1A1A1A] text-[#C5A059] px-6 py-3 rounded hover:bg-[#2a2a2a] w-full md:w-auto min-w-[200px]"
                      >
                        <Home size={16} /> Back to Menu
                      </button>
                   </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </PaperCard>
    </div>
  );
};