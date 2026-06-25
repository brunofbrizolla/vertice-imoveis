'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchSection() {
    const router = useRouter();
    const [tab, setTab] = useState<'comprar' | 'vender'>('comprar');
    const [tipo, setTipo] = useState('');
    const [preco, setPreco] = useState('');
    const [cidade, setCidade] = useState('');
    const [quartos, setQuartos] = useState('');
    const [metragem, setMetragem] = useState('');

    const isTerreno = tipo === 'Terreno';

    const buscar = () => {
        const params = new URLSearchParams();
        if (tipo) params.set('tipo', tipo);
        if (preco) params.set('preco', preco);
        if (cidade.trim()) params.set('cidade', cidade.trim());
        if (isTerreno) {
            if (metragem) params.set('metragem', metragem);
        } else if (quartos) {
            params.set('quartos', quartos);
        }
        const qs = params.toString();
        router.push(qs ? `/imoveis?${qs}` : '/imoveis');
    };

    return (
        <section className="search-section" id="busca">
            <div className="search-inner">
                <div className="search-tabs">
                    <div className={`tab${tab === 'comprar' ? ' active' : ''}`} onClick={() => setTab('comprar')}>Comprar</div>
                    <div className={`tab${tab === 'vender' ? ' active' : ''}`} onClick={() => setTab('vender')}>Vender</div>
                </div>

                {tab === 'comprar' ? (
                    <div className="search-grid">
                        <div className="search-field">
                            <label htmlFor="f-tipo">Tipo de imóvel</label>
                            <select id="f-tipo" value={tipo} onChange={e => setTipo(e.target.value)}>
                                <option value="">Todos os tipos</option>
                                <option value="Apartamento">Apartamento</option>
                                <option value="Casa">Casa</option>
                                <option value="Terreno">Terreno</option>
                            </select>
                        </div>
                        <div className="search-field">
                            <label htmlFor="f-preco">Faixa de preço</label>
                            <select id="f-preco" value={preco} onChange={e => setPreco(e.target.value)}>
                                <option value="">Qualquer valor</option>
                                <option value="0-500000">Até R$ 500 mil</option>
                                <option value="500000-1000000">R$ 500 mil – 1 mi</option>
                                <option value="1000000-2000000">R$ 1 – 2 mi</option>
                                <option value="2000000-">Acima de R$ 2 mi</option>
                            </select>
                        </div>
                        <div className="search-field">
                            <label htmlFor="f-cidade">Localização</label>
                            <input id="f-cidade" value={cidade} onChange={e => setCidade(e.target.value)} placeholder="Cidade ou bairro" />
                        </div>
                        {isTerreno ? (
                            <div className="search-field">
                                <label htmlFor="f-metragem">Metragem</label>
                                <select id="f-metragem" value={metragem} onChange={e => setMetragem(e.target.value)}>
                                    <option value="">Qualquer metragem</option>
                                    <option value="0-1000">Até 1.000 m²</option>
                                    <option value="1000-3000">1.000 – 3.000 m²</option>
                                    <option value="3000-">Acima de 3.000 m²</option>
                                </select>
                            </div>
                        ) : (
                            <div className="search-field">
                                <label htmlFor="f-quartos">Quartos</label>
                                <select id="f-quartos" value={quartos} onChange={e => setQuartos(e.target.value)}>
                                    <option value="">Qualquer</option>
                                    <option value="1">1+</option>
                                    <option value="2">2+</option>
                                    <option value="3">3+</option>
                                    <option value="4">4+</option>
                                </select>
                            </div>
                        )}
                        <button className="btn-search" onClick={buscar}>
                            <i className="ri-search-line"></i> Ver oportunidades
                        </button>
                    </div>
                ) : (
                    <div className="search-sell">
                        <p>Quer vender seu imóvel? Fale com um especialista — fazemos a avaliação e cuidamos de todo o processo com segurança jurídica.</p>
                        <button className="btn-search" onClick={() => window.dispatchEvent(new Event('open-specialist'))}>
                            <i className="ri-user-star-line"></i> Falar com um especialista
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
