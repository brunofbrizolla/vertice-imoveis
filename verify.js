const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:imob123.,12@db.bvgwpbjjxkunsklboosn.supabase.co:5432/postgres'
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
