import {
  readRawBody,
  settleVerifiedPayment,
  verifySignature,
  withTransaction,
  normalizeReference,
  json
} from '../payments/_paystack.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { success: false, error: 'Method not allowed.' });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY || '';
  if (!secretKey) return json(res, 400, { success: false, message: 'Paystack secret key is not configured.' });

  try {
    const signature = req.headers['x-paystack-signature'];
    if (!signature) return json(res, 401, { success: false, message: 'Missing Paystack signature header.' });
    const rawBody = await readRawBody(req);
    if (!verifySignature(rawBody, Array.isArray(signature) ? signature[0] : signature, secretKey)) {
      return json(res, 401, { success: false, message: 'Invalid Paystack webhook signature.' });
    }

    const payload = JSON.parse(rawBody.toString('utf8'));
    if (payload?.event !== 'charge.success') {
      return json(res, 200, { success: true, received: true, ignored: true, message: 'Webhook event ignored.' });
    }

    const reference = normalizeReference(payload?.data?.reference);
    if (!reference) return json(res, 400, { success: false, message: 'Paystack webhook reference is missing.' });
    const result = await withTransaction((client) => settleVerifiedPayment(client, reference, payload.data));
    return json(res, 200, {
      success: true,
      verified: true,
      message: 'Paystack webhook processed successfully.',
      whatsappGroupUrl: 'https://chat.whatsapp.com/DO3YwlZLu3C62ISUGfaBqx',
      application: result.application,
      receipt: result.receipt
    });
  } catch (error) {
    return json(res, 500, { success: false, error: error.message });
  }
}
