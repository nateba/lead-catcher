import React, { useState } from 'react';
import { Lead, GeneratedSite, ColorPalette } from '../types';
import { generateStandaloneHtml } from '../services/htmlExportService';

interface SitePreviewProps {
  lead: Lead;
  siteData: GeneratedSite;
  colors: ColorPalette;
  viewport: 'desktop' | 'tablet' | 'mobile';
}

export const SitePreview: React.FC<SitePreviewProps> = ({
  lead,
  siteData,
  colors,
  viewport,
}) => {
  const htmlContent = React.useMemo(() => {
    return generateStandaloneHtml(lead, siteData, colors);
  }, [lead, siteData, colors]);

  const viewportStyles = {
    desktop: 'w-full h-full',
    tablet: 'w-[768px] h-full shadow-2xl rounded-2xl border-4 border-slate-700',
    mobile: 'w-[375px] h-full shadow-2xl rounded-3xl border-8 border-slate-800',
  };

  return (
    <div className="w-full h-full bg-slate-900/90 dark:bg-slate-950 flex items-center justify-center p-2 sm:p-4 overflow-hidden relative">
      <div className={`transition-all duration-300 ${viewportStyles[viewport]} overflow-hidden bg-white`}>
        <iframe
          title="Site Live Preview"
          srcDoc={htmlContent}
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </div>
  );
};
