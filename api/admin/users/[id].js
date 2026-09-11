import { query } from '../../../lib/db.js';

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
  if (req.method !== 'PUT') {
    res.setHeader('Allow', 'PUT');
    return json(res, 405, { success: false, error: 'Method not allowed.' });
  }

  try {
    const id = Array.isArray(req.query?.id) ? req.query.id[0] : req.query?.id;
    const updates = await readBody(req);
    const result = await query(
      `UPDATE users SET full_name = COALESCE($2, full_name), email = COALESCE($3, email),
         phone = $4, whatsapp = $5, role = COALESCE($6, role), department = $7,
         student_number = $8, admission_number = $9, linked_student_id = $10, updated_at = NOW()
       WHERE id = $1
       RETURNING id, email, full_name AS "fullName", phone, whatsapp, role, department,
                 student_id AS "studentId", student_number AS "studentNumber",
                 admission_number AS "admissionNumber", linked_student_id AS "linkedStudentId",
                 created_at AS "createdAt"`,
      [
        id,
        updates.fullName,
        updates.email,
        updates.phone || null,
        updates.whatsapp || null,
        updates.role,
        updates.department || null,
        updates.studentNumber || null,
        updates.admissionNumber || null,
        updates.linkedStudentId || null
      ]
    );
    if (!result.rows[0]) return json(res, 404, { success: false, message: 'User not found' });
    return json(res, 200, { success: true, user: result.rows[0] });
  } catch (error) {
    return json(res, 500, { success: false, error: error.message });
  }
}
