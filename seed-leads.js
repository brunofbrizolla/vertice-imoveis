const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bvgwpbjjxkunsklboosn.supabase.co';
const supabaseKey = 'sb_publishable_iwY5SyHvh5xL8wyllkd-jA_8Ae7PhSO';
const supabase = createClient(supabaseUrl, supabaseKey);

const leads = [
  {
    name: 'Carlos Mendes',
    whatsapp: '41999998888',
    interest: 'Comprar',
    property: 'Apartamento Alto Padrão no Batel',
    budget: 'Até R$ 900.000',
    neighborhood: 'Batel',
    rooms: '3',
    extras: 'Varanda gourmet, 2 vagas',
    status: 'Novo',
    notes: 'Cliente quer visitar neste sábado pela manhã.'
  },
  {
    name: 'Fernanda Lima',
    whatsapp: '41988887777',
    interest: 'Alugar',
    property: 'Casa Moderna com Piscina',
    budget: 'R$ 5.000 / mês',
    neighborhood: 'Água Verde',
    rooms: '4',
    extras: 'Piscina aquecida, quintal para cachorro',
    status: 'Em atendimento',
    notes: 'Tem urgência para mudar até o fim do mês.'
  },
  {
    name: 'Roberto Costa',
    whatsapp: '41977776666',
    interest: 'Comprar',
    property: 'Cobertura Duplex com Vista Panorâmica',
    budget: 'R$ 1.500.000',
    neighborhood: 'Ecoville',
    rooms: '4',
    extras: 'Vista livre, condomínio clube',
    status: 'Novo',
    notes: 'Precisa vender um apartamento menor antes de fechar negócio.'
  },
  {
    name: 'Amanda Silveira',
    whatsapp: '41966665555',
    interest: 'Alugar',
    property: 'Sala Comercial Prime no Centro',
    budget: 'R$ 8.500 / mês',
    neighborhood: 'Centro',
    rooms: 'Comercial',
    extras: 'Próximo ao metrô, 2 banheiros',
    status: 'Fechado',
    notes: 'Contrato assinado, pegou as chaves ontem.'
  }
];

async function seed() {
  const { data, error } = await supabase.from('leads').insert(leads);
  if (error) {
    console.error('Erro ao inserir leads:', error);
  } else {
    console.log('Leads inseridos com sucesso!');
  }
}

seed();
