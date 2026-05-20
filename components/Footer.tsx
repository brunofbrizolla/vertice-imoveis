import LogoSVG from "./LogoSVG";

export default function Footer() {
    return (
        <footer>
            <div className="footer-top">
                <div className="footer-brand">
                    <div className="logo">
                        <div className="logo-icon">
                            <LogoSVG size={38} />
                        </div>
                        <div className="logo-text" style={{ color: "#fff" }}>
                            <strong>Vértice Imóveis</strong>
                            <span>CRECI 12345</span>
                        </div>
                    </div>
                    <p>
                        Há mais de 10 anos conectando pessoas aos seus lares. Especialistas em compra,
                        venda e locação de imóveis residenciais e comerciais.
                    </p>
                    <div className="footer-socials">
                        <a className="social-btn fb" href="#"><i className="ri-facebook-fill"></i></a>
                        <a className="social-btn ig" href="#"><i className="ri-instagram-line"></i></a>
                        <a className="social-btn wa" href="#"><i className="ri-whatsapp-line"></i></a>
                    </div>
                </div>
                <div className="footer-col">
                    <h4>Navegação</h4>
                    <ul>
                        <li><a href="#inicio">Início</a></li>
                        <li><a href="#imoveis">Imóveis</a></li>
                        <li><a href="#sobre">Sobre Nós</a></li>
                        <li><a href="#depoimentos">Depoimentos</a></li>
                        <li><a href="#contato">Contato</a></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>Serviços</h4>
                    <ul>
                        <li><a href="#">Compra de Imóveis</a></li>
                        <li><a href="#">Venda de Imóveis</a></li>
                        <li><a href="#">Locação</a></li>
                        <li><a href="#">Avaliação Gratuita</a></li>
                        <li><a href="#">Financiamento</a></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>Contato</h4>
                    <div className="footer-contact-item">
                        <i className="ri-map-pin-line"></i>
                        <span>Av. do Batel, 1400 – Batel – PR</span>
                    </div>
                    <div className="footer-contact-item">
                        <i className="ri-phone-line"></i>
                        <span>(41) 9 8432-1567</span>
                    </div>
                    <div className="footer-contact-item">
                        <i className="ri-mail-line"></i>
                        <span>contato@verticeimoveis.com.br</span>
                    </div>
                    <div className="footer-contact-item">
                        <i className="ri-time-line"></i>
                        <span>Seg–Sex: 8h–18h | Sáb: 8h–13h</span>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                © {new Date().getFullYear()} Vértice Imóveis. Todos os direitos reservados. |{" "}
                <span className="creci">CRECI 12345</span>
            </div>
        </footer>
    );
}
