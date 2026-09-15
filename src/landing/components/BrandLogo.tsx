import React from 'react';

interface HypeLeadsLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const HypeLeadsSymbol: React.FC<{ className?: string; size?: number }> = ({
  className = "w-7 h-7",
  size = 28,
}) => {
  return (
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
};

export const HypeLeadsLogo: React.FC<HypeLeadsLogoProps> = ({
  className = "",
  showText = true,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-6 text-lg gap-2',
    md: 'h-8 text-xl gap-2.5',
    lg: 'h-10 text-2xl gap-3',
    xl: 'h-14 text-4xl gap-4',
  };

  const symbolSizes = {
    sm: 22,
    md: 28,
    lg: 36,
    xl: 52,
  };

  return (
    <div className={`inline-flex items-center select-none font-display font-bold tracking-tight text-[#F4F2F7] ${sizeClasses[size]} ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Subtle behind glow */}
        <div className="absolute inset-0 bg-[#8126C2]/20 blur-md rounded-full scale-125" />
        <HypeLeadsSymbol
          className="relative text-[#F4F2F7] transition-transform duration-300 group-hover:scale-105"
          size={symbolSizes[size]}
        />
      </div>
      {showText && (
        <span className="relative tracking-[-0.03em] font-extrabold text-[#F4F2F7] flex items-center">
          HypeLeads
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8126C2] ml-1 mb-1 shadow-[0_0_8px_#8126C2]" />
        </span>
      )}
    </div>
  );
};
