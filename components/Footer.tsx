export default function Footer() {
    return (
        <footer>
            <div className="footer-top">
                <div className="footer-brand">
                    <div className="logo">
                        <div className="logo-icon">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/logo-emblem.webp?v=4" alt="Eucalipto Imobiliária e Construtora" />
                        </div>
                        <div className="logo-text" style={{ color: "#fff" }}>
                            <strong>Eucalipto</strong>
                            <span>Imobiliária e Construtora</span>
                        </div>
                    </div>
                    <p>
                        Curadoria de terrenos premium para grandes investidores. Oportunidades
                        selecionadas com foco em valorização e segurança patrimonial.
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
                        <li><a href="#imoveis">Compra de Terrenos</a></li>
                        <li><a href="#imoveis">Venda de Terrenos</a></li>
                        <li><a href="#imoveis">Curadoria de Oportunidades</a></li>
                        <li><a href="#contato">Avaliação Patrimonial</a></li>
                        <li><a href="#contato">Assessoria a Investidores</a></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>Contato</h4>
                    <div className="footer-contact-item">
                        <i className="ri-map-pin-line"></i>
                        <span>Rua Antônio Krainiski, 191 – Abranches, Curitiba/PR</span>
                    </div>
                    <div className="footer-contact-item">
                        <i className="ri-phone-line"></i>
                        <span>(41) 99982-1064</span>
                    </div>
                    <div className="footer-contact-item">
                        <i className="ri-mail-line"></i>
                        <span>contato@eucaliptoimobiliaria.com.br</span>
                    </div>
                    <div className="footer-contact-item">
                        <i className="ri-time-line"></i>
                        <span>Seg–Sex: 8h–18h | Sáb: 8h–13h</span>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                © {new Date().getFullYear()} Eucalipto Imobiliária e Construtora. Todos os direitos reservados. |{" "}
                <span className="creci">CRECI 00000-J</span>
            </div>
        </footer>
    );
}
