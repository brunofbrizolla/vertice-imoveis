import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ChatBot from "@/components/ChatBot";
import { supabaseAdmin } from "@/lib/supabase";
import Link from "next/link";

export const revalidate = 0;

export default async function TerrenosPage() {
    const { data: properties } = await supabaseAdmin
        .from('properties')
        .select('*')
        .eq('active', true)
        .eq('beds', 'Terreno')
        .order('created_at', { ascending: false });

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
                                <p className="section-sub">Encontre a área perfeita para construir o seu projeto ou investir.</p>
                            </div>
                        </div>
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
                            {properties?.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '3rem', color: '#666', gridColumn: '1 / -1' }}>
                                    Nenhum terreno disponível no momento.
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
