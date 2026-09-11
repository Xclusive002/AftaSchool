import pg from 'pg';

const { Pool } = pg;
const poolKey = Symbol.for('aitischool.pg.pool');
const globalState = globalThis;

function requireDatabaseUrl() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is required for the deployed application.');
  }
  return connectionString;
}

function createPool() {
  const connectionString = requireDatabaseUrl();
  const parsed = new URL(connectionString);

  // For Supabase, DATABASE_URL should be the pooler URL (port 6543 / PgBouncer),
  // not the direct database URL. Set that pooled URL in Vercel environment variables.
  if (parsed.hostname.includes('supabase') && parsed.port === '5432') {
    console.warn('DATABASE_URL uses Supabase port 5432; use the pooled port 6543 URL for Vercel.');
  }

  return new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
    ssl: parsed.hostname.includes('supabase') ? { rejectUnauthorized: false } : undefined
  });
}

function getPool() {
  if (!globalState[poolKey]) {
    globalState[poolKey] = createPool();
  }
  return globalState[poolKey];
}

export async function query(sql, params = []) {
  const result = await getPool().query(sql, params);
  return result.rows;
}

export async function getClient() {
  return getPool().connect();
}

export { getPool };
