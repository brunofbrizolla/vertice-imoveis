import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';

export default async function Properties() {
    const { data: properties } = await supabaseAdmin
        .from('properties')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(6);

    return (
        <section className="properties" id="imoveis">
            <div className="properties-inner">
                <div className="props-header">
                    <div>
                        <div className="section-tag"><i className="ri-landscape-line"></i> Curadoria Eucalipto</div>
                        <p className="section-title">Oportunidades em Destaque</p>
                        <p className="section-sub">Terrenos selecionados com forte potencial de valorização.</p>
                    </div>
                    <Link className="view-all" href="/imoveis">Ver todas as oportunidades <i className="ri-arrow-right-line"></i></Link>
                </div>
                <div className="props-grid">
                    {properties?.map((p) => (
                        <Link href={`/imoveis/${p.id}`} className="prop-card" key={p.id} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                            <div className="prop-img">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={p.img} alt={p.title} />
                                <span className={`prop-badge${p.type === 'Locação' ? " green" : ""}`}>{p.type}</span>
                                {p.property_type && (
                                    <span style={{ position: 'absolute', top: '2.6rem', left: '.75rem', background: 'rgba(20,48,30,.92)', color: '#fff', padding: '.25rem .7rem', borderRadius: '6px', fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px' }}>{p.property_type}</span>
                                )}
                                <div className="prop-fav"><i className="ri-heart-line"></i></div>
                            </div>
                            <div className="prop-body">
                                <div className="prop-price">{p.price} <span>{p.price_label}</span></div>
                                <div className="prop-title">{p.title}</div>
                                <div className="prop-location"><i className="ri-map-pin-2-line"></i>{p.location}</div>
                                <div className="prop-meta">
                                    <div className="prop-meta-item"><i className="ri-hotel-bed-line"></i>{p.beds}</div>
                                    <div className="prop-meta-item"><i className="ri-bath-line"></i>{p.baths}</div>
                                    <div className="prop-meta-item"><i className="ri-expand-line"></i>{p.area}</div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
