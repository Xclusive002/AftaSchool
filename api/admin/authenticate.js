import { query } from '../../lib/db.js';

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { success: false, error: 'Method not allowed.' });
  }

  try {
    const body = await readBody(req);
    const suppliedPin = String(body.pin ?? '');
    const expectedPin = String(process.env.ADMIN_ACCESS_PIN ?? '');
    if (suppliedPin !== expectedPin) {
      return json(res, 401, { success: false, error: 'Invalid administrator access PIN.' });
    }

    const users = await query(
      `SELECT id, email, full_name AS "fullName", phone, whatsapp, role, department,
              student_id AS "studentId", student_number AS "studentNumber",
              admission_number AS "admissionNumber", linked_student_id AS "linkedStudentId",
              created_at AS "createdAt"
       FROM users WHERE role IN ('super_admin', 'admin') ORDER BY created_at ASC LIMIT 1`
    );
    if (!users[0]) {
      return json(res, 404, { success: false, error: 'No administrator account exists in the database.' });
    }
    return json(res, 200, { success: true, user: users[0] });
  } catch (error) {
    return json(res, 500, { success: false, error: error.message });
  }
}
