const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  // Use Supabase IPv4 Pooler (Mumbai region)
  const connectionString = 'postgresql://postgres.vylosndyznvxblifppva:Adi.patil%231@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';
  console.log('Connecting to Supabase IPv4 Pooler database...');

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Successfully connected to Supabase PostgreSQL!');

    const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema.sql...');
    await client.query(sql);
    console.log('Schema migration executed successfully!');

    // Verify tables created
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log('Public tables in Supabase:', res.rows.map(r => r.table_name));

    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err.message);
    try { await client.end(); } catch (_) {}
    process.exit(1);
  }
}

runMigration();
