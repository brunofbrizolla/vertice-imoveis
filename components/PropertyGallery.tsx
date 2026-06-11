'use client';
import { useState } from 'react';

export default function PropertyGallery({ images }: { images: string[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[currentIndex]} alt={`Slide ${currentIndex}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.3s ease-in-out' }} />
            
            {images.length > 1 && (
                <>
                    <button 
                        onClick={prevSlide}
                        style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transition: 'background 0.2s', zIndex: 10 }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#fff'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
                    >
                        <i className="ri-arrow-left-s-line" style={{ fontSize: '1.8rem', color: '#1A2E49' }}></i>
                    </button>
                    <button 
                        onClick={nextSlide}
                        style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transition: 'background 0.2s', zIndex: 10 }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#fff'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
                    >
                        <i className="ri-arrow-right-s-line" style={{ fontSize: '1.8rem', color: '#1A2E49' }}></i>
                    </button>
                    <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.6rem', zIndex: 10 }}>
                        {images.map((_, idx) => (
                            <button 
                                key={idx} 
                                onClick={() => setCurrentIndex(idx)}
                                style={{ width: idx === currentIndex ? '24px' : '8px', height: '8px', borderRadius: '8px', background: idx === currentIndex ? '#D9A441' : 'rgba(255,255,255,0.7)', transition: 'all 0.3s', border: 'none', padding: 0, cursor: 'pointer' }} 
                                aria-label={`Ir para foto ${idx + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
