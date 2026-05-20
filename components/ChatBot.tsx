'use client';
import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from 'react';

const PROPERTIES = [
  { id: 1, title: "Apartamento Alto Padrão no Batel", price: "R$ 850.000", priceLabel: "/ à vista", type: "Venda", location: "Batel – PR", beds: "3 quartos", baths: "2 banheiros", area: "120m²", img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80" },
  { id: 2, title: "Casa Moderna com Piscina", price: "R$ 4.500", priceLabel: "/ mês", type: "Locação", location: "Água Verde – PR", beds: "4 quartos", baths: "3 banheiros", area: "280m²", img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80" },
  { id: 3, title: "Cobertura Duplex com Vista Panorâmica", price: "R$ 1.350.000", priceLabel: "/ à vista", type: "Venda", location: "Centro – PR", beds: "4 quartos", baths: "4 banheiros", area: "320m²", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80" },
  { id: 4, title: "Apartamento Compacto no Bigorrilho", price: "R$ 480.000", priceLabel: "/ à vista", type: "Venda", location: "Bigorrilho – PR", beds: "2 quartos", baths: "2 banheiros", area: "75m²", img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80" },
  { id: 5, title: "Sala Comercial Prime no Centro", price: "R$ 8.000", priceLabel: "/ mês", type: "Locação", location: "Centro – PR", beds: "Comercial", baths: "2 banheiros", area: "180m²", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80" },
  { id: 6, title: "Casa Residencial nas Mercês", price: "R$ 720.000", priceLabel: "/ à vista", type: "Venda", location: "Mercês – PR", beds: "3 quartos", baths: "3 banheiros", area: "210m²", img: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=600&q=80" },
];

type Property = typeof PROPERTIES[0];

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

function parseResponse(raw: string): { text: string; properties: Property[] } {
  const match = raw.match(/<properties>\[([^\]]*)\]<\/properties>/);
  let properties: Property[] = [];
  if (match && match[1].trim()) {
    const ids = match[1].split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    properties = PROPERTIES.filter(p => ids.includes(p.id));
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
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
        body: JSON.stringify({ messages: apiMessages }),
      });
      const data = await res.json();
      const { text: cleanText, properties } = parseResponse(data.content || '');

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
              <div className="chat-avatar-icon">
                <i className="ri-robot-2-line"></i>
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
                  <div className="chat-msg-icon"><i className="ri-robot-2-line"></i></div>
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
                              {p.price} <span>{p.priceLabel}</span>
                            </p>
                            <p className="chat-prop-loc">
                              <i className="ri-map-pin-2-line"></i>{p.location}
                            </p>
                            <div className="chat-prop-meta">
                              <span><i className="ri-hotel-bed-line"></i>{p.beds}</span>
                              <span><i className="ri-expand-line"></i>{p.area}</span>
                            </div>
                            <a
                              href={`https://wa.me/5541984321567?text=Tenho interesse no imóvel: ${encodeURIComponent(p.title)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="chat-prop-btn"
                            >
                              <i className="ri-whatsapp-line"></i> Tenho interesse
                            </a>
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
                <div className="chat-msg-icon"><i className="ri-robot-2-line"></i></div>
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

      <button
        className={`chatbot-float-btn${open ? ' open' : ''}`}
        onClick={() => setOpen(v => !v)}
        title={open ? 'Fechar chat' : 'Falar com IA'}
        aria-label={open ? 'Fechar chat' : 'Abrir assistente virtual'}
      >
        {open ? (
          <i className="ri-close-line"></i>
        ) : (
          <>
            <i className="ri-robot-2-line"></i>
            <span className="chatbot-float-badge">IA</span>
          </>
        )}
      </button>
    </>
  );
}
