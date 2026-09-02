import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { askVisitorAdmissionAi, askAdminAi } from './server/ai';
import { initializeDatabaseSchema, initializeAdminUser, initializeLmsCatalog, isPostgresConfigured, queryDatabase, supabasePool } from './server/supabase';

async function startServer() {
  const app = express();
  const PORT = 3000;

  if (isPostgresConfigured) {
    await initializeDatabaseSchema();
    await initializeAdminUser();
    await initializeLmsCatalog();
    await db.initializeFromPostgres();
    console.log('PostgreSQL schema is ready.');
  }

  // JSON Body Parser with 20MB limit for document upload base64 strings
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Request logger for audit & tracking
  app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    }
    next();
  });

  // ==========================================
  // API ROUTES
  // ==========================================

  // 1. Institute Settings (ADMIN -> SETTINGS -> INSTITUTE INFORMATION)
  app.get('/api/settings', async (req, res) => {
    try {
      if (isPostgresConfigured) {
        const rows = await queryDatabase<{ data: any }>('SELECT data FROM institute_settings WHERE section = $1', ['institute']);
        return res.json({ success: true, settings: rows[0]?.data || null });
      }
      const state = db.getState();
      res.json({ success: true, settings: state.settings });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/settings', async (req, res) => {
    try {
      if (isPostgresConfigured && supabasePool) {
        const result = await supabasePool.query(
          `INSERT INTO institute_settings (section, data, updated_at) VALUES ('institute', $1, NOW())
           ON CONFLICT (section) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW() RETURNING data`,
          [req.body]
        );
        return res.json({ success: true, settings: result.rows[0].data, message: 'Settings saved successfully.' });
      }
      const updatedSettings = req.body;
      const state = db.getState();
      state.settings = { ...state.settings, ...updatedSettings };
      db.save();
      db.addAuditLog(
        req.body.adminName || 'Administrator',
        'super_admin',
        'SETTINGS_UPDATED',
        'InstituteSettings',
        'settings',
        'Updated institute general, contact, admissions, or branding information.'
      );
      res.json({ success: true, settings: state.settings, message: 'Settings saved successfully.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 2. Public Data (Programs, Courses, FAQs, Testimonials, News, Gallery)
  app.get('/api/public/programs', (req, res) => {
    const state = db.getState();
    res.json({ success: true, programs: state.programs.filter(p => p.active) });
  });

  app.get('/api/public/courses', (req, res) => {
    const state = db.getState();
    res.json({ success: true, courses: state.courses.filter(c => c.active) });
  });

  app.get('/api/public/faqs', (req, res) => {
    const state = db.getState();
    res.json({ success: true, faqs: state.faqs });
  });

  app.get('/api/public/testimonials', (req, res) => {
    const state = db.getState();
    res.json({ success: true, testimonials: state.testimonials });
  });

  app.get('/api/public/news-events', (req, res) => {
    const state = db.getState();
    res.json({ success: true, newsEvents: state.newsEvents.filter(n => n.published) });
  });

  app.get('/api/public/gallery', (req, res) => {
    const state = db.getState();
    res.json({ success: true, gallery: state.gallery });
  });

  app.get('/api/public/announcements', (req, res) => {
    const state = db.getState();
    res.json({ success: true, announcements: state.announcements.filter(a => a.active) });
  });

  app.get('/api/lms/courses', async (req, res) => {
    try {
      if (!isPostgresConfigured) return res.json({ success: true, courses: [] });
      const courses = await queryDatabase<any>('SELECT data FROM lms_courses WHERE active = TRUE ORDER BY updated_at DESC');
      res.json({ success: true, courses: courses.map(course => course.data) });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/lms/enrollments/:studentId', async (req, res) => {
    try {
      if (!isPostgresConfigured) return res.json({ success: true, enrollments: [] });
      const enrollments = await queryDatabase<any>('SELECT data FROM lms_enrollments WHERE student_id = $1 ORDER BY updated_at DESC', [req.params.studentId]);
      res.json({ success: true, enrollments: enrollments.map(enrollment => enrollment.data) });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/lms/messages', async (req, res) => {
    try {
      if (!isPostgresConfigured) return res.json({ success: true, messages: [] });
      const { courseId, userId } = req.query;
      const messages = await queryDatabase<any>(
        `SELECT id, course_id AS "courseId", sender_id AS "senderId", recipient_id AS "recipientId", body, created_at AS "createdAt", read_at AS "readAt"
         FROM lms_messages WHERE ($1::text IS NULL OR course_id = $1) AND ($2::text IS NULL OR sender_id = $2 OR recipient_id = $2) ORDER BY created_at ASC`,
        [courseId || null, userId || null]
      );
      res.json({ success: true, messages });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/lms/messages', async (req, res) => {
    try {
      const { courseId, senderId, recipientId, body } = req.body || {};
      if (!isPostgresConfigured) return res.status(503).json({ success: false, error: 'PostgreSQL is required for LMS messaging.' });
      if (!senderId || !body?.trim()) return res.status(400).json({ success: false, error: 'Sender and message are required.' });
      const result = await supabasePool!.query(
        `INSERT INTO lms_messages (course_id, sender_id, recipient_id, body) VALUES ($1, $2, $3, $4)
         RETURNING id, course_id AS "courseId", sender_id AS "senderId", recipient_id AS "recipientId", body, created_at AS "createdAt", read_at AS "readAt"`,
        [courseId || null, senderId, recipientId || null, body.trim()]
      );
      res.json({ success: true, message: result.rows[0] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // =========================================================================
  // 2B. GET CURRENT FEE / QUOTE REQUEST SYSTEM
  // =========================================================================
  app.post('/api/public/quote-requests', (req, res) => {
    try {
      const payload = req.body;
      const state = db.getState();
      const referenceNumber = db.generateNextQuoteRequestId();
      const now = new Date().toISOString();

      const newQuote = {
        id: `qr-${Date.now()}`,
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
        status: 'new' as const,
        assignedStaff: 'Admissions Office',
        currency: (payload.currency || (payload.studentType === 'international_online' || (payload.country && payload.country !== 'Nigeria') ? 'USD' : 'NGN')) as 'NGN' | 'USD'
      };

      if (!state.quoteRequests) {
        state.quoteRequests = [];
      }
      state.quoteRequests.unshift(newQuote);

      // Create CRM lead automatically
      const lead = {
        id: `lead-${Date.now()}`,
        fullName: newQuote.fullName,
        email: newQuote.email,
        phone: newQuote.phone,
        whatsapp: newQuote.whatsapp,
        programInterest: newQuote.courseTitle || newQuote.programTitle || 'Training Course',
        source: 'website' as const,
        status: 'contacted' as const,
        notes: `Submitted Fee Quote Request ${referenceNumber} for ${newQuote.courseTitle} (${newQuote.deliveryMode})`,
        createdAt: now
      };
      if (!state.leads) state.leads = [];
      state.leads.unshift(lead);

      db.save();
      db.addAuditLog(
        newQuote.fullName,
        'student',
        'QUOTE_REQUESTED',
        'QuoteRequest',
        referenceNumber,
        `New fee quote request submitted for ${newQuote.courseTitle}`
      );

      res.json({
        success: true,
        referenceNumber,
        quoteRequest: newQuote,
        message: 'Your quote request has been received. AITI Admissions will provide your current applicable fee shortly.'
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin: Get all quote requests
  app.get('/api/admin/quote-requests', (req, res) => {
    try {
      const state = db.getState();
      const { status, search, studentType } = req.query;
      let quotes = state.quoteRequests || [];

      if (status && status !== 'all') {
        quotes = quotes.filter(q => q.status === status);
      }
      if (studentType && studentType !== 'all') {
        quotes = quotes.filter(q => q.studentType === studentType);
      }
      if (search) {
        const s = String(search).toLowerCase();
        quotes = quotes.filter(q => 
          q.fullName.toLowerCase().includes(s) ||
          q.referenceNumber.toLowerCase().includes(s) ||
          q.email.toLowerCase().includes(s) ||
          q.phone.includes(s) ||
          q.courseTitle?.toLowerCase().includes(s)
        );
      }

      res.json({ success: true, quoteRequests: quotes });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin: Get single quote request
  app.get('/api/admin/quote-requests/:id', (req, res) => {
    try {
      const state = db.getState();
      const quote = (state.quoteRequests || []).find(q => q.id === req.params.id || q.referenceNumber === req.params.id);
      if (!quote) {
        return res.status(404).json({ success: false, error: 'Quote request not found' });
      }
      res.json({ success: true, quoteRequest: quote });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin: Update quote request (e.g. status, assigned staff, notes)
  app.put('/api/admin/quote-requests/:id', (req, res) => {
    try {
      const state = db.getState();
      const idx = (state.quoteRequests || []).findIndex(q => q.id === req.params.id || q.referenceNumber === req.params.id);
      if (idx === -1) {
        return res.status(404).json({ success: false, error: 'Quote request not found' });
      }

      const updates = req.body;
      const updatedQuote = {
        ...state.quoteRequests[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      state.quoteRequests[idx] = updatedQuote;
      db.save();

      db.addAuditLog(
        updates.adminName || 'Admissions Officer',
        'admin',
        'QUOTE_UPDATED',
        'QuoteRequest',
        updatedQuote.referenceNumber,
        `Quote request ${updatedQuote.referenceNumber} status updated to ${updatedQuote.status}`
      );

      res.json({ success: true, quoteRequest: updatedQuote, message: 'Quote updated successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin: Send Official Quote (Current Fee + Expiry + Message)
  app.post('/api/admin/quote-requests/:id/send-quote', (req, res) => {
    try {
      const state = db.getState();
      const idx = (state.quoteRequests || []).findIndex(q => q.id === req.params.id || q.referenceNumber === req.params.id);
      if (idx === -1) {
        return res.status(404).json({ success: false, error: 'Quote request not found' });
      }

      const quote = state.quoteRequests[idx];
      const {
        baseFee,
        currency,
        additionalFees,
        additionalFeesBreakdown,
        discountAmount,
        discountReason,
        finalQuotedAmount,
        quoteValidUntil,
        quoteMessageToApplicant,
        adminNotes,
        assignedStaff,
        adminName
      } = req.body;

      const now = new Date().toISOString();
      const calculatedFinal = finalQuotedAmount !== undefined 
        ? Number(finalQuotedAmount) 
        : Math.max(0, (Number(baseFee) || 0) + (Number(additionalFees) || 0) - (Number(discountAmount) || 0));

      const updatedQuote = {
        ...quote,
        baseFee: Number(baseFee) || 0,
        currency: currency || quote.currency || 'NGN',
        additionalFees: Number(additionalFees) || 0,
        additionalFeesBreakdown: additionalFeesBreakdown || [],
        discountAmount: Number(discountAmount) || 0,
        discountReason: discountReason || '',
        finalQuotedAmount: calculatedFinal,
        quoteValidUntil: quoteValidUntil || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        quoteMessageToApplicant: quoteMessageToApplicant || `Official current fee offer for ${quote.courseTitle}: ${currency || 'NGN'} ${calculatedFinal.toLocaleString()}`,
        adminNotes: adminNotes || quote.adminNotes,
        assignedStaff: assignedStaff || quote.assignedStaff || 'Admissions Office',
        status: 'quote_sent' as const,
        quoteSentAt: now,
        updatedAt: now
      };

      state.quoteRequests[idx] = updatedQuote;
      db.save();

      db.addAuditLog(
        adminName || 'Admissions Officer',
        'admin',
        'QUOTE_SENT',
        'QuoteRequest',
        quote.referenceNumber,
        `Official fee quote of ${updatedQuote.currency} ${calculatedFinal.toLocaleString()} sent to ${quote.fullName}`
      );

      res.json({
        success: true,
        quoteRequest: updatedQuote,
        message: `Official quote ${quote.referenceNumber} generated and marked as sent.`
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin: Convert Accepted Quote to Registered Application
  app.post('/api/admin/quote-requests/:id/convert-application', (req, res) => {
    try {
      const state = db.getState();
      const idx = (state.quoteRequests || []).findIndex(q => q.id === req.params.id || q.referenceNumber === req.params.id);
      if (idx === -1) {
        return res.status(404).json({ success: false, error: 'Quote request not found' });
      }

      const quote = state.quoteRequests[idx];
      const nextAppId = db.generateNextApplicationId();
      const now = new Date().toISOString();

      // Split name
      const nameParts = (quote.fullName || '').trim().split(' ');
      const firstName = nameParts[0] || 'Applicant';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Student';

      const newApp = {
        id: `app-from-quote-${Date.now()}`,
        applicationId: nextAppId,
        firstName,
        lastName,
        email: quote.email,
        phone: quote.phone,
        whatsapp: quote.whatsapp || quote.phone,
        dateOfBirth: '2000-01-01',
        gender: 'male',
        stateOfOrigin: quote.city || 'Kwara State',
        lga: 'Ilorin South',
        residentialAddress: quote.city ? `${quote.city}, ${quote.country}` : 'Ilorin, Kwara State',
        highestQualification: 'Senior Secondary Certificate (SSCE / WAEC / NECO)',
        previousInstitution: 'N/A',
        yearOfGraduation: '2024',
        priorCodingExperience: 'Beginner (No prior experience)',
        programId: quote.programId || 'prog-cert-3m',
        programTitle: quote.courseTitle || quote.programTitle || 'AITI Technology Program',
        programType: (quote.trainingType === 'diploma_program' ? 'diploma' : 'certificate') as 'certificate' | 'diploma',
        preferredSchedule: quote.preferredSchedule || 'Weekday Morning (9:00 AM - 12:00 PM)',
        nextOfKinName: 'Guardian Contact',
        nextOfKinRelationship: 'Parent / Sponsor',
        nextOfKinPhone: quote.phone,
        nextOfKinAddress: quote.city || 'Ilorin',
        status: 'submitted' as const,
        paymentStatus: 'pending' as const,
        paymentAmount: quote.finalQuotedAmount || quote.baseFee || state.settings.admissions.applicationFee || 5000,
        quotedFeeSnapshot: {
          referenceNumber: quote.referenceNumber,
          amount: quote.finalQuotedAmount || quote.baseFee || 0,
          currency: quote.currency || 'NGN',
          quotedAt: quote.quoteSentAt || now
        },
        termsAccepted: true,
        createdAt: now,
        updatedAt: now
      };

      if (!state.applications) state.applications = [];
      state.applications.unshift(newApp as any);

      // Update quote state
      state.quoteRequests[idx] = {
        ...quote,
        status: 'converted_to_application',
        convertedApplicationId: nextAppId,
        updatedAt: now
      };

      db.save();

      db.addAuditLog(
        req.body.adminName || 'Admissions Officer',
        'admin',
        'QUOTE_CONVERTED_APPLICATION',
        'QuoteRequest',
        quote.referenceNumber,
        `Quote ${quote.referenceNumber} converted to Application ${nextAppId}`
      );

      res.json({
        success: true,
        application: newApp,
        quoteRequest: state.quoteRequests[idx],
        message: `Quote successfully converted to Application ${nextAppId}`
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin: Generate Locked Fee Invoice from Quote
  app.post('/api/admin/quote-requests/:id/generate-invoice', (req, res) => {
    try {
      const state = db.getState();
      const idx = (state.quoteRequests || []).findIndex(q => q.id === req.params.id || q.referenceNumber === req.params.id);
      if (idx === -1) {
        return res.status(404).json({ success: false, error: 'Quote request not found' });
      }

      const quote = state.quoteRequests[idx];
      const count = (state.invoices?.length || 0) + 1;
      const invoiceNumber = `AITI/INV/2026/${count.toString().padStart(5, '0')}`;
      const now = new Date().toISOString();
      const amount = quote.finalQuotedAmount || quote.baseFee || 0;

      const newInvoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber,
        studentId: quote.convertedStudentId || quote.convertedApplicationId || `prospect-${quote.referenceNumber}`,
        studentName: quote.fullName,
        studentEmail: quote.email,
        title: `Tuition & Training Fee - ${quote.courseTitle}`,
        amount,
        balanceDue: amount,
        dueDate: quote.quoteValidUntil || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        status: 'unpaid' as const,
        description: `Official Quoted Fee (Ref: ${quote.referenceNumber}). Includes training tuition, lab workstation access, and verified certificate.`,
        items: [
          {
            description: `Tuition for ${quote.courseTitle} (${quote.deliveryMode})`,
            amount: quote.baseFee || amount
          },
          ...(quote.additionalFeesBreakdown || []).map(item => ({
            description: item.description,
            amount: item.amount
          })),
          ...(quote.discountAmount ? [{
            description: `Discount Applied: ${quote.discountReason || 'Promotional Incentive'}`,
            amount: -quote.discountAmount
          }] : [])
        ],
        createdAt: now,
        updatedAt: now
      };

      if (!state.invoices) state.invoices = [];
      state.invoices.unshift(newInvoice as any);

      state.quoteRequests[idx] = {
        ...quote,
        convertedInvoiceId: invoiceNumber,
        updatedAt: now
      };

      db.save();

      db.addAuditLog(
        req.body.adminName || 'Finance Officer',
        'finance',
        'QUOTE_INVOICE_GENERATED',
        'Invoice',
        invoiceNumber,
        `Generated Invoice ${invoiceNumber} for ${quote.currency} ${amount.toLocaleString()} linked to Quote ${quote.referenceNumber}`
      );

      res.json({
        success: true,
        invoice: newInvoice,
        quoteRequest: state.quoteRequests[idx],
        message: `Official Invoice ${invoiceNumber} generated for ${quote.fullName}`
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Price Versioning / Change History
  app.get('/api/admin/price-history', (req, res) => {
    try {
      const state = db.getState();
      res.json({ success: true, priceVersions: state.priceVersions || [] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/admin/price-history', (req, res) => {
    try {
      const state = db.getState();
      const { itemId, itemTitle, itemType, currency, previousPrice, newPrice, changedBy, reason } = req.body;
      const now = new Date().toISOString();

      const log = {
        id: `pv-${Date.now()}`,
        itemId: itemId || `item-${Date.now()}`,
        itemTitle: itemTitle || 'AITI Course',
        itemType: itemType || 'short_course',
        currency: currency || 'NGN',
        previousPrice: Number(previousPrice) || 0,
        newPrice: Number(newPrice) || 0,
        changedBy: changedBy || 'Administrator',
        changedAt: now,
        reason: reason || 'Routine institutional fee schedule revision.'
      };

      if (!state.priceVersions) state.priceVersions = [];
      state.priceVersions.unshift(log);

      db.save();
      db.addAuditLog(
        log.changedBy,
        'admin',
        'PRICE_REVISED',
        'Pricing',
        log.itemId,
        `Price revised for ${log.itemTitle} from ${log.currency} ${log.previousPrice.toLocaleString()} to ${log.currency} ${log.newPrice.toLocaleString()}`
      );

      res.json({ success: true, priceVersion: log, message: 'Price revision logged successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 3. Applications (Online Multi-Step Admission System)
  app.get('/api/applications', (req, res) => {
    try {
      const state = db.getState();
      const { email, applicationId } = req.query;
      let apps = state.applications;
      if (email) {
        apps = apps.filter(a => a.email.toLowerCase() === String(email).toLowerCase());
      }
      if (applicationId) {
        apps = apps.filter(a => a.applicationId.toLowerCase() === String(applicationId).toLowerCase());
      }
      res.json({ success: true, applications: apps });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/applications', (req, res) => {
    try {
      const payload = req.body;
      const state = db.getState();
      const nextId = db.generateNextApplicationId();

      const newApp = {
        id: `app-${Date.now()}`,
        applicationId: nextId,
        ...payload,
        status: payload.status || 'submitted',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      state.applications.unshift(newApp);

      // Create a lead in CRM automatically
      const lead = {
        id: `lead-${Date.now()}`,
        fullName: `${newApp.firstName} ${newApp.lastName}`,
        email: newApp.email,
        phone: newApp.phone,
        whatsapp: newApp.whatsapp,
        programInterest: newApp.programTitle,
        source: 'website' as const,
        status: 'applied' as const,
        notes: `Submitted online application ${nextId}`,
        createdAt: new Date().toISOString()
      };
      state.leads.unshift(lead);

      db.save();
      db.addAuditLog(
        `${newApp.firstName} ${newApp.lastName}`,
        'student',
        'APPLICATION_SUBMITTED',
        'Application',
        nextId,
        `New application submitted for ${newApp.programTitle}`
      );

      res.json({ success: true, application: newApp, message: 'Application submitted successfully.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/applications/:id', (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const state = db.getState();
      const idx = state.applications.findIndex(a => a.id === id || a.applicationId === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      state.applications[idx] = {
        ...state.applications[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      db.save();
      db.addAuditLog(
        updates.adminName || 'Admissions Officer',
        'admissions_officer',
        'APPLICATION_UPDATED',
        'Application',
        state.applications[idx].applicationId,
        `Updated status to ${updates.status || state.applications[idx].status}`
      );

      res.json({ success: true, application: state.applications[idx] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Application Fee Payment
  app.post('/api/applications/:id/pay-fee', (req, res) => {
    try {
      const { id } = req.params;
      const { gateway, gatewayReference } = req.body;
      const state = db.getState();
      const appRecord = state.applications.find(a => a.id === id || a.applicationId === id);
      if (!appRecord) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      const receiptNumber = db.generateNextReceiptNumber();
      appRecord.paymentStatus = 'paid';
      appRecord.paymentReference = gatewayReference || `AITI_PAY_${Date.now()}`;
      appRecord.paidAt = new Date().toISOString();
      appRecord.status = 'submitted';

      // Create transaction receipt
      const transaction = {
        id: `pay-${Date.now()}`,
        receiptNumber,
        studentName: `${appRecord.firstName} ${appRecord.lastName}`,
        studentEmail: appRecord.email,
        paymentType: 'application_fee' as const,
        amount: appRecord.paymentAmount || state.settings.admissions.applicationFee,
        gateway: gateway || 'paystack',
        gatewayReference: appRecord.paymentReference,
        status: 'success' as const,
        channel: 'Online Payment Gateway',
        paidAt: new Date().toISOString(),
        verifiedBy: 'AITI Automated Gateway Service',
        notes: `Application Fee for ${appRecord.applicationId} (${appRecord.programTitle})`,
        qrVerificationUrl: `/verify?type=receipt&code=${receiptNumber}`
      };
      state.payments.unshift(transaction);

      db.save();
      db.addAuditLog(
        `${appRecord.firstName} ${appRecord.lastName}`,
        'student',
        'APPLICATION_FEE_PAID',
        'Payment',
        receiptNumber,
        `Paid application fee of NGN ${transaction.amount.toLocaleString()} for ${appRecord.applicationId}`
      );

      res.json({ success: true, application: appRecord, receipt: transaction });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 4. Admission Decisions & Letters
  app.get('/api/admissions', (req, res) => {
    const state = db.getState();
    res.json({ success: true, admissions: state.admissions });
  });

  app.post('/api/admissions/offer', (req, res) => {
    try {
      const { applicationId, programTitle, programType, commencementDate, orientationDate, conditions } = req.body;
      const state = db.getState();
      const appRecord = state.applications.find(a => a.id === applicationId || a.applicationId === applicationId);
      if (!appRecord) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      const admissionNumber = db.generateNextAdmissionNumber();
      const studentName = `${appRecord.firstName} ${appRecord.lastName}`;
      const progType = programType || appRecord.programType;
      const tuitionFee = progType === 'diploma' ? state.settings.admissions.diplomaTuition : state.settings.admissions.certificateTuition;

      const admission: any = {
        id: `adm-${Date.now()}`,
        admissionNumber,
        applicationId: appRecord.id,
        applicationRef: appRecord.applicationId,
        studentName,
        studentEmail: appRecord.email,
        studentPhone: appRecord.phone,
        programTitle: programTitle || appRecord.programTitle,
        programType: progType,
        duration: progType === 'diploma' ? '6 Months' : '3 Months',
        academicSession: state.settings.admissions.activeSession,
        commencementDate: commencementDate || state.settings.admissions.programStartDate,
        orientationDate: orientationDate || state.settings.admissions.orientationDate,
        conditions: conditions || [
          'Full or initial installment tuition payment prior to class resumption.',
          'Strict adherence to AITI technical laboratory safety and computer usage policies.',
          'Maintenance of a minimum of 80% practical attendance rate.'
        ],
        tuitionFee,
        acceptanceFee: state.settings.admissions.acceptanceFee,
        status: 'offered',
        offeredAt: new Date().toISOString(),
        qrVerificationUrl: `/verify?type=admission&code=${admissionNumber}`
      };

      state.admissions.unshift(admission);
      appRecord.status = 'admission_offered';

      db.save();
      db.addAuditLog(
        req.body.adminName || 'Admissions Directorate',
        'admissions_officer',
        'ADMISSION_OFFERED',
        'Admission',
        admissionNumber,
        `Offered admission to ${studentName} (${admission.programTitle})`
      );

      res.json({ success: true, admission, message: 'Admission offer created successfully.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Enroll Admitted Student
  app.post('/api/admissions/enroll', (req, res) => {
    try {
      const { admissionId, classId } = req.body;
      const state = db.getState();
      const adm = state.admissions.find(a => a.id === admissionId || a.admissionNumber === admissionId);
      if (!adm) {
        return res.status(404).json({ success: false, message: 'Admission record not found' });
      }

      const studentNumber = db.generateNextStudentNumber();
      const appRecord = state.applications.find(a => a.id === adm.applicationId || a.applicationId === adm.applicationRef);

      const targetClass = state.classes.find(c => c.id === classId) || state.classes[0];

      const newStudent: any = {
        id: `stu-${Date.now()}`,
        studentNumber,
        admissionNumber: adm.admissionNumber,
        userId: `usr-${Date.now()}`,
        fullName: adm.studentName,
        email: adm.studentEmail,
        phone: adm.studentPhone,
        whatsapp: appRecord?.whatsapp || adm.studentPhone,
        dateOfBirth: appRecord?.dateOfBirth || '2000-01-01',
        gender: appRecord?.gender || 'not specified',
        residentialAddress: appRecord?.residentialAddress || state.settings.contact.address,
        passportPhotoUrl: appRecord?.passportPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        programTitle: adm.programTitle,
        programType: adm.programType,
        academicSession: adm.academicSession,
        classId: targetClass?.id,
        className: targetClass?.title,
        enrollmentDate: new Date().toISOString().split('T')[0],
        expectedGraduationDate: adm.programType === 'diploma' ? '2027-02-28' : '2026-11-30',
        status: 'active',
        totalTuition: adm.tuitionFee,
        amountPaid: 0,
        outstandingBalance: adm.tuitionFee,
        attendancePercentage: 100,
        qrCodeUrl: `/verify?type=student&code=${studentNumber}`
      };

      state.students.unshift(newStudent);
      adm.status = 'enrolled';
      adm.assignedStudentId = studentNumber;
      adm.assignedClassId = targetClass?.id;

      if (appRecord) {
        appRecord.status = 'enrolled';
      }

      if (targetClass) {
        targetClass.totalStudents = (targetClass.totalStudents || 0) + 1;
      }

      // Generate initial Tuition Invoice
      const invoiceNumber = db.generateNextInvoiceNumber();
      const invoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber,
        studentId: newStudent.id,
        studentName: newStudent.fullName,
        studentEmail: newStudent.email,
        studentNumber: newStudent.studentNumber,
        title: `${adm.programTitle} - Academic Tuition Invoice`,
        description: `Official tuition and practical laboratory access fee for session ${adm.academicSession}`,
        amount: adm.tuitionFee,
        amountPaid: 0,
        balance: adm.tuitionFee,
        dueDate: adm.commencementDate || '2026-11-15',
        status: 'unpaid' as const,
        items: [
          { description: 'Academic Tuition & Practical Lab Fee', amount: adm.tuitionFee - 10000 },
          { description: 'Student ID & Course Materials Pack', amount: 10000 }
        ],
        createdAt: new Date().toISOString()
      };
      state.invoices.unshift(invoice);

      db.save();
      db.addAuditLog(
        req.body.adminName || 'Admissions Directorate',
        'admissions_officer',
        'STUDENT_ENROLLED',
        'Student',
        studentNumber,
        `Enrolled student ${newStudent.fullName} into ${adm.programTitle} with Student ID ${studentNumber}`
      );

      res.json({ success: true, student: newStudent, admission: adm, invoice, message: 'Student enrolled successfully.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 5. Students Directory
  app.get('/api/students', (req, res) => {
    const state = db.getState();
    res.json({ success: true, students: state.students });
  });

  app.put('/api/students/:id', (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const state = db.getState();
      const idx = state.students.findIndex(s => s.id === id || s.studentNumber === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }
      state.students[idx] = { ...state.students[idx], ...updates };
      db.save();
      res.json({ success: true, student: state.students[idx] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/admin/authenticate', async (req, res) => {
    try {
      if (!isPostgresConfigured || req.body?.pin !== process.env.ADMIN_ACCESS_PIN) {
        return res.status(401).json({ success: false, error: 'Invalid administrator access PIN.' });
      }
      const users = await queryDatabase<any>(
        `SELECT id, email, full_name AS "fullName", phone, whatsapp, role, department,
                student_id AS "studentId", student_number AS "studentNumber",
                admission_number AS "admissionNumber", linked_student_id AS "linkedStudentId",
                created_at AS "createdAt"
         FROM users WHERE role IN ('super_admin', 'admin') ORDER BY created_at ASC LIMIT 1`
      );
      if (!users[0]) {
        return res.status(404).json({ success: false, error: 'No administrator account exists in the database.' });
      }
      res.json({ success: true, user: users[0] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/admin/users', async (req, res) => {
    try {
      if (isPostgresConfigured) {
        const users = await queryDatabase<any>(
          `SELECT id, email, full_name AS "fullName", phone, whatsapp, role, department,
                  student_id AS "studentId", student_number AS "studentNumber",
                  admission_number AS "admissionNumber", linked_student_id AS "linkedStudentId",
                  created_at AS "createdAt"
           FROM users ORDER BY created_at DESC`
        );
        return res.json({ success: true, users });
      }
      const state = db.getState();
      const users = (state.users || []).map((user: any) => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || '',
        whatsapp: user.whatsapp || user.phone || '',
        role: user.role,
        department: user.department || 'General',
        studentNumber: user.studentNumber || '',
        admissionNumber: user.admissionNumber || '',
        linkedStudentId: user.linkedStudentId || '',
        createdAt: user.createdAt || new Date().toISOString()
      }));
      res.json({ success: true, users });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/admin/users', async (req, res) => {
    try {
      const payload = req.body || {};
      if (!payload.email || !payload.fullName || !payload.role) {
        return res.status(400).json({ success: false, error: 'Email, full name, and role are required.' });
      }
      if (isPostgresConfigured && supabasePool) {
        const id = payload.id || `usr-${Date.now()}`;
        const result = await supabasePool.query(
          `INSERT INTO users (id, email, full_name, phone, whatsapp, role, department, student_id, student_number, admission_number, linked_student_id)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
           RETURNING id, email, full_name AS "fullName", phone, whatsapp, role, department,
                     student_id AS "studentId", student_number AS "studentNumber",
                     admission_number AS "admissionNumber", linked_student_id AS "linkedStudentId", created_at AS "createdAt"`,
          [id, payload.email, payload.fullName, payload.phone || null, payload.whatsapp || null, payload.role, payload.department || null,
            payload.studentId || null, payload.studentNumber || null, payload.admissionNumber || null, payload.linkedStudentId || null]
        );
        return res.json({ success: true, user: result.rows[0] });
      }
      const state = db.getState();
      const role = payload.role || 'student';
      const newUser = {
        id: payload.id || `usr-${Date.now()}`,
        email: payload.email,
        fullName: payload.fullName,
        phone: payload.phone || '',
        whatsapp: payload.whatsapp || payload.phone || '',
        role,
        department: payload.department || 'General Administration',
        studentId: payload.studentId || undefined,
        studentNumber: payload.studentNumber || undefined,
        admissionNumber: payload.admissionNumber || undefined,
        linkedStudentId: payload.linkedStudentId || undefined,
        createdAt: new Date().toISOString()
      };

      state.users.unshift(newUser);

      db.save();
      db.addAuditLog(
        newUser.fullName,
        role,
        'USER_CREATED',
        'User',
        newUser.id,
        `Created ${role} profile for ${newUser.email}`
      );
      res.json({ success: true, user: newUser });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/admin/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body || {};
      if (isPostgresConfigured && supabasePool) {
        const result = await supabasePool.query(
          `UPDATE users SET full_name = COALESCE($2, full_name), email = COALESCE($3, email),
             phone = $4, whatsapp = $5, role = COALESCE($6, role), department = $7,
             student_number = $8, admission_number = $9, linked_student_id = $10, updated_at = NOW()
           WHERE id = $1
           RETURNING id, email, full_name AS "fullName", phone, whatsapp, role, department,
                     student_id AS "studentId", student_number AS "studentNumber",
                     admission_number AS "admissionNumber", linked_student_id AS "linkedStudentId", created_at AS "createdAt"`,
          [id, updates.fullName, updates.email, updates.phone || null, updates.whatsapp || null, updates.role,
            updates.department || null, updates.studentNumber || null, updates.admissionNumber || null, updates.linkedStudentId || null]
        );
        if (!result.rows[0]) return res.status(404).json({ success: false, message: 'User not found' });
        return res.json({ success: true, user: result.rows[0] });
      }
      const state = db.getState();
      const userIdx = state.users.findIndex(u => u.id === id || u.email === id);
      if (userIdx === -1) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      state.users[userIdx] = { ...state.users[userIdx], ...updates };

      if (state.users[userIdx].role === 'student') {
        const studentIdx = state.students.findIndex(s => s.id === state.users[userIdx].studentId || s.email === state.users[userIdx].email || s.userId === state.users[userIdx].id);
        if (studentIdx >= 0) {
          state.students[studentIdx] = {
            ...state.students[studentIdx],
            fullName: state.users[userIdx].fullName,
            email: state.users[userIdx].email,
            phone: state.users[userIdx].phone,
            whatsapp: state.users[userIdx].whatsapp || state.users[userIdx].phone,
            studentNumber: state.users[userIdx].studentNumber || state.students[studentIdx].studentNumber,
            admissionNumber: state.users[userIdx].admissionNumber || state.students[studentIdx].admissionNumber,
          };
        }
      }

      db.save();
      db.addAuditLog(
        state.users[userIdx].fullName,
        state.users[userIdx].role,
        'USER_UPDATED',
        'User',
        state.users[userIdx].id,
        `Updated profile details for ${state.users[userIdx].email}`
      );
      res.json({ success: true, user: state.users[userIdx] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 6. Academic Management (Classes, Courses, Timetables)
  app.get('/api/classes', (req, res) => {
    const state = db.getState();
    res.json({ success: true, classes: state.classes });
  });

  app.post('/api/classes', (req, res) => {
    try {
      const payload = req.body;
      const state = db.getState();
      const newClass = {
        id: `cls-${Date.now()}`,
        ...payload,
        totalStudents: 0,
        active: true
      };
      state.classes.unshift(newClass);
      db.save();
      res.json({ success: true, class: newClass });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/timetables', (req, res) => {
    const state = db.getState();
    res.json({ success: true, timetables: state.timetable });
  });

  app.post('/api/timetables', (req, res) => {
    try {
      const payload = req.body;
      const state = db.getState();
      const newEntry = {
        id: `tt-${Date.now()}`,
        ...payload
      };
      state.timetable.push(newEntry);
      db.save();
      res.json({ success: true, entry: newEntry });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 7. Attendance
  app.get('/api/attendance', (req, res) => {
    const state = db.getState();
    const { classId, studentId, date } = req.query;
    let list = state.attendance;
    if (classId) list = list.filter(a => a.classId === classId);
    if (studentId) list = list.filter(a => a.studentId === studentId);
    if (date) list = list.filter(a => a.date === date);
    res.json({ success: true, attendance: list });
  });

  app.post('/api/attendance/mark', (req, res) => {
    try {
      const { classId, records, date, recordedBy } = req.body;
      const state = db.getState();
      const today = date || new Date().toISOString().split('T')[0];

      records.forEach((rec: any) => {
        const existingIdx = state.attendance.findIndex(a => a.classId === classId && a.studentId === rec.studentId && a.date === today);
        const item = {
          id: existingIdx >= 0 ? state.attendance[existingIdx].id : `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          classId,
          studentId: rec.studentId,
          studentName: rec.studentName,
          studentNumber: rec.studentNumber,
          date: today,
          status: rec.status,
          recordedBy: recordedBy || 'Instructor',
          remarks: rec.remarks || '',
          recordedAt: new Date().toISOString()
        };
        if (existingIdx >= 0) {
          state.attendance[existingIdx] = item;
        } else {
          state.attendance.unshift(item);
        }
      });

      // Recalculate student attendance percentages
      state.students.forEach(s => {
        const studentAtt = state.attendance.filter(a => a.studentId === s.id);
        if (studentAtt.length > 0) {
          const presents = studentAtt.filter(a => a.status === 'present' || a.status === 'late').length;
          s.attendancePercentage = Math.round((presents / studentAtt.length) * 100);
        }
      });

      db.save();
      res.json({ success: true, message: 'Attendance recorded successfully.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 8. Assignments & Submissions
  app.get('/api/assignments', (req, res) => {
    const state = db.getState();
    res.json({ success: true, assignments: state.assignments, submissions: state.submissions });
  });

  app.post('/api/assignments', (req, res) => {
    try {
      const payload = req.body;
      const state = db.getState();
      const newAsg = {
        id: `asg-${Date.now()}`,
        ...payload,
        submissionsCount: 0,
        createdAt: new Date().toISOString()
      };
      state.assignments.unshift(newAsg);
      db.save();
      res.json({ success: true, assignment: newAsg });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/assignments/:id/submit', (req, res) => {
    try {
      const { id } = req.params;
      const payload = req.body;
      const state = db.getState();
      const asg = state.assignments.find(a => a.id === id);
      if (!asg) {
        return res.status(404).json({ success: false, message: 'Assignment not found' });
      }

      const submission = {
        id: `sub-${Date.now()}`,
        assignmentId: id,
        assignmentTitle: asg.title,
        studentId: payload.studentId,
        studentName: payload.studentName,
        studentNumber: payload.studentNumber,
        submissionText: payload.submissionText || '',
        attachmentName: payload.attachmentName || '',
        submittedAt: new Date().toISOString(),
        maxScore: asg.maxScore,
        graded: false
      };

      state.submissions.unshift(submission);
      asg.submissionsCount = (asg.submissionsCount || 0) + 1;

      db.save();
      res.json({ success: true, submission, message: 'Assignment submitted successfully.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/assignments/submissions/:subId/grade', (req, res) => {
    try {
      const { subId } = req.params;
      const { score, feedback, gradedBy } = req.body;
      const state = db.getState();
      const sub = state.submissions.find(s => s.id === subId);
      if (!sub) {
        return res.status(404).json({ success: false, message: 'Submission not found' });
      }

      sub.score = Number(score);
      sub.feedback = feedback;
      sub.graded = true;
      sub.gradedBy = gradedBy || 'Instructor';
      sub.gradedAt = new Date().toISOString();

      db.save();
      res.json({ success: true, submission: sub, message: 'Graded successfully.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 9. Results & Assessment Compilation
  app.get('/api/results', (req, res) => {
    const state = db.getState();
    const { studentId } = req.query;
    let list = state.results;
    if (studentId) list = list.filter(r => r.studentId === studentId);
    res.json({ success: true, results: list });
  });

  app.post('/api/results', (req, res) => {
    try {
      const payload = req.body;
      const state = db.getState();
      const assignmentScore = Number(payload.assignmentScore || 0);
      const testScore = Number(payload.testScore || 0);
      const practicalScore = Number(payload.practicalScore || 0);
      const examScore = Number(payload.examScore || 0);
      const totalScore = assignmentScore + testScore + practicalScore + examScore;

      let grade: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
      if (totalScore >= 70) grade = 'A';
      else if (totalScore >= 60) grade = 'B';
      else if (totalScore >= 50) grade = 'C';
      else if (totalScore >= 45) grade = 'D';

      const status: 'passed' | 'failed' = totalScore >= 45 ? 'passed' : 'failed';

      const newResult = {
        id: `res-${Date.now()}`,
        studentId: payload.studentId,
        studentName: payload.studentName,
        studentNumber: payload.studentNumber,
        classId: payload.classId,
        courseId: payload.courseId,
        courseCode: payload.courseCode,
        courseTitle: payload.courseTitle,
        academicSession: payload.academicSession || state.settings.admissions.activeSession,
        assignmentScore,
        testScore,
        practicalScore,
        examScore,
        totalScore,
        grade,
        status,
        remarks: payload.remarks || (status === 'passed' ? 'Satisfactory practical execution.' : 'Needs remedial review.'),
        published: true,
        recordedAt: new Date().toISOString()
      };

      state.results.unshift(newResult);
      db.save();
      res.json({ success: true, result: newResult, message: 'Result recorded successfully.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 10. Finance, Invoices & Payments
  app.get('/api/invoices', (req, res) => {
    const state = db.getState();
    const { studentId } = req.query;
    let list = state.invoices;
    if (studentId) list = list.filter(i => i.studentId === studentId);
    res.json({ success: true, invoices: list });
  });

  app.get('/api/payments', (req, res) => {
    const state = db.getState();
    const { studentId } = req.query;
    let list = state.payments;
    if (studentId) list = list.filter(p => p.studentId === studentId);
    res.json({ success: true, payments: list });
  });

  app.post('/api/payments/pay-invoice', (req, res) => {
    try {
      const { invoiceId, amount, gateway, gatewayReference } = req.body;
      const state = db.getState();
      const invoice = state.invoices.find(i => i.id === invoiceId || i.invoiceNumber === invoiceId);
      if (!invoice) {
        return res.status(404).json({ success: false, message: 'Invoice not found' });
      }

      const payAmount = Number(amount || invoice.balance);
      const receiptNumber = db.generateNextReceiptNumber();

      invoice.amountPaid = (invoice.amountPaid || 0) + payAmount;
      invoice.balance = Math.max(0, invoice.amount - invoice.amountPaid);
      invoice.status = invoice.balance === 0 ? 'paid' : 'partially_paid';

      // Update student balance
      const student = state.students.find(s => s.id === invoice.studentId || s.studentNumber === invoice.studentNumber);
      if (student) {
        student.amountPaid = (student.amountPaid || 0) + payAmount;
        student.outstandingBalance = Math.max(0, student.totalTuition - student.amountPaid);
      }

      const payment = {
        id: `pay-${Date.now()}`,
        receiptNumber,
        invoiceId: invoice.id,
        studentId: invoice.studentId,
        studentName: invoice.studentName,
        studentEmail: invoice.studentEmail,
        paymentType: 'tuition' as const,
        amount: payAmount,
        gateway: gateway || 'paystack',
        gatewayReference: gatewayReference || `AITI_TX_${Date.now()}`,
        status: 'success' as const,
        channel: 'Online Card / Bank Transfer',
        paidAt: new Date().toISOString(),
        verifiedBy: 'AITI Automated Gateway Service',
        notes: `Tuition Payment for ${invoice.invoiceNumber}`,
        qrVerificationUrl: `/verify?type=receipt&code=${receiptNumber}`
      };

      state.payments.unshift(payment);
      db.save();

      db.addAuditLog(
        invoice.studentName,
        'student',
        'TUITION_PAID',
        'Payment',
        receiptNumber,
        `Paid NGN ${payAmount.toLocaleString()} against invoice ${invoice.invoiceNumber}`
      );

      res.json({ success: true, invoice, payment, message: 'Payment recorded and verified successfully.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 11. Certificates & Graduation
  app.get('/api/certificates', (req, res) => {
    const state = db.getState();
    const { studentId } = req.query;
    let list = state.certificates;
    if (studentId) list = list.filter(c => c.studentId === studentId);
    res.json({ success: true, certificates: list });
  });

  app.post('/api/certificates/issue', (req, res) => {
    try {
      const { studentId, specializationArea, gradeAchieved } = req.body;
      const state = db.getState();
      const student = state.students.find(s => s.id === studentId || s.studentNumber === studentId);
      if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }

      const certificateNumber = db.generateNextCertificateNumber();
      const cert = {
        id: `cert-${Date.now()}`,
        certificateNumber,
        studentId: student.id,
        studentName: student.fullName,
        studentNumber: student.studentNumber,
        programTitle: student.programTitle,
        programType: student.programType,
        duration: student.programType === 'diploma' ? '6 Months' : '3 Months',
        specializationArea: specializationArea || student.programTitle,
        completionDate: new Date().toISOString().split('T')[0],
        gradeAchieved: gradeAchieved || 'Distinction',
        signatoryName: state.settings.documents.authorizedSignatoryName,
        signatoryTitle: state.settings.documents.authorizedSignatoryTitle,
        issuedAt: new Date().toISOString(),
        status: 'issued' as const,
        qrVerificationUrl: `/verify?type=certificate&code=${certificateNumber}`
      };

      student.status = 'graduated';
      state.certificates.unshift(cert);

      db.save();
      db.addAuditLog(
        req.body.adminName || 'Director of Academics',
        'super_admin',
        'CERTIFICATE_ISSUED',
        'Certificate',
        certificateNumber,
        `Issued official certificate ${certificateNumber} to ${student.fullName}`
      );

      res.json({ success: true, certificate: cert, message: 'Certificate issued successfully.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 12. Public Digital Verification Portal
  app.get('/api/verify', (req, res) => {
    try {
      const { type, code } = req.query;
      if (!code) {
        return res.status(400).json({ success: false, message: 'Verification code is required.' });
      }

      const state = db.getState();
      const queryStr = String(code).trim().toLowerCase();

      // Check Admission
      if (!type || type === 'admission') {
        const adm = state.admissions.find(a => a.admissionNumber.toLowerCase() === queryStr || a.applicationRef.toLowerCase() === queryStr);
        if (adm) {
          return res.json({
            success: true,
            verified: true,
            type: 'admission',
            data: {
              admissionNumber: adm.admissionNumber,
              studentName: adm.studentName,
              programTitle: adm.programTitle,
              programType: adm.programType,
              session: adm.academicSession,
              status: adm.status,
              offeredAt: adm.offeredAt,
              institute: state.settings.general.fullName
            }
          });
        }
      }

      // Check Short Course Certificate / Academic Certificate
      if (!type || type === 'certificate') {
        const cert = state.certificates.find(c => c.certificateNumber.toLowerCase() === queryStr || c.studentNumber?.toLowerCase() === queryStr);
        if (cert) {
          return res.json({
            success: true,
            verified: true,
            type: 'certificate',
            data: {
              certificateNumber: cert.certificateNumber,
              studentName: cert.studentName,
              studentNumber: cert.studentNumber,
              programTitle: cert.programTitle,
              duration: cert.duration,
              completionDate: cert.completionDate,
              gradeAchieved: cert.gradeAchieved,
              status: cert.status,
              institute: state.settings.general.fullName
            }
          });
        }

        // Check in Short Course Enrollments
        const scEnrCert = (state.shortCourseEnrollments || []).find(e => 
          (e.certificateNumber && e.certificateNumber.toLowerCase() === queryStr) ||
          e.registrationId.toLowerCase() === queryStr ||
          e.enrollmentNumber.toLowerCase() === queryStr
        );
        if (scEnrCert && scEnrCert.certificateIssued) {
          return res.json({
            success: true,
            verified: true,
            type: 'short_course_certificate',
            data: {
              certificateNumber: scEnrCert.certificateNumber || `AITI/CERT/STC/2026/00025`,
              participantName: scEnrCert.fullName,
              courseTitle: scEnrCert.courseTitle,
              duration: scEnrCert.duration || '2 Weeks Intensive Practical Training',
              completionDate: scEnrCert.certificateDate || '2026-09-26',
              trainingMode: scEnrCert.trainingMode,
              registrationId: scEnrCert.registrationId,
              status: 'Verified Official Certificate of Completion',
              directorSignature: 'Engr. A. F. Taiwo (Executive Director)',
              institute: state.settings.general.fullName
            }
          });
        }
      }

      // Check Short Course Registration
      if (!type || type === 'short_course_registration' || type === 'registration') {
        const scEnr = (state.shortCourseEnrollments || []).find(e => 
          e.registrationId.toLowerCase() === queryStr ||
          e.enrollmentNumber.toLowerCase() === queryStr ||
          e.email.toLowerCase() === queryStr ||
          e.phone.toLowerCase() === queryStr
        );
        if (scEnr) {
          return res.json({
            success: true,
            verified: true,
            type: 'short_course_registration',
            data: {
              registrationId: scEnr.registrationId,
              fullName: scEnr.fullName,
              courseTitle: scEnr.courseTitle,
              schedule: scEnr.preferredSchedule,
              trainingMode: scEnr.trainingMode,
              paymentStatus: scEnr.paymentStatus,
              fee: scEnr.fee || scEnr.feeGHS,
              status: scEnr.status,
              enrolledAt: scEnr.createdAt || scEnr.enrolledAt,
              institute: state.settings.general.fullName
            }
          });
        }
      }

      // Check Corporate Quotation
      if (!type || type === 'corporate_quotation' || type === 'quotation') {
        const quo = (state.corporateQuotations || []).find(q => 
          q.quotationNumber.toLowerCase() === queryStr ||
          q.requestNumber?.toLowerCase() === queryStr ||
          q.id.toLowerCase() === queryStr
        );
        if (quo) {
          return res.json({
            success: true,
            verified: true,
            type: 'corporate_quotation',
            data: {
              quotationNumber: quo.quotationNumber,
              organizationName: quo.organizationName,
              contactPerson: quo.contactPerson,
              trainingTitle: quo.trainingTitle,
              numberOfParticipants: quo.numberOfParticipants,
              trainingDuration: quo.trainingDuration,
              totalAmount: quo.totalAmount,
              status: quo.status,
              issuedAt: quo.issuedAt,
              validUntil: quo.validUntil,
              signatory: quo.authorizedSignatoryName,
              institute: state.settings.general.fullName
            }
          });
        }
      }

      // Check Corporate Invoice
      if (!type || type === 'corporate_invoice' || type === 'invoice') {
        const cinv = (state.corporateInvoices || []).find(i => 
          i.invoiceNumber.toLowerCase() === queryStr ||
          i.quotationNumber?.toLowerCase() === queryStr
        );
        if (cinv) {
          return res.json({
            success: true,
            verified: true,
            type: 'corporate_invoice',
            data: {
              invoiceNumber: cinv.invoiceNumber,
              organizationName: cinv.organizationName,
              trainingTitle: cinv.trainingTitle,
              netAmount: cinv.netAmount,
              amountPaid: cinv.amountPaid,
              balance: cinv.balance,
              paymentStatus: cinv.paymentStatus,
              dueDate: cinv.dueDate,
              issuedAt: cinv.issuedAt,
              institute: state.settings.general.fullName
            }
          });
        }
      }

      // Check Corporate Training Request
      if (!type || type === 'corporate_request') {
        const corp = (state.corporateRequests || []).find(r => 
          r.requestNumber.toLowerCase() === queryStr ||
          r.requestCode?.toLowerCase() === queryStr
        );
        if (corp) {
          return res.json({
            success: true,
            verified: true,
            type: 'corporate_request',
            data: {
              requestNumber: corp.requestNumber,
              organizationName: corp.organizationName,
              organizationType: corp.organizationType,
              contactPerson: corp.contactPerson,
              trainingTopic: corp.preferredTrainingTopic || corp.trainingTopic,
              status: corp.status,
              submittedAt: corp.submittedAt || corp.createdAt,
              institute: state.settings.general.fullName
            }
          });
        }
      }

      // Check Student ID
      if (!type || type === 'student') {
        const stu = state.students.find(s => s.studentNumber.toLowerCase() === queryStr || s.admissionNumber.toLowerCase() === queryStr);
        if (stu) {
          return res.json({
            success: true,
            verified: true,
            type: 'student',
            data: {
              studentNumber: stu.studentNumber,
              fullName: stu.fullName,
              programTitle: stu.programTitle,
              session: stu.academicSession,
              className: stu.className,
              status: stu.status,
              institute: state.settings.general.fullName
            }
          });
        }
      }

      // Check Receipt
      if (!type || type === 'receipt') {
        const rec = state.payments.find(p => p.receiptNumber.toLowerCase() === queryStr || p.gatewayReference.toLowerCase() === queryStr);
        if (rec) {
          return res.json({
            success: true,
            verified: true,
            type: 'receipt',
            data: {
              receiptNumber: rec.receiptNumber,
              studentName: rec.studentName,
              amount: rec.amount,
              paymentType: rec.paymentType,
              paidAt: rec.paidAt,
              status: rec.status,
              institute: state.settings.general.fullName
            }
          });
        }
      }

      res.json({ success: false, verified: false, message: 'No official AITI record matched the provided verification reference.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 13. CRM Leads & Contact Messages
  app.get('/api/crm/leads', (req, res) => {
    const state = db.getState();
    res.json({ success: true, leads: state.leads });
  });

  app.post('/api/crm/leads', (req, res) => {
    try {
      const payload = req.body;
      const state = db.getState();
      const newLead = {
        id: `lead-${Date.now()}`,
        fullName: payload.fullName,
        email: payload.email || '',
        phone: payload.phone,
        whatsapp: payload.whatsapp || payload.phone,
        programInterest: payload.programInterest || 'General Inquiry',
        source: payload.source || 'website',
        status: payload.status || 'new',
        notes: payload.notes || '',
        createdAt: new Date().toISOString()
      };
      state.leads.unshift(newLead);
      db.save();
      res.json({ success: true, lead: newLead });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/crm/leads/:id', (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const state = db.getState();
      const idx = state.leads.findIndex(l => l.id === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Lead not found' });
      state.leads[idx] = { ...state.leads[idx], ...updates };
      db.save();
      res.json({ success: true, lead: state.leads[idx] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/contacts', (req, res) => {
    const state = db.getState();
    res.json({ success: true, contacts: state.contacts });
  });

  app.post('/api/contacts', (req, res) => {
    try {
      const payload = req.body;
      const state = db.getState();
      const msg = {
        id: `cnt-${Date.now()}`,
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone || '',
        subject: payload.subject,
        message: payload.message,
        status: 'new' as const,
        createdAt: new Date().toISOString()
      };
      state.contacts.unshift(msg);

      // Also create a lead
      const lead = {
        id: `lead-${Date.now()}`,
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone || '',
        whatsapp: payload.phone || '',
        programInterest: payload.subject,
        source: 'contact_form' as const,
        status: 'new' as const,
        notes: payload.message,
        createdAt: new Date().toISOString()
      };
      state.leads.unshift(lead);

      db.save();
      res.json({ success: true, message: 'Thank you for reaching out to AITI. We will get back to you shortly!' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 14. Training Catalogue (Short Courses, Categories, Corporate Training, Enrollments)
  app.get('/api/public/short-course-categories', (req, res) => {
    const state = db.getState();
    const categories = (state.shortCourseCategories || []).filter(c => c.active !== false);
    res.json({ success: true, categories });
  });

  app.get('/api/short-course-categories', (req, res) => {
    const state = db.getState();
    res.json({ success: true, categories: state.shortCourseCategories || [] });
  });

  app.post('/api/short-course-categories', (req, res) => {
    try {
      const state = db.getState();
      const payload = req.body;
      const newCat = {
        id: `scc-${Date.now()}`,
        name: payload.name,
        slug: payload.slug || payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: payload.description || '',
        icon: payload.icon || 'GraduationCap',
        order: payload.order || (state.shortCourseCategories?.length || 0) + 1,
        active: payload.active !== undefined ? payload.active : true
      };
      if (!state.shortCourseCategories) state.shortCourseCategories = [];
      state.shortCourseCategories.push(newCat);
      db.save();
      db.addAuditLog(req.body.adminName || 'Admin', 'super_admin', 'CREATE_CATEGORY', 'ShortCourseCategory', newCat.id, `Created short course category: ${newCat.name}`);
      res.json({ success: true, category: newCat });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/short-course-categories/:id', (req, res) => {
    try {
      const { id } = req.params;
      const state = db.getState();
      const idx = (state.shortCourseCategories || []).findIndex(c => c.id === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Category not found' });
      state.shortCourseCategories[idx] = { ...state.shortCourseCategories[idx], ...req.body };
      db.save();
      res.json({ success: true, category: state.shortCourseCategories[idx] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete('/api/short-course-categories/:id', (req, res) => {
    try {
      const { id } = req.params;
      const state = db.getState();
      state.shortCourseCategories = (state.shortCourseCategories || []).filter(c => c.id !== id);
      db.save();
      res.json({ success: true, message: 'Category deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Public Short Courses
  app.get('/api/public/short-courses', (req, res) => {
    const state = db.getState();
    let list = (state.shortCourses || []).filter(c => c.active !== false);
    const { category, deliveryMode, search, featured } = req.query;
    if (category) {
      list = list.filter(c => c.categoryId === String(category) || c.categoryName.toLowerCase().includes(String(category).toLowerCase()));
    }
    if (deliveryMode) {
      list = list.filter(c => c.deliveryMode === deliveryMode || c.deliveryMode === 'hybrid');
    }
    if (featured === 'true') {
      list = list.filter(c => c.featured);
    }
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.categoryName.toLowerCase().includes(q) ||
        c.targetAudience?.toLowerCase().includes(q)
      );
    }
    res.json({ success: true, shortCourses: list });
  });

  app.get('/api/public/short-courses/:id', (req, res) => {
    const { id } = req.params;
    const state = db.getState();
    const course = (state.shortCourses || []).find(c => c.id === id || c.slug === id);
    if (!course) return res.status(404).json({ success: false, message: 'Short course not found' });
    res.json({ success: true, shortCourse: course });
  });

  // Admin Short Courses CRUD
  app.get('/api/short-courses', (req, res) => {
    const state = db.getState();
    res.json({ success: true, shortCourses: state.shortCourses || [] });
  });

  app.post('/api/short-courses', (req, res) => {
    try {
      const state = db.getState();
      const payload = req.body;
      const count = (state.shortCourses?.length || 0) + 1;
      const code = payload.code || `AITI-SC-${count.toString().padStart(3, '0')}`;
      const slug = payload.slug || payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const newCourse = {
        id: `sc-${Date.now()}`,
        code,
        title: payload.title,
        slug,
        categoryId: payload.categoryId,
        categoryName: payload.categoryName || 'General Tech',
        description: payload.description || '',
        durationWeeks: Number(payload.durationWeeks) || 8,
        durationHours: Number(payload.durationHours) || 64,
        feeNGN: Number(payload.feeNGN) !== undefined ? Number(payload.feeNGN) : (Number(payload.feeGHS) || 70000),
        feeGHS: Number(payload.feeGHS) || Number(payload.feeNGN) || 70000,
        internationalOnlineFee: Number(payload.internationalOnlineFee) || 100,
        deliveryMode: payload.deliveryMode || 'hybrid',
        deliveryModes: payload.deliveryModes || ['Physical (Weekday Morning / Afternoon)', 'Physical (Weekend Immersion)', 'Online (Evening Live)', 'Online (Self-Paced / Flexible)'],
        location: payload.location || 'AITI Campus, Tanke, Ilorin, Nigeria / Online',
        upcomingBatches: payload.upcomingBatches || ['Next Cohort Starts 1st of Next Month'],
        instructorName: payload.instructorName || 'AITI Certified Faculty',
        instructorTitle: payload.instructorTitle || 'Senior Technical Lead',
        instructorAvatar: payload.instructorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        syllabus: payload.syllabus || [],
        modules: payload.modules || [],
        completionRules: payload.completionRules || {
          minAttendancePercent: 80,
          minAssignmentScorePercent: 65,
          finalProjectRequired: true,
          passGradePercent: 60
        },
        certificateDetails: payload.certificateDetails || {
          type: 'Certificate of Completion',
          issuingAuthority: 'AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE (AITI)',
          format: 'Digital Verifiable Certificate with QR Code + Hardcopy at Graduation',
          verifiability: 'Globally Verifiable at verify.aiti.edu.ng'
        },
        whoCanEnroll: payload.whoCanEnroll || ['Beginners with no prior experience', 'Working professionals upskilling', 'Students & Graduates'],
        toolsCovered: payload.toolsCovered || [],
        finalProject: payload.finalProject || 'Comprehensive Capstone Portfolio Project',
        prerequisites: payload.prerequisites || 'Basic computer literacy and enthusiasm to learn.',
        targetAudience: payload.targetAudience || 'Beginners and professionals looking to master practical tech skills.',
        learningOutcomes: payload.learningOutcomes || [],
        certificateAwarded: payload.certificateAwarded !== undefined ? payload.certificateAwarded : true,
        maxSeatsPerBatch: Number(payload.maxSeatsPerBatch) || 25,
        enrolledCount: 0,
        active: payload.active !== undefined ? payload.active : true,
        featured: Boolean(payload.featured),
        bannerImage: payload.bannerImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
        createdAt: new Date().toISOString()
      };

      if (!state.shortCourses) state.shortCourses = [];
      state.shortCourses.unshift(newCourse);
      db.save();
      db.addAuditLog(req.body.adminName || 'Admin', 'super_admin', 'CREATE_SHORT_COURSE', 'ShortCourse', newCourse.id, `Created short course: ${newCourse.title} (${newCourse.code})`);
      res.json({ success: true, shortCourse: newCourse });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/short-courses/:id', (req, res) => {
    try {
      const { id } = req.params;
      const state = db.getState();
      const idx = (state.shortCourses || []).findIndex(c => c.id === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Short course not found' });
      state.shortCourses[idx] = { ...state.shortCourses[idx], ...req.body, updatedAt: new Date().toISOString() };
      db.save();
      db.addAuditLog(req.body.adminName || 'Admin', 'super_admin', 'UPDATE_SHORT_COURSE', 'ShortCourse', id, `Updated short course: ${state.shortCourses[idx].title}`);
      res.json({ success: true, shortCourse: state.shortCourses[idx] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete('/api/short-courses/:id', (req, res) => {
    try {
      const { id } = req.params;
      const state = db.getState();
      const course = (state.shortCourses || []).find(c => c.id === id);
      state.shortCourses = (state.shortCourses || []).filter(c => c.id !== id);
      db.save();
      if (course) {
        db.addAuditLog(req.body?.adminName || 'Admin', 'super_admin', 'DELETE_SHORT_COURSE', 'ShortCourse', id, `Deleted short course: ${course.title}`);
      }
      res.json({ success: true, message: 'Short course removed successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // Corporate Training CRM & Proposals
  // ==========================================
  app.get('/api/corporate-requests', (req, res) => {
    const state = db.getState();
    let requests = state.corporateRequests || [];
    const { status, format, search } = req.query;
    if (status && status !== 'all') requests = requests.filter(r => r.status === status);
    if (format && format !== 'all') requests = requests.filter(r => (r.trainingLocationType === format || r.trainingFormat === format));
    if (search) {
      const q = String(search).toLowerCase();
      requests = requests.filter(r =>
        (r.organizationName && r.organizationName.toLowerCase().includes(q)) ||
        (r.companyName && r.companyName.toLowerCase().includes(q)) ||
        (r.contactPerson && r.contactPerson.toLowerCase().includes(q)) ||
        (r.email && r.email.toLowerCase().includes(q)) ||
        (r.requestNumber && r.requestNumber.toLowerCase().includes(q)) ||
        (r.requestCode && r.requestCode.toLowerCase().includes(q)) ||
        (r.preferredTrainingTopic && r.preferredTrainingTopic.toLowerCase().includes(q))
      );
    }
    res.json({ success: true, requests });
  });

  app.post('/api/public/corporate-requests', (req, res) => {
    try {
      const state = db.getState();
      const payload = req.body;
      const requestNumber = db.generateNextCorporateRequestId();

      const newReq = {
        id: `corp-${Date.now()}`,
        requestCode: requestNumber,
        requestNumber,
        organizationName: payload.organizationName || payload.companyName || 'Corporate Client',
        companyName: payload.organizationName || payload.companyName || 'Corporate Client',
        organizationType: payload.organizationType || 'Private Enterprise',
        industry: payload.industry || 'Corporate / Enterprise',
        contactPerson: payload.contactPerson || 'Training Coordinator',
        designation: payload.designation || payload.position || 'HR / Training Lead',
        email: payload.email,
        phone: payload.phone,
        whatsapp: payload.whatsapp || payload.phone,
        physicalAddress: payload.physicalAddress || payload.address || 'Accra, Ghana',
        numberOfStaff: Number(payload.numberOfStaff || payload.estimatedParticipants) || 10,
        estimatedParticipants: Number(payload.numberOfStaff || payload.estimatedParticipants) || 10,
        targetStaffGroup: payload.targetStaffGroup || 'Technical & Operational Staff',
        preferredTrainingTopic: payload.preferredTrainingTopic || payload.trainingTopic || 'Custom Corporate Capacity Development',
        selectedTopics: payload.selectedTopics || [payload.preferredTrainingTopic || 'Custom Training'],
        preferredDuration: payload.preferredDuration || payload.duration || '5-Day Executive Workshop',
        preferredStartDate: payload.preferredStartDate || payload.preferredDates || '',
        preferredDates: payload.preferredStartDate || payload.preferredDates || '',
        trainingLocationType: payload.trainingLocationType || payload.trainingFormat || 'at_client_facility',
        trainingFormat: payload.trainingLocationType || payload.trainingFormat || 'at_client_facility',
        trainingMode: payload.trainingMode || 'Physical (In-Person)',
        specificRequirements: payload.specificRequirements || payload.customRequirements || payload.trainingNeeds || '',
        trainingNeeds: payload.specificRequirements || payload.customRequirements || payload.trainingNeeds || '',
        budgetRange: payload.budgetRange || 'Flexible / Awaiting Proposal',
        status: 'NEW' as const,
        submittedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        participants: []
      };

      if (!state.corporateRequests) state.corporateRequests = [];
      state.corporateRequests.unshift(newReq);

      // Create a lead in CRM automatically
      const lead = {
        id: `lead-${Date.now()}`,
        fullName: `${newReq.contactPerson} (${newReq.organizationName})`,
        email: newReq.email,
        phone: newReq.phone,
        whatsapp: newReq.whatsapp,
        programInterest: `Corporate Training: ${newReq.preferredTrainingTopic}`,
        source: 'corporate_inquiry' as const,
        status: 'new' as const,
        notes: `Corporate Request ${requestNumber} for ${newReq.organizationName} (${newReq.numberOfStaff} staff). Topic: ${newReq.preferredTrainingTopic}`,
        createdAt: new Date().toISOString()
      };
      if (!state.leads) state.leads = [];
      state.leads.unshift(lead);

      db.save();
      db.addAuditLog(
        newReq.contactPerson,
        'corporate_lead',
        'CORPORATE_REQUEST_SUBMITTED',
        'CorporateTrainingRequest',
        requestNumber,
        `New corporate training request submitted by ${newReq.organizationName} (${requestNumber})`
      );

      res.json({
        success: true,
        requestNumber,
        request: newReq,
        message: 'Your corporate training request has been received. Our Corporate Training Directorate will contact you within 24 hours with a tailored proposal.'
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/corporate-requests/:id', (req, res) => {
    try {
      const { id } = req.params;
      const state = db.getState();
      const idx = (state.corporateRequests || []).findIndex(r => r.id === id || r.requestNumber === id || r.requestCode === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Corporate request not found' });

      state.corporateRequests[idx] = {
        ...state.corporateRequests[idx],
        ...req.body,
        updatedAt: new Date().toISOString()
      };

      db.save();
      db.addAuditLog(
        req.body.adminName || 'Admin',
        'super_admin',
        'UPDATE_CORPORATE_REQUEST',
        'CorporateTrainingRequest',
        state.corporateRequests[idx].requestNumber || state.corporateRequests[idx].requestCode || id,
        `Updated corporate request for ${state.corporateRequests[idx].organizationName || state.corporateRequests[idx].companyName} - Status: ${state.corporateRequests[idx].status}`
      );

      res.json({ success: true, request: state.corporateRequests[idx] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Participant roster management
  app.post('/api/corporate-requests/:id/participants', (req, res) => {
    try {
      const { id } = req.params;
      const { participants } = req.body;
      const state = db.getState();
      const idx = (state.corporateRequests || []).findIndex(r => r.id === id || r.requestNumber === id || r.requestCode === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Corporate request not found' });

      state.corporateRequests[idx].participants = participants || [];
      state.corporateRequests[idx].updatedAt = new Date().toISOString();
      db.save();

      res.json({ success: true, request: state.corporateRequests[idx] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Generate verified certificates for corporate participants
  app.post('/api/corporate-requests/:id/generate-certificates', (req, res) => {
    try {
      const { id } = req.params;
      const state = db.getState();
      const idx = (state.corporateRequests || []).findIndex(r => r.id === id || r.requestNumber === id || r.requestCode === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Corporate request not found' });

      const request = state.corporateRequests[idx];
      let certCounter = (state.certificates?.length || 0) + 50;

      const updatedParticipants = (request.participants || []).map((p, pIdx) => {
        certCounter++;
        const certNum = p.certificateNumber || `AITI/CERT/CORP/2026/${certCounter.toString().padStart(5, '0')}`;
        
        // Also add to global certificates list for verification
        const globalCert = {
          id: `cert-corp-${Date.now()}-${pIdx}`,
          certificateNumber: certNum,
          studentName: p.fullName,
          studentNumber: `CORP/${request.requestNumber || request.requestCode}/${pIdx + 1}`,
          programTitle: request.preferredTrainingTopic || request.trainingTopic || 'Corporate Professional Training',
          programType: 'corporate' as const,
          duration: request.preferredDuration || 'Executive Capacity Building',
          completionDate: request.scheduledEndDate || new Date().toISOString().split('T')[0],
          gradeAchieved: 'PROFICIENT',
          status: 'issued' as const,
          issuedAt: new Date().toISOString(),
          pdfUrl: `/certificates/${certNum.replace(/\//g, '-')}.pdf`
        };

        const existingIdx = (state.certificates || []).findIndex(c => c.certificateNumber === certNum);
        if (existingIdx >= 0) {
          state.certificates[existingIdx] = globalCert as any;
        } else {
          state.certificates.push(globalCert as any);
        }

        return {
          ...p,
          certificateIssued: true,
          certificateNumber: certNum,
          certificateDate: new Date().toISOString().split('T')[0]
        };
      });

      state.corporateRequests[idx].participants = updatedParticipants;
      state.corporateRequests[idx].status = 'COMPLETED';
      state.corporateRequests[idx].updatedAt = new Date().toISOString();

      db.save();
      res.json({
        success: true,
        message: `Successfully generated ${updatedParticipants.length} verified AITI Certificates of Completion!`,
        request: state.corporateRequests[idx]
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // Corporate Quotations & Invoices System
  // ==========================================
  app.get('/api/corporate-quotations', (req, res) => {
    const state = db.getState();
    res.json({ success: true, quotations: state.corporateQuotations || [] });
  });

  app.post('/api/corporate-quotations', (req, res) => {
    try {
      const state = db.getState();
      const payload = req.body;
      const quotationNumber = db.generateNextCorporateQuotationId();

      const items = payload.items || [
        {
          id: 'item-1',
          description: payload.trainingTitle || 'Corporate Training Delivery & Expert Facilitation',
          quantity: payload.numberOfParticipants || 10,
          unitPrice: Number(payload.costPerParticipant) || 1200,
          totalPrice: (payload.numberOfParticipants || 10) * (Number(payload.costPerParticipant) || 1200)
        }
      ];

      const subtotal = items.reduce((sum: number, it: any) => sum + (Number(it.totalPrice) || 0), 0);
      const vat = Math.round(subtotal * 0.15); // standard 15% VAT/NHIL/GETFund
      const totalAmount = subtotal + vat;

      const quotation = {
        id: `quo-${Date.now()}`,
        quotationNumber,
        requestId: payload.requestId || '',
        requestNumber: payload.requestNumber || '',
        organizationName: payload.organizationName,
        contactPerson: payload.contactPerson,
        email: payload.email,
        phone: payload.phone,
        trainingTitle: payload.trainingTitle,
        trainingDuration: payload.trainingDuration || '5 Days',
        numberOfParticipants: Number(payload.numberOfParticipants) || 10,
        trainingFormat: payload.trainingFormat || 'On-site at Client Office',
        proposedDates: payload.proposedDates || 'To be mutually agreed',
        items,
        subtotal,
        taxAmount: vat,
        discountAmount: Number(payload.discountAmount) || 0,
        totalAmount,
        currency: 'GHS',
        paymentTerms: payload.paymentTerms || '60% Advance Payment on Confirmation, 40% upon successful completion.',
        validUntil: payload.validUntil || '2026-10-31',
        status: 'SENT' as const,
        issuedAt: new Date().toISOString(),
        authorizedSignatoryName: 'Engr. A. F. Taiwo',
        authorizedSignatoryTitle: 'Executive Director & Provost, AITI',
        createdAt: new Date().toISOString()
      };

      if (!state.corporateQuotations) state.corporateQuotations = [];
      state.corporateQuotations.unshift(quotation);

      // If tied to a corporate request, update request status to PROPOSAL_SENT
      if (payload.requestId || payload.requestNumber) {
        const reqIdx = (state.corporateRequests || []).findIndex(r => r.id === payload.requestId || r.requestNumber === payload.requestNumber);
        if (reqIdx >= 0) {
          state.corporateRequests[reqIdx].status = 'PROPOSAL_SENT';
          state.corporateRequests[reqIdx].quotationNumber = quotationNumber;
        }
      }

      db.save();
      db.addAuditLog('Admin', 'super_admin', 'CREATE_CORPORATE_QUOTATION', 'CorporateQuotation', quotationNumber, `Created quotation for ${quotation.organizationName}`);

      res.json({ success: true, quotation });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/corporate-quotations/:id', (req, res) => {
    try {
      const { id } = req.params;
      const state = db.getState();
      const idx = (state.corporateQuotations || []).findIndex(q => q.id === id || q.quotationNumber === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Quotation not found' });

      state.corporateQuotations[idx] = { ...state.corporateQuotations[idx], ...req.body, updatedAt: new Date().toISOString() };
      db.save();
      res.json({ success: true, quotation: state.corporateQuotations[idx] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Convert Quotation to Invoice
  app.post('/api/corporate-quotations/:id/convert-to-invoice', (req, res) => {
    try {
      const { id } = req.params;
      const state = db.getState();
      const quoIdx = (state.corporateQuotations || []).findIndex(q => q.id === id || q.quotationNumber === id);
      if (quoIdx === -1) return res.status(404).json({ success: false, message: 'Quotation not found' });

      const quo = state.corporateQuotations[quoIdx];
      const invoiceNumber = db.generateNextCorporateInvoiceId();

      const invoice = {
        id: `corp-inv-${Date.now()}`,
        invoiceNumber,
        quotationId: quo.id,
        quotationNumber: quo.quotationNumber,
        requestId: quo.requestId,
        organizationName: quo.organizationName,
        contactPerson: quo.contactPerson,
        email: quo.email,
        phone: quo.phone,
        trainingTitle: quo.trainingTitle,
        items: quo.items,
        subtotal: quo.subtotal,
        taxAmount: quo.taxAmount,
        netAmount: quo.totalAmount,
        amountPaid: 0,
        balance: quo.totalAmount,
        currency: quo.currency || 'GHS',
        paymentStatus: 'UNPAID' as const,
        dueDate: '2026-10-15',
        issuedAt: new Date().toISOString(),
        paymentInstructions: 'Bank Transfer to AITI Corporate Account, Ghana Commercial Bank. Ref: ' + invoiceNumber,
        createdAt: new Date().toISOString()
      };

      if (!state.corporateInvoices) state.corporateInvoices = [];
      state.corporateInvoices.unshift(invoice);

      // Update quotation status
      state.corporateQuotations[quoIdx].status = 'APPROVED';

      // Update request status
      if (quo.requestId || quo.requestNumber) {
        const reqIdx = (state.corporateRequests || []).findIndex(r => r.id === quo.requestId || r.requestNumber === quo.requestNumber);
        if (reqIdx >= 0) {
          state.corporateRequests[reqIdx].status = 'INVOICED';
          state.corporateRequests[reqIdx].invoiceNumber = invoiceNumber;
        }
      }

      db.save();
      db.addAuditLog('Admin', 'super_admin', 'CONVERT_QUOTATION_TO_INVOICE', 'CorporateInvoice', invoiceNumber, `Converted quotation ${quo.quotationNumber} to invoice ${invoiceNumber}`);

      res.json({ success: true, invoice, quotation: state.corporateQuotations[quoIdx] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/corporate-invoices', (req, res) => {
    const state = db.getState();
    res.json({ success: true, invoices: state.corporateInvoices || [] });
  });

  app.post('/api/corporate-invoices', (req, res) => {
    try {
      const state = db.getState();
      const payload = req.body;
      const invoiceNumber = db.generateNextCorporateInvoiceId();

      const newInv = {
        id: `corp-inv-${Date.now()}`,
        invoiceNumber,
        quotationId: payload.quotationId || '',
        quotationNumber: payload.quotationNumber || '',
        requestId: payload.requestId || '',
        organizationName: payload.organizationName,
        contactPerson: payload.contactPerson,
        email: payload.email,
        phone: payload.phone,
        trainingTitle: payload.trainingTitle,
        items: payload.items || [],
        subtotal: Number(payload.subtotal) || 0,
        taxAmount: Number(payload.taxAmount) || 0,
        netAmount: Number(payload.netAmount) || 0,
        amountPaid: Number(payload.amountPaid) || 0,
        balance: (Number(payload.netAmount) || 0) - (Number(payload.amountPaid) || 0),
        currency: payload.currency || 'GHS',
        paymentStatus: (payload.paymentStatus || 'UNPAID') as any,
        dueDate: payload.dueDate || '2026-10-15',
        issuedAt: new Date().toISOString(),
        paymentInstructions: 'Bank Transfer to AITI Corporate Account. Ref: ' + invoiceNumber,
        createdAt: new Date().toISOString()
      };

      if (!state.corporateInvoices) state.corporateInvoices = [];
      state.corporateInvoices.unshift(newInv);
      db.save();

      res.json({ success: true, invoice: newInv });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/corporate-invoices/:id/record-payment', (req, res) => {
    try {
      const { id } = req.params;
      const { amount, paymentMethod, reference } = req.body;
      const state = db.getState();
      const idx = (state.corporateInvoices || []).findIndex(i => i.id === id || i.invoiceNumber === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Invoice not found' });

      const inv = state.corporateInvoices[idx];
      const paid = (inv.amountPaid || 0) + Number(amount);
      const balance = Math.max(0, inv.netAmount - paid);
      const paymentStatus = balance === 0 ? 'PAID' : (paid > 0 ? 'PARTIAL' : 'UNPAID');

      state.corporateInvoices[idx].amountPaid = paid;
      state.corporateInvoices[idx].balance = balance;
      state.corporateInvoices[idx].paymentStatus = paymentStatus;
      state.corporateInvoices[idx].paidAt = new Date().toISOString();
      state.corporateInvoices[idx].paymentReference = reference || `PAY-CORP-${Date.now()}`;

      // Update related request status if fully paid
      if (inv.requestId && paymentStatus === 'PAID') {
        const reqIdx = (state.corporateRequests || []).findIndex(r => r.id === inv.requestId || r.requestNumber === inv.requestId);
        if (reqIdx >= 0) {
          state.corporateRequests[reqIdx].status = 'PAID';
        }
      }

      db.save();
      db.addAuditLog('Admin', 'accountant', 'RECORD_CORPORATE_PAYMENT', 'CorporateInvoice', inv.invoiceNumber, `Recorded payment of GHS ${amount} for ${inv.organizationName}`);

      res.json({ success: true, invoice: state.corporateInvoices[idx] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // Short-Term Course Registration & Lightweight Portal
  // ==========================================
  app.get('/api/short-course-enrollments', (req, res) => {
    const state = db.getState();
    res.json({ success: true, enrollments: state.shortCourseEnrollments || [] });
  });

  // Simplified 6-step registration endpoint
  app.post(['/api/public/short-courses/register', '/api/public/short-course-enrollments'], (req, res) => {
    try {
      const state = db.getState();
      const payload = req.body;
      const registrationId = db.generateNextShortCourseRegistrationId();

      const courseObj = (state.shortCourses || []).find(c => c.id === payload.courseId || c.title === payload.courseTitle);

      const fee = Number(payload.fee || payload.feeGHS || courseObj?.feeGHS || 1200);

      const newEnrollment = {
        id: `stc-enr-${Date.now()}`,
        registrationId,
        enrollmentNumber: registrationId,
        shortCourseId: payload.shortCourseId || payload.courseId || courseObj?.id || 'short-course-default',
        courseId: payload.courseId || courseObj?.id || 'short-course-default',
        courseTitle: payload.courseTitle || courseObj?.title || 'Applied Tech Short Course',
        fullName: payload.fullName || payload.name,
        phone: payload.phone,
        whatsapp: payload.whatsapp || payload.phone,
        email: payload.email,
        preferredSchedule: payload.preferredSchedule || payload.schedule || 'Weekend Intensive (Sat & Sun: 9:00 AM - 3:00 PM)',
        trainingMode: payload.trainingMode || 'Physical (In-Person)',
        paymentMethod: payload.paymentMethod || 'Mobile Money (MTN / Telecel / AT)',
        paymentStatus: (payload.paymentStatus || 'confirmed') as any,
        paymentReference: payload.paymentReference || `MM-STC-${Date.now().toString().slice(-6)}`,
        fee,
        feeGHS: fee,
        duration: courseObj?.duration || '2-4 Weeks',
        status: 'active' as const,
        certificateIssued: false,
        attendancePercentage: 100,
        materials: [
          {
            id: 'mat-1',
            title: `${payload.courseTitle || 'Course'} - Official Course Syllabus & Module Pack`,
            type: 'pdf',
            size: '3.8 MB',
            downloadUrl: '#',
            uploadedAt: '2026-09-01'
          },
          {
            id: 'mat-2',
            title: 'Hands-on Practical Lab Exercises & Source Files',
            type: 'zip',
            size: '18.4 MB',
            downloadUrl: '#',
            uploadedAt: '2026-09-03'
          },
          {
            id: 'mat-3',
            title: 'Masterclass Reference Cheat-sheet & Tooling Guide',
            type: 'pdf',
            size: '1.2 MB',
            downloadUrl: '#',
            uploadedAt: '2026-09-05'
          }
        ],
        assignments: [
          {
            id: 'asg-1',
            title: 'Module 1 Capstone Project: Applied Real-world Implementation',
            description: 'Implement the core practical exercise assigned in class and upload your repository link or zip archive.',
            dueDate: '2026-09-20',
            status: 'pending',
            maxScore: 100,
            submitted: false,
            graded: false
          }
        ],
        announcements: [
          {
            id: 'ann-1',
            title: 'Welcome to your AITI Short Course Cohort!',
            content: 'We are pleased to have you on board. Please access your materials and prepare your development environment before session 1.',
            date: new Date().toISOString().split('T')[0]
          },
          {
            id: 'ann-2',
            title: 'Lab Access & Online Resources Live',
            content: 'The campus lab stations and cloud sandbox environments have been provisioned for all registered participants.',
            date: new Date().toISOString().split('T')[0]
          }
        ],
        createdAt: new Date().toISOString(),
        enrolledAt: new Date().toISOString()
      };

      if (!state.shortCourseEnrollments) state.shortCourseEnrollments = [];
      state.shortCourseEnrollments.unshift(newEnrollment);

      // Increment enrollment count in course
      if (courseObj) {
        courseObj.enrolledCount = (courseObj.enrolledCount || 0) + 1;
      }

      // Add to CRM Leads
      const lead = {
        id: `lead-${Date.now()}`,
        fullName: newEnrollment.fullName,
        email: newEnrollment.email,
        phone: newEnrollment.phone,
        whatsapp: newEnrollment.whatsapp,
        programInterest: `Short Course: ${newEnrollment.courseTitle}`,
        source: 'short_course_registration' as const,
        status: 'applied' as const,
        notes: `Registered for ${newEnrollment.courseTitle} (${registrationId}) - Mode: ${newEnrollment.trainingMode}, Schedule: ${newEnrollment.preferredSchedule}`,
        createdAt: new Date().toISOString()
      };
      if (!state.leads) state.leads = [];
      state.leads.unshift(lead);

      db.save();
      db.addAuditLog(
        newEnrollment.fullName,
        'student',
        'SHORT_COURSE_REGISTERED',
        'ShortCourseEnrollment',
        registrationId,
        `Registered for short course ${newEnrollment.courseTitle} with ID ${registrationId}`
      );

      res.json({
        success: true,
        registrationId,
        enrollmentNumber: registrationId,
        enrollment: newEnrollment,
        message: 'Congratulations! Your Short Course registration is confirmed.'
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Portal Login for Short Course participants
  app.post('/api/short-courses/portal-login', (req, res) => {
    try {
      const { identifier } = req.body;
      if (!identifier) return res.status(400).json({ success: false, message: 'Please provide your Registration ID or Email.' });

      const state = db.getState();
      const q = String(identifier).trim().toLowerCase();

      const enr = (state.shortCourseEnrollments || []).find(e => 
        e.registrationId.toLowerCase() === q ||
        e.enrollmentNumber?.toLowerCase() === q ||
        e.email.toLowerCase() === q ||
        e.phone.toLowerCase() === q
      );

      if (!enr) {
        return res.status(404).json({ success: false, message: 'No short course registration found for this ID or Email. Please check and try again.' });
      }

      res.json({ success: true, enrollment: enr });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Get single short course student data
  app.get('/api/short-courses/student/:registrationId', (req, res) => {
    try {
      const { registrationId } = req.params;
      const state = db.getState();
      const q = String(registrationId).trim().toLowerCase();

      const enr = (state.shortCourseEnrollments || []).find(e => 
        e.registrationId.toLowerCase() === q ||
        e.enrollmentNumber?.toLowerCase() === q ||
        e.id === registrationId
      );

      if (!enr) {
        return res.status(404).json({ success: false, message: 'Student enrollment not found' });
      }

      res.json({ success: true, enrollment: enr });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Submit assignment item
  app.post('/api/short-courses/student/:registrationId/submit-assignment', (req, res) => {
    try {
      const { registrationId } = req.params;
      const { assignmentId, submissionUrl, submissionNotes } = req.body;
      const state = db.getState();
      const q = String(registrationId).trim().toLowerCase();

      const idx = (state.shortCourseEnrollments || []).findIndex(e => 
        e.registrationId.toLowerCase() === q ||
        e.enrollmentNumber?.toLowerCase() === q ||
        e.id === registrationId
      );

      if (idx === -1) return res.status(404).json({ success: false, message: 'Enrollment not found' });

      const enr = state.shortCourseEnrollments[idx];
      const assignments = enr.assignments || [];
      const asgIdx = assignments.findIndex(a => a.id === assignmentId);

      if (asgIdx >= 0) {
        assignments[asgIdx].status = 'submitted';
        assignments[asgIdx].submittedAt = new Date().toISOString();
        assignments[asgIdx].submissionUrl = submissionUrl;
        assignments[asgIdx].submissionNotes = submissionNotes;
      }

      state.shortCourseEnrollments[idx].assignments = assignments;
      db.save();

      res.json({ success: true, message: 'Assignment submitted successfully!', enrollment: state.shortCourseEnrollments[idx] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Issue Certificate for Short Course student
  app.post('/api/short-courses/student/:registrationId/issue-certificate', (req, res) => {
    try {
      const { registrationId } = req.params;
      const state = db.getState();
      const q = String(registrationId).trim().toLowerCase();

      const idx = (state.shortCourseEnrollments || []).findIndex(e => 
        e.registrationId.toLowerCase() === q ||
        e.enrollmentNumber?.toLowerCase() === q ||
        e.id === registrationId
      );

      if (idx === -1) return res.status(404).json({ success: false, message: 'Enrollment not found' });

      const enr = state.shortCourseEnrollments[idx];
      const certNum = enr.certificateNumber || db.generateNextShortCourseCertificateNumber();
      const certDate = new Date().toISOString().split('T')[0];

      state.shortCourseEnrollments[idx].certificateIssued = true;
      state.shortCourseEnrollments[idx].certificateNumber = certNum;
      state.shortCourseEnrollments[idx].certificateDate = certDate;

      // Add to global certificates for verification
      const globalCert = {
        id: `cert-stc-${Date.now()}`,
        certificateNumber: certNum,
        studentName: enr.fullName,
        studentNumber: enr.registrationId,
        programTitle: enr.courseTitle,
        programType: 'short_course' as const,
        duration: enr.duration || '2-4 Weeks Practical Course',
        completionDate: certDate,
        gradeAchieved: 'DISTINCTION',
        status: 'issued' as const,
        issuedAt: new Date().toISOString(),
        pdfUrl: `/certificates/${certNum.replace(/\//g, '-')}.pdf`
      };

      const existingIdx = (state.certificates || []).findIndex(c => c.certificateNumber === certNum);
      if (existingIdx >= 0) {
        state.certificates[existingIdx] = globalCert as any;
      } else {
        state.certificates.push(globalCert as any);
      }

      db.save();
      db.addAuditLog('Admin', 'super_admin', 'ISSUE_SHORT_COURSE_CERTIFICATE', 'Certificate', certNum, `Issued certificate ${certNum} to ${enr.fullName}`);

      res.json({
        success: true,
        message: 'AITI Certificate of Completion successfully issued and verified!',
        certificateNumber: certNum,
        enrollment: state.shortCourseEnrollments[idx]
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 15. Audit Logs & Reports
  app.get('/api/audit-logs', async (req, res) => {
    if (isPostgresConfigured) {
      const auditLogs = await queryDatabase('SELECT id, user_id AS "userId", user_name AS "userName", user_role AS "userRole", action, entity_type AS "entityType", entity_id AS "entityId", details, timestamp FROM audit_logs ORDER BY timestamp DESC');
      return res.json({ success: true, auditLogs });
    }
    const state = db.getState();
    res.json({ success: true, auditLogs: state.auditLogs });
  });

  app.get('/api/reports/summary', async (req, res) => {
    try {
      if (isPostgresConfigured) {
        const [applicants, admitted, students, payments, outstanding] = await Promise.all([
          queryDatabase<{ count: string }>('SELECT COUNT(*)::text AS count FROM applications'),
          queryDatabase<{ count: string }>('SELECT COUNT(*)::text AS count FROM admissions'),
          queryDatabase<{ active: string; graduated: string }>(`SELECT COUNT(*) FILTER (WHERE data->>'status' = 'active')::text AS active, COUNT(*) FILTER (WHERE data->>'status' = 'graduated')::text AS graduated FROM students`),
          queryDatabase<{ total: string }>(`SELECT COALESCE(SUM((data->>'amount')::numeric), 0)::text AS total FROM payment_transactions WHERE data->>'status' = 'success'`),
          queryDatabase<{ total: string }>(`SELECT COALESCE(SUM((data->>'outstandingBalance')::numeric), 0)::text AS total FROM students`)
        ]);
        return res.json({ success: true, summary: { totalApplicants: Number(applicants[0]?.count || 0), totalAdmitted: Number(admitted[0]?.count || 0), activeStudents: Number(students[0]?.active || 0), graduatedStudents: Number(students[0]?.graduated || 0), totalRevenue: Number(payments[0]?.total || 0), totalOutstanding: Number(outstanding[0]?.total || 0), avgAttendance: 0, certificateApplications: 0, diplomaApplications: 0 } });
      }
      const state = db.getState();
      const totalApplicants = state.applications.length;
      const totalAdmitted = state.admissions.length;
      const activeStudents = state.students.filter(s => s.status === 'active').length;
      const graduatedStudents = state.students.filter(s => s.status === 'graduated').length + state.certificates.length;
      const totalRevenue = state.payments.filter(p => p.status === 'success').reduce((a, b) => a + b.amount, 0);
      const totalOutstanding = state.students.reduce((a, b) => a + b.outstandingBalance, 0);
      const avgAttendance = state.students.length ? Math.round(state.students.reduce((a, b) => a + b.attendancePercentage, 0) / state.students.length) : 100;

      // Program breakdown
      const certApps = state.applications.filter(a => a.programType === 'certificate').length;
      const dipApps = state.applications.filter(a => a.programType === 'diploma').length;

      res.json({
        success: true,
        summary: {
          totalApplicants,
          totalAdmitted,
          activeStudents,
          graduatedStudents,
          totalRevenue,
          totalOutstanding,
          avgAttendance,
          certApps,
          dipApps,
          totalClasses: state.classes.length,
          totalCourses: state.courses.length,
          totalLeads: state.leads.length
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 15. Server-side Gemini AI Endpoints
  app.post('/api/ai/visitor-chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ success: false, error: 'Message is required' });
      }
      const reply = await askVisitorAdmissionAi(message, history || []);
      res.json({ success: true, reply });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/ai/admin-chat', async (req, res) => {
    try {
      const { query, role } = req.body;
      if (!query) {
        return res.status(400).json({ success: false, error: 'Query is required' });
      }
      const reply = await askAdminAi(query, role || 'admin');
      res.json({ success: true, reply });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 16. Database Export (Supabase / PostgreSQL migration DDL generator)
  app.get('/api/db/export-sql', (req, res) => {
    const sql = db.generateSupabaseSql();
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename="aiti_supabase_schema.sql"');
    res.send(sql);
  });

  // ==========================================
  // Vite Middleware & Static Serving
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`AITI (AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE)`);
    console.log(`BEYOND TECH — Empowering You Through ICT`);
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log(`====================================================`);
  });
}

startServer();
