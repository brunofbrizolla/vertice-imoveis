-- Tabela de imóveis
create table if not exists properties (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  price       text not null,
  price_label text not null default '/ à vista',
  type        text not null check (type in ('Venda', 'Locação')),
  location    text not null,
  beds        text not null,
  baths       text not null,
  area        text not null,
  img         text,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Tabela de leads
create table if not exists leads (
  id           uuid primary key default gen_random_uuid(),
  name         text,
  whatsapp     text,
  interest     text,
  property     text,
  budget       text,
  neighborhood text,
  rooms        text,
  extras       text,
  status       text not null default 'Novo',
  notes        text,
  created_at   timestamptz not null default now()
);

-- RLS: leitura pública dos imóveis ativos
alter table properties enable row level security;
create policy "Imóveis ativos visíveis" on properties
  for select using (active = true);
create policy "Admin pode tudo em properties" on properties
  for all using (true);

-- RLS: leads só escrita pública (insert), leitura só admin
alter table leads enable row level security;
create policy "Qualquer um pode criar lead" on leads
  for insert with check (true);
create policy "Admin pode ler leads" on leads
  for select using (true);
create policy "Admin pode atualizar leads" on leads
  for update using (true);

-- Storage bucket para fotos dos imóveis
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

-- Política: qualquer um lê as fotos (bucket público)
create policy "Fotos visíveis publicamente" on storage.objects
  for select using (bucket_id = 'property-images');

-- Política: upload permitido (admin vai usar service_role, mas deixamos aberto para demo)
create policy "Upload de fotos permitido" on storage.objects
  for insert with check (bucket_id = 'property-images');

create policy "Delete de fotos permitido" on storage.objects
  for delete using (bucket_id = 'property-images');

-- Dados iniciais — os 6 imóveis já existentes
insert into properties (title, price, price_label, type, location, beds, baths, area, img) values
  ('Apartamento Alto Padrão no Batel',      'R$ 850.000',   '/ à vista', 'Venda',   'Batel – PR',      '3 quartos',  '2 banheiros', '120m²', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80'),
  ('Casa Moderna com Piscina',              'R$ 4.500',     '/ mês',     'Locação', 'Água Verde – PR', '4 quartos',  '3 banheiros', '280m²', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80'),
  ('Cobertura Duplex com Vista Panorâmica', 'R$ 1.350.000', '/ à vista', 'Venda',   'Ecoville – PR',   '4 quartos',  '4 banheiros', '320m²', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80'),
  ('Apartamento Compacto no Bigorrilho',    'R$ 480.000',   '/ à vista', 'Venda',   'Bigorrilho – PR', '2 quartos',  '2 banheiros', '75m²',  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80'),
  ('Sala Comercial Prime no Centro',        'R$ 8.000',     '/ mês',     'Locação', 'Centro – PR',     'Comercial',  '2 banheiros', '180m²', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80'),
  ('Casa Residencial nas Mercês',           'R$ 720.000',   '/ à vista', 'Venda',   'Mercês – PR',     '3 quartos',  '3 banheiros', '210m²', 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=600&q=80');
