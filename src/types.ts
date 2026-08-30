export type UserRole = 
  | 'super_admin' 
  | 'admin' 
  | 'admissions_officer' 
  | 'finance_officer' 
  | 'instructor' 
  | 'student' 
  | 'parent';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  whatsapp?: string;
  role: UserRole;
  avatarUrl?: string;
  department?: string;
  studentId?: string;
  studentNumber?: string;
  admissionNumber?: string;
  linkedStudentId?: string; // For parents
  createdAt: string;
}

export interface InstituteSettings {
  general: {
    instituteName: string;
    shortName: string;
    fullName: string;
    alternativeName: string;
    parentOrganization: string;
    tagline: string;
    motto: string;
    description: string;
    shortDescription: string;
    institutionType: string;
    logoUrl: string;
    faviconUrl: string;
  };
  contact: {
    primaryPhone: string;
    secondaryPhone: string;
    additionalPhone: string;
    email: string;
    supportEmail: string;
    address: string;
    street: string;
    junction: string;
    area: string;
    city: string;
    state: string;
    country: string;
    googleMapsEmbedUrl: string;
    openingHours: string;
  };
  whatsapp: {
    primaryNumber: string;
    secondaryNumber: string;
    defaultMessage: string;
    floatingEnabled: boolean;
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    showMottoOnHeader: boolean;
  };
  admissions: {
    activeSession: string; // e.g. "2026/2027"
    applicationStatus: 'open' | 'closed' | 'extended';
    applicationFee: number; // in NGN
    certificateTuition: number; // in NGN
    diplomaTuition: number; // in NGN
    acceptanceFee: number;
    applicationOpeningDate: string;
    applicationDeadline: string;
    orientationDate: string;
    programStartDate: string;
    certificateRequirements: string[];
    diplomaRequirements: string[];
  };
  documents: {
    authorizedSignatoryName: string;
    authorizedSignatoryTitle: string;
    signatorySignatureUrl: string;
    officialStampUrl: string;
    admissionLetterHeader: string;
    certificateTitle: string;
  };
  socialMedia: {
    facebook: string;
    instagram: string;
    tiktok: string;
    youtube: string;
    linkedin: string;
    twitterX: string;
  };
  numbering: {
    applicationPrefix: string; // "AITI/2026/"
    admissionPrefix: string;   // "AITI/ADM/2026/"
    studentPrefix: string;     // "AITI/STU/2026/"
    certificatePrefix: string; // "AITI/CERT/2026/"
    invoicePrefix: string;     // "AITI/INV/2026/"
    receiptPrefix: string;     // "AITI/REC/2026/"
  };
  integrations: {
    paystackPublicKey: string;
    flutterwavePublicKey: string;
    enableLivePayments: boolean;
    smsSenderId: string;
  };
}

export type ProgramType = 'certificate' | 'diploma';

export interface Program {
  id: string;
  code: string;
  title: string;
  type: ProgramType;
  duration: string; // e.g. "3 Months" or "6 Months"
  description: string;
  suitableFor: string[];
  features: string[];
  tuitionFee: number;
  applicationFee: number;
  scheduleOptions: string[];
  active: boolean;
  coursesCount?: number;
  coursesIncluded?: string[];
}

export interface Course {
  id: string;
  code: string;
  title: string;
  category: string;
  programType: 'certificate' | 'diploma' | 'both';
  durationWeeks: number;
  description: string;
  learningOutcomes: string[];
  instructorId?: string;
  instructorName?: string;
  active: boolean;
  practicalHours?: number;
}

export type ShortCourseDuration = '1 Week' | '2 Weeks' | '3 Weeks' | '4 Weeks' | string;
export type ShortCourseStatus = 'draft' | 'published' | 'archived' | 'full' | string;
export type ShortCourseTrainingMode = 'Physical Lab' | 'Online Live' | 'Hybrid' | 'Weekend Intensive' | string;
export type ShortCourseCertificateType = 'Certificate of Attendance' | 'Certificate of Practical Competency' | 'Certificate of Completion' | string;

export interface CurrencySettings {
  defaultCurrency: 'NGN';
  internationalOnlineCurrency: 'USD';
  supportedCurrencies: string[];
  exchangeNotice: string;
}

export interface LessonResource {
  id: string;
  title: string;
  type: 'pdf' | 'slide' | 'code' | 'document' | 'link';
  fileUrl: string;
  fileSize?: string;
}

export interface OnlineLesson {
  id: string;
  moduleId: string;
  title: string;
  order: number;
  durationMinutes: number;
  summary: string;
  videoUrl?: string;
  videoDuration?: string;
  contentMarkdown?: string;
  resources?: LessonResource[];
  hasQuiz?: boolean;
  quizId?: string;
  isPreviewFree?: boolean;
}

export interface OnlineCourseModule {
  id: string;
  courseId: string;
  title: string;
  order: number;
  description: string;
  lessons: OnlineLesson[];
}

export interface OnlineLiveClass {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  description: string;
  instructorName: string;
  scheduledDateTimeUTC: string;
  durationMinutes: number;
  meetingPlatform: 'Google Meet' | 'Zoom' | 'Microsoft Teams' | string;
  meetingLink: string;
  classNotes?: string;
  recordingUrl?: string;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correctAnswerIndex?: number;
  correctAnswerText?: string;
  explanation?: string;
}

export interface OnlineQuiz {
  id: string;
  courseId: string;
  courseTitle?: string;
  lessonId?: string;
  title: string;
  description: string;
  passingScorePercent: number;
  timeLimitMinutes: number;
  maxAttempts: number;
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  scorePercent: number;
  passed: boolean;
  answers: Record<string, any>;
  completedAt: string;
}

export interface OnlineAssignment {
  id: string;
  courseId: string;
  courseTitle?: string;
  moduleId?: string;
  title: string;
  description: string;
  instructionsUrl?: string;
  maxScore: number;
  dueDate: string;
  createdAt: string;
}

export interface OnlineAssignmentSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  courseId: string;
  courseTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentLocation: 'Nigeria' | 'Outside Nigeria' | string;
  country: string;
  submissionText?: string;
  fileUrl?: string;
  fileName?: string;
  submittedAt: string;
  score?: number;
  maxScore: number;
  graded: boolean;
  instructorFeedback?: string;
  gradedBy?: string;
  gradedAt?: string;
}

export interface OnlineEnrollment {
  id: string;
  enrollmentNumber: string; // e.g. AITI/ONL/2026/00018
  studentId: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  country: string;
  city?: string;
  nationality?: string;
  studentLocation: 'Nigeria' | 'Outside Nigeria';
  studentType: 'ACADEMIC_STUDENT' | 'SHORT_COURSE_PARTICIPANT' | 'CORPORATE_PARTICIPANT' | 'ORGANIZATIONAL_TRAINEE' | 'INTERNATIONAL_ONLINE_STUDENT';
  currency: 'NGN' | 'USD';
  amountPaid: number;
  regularPrice: number;
  discountAmount?: number;
  couponCode?: string;
  paymentGateway: 'paystack' | 'flutterwave' | 'stripe' | 'international_card' | 'free' | 'bank_transfer';
  paymentReference: string;
  paymentStatus: 'paid' | 'pending' | 'free';
  studyMode: 'Physical' | 'Online' | 'Hybrid';
  courseId: string;
  courseTitle: string;
  courseCode?: string;
  categoryName?: string;
  completedLessonIds: string[];
  progressPercent: number;
  enrolledAt: string;
  lastAccessedAt?: string;
  certificateIssued: boolean;
  certificateNumber?: string;
  certificateIssuedAt?: string;
  timezone: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  currency?: 'NGN' | 'USD';
  applicableCourseId?: string;
  validUntil: string;
  maxUses?: number;
  usedCount: number;
  active: boolean;
}

export interface ShortCourseCategory {
  id: string;
  name: string;
  slug?: string;
  description: string;
  iconName?: string;
  icon?: string;
  order: number;
  active?: boolean;
}

export interface ShortCourseSyllabusWeek {
  week: number;
  title: string;
  topics: string[];
}

export interface ShortCourseModuleItem {
  id?: string;
  moduleNumber: number;
  title: string;
  duration?: string;
  topics: string[];
  tools?: string[];
  description?: string;
  practicalAssignment?: string;
  assignment?: string;
}

export interface ShortCourseCompletionRule {
  minAttendancePercent?: number;
  requiredAssignmentsCount?: number;
  minAssessmentScorePercent?: number;
  minAssignmentScorePercent?: number;
  finalProjectRequired?: boolean;
  passGradePercent?: number;
}

export interface ShortCourseCertificateDetails {
  type?: string;
  issuingAuthority?: string;
  format?: string;
  verifiability?: string;
}

export interface ShortCourse {
  id: string;
  code: string;
  title: string;
  slug?: string;
  categoryId?: string;
  categoryName?: string;
  category?: string;
  description: string;
  duration?: ShortCourseDuration; // e.g. "2 Months"
  durationWeeks?: number; // e.g. 8
  durationHours?: number;
  customDuration?: string;
  classesPerWeek?: string | number; // e.g. "3 Days Per Week" or 3
  classDuration?: string; // e.g. "2 Hours Per Class"
  fee?: number; // Nigerian local fee (default ₦70,000)
  feeNGN?: number; // ₦70,000
  feeGHS?: number; // for backward compat
  trainingFee?: number;
  localPhysicalFee?: number; // ₦70,000
  localOnlineFee?: number; // ₦70,000
  internationalOnlineFee?: number; // USD (e.g. 120, 150, 160)
  internationalOnlinePrice?: number;
  localPhysicalPrice?: number;
  localOnlinePrice?: number;
  applicationFee?: number;
  registrationFee?: number;
  deliveryMode?: 'physical' | 'online' | 'hybrid' | string;
  deliveryModes?: string[];
  trainingFormats?: string[];
  onlineTrainingAvailable?: boolean;
  onlineDeliveryType?: 'LIVE' | 'SELF-PACED' | 'HYBRID ONLINE' | string;
  mode?: string;
  location?: string;
  venue?: string;
  startDate?: string;
  endDate?: string;
  instructor?: string;
  instructorName?: string;
  instructorTitle?: string;
  instructorAvatar?: string;
  trainingMode?: ShortCourseTrainingMode;
  targetAudience?: string;
  whoCanEnroll?: string[];
  prerequisites?: string;
  bannerImage?: string;
  upcomingBatches?: string[];
  courseOutline?: string[];
  modules?: ShortCourseModuleItem[];
  finalProject?: string;
  learningObjectives?: string[];
  learningOutcomes?: string[];
  toolsCovered?: string[];
  entryRequirements?: string[];
  availableSeats?: number;
  totalSeats?: number;
  enrolledCount?: number;
  maxSeats?: number;
  maxParticipants?: number;
  certificate?: ShortCourseCertificateType;
  certificateType?: ShortCourseCertificateType;
  certificateDetails?: ShortCourseCertificateDetails;
  certification?: string;
  status?: ShortCourseStatus;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Beginner/Intermediate' | 'All Levels' | string;
  featured?: boolean;
  active?: boolean;
  schedule?: string;
  scheduleDetails?: string;
  syllabus?: ShortCourseSyllabusWeek[];
  completionRules?: ShortCourseCompletionRule;
  accessDuration?: string; // "60 Days" or "Until Course Completion"
  enrollmentDeadline?: string;
  discounts?: {
    earlyBirdPercent?: number;
    studentPercent?: number;
    siblingPercent?: number;
    promotionalPercent?: number;
    couponCode?: string;
    groupDiscountPercent?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export type CorporateRequestStatus = 
  | 'NEW'
  | 'CONTACTED'
  | 'REQUIREMENTS_RECEIVED'
  | 'PROPOSAL_SENT'
  | 'NEGOTIATION'
  | 'APPROVED'
  | 'SCHEDULED'
  | 'TRAINING_IN_PROGRESS'
  | 'COMPLETED'
  | 'INVOICED'
  | 'PAID'
  | 'CLOSED'
  | 'CANCELLED'
  | 'New'
  | 'Contacted'
  | 'Proposal Sent'
  | 'Approved'
  | 'Scheduled'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled'
  | 'pending'
  | string;

export type CorporateTrainingMode = 'On-site' | 'At AITI' | 'Online' | 'Hybrid' | string;

export interface CorporateParticipant {
  id: string;
  fullName: string;
  staffId?: string;
  department?: string;
  jobTitle?: string;
  email: string;
  phone?: string;
  course?: string;
  attendance?: number;
  attendanceRate?: number;
  attendanceStatus?: 'present' | 'absent' | 'late';
  grade?: string;
  completed?: boolean;
  certificateIssued?: boolean;
  certificateNumber?: string;
  certificateDate?: string;
}

export interface CorporateTrainingReport {
  id: string;
  organization: string;
  trainingTitle: string;
  startDate: string;
  endDate: string;
  duration: string;
  instructor: string;
  numberOfParticipants: number;
  presentCount: number;
  absentCount: number;
  attendancePercentage: number;
  topicsCovered: string[];
  learningOutcomes: string[];
  participantPerformance: {
    staffName: string;
    staffId?: string;
    department?: string;
    jobTitle?: string;
    score?: number;
    grade?: string;
    attendance: number;
    certificateIssued?: boolean;
  }[];
  feedbackSummary: {
    averageRating: number;
    instructorRating: number;
    relevanceRating: number;
    practicalRating: number;
    materialsRating: number;
    comments: string[];
  };
  recommendations: string[];
  generatedAt: string;
  generatedBy: string;
}

export interface TrainingFeedback {
  id: string;
  trainingId: string;
  trainingType: 'corporate' | 'short_course' | 'diploma' | 'certificate' | string;
  trainingTitle: string;
  participantName?: string;
  staffId?: string;
  organization?: string;
  overallRating: number; // 1-5
  instructorRating: number; // 1-5
  courseRelevance: number; // 1-5
  trainingMaterials: number; // 1-5
  practicalUsefulness: number; // 1-5
  venueOnlineExperience: number; // 1-5
  suggestions: string;
  comments: string;
  submittedAt: string;
}

export interface CorporateTrainingPackage {
  id: string;
  name: 'BASIC' | 'PROFESSIONAL' | 'ADVANCED' | 'CUSTOM' | string;
  title: string;
  tagline: string;
  description: string;
  duration: string;
  targetAudience: string;
  features: string[];
  recommendedFor: string;
  priceType: 'starting_at' | 'per_participant' | 'quote' | 'fixed';
  basePriceGHS?: number;
  customizable: boolean;
  popular?: boolean;
  active?: boolean;
}

export interface CourseCohort {
  id: string;
  courseId: string;
  courseTitle: string;
  cohortName: string; // e.g. "Cohort 1 — September"
  startDate: string;
  endDate: string;
  duration: string;
  instructorName: string;
  deliveryMode: 'Physical' | 'Online' | 'Hybrid' | 'Weekend Intensive' | string;
  venue: string;
  maxCapacity: number;
  enrolledCount: number;
  status: 'Open' | 'Filling Fast' | 'Full' | 'In Progress' | 'Completed' | string;
  waitlistCount: number;
}

export interface CourseWaitlistEntry {
  id: string;
  courseId: string;
  courseTitle: string;
  cohortId?: string;
  cohortName?: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  preferredBatchDate?: string;
  notes?: string;
  status: 'waiting' | 'notified' | 'enrolled' | 'cancelled' | string;
  createdAt: string;
}

export interface TrainingInstructor {
  id: string;
  name: string;
  title: string;
  photo: string;
  biography: string;
  expertise: string[];
  assignedPrograms: string[]; // 'Certificate', 'Diploma', 'Short-term', 'Corporate'
  qualifications: string[];
  yearsOfExperience: number;
  rating?: number;
  status: 'active' | 'inactive';
  published: boolean;
  email?: string;
  phone?: string;
}

export interface CorporateTrainingRequest {
  id: string;
  requestCode?: string;
  requestNumber: string; // e.g. AITI/CORP/2026/00012
  organizationName: string;
  companyName?: string;
  industry?: string;
  organizationType: string;
  contactPerson: string;
  contactName?: string;
  position?: string;
  phone: string;
  whatsapp?: string;
  email: string;
  organizationAddress?: string;
  numberOfStaff: number | string;
  estimatedParticipants?: number;
  targetStaffGroup?: string;
  targetStaffGroups?: string[];
  preferredTrainingTopic?: string;
  trainingTopic?: string;
  trainingNeeds?: string;
  selectedTopics?: string[];
  preferredDuration?: string;
  duration?: string;
  preferredTrainingDate?: string;
  preferredDate?: string;
  preferredDates?: string;
  preferredTrainingLocation?: string;
  trainingLocation?: string;
  trainingLocationType?: string;
  trainingMode: 'On-site' | 'At AITI' | 'Online' | 'Hybrid' | string;
  trainingFormat?: string;
  additionalRequirements?: string;
  customRequirements?: string;
  estimatedBudget?: string | number;
  supportingDocumentName?: string;
  supportingDocumentUrl?: string;
  status: CorporateRequestStatus;
  adminNotes?: string;
  internalNotes?: string;
  assignedOfficer?: string;
  assignedCoordinator?: string;
  assignedTrainer?: string;
  assignedInstructor?: string;
  quotationAmountGHS?: number;
  quotationNumber?: string;
  invoiceNumber?: string;
  scheduledStartDate?: string;
  scheduledEndDate?: string;
  venueAddress?: string;
  participantsList?: CorporateParticipant[];
  participants?: CorporateParticipant[];
  trainingEvaluationFeedback?: string;
  submittedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CorporateQuotation {
  id: string;
  quotationNumber: string; // e.g. AITI/QUO/2026/00012
  requestId?: string;
  requestNumber?: string;
  organizationName: string;
  companyName?: string;
  contactPerson: string;
  contactPosition?: string;
  contactEmail?: string;
  contactPhone?: string;
  email?: string;
  phone?: string;
  trainingTitle: string;
  trainingObjectives?: string[];
  numberOfParticipants?: number;
  trainingDuration?: string;
  trainingVenue?: string;
  trainerName?: string;
  trainerTitle?: string;
  trainingFee?: number;
  additionalCosts?: { description: string; amount: number }[];
  discount?: number;
  subtotal?: number;
  taxAmount?: number;
  currency?: string;
  items?: { description: string; quantity: number; unitPrice: number; total: number }[];
  totalAmount: number;
  paymentTerms?: string;
  validityPeriod?: string;
  authorizedSignatoryName?: string;
  authorizedSignatoryTitle?: string;
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'invoiced' | 'APPROVED' | string;
  issuedAt?: string;
  validUntil?: string;
  createdAt?: string;
}

export interface CorporateInvoice {
  id: string;
  invoiceNumber: string; // e.g. AITI/INV/CORP/2026/00012
  quotationId?: string;
  quotationNumber?: string;
  requestId?: string;
  organizationName: string;
  companyName?: string;
  trainingTitle: string;
  contactPerson: string;
  contactEmail?: string;
  contactPhone?: string;
  email?: string;
  phone?: string;
  amount?: number;
  subtotal?: number;
  taxAmount?: number;
  discountAmount?: number;
  discount?: number;
  netAmount?: number;
  totalAmount?: number;
  amountPaid: number;
  balance?: number;
  balanceDue?: number;
  dueDate: string;
  paymentStatus: 'Draft' | 'Sent' | 'Partially Paid' | 'Paid' | 'Overdue' | 'Cancelled' | 'PAID' | 'UNPAID' | 'PARTIAL' | string;
  paymentReference?: string;
  items?: { description: string; quantity: number; unitPrice: number; total: number }[];
  paymentTerms?: string;
  issuedAt?: string;
  paidAt?: string;
  receiptNumber?: string;
  createdAt?: string;
}

export interface ShortCourseMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'slides' | 'code' | 'video' | 'lab_sheet' | 'zip' | 'document' | string;
  size?: string;
  downloadUrl: string;
  uploadedAt?: string;
}

export interface ShortCourseAssignmentItem {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  submitted: boolean;
  submissionText?: string;
  submissionLink?: string;
  submissionUrl?: string;
  submissionNotes?: string;
  submittedAt?: string;
  score?: number;
  graded: boolean;
  feedback?: string;
  status?: string;
}

export interface ShortCourseEnrollment {
  id: string;
  registrationId: string; // e.g. AITI/STC/2026/00025
  enrollmentNumber: string; // alias for backwards compatibility
  shortCourseId: string;
  courseId?: string;
  courseTitle: string;
  courseCode?: string;
  categoryName?: string;
  duration?: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  occupation?: string;
  organization?: string;
  preferredSchedule: string; // e.g. 'Weekday Morning (9:00 AM - 12:00 PM)', 'Weekday Evening', 'Weekend Intensive'
  trainingMode: 'Physical' | 'Online' | 'Hybrid' | string;
  batchDate?: string;
  preferredBatchDate?: string;
  fee: number;
  feeGHS?: number;
  paymentMethod?: string;
  paymentStatus: 'pending' | 'paid' | 'verified' | 'cash_on_arrival' | string;
  paymentReference?: string;
  amountPaid?: number;
  paidAt?: string;
  status: 'active' | 'in_progress' | 'completed' | 'cancelled' | 'registered' | 'confirmed' | 'enrolled' | string;
  attendanceRate?: number;
  attendanceLog?: { date: string; topic: string; status: 'present' | 'absent' | 'late' }[];
  materials?: ShortCourseMaterial[];
  assignments?: ShortCourseAssignmentItem[];
  announcements?: { id: string; title: string; date: string; message?: string; content?: string }[];
  certificateIssued?: boolean;
  certificateNumber?: string; // e.g. AITI/CERT/STC/2026/00025
  certificateDate?: string;
  enrolledAt?: string;
  createdAt: string;
}

export type ApplicationStatus = 
  | 'draft'
  | 'payment_pending'
  | 'submitted'
  | 'under_review'
  | 'document_verification'
  | 'interview_required'
  | 'approved'
  | 'admission_offered'
  | 'accepted'
  | 'enrolled'
  | 'rejected'
  | 'withdrawn'
  | 'deferred';

export interface ApplicationDocument {
  id: string;
  type: 'passport' | 'id_card' | 'educational_certificate' | 'other';
  title: string;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  verified: boolean;
}

export interface Application {
  id: string;
  applicationId: string; // e.g. AITI/2026/000124
  userId?: string;
  // Personal Info
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  stateOfOrigin: string;
  lga: string;
  residentialAddress: string;
  phone: string;
  whatsapp: string;
  email: string;
  passportPhotoUrl?: string;
  // Education
  highestQualification: string;
  institution: string;
  graduationYear: string;
  courseStudied?: string;
  previousIctExperience: string;
  currentOccupation?: string;
  // Program Selection
  programId: string;
  programTitle: string;
  programType: ProgramType;
  intake: string;
  studyMode: 'Weekday Regular' | 'Weekend Intensive' | 'Evening Executive';
  preferredSchedule: string;
  // Next of Kin
  nextOfKinName: string;
  nextOfKinRelationship: string;
  nextOfKinPhone: string;
  nextOfKinEmail?: string;
  nextOfKinAddress: string;
  // Documents
  documents: ApplicationDocument[];
  // Status & Timestamps
  status: ApplicationStatus;
  paymentStatus: 'pending' | 'paid';
  paymentReference?: string;
  paymentAmount: number;
  paidAt?: string;
  submittedAt?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  interviewDate?: string;
  interviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdmissionRecord {
  id: string;
  admissionNumber: string; // e.g. AITI/ADM/2026/000045
  applicationId: string;
  applicationRef: string; // AITI/2026/000124
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  programTitle: string;
  programType: ProgramType;
  duration: string;
  academicSession: string; // 2026/2027
  commencementDate: string;
  orientationDate: string;
  conditions: string[];
  tuitionFee: number;
  acceptanceFee: number;
  status: 'offered' | 'accepted' | 'declined' | 'enrolled';
  offeredAt: string;
  acceptedAt?: string;
  assignedClassId?: string;
  assignedStudentId?: string; // e.g. AITI/STU/2026/000032
  qrVerificationUrl: string;
}

export interface Student {
  id: string;
  studentNumber: string; // AITI/STU/2026/000032
  admissionNumber: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  dateOfBirth: string;
  gender: string;
  residentialAddress: string;
  passportPhotoUrl: string;
  programTitle: string;
  programType: ProgramType;
  academicSession: string;
  classId?: string;
  className?: string;
  enrollmentDate: string;
  expectedGraduationDate: string;
  status: 'active' | 'graduated' | 'suspended' | 'deferred' | 'withdrawn';
  totalTuition: number;
  amountPaid: number;
  outstandingBalance: number;
  attendancePercentage: number;
  qrCodeUrl: string;
}

export interface ClassRoom {
  id: string;
  name: string; // e.g. "Classroom 1 (Lab Alpha)", "Classroom 2 (Innovation Hub)"
  capacity: number;
  location: string;
  hasComputers: boolean;
  hasProjector: boolean;
}

export interface AcademicClass {
  id: string;
  code: string;
  title: string;
  programType: ProgramType;
  programId: string;
  academicSession: string;
  instructorId: string;
  instructorName: string;
  classRoomId: string;
  classRoomName: string;
  scheduleDays: string[];
  scheduleTime: string;
  totalStudents: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

export interface TimetableEntry {
  id: string;
  classId: string;
  className: string;
  courseCode: string;
  courseTitle: string;
  instructorId: string;
  instructorName: string;
  roomName: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string;
  endTime: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  classId: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  recordedBy: string;
  remarks?: string;
  recordedAt: string;
}

export interface Assignment {
  id: string;
  classId: string;
  className: string;
  courseCode: string;
  courseTitle: string;
  instructorId: string;
  instructorName: string;
  title: string;
  description: string;
  attachments?: { name: string; url: string }[];
  dueDate: string;
  maxScore: number;
  submissionsCount?: number;
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  submissionText?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  submittedAt: string;
  score?: number;
  maxScore: number;
  graded: boolean;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: string;
}

export interface AssessmentResult {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  classId: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  academicSession: string;
  assignmentScore: number; // Max 20
  testScore: number;       // Max 20
  practicalScore: number;  // Max 30
  examScore: number;       // Max 30
  totalScore: number;      // 0 - 100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  status: 'passed' | 'failed';
  remarks: string;
  published: boolean;
  recordedAt: string;
}

export interface FeeStructureItem {
  id: string;
  programType: ProgramType;
  title: string;
  amount: number;
  isCompulsory: boolean;
  frequency: 'once' | 'per_session' | 'optional';
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // AITI/INV/2026/000102
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentNumber: string;
  title: string;
  description: string;
  amount: number;
  amountPaid: number;
  balance: number;
  dueDate: string;
  status: 'unpaid' | 'partially_paid' | 'paid' | 'overdue';
  items: { description: string; amount: number }[];
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  receiptNumber: string; // AITI/REC/2026/000214
  invoiceId?: string;
  studentId?: string;
  studentName: string;
  studentEmail: string;
  paymentType: 'application_fee' | 'tuition' | 'acceptance' | 'certificate' | 'other';
  amount: number;
  gateway: 'paystack' | 'flutterwave' | 'bank_transfer' | 'cash';
  gatewayReference: string;
  status: 'success' | 'failed' | 'pending';
  channel: string;
  paidAt: string;
  verifiedBy: string;
  notes?: string;
  qrVerificationUrl: string;
}

export interface Certificate {
  id: string;
  certificateNumber: string; // AITI/CERT/2026/000088
  studentId: string;
  studentName: string;
  studentNumber: string;
  programTitle: string;
  programType: ProgramType;
  duration: string;
  specializationArea: string;
  completionDate: string;
  gradeAchieved: string;
  signatoryName: string;
  signatoryTitle: string;
  issuedAt: string;
  status: 'issued' | 'revoked';
  qrVerificationUrl: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  audience: 'all' | 'applicants' | 'students' | 'parents' | 'instructors' | 'staff';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  imageUrl?: string;
  publishDate: string;
  expiryDate?: string;
  active: boolean;
  authorName: string;
  createdAt: string;
}

export interface NewsEventItem {
  id: string;
  title: string;
  slug: string;
  type: 'news' | 'workshop' | 'seminar' | 'bootcamp' | 'admission' | 'graduation';
  summary: string;
  content: string;
  imageUrl: string;
  date: string;
  location?: string;
  registrationLink?: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Classes' | 'Students' | 'Projects' | 'Events' | 'Graduation' | 'Labs' | 'Workshops';
  imageUrl: string;
  description?: string;
  date: string;
}

export interface CRMLead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  programInterest: string;
  source: 'website' | 'whatsapp' | 'contact_form' | 'walk_in' | 'referral' | 'event' | 'corporate_inquiry' | 'short_course_registration' | string;
  status: 'new' | 'contacted' | 'interested' | 'application_started' | 'applied' | 'admitted' | 'enrolled' | 'not_interested';
  notes?: string;
  assignedTo?: string;
  lastContactedAt?: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
  adminNotes?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  program: string;
  quote: string;
  avatarUrl: string;
  rating: number;
  featured: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'Admissions' | 'Programs' | 'Fees & Payment' | 'Classes & Schedules' | 'Certificates';
  order: number;
}

// Aliases for component convenience
export type AdmissionOffer = AdmissionRecord;
export type AcademicResult = AssessmentResult;
export type CertificateRecord = Certificate;


