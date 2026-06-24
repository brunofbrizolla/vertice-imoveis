import type { MetadataRoute } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://eucaliptoimobiliaria.com.br';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let propertyUrls: MetadataRoute.Sitemap = [];
  try {
    const { data: properties } = await supabaseAdmin
      .from('properties')
      .select('id, created_at')
      .eq('active', true);

    propertyUrls = (properties ?? []).map((p) => ({
      url: `${BASE_URL}/imoveis/${p.id}`,
      lastModified: p.created_at ? new Date(p.created_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch {
    // sem banco disponível no build: gera apenas as URLs estáticas
  }

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/terrenos`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    ...propertyUrls,
  ];
}
