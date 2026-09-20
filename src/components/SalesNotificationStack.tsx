import React, { useEffect, useState } from 'react';
import { BadgeDollarSign, X, ExternalLink } from 'lucide-react';

export interface SaleNotification {
  id: string;
  client: string;
  product: string;
  value: number;
  siteUrl: string;
  delaySeconds: number;
  /** How long the card stays on screen, in seconds. */
  durationSeconds: number;
}

interface SalesNotificationStackProps {
  queue: SaleNotification[];
  onFinished: () => void;
}

const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

const DEFAULT_DURATION_SECONDS = 6;

/** Stacked sale cards that appear on a delay and dismiss themselves. */
export const SalesNotificationStack: React.FC<SalesNotificationStackProps> = ({ queue, onFinished }) => {
  const [visible, setVisible] = useState<SaleNotification[]>([]);

  useEffect(() => {
    if (!queue.length) {
      setVisible([]);
      return;
    }

    const timers: number[] = [];
    let remaining = queue.length;

    queue.forEach((sale) => {
      timers.push(
        window.setTimeout(() => {
          setVisible((prev) => [...prev, sale]);

          timers.push(
            window.setTimeout(() => {
              setVisible((prev) => prev.filter((s) => s.id !== sale.id));
              remaining -= 1;
              if (remaining === 0) onFinished();
            }, Math.max(1, sale.durationSeconds || DEFAULT_DURATION_SECONDS) * 1000)
          );
        }, Math.max(0, sale.delaySeconds) * 1000)
      );
    });

    return () => timers.forEach((t) => window.clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue]);

  if (!visible.length) return null;

  return (
    <div className="fixed top-5 right-5 z-[60] flex flex-col gap-2.5 w-[300px] max-w-[calc(100vw-2.5rem)]">
      {visible.map((sale) => (
        <div
          key={sale.id}
          className="relative rounded-xl bg-slate-900 border border-[#25123A] shadow-[0_18px_45px_rgba(0,0,0,0.85)] p-3.5 animate-fadeIn"
        >


          <button
            type="button"
            onClick={() => setVisible((prev) => prev.filter((s) => s.id !== sale.id))}
            className="absolute top-2 right-2 p-1 rounded text-slate-500 hover:text-white transition-colors"
            aria-label="Fechar"
          >
            <X className="w-3 h-3" />
          </button>

          <div className="flex items-start gap-2.5">
            <div className="w-9 h-9 shrink-0 rounded-lg bg-emerald-950/70 border border-emerald-800 flex items-center justify-center">
              <BadgeDollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{sale.product || 'Nova Venda Confirmada'}</p>
              <p className="text-lg font-extrabold text-emerald-400 leading-tight">{brl(sale.value)}</p>
              {sale.client && <p className="text-[13px] text-slate-400 truncate mt-0.5">{sale.client}</p>}
              {sale.siteUrl && (
                <a
                  href={sale.siteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#B65AF0] hover:text-white mt-1 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  ver site
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
