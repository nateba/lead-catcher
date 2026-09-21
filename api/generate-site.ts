import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireActiveSubscription, getUserGeminiKey } from './_shared/auth.js';
import { getGeminiClient, generateWithGeminiFallback, generateSmartFallbackSite } from './_shared/gemini.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const auth = await requireActiveSubscription(req, res);
  if (!auth) return;

  const {
    name,
    category,
    city,
    state,
    address,
    phone,
    opening_hours,
    customInstructions,
  } = req.body || {};

  if (!name || !category) {
    return res.status(400).json({ error: 'Nome e categoria da empresa são obrigatórios.' });
  }

  try {
    const client = getGeminiClient(await getUserGeminiKey(auth));

    const prompt = `Você é um redator publicitário e estrategista de marca sênior especializado em pequenos negócios locais brasileiros.

Dados reais da empresa (extraídos do OpenStreetMap, podem estar incompletos):
- Nome: ${name}
- Categoria: ${category}
- Cidade/Estado: ${city || 'Brasil'}, ${state || ''}
- Endereço: ${address || 'não informado'}
- Telefone: ${phone || 'não informado'}
- Horário de funcionamento: ${opening_hours || 'não informado'}
${customInstructions ? `- Instruções adicionais do usuário: ${customInstructions}` : ''}

Gere o conteúdo completo para uma landing page profissional, autêntica e altamente persuasiva desta empresa. Retorne APENAS um objeto JSON válido (sem blocos de markdown adicionais, sem texto antes ou depois), com esta estrutura exata:

{
  "estilo_visual": "MODERN | PREMIUM | LOCAL | MINIMAL | BOLD",
  "paleta_sugerida": {
    "primaria": "#hexcode coerente com a categoria do negócio",
    "secundaria": "#hexcode complementar",
    "texto_sobre_primaria": "#ffffff ou #000000 conforme contraste"
  },
  "headline": "frase de impacto, máximo 8 palavras, conectada ao serviço e cidade",
  "subheadline": "complemento atraente e claro, máximo 18 palavras",
  "sobre_titulo": "título curto da seção sobre a empresa",
  "sobre_texto": "3-4 frases sobre a proposta de valor e atendimento da empresa, tom acolhedor e profissional, mencionando a cidade de forma natural",
  "servicos": [
    {
      "titulo": "Nome do serviço 1",
      "descricao": "Descrição clara do benefício do serviço para o cliente",
      "icone_sugerido": "scissors | sparkles | heart | wrench | shield | coffee | star | clock | check-circle | smile | map-pin | phone"
    },
    {
      "titulo": "Nome do serviço 2",
      "descricao": "Descrição clara do benefício do serviço",
      "icone_sugerido": "sparkles"
    },
    {
      "titulo": "Nome do serviço 3",
      "descricao": "Descrição clara do benefício do serviço",
      "icone_sugerido": "shield"
    },
    {
      "titulo": "Nome do serviço 4",
      "descricao": "Descrição clara do benefício do serviço",
      "icone_sugerido": "clock"
    }
  ],
  "diferenciais": [
    "diferencial objetivo e realista 1",
    "diferencial objetivo e realista 2",
    "diferencial objetivo e realista 3"
  ],
  "depoimentos": [
    {
      "texto": "Exemplo demonstrativo de depoimento de cliente satisfeito com o atendimento",
      "autor": "Cliente Local",
      "estrelas": 5
    },
    {
      "texto": "Exemplo demonstrativo elogiando a pontualidade e comunicação",
      "autor": "Morador da Região",
      "estrelas": 5
    },
    {
      "texto": "Exemplo demonstrativo sobre facilidade de contato",
      "autor": "Consumidor",
      "estrelas": 5
    }
  ],
  "faq": [
    {
      "pergunta": "pergunta comum e prática sobre esse tipo de serviço",
      "resposta": "resposta clara, útil e sem promessas mirabolantes"
    },
    {
      "pergunta": "pergunta comum 2",
      "resposta": "resposta clara e útil"
    },
    {
      "pergunta": "pergunta comum 3",
      "resposta": "resposta clara e útil"
    }
  ],
  "cta_titulo": "chamada final clara para contato",
  "cta_texto": "1-2 frases convidando para conversar pelo WhatsApp ou telefone",
  "meta_descricao_seo": "descrição de até 155 caracteres para SEO com palavras-chave locais",
  "palavras_chave_seo": "4-6 palavras chave separadas por vírgula",
  "mensagem_abordagem_whatsapp": "Texto pronto e profissional de abordagem comercial para enviar no WhatsApp do dono da empresa oferecendo a landing page de amostra grátis"
}

REGRAS DE OURO OBRIGATÓRIAS:
1. NUNCA INVENTE FATOS: Não invente anos de fundação (ex: 'fundada em 2010', 'há 20 anos no mercado'), número de clientes atendidos, prêmios ou certificações não informadas, parcerias falsas, nem dados de endereço ou telefone não fornecidos.
2. Seja autêntico e focado em benefícios reais do nicho para o cliente final.
3. Escolha o "estilo_visual" mais adequado ao nicho: Barbearia/Advocacia -> PREMIUM ou BOLD; Clínicas/Saúde -> MINIMAL ou MODERN; Restaurante/Pet -> LOCAL ou MODERN; Climatização/Oficina -> MODERN ou BOLD.
4. Escreva em Português do Brasil de alto padrão com tom acolhedor e comercial.`;

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
        throw new Error('Falha ao processar o formato retornado pela IA.');
      }
    }

    return res.json({
      success: true,
      data: parsed,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.warn('Erro ao chamar Gemini, acionando fallback inteligente:', error?.message);

    const fallbackData = generateSmartFallbackSite({
      name,
      category,
      city,
      state,
      address,
      phone,
      opening_hours,
    });

    return res.json({
      success: true,
      data: fallbackData,
      isFallback: true,
      fallbackReason: error?.message || 'Serviço de IA temporariamente indisponível',
      generatedAt: new Date().toISOString(),
    });
  }
}
