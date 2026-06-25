'use client';
import { useState } from 'react';

export default function PropertyShare({ title }: { title: string }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { /* ignore */ }
    };

    const waShare = () => {
        const url = typeof window !== 'undefined' ? window.location.href : '';
        const text = `Olha esta oportunidade na Eucalipto: ${title} — ${url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    };

    const btn: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#fff', border: '1.5px solid #e0e0e0', borderRadius: '8px', padding: '0.5rem 0.9rem', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 600, color: '#555', cursor: 'pointer' };

    return (
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button onClick={copy} style={btn}>
                <i className={copied ? 'ri-check-line' : 'ri-link'}></i> {copied ? 'Link copiado!' : 'Copiar link'}
            </button>
            <button onClick={waShare} style={btn}>
                <i className="ri-whatsapp-line" style={{ color: '#25D366' }}></i> Compartilhar
            </button>
        </div>
    );
}
