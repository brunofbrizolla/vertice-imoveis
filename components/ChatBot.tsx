'use client';
import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from 'react';

type Property = {
  id: string;
  seq: number;
  title: string;
  price: string;
  price_label: string;
  type: string;
  location: string;
  beds: string;
  baths: string;
  area: string;
  img: string;
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
  properties?: Property[];
  options?: string[];
}

const QUICK_ACTIONS = [
  'Quero investir em um terreno',
  'Quero vender meu terreno',
  'Ver oportunidades disponíveis',
  'Falar com um especialista',
];

const CASUAL_GREETING: Message = {
  role: 'assistant',
  content:
    'Olá! Seja bem-vindo à Eucalipto Imobiliária! 🌿 Sou a Eucalipto, sua consultora virtual.\n\nComo posso te ajudar hoje?',
};

function parseResponse(raw: string, allProps: Property[]): { text: string; properties: Property[]; options: string[] } {
  // imóveis
  const propMatch = raw.match(/<properties>\[([^\]]*)\]<\/properties>/);
  let properties: Property[] = [];
  if (propMatch && propMatch[1].trim()) {
    const ids = propMatch[1].split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    properties = allProps.filter(p => ids.includes(p.seq));
  }
  // botões de escolha
  const optMatch = raw.match(/<options>([\s\S]*?)<\/options>/);
  const options = optMatch
    ? optMatch[1].split('|').map(s => s.trim()).filter(Boolean)
    : [];

  const text = raw
    .replace(/<properties>[\s\S]*?<\/properties>/g, '')
    .replace(/<options>[\s\S]*?<\/options>/g, '')
    .trim();

  return { text, properties, options };
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<'form' | 'chat'>('chat');
  const [messages, setMessages] = useState<Message[]>([CASUAL_GREETING]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [leadName, setLeadName] = useState<string | null>(null);
  // formulário de captura
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // abre o fluxo de especialista (formulário primeiro) via evento global
  useEffect(() => {
    const openSpecialist = () => {
      setOpen(true);
      if (!leadId) setStage('form');
    };
    window.addEventListener('open-specialist', openSpecialist);
    return () => window.removeEventListener('open-specialist', openSpecialist);
  }, [leadId]);

  // carrega portfólio do banco ao abrir o chat
  useEffect(() => {
    if (open && allProperties.length === 0) {
      fetch('/api/properties')
        .then(r => r.json())
        .then((data: Property[]) => {
          setAllProperties(data.map((p, i) => ({ ...p, seq: i + 1 })));
        })
        .catch(() => {});
    }
  }, [open, allProperties.length]);

  useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      if (stage === 'chat') inputRef.current?.focus();
    }
  }, [open, messages, stage]);

  const handleLeadSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formLoading) return;
    if (!formPhone.trim()) {
      setFormError('Por favor, informe seu WhatsApp.');
      return;
    }
    setFormLoading(true);
    setFormError('');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formName, whatsapp: formPhone, interest: 'Comprar' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'erro');

      const first = formName.trim().split(' ')[0];
      setLeadId(data.leadId);
      setLeadName(formName.trim() || null);
      setStage('chat');
      setMessages([
        {
          role: 'assistant',
          content: `Perfeito${first ? `, ${first}` : ''}! Para começar, você quer comprar ou vender um imóvel?`,
          options: ['Comprar', 'Vender'],
        },
      ]);
    } catch {
      setFormError('Não foi possível registrar. Tente novamente.');
    } finally {
      setFormLoading(false);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput('');
    setLoading(true);

    try {
      const apiMessages = history.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, leadId, leadName }),
      });
      const data = await res.json();

      if (data.leadId && !leadId) setLeadId(data.leadId);

      const { text: cleanText, properties, options } = parseResponse(data.content || '', allProperties);

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: cleanText,
          properties: properties.length ? properties : undefined,
          options: options.length ? options : undefined,
        },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Desculpe, ocorreu um erro. Por favor, tente novamente.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const showQuickActions = stage === 'chat' && messages.length === 1 && messages[0] === CASUAL_GREETING && !loading;

  return (
    <>
      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar-icon" style={{ overflow: 'hidden' }}>
                <img src="/assistant_avatar.png?v=2" alt="Assistente" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <strong>Assistente Eucalipto</strong>
                <span><span className="chat-online-dot"></span>IA · Online agora</span>
              </div>
            </div>
            <button className="chat-close-btn" onClick={() => setOpen(false)}>
              <i className="ri-close-line"></i>
            </button>
          </div>

          {stage === 'form' ? (
            <div className="chat-body">
              <div className="chat-lead-intro">
                <div className="chat-msg-icon" style={{ overflow: 'hidden' }}>
                  <img src="/assistant_avatar.png?v=2" alt="Assistente" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="chat-bubble">
                  Vamos encontrar a melhor opção para você! 🌿 Deixe seu nome e WhatsApp que eu já começo a busca personalizada.
                </div>
              </div>
              <form className="chat-lead-form" onSubmit={handleLeadSubmit}>
                <label>
                  Nome
                  <input
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="Seu nome"
                    autoComplete="name"
                  />
                </label>
                <label>
                  WhatsApp
                  <input
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    type="tel"
                    autoComplete="tel"
                  />
                </label>
                {formError && <p className="chat-lead-error">{formError}</p>}
                <button type="submit" className="chat-lead-submit" disabled={formLoading}>
                  {formLoading ? 'Registrando...' : 'Começar agora'}
                </button>
                <p className="chat-lead-note">Seus dados ficam seguros e são usados só para o atendimento.</p>
              </form>
              <div ref={bottomRef} />
            </div>
          ) : (
            <div className="chat-body">
              {messages.map((msg, i) => {
                const isLast = i === messages.length - 1;
                return (
                  <div key={i} className={`chat-msg ${msg.role}`}>
                    {msg.role === 'assistant' && (
                      <div className="chat-msg-icon" style={{ overflow: 'hidden' }}><img src="/assistant_avatar.png?v=2" alt="Assistente" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                    )}
                    <div className="chat-msg-content">
                      <div className="chat-bubble">{msg.content}</div>
                      {msg.properties && msg.properties.length > 0 && (
                        <div className="chat-prop-list">
                          {msg.properties.map(p => (
                            <div className="chat-prop-card" key={p.id}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={p.img} alt={p.title} className="chat-prop-img" />
                              <div className="chat-prop-body">
                                <span className={`chat-prop-badge${p.type === 'Locação' ? ' green' : ''}`}>{p.type}</span>
                                <p className="chat-prop-title">{p.title}</p>
                                <p className="chat-prop-price">
                                  {p.price} <span>{p.price_label}</span>
                                </p>
                                <p className="chat-prop-loc">
                                  <i className="ri-map-pin-2-line"></i>{p.location}
                                </p>
                                <div className="chat-prop-meta">
                                  <span><i className="ri-hotel-bed-line"></i>{p.beds}</span>
                                  <span><i className="ri-expand-line"></i>{p.area}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem' }}>
                                  <a
                                    href={`/imoveis/${p.id}`}
                                    className="chat-prop-btn"
                                    style={{ flex: 1, background: '#1A2E49' }}
                                  >
                                    <i className="ri-eye-line"></i> Ver imóvel
                                  </a>
                                  <a
                                    href={`https://wa.me/5541984321567?text=Tenho interesse no imóvel: ${encodeURIComponent(p.title)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="chat-prop-btn"
                                    style={{ flex: 1 }}
                                  >
                                    <i className="ri-whatsapp-line"></i> WhatsApp
                                  </a>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {msg.options && msg.options.length > 0 && isLast && !loading && (
                        <div className="chat-options">
                          {msg.options.map(opt => (
                            <button key={opt} className="chat-option-btn" onClick={() => sendMessage(opt)}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="chat-msg assistant">
                  <div className="chat-msg-icon" style={{ overflow: 'hidden' }}><img src="/assistant_avatar.png?v=2" alt="Assistente" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                  <div className="chat-msg-content">
                    <div className="chat-bubble chat-typing">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </div>
              )}

              {showQuickActions && (
                <div className="chat-quick-wrap">
                  <p className="chat-quick-label">Sugestões rápidas:</p>
                  <div className="chat-quick-grid">
                    {QUICK_ACTIONS.map(q => (
                      <button key={q} className="chat-quick-btn" onClick={() => sendMessage(q)}>
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}

          {stage === 'chat' && (
            <form className="chat-footer" onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua mensagem..."
                disabled={loading}
                autoComplete="off"
              />
              <button type="submit" disabled={loading || !input.trim()} aria-label="Enviar">
                <i className="ri-send-plane-fill"></i>
              </button>
            </form>
          )}
        </div>
      )}

      {!open && (
        <div className="chatbot-float-container">
          <div className="chat-tooltip" onClick={() => setOpen(true)}>Fale com um especialista</div>
          <button
            className="chatbot-float-btn"
            onClick={() => setOpen(true)}
            title="Falar com IA"
            aria-label="Abrir assistente virtual"
            style={{ padding: 0, overflow: 'hidden' }}
          >
            <img src="/assistant_avatar.png?v=2" alt="Assistente" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </button>
        </div>
      )}
    </>
  );
}
