import React from 'react';
import { NOISE_SVG_DATA_URI } from '../../constants';
import { tmdb } from '../../services/tmdb';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  backdropPath?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className = "", backdropPath }) => {
  const backdropUrl = tmdb.getImageUrl(backdropPath, 'original');

  return (
    <div className={`min-h-[100dvh] w-full relative flex flex-col items-center py-2 md:py-8 px-2 transition-all duration-1000 ${className}`}
         style={{
           backgroundColor: '#0a0a0a',
         }}>
      
      {/* Dynamic Background */}
      {backdropUrl && (
        <div 
          className="fixed inset-0 z-0 opacity-20 transition-opacity duration-1000 blur-sm scale-105"
          style={{
            backgroundImage: `url(${backdropUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {/* Cinematic Vignette (Darkens edges) */}
      <div className="fixed inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)]" />
      
      {/* Film Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-40 opacity-[0.05] mix-blend-overlay" 
           style={{ backgroundImage: `url("${NOISE_SVG_DATA_URI}")` }} />

      <div className="w-full max-w-5xl relative z-20 flex flex-col items-center">
        {children}
      </div>
    </div>
  );
};