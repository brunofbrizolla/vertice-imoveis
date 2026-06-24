import Link from 'next/link';

export default function SearchSection() {
    return (
        <section className="search-section" id="busca">
            <div className="search-inner">
                <div className="search-tabs">
                    <div className="tab active">Comprar terreno</div>
                    <div className="tab">Vender terreno</div>
                </div>
                <div className="search-grid">
                    <div className="search-field">
                        <label htmlFor="f-finalidade">Finalidade</label>
                        <select id="f-finalidade">
                            <option>Todas as finalidades</option>
                            <option>Residencial</option>
                            <option>Comercial</option>
                            <option>Misto</option>
                            <option>Loteamento</option>
                        </select>
                    </div>
                    <div className="search-field">
                        <label htmlFor="f-metragem">Metragem</label>
                        <select id="f-metragem">
                            <option>Qualquer metragem</option>
                            <option>650 – 1.000 m²</option>
                            <option>1.000 – 2.000 m²</option>
                            <option>2.000 – 5.000 m²</option>
                            <option>Acima de 5.000 m²</option>
                        </select>
                    </div>
                    <div className="search-field">
                        <label htmlFor="f-investimento">Faixa de investimento</label>
                        <select id="f-investimento">
                            <option>Qualquer valor</option>
                            <option>R$ 2M – R$ 3M</option>
                            <option>R$ 3M – R$ 5M</option>
                            <option>R$ 5M – R$ 10M</option>
                            <option>Acima de R$ 10M</option>
                        </select>
                    </div>
                    <div className="search-field">
                        <label htmlFor="f-horizonte">Horizonte</label>
                        <select id="f-horizonte">
                            <option>Indiferente</option>
                            <option>Curto prazo</option>
                            <option>Médio prazo</option>
                            <option>Longo prazo</option>
                        </select>
                    </div>
                    <Link className="btn-search" href="/terrenos">
                        <i className="ri-search-line"></i> Ver oportunidades
                    </Link>
                </div>
            </div>
        </section>
    );
}
