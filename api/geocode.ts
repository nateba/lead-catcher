import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireUser } from './shared/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const auth = await requireUser(req, res);
  if (!auth) return;

  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Parâmetro de busca "q" obrigatório.' });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(String(q))}`;
    const response = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'LeadSiteAI/1.0 (https://leadsite.ai; contact@leadsite.ai)',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Nominatim respondeu com status ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (err: any) {
    console.error('Erro na geocodificação Nominatim:', err?.message);
    res.status(500).json({ error: 'Falha ao buscar coordenadas no Nominatim.' });
  } finally {
    clearTimeout(timeoutId);
  }
}
