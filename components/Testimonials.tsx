const testimonials = [
    {
        text: "\"A curadoria da Eucalipto foi certeira. Adquiri um terreno com excelente potencial e a valorização superou minhas expectativas. Assessoria impecável.\"",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        name: "Ricardo Menezes",
        role: "Investidor – Portfólio de terrenos",
    },
    {
        text: "\"Profissionalismo do início ao fim. Análise de mercado sólida e total segurança jurídica na escritura. É o parceiro que todo investidor precisa.\"",
        avatar: "https://randomuser.me/api/portraits/men/44.jpg",
        name: "Carlos Eduardo Lima",
        role: "Investidor – Lotes comerciais",
    },
    {
        text: "\"Eles entenderam exatamente o meu perfil e trouxeram oportunidades que eu não encontraria sozinha. Negócio seguro e rentável.\"",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        name: "Mariana Costa",
        role: "Investidora – Banco de terras",
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
                    <p className="section-title">O que Nossos Investidores Dizem</p>
                    <p className="section-sub">A confiança de quem investe com a gente é o nosso maior patrimônio.</p>
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
