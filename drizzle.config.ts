import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

export default {
  schema: 'C:/Users/wisem/OneDrive/Documents/FirewoodSite/firewood-ecommerce/src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'mysql',
} satisfies Config;