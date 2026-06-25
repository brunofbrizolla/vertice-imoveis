const testimonials = [
    {
        text: "\"Comprei meu terreno com a Eucalipto e a curadoria foi certeira. Adquiri um lote com excelente potencial e a valorização superou minhas expectativas. Assessoria impecável do começo ao fim.\"",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        name: "Ricardo Menezes",
        role: "Comprou um terreno · Curitiba/PR",
    },
    {
        text: "\"Fechei a compra do meu lote comercial com total tranquilidade. Análise de mercado sólida e total segurança jurídica na escritura. Recomendo de olhos fechados.\"",
        avatar: "https://randomuser.me/api/portraits/men/44.jpg",
        name: "Carlos Eduardo Lima",
        role: "Comprou um lote comercial · Pinhais/PR",
    },
    {
        text: "\"Eles entenderam exatamente o meu perfil e me trouxeram a oportunidade que eu não encontraria sozinha. Comprei com segurança e fiz um ótimo negócio.\"",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        name: "Mariana Costa",
        role: "Comprou um terreno · Colombo/PR",
    },
    {
        text: "\"Compramos uma grande área com a documentação 100% regularizada. Processo transparente, ágil e com acompanhamento próximo em cada etapa da compra.\"",
        avatar: "https://randomuser.me/api/portraits/women/45.jpg",
        name: "Fernanda Albuquerque",
        role: "Comprou uma área para incorporação · São José dos Pinhais/PR",
    },
];

export default function Testimonials() {
    return (
        <section className="testimonials" id="depoimentos">
            <div className="testimonials-inner">
                <div className="text-center">
                    <div className="section-tag" style={{ display: "inline-flex" }}>
                        <i className="ri-chat-quote-line"></i> Depoimentos
                    </div>
                    <p className="section-title">O que Nossos Clientes Dizem</p>
                    <p className="section-sub">A confiança de quem já comprou com a Eucalipto é o nosso maior patrimônio.</p>
                </div>
                <div className="testi-grid">
                    {testimonials.map((t) => (
                        <div className="testi-card" key={t.name}>
                            <div className="stars">★★★★★</div>
                            <p className="testi-text">{t.text}</p>
                            <div className="testi-author">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img className="testi-avatar" src={t.avatar} alt={t.name} />
                                <div>
                                    <div className="testi-name">{t.name}</div>
                                    <div className="testi-role">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
