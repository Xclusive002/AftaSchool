import fs from 'fs';
import path from 'path';
import {
  InstituteSettings, Program, Course, Application, AdmissionRecord,
  Student, AcademicClass, TimetableEntry, AttendanceRecord,
  Assignment, AssignmentSubmission, AssessmentResult, Invoice,
  PaymentTransaction, Certificate, Announcement, NewsEventItem,
  GalleryItem, CRMLead, ContactMessage, AuditLog, Testimonial, FaqItem, UserProfile,
  ShortCourseCategory, ShortCourse, CorporateTrainingRequest, ShortCourseEnrollment,
  CorporateQuotation, CorporateInvoice
} from '../src/types';
import {
  initialSettings, initialPrograms, initialCourses, initialUsers,
  initialClasses, initialStudents, initialApplications, initialAdmissions,
  initialTimetable, initialAttendance, initialAssignments, initialSubmissions,
  initialResults, initialInvoices, initialPayments, initialCertificates,
  initialAnnouncements, initialNewsEvents, initialGallery, initialLeads,
  initialContacts, initialAuditLogs, initialTestimonials, initialFaqs,
  initialShortCourseCategories, initialShortCourses, initialCorporateRequests, initialShortCourseEnrollments,
  initialCorporateQuotations, initialCorporateInvoices
} from './initialData';

export interface DatabaseState {
  settings: InstituteSettings;
  programs: Program[];
  courses: Course[];
  shortCourseCategories: ShortCourseCategory[];
  shortCourses: ShortCourse[];
  corporateRequests: CorporateTrainingRequest[];
  corporateQuotations: CorporateQuotation[];
  corporateInvoices: CorporateInvoice[];
  shortCourseEnrollments: ShortCourseEnrollment[];
  users: UserProfile[];
  classes: AcademicClass[];
  students: Student[];
  applications: Application[];
  admissions: AdmissionRecord[];
  timetable: TimetableEntry[];
  attendance: AttendanceRecord[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  results: AssessmentResult[];
  invoices: Invoice[];
  payments: PaymentTransaction[];
  certificates: Certificate[];
  announcements: Announcement[];
  newsEvents: NewsEventItem[];
  gallery: GalleryItem[];
  leads: CRMLead[];
  contacts: ContactMessage[];
  auditLogs: AuditLog[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

class DatabaseService {
  private state: DatabaseState;

  constructor() {
    this.state = this.loadInitialData();
  }

  private loadInitialData(): DatabaseState {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);

        // Merge short courses to ensure master professional courses are always loaded
        const mergedShortCourses = [...initialShortCourses];
        if (Array.isArray(parsed.shortCourses)) {
          parsed.shortCourses.forEach((existing: ShortCourse) => {
            const idx = mergedShortCourses.findIndex(c => c.id === existing.id);
            if (idx >= 0) {
              mergedShortCourses[idx] = { ...mergedShortCourses[idx], ...existing };
            } else {
              mergedShortCourses.push(existing);
            }
          });
        }

        return {
          settings: parsed.settings || initialSettings,
          programs: parsed.programs || initialPrograms,
          courses: parsed.courses || initialCourses,
          shortCourseCategories: parsed.shortCourseCategories?.length ? parsed.shortCourseCategories : initialShortCourseCategories,
          shortCourses: mergedShortCourses,
          corporateRequests: parsed.corporateRequests || initialCorporateRequests,
          corporateQuotations: parsed.corporateQuotations || initialCorporateQuotations,
          corporateInvoices: parsed.corporateInvoices || initialCorporateInvoices,
          shortCourseEnrollments: parsed.shortCourseEnrollments || initialShortCourseEnrollments,
          users: parsed.users || initialUsers,
          classes: parsed.classes || initialClasses,
          students: parsed.students || initialStudents,
          applications: parsed.applications || initialApplications,
          admissions: parsed.admissions || initialAdmissions,
          timetable: parsed.timetable || initialTimetable,
          attendance: parsed.attendance || initialAttendance,
          assignments: parsed.assignments || initialAssignments,
          submissions: parsed.submissions || initialSubmissions,
          results: parsed.results || initialResults,
          invoices: parsed.invoices || initialInvoices,
          payments: parsed.payments || initialPayments,
          certificates: parsed.certificates || initialCertificates,
          announcements: parsed.announcements || initialAnnouncements,
          newsEvents: parsed.newsEvents || initialNewsEvents,
          gallery: parsed.gallery || initialGallery,
          leads: parsed.leads || initialLeads,
          contacts: parsed.contacts || initialContacts,
          auditLogs: parsed.auditLogs || initialAuditLogs,
          testimonials: parsed.testimonials || initialTestimonials,
          faqs: parsed.faqs || initialFaqs,
        };
      }
    } catch (err) {
      console.error('Error loading database store, defaulting to seed data:', err);
    }

    const defaultState: DatabaseState = {
      settings: initialSettings,
      programs: initialPrograms,
      courses: initialCourses,
      shortCourseCategories: initialShortCourseCategories,
      shortCourses: initialShortCourses,
      corporateRequests: initialCorporateRequests,
      corporateQuotations: initialCorporateQuotations,
      corporateInvoices: initialCorporateInvoices,
      shortCourseEnrollments: initialShortCourseEnrollments,
      users: initialUsers,
      classes: initialClasses,
      students: initialStudents,
      applications: initialApplications,
      admissions: initialAdmissions,
      timetable: initialTimetable,
      attendance: initialAttendance,
      assignments: initialAssignments,
      submissions: initialSubmissions,
      results: initialResults,
      invoices: initialInvoices,
      payments: initialPayments,
      certificates: initialCertificates,
      announcements: initialAnnouncements,
      newsEvents: initialNewsEvents,
      gallery: initialGallery,
      leads: initialLeads,
      contacts: initialContacts,
      auditLogs: initialAuditLogs,
      testimonials: initialTestimonials,
      faqs: initialFaqs,
    };

    this.persist(defaultState);
    return defaultState;
  }

  private persist(state: DatabaseState) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database state:', err);
    }
  }

  public save() {
    this.persist(this.state);
  }

  public getState(): DatabaseState {
    return this.state;
  }

  public resetToDemo(): DatabaseState {
    this.state = {
      settings: initialSettings,
      programs: initialPrograms,
      courses: initialCourses,
      shortCourseCategories: initialShortCourseCategories,
      shortCourses: initialShortCourses,
      corporateRequests: initialCorporateRequests,
      corporateQuotations: initialCorporateQuotations,
      corporateInvoices: initialCorporateInvoices,
      shortCourseEnrollments: initialShortCourseEnrollments,
      users: initialUsers,
      classes: initialClasses,
      students: initialStudents,
      applications: initialApplications,
      admissions: initialAdmissions,
      timetable: initialTimetable,
      attendance: initialAttendance,
      assignments: initialAssignments,
      submissions: initialSubmissions,
      results: initialResults,
      invoices: initialInvoices,
      payments: initialPayments,
      certificates: initialCertificates,
      announcements: initialAnnouncements,
      newsEvents: initialNewsEvents,
      gallery: initialGallery,
      leads: initialLeads,
      contacts: initialContacts,
      auditLogs: initialAuditLogs,
      testimonials: initialTestimonials,
      faqs: initialFaqs,
    };
    this.save();
    return this.state;
  }

  public addAuditLog(userName: string, userRole: any, action: string, entityType: string, entityId: string, details: string) {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      userId: 'system',
      userName,
      userRole,
      action,
      entityType,
      entityId,
      details,
      timestamp: new Date().toISOString()
    };
    this.state.auditLogs.unshift(log);
    this.save();
    return log;
  }

  // Next ID Generators
  public generateNextApplicationId(): string {
    const prefix = this.state.settings.numbering.applicationPrefix || 'AITI/2026/';
    const count = this.state.applications.length + 1;
    return `${prefix}${count.toString().padStart(6, '0')}`;
  }

  public generateNextAdmissionNumber(): string {
    const prefix = this.state.settings.numbering.admissionPrefix || 'AITI/ADM/2026/';
    const count = this.state.admissions.length + 1;
    return `${prefix}${count.toString().padStart(6, '0')}`;
  }

  public generateNextStudentNumber(): string {
    const prefix = this.state.settings.numbering.studentPrefix || 'AITI/STU/2026/';
    const count = this.state.students.length + 1;
    return `${prefix}${count.toString().padStart(6, '0')}`;
  }

  public generateNextCertificateNumber(): string {
    const prefix = this.state.settings.numbering.certificatePrefix || 'AITI/CERT/2026/';
    const count = this.state.certificates.length + 1;
    return `${prefix}${count.toString().padStart(6, '0')}`;
  }

  public generateNextShortCourseCertificateNumber(): string {
    const count = (this.state.shortCourseEnrollments?.filter(e => e.certificateIssued)?.length || 0) + 25;
    return `AITI/CERT/STC/2026/${count.toString().padStart(5, '0')}`;
  }

  public generateNextInvoiceNumber(): string {
    const prefix = this.state.settings.numbering.invoicePrefix || 'AITI/INV/2026/';
    const count = this.state.invoices.length + 1;
    return `${prefix}${count.toString().padStart(6, '0')}`;
  }

  public generateNextReceiptNumber(): string {
    const prefix = this.state.settings.numbering.receiptPrefix || 'AITI/REC/2026/';
    const count = this.state.payments.length + 1;
    return `${prefix}${count.toString().padStart(6, '0')}`;
  }

  public generateNextCorporateRequestId(): string {
    const count = (this.state.corporateRequests?.length || 0) + 1;
    return `AITI/CORP/2026/${count.toString().padStart(4, '0')}`;
  }

  public generateNextCorporateQuotationId(): string {
    const count = (this.state.corporateQuotations?.length || 0) + 1;
    return `AITI/QUO/2026/${count.toString().padStart(5, '0')}`;
  }

  public generateNextCorporateInvoiceId(): string {
    const count = (this.state.corporateInvoices?.length || 0) + 1;
    return `AITI/INV/CORP/2026/${count.toString().padStart(5, '0')}`;
  }

  public generateNextShortCourseRegistrationId(): string {
    const count = (this.state.shortCourseEnrollments?.length || 0) + 25;
    return `AITI/STC/2026/${count.toString().padStart(5, '0')}`;
  }

  public generateNextShortCourseEnrollmentId(): string {
    return this.generateNextShortCourseRegistrationId();
  }

  // Generate complete PostgreSQL DDL and Supabase migration script
  public generateSupabaseSql(): string {
    return `-- =================================================================
-- AITI (AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE)
-- COMPLETE SUPABASE & POSTGRESQL PRODUCTION DATABASE SCHEMA
-- BEYOND TECH — Empowering You Through ICT
-- =================================================================

-- 1. Create Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Institute Settings Table
CREATE TABLE IF NOT EXISTS institute_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section VARCHAR(50) NOT NULL UNIQUE,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Programs Table
CREATE TABLE IF NOT EXISTS programs (
  id VARCHAR(50) PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('certificate', 'diploma')),
  duration VARCHAR(50) NOT NULL,
  description TEXT,
  suitable_for JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  tuition_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
  application_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
  schedule_options JSONB DEFAULT '[]'::jsonb,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR(50) PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  program_type VARCHAR(20) NOT NULL CHECK (program_type IN ('certificate', 'diploma', 'both')),
  duration_weeks INT NOT NULL DEFAULT 4,
  description TEXT,
  learning_outcomes JSONB DEFAULT '[]'::jsonb,
  instructor_id VARCHAR(50),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Applications Table
CREATE TABLE IF NOT EXISTS applications (
  id VARCHAR(50) PRIMARY KEY,
  application_id VARCHAR(50) NOT NULL UNIQUE,
  user_id UUID,
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(20) NOT NULL,
  nationality VARCHAR(100) DEFAULT 'Nigerian',
  state_of_origin VARCHAR(100),
  lga VARCHAR(100),
  residential_address TEXT NOT NULL,
  phone VARCHAR(30) NOT NULL,
  whatsapp VARCHAR(30),
  email VARCHAR(255) NOT NULL,
  passport_photo_url TEXT,
  highest_qualification VARCHAR(100),
  institution VARCHAR(255),
  graduation_year VARCHAR(10),
  course_studied VARCHAR(255),
  previous_ict_experience TEXT,
  current_occupation VARCHAR(100),
  program_id VARCHAR(50) REFERENCES programs(id),
  program_title VARCHAR(255) NOT NULL,
  program_type VARCHAR(20) NOT NULL,
  intake VARCHAR(50),
  study_mode VARCHAR(50),
  preferred_schedule VARCHAR(100),
  next_of_kin_name VARCHAR(255),
  next_of_kin_relationship VARCHAR(100),
  next_of_kin_phone VARCHAR(30),
  next_of_kin_email VARCHAR(255),
  next_of_kin_address TEXT,
  documents JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(50) DEFAULT 'submitted',
  payment_status VARCHAR(20) DEFAULT 'pending',
  payment_reference VARCHAR(100),
  payment_amount NUMERIC(12, 2) DEFAULT 5000,
  paid_at TIMESTAMP WITH TIME ZONE,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Admissions Table
CREATE TABLE IF NOT EXISTS admissions (
  id VARCHAR(50) PRIMARY KEY,
  admission_number VARCHAR(50) NOT NULL UNIQUE,
  application_id VARCHAR(50) REFERENCES applications(id),
  application_ref VARCHAR(50) NOT NULL,
  student_name VARCHAR(255) NOT NULL,
  student_email VARCHAR(255) NOT NULL,
  student_phone VARCHAR(30) NOT NULL,
  program_title VARCHAR(255) NOT NULL,
  program_type VARCHAR(20) NOT NULL,
  duration VARCHAR(50) NOT NULL,
  academic_session VARCHAR(30) NOT NULL,
  commencement_date DATE,
  orientation_date DATE,
  conditions JSONB DEFAULT '[]'::jsonb,
  tuition_fee NUMERIC(12, 2) NOT NULL,
  acceptance_fee NUMERIC(12, 2) DEFAULT 10000,
  status VARCHAR(30) DEFAULT 'offered',
  offered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  assigned_class_id VARCHAR(50),
  assigned_student_id VARCHAR(50),
  qr_verification_url TEXT
);

-- 7. Students Table
CREATE TABLE IF NOT EXISTS students (
  id VARCHAR(50) PRIMARY KEY,
  student_number VARCHAR(50) NOT NULL UNIQUE,
  admission_number VARCHAR(50) NOT NULL,
  user_id UUID,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(30) NOT NULL,
  whatsapp VARCHAR(30),
  date_of_birth DATE,
  gender VARCHAR(20),
  residential_address TEXT,
  passport_photo_url TEXT,
  program_title VARCHAR(255) NOT NULL,
  program_type VARCHAR(20) NOT NULL,
  academic_session VARCHAR(30) NOT NULL,
  class_id VARCHAR(50),
  class_name VARCHAR(255),
  enrollment_date DATE DEFAULT CURRENT_DATE,
  expected_graduation_date DATE,
  status VARCHAR(30) DEFAULT 'active',
  total_tuition NUMERIC(12, 2) DEFAULT 0,
  amount_paid NUMERIC(12, 2) DEFAULT 0,
  outstanding_balance NUMERIC(12, 2) DEFAULT 0,
  attendance_percentage NUMERIC(5, 2) DEFAULT 100.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Classes & Timetable
CREATE TABLE IF NOT EXISTS academic_classes (
  id VARCHAR(50) PRIMARY KEY,
  code VARCHAR(30) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  program_type VARCHAR(20) NOT NULL,
  program_id VARCHAR(50) REFERENCES programs(id),
  academic_session VARCHAR(30) NOT NULL,
  instructor_id VARCHAR(50),
  instructor_name VARCHAR(255),
  classroom_name VARCHAR(100),
  schedule_days JSONB DEFAULT '[]'::jsonb,
  schedule_time VARCHAR(50),
  total_students INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS timetables (
  id VARCHAR(50) PRIMARY KEY,
  class_id VARCHAR(50) REFERENCES academic_classes(id),
  course_code VARCHAR(30) NOT NULL,
  course_title VARCHAR(255) NOT NULL,
  instructor_name VARCHAR(255),
  room_name VARCHAR(100),
  day_of_week VARCHAR(20) NOT NULL,
  start_time VARCHAR(10) NOT NULL,
  end_time VARCHAR(10) NOT NULL
);

-- 9. Attendance, Assignments & Results
CREATE TABLE IF NOT EXISTS attendance_records (
  id VARCHAR(50) PRIMARY KEY,
  class_id VARCHAR(50) REFERENCES academic_classes(id),
  student_id VARCHAR(50) REFERENCES students(id),
  student_name VARCHAR(255),
  student_number VARCHAR(50),
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  recorded_by VARCHAR(255),
  remarks TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assignments (
  id VARCHAR(50) PRIMARY KEY,
  class_id VARCHAR(50) REFERENCES academic_classes(id),
  course_code VARCHAR(30) NOT NULL,
  course_title VARCHAR(255) NOT NULL,
  instructor_name VARCHAR(255),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  max_score INT DEFAULT 20,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessment_results (
  id VARCHAR(50) PRIMARY KEY,
  student_id VARCHAR(50) REFERENCES students(id),
  student_name VARCHAR(255),
  student_number VARCHAR(50),
  class_id VARCHAR(50),
  course_code VARCHAR(30) NOT NULL,
  course_title VARCHAR(255) NOT NULL,
  academic_session VARCHAR(30) NOT NULL,
  assignment_score NUMERIC(5, 2) DEFAULT 0,
  test_score NUMERIC(5, 2) DEFAULT 0,
  practical_score NUMERIC(5, 2) DEFAULT 0,
  exam_score NUMERIC(5, 2) DEFAULT 0,
  total_score NUMERIC(5, 2) DEFAULT 0,
  grade VARCHAR(5),
  status VARCHAR(20),
  remarks TEXT,
  published BOOLEAN DEFAULT TRUE,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Invoices, Payments & Receipts
CREATE TABLE IF NOT EXISTS invoices (
  id VARCHAR(50) PRIMARY KEY,
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  student_id VARCHAR(50) REFERENCES students(id),
  student_name VARCHAR(255) NOT NULL,
  student_number VARCHAR(50),
  title VARCHAR(255) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  amount_paid NUMERIC(12, 2) DEFAULT 0,
  balance NUMERIC(12, 2) NOT NULL,
  due_date DATE,
  status VARCHAR(30) DEFAULT 'unpaid',
  items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_transactions (
  id VARCHAR(50) PRIMARY KEY,
  receipt_number VARCHAR(50) NOT NULL UNIQUE,
  invoice_id VARCHAR(50),
  student_id VARCHAR(50),
  student_name VARCHAR(255) NOT NULL,
  payment_type VARCHAR(50) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  gateway VARCHAR(50) NOT NULL,
  gateway_reference VARCHAR(100),
  status VARCHAR(30) DEFAULT 'success',
  channel VARCHAR(100),
  paid_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_by VARCHAR(255)
);

-- 11. Certificates & Verification
CREATE TABLE IF NOT EXISTS certificates (
  id VARCHAR(50) PRIMARY KEY,
  certificate_number VARCHAR(50) NOT NULL UNIQUE,
  student_id VARCHAR(50) REFERENCES students(id),
  student_name VARCHAR(255) NOT NULL,
  student_number VARCHAR(50) NOT NULL,
  program_title VARCHAR(255) NOT NULL,
  program_type VARCHAR(20) NOT NULL,
  duration VARCHAR(50) NOT NULL,
  specialization_area VARCHAR(255),
  completion_date DATE NOT NULL,
  grade_achieved VARCHAR(50),
  signatory_name VARCHAR(255),
  signatory_title VARCHAR(255),
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(30) DEFAULT 'issued',
  qr_verification_url TEXT
);

-- 12. CRM Leads & Contact Inquiries
CREATE TABLE IF NOT EXISTS crm_leads (
  id VARCHAR(50) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(30) NOT NULL,
  whatsapp VARCHAR(30),
  program_interest VARCHAR(255),
  source VARCHAR(50) DEFAULT 'website',
  status VARCHAR(50) DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id VARCHAR(50) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(30),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(30) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50),
  user_name VARCHAR(255),
  user_role VARCHAR(50),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id VARCHAR(100),
  details TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================================================================
-- RLS (ROW LEVEL SECURITY) POLICIES
-- =================================================================
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;

-- Anonymous public can read general programs, courses, news & verify codes
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active programs" ON programs FOR SELECT USING (active = true);
CREATE POLICY "Public can view active courses" ON courses FOR SELECT USING (active = true);

-- End of Supabase Schema Script
`;
  }
}

export const db = new DatabaseService();
