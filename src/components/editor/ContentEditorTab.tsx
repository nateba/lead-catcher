import React from 'react';
import { GeneratedSite } from '../../types';

interface ContentEditorTabProps {
  siteData: GeneratedSite;
  setSiteData: React.Dispatch<React.SetStateAction<GeneratedSite>>;
}

export const ContentEditorTab: React.FC<ContentEditorTabProps> = ({
  siteData,
  setSiteData,
}) => {
  return (
    <div className="space-y-4">
      {/* Hero Section Inputs */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Seção Principal (Hero)
        </h4>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Headline (Título de Impacto)
          </label>
          <input
            type="text"
            value={siteData.headline}
            onChange={(e) => setSiteData({ ...siteData, headline: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-medium focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Subheadline (Subtítulo Persuasivo)
          </label>
          <textarea
            rows={2}
            value={siteData.subheadline}
            onChange={(e) => setSiteData({ ...siteData, subheadline: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-medium focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Sobre Nós */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Sobre a Empresa
        </h4>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Título do Sobre
          </label>
          <input
            type="text"
            value={siteData.sobre_titulo}
            onChange={(e) => setSiteData({ ...siteData, sobre_titulo: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-medium focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Texto Institucional
          </label>
          <textarea
            rows={3}
            value={siteData.sobre_texto}
            onChange={(e) => setSiteData({ ...siteData, sobre_texto: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-medium focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Serviços */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Serviços Oferecidos (4)
        </h4>
        <div className="space-y-2.5">
          {siteData.servicos.map((srv, idx) => (
            <div key={idx} className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5">
              <input
                type="text"
                value={srv.titulo}
                onChange={(e) => {
                  const updated = [...siteData.servicos];
                  updated[idx].titulo = e.target.value;
                  setSiteData({ ...siteData, servicos: updated });
                }}
                placeholder={`Serviço ${idx + 1}`}
                className="w-full px-2.5 py-1 text-xs font-bold bg-transparent border-b border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              />
              <input
                type="text"
                value={srv.descricao}
                onChange={(e) => {
                  const updated = [...siteData.servicos];
                  updated[idx].descricao = e.target.value;
                  setSiteData({ ...siteData, servicos: updated });
                }}
                placeholder="Breve descrição..."
                className="w-full px-2.5 py-1 text-xs bg-transparent text-slate-600 dark:text-slate-400 focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Diferenciais */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Diferenciais Competitivos (3)
        </h4>
        <div className="space-y-2">
          {siteData.diferenciais.map((diff, idx) => (
            <input
              key={idx}
              type="text"
              value={diff}
              onChange={(e) => {
                const updated = [...siteData.diferenciais];
                updated[idx] = e.target.value;
                setSiteData({ ...siteData, diferenciais: updated });
              }}
              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-medium"
            />
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          FAQ - Perguntas Frequentes
        </h4>
        <div className="space-y-2.5">
          {siteData.faq.map((f, idx) => (
            <div key={idx} className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5">
              <input
                type="text"
                value={f.pergunta}
                onChange={(e) => {
                  const updated = [...siteData.faq];
                  updated[idx].pergunta = e.target.value;
                  setSiteData({ ...siteData, faq: updated });
                }}
                placeholder={`Pergunta ${idx + 1}`}
                className="w-full px-2 py-1 text-xs font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 focus:outline-none"
              />
              <textarea
                rows={2}
                value={f.resposta}
                onChange={(e) => {
                  const updated = [...siteData.faq];
                  updated[idx].resposta = e.target.value;
                  setSiteData({ ...siteData, faq: updated });
                }}
                placeholder="Resposta clara e concisa..."
                className="w-full px-2 py-1 text-xs text-slate-600 dark:text-slate-400 focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* CTA Chamada */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Chamada para Ação Final
        </h4>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Título do CTA
          </label>
          <input
            type="text"
            value={siteData.cta_titulo}
            onChange={(e) => setSiteData({ ...siteData, cta_titulo: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-medium"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Texto do CTA
          </label>
          <input
            type="text"
            value={siteData.cta_texto}
            onChange={(e) => setSiteData({ ...siteData, cta_texto: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-medium"
          />
        </div>
      </div>
    </div>
  );
};
