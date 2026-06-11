import { supabaseAdmin } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import PropertyGallery from '@/components/PropertyGallery';

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: property, error } = await supabaseAdmin
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !property) {
    return <div style={{ padding: '2rem' }}><h1>Erro ao carregar imóvel</h1><pre>{JSON.stringify(error || 'Imóvel não encontrado no banco', null, 2)}</pre></div>;
  }

  const images = [
    property.img,
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
    "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=600&q=80",
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80"
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', 'Poppins', sans-serif" }}>
      {/* Navbar Simple */}
      <nav style={{ background: '#1A2E49', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#fff', fontWeight: 700, fontSize: '1.2rem' }}>
          <div style={{ width: 32, height: 32, background: '#D9A441', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="ri-building-4-line" style={{ fontSize: '1rem', color: '#1A2E49' }}></i>
          </div>
          Vértice Imóveis
        </Link>
        <Link href="/#imoveis" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
          Voltar para Home
        </Link>
      </nav>

      {/* Hero Property */}
      <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#888' }}>
          <Link href="/" style={{ color: '#D9A441', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <span>Imóveis</span>
          <span>/</span>
          <span style={{ color: '#333', fontWeight: 600 }}>{property.title}</span>
        </div>

        <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
          <div style={{ height: '50vh', minHeight: '400px', position: 'relative' }}>
            <PropertyGallery images={images} />
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: property.type === 'Venda' ? '#D9A441' : '#22c55e', color: property.type === 'Venda' ? '#1A2E49' : '#fff', padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', zIndex: 10 }}>
              {property.type}
            </div>
          </div>
          
          <div style={{ padding: '3rem 2.5rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem', alignItems: 'start' }}>
            <div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1A2E49', marginBottom: '0.5rem', lineHeight: 1.2 }}>
                {property.title}
              </h1>
              <p style={{ fontSize: '1.1rem', color: '#666', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2rem' }}>
                <i className="ri-map-pin-2-line" style={{ color: '#D9A441' }}></i> {property.location}
              </p>

              <div style={{ display: 'flex', gap: '2rem', padding: '1.5rem 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f8f9fb', color: '#D9A441', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                    <i className="ri-hotel-bed-line"></i>
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1.1rem', color: '#1A2E49' }}>{property.beds}</strong>
                    <span style={{ fontSize: '0.8rem', color: '#888' }}>Dormitórios</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f8f9fb', color: '#D9A441', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                    <i className="ri-bath-line"></i>
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1.1rem', color: '#1A2E49' }}>{property.baths}</strong>
                    <span style={{ fontSize: '0.8rem', color: '#888' }}>Banheiros</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f8f9fb', color: '#D9A441', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                    <i className="ri-expand-line"></i>
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1.1rem', color: '#1A2E49' }}>{property.area}</strong>
                    <span style={{ fontSize: '0.8rem', color: '#888' }}>Área Útil</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A2E49', marginBottom: '1rem' }}>Descrição</h3>
                <p style={{ color: '#555', lineHeight: 1.8, fontSize: '0.95rem' }}>
                  Excelente oportunidade na região de {property.location}. Este imóvel conta com {property.beds}, {property.baths} e uma área total de {property.area}.
                  Com um acabamento impecável e ótima iluminação natural, é o espaço ideal para você e sua família viverem com muito conforto e qualidade de vida.
                </p>
                <p style={{ color: '#555', lineHeight: 1.8, fontSize: '0.95rem', marginTop: '1rem' }}>
                  Agende agora mesmo uma visita com um de nossos corretores especialistas e venha conhecer o seu novo endereço!
                </p>
              </div>
            </div>

            <div style={{ background: '#f8f9fb', padding: '2rem', borderRadius: '12px', border: '1px solid #eee' }}>
              <span style={{ fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Valor</span>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1A2E49', margin: '0.5rem 0' }}>
                {property.price}
                <span style={{ fontSize: '1rem', fontWeight: 400, color: '#888', marginLeft: '0.5rem' }}>{property.price_label}</span>
              </div>
              
              <a 
                href={`https://wa.me/5541984321567?text=Olá! Gostaria de agendar uma visita e saber mais sobre o imóvel: ${encodeURIComponent(property.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#25D366', color: '#fff', textDecoration: 'none', padding: '1rem', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', marginTop: '2rem', transition: 'opacity 0.2s' }}
              >
                <i className="ri-whatsapp-line" style={{ fontSize: '1.2rem' }}></i> Falar com Corretor
              </a>
              <p style={{ fontSize: '0.75rem', color: '#888', textAlign: 'center', marginTop: '1rem' }}>
                Resposta em até 5 minutos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
