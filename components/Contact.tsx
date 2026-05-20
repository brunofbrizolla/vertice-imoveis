export default function Contact() {
    return (
        <section className="contact" id="contato">
            <div className="contact-inner">
                <div className="contact-info">
                    <h2>Fale com a Vértice Imóveis</h2>
                    <p>
                        Estamos prontos para ajudar você a encontrar o imóvel dos seus sonhos ou realizar o melhor
                        negócio. Entre em contato pelo formulário ou pelos nossos canais diretos.
                    </p>
                    <div className="contact-item">
                        <div className="contact-item-icon"><i className="ri-map-pin-line"></i></div>
                        <div>
                            <strong>Endereço</strong>
                            <span>Av. do Batel, 1400 – Batel – PR</span>
                        </div>
                    </div>
                    <div className="contact-item">
                        <div className="contact-item-icon"><i className="ri-phone-line"></i></div>
                        <div>
                            <strong>Telefone / WhatsApp</strong>
                            <span>(41) 9 8432-1567</span>
                        </div>
                    </div>
                    <div className="contact-item">
                        <div className="contact-item-icon"><i className="ri-mail-line"></i></div>
                        <div>
                            <strong>E-mail</strong>
                            <span>contato@verticeimoveis.com.br</span>
                        </div>
                    </div>
                    <div className="contact-item">
                        <div className="contact-item-icon"><i className="ri-time-line"></i></div>
                        <div>
                            <strong>Horário de Atendimento</strong>
                            <span>Seg–Sex: 8h–18h | Sáb: 8h–13h</span>
                        </div>
                    </div>
                </div>
                <div className="contact-form">
                    <div className="form-grid">
                        <div className="form-field">
                            <label>Nome</label>
                            <input type="text" placeholder="Seu nome completo" />
                        </div>
                        <div className="form-field">
                            <label>Telefone</label>
                            <input type="tel" placeholder="(41) 9 0000-0000" />
                        </div>
                        <div className="form-field">
                            <label>E-mail</label>
                            <input type="email" placeholder="seu@email.com" />
                        </div>
                        <div className="form-field">
                            <label>Interesse</label>
                            <select>
                                <option>Comprar</option>
                                <option>Alugar</option>
                                <option>Vender</option>
                                <option>Avaliar imóvel</option>
                            </select>
                        </div>
                        <div className="form-field full">
                            <label>Mensagem</label>
                            <textarea rows={4} placeholder="Descreva o imóvel que você procura ou sua necessidade..."></textarea>
                        </div>
                    </div>
                    <button className="btn-submit">
                        <i className="ri-send-plane-line"></i> Enviar Mensagem
                    </button>
                </div>
            </div>
        </section>
    );
}
