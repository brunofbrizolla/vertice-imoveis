const fs = require('fs');
const { Client } = require('pg');

if (!process.env.DATABASE_URL) {
  console.error('Defina a variável de ambiente DATABASE_URL. Ex.: DATABASE_URL="postgresql://..." node run_migration.js');
  process.exit(1);
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
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
