export default function Features() {
    const features = [
        { icon: "ri-shield-check-line", title: "Segurança Jurídica", desc: "Toda documentação analisada e processos realizados com total segurança e transparência legal." },
        { icon: "ri-time-line", title: "Atendimento Ágil", desc: "Equipe altamente qualificada disponível 7 dias por semana para atender suas necessidades." },
        { icon: "ri-map-pin-line", title: "Conhecimento Local", desc: "Profundo conhecimento do mercado imobiliário regional e das melhores oportunidades da região." },
        { icon: "ri-hand-heart-line", title: "Atendimento Personalizado", desc: "Entendemos suas necessidades e encontramos o imóvel ideal para seu perfil e orçamento." },
        { icon: "ri-bank-line", title: "Financiamento Facilitado", desc: "Parcerias com os principais bancos para oferecer as melhores taxas de financiamento." },
    ];

    return (
        <section className="features">
            <div className="features-inner">
                <div className="text-center" style={{ marginBottom: 0 }}>
                    <div className="section-tag" style={{ display: "inline-flex" }}>
                        <i className="ri-star-line"></i> Por que nos escolher
                    </div>
                    <p className="section-title">Experiência que Transforma</p>
                    <p className="section-sub">Oferecemos muito mais do que imóveis – oferecemos a realização do seu sonho.</p>
                </div>
                <div className="features-grid">
                    {features.map((f) => (
                        <div className="feature-card" key={f.title}>
                            <div className="feature-icon"><i className={f.icon}></i></div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
