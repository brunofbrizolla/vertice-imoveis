const fs = require('fs');
const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:imob123.,12@db.bvgwpbjjxkunsklboosn.supabase.co:5432/postgres'
});

async function run() {
  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected!');
    
    const sql = fs.readFileSync('supabase/migrations/20260611000001_create_properties.sql', 'utf8');
    console.log('Executing migration...');
    await client.query(sql);
    console.log('Migration executed successfully!');
  } catch (err) {
    console.error('Error executing migration:', err);
  } finally {
    await client.end();
  }
}

run();
