const { Client } = require('pg');

if (!process.env.DATABASE_URL) {
  console.error('Defina a variável de ambiente DATABASE_URL. Ex.: DATABASE_URL="postgresql://..." node insert_lands.js');
  process.exit(1);
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
async function run() {
  try {
    await client.connect();
    const sql = `
      insert into properties (title, price, price_label, type, location, beds, baths, area, img) values
      ('Lote em Condomínio Fechado', 'R$ 450.000', '/ à vista', 'Venda', 'Santa Felicidade – PR', 'Terreno', 'Lote/Área', '600m²', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80'),
      ('Terreno Comercial de Esquina', 'R$ 1.200.000', '/ à vista', 'Venda', 'Batel – PR', 'Terreno', 'Lote/Área', '850m²', 'https://images.unsplash.com/photo-1583095066914-99d9804b31a3?w=600&q=80'),
      ('Terreno Misto para Construtora', 'R$ 2.500.000', '/ à vista', 'Venda', 'Ecoville – PR', 'Terreno', 'Lote/Área', '1200m²', 'https://images.unsplash.com/photo-1596767690620-1a74ed0a49de?w=600&q=80')
    `;
    await client.query(sql);
    console.log('Terrenos inseridos');
  } catch(e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
