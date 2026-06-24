import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Inicialização preguiçosa: o client só é criado no primeiro uso (em runtime),
// não no carregamento do módulo. Assim o build (coleta de dados) não quebra
// quando as variáveis de ambiente ainda não estão presentes.
function makeClient(useService: boolean): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error('Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL.');
  }
  const key = (useService ? service : anon) ?? anon;
  if (!key) {
    throw new Error('Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }
  return createClient(url, key);
}

function lazyClient(useService: boolean): SupabaseClient {
  let instance: SupabaseClient | null = null;
  return new Proxy({} as SupabaseClient, {
    get(_target, prop) {
      if (!instance) instance = makeClient(useService);
      const value = (instance as unknown as Record<string | symbol, unknown>)[prop];
      return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(instance) : value;
    },
  });
}

export const supabase = lazyClient(false);
// client com service_role para o admin (bypass RLS); cai no anon se a chave não existir
export const supabaseAdmin = lazyClient(true);
