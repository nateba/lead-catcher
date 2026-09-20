import React, { useEffect, useRef, useState } from 'react';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none';

interface ScrollRevealProps {
  children: React.ReactNode;
  /** Where the element travels *from*. `left` enters from the left edge. */
  direction?: RevealDirection;
  /** Stagger, in ms. */
  delay?: number;
  duration?: number;
  distance?: string;
  /** Applied to the wrapper — pass grid classes (col-span/row-span) here. */
  className?: string;
  /** Reveal once and stop observing. Set false to re-animate on every pass. */
  once?: boolean;
  threshold?: number;
}

const EASE = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';

function hiddenTransform(direction: RevealDirection, distance: string): string {
  switch (direction) {
    case 'up':
      return `translate3d(0, ${distance}, 0)`;
    case 'down':
      return `translate3d(0, -${distance}, 0)`;
    case 'left':
      return `translate3d(-${distance}, 0, 0)`;
    case 'right':
      return `translate3d(${distance}, 0, 0)`;
    default:
      return 'none';
  }
}

/**
 * Fades and slides its children in when they scroll into view, using the native
 * IntersectionObserver — no animation library.
 *
 * Styling is inline on purpose: these elements are wrapped around Tailwind
 * components and a class-based approach would collide with their utilities.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 700,
  distance = '40px',
  className,
  once = true,
  threshold = 0.15,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(query.matches);
    const onChange = () => setPrefersReducedMotion(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Without the observer the content would stay at opacity 0 forever, so fail open.
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];

        // The threshold alone strands anything in the last ~58px of the
        // document: the -50px root margin eats most of it, the ratio never
        // reaches `threshold`, and there is no scroll left to fix that. So also
        // reveal once the element sits fully above the viewport bottom.
        const scrolledPast = entry.boundingClientRect.bottom <= window.innerHeight;
        const reveal = entry.intersectionRatio >= threshold || (entry.isIntersecting && scrolledPast);

        if (reveal) {
          setIsVisible(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      // Negative bottom margin fires the reveal slightly before the element is
      // fully in view, so it is already settling by the time you look at it.
      { threshold: [0, threshold], rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold]);

  const shown = isVisible || prefersReducedMotion;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : hiddenTransform(direction, distance),
        transition: prefersReducedMotion
          ? undefined
          : `opacity ${duration}ms ${EASE} ${delay}ms, transform ${duration}ms ${EASE} ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
