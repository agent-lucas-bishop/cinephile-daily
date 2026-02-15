import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Movie } from '../types';
import { PaperCard } from './ui/PaperCard';
import { tmdb } from '../services/tmdb';
import { HelpCircle, Home, Search, AlertCircle, ArrowRight } from 'lucide-react';

interface CastGameProps {
  movie: Movie;
  onExit: () => void;
  onNextMovie: () => void;
}

export const CastGame: React.FC<CastGameProps> = ({ movie, onExit, onNextMovie }) => {
  const [guessText, setGuessText] = useState('');
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [stage, setStage] = useState(0); 
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');

  // Logic: 
  // Stage 0: 3 Cast + Director (Always)
  // Stage 1: 4 Cast + Writers
  // Stage 2: 5 Cast + Poster + Character Names + Year
  const maxCast = 5;
  const castList = movie.credits?.cast.slice(0, maxCast) || [];
  const director = movie.credits?.crew.find(c => c.job === 'Director');
  const writers = movie.credits?.crew
    .filter(c => c.department === 'Writing' || c.job === 'Screenplay' || c.job === 'Writer')
    .slice(0, 2)
    // Remove duplicates if same person credited multiple times
    .filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
    
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : '';

  // Determine current visible items based on stage
  const visibleCastCount = stage === 0 ? 3 : stage === 1 ? 4 : 5;
  const showWriters = stage >= 1;
  const showCharacterNames = stage >= 2;
  const showYear = stage >= 2;

  useEffect(() => {
    setGuessText('');
    setSuggestions([]);
    setStage(0);
    setGameState('playing');
  }, [movie]);

  // Search Debounce Effect
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (guessText.trim().length >= 2 && gameState === 'playing') {
        // Only search if it doesn't look like we just selected a full title (heuristic)
        // or just search anyway.
        const results = await tmdb.searchMovies(guessText);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [guessText, gameState]);

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (guessText.toLowerCase().trim() === movie.title.toLowerCase().trim()) {
      setGameState('won');
      setSuggestions([]);
    } else {
      if (stage < 2) {
        setStage(s => s + 1);
        setGuessText('');
        setSuggestions([]);
      } else {
        setGameState('lost');
        setSuggestions([]);
      }
    }
  };

  const handleSelectSuggestion = (title: string) => {
      setGuessText(title);
      setSuggestions([]);
  };

  const skipStage = () => {
     if (stage < 2) {
        setStage(s => s + 1);
        setSuggestions([]);
      } else {
        setGameState('lost');
        setSuggestions([]);
      }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
       <PaperCard className="flex flex-col gap-6">
          
          {/* TOP SECTION: Controls & Mystery Badge */}
          <div className="flex gap-4 items-start">
             {/* The "File" / Mystery Image (Thumbnail) */}
             <div className="w-20 md:w-24 shrink-0 aspect-[2/3] bg-black border-2 border-[#1A1A1A] relative overflow-hidden shadow-md transition-all">
                 <div className="absolute inset-0 flex items-center justify-center opacity-30">
                     <span className="font-display text-4xl text-[#C5A059]">?</span>
                 </div>
                 {stage >= 2 && (
                     <motion.img 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        src={tmdb.getImageUrl(movie.poster_path)}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${gameState === 'playing' ? 'blur-sm grayscale' : ''}`}
                     />
                  )}
                  {/* Result Overlay */}
                  {gameState !== 'playing' && (
                     <div className={`absolute inset-0 flex items-center justify-center bg-black/60 font-bold text-xs uppercase tracking-widest ${gameState === 'won' ? 'text-green-400' : 'text-red-400'}`}>
                        {gameState === 'won' ? 'SOLVED' : 'CLOSED'}
                     </div>
                  )}
             </div>

             {/* Input Area */}
             <div className="flex-1 relative z-50"> 
                 <div className="mb-2">
                    <h2 className="font-display text-2xl text-[#8B0000] leading-none">Case #{movie.id.toString().slice(0,4)}</h2>
                    <p className="font-mono-vintage text-[10px] text-gray-500 uppercase tracking-widest">Identify the Motion Picture</p>
                 </div>

                 {gameState === 'playing' ? (
                   <form onSubmit={handleGuess} className="flex flex-col gap-2 relative">
                      <div className="relative w-full">
                        <input 
                            type="text" 
                            value={guessText} 
                            onChange={(e) => setGuessText(e.target.value)}
                            onBlur={() => setTimeout(() => setSuggestions([]), 200)} // Delay to allow click
                            placeholder="SEARCH EVIDENCE..."
                            className="w-full bg-transparent border-b-2 border-[#1A1A1A] py-1 pl-1 pr-8 font-mono-vintage text-lg focus:outline-none focus:border-[#8B0000] placeholder-gray-300 uppercase rounded-none"
                            autoFocus
                            autoComplete="off"
                        />
                        <div className="absolute right-0 top-1.5 text-gray-300">
                           <Search size={16} />
                        </div>

                        {/* Suggestions Dropdown */}
                        {suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-[#F4F1EA] border-2 border-[#1A1A1A] shadow-[0_4px_12px_rgba(0,0,0,0.2)] max-h-56 overflow-y-auto mt-0.5 z-[100]">
                                {suggestions.map((s) => (
                                    <div 
                                        key={s.id}
                                        className="px-3 py-2 border-b border-[#1A1A1A]/10 last:border-0 hover:bg-[#E6E2D6] cursor-pointer flex justify-between items-center group transition-colors"
                                        onClick={() => handleSelectSuggestion(s.title)}
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-mono-vintage text-sm uppercase text-[#1A1A1A] group-hover:text-[#8B0000] leading-tight">
                                                {s.title}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button type="submit" className="bg-[#1A1A1A] text-[#F4F1EA] py-2 px-4 text-xs font-display uppercase tracking-widest hover:bg-[#8B0000] transition-colors rounded-sm flex-1">
                           Submit
                        </button>
                        <button type="button" onClick={skipStage} className="bg-gray-200 text-[#1A1A1A] py-2 px-3 text-xs hover:bg-gray-300 rounded-sm">
                           Hint
                        </button>
                      </div>
                   </form>
                 ) : (
                    <div className="space-y-3">
                       <h3 className="font-display text-xl leading-tight">{movie.title}</h3>
                       <div className="flex gap-2 w-full">
                          <button onClick={onExit} className="bg-[#E6E2D6] border border-[#1A1A1A] text-[#1A1A1A] px-3 py-2 text-xs font-bold rounded flex items-center justify-center gap-1 uppercase tracking-wider flex-1">
                            <Home size={12} /> Menu
                          </button>
                          <button onClick={onNextMovie} className="bg-[#1A1A1A] text-[#F4F1EA] px-3 py-2 text-xs font-bold rounded flex items-center justify-center gap-1 uppercase tracking-wider flex-[2] hover:bg-[#333]">
                            Next Case <ArrowRight size={12} />
                          </button>
                       </div>
                    </div>
                 )}
             </div>
          </div>

          {/* BOTTOM SECTION: Evidence Board */}
          <div className="bg-[#f0f0f0] p-4 rounded-lg shadow-inner min-h-[250px] relative z-0">
             
             {/* KEY PERSONNEL (Director & Writers) */}
             <div className="mb-6">
               {/* Director - Blackboard Style Panel */}
               {director && (
                 <div className="bg-[#1A1A1A] p-3 rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.3)] border-4 border-[#333] relative overflow-hidden mb-4 max-w-sm mx-auto transform -rotate-1">
                    {/* Texture */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-chalk.png')]"></div>
                    
                    <div className="relative z-10 flex flex-col items-center text-center py-1">
                       <span className="text-[#8B0000] text-[9px] font-mono-vintage uppercase tracking-[0.25em] mb-1 bg-[#F4F1EA] px-2 py-0.5 rounded-sm shadow-sm">
                          Director
                       </span>
                       <span className="text-[#F4F1EA] font-display text-xl md:text-2xl tracking-wide mt-1 text-shadow">
                          {director.name}
                       </span>
                    </div>
                 </div>
               )}
               
               {/* Writers - Revealed at Stage 1 */}
               <AnimatePresence>
                  {showWriters && writers.length > 0 && (
                     <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex flex-col items-center justify-center border-t border-gray-300 pt-3"
                     >
                        <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-1">Screenplay By</span>
                        <div className="font-serif italic text-sm text-gray-800 text-center leading-tight">
                           {writers.map(w => w.name).join(' & ')}
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>

               {/* Year - Revealed at Stage 2 */}
               <AnimatePresence>
                  {showYear && releaseYear && (
                     <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex flex-col items-center justify-center border-t border-gray-300 pt-3 mt-2"
                     >
                        <span className="text-[9px] uppercase tracking-widest text-[#8B0000] font-bold mb-1 border border-[#8B0000] px-1 rounded-sm">
                          Release Year
                        </span>
                        <div className="font-mono-vintage text-xl text-[#1A1A1A] text-center font-bold">
                           {releaseYear}
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>
             </div>

             {/* CAST GRID */}
             <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                {castList.slice(0, visibleCastCount).map((actor, i) => (
                  <motion.div 
                    key={`${actor.id}-${i}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="w-24 md:w-32 bg-white p-2 pb-3 shadow-md transform hover:z-10 hover:scale-105 transition-transform flex flex-col flex-none"
                  >
                     <div className="aspect-[3/4] bg-gray-300 mb-2 filter sepia-[0.2] overflow-hidden">
                        <img 
                          src={tmdb.getProfileUrl(actor.profile_path)} 
                          alt={actor.name}
                          className="w-full h-full object-cover block"
                        />
                     </div>
                     <div className="font-mono-vintage text-center text-[9px] md:text-[10px] uppercase tracking-wider text-[#1A1A1A] leading-tight line-clamp-2 min-h-[1.5em] flex items-center justify-center">
                        {actor.name}
                     </div>
                     
                     {/* Character Name - Revealed at Stage 2 */}
                     <AnimatePresence>
                       {showCharacterNames && (
                          <motion.div
                             initial={{ opacity: 0, height: 0 }}
                             animate={{ opacity: 1, height: 'auto' }}
                             className="text-center text-[8px] text-gray-500 italic mt-1 border-t border-gray-100 pt-1 leading-tight"
                          >
                             as {actor.character}
                          </motion.div>
                       )}
                     </AnimatePresence>
                  </motion.div>
                ))}
             </div>
          </div>
       </PaperCard>
    </div>
  );
};