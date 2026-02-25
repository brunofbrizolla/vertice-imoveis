import LogoSVG from "./LogoSVG";

export default function Navbar() {
    return (
        <header>
            <div className="header-inner">
                <div className="logo">
                    <div className="logo-icon">
                        <LogoSVG size={38} />
                    </div>
                    <div className="logo-text">
                        <strong>Vértice Imóveis</strong>
                        <span>CRECI 12345</span>
                    </div>
                </div>
                <nav>
                    <a href="#inicio">Início</a>
                    <a href="#imoveis">Imóveis</a>
                    <a href="#sobre">Sobre</a>
                    <a href="#depoimentos">Depoimentos</a>
                    <a href="#contato">Contato</a>
                </nav>
                <div className="header-cta">
                    <a className="btn-gold" href="#contato">Fale Conosco</a>
                </div>
            </div>
        </header>
    );
}
