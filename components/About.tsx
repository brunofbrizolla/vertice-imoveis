export default function About() {
    return (
        <section className="about" id="sobre">
            <div className="about-inner">
                <div className="about-img-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        className="about-img"
                        src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
                        alt="Equipe Vértice Imóveis"
                    />
                    <div className="about-years">
                        <strong>10+</strong>
                        <span>Anos de Mercado</span>
                    </div>
                </div>
                <div className="about-content">
                    <div className="section-tag"><i className="ri-information-line"></i> Sobre a Vértice</div>
                    <p className="section-title">Conectando Pessoas a Seus Lares há Mais de uma Década</p>
                    <p className="section-sub">
                        A Vértice Imóveis nasceu da paixão por transformar sonhos em realidade. Desde 2013, atuamos
                        no mercado imobiliário regional com profissionalismo, ética e dedicação.
                    </p>
                    <p className="section-sub" style={{ marginTop: ".75rem" }}>
                        Nossa equipe de corretores experientes e especializados está pronta para guiar você em cada
                        etapa — da busca ao registro do imóvel.
                    </p>
                    <div className="about-list">
                        {["CRECI regularizado", "Atendimento personalizado", "Financiamento facilitado", "Segurança jurídica total", "Portfólio exclusivo", "Avaliação gratuita"].map((item) => (
                            <div className="about-list-item" key={item}>
                                <i className="ri-check-line"></i> {item}
                            </div>
                        ))}
                    </div>
                    <a className="btn-primary" href="#contato">
                        <i className="ri-phone-line"></i> Fale com um Especialista
                    </a>
                </div>
            </div>
        </section>
    );
}
