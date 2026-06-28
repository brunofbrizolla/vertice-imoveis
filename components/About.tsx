export default function About() {
    return (
        <section className="about" id="sobre">
            <div className="about-inner">
                <div className="about-img-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        className="about-img"
                        src="/logo-full.webp"
                        alt="Eucalipto Imobiliária e Construtora"
                    />
                    <div className="about-years">
                        <strong>15+</strong>
                        <span>Anos de Mercado</span>
                    </div>
                </div>
                <div className="about-content">
                    <div className="section-tag"><i className="ri-information-line"></i> Sobre a Eucalipto</div>
                    <p className="section-title">Mais de 15 Anos Selecionando Terrenos de Alto Potencial</p>
                    <p className="section-sub">
                        A Eucalipto Imobiliária e Construtora é especializada em terrenos premium para investidores. Desde 2009,
                        unimos análise de mercado, curadoria criteriosa e segurança jurídica em cada negócio.
                    </p>
                    <p className="section-sub" style={{ marginTop: ".75rem" }}>
                        Nossa equipe identifica oportunidades acima de 650 m² com forte potencial de valorização e
                        acompanha o investidor da análise ao registro da escritura.
                    </p>
                    <div className="about-list">
                        {["CRECI regularizado", "Curadoria criteriosa", "Análise de valorização", "Segurança jurídica total", "Portfólio exclusivo", "Assessoria a investidores"].map((item) => (
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
