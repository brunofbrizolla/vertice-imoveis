const properties = [
    {
        img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
        alt: "Apartamento Batel",
        badge: "Venda",
        price: "R$ 850.000",
        priceLabel: "/ à vista",
        title: "Apartamento Alto Padrão no Batel",
        location: "Batel – PR",
        beds: "3 quartos",
        baths: "2 banheiros",
        area: "120m²",
    },
    {
        img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80",
        alt: "Casa Água Verde",
        badge: "Locação",
        badgeGreen: true,
        price: "R$ 4.500",
        priceLabel: "/ mês",
        title: "Casa Moderna com Piscina",
        location: "Água Verde – PR",
        beds: "4 quartos",
        baths: "3 banheiros",
        area: "280m²",
    },
    {
        img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
        alt: "Cobertura Centro",
        badge: "Venda",
        price: "R$ 1.350.000",
        priceLabel: "/ à vista",
        title: "Cobertura Duplex com Vista Panorâmica",
        location: "Centro – PR",
        beds: "4 quartos",
        baths: "4 banheiros",
        area: "320m²",
    },
    {
        img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
        alt: "Apartamento Bigorrilho",
        badge: "Venda",
        price: "R$ 480.000",
        priceLabel: "/ à vista",
        title: "Apartamento Compacto no Bigorrilho",
        location: "Bigorrilho – PR",
        beds: "2 quartos",
        baths: "2 banheiros",
        area: "75m²",
    },
    {
        img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
        alt: "Sala comercial",
        badge: "Locação",
        badgeGreen: true,
        price: "R$ 8.000",
        priceLabel: "/ mês",
        title: "Sala Comercial Prime no Centro",
        location: "Centro – PR",
        beds: "Comercial",
        baths: "2 banheiros",
        area: "180m²",
    },
    {
        img: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=600&q=80",
        alt: "Casa Mercês",
        badge: "Venda",
        price: "R$ 720.000",
        priceLabel: "/ à vista",
        title: "Casa Residencial nas Mercês",
        location: "Mercês – PR",
        beds: "3 quartos",
        baths: "3 banheiros",
        area: "210m²",
    },
];

export default function Properties() {
    return (
        <section className="properties" id="imoveis">
            <div className="properties-inner">
                <div className="props-header">
                    <div>
                        <div className="section-tag"><i className="ri-building-line"></i> Nosso Portfólio</div>
                        <p className="section-title">Imóveis em Destaque</p>
                        <p className="section-sub">Selecionamos os melhores imóveis da região para você.</p>
                    </div>
                    <a className="view-all" href="#">Ver todos os imóveis <i className="ri-arrow-right-line"></i></a>
                </div>
                <div className="props-grid">
                    {properties.map((p) => (
                        <div className="prop-card" key={p.title}>
                            <div className="prop-img">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={p.img} alt={p.alt} />
                                <span className={`prop-badge${p.badgeGreen ? " green" : ""}`}>{p.badge}</span>
                                <div className="prop-fav"><i className="ri-heart-line"></i></div>
                            </div>
                            <div className="prop-body">
                                <div className="prop-price">{p.price} <span>{p.priceLabel}</span></div>
                                <div className="prop-title">{p.title}</div>
                                <div className="prop-location"><i className="ri-map-pin-2-line"></i>{p.location}</div>
                                <div className="prop-meta">
                                    <div className="prop-meta-item"><i className="ri-hotel-bed-line"></i>{p.beds}</div>
                                    <div className="prop-meta-item"><i className="ri-bath-line"></i>{p.baths}</div>
                                    <div className="prop-meta-item"><i className="ri-expand-line"></i>{p.area}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
