import { drizzle } from 'drizzle-orm/vercel-postgres';
import { migrate } from 'drizzle-orm/vercel-postgres/migrator';
import { sql } from '@vercel/postgres';

async function main() {
  try {
    const db = drizzle(sql);
    
    console.log('Running migrations...');
    
    await migrate(db, { migrationsFolder: './drizzle' });
    
    console.log('Migrations complete!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

main();
