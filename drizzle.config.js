require('dotenv').config();

/** @type {import('drizzle-kit').Config} */
module.exports = {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL,
  },
};
