import React, { useEffect, useRef, useState } from 'react';

export const BOOT_LINES = [
  '$ initializing axionfly engine...',
  '→ loading neural prompt model v3.2',
  '✓ context window: 128k tokens ready',
  "import { AxionAI } from '@axionfly/core';",
  "const project = new AxionAI({ tier: 'pro' });",
  '→ analyzing niche keywords...',
  '→ optimizing conversion structure...',
  '✓ landing sections: hero, features, cta',
  '→ generating responsive layout grid...',
  '→ injecting framer-motion animations...',
  '✓ tailwind tokens compiled',
];

const LINE_DELAY = 560;
const FINISH_DELAY = 1200;

interface PromptTerminalProps {
  lines?: string[];
  title?: string;
  onDone: () => void;
}

/** Fake build log that plays while a prompt is assembled. */
export const PromptTerminal: React.FC<PromptTerminalProps> = ({
  lines = BOOT_LINES,
  title = 'axionfly-engine — generating',
  onDone,
}) => {
  const [visible, setVisible] = useState(0);
  const timers = useRef<number[]>([]);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    timers.current = lines.map((_, i) =>
      window.setTimeout(() => {
        setVisible(i + 1);
        if (i === lines.length - 1) {
          timers.current.push(window.setTimeout(() => doneRef.current(), FINISH_DELAY));
        }
      }, LINE_DELAY * (i + 1))
    );

    return () => timers.current.forEach((t) => window.clearTimeout(t));
  }, [lines]);

  const progress = Math.round((visible / lines.length) * 100);

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-white">Compilando...</p>
          <p className="text-[13px] text-slate-400">Analisando nicho e estrutura</p>
        </div>
        <div className="text-right">
          <span className="text-lg font-extrabold text-[#B65AF0]">{progress}%</span>
          <p className="text-[12px] uppercase tracking-wide text-slate-500">Processando</p>
        </div>
      </div>

      <div className="h-1 w-full rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#8126C2] to-[#B65AF0] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="rounded-xl bg-[#05040a] border border-slate-800 overflow-hidden">
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-[12px] font-mono text-slate-500">{title}</span>
        </div>
        <div className="p-3.5 font-mono text-[13px] leading-relaxed min-h-[210px]">
          {lines.slice(0, visible).map((line, i) => (
            <div
              key={i}
              className={
                line.startsWith('✓')
                  ? 'text-emerald-400'
                  : line.startsWith('→')
                  ? 'text-[#B65AF0]'
                  : line.startsWith('$')
                  ? 'text-slate-300'
                  : 'text-sky-300'
              }
            >
              <span className="text-slate-500 mr-1.5">&gt;</span>
              {line}
            </div>
          ))}
          <span className="inline-block w-2 h-3.5 bg-[#B65AF0] animate-pulse" />
        </div>
      </div>
    </div>
  );
};
