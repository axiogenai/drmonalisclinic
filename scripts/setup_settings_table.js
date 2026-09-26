const { Client } = require('pg');

const connectionString = 'postgresql://postgres.vylosndyznvxblifppva:Adi.patil%231@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';

async function run() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL!');

    const sql = `
      CREATE TABLE IF NOT EXISTS public.clinic_settings (
        key TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Allow public read on clinic_settings" ON public.clinic_settings;
      CREATE POLICY "Allow public read on clinic_settings" ON public.clinic_settings FOR SELECT USING (true);

      DROP POLICY IF EXISTS "Allow anon all on clinic_settings" ON public.clinic_settings;
      CREATE POLICY "Allow anon all on clinic_settings" ON public.clinic_settings FOR ALL USING (true);
    `;

    await client.query(sql);
    console.log('clinic_settings table and policies created successfully!');

    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;");
    console.log('Public tables in Supabase:', res.rows.map((r) => r.table_name));

    await client.end();
  } catch (err) {
    console.error('Migration error:', err.message);
    try { await client.end(); } catch (_) {}
    process.exit(1);
  }
}

run();
