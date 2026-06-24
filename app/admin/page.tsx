'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ── Types ──────────────────────────────────────────────────────────────────

type LeadStatus = 'Novo' | 'Em Contato' | 'Visita Agendada' | 'Proposta Enviada' | 'Fechado' | 'Perdido';

interface Lead {
  id: string;
  name: string | null;
  whatsapp: string | null;
  interest: string | null;
  property: string | null;
  budget: string | null;
  neighborhood: string | null;
  rooms: string | null;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
}

interface Property {
  id: string;
  title: string;
  price: string;
  price_label: string;
  type: 'Venda' | 'Locação';
  location: string;
  beds: string;
  baths: string;
  area: string;
  img: string | null;
  active: boolean;
  created_at: string;
}

const STATUS_COLORS: Record<LeadStatus, string> = {
  'Novo': '#3b82f6',
  'Em Contato': '#f59e0b',
  'Visita Agendada': '#8b5cf6',
  'Proposta Enviada': '#f97316',
  'Fechado': '#22c55e',
  'Perdido': '#ef4444',
};

const CHART_DATA = [
  { month: 'Jan', leads: 12 }, { month: 'Fev', leads: 19 },
  { month: 'Mar', leads: 15 }, { month: 'Abr', leads: 27 },
  { month: 'Mai', leads: 35 }, { month: 'Jun', leads: 23 },
];

const FUNNEL_DATA = [
  { label: 'Novos Leads', count: 47, color: '#3b82f6' },
  { label: 'Em Contato', count: 28, color: '#f59e0b' },
  { label: 'Visita/Proposta', count: 15, color: '#8b5cf6' },
  { label: 'Fechados', count: 8, color: '#22c55e' },
];

// ── Sub-components ────────────────────────────────────────────────────────

function BarChart() {
  const max = Math.max(...CHART_DATA.map(d => d.leads));
  return (
    <div style={{ padding: '1rem 0 0' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: '160px' }}>
        {CHART_DATA.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', height: '100%', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1A2E49' }}>{d.leads}</span>
            <div style={{ width: '100%', background: 'linear-gradient(to top, #1A2E49, #2A4A73)', borderRadius: '6px 6px 0 0', height: `${(d.leads / max) * 130}px`, transition: 'height 0.5s ease', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(217,164,65,0.3), transparent)', borderRadius: 'inherit' }} />
            </div>
            <span style={{ fontSize: '0.7rem', color: '#888', fontWeight: 500 }}>{d.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FunnelChart() {
  const max = FUNNEL_DATA[0].count;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', padding: '0.5rem 0' }}>
      {FUNNEL_DATA.map((d, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#333' }}>{d.label}</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: d.color }}>{d.count}</span>
          </div>
          <div style={{ height: '8px', background: '#f0f0f0', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(d.count / max) * 100}%`, background: d.color, borderRadius: '999px', transition: 'width 0.6s ease' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────

type Tab = 'dashboard' | 'leads' | 'imoveis' | 'visitas';

const EMPTY_PROP = {
  title: '', price: '', price_label: '/ à vista', type: 'Venda' as 'Venda' | 'Locação',
  location: '', beds: '', baths: '', area: '', img: '',
};

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_PROP);
  const [editLeadId, setEditLeadId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Carrega dados reais do Supabase
  useEffect(() => {
    fetch('/api/leads').then(r => r.json()).then(data => { if (Array.isArray(data)) setLeads(data); });
    fetch('/api/properties').then(r => r.json()).then(data => { if (Array.isArray(data)) setProperties(data); });
  }, []);

  const reloadLeads = () => fetch('/api/leads').then(r => r.json()).then(data => { if (Array.isArray(data)) setLeads(data); });
  const reloadProperties = () => fetch('/api/properties').then(r => r.json()).then(data => { if (Array.isArray(data)) setProperties(data); });

  const metrics = {
    leads: leads.length,
    active: properties.filter(p => p.active).length,
    visits: leads.filter(l => l.status === 'Visita Agendada').length,
    closed: leads.filter(l => l.status === 'Fechado').length,
  };

  const filteredLeads = leads.filter(l => {
    const matchSearch =
      (l.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (l.whatsapp ?? '').includes(search) ||
      (l.property ?? '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'Todos' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleUpload = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.url) setForm(prev => ({ ...prev, img: data.url }));
  };

  const addProperty = async () => {
    if (!form.title || !form.price) return;
    setSaving(true);
    await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title, price: form.price, price_label: form.price_label,
        type: form.type, location: form.location, beds: form.beds,
        baths: form.baths, area: form.area,
        img: form.img || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
        active: true,
      }),
    });
    setSaving(false);
    setForm(EMPTY_PROP);
    setShowModal(false);
    reloadProperties();
  };

  const updateLeadStatus = async (id: string, status: LeadStatus) => {
    await fetch('/api/leads', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    setEditLeadId(null);
  };

  const deleteLead = async (id: string) => {
    await fetch('/api/leads', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  const togglePropertyActive = async (id: string, active: boolean) => {
    await fetch('/api/properties', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, active: !active }),
    });
    setProperties(prev => prev.map(p => p.id === id ? { ...p, active: !active } : p));
  };

  const removeProperty = async (id: string) => {
    await fetch('/api/properties', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Poppins', sans-serif", background: '#f4f6f8' }}>
      {/* Sidebar */}
      <aside style={{ width: '240px', background: '#1A2E49', color: '#fff', display: 'flex', flexDirection: 'column', padding: '0', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 32, height: 32, background: '#C9A35B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="ri-landscape-line" style={{ fontSize: '1rem', color: '#14301E' }}></i>
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.9rem' }}>Eucalipto Imobiliária</strong>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Painel CRM</span>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {([
            { key: 'dashboard', icon: 'ri-dashboard-line', label: 'Dashboard' },
            { key: 'leads', icon: 'ri-user-heart-line', label: 'Leads' },
            { key: 'imoveis', icon: 'ri-building-2-line', label: 'Imóveis' },
            { key: 'visitas', icon: 'ri-calendar-check-line', label: 'Visitas Agendadas' },
          ] as { key: Tab; icon: string; label: string }[]).map(item => (
            <button key={item.key} onClick={() => setTab(item.key)} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 1rem',
              borderRadius: '8px', border: 'none', cursor: 'pointer',
              background: tab === item.key ? 'rgba(217,164,65,0.15)' : 'transparent',
              color: tab === item.key ? '#D9A441' : 'rgba(255,255,255,0.65)',
              fontSize: '0.875rem', fontWeight: tab === item.key ? 600 : 400,
              fontFamily: 'inherit', textAlign: 'left', transition: 'all 0.15s',
            }}>
              <i className={item.icon} style={{ fontSize: '1.1rem' }}></i>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textDecoration: 'none', padding: '0.6rem 1rem', borderRadius: '8px', transition: 'color 0.2s' }}>
            <i className="ri-arrow-left-line"></i> Voltar ao site
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', marginTop: '0.5rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="ri-user-line" style={{ fontSize: '0.9rem' }}></i>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block' }}>João Corretor</span>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>Corretor Senior</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        {/* Top bar */}
        <div style={{ background: '#fff', padding: '1rem 2rem', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1A2E49', margin: 0 }}>
              {tab === 'dashboard' && 'Dashboard'}
              {tab === 'leads' && 'Gestão de Leads'}
              {tab === 'imoveis' && 'Portfólio de Imóveis'}
              {tab === 'visitas' && 'Visitas Agendadas'}
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#888', margin: 0 }}>
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {tab === 'imoveis' && (
              <button onClick={() => setShowModal(true)} style={{ background: '#D9A441', color: '#1A2E49', border: 'none', borderRadius: '8px', padding: '0.5rem 1.1rem', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <i className="ri-add-line"></i> Novo Imóvel
              </button>
            )}
            {tab === 'leads' && (
              <button onClick={reloadLeads} style={{ background: '#f4f6f8', color: '#555', border: '1.5px solid #e0e0e0', borderRadius: '8px', padding: '0.5rem 1rem', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <i className="ri-refresh-line"></i> Atualizar
              </button>
            )}
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f4f4f4', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
              <i className="ri-notification-3-line" style={{ color: '#666', fontSize: '1rem' }}></i>
              {leads.filter(l => l.status === 'Novo').length > 0 && (
                <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }}></span>
              )}
            </div>
          </div>
        </div>

        <div style={{ padding: '2rem' }}>

          {/* ── DASHBOARD ── */}
          {tab === 'dashboard' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
                {[
                  { label: 'Total de Leads', value: metrics.leads, icon: 'ri-user-heart-line', color: '#3b82f6', bg: '#eff6ff', delta: 'Leads reais do chat' },
                  { label: 'Imóveis Ativos', value: metrics.active, icon: 'ri-building-2-line', color: '#D9A441', bg: '#fffbeb', delta: `${properties.length} no portfólio` },
                  { label: 'Visitas Agendadas', value: metrics.visits, icon: 'ri-calendar-check-line', color: '#8b5cf6', bg: '#f5f3ff', delta: 'Próximos 7 dias' },
                  { label: 'Fechamentos', value: metrics.closed, icon: 'ri-trophy-line', color: '#22c55e', bg: '#f0fdf4', delta: 'Este mês' },
                ].map((card, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.label}</span>
                      <div style={{ width: 40, height: 40, borderRadius: '10px', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className={card.icon} style={{ fontSize: '1.2rem', color: card.color }}></i>
                      </div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1A2E49', lineHeight: 1 }}>{card.value}</div>
                    <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.5rem' }}>{card.delta}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1A2E49', marginBottom: '0.25rem' }}>Leads por Mês</h3>
                  <p style={{ fontSize: '0.75rem', color: '#888', marginBottom: '1rem' }}>Últimos 6 meses</p>
                  <BarChart />
                </div>
                <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1A2E49', marginBottom: '0.25rem' }}>Funil de Vendas</h3>
                  <p style={{ fontSize: '0.75rem', color: '#888', marginBottom: '1rem' }}>Taxa de conversão: 17%</p>
                  <FunnelChart />
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1A2E49' }}>Leads Recentes</h3>
                  <button onClick={() => setTab('leads')} style={{ fontSize: '0.8rem', color: '#D9A441', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Ver todos <i className="ri-arrow-right-line"></i>
                  </button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                      {['WhatsApp', 'Interesse', 'Imóvel', 'Status', 'Data'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontSize: '0.72rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leads.slice(0, 5).map(lead => (
                      <tr key={lead.id} style={{ borderBottom: '1px solid #f8f8f8' }}>
                        <td style={{ padding: '0.75rem', fontSize: '0.875rem', fontWeight: 600, color: '#333' }}>{lead.name ?? lead.whatsapp ?? '—'}</td>
                        <td style={{ padding: '0.75rem', fontSize: '0.8rem', color: '#666' }}>{lead.interest ?? '—'}</td>
                        <td style={{ padding: '0.75rem', fontSize: '0.8rem', color: '#666' }}>{lead.property ?? '—'}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{ background: STATUS_COLORS[lead.status] + '20', color: STATUS_COLORS[lead.status], padding: '0.2rem 0.7rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700 }}>
                            {lead.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: '0.8rem', color: '#888' }}>
                          {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {leads.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#aaa', fontSize: '0.875rem' }}>
                    Nenhum lead ainda. Leads do chat aparecerão aqui automaticamente.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── VISITAS ── */}
          {tab === 'visitas' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                {/* Visitas Hoje */}
                <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1A2E49', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <i className="ri-calendar-event-line" style={{ color: '#22c55e' }}></i> Visitas Hoje
                    </h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {/* Exemplo de dados vazios para hoje, a menos que tenhamos data da visita */}
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#aaa', fontSize: '0.875rem', background: '#f9f9f9', borderRadius: '8px' }}>
                      Nenhuma visita confirmada para hoje.
                    </div>
                  </div>
                </div>

                {/* Visitas da Semana */}
                <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1A2E49', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <i className="ri-calendar-check-line" style={{ color: '#8b5cf6' }}></i> Próximas (Semana)
                    </h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {leads.filter(l => l.status === 'Visita Agendada').map((lead, idx) => (
                      <div key={lead.id} style={{ padding: '1rem', border: '1px solid #f0f0f0', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ fontSize: '0.9rem', color: '#1A2E49', display: 'block', marginBottom: '0.2rem' }}>
                            {lead.name || lead.whatsapp}
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: '#666', display: 'block', marginBottom: '0.5rem' }}>{lead.property || 'Imóvel a definir'}</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', fontWeight: 700, color: '#8b5cf6', background: '#8b5cf615', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                            <i className="ri-time-line"></i> {idx === 0 ? 'Sábado, 09:30' : 'Data a confirmar'}
                          </span>
                        </div>
                        <a href={`https://wa.me/55${(lead.whatsapp || '').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ width: 36, height: 36, borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: '1.2rem' }}>
                          <i className="ri-whatsapp-line"></i>
                        </a>
                      </div>
                    ))}
                    {leads.filter(l => l.status === 'Visita Agendada').length === 0 && (
                      <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#aaa', fontSize: '0.875rem', background: '#f9f9f9', borderRadius: '8px' }}>
                        Nenhuma visita agendada para os próximos dias.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── LEADS ── */}
          {tab === 'leads' && (
            <div>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1.5px solid #e0e0e0', borderRadius: '8px', padding: '0.55rem 0.9rem' }}>
                  <i className="ri-search-line" style={{ color: '#888' }}></i>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome, WhatsApp ou imóvel..." style={{ border: 'none', outline: 'none', fontFamily: 'inherit', fontSize: '0.875rem', flex: 1, color: '#333' }} />
                </div>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ border: '1.5px solid #e0e0e0', borderRadius: '8px', padding: '0.55rem 0.9rem', fontFamily: 'inherit', fontSize: '0.875rem', color: '#333', outline: 'none', cursor: 'pointer' }}>
                  <option>Todos</option>
                  {(Object.keys(STATUS_COLORS) as LeadStatus[]).map(s => <option key={s}>{s}</option>)}
                </select>
                <span style={{ fontSize: '0.8rem', color: '#888' }}>{filteredLeads.length} resultado(s)</span>
              </div>

              <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: '#f8f9fb' }}>
                    <tr>
                      {['Nome / WhatsApp', 'Interesse', 'Orçamento', 'Status', 'Data', 'Ações'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '0.9rem 1rem', fontSize: '0.72rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map(lead => (
                      <tr key={lead.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1A2E49' }}>{lead.name ?? '(sem nome)'}</div>
                          <div style={{ fontSize: '0.75rem', color: '#888' }}>{lead.whatsapp ?? '—'}</div>
                          {lead.neighborhood && <div style={{ fontSize: '0.72rem', color: '#aaa' }}>{lead.neighborhood}</div>}
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#555' }}>{lead.interest ?? '—'}</td>
                        <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#555' }}>{lead.budget ?? '—'}</td>
                        <td style={{ padding: '1rem' }}>
                          {editLeadId === lead.id ? (
                            <select defaultValue={lead.status} onChange={e => updateLeadStatus(lead.id, e.target.value as LeadStatus)} style={{ border: '1.5px solid #D9A441', borderRadius: '6px', padding: '0.3rem 0.5rem', fontFamily: 'inherit', fontSize: '0.75rem', cursor: 'pointer', outline: 'none' }}>
                              {(Object.keys(STATUS_COLORS) as LeadStatus[]).map(s => <option key={s}>{s}</option>)}
                            </select>
                          ) : (
                            <span onClick={() => setEditLeadId(lead.id)} style={{ background: STATUS_COLORS[lead.status] + '20', color: STATUS_COLORS[lead.status], padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }} title="Clique para alterar">
                              {lead.status}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.8rem', color: '#888', whiteSpace: 'nowrap' }}>
                          {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            {lead.whatsapp && (
                              <a href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, '')}?text=Olá ${lead.name ?? ''}! Vi seu interesse em terrenos na Eucalipto Imobiliária.`} target="_blank" rel="noopener noreferrer" style={{ width: 30, height: 30, borderRadius: '6px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }} title="WhatsApp">
                                <i className="ri-whatsapp-line"></i>
                              </a>
                            )}
                            <button onClick={() => deleteLead(lead.id)} style={{ width: 30, height: 30, borderRadius: '6px', background: '#fee2e2', color: '#ef4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }} title="Remover">
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredLeads.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                    <i className="ri-user-search-line" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}></i>
                    {leads.length === 0 ? 'Nenhum lead ainda. Eles aparecerão aqui quando alguém conversar com a IA.' : 'Nenhum lead encontrado'}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── IMÓVEIS ── */}
          {tab === 'imoveis' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                {properties.map(p => (
                  <div key={p.id} style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', opacity: p.active ? 1 : 0.55 }}>
                    <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.img ?? 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80'} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', background: p.type === 'Venda' ? '#D9A441' : '#22c55e', color: p.type === 'Venda' ? '#1A2E49' : '#fff', padding: '0.2rem 0.65rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>
                        {p.type}
                      </span>
                      {!p.active && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem', background: 'rgba(0,0,0,0.5)', padding: '0.3rem 0.8rem', borderRadius: '6px' }}>Inativo</span>
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '1.1rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1A2E49' }}>{p.price} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#888' }}>{p.price_label}</span></div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#333', margin: '0.25rem 0' }}>{p.title}</div>
                      <div style={{ fontSize: '0.78rem', color: '#888', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <i className="ri-map-pin-2-line"></i>{p.location}
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: '#666', borderTop: '1px solid #f0f0f0', paddingTop: '0.75rem', marginBottom: '0.75rem' }}>
                        <span><i className="ri-hotel-bed-line"></i> {p.beds}</span>
                        <span><i className="ri-bath-line"></i> {p.baths}</span>
                        <span><i className="ri-expand-line"></i> {p.area}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => togglePropertyActive(p.id, p.active)} style={{ flex: 1, padding: '0.45rem', borderRadius: '6px', border: '1.5px solid #e0e0e0', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.78rem', fontWeight: 600, color: '#555' }}>
                          {p.active ? 'Desativar' : 'Ativar'}
                        </button>
                        <button onClick={() => removeProperty(p.id)} style={{ padding: '0.45rem 0.75rem', borderRadius: '6px', border: 'none', background: '#fee2e2', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem' }}>
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Add Property Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1A2E49' }}>Novo Imóvel</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#666' }}>
                <i className="ri-close-line"></i>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { label: 'Título *', key: 'title', full: true, placeholder: 'Ex: Apartamento no Batel' },
                { label: 'Preço *', key: 'price', placeholder: 'Ex: R$ 500.000' },
                { label: 'Complemento', key: 'price_label', placeholder: '/ à vista' },
                { label: 'Localização', key: 'location', placeholder: 'Ex: Batel – PR' },
                { label: 'Quartos', key: 'beds', placeholder: 'Ex: 3 quartos' },
                { label: 'Banheiros', key: 'baths', placeholder: 'Ex: 2 banheiros' },
                { label: 'Área', key: 'area', placeholder: 'Ex: 120m²' },
              ].map(field => (
                <div key={field.key} style={{ gridColumn: field.full ? '1/-1' : 'auto' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#1A2E49', marginBottom: '0.35rem' }}>{field.label}</label>
                  <input value={(form as Record<string, string>)[field.key]} onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))} placeholder={field.placeholder} style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: '8px', padding: '0.6rem 0.85rem', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#1A2E49', marginBottom: '0.35rem' }}>Tipo</label>
                <select value={form.type} onChange={e => setForm(prev => ({ ...prev, type: e.target.value as 'Venda' | 'Locação' }))} style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: '8px', padding: '0.6rem 0.85rem', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none' }}>
                  <option>Venda</option>
                  <option>Locação</option>
                </select>
              </div>

              {/* Upload de foto */}
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#1A2E49', marginBottom: '0.35rem' }}>Foto do Imóvel</label>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0]); }} />
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1.5px dashed #D9A441', background: '#fffbeb', color: '#1A2E49', fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <i className="ri-upload-cloud-line"></i> {uploading ? 'Enviando...' : 'Fazer upload'}
                  </button>
                  {form.img && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={form.img} alt="preview" style={{ height: 48, width: 72, objectFit: 'cover', borderRadius: '6px', border: '1.5px solid #e0e0e0' }} />
                  )}
                </div>
                {!form.img && (
                  <input value={form.img} onChange={e => setForm(prev => ({ ...prev, img: e.target.value }))} placeholder="Ou cole uma URL de imagem..." style={{ marginTop: '0.5rem', width: '100%', border: '1.5px solid #e0e0e0', borderRadius: '8px', padding: '0.6rem 0.85rem', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1.5px solid #e0e0e0', background: 'transparent', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', color: '#555' }}>
                Cancelar
              </button>
              <button onClick={addProperty} disabled={!form.title || !form.price || saving || uploading} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', background: '#D9A441', color: '#1A2E49', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', opacity: (!form.title || !form.price || saving || uploading) ? 0.5 : 1 }}>
                <i className="ri-add-line"></i> {saving ? 'Salvando...' : 'Adicionar Imóvel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
