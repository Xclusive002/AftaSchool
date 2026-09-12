import { randomUUID } from 'node:crypto';
import {
  findApplication,
  getSettings,
  nextReceiptNumber,
  withTransaction,
  json
} from '../../payments/_paystack.js';

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  const text = Buffer.concat(chunks).toString('utf8').trim();
  return text ? JSON.parse(text) : {};
}

async function writeAudit(client, application, action, receiptNumber, details) {
  await client.query(
    `INSERT INTO audit_logs (id, user_id, user_name, user_role, action, entity_type, entity_id, details, timestamp)
     VALUES ($1, 'system', $2, 'student', $3, 'Payment', $4, $5, $6)`,
    [
      `log-${randomUUID()}`,
      `${application.firstName} ${application.lastName}`,
      action,
      receiptNumber,
      details,
      new Date().toISOString()
    ]
  );
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { success: false, error: 'Method not allowed.' });
  }

  try {
    const payload = await readBody(req);
    const id = Array.isArray(req.query?.id) ? req.query.id[0] : req.query?.id;
    const gateway = payload.gateway || 'paystack';
    const gatewayReference = payload.gatewayReference;
    const secretKey = (process.env.PAYSTACK_SECRET_KEY || process.env.PAYSTACK_SECRET || '')
      .trim()
      .replace(/^(["'])|(["'])$/g, '');
    let checkout;

    const application = await withTransaction(async (client) => {
      const row = await findApplication(client, String(id || ''));
      if (!row) return null;
      const settings = await getSettings(client);
      const amount = Number(row.data.paymentAmount || settings.admissions?.applicationFee || 0);
      const appOrigin = process.env.PUBLIC_APP_URL || `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers['x-forwarded-host'] || 'localhost:5173'}`;
      const callbackUrl = `${appOrigin}/verify?type=receipt`;

      if (gateway === 'paystack' && secretKey) {
        try {
          const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${secretKey}`
            },
            body: JSON.stringify({
              email: row.data.email,
              amount: Math.round(amount * 100),
              currency: 'NGN',
              callback_url: callbackUrl,
              metadata: {
                applicationId: row.data.applicationId,
                applicationRecordId: row.id,
                programTitle: row.data.programTitle,
                studentName: `${row.data.firstName} ${row.data.lastName}`
              }
            })
          });
          const paystackJson = await paystackResponse.json();
          if (paystackResponse.ok && paystackJson?.status && paystackJson?.data?.authorization_url) {
            checkout = paystackJson.data;
            const reference = paystackJson.data.reference;
            const now = new Date().toISOString();
            const receiptNumber = await nextReceiptNumber(client, settings);
            const updatedApplication = {
              ...row.data,
              paymentStatus: 'pending',
              paymentReference: reference,
              paidAt: null,
              status: 'submitted'
            };
            const receipt = {
              id: `pay-${randomUUID()}`,
              receiptNumber,
              studentName: `${row.data.firstName} ${row.data.lastName}`,
              studentEmail: row.data.email,
              paymentType: 'application_fee',
              amount,
              gateway: 'paystack',
              gatewayReference: reference,
              status: 'pending',
              channel: 'Online Payment Gateway',
              paidAt: now,
              verifiedBy: 'Paystack Checkout Bridge',
              notes: `Application Fee for ${row.data.applicationId} (${row.data.programTitle})`,
              qrVerificationUrl: `/verify?type=receipt&code=${receiptNumber}`
            };
            await client.query('UPDATE applications SET data = $1, updated_at = NOW() WHERE id = $2', [updatedApplication, row.id]);
            await client.query(
              'INSERT INTO payment_transactions (id, data, created_at, updated_at) VALUES ($1, $2, $3, $3)',
              [receipt.id, receipt, now]
            );
            await writeAudit(client, row.data, 'APPLICATION_FEE_INITIATED', receiptNumber, `Paystack checkout initialized for ${row.data.applicationId}`);
            return updatedApplication;
          }
          throw new Error(paystackJson?.message || `Paystack returned HTTP ${paystackResponse.status}.`);
        } catch (error) {
          throw new Error(`Paystack checkout initialization failed: ${error?.message || error}`);
        }
      }

      if (gateway === 'paystack') {
        throw new Error('Paystack is not configured. Set PAYSTACK_SECRET_KEY before accepting application payments.');
      }

      const now = new Date().toISOString();
      const reference = gatewayReference || `AITI_PAY_${Date.now()}`;
      const receiptNumber = await nextReceiptNumber(client, settings);
      const updatedApplication = {
        ...row.data,
        paymentStatus: 'paid',
        paymentReference: reference,
        paidAt: now,
        status: 'submitted'
      };
      const receipt = {
        id: `pay-${randomUUID()}`,
        receiptNumber,
        studentName: `${row.data.firstName} ${row.data.lastName}`,
        studentEmail: row.data.email,
        paymentType: 'application_fee',
        amount,
        gateway,
        gatewayReference: reference,
        status: 'success',
        channel: 'Online Payment Gateway',
        paidAt: now,
        verifiedBy: 'AITI Automated Gateway Service',
        notes: `Application Fee for ${row.data.applicationId} (${row.data.programTitle})`,
        qrVerificationUrl: `/verify?type=receipt&code=${receiptNumber}`
      };
      await client.query('UPDATE applications SET data = $1, updated_at = NOW() WHERE id = $2', [updatedApplication, row.id]);
      await client.query(
        'INSERT INTO payment_transactions (id, data, created_at, updated_at) VALUES ($1, $2, $3, $3)',
        [receipt.id, receipt, now]
      );
      await writeAudit(client, row.data, 'APPLICATION_FEE_PAID', receiptNumber, `Paid application fee of NGN ${Number(amount).toLocaleString()} for ${row.data.applicationId}`);
      return updatedApplication;
    });

    if (!application) return json(res, 404, { success: false, message: 'Application not found' });
    if (checkout) {
      const receipt = await withTransaction(async (client) => {
        const result = await client.query(
          `SELECT data FROM payment_transactions WHERE data->>'gatewayReference' = $1 ORDER BY created_at DESC LIMIT 1`,
          [checkout.reference]
        );
        return result.rows[0]?.data;
      });
      return json(res, 200, {
        success: true,
        application,
        receipt,
        checkoutUrl: checkout.authorization_url,
        reference: checkout.reference,
        message: 'Paystack checkout initialized successfully.'
      });
    }

    const receipt = await withTransaction(async (client) => {
      const result = await client.query(
        `SELECT data FROM payment_transactions WHERE data->>'gatewayReference' = $1 ORDER BY created_at DESC LIMIT 1`,
        [application.paymentReference]
      );
      return result.rows[0]?.data;
    });
    return json(res, 200, { success: true, application, receipt });
  } catch (error) {
    return json(res, 500, { success: false, error: error.message });
  }
}
