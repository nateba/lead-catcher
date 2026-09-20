import React from 'react';

const LAYER_COUNT = 8;
const STEP = 100 / LAYER_COUNT; // 12.5%

interface ProgressiveBlurProps {
  /** Height of the blurred strip. */
  height?: number;
  zIndex?: number;
  /**
   * Left offset, e.g. `"16rem"` to clear a fixed sidebar. Anything to the left
   * of this stays sharp — use it so the strip never covers real controls.
   */
  left?: number | string;
}

/**
 * A fixed strip at the bottom of the viewport whose blur ramps up towards the
 * bottom edge, so content dissolves as it scrolls off instead of being cut.
 *
 * Eight stacked layers each apply a doubling backdrop blur (0.25px → 32px) and
 * are masked to a narrow band, so the bands overlap into one smooth gradient.
 *
 * Everything is inline style rather than classes: `backdrop-filter` plus
 * `mask-image` with per-layer values is not something Tailwind can express, and
 * inline styles also survive any PostCSS/Tailwind purge.
 */
export const ProgressiveBlur: React.FC<ProgressiveBlurProps> = ({
  height = 200,
  zIndex = 999,
  left = 0,
}) => (
  <div
    aria-hidden="true"
    style={{
      position: 'fixed',
      bottom: 0,
      left,
      right: 0,
      height,
      zIndex,
      pointerEvents: 'none',
    }}
  >
    {Array.from({ length: LAYER_COUNT }, (_, i) => {
      const blur = 0.25 * Math.pow(2, i);

      // Band for layer i: transparent → opaque → opaque → transparent, each
      // stop one step further down. Stops past 100% are dropped, which is why
      // the last two layers stay opaque all the way to the bottom edge.
      const mask = `linear-gradient(to bottom, ${[
        `rgba(0, 0, 0, 0) ${i * STEP}%`,
        `rgba(0, 0, 0, 1) ${(i + 1) * STEP}%`,
        `rgba(0, 0, 0, 1) ${(i + 2) * STEP}%`,
        `rgba(0, 0, 0, 0) ${(i + 3) * STEP}%`,
      ]
        .filter((_stop, k) => (i + k) * STEP <= 100)
        .join(', ')})`;

      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
            maskImage: mask,
            WebkitMaskImage: mask,
          }}
        />
      );
    })}
  </div>
);

export default ProgressiveBlur;
