import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    const seedPath = path.join(__dirname, '../../../database/seed.sql');
    const seedSql = fs.readFileSync(seedPath, 'utf-8');

    console.log('Seeding database...');
    await pool.query(seedSql);
    console.log('✅ Seed completed successfully.');
    console.log('\n   Default admin login:');
    console.log('   Email: admin@sarvicglobal.com');
    console.log('   Password: Admin@Sarvic2024');
    console.log('   ⚠️  Change this password immediately after first login.\n');
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
