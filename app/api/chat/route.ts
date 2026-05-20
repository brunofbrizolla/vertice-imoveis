import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

const PROPERTIES = [
  { id: 1, title: 'Apartamento Alto Padrão no Batel', price: 'R$ 850.000', priceLabel: '/ à vista', type: 'Venda', location: 'Batel – PR', beds: '3 quartos', baths: '2 banheiros', area: '120m²', img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80' },
  { id: 2, title: 'Casa Moderna com Piscina', price: 'R$ 4.500', priceLabel: '/ mês', type: 'Locação', location: 'Água Verde – PR', beds: '4 quartos', baths: '3 banheiros', area: '280m²', img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80' },
  { id: 3, title: 'Cobertura Duplex com Vista Panorâmica', price: 'R$ 1.350.000', priceLabel: '/ à vista', type: 'Venda', location: 'Centro – PR', beds: '4 quartos', baths: '4 banheiros', area: '320m²', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80' },
  { id: 4, title: 'Apartamento Compacto no Bigorrilho', price: 'R$ 480.000', priceLabel: '/ à vista', type: 'Venda', location: 'Bigorrilho – PR', beds: '2 quartos', baths: '2 banheiros', area: '75m²', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80' },
  { id: 5, title: 'Sala Comercial Prime no Centro', price: 'R$ 8.000', priceLabel: '/ mês', type: 'Locação', location: 'Centro – PR', beds: 'Comercial', baths: '2 banheiros', area: '180m²', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80' },
  { id: 6, title: 'Casa Residencial nas Mercês', price: 'R$ 720.000', priceLabel: '/ à vista', type: 'Venda', location: 'Mercês – PR', beds: '3 quartos', baths: '3 banheiros', area: '210m²', img: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=600&q=80' },
];

const SYSTEM_PROMPT = `Você é a Vértice, corretora virtual da Vértice Imóveis — imobiliária em Curitiba/PR com mais de 10 anos de experiência. Responda sempre em português brasileiro, de forma calorosa, profissional e empática.

## SEU OBJETIVO
Entender profundamente o que o cliente precisa antes de oferecer qualquer imóvel. Você deve conduzir uma conversa consultiva, como uma corretora experiente faria.

## FLUXO DE QUALIFICAÇÃO
Siga esta sequência fazendo UMA pergunta por vez, de forma natural e conversacional:

1. **Objetivo** — Pergunte se é para comprar, alugar ou se quer vender/avaliar um imóvel.
2. **Tipo de imóvel** — Residencial (apartamento, casa, cobertura) ou comercial (sala, loja)?
3. **Orçamento** — Qual o valor disponível (para compra: à vista ou financiado? Para locação: valor máximo mensal)?
4. **Número de quartos** — Quantos quartos são necessários? Tem filhos, home office?
5. **Bairro/região** — Tem preferência de localização em Curitiba? Perto de escola, trabalho, etc.?
6. **Necessidades especiais** — Piscina, garagem, área gourmet, pet-friendly, acessibilidade?

## REGRAS IMPORTANTES
- Faça **UMA pergunta por vez**. Nunca faça múltiplas perguntas no mesmo texto.
- Quando o cliente já der informação espontaneamente, não repita a pergunta — avance para o próximo ponto.
- Só apresente imóveis quando tiver coletado pelo menos **3 informações relevantes** (objetivo + orçamento + tipo/quartos).
- Se o cliente pedir para ver imóveis logo, mostre os mais adequados com base no que já sabe, e continue qualificando.
- Seja empático: se o cliente mencionar uma situação de vida (divórcio, mudança de cidade, crescimento da família), reconheça antes de perguntar.
- Se o cliente estiver fora do orçamento para o que quer, seja honesto e ofereça alternativas próximas.

## PORTFÓLIO DISPONÍVEL
${JSON.stringify(PROPERTIES, null, 2)}

## APRESENTAÇÃO DE IMÓVEIS
Quando for mostrar imóveis, inclua NO FINAL da resposta (após o texto):
<properties>[1, 3]</properties>
Use os IDs dos imóveis mais adequados ao perfil do cliente (máximo 3 por vez).
Após mostrar, pergunte o que acharam e se querem agendar uma visita.

## CONTATO DA EMPRESA
- Endereço: Av. do Batel, 1400 – Batel – Curitiba/PR
- WhatsApp: (41) 9 8432-1567
- Email: contato@verticeimoveis.com.br
- Horário: Seg–Sex 8h–18h | Sáb 8h–13h

## ENCERRAMENTO
Se o cliente quiser falar com um corretor humano, ofereça o WhatsApp acima. Se quiser agendar visita, peça nome, melhor horário e confirme pelo WhatsApp.`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      max_tokens: 1024,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
    });

    const text = response.choices[0]?.message?.content ?? '';
    return Response.json({ content: text });
  } catch (err) {
    console.error('DeepSeek chat error:', err);
    return Response.json({ content: 'Desculpe, ocorreu um erro. Por favor, tente novamente em instantes.' }, { status: 500 });
  }
}
