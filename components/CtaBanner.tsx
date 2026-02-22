export default function CtaBanner() {
    return (
        <div className="cta-banner">
            <div style={{ maxWidth: "700px", margin: "0 auto" }}>
                <h2>Pronto para Encontrar seu Imóvel Ideal?</h2>
                <p>Nossa equipe está pronta para ajudar você. Entre em contato agora mesmo e comece sua jornada.</p>
                <div className="cta-actions">
                    <a className="btn-wa" href="https://wa.me/554198432-1567" target="_blank" rel="noopener noreferrer">
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
