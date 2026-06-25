'use client';
import { useState, useEffect } from 'react';

export default function PropertyGallery({ images }: { images: string[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lightbox, setLightbox] = useState(false);

    const safe = images.length ? images : [''];
    const next = () => setCurrentIndex((p) => (p === safe.length - 1 ? 0 : p + 1));
    const prev = () => setCurrentIndex((p) => (p === 0 ? safe.length - 1 : p - 1));

    useEffect(() => {
        if (!lightbox) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setLightbox(false);
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [lightbox]); // eslint-disable-line react-hooks/exhaustive-deps

    const arrowStyle = (side: 'left' | 'right'): React.CSSProperties => ({
        position: 'absolute', [side]: '1rem', top: '50%', transform: 'translateY(-50%)',
        background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '44px', height: '44px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 10,
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', height: '100%' }}>
            {/* Imagem principal */}
            <div style={{ position: 'relative', flex: 1, minHeight: '320px', borderRadius: '10px', overflow: 'hidden', cursor: 'zoom-in' }} onClick={() => setLightbox(true)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={safe[currentIndex]} alt={`Foto ${currentIndex + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: '0.75rem', right: '0.75rem', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.3rem', zIndex: 10 }}>
                    <i className="ri-fullscreen-line"></i> {currentIndex + 1}/{safe.length}
                </div>
                {safe.length > 1 && (
                    <>
                        <button onClick={(e) => { e.stopPropagation(); prev(); }} style={arrowStyle('left')} aria-label="Anterior"><i className="ri-arrow-left-s-line" style={{ fontSize: '1.6rem', color: '#14301E' }}></i></button>
                        <button onClick={(e) => { e.stopPropagation(); next(); }} style={arrowStyle('right')} aria-label="Próxima"><i className="ri-arrow-right-s-line" style={{ fontSize: '1.6rem', color: '#14301E' }}></i></button>
                    </>
                )}
            </div>

            {/* Miniaturas */}
            {safe.length > 1 && (
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                    {safe.map((img, idx) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            key={idx}
                            src={img}
                            alt={`Miniatura ${idx + 1}`}
                            onClick={() => setCurrentIndex(idx)}
                            style={{ width: '72px', height: '54px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer', flexShrink: 0, border: idx === currentIndex ? '2px solid #C9A35B' : '2px solid transparent', opacity: idx === currentIndex ? 1 : 0.7 }}
                        />
                    ))}
                </div>
            )}

            {/* Lightbox (tela cheia) */}
            {lightbox && (
                <div onClick={() => setLightbox(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <button onClick={() => setLightbox(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.5rem', background: 'none', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer', zIndex: 1010 }} aria-label="Fechar"><i className="ri-close-line"></i></button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={safe[currentIndex]} alt={`Foto ${currentIndex + 1}`} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '92vw', maxHeight: '88vh', objectFit: 'contain', borderRadius: '8px' }} />
                    {safe.length > 1 && (
                        <>
                            <button onClick={(e) => { e.stopPropagation(); prev(); }} style={{ ...arrowStyle('left'), width: '52px', height: '52px' }} aria-label="Anterior"><i className="ri-arrow-left-s-line" style={{ fontSize: '1.8rem', color: '#14301E' }}></i></button>
                            <button onClick={(e) => { e.stopPropagation(); next(); }} style={{ ...arrowStyle('right'), width: '52px', height: '52px' }} aria-label="Próxima"><i className="ri-arrow-right-s-line" style={{ fontSize: '1.8rem', color: '#14301E' }}></i></button>
                            <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', color: '#fff', fontSize: '0.9rem' }}>{currentIndex + 1} / {safe.length}</div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
