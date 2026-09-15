import React from 'react';

export const BackgroundVelvet: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Deep foundation layers */}
      <div className="absolute inset-0 bg-[#020103]" />

      {/* Official user uploaded background with 40% opacity */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'url(/background.jpg)',
        }}
      />

      {/* Velvet wine ambient lighting 1 - Top Center Hero Wash */}
      <div 
        className="absolute -top-[25vw] left-1/2 -translate-x-1/2 w-[85vw] h-[55vw] rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(90, 20, 48, 0.42) 0%, rgba(42, 13, 24, 0.22) 40%, rgba(19, 8, 13, 0.08) 70%, transparent 85%)',
          filter: 'blur(70px)',
        }}
      />

      {/* Flowing Organic Silk Wave Curve 1 (Right flank sweeping downwards) */}
      <svg 
        className="absolute top-[10vh] -right-[15vw] w-[75vw] h-[110vh] opacity-35 mix-blend-screen"
        viewBox="0 0 800 1000" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M 600 -100 C 400 200 750 500 500 800 C 350 980 200 1100 0 1200" 
          stroke="url(#wine_stream_1)" 
          strokeWidth="180" 
          strokeLinecap="round"
          filter="url(#wave_blur_large)"
        />
        <path 
          d="M 700 50 C 450 350 780 650 520 950" 
          stroke="url(#wine_stream_highlight)" 
          strokeWidth="60" 
          strokeLinecap="round"
          opacity="0.6"
          filter="url(#wave_blur_med)"
        />
        <defs>
          <linearGradient id="wine_stream_1" x1="600" y1="0" x2="200" y2="1000" gradientUnits="userSpaceOnUse">
            <stop stopColor="#36145A" stopOpacity="0.8" />
            <stop offset="0.5" stopColor="#1C0D2A" stopOpacity="0.5" />
            <stop offset="1" stopColor="#08040D" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="wine_stream_highlight" x1="700" y1="100" x2="400" y2="900" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8126C2" stopOpacity="0.5" />
            <stop offset="0.6" stopColor="#36145A" stopOpacity="0.3" />
            <stop offset="1" stopColor="#0D0813" stopOpacity="0" />
          </linearGradient>
          <filter id="wave_blur_large" x="-100" y="-100" width="1000" height="1400" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="90" />
          </filter>
          <filter id="wave_blur_med" x="-50" y="-50" width="900" height="1200" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="50" />
          </filter>
        </defs>
      </svg>

      {/* Flowing Organic Silk Wave Curve 2 (Left flank depth ribbon) */}
      <svg 
        className="absolute top-[80vh] -left-[20vw] w-[65vw] h-[120vh] opacity-25 mix-blend-screen"
        viewBox="0 0 800 1000" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M 100 0 C 350 300 50 650 300 1000" 
          stroke="url(#wine_stream_2)" 
          strokeWidth="160" 
          filter="url(#wave_blur_left)"
        />
        <defs>
          <linearGradient id="wine_stream_2" x1="100" y1="100" x2="300" y2="900" gradientUnits="userSpaceOnUse">
            <stop stopColor="#36145A" stopOpacity="0.7" />
            <stop offset="0.7" stopColor="#1C0D2A" stopOpacity="0.3" />
            <stop offset="1" stopColor="#030205" stopOpacity="0" />
          </linearGradient>
          <filter id="wave_blur_left" x="-100" y="-100" width="1000" height="1200" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="80" />
          </filter>
        </defs>
      </svg>

      {/* Mid-page Velvet Core Light (for pricing and features focus) */}
      <div 
        className="absolute top-[210vh] left-1/2 -translate-x-1/2 w-[70vw] h-[40vw] rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(90, 20, 48, 0.28) 0%, rgba(42, 13, 24, 0.14) 45%, transparent 75%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Subtle bottom conversion glow */}
      <div 
        className="absolute bottom-[-10vh] right-[10vw] w-[50vw] h-[35vw] rounded-full"
        style={{
          background: 'radial-gradient(circle at center, rgba(194, 38, 85, 0.15) 0%, rgba(90, 20, 48, 0.1) 40%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />

      {/* Velvet tactile noise grain layer */}
      <div className="absolute inset-0 bg-noise opacity-60 mix-blend-overlay pointer-events-none" />

      {/* Subtle vignette border around full viewport to emphasize center stage */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(3,1,2,0.6)_100%)] pointer-events-none" />
    </div>
  );
};
