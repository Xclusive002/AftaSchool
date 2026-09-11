import { randomUUID, createHmac, timingSafeEqual } from 'node:crypto';
import { getClient } from '../../lib/db.js';

export function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

export async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

export function verifySignature(rawBody, signature, secret) {
  if (!signature) return false;
  const expected = createHmac('sha512', secret).update(rawBody).digest('hex');
  const provided = Buffer.from(String(signature), 'utf8');
  const expectedBuffer = Buffer.from(expected, 'utf8');
  return provided.length === expectedBuffer.length && timingSafeEqual(provided, expectedBuffer);
}

export function normalizeReference(reference) {
  return String(reference || '').trim();
}

export async function getSettings(client) {
  const result = await client.query('SELECT data FROM institute_settings WHERE section = $1', ['institute']);
  return result.rows[0]?.data || {};
}

export async function nextReceiptNumber(client, settings) {
  const result = await client.query('SELECT COUNT(*)::int + 1 AS next_number FROM payment_transactions');
  const prefix = settings.numbering?.receiptPrefix || `AITI/REC/${new Date().getUTCFullYear()}/`;
  return `${prefix}${String(result.rows[0].next_number).padStart(6, '0')}`;
}

async function writeAudit(client, application, receiptNumber, reference) {
  await client.query(
    `INSERT INTO audit_logs (id, user_id, user_name, user_role, action, entity_type, entity_id, details, timestamp)
     VALUES ($1, 'system', $2, 'student', 'APPLICATION_FEE_VERIFIED', 'Payment', $3, $4, $5)`,
    [
      `log-${randomUUID()}`,
      `${application.firstName} ${application.lastName}`,
      receiptNumber,
      `Paystack payment ${reference} verified for ${application.applicationId}`,
      new Date().toISOString()
    ]
  );
}

export async function findApplication(client, reference, paystackData = {}) {
  const metadata = paystackData.metadata || {};
  const result = await client.query(
    `SELECT id, data FROM applications
     WHERE data->>'paymentReference' = $1
        OR data->>'applicationId' = $2
        OR id = $3
        OR id = $4
     LIMIT 1`,
     [reference, metadata.applicationId || '', reference, metadata.applicationRecordId || '']
  );
  if (result.rows[0]) return result.rows[0];

  const payment = await client.query(
    `SELECT data FROM payment_transactions
     WHERE data->>'gatewayReference' = $1 OR data->>'receiptNumber' = $1
     LIMIT 1`,
    [reference]
  );
  if (!payment.rows[0]) return null;

  const paymentData = payment.rows[0].data;
  const fallback = await client.query(
    `SELECT id, data FROM applications
     WHERE LOWER(data->>'email') = LOWER($1)
       AND (data->>'paymentReference' IS NULL OR data->>'paymentReference' = $2 OR data->>'paymentStatus' <> 'paid')
     ORDER BY created_at DESC LIMIT 1`,
    [paymentData.studentEmail || '', reference]
  );
  return fallback.rows[0] || null;
}

export async function settleVerifiedPayment(client, reference, paystackData = {}) {
  const normalizedReference = normalizeReference(reference || paystackData.reference);
  if (!normalizedReference) throw new Error('Paystack reference is required.');

  const applicationRow = await findApplication(client, normalizedReference, paystackData);
  if (!applicationRow) throw new Error('No matching application was found for this Paystack payment reference.');

  const settings = await getSettings(client);
  const application = {
    ...applicationRow.data,
    paymentStatus: 'paid',
    paymentReference: normalizedReference,
    paidAt: new Date().toISOString()
  };
  if (application.status === 'payment_pending') application.status = 'submitted';
  await client.query('UPDATE applications SET data = $1, updated_at = NOW() WHERE id = $2', [application, applicationRow.id]);

  const existing = await client.query(
    `SELECT id, data FROM payment_transactions
     WHERE data->>'gatewayReference' = $1
        OR data->>'receiptNumber' = $1
        OR (LOWER(data->>'studentEmail') = LOWER($2) AND data->>'paymentType' = 'application_fee' AND data->>'status' <> 'success')
     ORDER BY created_at DESC LIMIT 1`,
    [normalizedReference, application.email]
  );
  const now = new Date().toISOString();
  let receipt;
  if (!existing.rows[0]) {
    const receiptNumber = await nextReceiptNumber(client, settings);
    receipt = {
      id: `pay-${randomUUID()}`,
      receiptNumber,
      studentName: `${application.firstName} ${application.lastName}`,
      studentEmail: application.email,
      paymentType: 'application_fee',
      amount: Number(application.paymentAmount || settings.admissions?.applicationFee || 0),
      gateway: 'paystack',
      gatewayReference: normalizedReference,
      status: 'success',
      channel: 'Online Payment Gateway',
      paidAt: now,
      verifiedBy: 'Paystack Verification',
      notes: `Application Fee for ${application.applicationId} (${application.programTitle})`,
      qrVerificationUrl: `/verify?type=receipt&code=${receiptNumber}`
    };
    await client.query(
      'INSERT INTO payment_transactions (id, data, created_at, updated_at) VALUES ($1, $2, $3, $3)',
      [receipt.id, receipt, now]
    );
  } else {
    receipt = {
      ...existing.rows[0].data,
      status: 'success',
      gatewayReference: normalizedReference,
      paidAt: existing.rows[0].data.paidAt || now,
      verifiedBy: 'Paystack Verification'
    };
    await client.query('UPDATE payment_transactions SET data = $1, updated_at = NOW() WHERE id = $2', [receipt, existing.rows[0].id]);
  }

  await writeAudit(client, application, receipt.receiptNumber, normalizedReference);
  return { application, receipt, settings };
}

export async function withTransaction(callback) {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}
