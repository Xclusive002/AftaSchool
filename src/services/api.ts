import { 
  InstituteSettings, Program, Course, Application, AdmissionRecord, 
  Student, AcademicClass, TimetableEntry, AttendanceRecord, Assignment, 
  AssignmentSubmission, AssessmentResult, Invoice, PaymentTransaction, 
  Certificate, Announcement, NewsEventItem, GalleryItem, CRMLead, 
  ContactMessage, AuditLog, Testimonial, FaqItem 
} from '../types';

export const api = {
  // Settings
  async getSettings(): Promise<InstituteSettings> {
    const res = await fetch('/api/settings');
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch settings');
    return data.settings;
  },

  async updateSettings(settings: Partial<InstituteSettings>, adminName?: string): Promise<InstituteSettings> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...settings, adminName })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to update settings');
    return data.settings;
  },

  // Public Data
  async getPrograms(): Promise<Program[]> {
    const res = await fetch('/api/public/programs');
    const data = await res.json();
    return data.programs || [];
  },

  async getCourses(): Promise<Course[]> {
    const res = await fetch('/api/public/courses');
    const data = await res.json();
    return data.courses || [];
  },

  async getFaqs(): Promise<FaqItem[]> {
    const res = await fetch('/api/public/faqs');
    const data = await res.json();
    return data.faqs || [];
  },

  async getTestimonials(): Promise<Testimonial[]> {
    const res = await fetch('/api/public/testimonials');
    const data = await res.json();
    return data.testimonials || [];
  },

  async getNewsEvents(): Promise<NewsEventItem[]> {
    const res = await fetch('/api/public/news-events');
    const data = await res.json();
    return data.newsEvents || [];
  },

  async getGallery(): Promise<GalleryItem[]> {
    const res = await fetch('/api/public/gallery');
    const data = await res.json();
    return data.gallery || [];
  },

  async getAnnouncements(): Promise<Announcement[]> {
    const res = await fetch('/api/public/announcements');
    const data = await res.json();
    return data.announcements || [];
  },

  // Applications
  async getApplications(filter?: { email?: string; applicationId?: string }): Promise<Application[]> {
    const params = new URLSearchParams();
    if (filter?.email) params.append('email', filter.email);
    if (filter?.applicationId) params.append('applicationId', filter.applicationId);
    const res = await fetch(`/api/applications?${params.toString()}`);
    const data = await res.json();
    return data.applications || [];
  },

  async submitApplication(payload: Partial<Application>): Promise<{ application: Application; message: string }> {
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to submit application');
    return data;
  },

  async updateApplication(id: string, updates: Partial<Application>, adminName?: string): Promise<Application> {
    const res = await fetch(`/api/applications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...updates, adminName })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to update application');
    return data.application;
  },

  async payApplicationFee(id: string, gateway: string, gatewayReference?: string): Promise<{ application: Application; receipt: PaymentTransaction }> {
    const res = await fetch(`/api/applications/${id}/pay-fee`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gateway, gatewayReference })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to pay application fee');
    return data;
  },

  // Admissions
  async getAdmissions(): Promise<AdmissionRecord[]> {
    const res = await fetch('/api/admissions');
    const data = await res.json();
    return data.admissions || [];
  },

  async offerAdmission(payload: { applicationId: string; programTitle?: string; programType?: string; commencementDate?: string; orientationDate?: string; conditions?: string[]; adminName?: string }): Promise<AdmissionRecord> {
    const res = await fetch('/api/admissions/offer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to offer admission');
    return data.admission;
  },

  async enrollStudent(admissionId: string, classId?: string, adminName?: string): Promise<{ student: Student; admission: AdmissionRecord; invoice: Invoice }> {
    const res = await fetch('/api/admissions/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ admissionId, classId, adminName })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to enroll student');
    return data;
  },

  // Students
  async getStudents(): Promise<Student[]> {
    const res = await fetch('/api/students');
    const data = await res.json();
    return data.students || [];
  },

  async updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
    const res = await fetch(`/api/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to update student');
    return data.student;
  },

  // Classes & Timetable
  async getClasses(): Promise<AcademicClass[]> {
    const res = await fetch('/api/classes');
    const data = await res.json();
    return data.classes || [];
  },

  async createClass(payload: Partial<AcademicClass>): Promise<AcademicClass> {
    const res = await fetch('/api/classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to create class');
    return data.class;
  },

  async getTimetables(): Promise<TimetableEntry[]> {
    const res = await fetch('/api/timetables');
    const data = await res.json();
    return data.timetables || [];
  },

  async createTimetableEntry(payload: Partial<TimetableEntry>): Promise<TimetableEntry> {
    const res = await fetch('/api/timetables', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to create timetable entry');
    return data.entry;
  },

  // Attendance
  async getAttendance(query?: { classId?: string; studentId?: string; date?: string }): Promise<AttendanceRecord[]> {
    const params = new URLSearchParams();
    if (query?.classId) params.append('classId', query.classId);
    if (query?.studentId) params.append('studentId', query.studentId);
    if (query?.date) params.append('date', query.date);
    const res = await fetch(`/api/attendance?${params.toString()}`);
    const data = await res.json();
    return data.attendance || [];
  },

  async markAttendance(payload: { classId: string; records: { studentId: string; studentName: string; studentNumber: string; status: string; remarks?: string }[]; date?: string; recordedBy?: string }): Promise<boolean> {
    const res = await fetch('/api/attendance/mark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to mark attendance');
    return true;
  },

  // Assignments
  async getAssignments(): Promise<{ assignments: Assignment[]; submissions: AssignmentSubmission[] }> {
    const res = await fetch('/api/assignments');
    const data = await res.json();
    return { assignments: data.assignments || [], submissions: data.submissions || [] };
  },

  async createAssignment(payload: Partial<Assignment>): Promise<Assignment> {
    const res = await fetch('/api/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to create assignment');
    return data.assignment;
  },

  async submitAssignment(assignmentId: string, payload: { studentId: string; studentName: string; studentNumber: string; submissionText?: string; attachmentName?: string }): Promise<AssignmentSubmission> {
    const res = await fetch(`/api/assignments/${assignmentId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to submit assignment');
    return data.submission;
  },

  async gradeSubmission(submissionId: string, payload: { score: number; feedback: string; gradedBy?: string }): Promise<AssignmentSubmission> {
    const res = await fetch(`/api/assignments/submissions/${submissionId}/grade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to grade submission');
    return data.submission;
  },

  // Results
  async getResults(studentId?: string): Promise<AssessmentResult[]> {
    const params = new URLSearchParams();
    if (studentId) params.append('studentId', studentId);
    const res = await fetch(`/api/results?${params.toString()}`);
    const data = await res.json();
    return data.results || [];
  },

  async recordResult(payload: Partial<AssessmentResult>): Promise<AssessmentResult> {
    const res = await fetch('/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to record result');
    return data.result;
  },

  // Invoices & Payments
  async getInvoices(studentId?: string): Promise<Invoice[]> {
    const params = new URLSearchParams();
    if (studentId) params.append('studentId', studentId);
    const res = await fetch(`/api/invoices?${params.toString()}`);
    const data = await res.json();
    return data.invoices || [];
  },

  async getPayments(studentId?: string): Promise<PaymentTransaction[]> {
    const params = new URLSearchParams();
    if (studentId) params.append('studentId', studentId);
    const res = await fetch(`/api/payments?${params.toString()}`);
    const data = await res.json();
    return data.payments || [];
  },

  async payInvoice(payload: { invoiceId: string; amount?: number; gateway?: string; gatewayReference?: string }): Promise<{ invoice: Invoice; payment: PaymentTransaction }> {
    const res = await fetch('/api/payments/pay-invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to process payment');
    return data;
  },

  async recordTuitionPayment(studentId: string, amount: number, gateway: string = 'paystack', paymentType: string = 'tuition'): Promise<{ receipt: PaymentTransaction; invoice?: Invoice }> {
    // Find invoice for student or trigger pay-invoice
    const invoices = await this.getInvoices(studentId);
    const invoice = invoices.find(i => i.balance > 0) || invoices[0];
    if (invoice) {
      const res = await this.payInvoice({
        invoiceId: invoice.id,
        amount,
        gateway,
        gatewayReference: `AITI_TXN_${Date.now()}`
      });
      return { receipt: res.payment, invoice: res.invoice };
    } else {
      // Fallback direct payment recording
      const res = await fetch('/api/payments/pay-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: `inv-adhoc-${studentId}`,
          amount,
          gateway,
          gatewayReference: `AITI_TXN_${Date.now()}`
        })
      });
      const data = await res.json();
      return { receipt: data.payment, invoice: data.invoice };
    }
  },

  async submitResultScore(payload: { resultId: string; assignmentScore: number; testScore: number; practicalLabScore: number; examScore: number }): Promise<AssessmentResult> {
    const totalScore = payload.assignmentScore + payload.testScore + payload.practicalLabScore + payload.examScore;
    let grade: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
    if (totalScore >= 70) grade = 'A';
    else if (totalScore >= 60) grade = 'B';
    else if (totalScore >= 50) grade = 'C';
    else if (totalScore >= 45) grade = 'D';

    return await this.recordResult({
      id: payload.resultId,
      assignmentScore: payload.assignmentScore,
      testScore: payload.testScore,
      practicalScore: payload.practicalLabScore,
      examScore: payload.examScore,
      totalScore,
      grade,
      status: totalScore >= 45 ? 'passed' : 'failed'
    });
  },


  // Certificates
  async getCertificates(studentId?: string): Promise<Certificate[]> {
    const params = new URLSearchParams();
    if (studentId) params.append('studentId', studentId);
    const res = await fetch(`/api/certificates?${params.toString()}`);
    const data = await res.json();
    return data.certificates || [];
  },

  async issueCertificate(payload: { studentId: string; specializationArea?: string; gradeAchieved?: string; adminName?: string }): Promise<Certificate> {
    const res = await fetch('/api/certificates/issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to issue certificate');
    return data.certificate;
  },

  // Verification Portal
  async verifyCode(code: string, type?: string): Promise<{ success: boolean; verified: boolean; type?: string; data?: any; message?: string }> {
    const params = new URLSearchParams({ code });
    if (type) params.append('type', type);
    const res = await fetch(`/api/verify?${params.toString()}`);
    return await res.json();
  },

  // CRM Leads & Contacts
  async getLeads(): Promise<CRMLead[]> {
    const res = await fetch('/api/crm/leads');
    const data = await res.json();
    return data.leads || [];
  },

  async updateLead(id: string, updates: Partial<CRMLead>): Promise<CRMLead> {
    const res = await fetch(`/api/crm/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to update lead');
    return data.lead;
  },

  async getContacts(): Promise<ContactMessage[]> {
    const res = await fetch('/api/contacts');
    const data = await res.json();
    return data.contacts || [];
  },

  async submitContact(payload: { fullName: string; email: string; phone?: string; subject: string; message: string }): Promise<string> {
    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to send message');
    return data.message;
  },

  // Audit Logs & Reports
  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch('/api/audit-logs');
    const data = await res.json();
    return data.auditLogs || [];
  },

  async getReportsSummary(): Promise<any> {
    const res = await fetch('/api/reports/summary');
    const data = await res.json();
    return data.summary || {};
  },

  // AI Chatbots
  async askVisitorAi(message: string, history: any[] = []): Promise<string> {
    const res = await fetch('/api/ai/visitor-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history })
    });
    const data = await res.json();
    return data.reply || "Thank you for contacting AITI.";
  },

  async askAdminAi(query: string, role: string): Promise<string> {
    const res = await fetch('/api/ai/admin-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, role })
    });
    const data = await res.json();
    return data.reply || "Intelligence query completed.";
  },

  // Reset Demo
  async resetDemo(): Promise<void> {
    await fetch('/api/db/reset-demo', { method: 'POST' });
  }
};
