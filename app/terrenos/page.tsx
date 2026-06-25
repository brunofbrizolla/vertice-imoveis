import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ChatBot from "@/components/ChatBot";
import TerrenoFilter from "@/components/TerrenoFilter";
import { supabaseAdmin } from "@/lib/supabase";
import Link from "next/link";

export const revalidate = 0;

type Search = { preco?: string; metragem?: string; cidade?: string };

const num = (s: string | null | undefined) => parseInt((s ?? '').replace(/\D/g, ''), 10) || 0;

function inRange(value: number, range?: string) {
    if (!range) return true;
    const [minS, maxS] = range.split('-');
    const min = minS ? parseInt(minS, 10) : 0;
    const max = maxS ? parseInt(maxS, 10) : Infinity;
    return value >= min && value <= max;
}

export default async function TerrenosPage({ searchParams }: { searchParams: Promise<Search> }) {
    const sp = await searchParams;

    const { data } = await supabaseAdmin
        .from('properties')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

    const properties = (data ?? [])
        .filter((p) => p.property_type === 'Terreno' || p.beds === 'Terreno')
        .filter((p) => inRange(num(p.price), sp.preco))
        .filter((p) => inRange(num(p.area), sp.metragem))
        .filter((p) => !sp.cidade || (p.location ?? '').toLowerCase().includes(sp.cidade.toLowerCase()));

    const hasFilters = !!(sp.preco || sp.metragem || sp.cidade);

    return (
        <main>
            <Navbar />
            <div style={{ paddingTop: '100px', minHeight: '80vh', backgroundColor: '#fdfdfc' }}>
                <section className="properties" id="terrenos">
                    <div className="properties-inner">
                        <div className="props-header">
                            <div>
                                <div className="section-tag"><i className="ri-map-pin-user-line"></i> Terrenos e Lotes</div>
                                <p className="section-title">Compra e Venda de Terrenos</p>
                                <p className="section-sub">
                                    {properties.length} {properties.length === 1 ? 'terreno encontrado' : 'terrenos encontrados'}
                                    {hasFilters && <> · <Link href="/terrenos" style={{ color: '#A9842F' }}>limpar filtros</Link></>}
                                </p>
                            </div>
                        </div>
                        <TerrenoFilter preco={sp.preco} metragem={sp.metragem} cidade={sp.cidade} />
                        <div className="props-grid">
                            {properties?.map((p) => (
                                <Link href={`/imoveis/${p.id}`} className="prop-card" key={p.id} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                    <div className="prop-img">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={p.img} alt={p.title} />
                                        <span className={`prop-badge${p.type === 'Locação' ? " green" : ""}`}>{p.type}</span>
                                        <div className="prop-fav"><i className="ri-heart-line"></i></div>
                                    </div>
                                    <div className="prop-body">
                                        <div className="prop-price">{p.price} <span>{p.price_label}</span></div>
                                        <div className="prop-title">{p.title}</div>
                                        <div className="prop-location"><i className="ri-map-pin-2-line"></i>{p.location}</div>
                                        <div className="prop-meta">
                                            {/* Hide beds and baths for lands, show only area */}
                                            <div className="prop-meta-item"><i className="ri-expand-line"></i>{p.area}</div>
                                            <div className="prop-meta-item"><i className="ri-road-map-line"></i>{p.baths}</div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {properties.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '3rem', color: '#666', gridColumn: '1 / -1' }}>
                                    {hasFilters ? (
                                        <>Nenhum terreno com esses filtros. <Link href="/terrenos" style={{ color: '#A9842F' }}>Ver todos</Link></>
                                    ) : 'Nenhum terreno disponível no momento.'}
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
