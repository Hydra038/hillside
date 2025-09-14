import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './db/schema.mysql';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const initializeDb = () => {
  try {
    console.log('Initializing MySQL database connection...');
    console.log('DATABASE_URL preview:', process.env.DATABASE_URL?.substring(0, 50) + '...');
    const pool = mysql.createPool(process.env.DATABASE_URL!);
  return drizzle(pool, { schema, mode: "default" });
  } catch (error) {
    console.error('Failed to initialize MySQL database:', error);
    throw new Error('Database initialization failed');
  }
};

export const db = initializeDb();
