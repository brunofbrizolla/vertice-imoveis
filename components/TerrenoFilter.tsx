'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = { preco?: string; metragem?: string; cidade?: string };

export default function TerrenoFilter({ preco: p0 = '', metragem: m0 = '', cidade: c0 = '' }: Props) {
    const router = useRouter();
    const [preco, setPreco] = useState(p0);
    const [metragem, setMetragem] = useState(m0);
    const [cidade, setCidade] = useState(c0);

    const filtrar = () => {
        const params = new URLSearchParams();
        if (preco) params.set('preco', preco);
        if (metragem) params.set('metragem', metragem);
        if (cidade.trim()) params.set('cidade', cidade.trim());
        const qs = params.toString();
        router.push(qs ? `/terrenos?${qs}` : '/terrenos');
    };

    return (
        <div
            className="search-grid"
            style={{ gridTemplateColumns: '1fr 1fr 1fr auto', background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: '2rem' }}
        >
            <div className="search-field">
                <label htmlFor="t-preco">Faixa de preço</label>
                <select id="t-preco" value={preco} onChange={e => setPreco(e.target.value)}>
                    <option value="">Qualquer valor</option>
                    <option value="0-1000000">Até R$ 1 mi</option>
                    <option value="1000000-2000000">R$ 1 – 2 mi</option>
                    <option value="2000000-5000000">R$ 2 – 5 mi</option>
                    <option value="5000000-">Acima de R$ 5 mi</option>
                </select>
            </div>
            <div className="search-field">
                <label htmlFor="t-metragem">Metragem</label>
                <select id="t-metragem" value={metragem} onChange={e => setMetragem(e.target.value)}>
                    <option value="">Qualquer metragem</option>
                    <option value="0-1000">Até 1.000 m²</option>
                    <option value="1000-3000">1.000 – 3.000 m²</option>
                    <option value="3000-">Acima de 3.000 m²</option>
                </select>
            </div>
            <div className="search-field">
                <label htmlFor="t-cidade">Localização</label>
                <input id="t-cidade" value={cidade} onChange={e => setCidade(e.target.value)} placeholder="Cidade ou bairro" />
            </div>
            <button className="btn-search" onClick={filtrar}>
                <i className="ri-search-line"></i> Filtrar
            </button>
        </div>
    );
}
