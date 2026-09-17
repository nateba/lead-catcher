import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireActiveSubscription, getUserGeminiKey } from './shared/auth';
import { getGeminiClient, generateWithGeminiFallback } from './shared/gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const auth = await requireActiveSubscription(req, res);
  if (!auth) return;

  const { name, category, city } = req.body || {};

  try {
    const client = getGeminiClient(await getUserGeminiKey(auth));

    const prompt = `Gere exatamente 3 novos depoimentos para a empresa "${name}" (${category}) em ${city || 'Brasil'}.
Retorne APENAS um JSON no formato:
{
  "depoimentos": [
    {"texto": "...", "autor": "Nome I.", "estrelas": 5},
    {"texto": "...", "autor": "Nome I.", "estrelas": 5},
    {"texto": "...", "autor": "Nome I.", "estrelas": 5}
  ]
}`;

    const response = await generateWithGeminiFallback(client, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '{}';
    let parsed;
    try {
      parsed = JSON.parse(rawText.replace(/```json\n?|\n?```/g, '').trim());
    } catch (e) {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        parsed = { depoimentos: [] };
      }
    }
    return res.json({ success: true, depoimentos: parsed.depoimentos || [] });
  } catch (error: any) {
    console.warn('Erro ao regenerar depoimentos, usando fallback:', error?.message);
    return res.json({
      success: true,
      depoimentos: [
        { texto: `O atendimento da ${name} foi rápido, cordial e impecável!`, autor: 'Lucas M.', estrelas: 5 },
        { texto: `Serviço de altíssima qualidade em ${city || 'nossa região'}. Sempre recomendo!`, autor: 'Fernanda R.', estrelas: 5 },
        { texto: 'Preço justo e muita dedicação no que fazem. Ganharam um cliente fiel!', autor: 'Gabriel T.', estrelas: 5 },
      ],
    });
  }
}
