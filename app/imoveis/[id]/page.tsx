import type { Metadata } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';
import PropertyGallery from '@/components/PropertyGallery';

const WHATSAPP = '5541984321567';

async function getProperty(id: string) {
  const { data } = await supabaseAdmin
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    return { title: 'Oportunidade não encontrada – Eucalipto Imobiliária' };
  }

  const isLand = property.beds === 'Terreno';
  const title = `${property.title} – Eucalipto Imobiliária`;
  const description = isLand
    ? `${property.title} em ${property.location} · ${property.area} · ${property.price}. Oportunidade de investimento em terreno selecionada pela Eucalipto Imobiliária.`
    : `${property.title} em ${property.location} · ${property.price}. Conheça este imóvel na Eucalipto Imobiliária.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: property.img ? [{ url: property.img, alt: property.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: property.img ? [property.img] : [],
    },
  };
}

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif", padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fff', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.8rem', color: '#C9A35B' }}>
            <i className="ri-map-pin-line"></i>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', color: '#14301E', marginBottom: '.5rem' }}>Oportunidade não encontrada</h1>
          <p style={{ color: '#666', lineHeight: 1.7, marginBottom: '1.75rem' }}>
            Esta oportunidade pode ter sido negociada ou não está mais disponível. Veja as oportunidades em aberto.
          </p>
          <Link href="/terrenos" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', background: '#C9A35B', color: '#14301E', textDecoration: 'none', padding: '.85rem 1.75rem', borderRadius: 8, fontWeight: 700 }}>
            <i className="ri-landscape-line"></i> Ver oportunidades
          </Link>
        </div>
      </div>
    );
  }

  const isLand = property.beds === 'Terreno';

  const specs = isLand
    ? [
        { icon: 'ri-ruler-2-line', value: property.area, label: 'Metragem' },
        { icon: 'ri-shape-line', value: property.baths || 'Lote/Área', label: 'Tipo de uso' },
        { icon: 'ri-map-pin-2-line', value: property.location, label: 'Localização' },
      ]
    : [
        { icon: 'ri-hotel-bed-line', value: property.beds, label: 'Dormitórios' },
        { icon: 'ri-bath-line', value: property.baths, label: 'Banheiros' },
        { icon: 'ri-expand-line', value: property.area, label: 'Área Útil' },
      ];

  const waText = isLand
    ? `Olá! Tenho interesse em investir neste terreno: ${property.title} (${property.location}). Podemos conversar?`
    : `Olá! Gostaria de saber mais sobre o imóvel: ${property.title}.`;

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <nav style={{ background: '#14301E', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#fff', fontWeight: 700, fontSize: '1.2rem', fontFamily: "'Cinzel', serif", letterSpacing: '1px' }}>
          <div style={{ width: 32, height: 32, background: '#C9A35B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="ri-landscape-line" style={{ fontSize: '1rem', color: '#14301E' }}></i>
          </div>
          Eucalipto
        </Link>
        <Link href="/terrenos" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
          ← Ver oportunidades
        </Link>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#888' }}>
          <Link href="/" style={{ color: '#A9842F', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link href="/terrenos" style={{ color: '#A9842F', textDecoration: 'none' }}>Oportunidades</Link>
          <span>/</span>
          <span style={{ color: '#333', fontWeight: 600 }}>{property.title}</span>
        </div>

        <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
          <div style={{ height: '50vh', minHeight: '400px', position: 'relative' }}>
            <PropertyGallery images={[property.img].filter(Boolean)} />
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: '#C9A35B', color: '#14301E', padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', zIndex: 10 }}>
              {isLand ? 'Oportunidade' : property.type}
            </div>
          </div>

          <div style={{ padding: '3rem 2.5rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem', alignItems: 'start' }} className="prop-detail-grid">
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 800, color: '#14301E', marginBottom: '0.5rem', lineHeight: 1.2 }}>
                {property.title}
              </h1>
              <p style={{ fontSize: '1.1rem', color: '#666', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2rem' }}>
                <i className="ri-map-pin-2-line" style={{ color: '#A9842F' }}></i> {property.location}
              </p>

              <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', padding: '1.5rem 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', marginBottom: '2rem' }}>
                {specs.map((s) => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f3f6f1', color: '#2C5138', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                      <i className={s.icon}></i>
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '1.05rem', color: '#14301E' }}>{s.value}</strong>
                      <span style={{ fontSize: '0.8rem', color: '#888' }}>{s.label}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700, color: '#14301E', marginBottom: '1rem' }}>
                  {isLand ? 'Sobre esta oportunidade' : 'Descrição'}
                </h2>
                {isLand ? (
                  <>
                    <p style={{ color: '#555', lineHeight: 1.8, fontSize: '0.97rem' }}>
                      Terreno de {property.area} em {property.location}, selecionado pela curadoria da Eucalipto por
                      reunir localização estratégica e forte potencial de valorização. Uma oportunidade sólida para
                      compor um banco de terras, desenvolver um empreendimento ou diversificar seu portfólio.
                    </p>
                    <p style={{ color: '#555', lineHeight: 1.8, fontSize: '0.97rem', marginTop: '1rem' }}>
                      Nosso time conduz toda a due diligence documental e acompanha o investidor da análise ao registro
                      da escritura, com total segurança jurídica. Fale com um especialista para receber o estudo completo.
                    </p>
                  </>
                ) : (
                  <p style={{ color: '#555', lineHeight: 1.8, fontSize: '0.97rem' }}>
                    Excelente oportunidade em {property.location}. Fale com um de nossos especialistas para conhecer
                    todos os detalhes e agendar uma visita.
                  </p>
                )}
              </div>
            </div>

            <div style={{ background: '#f3f6f1', padding: '2rem', borderRadius: '12px', border: '1px solid #e4ebe2', position: 'sticky', top: '1.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                {isLand ? 'Valor do investimento' : 'Valor'}
              </span>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.4rem', fontWeight: 800, color: '#14301E', margin: '0.5rem 0', fontVariantNumeric: 'tabular-nums' }}>
                {property.price}
                <span style={{ fontSize: '1rem', fontWeight: 400, color: '#888', marginLeft: '0.5rem' }}>{property.price_label}</span>
              </div>

              <a
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waText)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#25D366', color: '#fff', textDecoration: 'none', padding: '1rem', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', marginTop: '1.75rem' }}
              >
                <i className="ri-whatsapp-line" style={{ fontSize: '1.2rem' }}></i> Falar com especialista
              </a>
              <p style={{ fontSize: '0.75rem', color: '#888', textAlign: 'center', marginTop: '1rem' }}>
                Resposta em até 5 minutos · Atendimento confidencial
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
