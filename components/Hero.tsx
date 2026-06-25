'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';

const STATS = [
    { num: "Casas", label: "e apartamentos de alto padrão" },
    { num: "Terrenos", label: "premium para investir" },
    { num: "CRECI", label: "Registrado e regularizado" },
];

const HERO_IMG = "/hero.webp";

export default function Hero() {
    const reduce = useReducedMotion();

    const container: Variants = {
        hidden: {},
        show: {
            transition: { staggerChildren: reduce ? 0 : 0.14, delayChildren: reduce ? 0 : 0.1 },
        },
    };

    // 'hidden' must be identical on server and client to avoid hydration mismatch,
    // so it can't depend on `reduce` (which is false on the server). For reduced
    // motion we instead snap to 'show' instantly via a zero-duration transition.
    const item: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: reduce ? 0 : 0.7, ease: [0.22, 0.61, 0.36, 1] },
        },
    };

    return (
        <section className="hero" id="inicio">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="hero-bg" src={HERO_IMG} alt="" aria-hidden="true" />
            <div className="hero-overlay"></div>
            <motion.div className="hero-content" variants={container} initial="hidden" animate="show">
                <motion.div className="hero-badge" variants={item}>
                    <i className="ri-building-line"></i> Imóveis de alto padrão
                </motion.div>
                <motion.h1 className="hero-title" variants={item}>
                    Encontre o imóvel ideal.
                    <span className="hero-title-gold">Sem complicação.</span>
                </motion.h1>
                <motion.p className="hero-sub" variants={item}>
                    Casas, apartamentos e terrenos premium, com especialistas prontos
                    para guiar você em cada etapa.
                </motion.p>
                <motion.div className="hero-actions" variants={item}>
                    <a className="btn-primary" href="#imoveis">
                        <i className="ri-landscape-line"></i> Veja as oportunidades
                    </a>
                    <button
                        type="button"
                        className="btn-ghost"
                        onClick={() => window.dispatchEvent(new Event('open-specialist'))}
                    >
                        <i className="ri-user-star-line"></i> Fale com um especialista
                    </button>
                </motion.div>
                <motion.div className="hero-stats" variants={item}>
                    {STATS.map((s) => (
                        <div className="stat" key={s.label}>
                            <div className="stat-num">{s.num}</div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
            <a className="hero-scroll" href="#imoveis" aria-label="Rolar para as oportunidades">
                <i className="ri-arrow-down-line"></i>
            </a>
        </section>
    );
}
