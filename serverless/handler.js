import { parse } from 'node:url';
import { randomUUID } from 'node:crypto';
import { query, getClient } from '../lib/db.js';

export function json(res, status, body) {
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

function methodNotAllowed(res, methods) {
  res.setHeader('Allow', methods.join(', '));
  return json(res, 405, { success: false, error: 'Method not allowed.' });
}

async function publicRecords(collection, predicate = () => true, orderBy = 'updated_at DESC') {
  const rows = await query(
    `SELECT data FROM app_records WHERE collection = $1 ORDER BY ${orderBy}`,
    [collection]
  );
  return rows.map((row) => row.data).filter(predicate);
}

function nextQuoteReference(rows) {
  const next = Number(rows[0]?.next_number || 1);
  return `AITI/QT/${new Date().getUTCFullYear()}/${String(next).padStart(6, '0')}`;
}

async function getSettings(client) {
  const result = await client.query('SELECT data FROM institute_settings WHERE section = $1', ['institute']);
  return result.rows[0]?.data || {};
}

async function nextTableNumber(client, table, prefix) {
  const result = await client.query(`SELECT COUNT(*)::int + 1 AS next_number FROM ${table}`);
  return `${prefix}${String(result.rows[0].next_number).padStart(6, '0')}`;
}

async function nextCollectionNumber(client, collection, prefix) {
  const result = await client.query(
    'SELECT COUNT(*)::int + 1 AS next_number FROM app_records WHERE collection = $1',
    [collection]
  );
  return `${prefix}${String(result.rows[0].next_number).padStart(6, '0')}`;
}

async function writeAudit(client, { userName, userRole, action, entityType, entityId, details }) {
  await client.query(
    `INSERT INTO audit_logs (id, user_id, user_name, user_role, action, entity_type, entity_id, details, timestamp)
     VALUES ($1, 'system', $2, $3, $4, $5, $6, $7, $8)`,
    [`log-${randomUUID()}`, userName, userRole, action, entityType, entityId, details, new Date().toISOString()]
  );
}

async function findApplication(client, id) {
  const result = await client.query(
    `SELECT id, data FROM applications
     WHERE id = $1 OR data->>'applicationId' = $1
     LIMIT 1`,
    [id]
  );
  return result.rows[0] || null;
}

async function findAdmission(client, id) {
  const result = await client.query(
    `SELECT id, data FROM admissions
     WHERE id = $1 OR data->>'admissionNumber' = $1
     LIMIT 1`,
    [id]
  );
  return result.rows[0] || null;
}

async function findCollectionRecord(client, collection, id) {
  const result = await client.query(
    'SELECT id, data FROM app_records WHERE collection = $1 AND id = $2 LIMIT 1',
    [collection, id]
  );
  return result.rows[0] || null;
}

export default async function handler(req, res) {
  const requestUrl = parse(req.url || '/', true);
  const route = requestUrl.pathname || '/';

  if (!route.startsWith('/api/')) {
    return json(res, 404, { success: false, error: 'Not found.' });
  }

  try {
    if (route === '/api/settings') {
      if (req.method === 'GET') {
        const rows = await query('SELECT data FROM institute_settings WHERE section = $1', ['institute']);
        return json(res, 200, { success: true, settings: rows[0]?.data || null });
      }
      if (req.method === 'PUT') {
        const body = await readBody(req);
        const rows = await query(
          `INSERT INTO institute_settings (section, data, updated_at)
           VALUES ('institute', $1, NOW())
           ON CONFLICT (section) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
           RETURNING data`,
          [body]
        );
        return json(res, 200, { success: true, settings: rows[0].data, message: 'Settings saved successfully.' });
      }
      return methodNotAllowed(res, ['GET', 'PUT']);
    }

    if (route === '/api/applications' && req.method === 'GET') {
      const filters = requestUrl.query;
      const values = [];
      const clauses = [];
      if (filters.email) {
        values.push(String(filters.email));
        clauses.push(`LOWER(data->>'email') = LOWER($${values.length})`);
      }
      if (filters.applicationId) {
        values.push(String(filters.applicationId));
        clauses.push(`LOWER(data->>'applicationId') = LOWER($${values.length})`);
      }
      const result = await query(
        `SELECT data FROM applications${clauses.length ? ` WHERE ${clauses.join(' AND ')}` : ''} ORDER BY created_at DESC`,
        values
      );
      return json(res, 200, { success: true, applications: result.map((row) => row.data) });
    }

    if (route === '/api/applications' && req.method === 'POST') {
      const payload = await readBody(req);
      const client = await getClient();
      try {
        await client.query('BEGIN');
        const settings = await getSettings(client);
        const prefix = settings.numbering?.applicationPrefix || `AITI/${new Date().getUTCFullYear()}/`;
        const applicationId = await nextTableNumber(client, 'applications', prefix);
        const now = new Date().toISOString();
        const application = {
          id: `app-${randomUUID()}`,
          applicationId,
          ...payload,
          status: payload.status || 'submitted',
          createdAt: now,
          updatedAt: now
        };
        await client.query(
          `INSERT INTO applications (id, data, created_at, updated_at) VALUES ($1, $2, $3, $3)`,
          [application.id, application, now]
        );

        const lead = {
          id: `lead-${randomUUID()}`,
          fullName: `${application.firstName} ${application.lastName}`,
          email: application.email,
          phone: application.phone,
          whatsapp: application.whatsapp,
          programInterest: application.programTitle,
          source: 'website',
          status: 'applied',
          notes: `Submitted online application ${applicationId}`,
          createdAt: now
        };
        await client.query(
          `INSERT INTO app_records (collection, id, data, updated_at) VALUES ($1, $2, $3, $4)`,
          ['leads', lead.id, lead, now]
        );
        await writeAudit(client, {
          userName: `${application.firstName} ${application.lastName}`,
          userRole: 'student',
          action: 'APPLICATION_SUBMITTED',
          entityType: 'Application',
          entityId: applicationId,
          details: `New application submitted for ${application.programTitle}`
        });
        await client.query('COMMIT');
        return json(res, 200, { success: true, application, message: 'Application submitted successfully.' });
      } catch (error) {
        await client.query('ROLLBACK').catch(() => undefined);
        throw error;
      } finally {
        client.release();
      }
    }

    const applicationIdMatch = route.match(/^\/api\/applications\/([^/]+)$/);
    if (applicationIdMatch && req.method === 'PUT') {
      const id = decodeURIComponent(applicationIdMatch[1]);
      const updates = await readBody(req);
      const client = await getClient();
      try {
        await client.query('BEGIN');
        const existing = await findApplication(client, id);
        if (!existing) {
          await client.query('ROLLBACK');
          return json(res, 404, { success: false, message: 'Application not found' });
        }
        const application = { ...existing.data, ...updates, updatedAt: new Date().toISOString() };
        await client.query('UPDATE applications SET data = $1, updated_at = NOW() WHERE id = $2', [application, existing.id]);
        await writeAudit(client, {
          userName: updates.adminName || 'Admissions Officer',
          userRole: 'admissions_officer',
          action: 'APPLICATION_UPDATED',
          entityType: 'Application',
          entityId: application.applicationId,
          details: `Updated status to ${updates.status || application.status}`
        });
        await client.query('COMMIT');
        return json(res, 200, { success: true, application });
      } catch (error) {
        await client.query('ROLLBACK').catch(() => undefined);
        throw error;
      } finally {
        client.release();
      }
    }

    if (route === '/api/applications' && req.method !== 'GET' && req.method !== 'POST') {
      return methodNotAllowed(res, ['GET', 'POST']);
    }

    if (route === '/api/admissions' && req.method === 'GET') {
      const result = await query('SELECT data FROM admissions ORDER BY created_at DESC');
      return json(res, 200, { success: true, admissions: result.map((row) => row.data) });
    }

    if (route === '/api/admissions' && req.method !== 'GET') {
      return methodNotAllowed(res, ['GET']);
    }

    if (route === '/api/admissions/offer' && req.method === 'POST') {
      const payload = await readBody(req);
      const client = await getClient();
      try {
        await client.query('BEGIN');
        const existing = await findApplication(client, payload.applicationId);
        if (!existing) {
          await client.query('ROLLBACK');
          return json(res, 404, { success: false, message: 'Application not found' });
        }
        const settings = await getSettings(client);
        const admissionsSettings = settings.admissions || {};
        const application = existing.data;
        const prefix = settings.numbering?.admissionPrefix || `AITI/ADM/${new Date().getUTCFullYear()}/`;
        const admissionNumber = await nextTableNumber(client, 'admissions', prefix);
        const studentName = `${application.firstName} ${application.lastName}`;
        const programType = payload.programType || application.programType;
        const admission = {
          id: `adm-${randomUUID()}`,
          admissionNumber,
          applicationId: application.id,
          applicationRef: application.applicationId,
          studentName,
          studentEmail: application.email,
          studentPhone: application.phone,
          programTitle: payload.programTitle || application.programTitle,
          programType,
          duration: programType === 'diploma' ? '6 Months' : '3 Months',
          academicSession: admissionsSettings.activeSession,
          commencementDate: payload.commencementDate || admissionsSettings.programStartDate,
          orientationDate: payload.orientationDate || admissionsSettings.orientationDate,
          conditions: payload.conditions || [
            'Full or initial installment tuition payment prior to class resumption.',
            'Strict adherence to AITI technical laboratory safety and computer usage policies.',
            'Maintenance of a minimum of 80% practical attendance rate.'
          ],
          tuitionFee: programType === 'diploma' ? admissionsSettings.diplomaTuition : admissionsSettings.certificateTuition,
          acceptanceFee: admissionsSettings.acceptanceFee,
          status: 'offered',
          offeredAt: new Date().toISOString(),
          qrVerificationUrl: `/verify?type=admission&code=${admissionNumber}`
        };
        await client.query(
          `INSERT INTO admissions (id, data, created_at, updated_at) VALUES ($1, $2, $3, $3)`,
          [admission.id, admission, admission.offeredAt]
        );
        await client.query(`UPDATE applications SET data = data || $1::jsonb, updated_at = NOW() WHERE id = $2`, [{ status: 'admission_offered' }, application.id]);
        await writeAudit(client, {
          userName: payload.adminName || 'Admissions Directorate',
          userRole: 'admissions_officer',
          action: 'ADMISSION_OFFERED',
          entityType: 'Admission',
          entityId: admissionNumber,
          details: `Offered admission to ${studentName} (${admission.programTitle})`
        });
        await client.query('COMMIT');
        return json(res, 200, { success: true, admission, message: 'Admission offer created successfully.' });
      } catch (error) {
        await client.query('ROLLBACK').catch(() => undefined);
        throw error;
      } finally {
        client.release();
      }
    }

    if (route === '/api/admissions/offer' && req.method !== 'POST') {
      return methodNotAllowed(res, ['POST']);
    }

    if (route === '/api/admissions/enroll' && req.method === 'POST') {
      const payload = await readBody(req);
      const client = await getClient();
      try {
        await client.query('BEGIN');
        const admissionRecord = await findAdmission(client, payload.admissionId);
        if (!admissionRecord) {
          await client.query('ROLLBACK');
          return json(res, 404, { success: false, message: 'Admission record not found' });
        }
        const settings = await getSettings(client);
        const admission = admissionRecord.data;
        const applicationRecord = await findApplication(client, admission.applicationId);
        const application = applicationRecord?.data;
        const classRecord = payload.classId
          ? await findCollectionRecord(client, 'classes', payload.classId)
          : (await client.query('SELECT id, data FROM app_records WHERE collection = $1 ORDER BY updated_at DESC LIMIT 1', ['classes'])).rows[0];
        const targetClass = classRecord?.data;
        const studentPrefix = settings.numbering?.studentPrefix || `AITI/STU/${new Date().getUTCFullYear()}/`;
        const studentNumber = await nextTableNumber(client, 'students', studentPrefix);
        const now = new Date().toISOString();
        const student = {
          id: `stu-${randomUUID()}`,
          studentNumber,
          admissionNumber: admission.admissionNumber,
          userId: `usr-${randomUUID()}`,
          fullName: admission.studentName,
          email: admission.studentEmail,
          phone: admission.studentPhone,
          whatsapp: application?.whatsapp || admission.studentPhone,
          dateOfBirth: application?.dateOfBirth || '2000-01-01',
          gender: application?.gender || 'not specified',
          residentialAddress: application?.residentialAddress || settings.contact?.address,
          passportPhotoUrl: application?.passportPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
          programTitle: admission.programTitle,
          programType: admission.programType,
          academicSession: admission.academicSession,
          classId: targetClass?.id,
          className: targetClass?.title,
          enrollmentDate: now.split('T')[0],
          expectedGraduationDate: admission.programType === 'diploma' ? '2027-02-28' : '2026-11-30',
          status: 'active',
          totalTuition: admission.tuitionFee,
          amountPaid: 0,
          outstandingBalance: admission.tuitionFee,
          attendancePercentage: 100,
          qrCodeUrl: `/verify?type=student&code=${studentNumber}`
        };
        await client.query('INSERT INTO students (id, data, created_at, updated_at) VALUES ($1, $2, $3, $3)', [student.id, student, now]);

        const updatedAdmission = { ...admission, status: 'enrolled', assignedStudentId: studentNumber, assignedClassId: targetClass?.id };
        await client.query('UPDATE admissions SET data = $1, updated_at = NOW() WHERE id = $2', [updatedAdmission, admissionRecord.id]);
        if (applicationRecord) {
          await client.query('UPDATE applications SET data = data || $1::jsonb, updated_at = NOW() WHERE id = $2', [{ status: 'enrolled' }, applicationRecord.id]);
        }
        if (classRecord) {
          const updatedClass = { ...targetClass, totalStudents: (targetClass.totalStudents || 0) + 1 };
          await client.query('UPDATE app_records SET data = $1, updated_at = NOW() WHERE collection = $2 AND id = $3', [updatedClass, 'classes', classRecord.id]);
        }

        const invoicePrefix = settings.numbering?.invoicePrefix || `AITI/INV/${new Date().getUTCFullYear()}/`;
        const invoiceNumber = await nextCollectionNumber(client, 'invoices', invoicePrefix);
        const invoice = {
          id: `inv-${randomUUID()}`,
          invoiceNumber,
          studentId: student.id,
          studentName: student.fullName,
          studentEmail: student.email,
          studentNumber: student.studentNumber,
          title: `${admission.programTitle} - Academic Tuition Invoice`,
          description: `Official tuition and practical laboratory access fee for session ${admission.academicSession}`,
          amount: admission.tuitionFee,
          amountPaid: 0,
          balance: admission.tuitionFee,
          dueDate: admission.commencementDate || '2026-11-15',
          status: 'unpaid',
          items: [
            { description: 'Academic Tuition & Practical Lab Fee', amount: admission.tuitionFee - 10000 },
            { description: 'Student ID & Course Materials Pack', amount: 10000 }
          ],
          createdAt: now
        };
        await client.query('INSERT INTO app_records (collection, id, data, updated_at) VALUES ($1, $2, $3, $4)', ['invoices', invoice.id, invoice, now]);
        await writeAudit(client, {
          userName: payload.adminName || 'Admissions Directorate',
          userRole: 'admissions_officer',
          action: 'STUDENT_ENROLLED',
          entityType: 'Student',
          entityId: studentNumber,
          details: `Enrolled student ${student.fullName} into ${admission.programTitle} with Student ID ${studentNumber}`
        });
        await client.query('COMMIT');
        return json(res, 200, { success: true, student, admission: updatedAdmission, invoice, message: 'Student enrolled successfully.' });
      } catch (error) {
        await client.query('ROLLBACK').catch(() => undefined);
        throw error;
      } finally {
        client.release();
      }
    }

    if (route === '/api/admissions/enroll' && req.method !== 'POST') {
      return methodNotAllowed(res, ['POST']);
    }

    const publicRoute = {
      '/api/public/programs': ['programs', 'programs', 'active = TRUE'],
      '/api/public/courses': ['courses', 'courses', 'active = TRUE'],
    }[route];
    if (publicRoute) {
      if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
      const rows = await query(`SELECT data FROM ${publicRoute[0]} WHERE ${publicRoute[2]} ORDER BY updated_at DESC`);
      return json(res, 200, { success: true, [publicRoute[1]]: rows.map((row) => row.data) });
    }

    const recordRoutes = {
      '/api/public/faqs': ['faqs', 'faqs'],
      '/api/public/testimonials': ['testimonials', 'testimonials'],
      '/api/public/news-events': ['news-events', 'newsEvents'],
      '/api/public/gallery': ['gallery', 'gallery'],
      '/api/public/announcements': ['announcements', 'announcements'],
    }[route];
    if (recordRoutes) {
      if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
      const filters = {
        'news-events': (item) => item.published,
        announcements: (item) => item.active,
      };
      const records = await publicRecords(recordRoutes[0], filters[recordRoutes[0]]);
      return json(res, 200, { success: true, [recordRoutes[1]]: records });
    }

    if (route === '/api/public/quote-requests') {
      if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
      const payload = await readBody(req);
      const client = await getClient();
      try {
        await client.query('BEGIN');
        const referenceRows = await client.query(
          `SELECT COALESCE(MAX(NULLIF(regexp_replace(reference_number, '^.*\\/', ''), '')::integer), 0) + 1 AS next_number
           FROM quote_requests WHERE reference_number LIKE $1`,
          [`AITI/QT/${new Date().getUTCFullYear()}/%`]
        );
        const referenceNumber = nextQuoteReference(referenceRows.rows);
        const now = new Date().toISOString();
        const quoteRequest = {
          id: `qr-${randomUUID()}`,
          referenceNumber,
          createdAt: now,
          updatedAt: now,
          fullName: payload.fullName,
          email: payload.email,
          phone: payload.phone,
          whatsapp: payload.whatsapp || '',
          country: payload.country,
          city: payload.city || '',
          studentType: payload.studentType || (payload.country === 'Nigeria' || !payload.country ? 'nigerian_local' : 'international_online'),
          courseId: payload.courseId,
          courseTitle: payload.courseTitle,
          courseCode: payload.courseCode,
          programId: payload.programId,
          programTitle: payload.programTitle,
          trainingType: payload.trainingType || 'short_course',
          deliveryMode: payload.deliveryMode || 'physical_campus',
          preferredSchedule: payload.preferredSchedule,
          preferredStartDate: payload.preferredStartDate,
          participantCount: Number(payload.participantCount) || 1,
          message: payload.message || '',
          questions: payload.questions || '',
          specialRequirements: payload.specialRequirements || '',
          status: 'new',
          assignedStaff: 'Admissions Office',
          currency: payload.currency || (payload.studentType === 'international_online' || (payload.country && payload.country !== 'Nigeria') ? 'USD' : 'NGN')
        };
        await client.query(
          `INSERT INTO quote_requests (id, reference_number, data, status, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $5)`,
          [quoteRequest.id, referenceNumber, quoteRequest, quoteRequest.status, now]
        );
        await client.query('COMMIT');
        return json(res, 200, {
          success: true,
          referenceNumber,
          quoteRequest,
          message: 'Your quote request has been received. AITI Admissions will provide your current applicable fee shortly.'
        });
      } catch (error) {
        await client.query('ROLLBACK').catch(() => undefined);
        throw error;
      } finally {
        client.release();
      }
    }
  } catch (error) {
    return json(res, 500, { success: false, error: error.message });
  }

  return json(res, 501, {
    success: false,
    error: 'This API endpoint is scaffolded but not implemented yet.',
    method: req.method || 'GET',
    path: route,
    query: requestUrl.query
  });
}
