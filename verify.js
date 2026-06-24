const { Client } = require('pg');

if (!process.env.DATABASE_URL) {
  console.error('Defina a variável de ambiente DATABASE_URL. Ex.: DATABASE_URL="postgresql://..." node verify.js');
  process.exit(1);
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  try {
    await client.connect();
    
    const props = await client.query('SELECT COUNT(*) FROM properties');
    console.log('Properties count:', props.rows[0].count);
    
    const leads = await client.query('SELECT COUNT(*) FROM leads');
    console.log('Leads count:', leads.rows[0].count);
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

run();
