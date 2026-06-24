import type { MetadataRoute } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://eucaliptoimobiliaria.com.br';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: properties } = await supabaseAdmin
    .from('properties')
    .select('id, created_at')
    .eq('active', true);

  const propertyUrls: MetadataRoute.Sitemap = (properties ?? []).map((p) => ({
    url: `${BASE_URL}/imoveis/${p.id}`,
    lastModified: p.created_at ? new Date(p.created_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/terrenos`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    ...propertyUrls,
  ];
}
