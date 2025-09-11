import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  driver: 'vercel-postgres',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
} satisfies Config;
