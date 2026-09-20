import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { SITE_COLORS, findSiteColor } from '../data/siteColors';

interface ColorSelectProps {
  id?: string;
  value: string;
  onChange: (color: { name: string; hex: string }) => void;
}

export const ColorSelect: React.FC<ColorSelectProps> = ({ id, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = findSiteColor(value);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        id={id}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-slate-900 border rounded-xl text-sm font-medium text-slate-200 transition-all ${
          open ? 'border-[#8126C2] ring-2 ring-indigo-500/30' : 'border-slate-700 hover:border-slate-600'
        }`}
      >
        <span className="flex items-center gap-2.5 min-w-0">
          <span
            className="w-3.5 h-3.5 rounded-full border border-white/25 shrink-0"
            style={{ background: selected?.hex || value }}
          />
          <span className="truncate">{selected?.name || value}</span>
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-20 top-full left-0 right-0 mt-1.5 max-h-64 overflow-y-auto rounded-xl bg-[#0b0912] border border-slate-700 shadow-[0_20px_50px_rgba(0,0,0,0.8)] py-1.5">
          {SITE_COLORS.map((color) => {
            const isSelected = color.hex.toLowerCase() === value.toLowerCase();
            return (
              <button
                key={color.hex}
                type="button"
                onClick={() => {
                  onChange(color);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-sm text-slate-200 hover:bg-slate-800/70 transition-colors"
              >
                <span className="w-4 shrink-0">
                  {isSelected && <Check className="w-3.5 h-3.5 text-slate-300" />}
                </span>
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/25 shrink-0"
                  style={{ background: color.hex }}
                />
                <span className="truncate">{color.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
