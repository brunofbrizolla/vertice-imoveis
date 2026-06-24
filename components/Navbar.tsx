'use client';

import { useState } from 'react';
import Link from 'next/link';

const LINKS = [
    { href: "/#inicio", label: "Início" },
    { href: "/#imoveis", label: "Oportunidades" },
    { href: "/terrenos", label: "Terrenos" },
    { href: "/#sobre", label: "Sobre" },
    { href: "/#depoimentos", label: "Depoimentos" },
    { href: "/#contato", label: "Contato" },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <header>
            <div className="header-inner">
                <Link href="/" className="logo">
                    <div className="logo-icon">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/logo-emblem.webp?v=4" alt="Eucalipto Imobiliária e Construtora" />
                    </div>
                    <div className="logo-text">
                        <strong>Eucalipto</strong>
                        <span>Imobiliária e Construtora</span>
                    </div>
                </Link>
                <nav>
                    {LINKS.map((l) => (
                        <Link key={l.href} href={l.href}>{l.label}</Link>
                    ))}
                </nav>
                <div className="header-cta">
                    <a className="btn-gold" href="#contato">Fale Conosco</a>
                </div>
                <button
                    className="nav-toggle"
                    aria-label={open ? "Fechar menu" : "Abrir menu"}
                    aria-expanded={open}
                    onClick={() => setOpen((v) => !v)}
                >
                    <i className={open ? "ri-close-line" : "ri-menu-line"}></i>
                </button>
            </div>

            <div className={`nav-mobile${open ? " open" : ""}`}>
                {LINKS.map((l) => (
                    <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>
                ))}
                <a className="btn-gold nav-mobile-cta" href="#contato" onClick={() => setOpen(false)}>
                    Fale Conosco
                </a>
            </div>
        </header>
    );
}
