'use client';

import { useRef, useEffect } from 'react';

const VIDEOS = [
    '/video/video 1.mp4',
    '/video/video 2.mp4',
];

export default function Hero() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const indexRef = useRef(0);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        const playNext = () => {
            indexRef.current = (indexRef.current + 1) % VIDEOS.length;
            video.src = VIDEOS[indexRef.current];
            video.play();
        };
        video.addEventListener('ended', playNext);
        return () => video.removeEventListener('ended', playNext);
    }, []);

    return (
        <section className="hero" id="inicio">
            <video
                ref={videoRef}
                className="hero-video"
                autoPlay
                muted
                playsInline
                src={VIDEOS[0]}
                poster="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80"
            />
            <div className="hero-overlay"></div>
            <div className="hero-content hero-content--center">
                <h1 className="hero-title">
                    Encontre o imóvel ideal com<br />
                    <span className="hero-title-gold">segurança e confiança</span>
                </h1>
                <p className="hero-sub">
                    Venda, compra e locação de imóveis residenciais e comerciais com mais
                    <br />de 10 anos de experiência no mercado
                </p>
                <div className="hero-actions hero-actions--center">
                    <a className="btn-primary" href="#imoveis">
                        <i className="ri-search-line"></i> Buscar Imóveis
                    </a>
                    <a className="btn-ghost" href="#contato">
                        <i className="ri-user-line"></i> Fale com um Corretor
                    </a>
                </div>
            </div>
        </section>
    );
}
