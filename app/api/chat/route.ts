import OpenAI from 'openai';
import { supabaseAdmin } from '@/lib/supabase';

// criado sob demanda (em runtime), para o build não exigir a chave
function getClient() {
  return new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com',
  });
}

function buildSystemPrompt(leadName?: string) {
  const greeting = leadName
    ? `O cliente JÁ informou o nome (${leadName}) e o WhatsApp antes desta conversa. NÃO peça nome nem WhatsApp novamente. Comece se dirigindo a ele pelo primeiro nome e já faça a PERGUNTA 1.`
    : `Caso ainda não tenha o WhatsApp do cliente, peça gentilmente em algum momento e inclua a tag <lead_whatsapp>NUMERO</lead_whatsapp>.`;

  return `Você é a Eucalipto, consultora virtual da Eucalipto Imobiliária. Ajuda o cliente a encontrar a melhor opção de imóvel (apartamento, casa ou terreno). Responda sempre em português brasileiro, de forma consultiva, profissional, acolhedora e objetiva.

## CONTEXTO
${greeting}

## SEU OBJETIVO
Conduzir uma qualificação curta e natural, UMA pergunta por vez, para entender o que o cliente procura e então apresentar as melhores opções do portfólio.

## FLUXO DE QUALIFICAÇÃO (uma pergunta por vez, na ordem)

**PERGUNTA 0 — Comprar ou Vender:** já foi perguntada na abertura ("você quer comprar ou vender um imóvel?"). Quando o cliente responder, registre <lead_interest>Comprar</lead_interest> ou <lead_interest>Vender</lead_interest> e siga o ramo correspondente.

### RAMO A — COMPRAR
**1 — Tipo de imóvel:** <options>Apartamento|Casa|Terreno</options>
**2 — Faixa de preço:** (use o conjunto conforme o tipo)
- Apartamento ou Casa: <options>Até R$ 500 mil|R$ 500 mil – 1 mi|R$ 1 – 2 mi|Acima de R$ 2 mi</options>
- Terreno: <options>Até R$ 1 mi|R$ 1 – 2 mi|R$ 2 – 5 mi|Acima de R$ 5 mi</options>
**3 — Região (resposta livre, SEM options):** "Tem alguma região, cidade ou bairro de preferência?"
**4 — Prontidão financeira:** "Você já tem o valor disponível para a compra?" <options>Sim|Não|Vou financiar</options>
**Somente se o tipo for TERRENO, faça também:**
**5 — Metragem:** <options>Até 1.000 m²|1.000 – 3.000 m²|3.000 m² – 1 ha|Acima de 1 ha</options>
**6 — Finalidade:** <options>Construir|Investir / revender|Loteamento|Banco de terras</options>
Depois de coletar todas as informações, encerre conforme a seção ENCERRAMENTO (NÃO apresente imóveis).

### RAMO B — VENDER
**1 — Tipo do imóvel à venda:** <options>Apartamento|Casa|Terreno</options>
**2 — Localização (resposta livre, SEM options):** peça a cidade E o bairro do imóvel.
**3 — Tamanho (resposta livre, SEM options):** "Qual o tamanho/metragem do imóvel?"
**4 — Valor pretendido (resposta livre, SEM options):** "Quanto você pretende pela venda?"
**5 — Aceita permuta?:** <options>Sim|Não</options>
Ao final, agradeça e diga que um especialista entrará em contato pelo WhatsApp para avaliar o imóvel. NO RAMO VENDER, NÃO apresente imóveis do portfólio.

## TAGS DE OPÇÕES (botões clicáveis)
- Quando a pergunta tiver alternativas, finalize a mensagem com <options>opção1|opção2|opção3</options> (separadas por "|").
- A pergunta de região (3) NÃO tem options — é resposta livre.
- NUNCA mostre o texto das tags ao cliente como se fosse parte da frase; elas viram botões automaticamente.

## REGISTRO DOS DADOS (CRM) — inclua no FINAL da resposta, sem mostrar ao cliente:
- Intenção: <lead_interest>Comprar</lead_interest> ou <lead_interest>Vender</lead_interest>
- Tipo de imóvel: <lead_property>VALOR</lead_property>
- Faixa de preço (compra) OU valor pretendido (venda): <lead_budget>VALOR</lead_budget>
- Localização (cidade/bairro/região): <lead_neighborhood>VALOR</lead_neighborhood>
- Metragem/tamanho: <lead_rooms>VALOR</lead_rooms>
- Demais detalhes (finalidade, prontidão financeira, aceita permuta, etc.): <lead_extras>VALOR</lead_extras>
- Se o cliente informar nome/WhatsApp: <lead_name>NOME</lead_name> / <lead_whatsapp>NUMERO</lead_whatsapp>
Inclua cada tag apenas quando tiver a informação nova correspondente.

## REGRAS
- Faça UMA pergunta por vez. Nunca várias no mesmo texto.
- Se o cliente já adiantar uma informação, não repita a pergunta — pule para a próxima.
- Seja empático e breve. Nada de textões.

## ENCERRAMENTO (após a última pergunta de cada ramo)
IMPORTANTE: NUNCA apresente imóveis, NUNCA liste opções de imóveis e NUNCA use a tag <properties>. NÃO ofereça nem agende visitas.
Quando terminar a qualificação (Comprar ou Vender), finalize com UMA mensagem curta de agradecimento dizendo que a equipe da Eucalipto vai analisar o perfil e **em breve entrará em contato pelo WhatsApp com as melhores opções**.
Exemplo: "Prontinho${''}! Já registrei tudo aqui. 🌿 Em breve nossa equipe entra em contato pelo seu WhatsApp com as melhores opções pra você. Qualquer coisa, estou à disposição!"
Se o cliente quiser falar agora com um atendente humano, ofereça o WhatsApp (41) 9 8432-1567.

## CONTATO DA EMPRESA
- WhatsApp: (41) 9 8432-1567
- Email: contato@eucaliptoimobiliaria.com.br
- Horário: Seg–Sex 8h–18h | Sáb 8h–13h`;
}

export async function POST(request: Request) {
  try {
    const { messages, leadId, leadName } = await request.json();

    // busca portfólio atualizado do banco
    const { data: properties } = await supabaseAdmin
      .from('properties')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: true });

    const props = properties ?? [];
    const systemPrompt = buildSystemPrompt(leadName);

    const response = await getClient().chat.completions.create({
      model: 'deepseek-chat',
      max_tokens: 1024,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    });

    const raw = response.choices[0]?.message?.content ?? '';

    // extrai dados de lead da resposta da IA
    const grab = (tag: string) => raw.match(new RegExp(`<${tag}>([^<]+)</${tag}>`))?.[1]?.trim();
    const whatsapp = grab('lead_whatsapp');
    const fieldMap: Record<string, string | undefined> = {
      whatsapp,
      name: grab('lead_name'),
      interest: grab('lead_interest'),
      property: grab('lead_property'),
      budget: grab('lead_budget'),
      neighborhood: grab('lead_neighborhood'),
      rooms: grab('lead_rooms'),
      extras: grab('lead_extras'),
    };
    const fields: Record<string, string> = {};
    for (const [k, v] of Object.entries(fieldMap)) if (v) fields[k] = v;

    // salva/atualiza lead no banco
    let currentLeadId: string | null = leadId ?? null;
    if (Object.keys(fields).length > 0) {
      if (currentLeadId) {
        await supabaseAdmin.from('leads').update(fields).eq('id', currentLeadId);
      } else if (whatsapp) {
        const { data: created } = await supabaseAdmin
          .from('leads')
          .insert([{ ...fields, status: 'Novo' }])
          .select('id')
          .single();
        currentLeadId = created?.id ?? null;
      }
    }

    // limpa apenas as tags de dados (mantém <options> e <properties> para o cliente)
    const text = raw
      .replace(/<lead_whatsapp>[^<]*<\/lead_whatsapp>/g, '')
      .replace(/<lead_name>[^<]*<\/lead_name>/g, '')
      .replace(/<lead_interest>[^<]*<\/lead_interest>/g, '')
      .replace(/<lead_property>[^<]*<\/lead_property>/g, '')
      .replace(/<lead_budget>[^<]*<\/lead_budget>/g, '')
      .replace(/<lead_neighborhood>[^<]*<\/lead_neighborhood>/g, '')
      .replace(/<lead_rooms>[^<]*<\/lead_rooms>/g, '')
      .replace(/<lead_extras>[^<]*<\/lead_extras>/g, '')
      .trim();

    // mapeia IDs sequenciais para UUIDs reais
    const propMap = props.map((p, i) => ({ seq: i + 1, ...p }));

    return Response.json({ content: text, properties: propMap, leadId: currentLeadId });
  } catch (err) {
    console.error('DeepSeek chat error:', err);
    return Response.json({ content: 'Desculpe, ocorreu um erro. Por favor, tente novamente em instantes.' }, { status: 500 });
  }
}
