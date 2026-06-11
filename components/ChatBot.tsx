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
}

const QUICK_ACTIONS = [
  'Quero comprar um imóvel',
  'Preciso alugar um imóvel',
  'Quero vender / avaliar meu imóvel',
  'Quero falar com um corretor',
];

function parseResponse(raw: string, allProps: Property[]): { text: string; properties: Property[] } {
  const match = raw.match(/<properties>\[([^\]]*)\]<\/properties>/);
  let properties: Property[] = [];
  if (match && match[1].trim()) {
    const ids = match[1].split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    properties = allProps.filter(p => ids.includes(p.seq));
  }
  const text = raw.replace(/<properties>[\s\S]*?<\/properties>/g, '').trim();
  return { text, properties };
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Olá! Seja bem-vindo à Vértice Imóveis! 😊 Sou a Vértice, sua corretora virtual. Estou aqui para te ajudar a encontrar o imóvel perfeito em Curitiba.\n\nPrimeiro, me conta: você está procurando um imóvel para comprar, alugar, ou quer vender/avaliar um imóvel?',
    },
  ]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      inputRef.current?.focus();
    }
  }, [open, messages]);

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
        body: JSON.stringify({ messages: apiMessages, leadId }),
      });
      const data = await res.json();

      if (data.leadId && !leadId) setLeadId(data.leadId);

      const { text: cleanText, properties } = parseResponse(data.content || '', allProperties);

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: cleanText, properties: properties.length ? properties : undefined },
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

  const showQuickActions = messages.length === 1 && !loading;

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
                <strong>Assistente Vértice</strong>
                <span><span className="chat-online-dot"></span>IA · Online agora</span>
              </div>
            </div>
            <button className="chat-close-btn" onClick={() => setOpen(false)}>
              <i className="ri-close-line"></i>
            </button>
          </div>

          <div className="chat-body">
            {messages.map((msg, i) => (
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
                </div>
              </div>
            ))}

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
        </div>
      )}

      {!open && (
        <div className="chatbot-float-container">
          <div className="chat-tooltip" onClick={() => setOpen(true)}>Fale com um corretor</div>
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
