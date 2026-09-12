import {
  normalizeReference,
  settleVerifiedPayment,
  withTransaction,
  json
} from '../_paystack.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return json(res, 405, { success: false, error: 'Method not allowed.' });
  }

  const rawReference = Array.isArray(req.query?.reference) ? req.query.reference[0] : req.query?.reference;
  const reference = normalizeReference(rawReference);
  const secretKey = (process.env.PAYSTACK_SECRET_KEY || process.env.PAYSTACK_SECRET || '').trim();
  if (!reference) return json(res, 400, { success: false, verified: false, message: 'Paystack reference is required.' });
  if (!secretKey) return json(res, 400, { success: false, verified: false, message: 'Paystack secret key is not configured.' });

  try {
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });
    const paystackJson = await paystackResponse.json();
    if (!paystackResponse.ok || !paystackJson?.status || paystackJson?.data?.status !== 'success') {
      return json(res, 400, {
        success: false,
        verified: false,
        message: paystackJson?.message || 'Payment verification is still pending or failed.'
      });
    }

    const result = await withTransaction((client) => settleVerifiedPayment(client, reference, paystackJson.data));
    return json(res, 200, {
      success: true,
      verified: true,
      type: 'receipt',
      data: {
        receiptNumber: result.receipt.receiptNumber,
        studentName: result.receipt.studentName,
        amount: result.receipt.amount,
        paymentType: result.receipt.paymentType,
        paidAt: result.receipt.paidAt,
        status: result.receipt.status,
        institute: result.settings.general?.fullName,
        whatsappGroupUrl: 'https://chat.whatsapp.com/DO3YwlZLu3C62ISUGfaBqx'
      },
      application: result.application,
      receipt: result.receipt,
      message: 'Payment verified successfully.'
    });
  } catch (error) {
    return json(res, 500, { success: false, verified: false, error: error.message });
  }
}
