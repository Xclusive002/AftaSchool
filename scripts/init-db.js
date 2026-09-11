import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { getClient, query } from '../lib/db.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function loadLmsCatalog() {
  const sourcePath = path.join(root, 'src', 'data', 'onlineCoursesSeed.ts');
  const source = await fs.readFile(sourcePath, 'utf8');
  const marker = 'export const INITIAL_ONLINE_COURSES';
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) throw new Error(`Could not find ${marker} in ${sourcePath}`);

  const dataSource = `${source.slice(markerIndex).replace(
    /^export const INITIAL_ONLINE_COURSES:\s*[^=]+=/,
    'const INITIAL_ONLINE_COURSES ='
  )}\nreturn INITIAL_ONLINE_COURSES;`;
  const factory = new Function(`${dataSource}`);
  return factory();
}

async function initialize() {
  const schema = await fs.readFile(path.join(root, 'server', 'schema.sql'), 'utf8');
  const client = await getClient();

  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock($1)', [27483921]);
    await client.query(schema);

    const email = process.env.ADMIN_EMAIL;
    const fullName = process.env.ADMIN_FULL_NAME;
    if (!email || !fullName) {
      throw new Error('ADMIN_EMAIL and ADMIN_FULL_NAME are required.');
    }

    await client.query(
      `INSERT INTO users (id, email, full_name, role, department)
       VALUES ($1, $2, $3, 'super_admin', 'Administration')
       ON CONFLICT (email) DO NOTHING`,
      [process.env.ADMIN_USER_ID || 'admin', email, fullName]
    );

    const courses = await loadLmsCatalog();
    for (const course of courses) {
      await client.query(
        `INSERT INTO lms_courses (id, data, active)
         VALUES ($1, $2, $3)
         ON CONFLICT (id) DO NOTHING`,
        [course.id, course, course.active !== false]
      );
    }

    await client.query('COMMIT');
    console.log(`Database initialized. Seeded ${courses.length} LMS courses.`);
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}

initialize()
  .catch((error) => {
    console.error('Database initialization failed:', error);
    process.exitCode = 1;
  });
