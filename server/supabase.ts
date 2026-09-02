import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { INITIAL_ONLINE_COURSES } from '../src/data/onlineCoursesSeed';

const { Pool } = pg;

export const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
export const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
export const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const databaseUrl = process.env.DATABASE_URL || '';

export const getSupabaseAdminClient = (): SupabaseClient | null => {
  if (!supabaseUrl || !supabaseServiceRoleKey) return null;

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
};

export const supabasePool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
    })
  : null;

export const isPostgresConfigured = Boolean(supabasePool);

export async function initializeDatabaseSchema(): Promise<void> {
  if (!supabasePool) return;
  const schemaPath = path.join(process.cwd(), 'server', 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  await supabasePool.query(schema);
}

export async function initializeAdminUser(): Promise<void> {
  if (!supabasePool) return;
  const email = process.env.ADMIN_EMAIL;
  const fullName = process.env.ADMIN_FULL_NAME;
  if (!email || !fullName) throw new Error('ADMIN_EMAIL and ADMIN_FULL_NAME are required when Postgres is configured.');
  await supabasePool.query(
    `INSERT INTO users (id, email, full_name, role, department)
     VALUES ($1, $2, $3, 'super_admin', 'Administration')
     ON CONFLICT (email) DO NOTHING`,
    [process.env.ADMIN_USER_ID || 'admin', email, fullName]
  );
}

export async function initializeLmsCatalog(): Promise<void> {
  if (!supabasePool) return;
  const existing = await supabasePool.query('SELECT 1 FROM lms_courses LIMIT 1');
  if (existing.rowCount) return;
  for (const course of INITIAL_ONLINE_COURSES) {
    await supabasePool.query(
      `INSERT INTO lms_courses (id, data, active) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`,
      [course.id, course, course.active]
    );
  }
}

export async function queryDatabase<T = Record<string, any>>(sql: string, params: any[] = []): Promise<T[]> {
  if (!supabasePool) return [];

  const result = await supabasePool.query(sql, params);
  return result.rows as T[];
}
