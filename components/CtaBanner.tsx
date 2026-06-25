export default function CtaBanner() {
    return (
        <div className="cta-banner">
            <div style={{ maxWidth: "700px", margin: "0 auto" }}>
                <h2>Pronto para o seu Próximo Investimento?</h2>
                <p>Receba uma seleção de terrenos com alto potencial de valorização. Fale agora com um especialista.</p>
                <div className="cta-actions">
                    <a className="btn-wa" href="https://wa.me/5541999821064" target="_blank" rel="noopener noreferrer">
                        <i className="ri-whatsapp-line"></i> WhatsApp
                    </a>
                    <a className="btn-primary" href="#contato">
                        <i className="ri-mail-line"></i> Enviar Mensagem
                    </a>
                </div>
            </div>
        </div>
    );
}
