export default function Contact() {
    return (
        <section className="contact" id="contato">
            <div className="contact-inner">
                <div className="contact-info">
                    <h2>Fale com a Eucalipto Imobiliária e Construtora</h2>
                    <p>
                        Conte para nós o seu perfil de investimento. Nossa equipe seleciona terrenos com o melhor
                        potencial de valorização e conduz cada negócio com total segurança patrimonial.
                    </p>
                    <div className="contact-item">
                        <div className="contact-item-icon"><i className="ri-map-pin-line"></i></div>
                        <div>
                            <strong>Endereço</strong>
                            <span>Rua João Barwik, 151 – Cachoeira, Curitiba/PR · 82220-422</span>
                        </div>
                    </div>
                    <div className="contact-item">
                        <div className="contact-item-icon"><i className="ri-phone-line"></i></div>
                        <div>
                            <strong>Telefone / WhatsApp</strong>
                            <span>(41) 99982-1064</span>
                        </div>
                    </div>
                    <div className="contact-item">
                        <div className="contact-item-icon"><i className="ri-mail-line"></i></div>
                        <div>
                            <strong>E-mail</strong>
                            <span>contato@eucaliptoimobiliaria.com.br</span>
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
                                <option>Comprar terreno</option>
                                <option>Vender terreno</option>
                                <option>Curadoria de oportunidades</option>
                                <option>Avaliação patrimonial</option>
                            </select>
                        </div>
                        <div className="form-field full">
                            <label>Mensagem</label>
                            <textarea rows={4} placeholder="Descreva o perfil de investimento ou o terreno que você procura..."></textarea>
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
