export default function SearchSection() {
    return (
        <section className="search-section" id="busca">
            <div className="search-inner">
                <div className="search-tabs">
                    <div className="tab active">Comprar</div>
                    <div className="tab">Alugar</div>
                    <div className="tab">Comercial</div>
                </div>
                <div className="search-grid">
                    <div className="search-field">
                        <label>Tipo de Imóvel</label>
                        <select>
                            <option>Todos os tipos</option>
                            <option>Apartamento</option>
                            <option>Casa</option>
                            <option>Cobertura</option>
                            <option>Sala Comercial</option>
                            <option>Terreno</option>
                        </select>
                    </div>
                    <div className="search-field">
                        <label>Bairro / Região</label>
                        <select>
                            <option>Todos os bairros</option>
                            <option>Batel</option>
                            <option>Água Verde</option>
                            <option>Centro</option>
                            <option>Bigorrilho</option>
                            <option>Cabral</option>
                            <option>Mercês</option>
                        </select>
                    </div>
                    <div className="search-field">
                        <label>Faixa de Preço</label>
                        <select>
                            <option>Qualquer valor</option>
                            <option>Até R$ 300.000</option>
                            <option>R$ 300k – R$ 600k</option>
                            <option>R$ 600k – R$ 1M</option>
                            <option>Acima de R$ 1M</option>
                        </select>
                    </div>
                    <div className="search-field">
                        <label>Quartos</label>
                        <select>
                            <option>Qualquer</option>
                            <option>1 quarto</option>
                            <option>2 quartos</option>
                            <option>3 quartos</option>
                            <option>4+ quartos</option>
                        </select>
                    </div>
                    <button className="btn-search">
                        <i className="ri-search-line"></i> Buscar
                    </button>
                </div>
            </div>
        </section>
    );
}
