import React from 'react';
import { Sparkles, Clock } from 'lucide-react';
import { OFFER } from '../data/offer';

interface OfferBadgesProps {
  /** `compact` for the in-app paywall card, `full` for the landing plan cards. */
  size?: 'full' | 'compact';
  className?: string;
}

/**
 * The two urgency lines that sit above the price: why it is discounted, and how
 * long for.
 *
 * Red on purpose. The brand is violet, so urgency has to read as a different
 * kind of message or it blends into the card it is sitting on.
 */
export const OfferBadges: React.FC<OfferBadgesProps> = ({ size = 'full', className = '' }) => {
  const pad = size === 'compact' ? 'px-2.5 py-1.5' : 'px-4 py-2';
  const text = size === 'compact' ? 'text-[10px]' : 'text-[11px]';
  const icon = size === 'compact' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div
        className={`flex items-center justify-center gap-1.5 rounded-full bg-[#2E0A10] border border-[#7F1D2B] ${pad}`}
      >
        <Sparkles className={`${icon} shrink-0 text-[#FF6B6B]`} />
        <span className={`${text} font-extrabold uppercase tracking-wide text-[#FF6B6B] leading-tight text-center`}>
          {OFFER.campaign}
        </span>
      </div>

      <div
        className={`flex items-center justify-center gap-1.5 rounded-full bg-[#240810] border border-[#5E1622] ${pad}`}
      >
        <Clock className={`${icon} shrink-0 text-[#E05260]`} />
        <span className={`${text} font-bold uppercase tracking-wide text-[#E05260] leading-tight text-center`}>
          {OFFER.window}
        </span>
      </div>
    </div>
  );
};

export default OfferBadges;
