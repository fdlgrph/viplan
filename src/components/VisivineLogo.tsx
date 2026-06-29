import React from 'react';
import logo from '../assets/logo.png';

interface VisivineLogoProps {
  className?: string;
  iconSize?: string;
  showText?: boolean;
  textColorClass?: string;
  isDarkBg?: boolean;
}

export default function VisivineLogo({
  className = '',
  iconSize = 'w-12 h-12',
  showText = true,
  textColorClass = 'text-slate-900 dark:text-white',
  isDarkBg = false,
}: VisivineLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Dynamic Logo Icon */}
<div
  className={`${iconSize} relative flex items-center justify-center overflow-hidden shrink-0`}
>
        {/* Glow effect inside icon */}
        <div className="absolute inset-0 bg-white/5 pointer-events-none" />
        
        {/* Highly accurate calligraphic V SVG matching user's image */}
<img
  src={logo}
  alt="Visivine Logo"
  className="w-full h-full object-contain"
/>
      </div>

      {/* Elegant wordmark "isivine" or "Visivine" depending on text context */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline font-serif select-none">
            {/* The V is calligraphic, 'isivine' is in premium Cormorant Garamond */}
            <span className="text-2xl font-black italic tracking-wide text-blue-600 dark:text-blue-400 mr-0.5">V</span>
            <span className={`text-2xl font-medium tracking-tight ${textColorClass}`}>isivine</span>
          </div>
          <span className="text-[9px] font-extrabold tracking-widest text-slate-400 dark:text-slate-500 uppercase mt-0.5 font-sans">
            Plan
          </span>
        </div>
      )}
    </div>
  );
}
