import React from 'react';
import { COLORS, NOISE_SVG_DATA_URI } from '../../constants';

interface PaperCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'ticket' | 'program';
}

export const PaperCard: React.FC<PaperCardProps> = ({ children, className = "", variant = 'program' }) => {
  return (
    <div 
      className={`relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform transition-transform duration-500 hover:scale-[1.005] ${className}`}
      style={{
        backgroundColor: COLORS.paper,
        color: COLORS.ink,
      }}
    >
      {/* Paper Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply"
           style={{ backgroundImage: `url("${NOISE_SVG_DATA_URI}")` }} />

      {/* Decorative Border for Program */}
      {variant === 'program' && (
        <div className="absolute inset-2 md:inset-3 border-2 border-double border-[#1A1A1A] opacity-20 pointer-events-none" />
      )}

      {/* Perforations for Ticket */}
      {variant === 'ticket' && (
        <>
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-[#0a0a0a] rounded-r-full" />
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-[#0a0a0a] rounded-l-full" />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 p-4 md:p-8">
        {children}
      </div>
    </div>
  );
};