import React from 'react';

// Mirrors src/landing/components/BrandLogo.tsx — the landing and the app are
// separate Vite entries, so the mark is duplicated rather than shared.
export const HypeLeadsSymbol: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-7 h-7',
  size = 28,
}) => (
  <svg
    viewBox="0 0 28 28"
    width={size}
    height={size}
    className={`select-none pointer-events-none ${className}`}
    aria-hidden="true"
  >
    <circle cx="14" cy="14" r="13" fill="#8126C2" fillOpacity="0.16" />
    <circle cx="14" cy="14" r="8.5" fill="none" stroke="#B65AF0" strokeOpacity="0.55" strokeWidth="1.4" />
    <circle cx="14" cy="14" r="3.4" fill="#B65AF0" />
  </svg>
);

interface HypeLeadsLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES = {
  sm: 'h-6 text-base gap-2',
  md: 'h-8 text-lg gap-2.5',
  lg: 'h-10 text-2xl gap-3',
} as const;

const SYMBOL_SIZES = { sm: 22, md: 28, lg: 36 } as const;

export const HypeLeadsLogo: React.FC<HypeLeadsLogoProps> = ({
  className = '',
  showText = true,
  size = 'md',
}) => (
  <div
    className={`inline-flex items-center select-none font-display font-bold tracking-tight text-[#F4F2F7] ${SIZE_CLASSES[size]} ${className}`}
  >
    <div className="relative flex items-center justify-center">
      <div className="absolute inset-0 bg-[#8126C2]/20 blur-md rounded-full scale-125" />
      <HypeLeadsSymbol className="relative" size={SYMBOL_SIZES[size]} />
    </div>
    {showText && (
      <span className="relative tracking-[-0.03em] font-extrabold flex items-center">
        HypeLeads
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8126C2] ml-1 mb-1 shadow-[0_0_8px_#8126C2]" />
      </span>
    )}
  </div>
);
