// Re-export the Supabase admin client for database operations
// This replaces Drizzle ORM to avoid DNS issues
export { supabaseAdmin as db } from './supabase-admin';
