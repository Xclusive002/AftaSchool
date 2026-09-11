import { randomUUID } from 'node:crypto';
import { query, getClient } from '../../lib/db.js';

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  const text = Buffer.concat(chunks).toString('utf8').trim();
  return text ? JSON.parse(text) : {};
}

const userColumns = `id, email, full_name AS "fullName", phone, whatsapp, role, department,
  student_id AS "studentId", student_number AS "studentNumber",
  admission_number AS "admissionNumber", linked_student_id AS "linkedStudentId",
  created_at AS "createdAt"`;

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return json(res, 405, { success: false, error: 'Method not allowed.' });
  }

  try {
    if (req.method === 'GET') {
      const users = await query(`SELECT ${userColumns} FROM users ORDER BY created_at DESC`);
      return json(res, 200, { success: true, users });
    }

    const payload = await readBody(req);
    if (!payload.email || !payload.fullName || !payload.role) {
      return json(res, 400, { success: false, error: 'Email, full name, and role are required.' });
    }
    const id = payload.id || `usr-${randomUUID()}`;
    const client = await getClient();
    try {
      await client.query('BEGIN');
      const result = await client.query(
        `INSERT INTO users (id, email, full_name, phone, whatsapp, role, department, student_id, student_number, admission_number, linked_student_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING ${userColumns}`,
        [
          id,
          payload.email,
          payload.fullName,
          payload.phone || null,
          payload.whatsapp || null,
          payload.role,
          payload.department || null,
          payload.studentId || null,
          payload.studentNumber || null,
          payload.admissionNumber || null,
          payload.linkedStudentId || null
        ]
      );
      await client.query('COMMIT');
      return json(res, 200, { success: true, user: result.rows[0] });
    } catch (error) {
      await client.query('ROLLBACK').catch(() => undefined);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    return json(res, 500, { success: false, error: error.message });
  }
}
