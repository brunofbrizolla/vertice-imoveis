const testimonials = [
    {
        text: "\"A Vértice foi incrível durante todo o processo de compra do meu apartamento. Atendimento impecável e transparência total. Recomendo de olhos fechados!\"",
        avatar: "https://randomuser.me/api/portraits/women/32.jpg",
        name: "Ana Paula Ferreira",
        role: "Compradora – Batel",
    },
    {
        text: "\"Vendi meu imóvel em tempo recorde e pelo melhor preço do mercado. A equipe da Vértice domina o mercado imobiliário como ninguém.\"",
        avatar: "https://randomuser.me/api/portraits/men/44.jpg",
        name: "Carlos Eduardo Lima",
        role: "Vendedor – Água Verde",
    },
    {
        text: "\"Conseguiram encontrar o apartamento perfeito para mim em menos de 2 semanas. Processo rápido, seguro e sem dor de cabeça. Estou muito satisfeita!\"",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        name: "Mariana Costa",
        role: "Locatária – Centro",
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
                    <p className="section-sub">A satisfação de quem confiou em nós é o nosso maior prêmio.</p>
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
