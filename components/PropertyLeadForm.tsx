'use client';
import { useState, FormEvent } from 'react';

export default function PropertyLeadForm({ propertyTitle }: { propertyTitle: string }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState('');

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        if (loading) return;
        if (!phone.trim()) { setError('Informe seu WhatsApp.'); return; }
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name, whatsapp: phone, interest: 'Agendar visita',
                    property: propertyTitle,
                    notes: date ? `Preferência de visita: ${date}` : undefined,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'erro');
            setDone(true);
        } catch {
            setError('Não foi possível enviar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    if (done) {
        return (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
                <i className="ri-checkbox-circle-line" style={{ fontSize: '2rem', color: '#22c55e' }}></i>
                <h3 style={{ color: '#14301E', margin: '0.5rem 0 0.25rem', fontWeight: 700 }}>Solicitação recebida!</h3>
                <p style={{ color: '#555', fontSize: '0.9rem', margin: 0 }}>Em breve um especialista entra em contato pelo seu WhatsApp.</p>
            </div>
        );
    }

    const field: React.CSSProperties = { width: '100%', border: '1.5px solid #e0e0e0', borderRadius: '8px', padding: '0.7rem 0.9rem', fontFamily: 'inherit', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' };

    return (
        <form onSubmit={submit} style={{ background: '#fff', border: '1px solid #e4ebe2', borderRadius: '12px', padding: '1.75rem' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: '#14301E', marginBottom: '0.35rem' }}>
                Agende uma visita
            </h3>
            <p style={{ color: '#666', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                Deixe seus dados e um especialista entra em contato para agendar.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input style={field} value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" autoComplete="name" />
                <input style={field} value={phone} onChange={e => setPhone(e.target.value)} placeholder="WhatsApp (00) 00000-0000" type="tel" autoComplete="tel" />
                <input style={field} value={date} onChange={e => setDate(e.target.value)} placeholder="Melhor dia/horário (opcional)" />
                {error && <p style={{ color: '#c0392b', fontSize: '0.8rem', margin: 0 }}>{error}</p>}
                <button type="submit" disabled={loading} style={{ background: '#C9A35B', color: '#14301E', border: 'none', borderRadius: '8px', padding: '0.85rem', fontFamily: 'inherit', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
                    {loading ? 'Enviando...' : 'Solicitar contato'}
                </button>
            </div>
        </form>
    );
}
