import postgres from 'postgres';

const PROJECT_REF = "azroqikfuffnppscrgvf";
const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD;

if (!DB_PASSWORD) {
  console.error("❌ SUPABASE_DB_PASSWORD env variable is not set.");
  process.exit(1);
}

const sql = postgres({
  host: `db.${PROJECT_REF}.supabase.co`,
  port: 5432,
  database: 'postgres',
  username: 'postgres',
  password: DB_PASSWORD,
  ssl: 'require',
  max: 1,
  connect_timeout: 15,
});

async function run() {
  try {
    console.log('Connecting to Supabase...');

    // Test connection
    const test = await sql`SELECT current_database(), current_user`;
    console.log('Connected:', test[0]);

    // Check if tables already exist
    const existing = await sql`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name LIKE 'dealer%'
    `;
    console.log('Existing dealer tables:', existing.map(r => r.table_name));

    // Step 1
    console.log('\nStep 1: Adding dealer_status to profiles...');
    await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dealer_status TEXT`;
    console.log('✓ dealer_status column added');

    // Step 2
    console.log('\nStep 2: Creating dealer_profiles...');
    await sql`
      CREATE TABLE IF NOT EXISTS dealer_profiles (
        id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id          UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
        company_name     TEXT NOT NULL,
        contact_name     TEXT NOT NULL,
        email            TEXT NOT NULL,
        phone            TEXT NOT NULL,
        address_line1    TEXT NOT NULL,
        address_line2    TEXT,
        city             TEXT NOT NULL,
        postcode         TEXT NOT NULL,
        fca_frn          TEXT,
        website          TEXT,
        status           TEXT NOT NULL DEFAULT 'pending_approval',
        rejection_reason TEXT,
        approved_at      TIMESTAMPTZ,
        approved_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
        created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;
    console.log('✓ dealer_profiles created');

    await sql`CREATE INDEX IF NOT EXISTS idx_dealer_profiles_user_id ON dealer_profiles (user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_dealer_profiles_status ON dealer_profiles (status)`;
    await sql`
      CREATE OR REPLACE FUNCTION set_dealer_profiles_updated_at()
      RETURNS TRIGGER LANGUAGE plpgsql AS $$
      BEGIN NEW.updated_at = now(); RETURN NEW; END;
      $$
    `;
    await sql`DROP TRIGGER IF EXISTS dealer_profiles_updated_at ON dealer_profiles`;
    await sql`
      CREATE TRIGGER dealer_profiles_updated_at
        BEFORE UPDATE ON dealer_profiles
        FOR EACH ROW EXECUTE FUNCTION set_dealer_profiles_updated_at()
    `;
    await sql`ALTER TABLE dealer_profiles ENABLE ROW LEVEL SECURITY`;
    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='dealer_profiles' AND policyname='dealer_own_profile') THEN
          CREATE POLICY "dealer_own_profile" ON dealer_profiles FOR ALL TO authenticated
            USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
        END IF;
      END $$
    `;
    console.log('✓ dealer_profiles indexes, triggers, RLS done');

    // Step 3
    console.log('\nStep 3: Creating dealer_listings...');
    await sql`
      CREATE TABLE IF NOT EXISTS dealer_listings (
        id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        dealer_id         UUID NOT NULL REFERENCES dealer_profiles(id) ON DELETE CASCADE,
        status            TEXT NOT NULL DEFAULT 'draft',
        rejection_reason  TEXT,
        brand             TEXT NOT NULL,
        model             TEXT NOT NULL,
        year              INTEGER NOT NULL,
        price             NUMERIC(10,2) NOT NULL,
        mileage           INTEGER NOT NULL,
        colour            TEXT,
        description       TEXT,
        images            TEXT[] DEFAULT '{}',
        range_km          INTEGER,
        battery_kwh       NUMERIC(5,2),
        drive             TEXT,
        body_type         TEXT,
        charging_standard TEXT,
        seats             INTEGER,
        location          TEXT,
        reviewed_by       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
        reviewed_at       TIMESTAMPTZ,
        created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;
    console.log('✓ dealer_listings created');

    await sql`CREATE INDEX IF NOT EXISTS idx_dealer_listings_dealer_id ON dealer_listings (dealer_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_dealer_listings_status ON dealer_listings (status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_dealer_listings_created_at ON dealer_listings (created_at DESC)`;
    await sql`
      CREATE OR REPLACE FUNCTION set_dealer_listings_updated_at()
      RETURNS TRIGGER LANGUAGE plpgsql AS $$
      BEGIN NEW.updated_at = now(); RETURN NEW; END;
      $$
    `;
    await sql`DROP TRIGGER IF EXISTS dealer_listings_updated_at ON dealer_listings`;
    await sql`
      CREATE TRIGGER dealer_listings_updated_at
        BEFORE UPDATE ON dealer_listings
        FOR EACH ROW EXECUTE FUNCTION set_dealer_listings_updated_at()
    `;
    await sql`ALTER TABLE dealer_listings ENABLE ROW LEVEL SECURITY`;
    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='dealer_listings' AND policyname='dealer_own_listings') THEN
          CREATE POLICY "dealer_own_listings" ON dealer_listings FOR ALL TO authenticated
            USING (dealer_id IN (SELECT id FROM dealer_profiles WHERE user_id = auth.uid()))
            WITH CHECK (dealer_id IN (SELECT id FROM dealer_profiles WHERE user_id = auth.uid()));
        END IF;
      END $$
    `;
    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='dealer_listings' AND policyname='public_read_live_listings') THEN
          CREATE POLICY "public_read_live_listings" ON dealer_listings FOR SELECT TO anon, authenticated
            USING (status = 'live');
        END IF;
      END $$
    `;
    console.log('✓ dealer_listings indexes, triggers, RLS done');

    // Step 4
    console.log('\nStep 4: Creating dealer_enquiries...');
    await sql`
      CREATE TABLE IF NOT EXISTS dealer_enquiries (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        listing_id  UUID NOT NULL REFERENCES dealer_listings(id) ON DELETE CASCADE,
        dealer_id   UUID NOT NULL REFERENCES dealer_profiles(id) ON DELETE CASCADE,
        full_name   TEXT NOT NULL,
        email       TEXT NOT NULL,
        phone       TEXT,
        message     TEXT,
        is_read     BOOLEAN NOT NULL DEFAULT false,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;
    console.log('✓ dealer_enquiries created');

    await sql`CREATE INDEX IF NOT EXISTS idx_dealer_enquiries_dealer_id ON dealer_enquiries (dealer_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_dealer_enquiries_listing_id ON dealer_enquiries (listing_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_dealer_enquiries_is_read ON dealer_enquiries (is_read)`;
    await sql`ALTER TABLE dealer_enquiries ENABLE ROW LEVEL SECURITY`;
    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='dealer_enquiries' AND policyname='dealer_own_enquiries') THEN
          CREATE POLICY "dealer_own_enquiries" ON dealer_enquiries FOR SELECT TO authenticated
            USING (dealer_id IN (SELECT id FROM dealer_profiles WHERE user_id = auth.uid()));
        END IF;
      END $$
    `;
    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='dealer_enquiries' AND policyname='public_insert_enquiry') THEN
          CREATE POLICY "public_insert_enquiry" ON dealer_enquiries FOR INSERT TO anon, authenticated
            WITH CHECK (true);
        END IF;
      END $$
    `;
    console.log('✓ dealer_enquiries indexes, RLS done');

    // Reload PostgREST schema cache
    console.log('\nReloading PostgREST schema cache...');
    await sql`NOTIFY pgrst, 'reload schema'`;
    console.log('✓ Schema cache reloaded');

    // Verify
    const tables = await sql`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name LIKE 'dealer%'
      ORDER BY table_name
    `;
    console.log('\n✅ Dealer tables in DB:', tables.map(r => r.table_name));

    const col = await sql`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'profiles' AND column_name = 'dealer_status'
    `;
    console.log('✅ dealer_status column on profiles:', col.length > 0 ? 'YES' : 'MISSING');

  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    await sql.end();
  }
}

run();
