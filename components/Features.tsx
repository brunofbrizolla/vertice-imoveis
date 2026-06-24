export default function Features() {
    const features = [
        { icon: "ri-search-eye-line", title: "Curadoria Criteriosa", desc: "Cada terreno passa por uma seleção rigorosa: localização, metragem e potencial real de valorização." },
        { icon: "ri-line-chart-line", title: "Análise de Valorização", desc: "Avaliamos vetores de crescimento, infraestrutura e mercado para projetar o retorno do investimento." },
        { icon: "ri-shield-check-line", title: "Segurança Jurídica", desc: "Documentação e due diligence completas, com total transparência em cada etapa da negociação." },
        { icon: "ri-lock-2-line", title: "Confidencialidade", desc: "Discrição total na condução de oportunidades e nas negociações de alto valor." },
        { icon: "ri-user-star-line", title: "Assessoria Dedicada", desc: "Um especialista acompanha você da análise da oportunidade ao registro da escritura." },
    ];

    return (
        <section className="features">
            <div className="features-inner">
                <div className="text-center" style={{ marginBottom: 0 }}>
                    <div className="section-tag" style={{ display: "inline-flex" }}>
                        <i className="ri-star-line"></i> Por que investir com a Eucalipto
                    </div>
                    <p className="section-title">Inteligência que Protege seu Capital</p>
                    <p className="section-sub">Mais do que terrenos — entregamos análise, segurança e oportunidades com real potencial de retorno.</p>
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
