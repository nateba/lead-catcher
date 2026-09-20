export interface SiteColor {
  name: string;
  hex: string;
}

// Named palette offered when defining a generated site's identity.
export const SITE_COLORS: SiteColor[] = [
  { name: 'Vermelho Pepperoni', hex: '#E63946' },
  { name: 'Azul Oceano', hex: '#0EA5E9' },
  { name: 'Verde Folha', hex: '#22C55E' },
  { name: 'Roxo Profundo', hex: '#7C3AED' },
  { name: 'Laranja Queimado', hex: '#EA580C' },
  { name: 'Preto Elegante', hex: '#1A1A2E' },
  { name: 'Branco Gelo', hex: '#F8FAFC' },
  { name: 'Dourado Premium', hex: '#D4AF37' },
  { name: 'Rosa Quartzo', hex: '#F472B6' },
  { name: 'Azul Marinho', hex: '#1E3A8A' },
  { name: 'Verde Esmeralda', hex: '#10B981' },
  { name: 'Cinza Grafite', hex: '#4B5563' },
];

export function findSiteColor(hex: string): SiteColor | undefined {
  return SITE_COLORS.find((c) => c.hex.toLowerCase() === hex.toLowerCase());
}
