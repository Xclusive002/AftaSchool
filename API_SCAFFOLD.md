# Native Vercel API Scaffold

`api/[...path].js` is the single native Vercel function for every `/api/*` request. This catch-all keeps the deployment within Vercel Hobby's 12-function limit while preserving the route surface below. It currently uses plain Node request/response APIs and returns `501 Not Implemented`; route logic is intentionally not migrated yet.

## Endpoint inventory

- `GET|PUT /api/settings`
- `GET /api/public/programs`
- `GET /api/public/courses`
- `GET /api/public/faqs`
- `GET /api/public/testimonials`
- `GET /api/public/news-events`
- `GET /api/public/gallery`
- `GET /api/public/announcements`
- `GET /api/lms/courses`
- `GET /api/lms/enrollments/[studentId]`
- `GET|POST /api/lms/messages`
- `POST /api/public/quote-requests`
- `GET /api/admin/quote-requests`
- `GET|PUT /api/admin/quote-requests/[id]`
- `POST /api/admin/quote-requests/[id]/send-quote`
- `POST /api/admin/quote-requests/[id]/convert-application`
- `POST /api/admin/quote-requests/[id]/generate-invoice`
- `GET|POST /api/admin/price-history`
- `GET /api/applications`
- `POST /api/applications`
- `PUT /api/applications/[id]`
- `POST /api/applications/[id]/pay-fee`
- `GET /api/admissions`
- `POST /api/admissions/offer`
- `POST /api/admissions/enroll`
- `GET /api/students`
- `PUT /api/students/[id]`
- `POST /api/admin/authenticate`
- `GET|POST /api/admin/users`
- `PUT /api/admin/users/[id]`
- `GET|POST /api/classes`
- `GET|POST /api/timetables`
- `GET /api/attendance`
- `POST /api/attendance/mark`
- `GET|POST /api/assignments`
- `POST /api/assignments/[id]/submit`
- `POST /api/assignments/submissions/[subId]/grade`
- `GET|POST /api/results`
- `GET /api/payments`
- `GET /api/payments/verify/[reference]`
- `POST /api/payments/pay-invoice`
- `POST /api/webhooks/paystack`
- `GET /api/invoices`
- `GET /api/certificates`
- `POST /api/certificates/issue`
- `GET /api/verify`
- `GET|POST /api/crm/leads`
- `PUT /api/crm/leads/[id]`
- `GET|POST /api/contacts`
- `GET /api/public/short-course-categories`
- `GET /api/short-course-categories`
- `POST /api/short-course-categories`
- `PUT|DELETE /api/short-course-categories/[id]`
- `GET /api/public/short-courses`
- `GET /api/public/short-courses/[id]`
- `GET|POST /api/short-courses`
- `PUT|DELETE /api/short-courses/[id]`
- `GET /api/corporate-requests`
- `POST /api/public/corporate-requests`
- `PUT /api/corporate-requests/[id]`
- `POST /api/corporate-requests/[id]/participants`
- `POST /api/corporate-requests/[id]/generate-certificates`
- `GET|POST /api/corporate-quotations`
- `PUT /api/corporate-quotations/[id]`
- `POST /api/corporate-quotations/[id]/convert-to-invoice`
- `GET|POST /api/corporate-invoices`
- `POST /api/corporate-invoices/[id]/record-payment`
- `GET /api/short-course-enrollments`
- `POST /api/short-course-enrollments`
- `POST /api/public/short-courses/register`
- `POST /api/public/short-course-enrollments`
- `POST /api/short-courses/portal-login`
- `GET /api/short-courses/student/[registrationId]`
- `POST /api/short-courses/student/[registrationId]/submit-assignment`
- `POST /api/short-courses/student/[registrationId]/issue-certificate`
- `GET /api/audit-logs`
- `GET /api/reports/summary`
- `POST /api/ai/visitor-chat`
- `POST /api/ai/admin-chat`
- `GET /api/db/export-sql`

## Shared handler

`serverless/handler.ts` contains the plain Node response helper, JSON body reader, and scaffold placeholder. Route implementations can be migrated one function at a time without reintroducing Express.

## Database setup

Serverless routes should import `query` from `lib/db.js`. Set `DATABASE_URL` in Vercel to the Supabase pooled connection string using port `6543` (PgBouncer), not the direct port `5432` connection. The pool is cached on `globalThis` and capped at five connections per warm function process.

The deployed application requires `DATABASE_URL` and does not use the old local JSON store. Initialize the schema and seed data once, manually, with:

```sh
node scripts/init-db.js
```

Set `ADMIN_EMAIL`, `ADMIN_FULL_NAME`, and optionally `ADMIN_USER_ID` before running the setup script.
