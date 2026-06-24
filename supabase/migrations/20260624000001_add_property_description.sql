-- Adiciona descrição em texto aos imóveis
alter table properties add column if not exists description text;

-- Adiciona galeria de fotos (várias imagens por imóvel)
alter table properties add column if not exists images text[] default '{}';

-- Tipo de imóvel: Terreno, Casa ou Apartamento
alter table properties add column if not exists property_type text;
