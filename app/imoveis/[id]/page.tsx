import type { Metadata } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';
import PropertyGallery from '@/components/PropertyGallery';
import PropertyLeadForm from '@/components/PropertyLeadForm';
import PropertyShare from '@/components/PropertyShare';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ChatBot from '@/components/ChatBot';

const WHATSAPP = '5541995417539';

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
    return { title: 'Oportunidade não encontrada – Eucalipto Imobiliária e Construtora' };
  }

  const isLand = property.property_type === 'Terreno' || property.beds === 'Terreno';
  const title = `${property.title} – Eucalipto Imobiliária e Construtora`;
  const description = isLand
    ? `${property.title} em ${property.location} · ${property.area} · ${property.price}. Oportunidade de investimento em terreno selecionada pela Eucalipto Imobiliária e Construtora.`
    : `${property.title} em ${property.location} · ${property.price}. Conheça este imóvel na Eucalipto Imobiliária e Construtora.`;

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
      <div style={{ minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '110px 2rem 3rem' }}>
          <div style={{ textAlign: 'center', maxWidth: 420 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fff', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.8rem', color: '#C9A35B' }}>
              <i className="ri-map-pin-line"></i>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', color: '#14301E', marginBottom: '.5rem' }}>Oportunidade não encontrada</h1>
            <p style={{ color: '#666', lineHeight: 1.7, marginBottom: '1.75rem' }}>
              Esta oportunidade pode ter sido negociada ou não está mais disponível. Veja as oportunidades em aberto.
            </p>
            <Link href="/imoveis" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', background: '#C9A35B', color: '#14301E', textDecoration: 'none', padding: '.85rem 1.75rem', borderRadius: 8, fontWeight: 700 }}>
              <i className="ri-landscape-line"></i> Ver oportunidades
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isLand = property.property_type === 'Terreno' || property.beds === 'Terreno';

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

  // preço por m²
  const priceNum = parseInt((property.price ?? '').replace(/\D/g, ''), 10) || 0;
  const areaNum = parseInt((property.area ?? '').replace(/\D/g, ''), 10) || 0;
  const pricePerM2 = property.type === 'Venda' && priceNum && areaNum ? Math.round(priceNum / areaNum) : 0;

  const features: string[] = Array.isArray(property.features) ? property.features : [];

  // imóveis relacionados (mesmo tipo, exceto o atual)
  const { data: relatedData } = await supabaseAdmin
    .from('properties')
    .select('*')
    .eq('active', true)
    .neq('id', property.id)
    .limit(3);
  const related = relatedData ?? [];

  const mapsSrc = `https://www.google.com/maps?q=${encodeURIComponent(property.location ?? 'Curitiba PR')}&output=embed`;

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '110px 1.5rem 3rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#888' }}>
          <Link href="/" style={{ color: '#A9842F', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link href="/imoveis" style={{ color: '#A9842F', textDecoration: 'none' }}>Oportunidades</Link>
          <span>/</span>
          <span style={{ color: '#333', fontWeight: 600 }}>{property.title}</span>
        </div>

        <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', padding: '1.5rem' }}>
          {/* Topo: galeria + valor lado a lado */}
          <div className="prop-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '1.5rem', alignItems: 'stretch' }}>
            <div style={{ position: 'relative', height: '460px', borderRadius: '12px', overflow: 'hidden' }}>
              <PropertyGallery images={((property.images && property.images.length ? property.images : [property.img]) as string[]).filter(Boolean)} />
              <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: '#C9A35B', color: '#14301E', padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', zIndex: 10 }}>
                {isLand ? 'Oportunidade' : property.type}
              </div>
            </div>

            <div style={{ background: '#f3f6f1', padding: '2rem', borderRadius: '12px', border: '1px solid #e4ebe2', display: 'flex', flexDirection: 'column' }}>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.7rem', fontWeight: 800, color: '#14301E', marginBottom: '0.4rem', lineHeight: 1.2 }}>
                {property.title}
              </h1>
              <p style={{ fontSize: '0.95rem', color: '#666', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.75rem' }}>
                <i className="ri-map-pin-2-line" style={{ color: '#A9842F' }}></i> {property.location}
              </p>

              <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                {isLand ? 'Valor do investimento' : 'Valor'}
              </span>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 800, color: '#14301E', margin: '0.4rem 0', fontVariantNumeric: 'tabular-nums' }}>
                {property.price}
                <span style={{ fontSize: '1rem', fontWeight: 400, color: '#888', marginLeft: '0.5rem' }}>{property.price_label}</span>
              </div>
              {pricePerM2 > 0 && (
                <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem' }}>≈ R$ {pricePerM2.toLocaleString('pt-BR')}/m²</div>
              )}

              <a
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waText)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#25D366', color: '#fff', textDecoration: 'none', padding: '1rem', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', marginTop: 'auto' }}
              >
                <i className="ri-whatsapp-line" style={{ fontSize: '1.2rem' }}></i> Falar com especialista
              </a>
              <p style={{ fontSize: '0.75rem', color: '#888', textAlign: 'center', marginTop: '1rem', marginBottom: '0.85rem' }}>
                Resposta em até 5 minutos · Atendimento confidencial
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center', borderTop: '1px solid #e4ebe2', paddingTop: '0.85rem' }}>
                {['CRECI registrado', 'Documentação regularizada', 'Segurança jurídica'].map(t => (
                  <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.68rem', fontWeight: 600, color: '#2C5138', background: '#eaf1ea', padding: '0.2rem 0.5rem', borderRadius: '999px' }}>
                    <i className="ri-shield-check-line"></i> {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Specs + descrição */}
          <div style={{ padding: '1.5rem 1rem 0.5rem' }}>
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

            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700, color: '#14301E', marginBottom: '1rem' }}>
              {isLand ? 'Sobre esta oportunidade' : 'Descrição'}
            </h2>
            {property.description ? (
              <p style={{ color: '#555', lineHeight: 1.8, fontSize: '0.97rem', whiteSpace: 'pre-line' }}>
                {property.description}
              </p>
            ) : isLand ? (
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

            {features.length > 0 && (
              <div style={{ marginTop: '1.75rem' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 700, color: '#14301E', marginBottom: '0.75rem' }}>Características</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {features.map((f) => (
                    <span key={f} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#f3f6f1', color: '#2C5138', padding: '0.4rem 0.85rem', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 600 }}>
                      <i className="ri-check-line"></i> {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #eee' }}>
              <PropertyShare title={property.title} />
            </div>
          </div>
        </div>

        {/* Mapa + agendamento de visita */}
        <div className="prop-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginTop: '1.5rem', alignItems: 'start' }}>
          <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
            <div style={{ padding: '1.25rem 1.5rem 0' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: '#14301E', marginBottom: '0.25rem' }}>Localização</h2>
              <p style={{ color: '#666', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}><i className="ri-map-pin-2-line" style={{ color: '#A9842F' }}></i>{property.location}</p>
            </div>
            <iframe src={mapsSrc} width="100%" height="320" style={{ border: 0, marginTop: '0.75rem', display: 'block' }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Mapa de localização"></iframe>
          </div>
          <PropertyLeadForm propertyTitle={property.title} />
        </div>

        {/* Imóveis relacionados */}
        {related.length > 0 && (
          <div style={{ marginTop: '2.5rem' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: '#14301E', marginBottom: '1.25rem' }}>Outras oportunidades</h2>
            <div className="props-grid">
              {related.map((p) => (
                <Link href={`/imoveis/${p.id}`} key={p.id} className="prop-card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <div className="prop-img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.img} alt={p.title} />
                    <span className={`prop-badge${p.type === 'Locação' ? ' green' : ''}`}>{p.type}</span>
                  </div>
                  <div className="prop-body">
                    <div className="prop-price">{p.price} <span>{p.price_label}</span></div>
                    <div className="prop-title">{p.title}</div>
                    <div className="prop-location"><i className="ri-map-pin-2-line"></i>{p.location}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA fixa no mobile */}
      <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waText)}`} target="_blank" rel="noopener noreferrer" className="prop-mobile-cta">
        <span style={{ lineHeight: 1.2 }}><strong style={{ color: '#14301E', fontSize: '1.05rem' }}>{property.price}</strong> <span style={{ fontWeight: 400, color: '#888', fontSize: '0.8rem' }}>{property.price_label}</span></span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#25D366', color: '#fff', padding: '0.6rem 1rem', borderRadius: '8px', fontWeight: 700 }}><i className="ri-whatsapp-line"></i> Falar</span>
      </a>

      {/* SEO — dados estruturados */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: property.title,
          image: property.images?.length ? property.images : (property.img ? [property.img] : []),
          description: property.description || `${property.title} em ${property.location}`,
          offers: { '@type': 'Offer', price: priceNum || undefined, priceCurrency: 'BRL', availability: 'https://schema.org/InStock' },
        }) }}
      />

      <Footer />
      <WhatsAppButton />
      <ChatBot />
    </div>
  );
}
