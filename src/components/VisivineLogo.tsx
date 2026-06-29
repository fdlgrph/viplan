import React from 'react';

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
        className={`${iconSize} relative rounded-2xl flex items-center justify-center overflow-hidden shrink-0 shadow-lg select-none
          ${isDarkBg ? 'bg-[#0000d0]' : 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800'}`}
      >
        {/* Glow effect inside icon */}
        <div className="absolute inset-0 bg-white/5 pointer-events-none" />
        
        {/* Highly accurate calligraphic V SVG matching user's image */}
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4/5 h-4/5 text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]"
        >
          {/* Cursive V loop and main strokes */}
          <path
            d="M25 45 C20 40, 15 50, 22 60 C32 75, 52 65, 55 50 C58 35, 45 42, 38 65 C32 85, 38 95, 42 75 C45 60, 58 45, 68 45"
            stroke="currentColor"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Accent flourish hook */}
          <path
            d="M38 65 C40 55, 45 52, 50 62 C53 68, 50 78, 44 82 C38 85, 34 82, 36 75"
            stroke="currentColor"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Lower long swoosh underlining the word */}
          <path
            d="M32 88 C48 85, 70 85, 95 87 C102 87.5, 105 88, 108 88"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
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
