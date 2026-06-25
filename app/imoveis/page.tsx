import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ChatBot from "@/components/ChatBot";
import ImoveisFilter from "@/components/ImoveisFilter";
import { supabaseAdmin } from "@/lib/supabase";
import Link from "next/link";

export const revalidate = 0;

type Search = { tipo?: string; preco?: string; cidade?: string; quartos?: string; metragem?: string };

const num = (s: string | null | undefined) => parseInt((s ?? '').replace(/\D/g, ''), 10) || 0;

function inRange(value: number, range?: string) {
    if (!range) return true;
    const [minS, maxS] = range.split('-');
    const min = minS ? parseInt(minS, 10) : 0;
    const max = maxS ? parseInt(maxS, 10) : Infinity;
    return value >= min && value <= max;
}

export default async function ImoveisPage({ searchParams }: { searchParams: Promise<Search> }) {
    const sp = await searchParams;

    const { data } = await supabaseAdmin
        .from('properties')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

    const all = data ?? [];

    const properties = all.filter((p) => {
        const isLand = p.property_type === 'Terreno' || p.beds === 'Terreno';
        // tipo
        if (sp.tipo) {
            if (sp.tipo === 'Terreno') { if (!isLand) return false; }
            else if (p.property_type !== sp.tipo) return false;
        }
        // preço
        if (sp.preco && !inRange(num(p.price), sp.preco)) return false;
        // localização
        if (sp.cidade && !(p.location ?? '').toLowerCase().includes(sp.cidade.toLowerCase())) return false;
        // metragem (terreno)
        if (sp.metragem && !inRange(num(p.area), sp.metragem)) return false;
        // quartos (casa/apto): valor é "mínimo"
        if (sp.quartos && num(p.beds) < parseInt(sp.quartos, 10)) return false;
        return true;
    });

    const hasFilters = !!(sp.tipo || sp.preco || sp.cidade || sp.quartos || sp.metragem);

    return (
        <main>
            <Navbar />
            <div style={{ paddingTop: '100px', minHeight: '80vh', backgroundColor: '#fdfdfc' }}>
                <section className="properties" id="imoveis">
                    <div className="properties-inner">
                        <div className="props-header">
                            <div>
                                <div className="section-tag"><i className="ri-building-2-line"></i> Oportunidades</div>
                                <p className="section-title">Imóveis disponíveis</p>
                                <p className="section-sub">
                                    {properties.length} {properties.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
                                    {hasFilters && <> · <Link href="/imoveis" style={{ color: '#A9842F' }}>limpar filtros</Link></>}
                                </p>
                            </div>
                        </div>
                        <ImoveisFilter tipo={sp.tipo} preco={sp.preco} cidade={sp.cidade} quartos={sp.quartos} metragem={sp.metragem} />
                        <div className="props-grid">
                            {properties.map((p) => {
                                const isLand = p.property_type === 'Terreno' || p.beds === 'Terreno';
                                return (
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
                                                {isLand ? (
                                                    <div className="prop-meta-item"><i className="ri-expand-line"></i>{p.area}</div>
                                                ) : (
                                                    <>
                                                        <div className="prop-meta-item"><i className="ri-hotel-bed-line"></i>{p.beds}</div>
                                                        <div className="prop-meta-item"><i className="ri-bath-line"></i>{p.baths}</div>
                                                        <div className="prop-meta-item"><i className="ri-expand-line"></i>{p.area}</div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                            {properties.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '3rem', color: '#666', gridColumn: '1 / -1' }}>
                                    Nenhum imóvel encontrado com esses filtros.{' '}
                                    <Link href="/imoveis" style={{ color: '#A9842F' }}>Ver todos</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
            <WhatsAppButton />
            <ChatBot />
        </main>
    );
}
