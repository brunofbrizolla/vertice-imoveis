'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = { tipo?: string; preco?: string; cidade?: string; quartos?: string; metragem?: string };

export default function ImoveisFilter({ tipo: t0 = '', preco: p0 = '', cidade: c0 = '', quartos: q0 = '', metragem: m0 = '' }: Props) {
    const router = useRouter();
    const [tipo, setTipo] = useState(t0);
    const [preco, setPreco] = useState(p0);
    const [cidade, setCidade] = useState(c0);
    const [quartos, setQuartos] = useState(q0);
    const [metragem, setMetragem] = useState(m0);

    const isTerreno = tipo === 'Terreno';

    const filtrar = () => {
        const params = new URLSearchParams();
        if (tipo) params.set('tipo', tipo);
        if (preco) params.set('preco', preco);
        if (cidade.trim()) params.set('cidade', cidade.trim());
        if (isTerreno) { if (metragem) params.set('metragem', metragem); }
        else if (quartos) params.set('quartos', quartos);
        const qs = params.toString();
        router.push(qs ? `/imoveis?${qs}` : '/imoveis');
    };

    return (
        <div className="search-grid" style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
            <div className="search-field">
                <label htmlFor="i-tipo">Tipo de imóvel</label>
                <select id="i-tipo" value={tipo} onChange={e => setTipo(e.target.value)}>
                    <option value="">Todos os tipos</option>
                    <option value="Apartamento">Apartamento</option>
                    <option value="Casa">Casa</option>
                    <option value="Terreno">Terreno</option>
                </select>
            </div>
            <div className="search-field">
                <label htmlFor="i-preco">Faixa de preço</label>
                <select id="i-preco" value={preco} onChange={e => setPreco(e.target.value)}>
                    <option value="">Qualquer valor</option>
                    <option value="0-500000">Até R$ 500 mil</option>
                    <option value="500000-1000000">R$ 500 mil – 1 mi</option>
                    <option value="1000000-2000000">R$ 1 – 2 mi</option>
                    <option value="2000000-">Acima de R$ 2 mi</option>
                </select>
            </div>
            <div className="search-field">
                <label htmlFor="i-cidade">Localização</label>
                <input id="i-cidade" value={cidade} onChange={e => setCidade(e.target.value)} placeholder="Cidade ou bairro" />
            </div>
            {isTerreno ? (
                <div className="search-field">
                    <label htmlFor="i-metragem">Metragem</label>
                    <select id="i-metragem" value={metragem} onChange={e => setMetragem(e.target.value)}>
                        <option value="">Qualquer metragem</option>
                        <option value="0-1000">Até 1.000 m²</option>
                        <option value="1000-3000">1.000 – 3.000 m²</option>
                        <option value="3000-">Acima de 3.000 m²</option>
                    </select>
                </div>
            ) : (
                <div className="search-field">
                    <label htmlFor="i-quartos">Quartos</label>
                    <select id="i-quartos" value={quartos} onChange={e => setQuartos(e.target.value)}>
                        <option value="">Qualquer</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                    </select>
                </div>
            )}
            <button className="btn-search" onClick={filtrar}>
                <i className="ri-search-line"></i> Filtrar
            </button>
        </div>
    );
}
