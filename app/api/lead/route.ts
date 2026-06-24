import { supabaseAdmin } from '@/lib/supabase';

// Cria o lead assim que a pessoa informa nome + WhatsApp (antes da conversa),
// garantindo a captura mesmo que ela não conclua a qualificação.
export async function POST(request: Request) {
  try {
    const { name, whatsapp, interest } = await request.json();

    if (!whatsapp || !String(whatsapp).trim()) {
      return Response.json({ error: 'WhatsApp é obrigatório.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert([
        {
          name: name?.trim() || null,
          whatsapp: String(whatsapp).trim(),
          interest: interest?.trim() || 'Comprar',
          status: 'Novo',
        },
      ])
      .select('id')
      .single();

    if (error) throw error;

    return Response.json({ leadId: data.id });
  } catch (err) {
    console.error('Erro ao criar lead:', err);
    return Response.json({ error: 'Não foi possível registrar o contato.' }, { status: 500 });
  }
}
