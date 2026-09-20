import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireUser } from './shared/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const auth = await requireUser(req, res);
  if (!auth) return;

  const {
    query,
    servers = [
      'https://overpass-api.de/api/interpreter',
      'https://overpass.kumi.systems/api/interpreter',
      'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
      'https://overpass.openstreetmap.ru/cgi/interpreter',
    ],
  } = req.body || {};

  if (!query) {
    return res.status(400).json({ error: 'Query Overpass QL não fornecida.' });
  }

  let lastError: any = null;
  for (let i = 0; i < servers.length; i++) {
    const serverUrl = servers[i];
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'User-Agent': 'LeadSiteAI/1.0 (https://leadsite.ai - Free Business Prospecting Tool)',
        },
        body: `data=${encodeURIComponent(query)}`,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Servidor Overpass (${serverUrl}) respondeu com status ${response.status}`);
      }

      const data = await response.json();
      return res.json({ success: true, serverUsed: serverUrl, data });
    } catch (err: any) {
      console.warn(`[Proxy Attempt ${i + 1}/${servers.length}] falhou em ${serverUrl}:`, err?.message);
      lastError = err;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return res.status(502).json({
    success: false,
    error: `Todos os servidores Overpass falharam ou expiraram: ${lastError?.message || 'Timeout'}`,
  });
}
