import { InstituteSettings, Program, Course, Application, AdmissionRecord, Student, AcademicClass, TimetableEntry, AttendanceRecord, Assignment, AssignmentSubmission, AssessmentResult, Invoice, PaymentTransaction, Certificate, Announcement, NewsEventItem, GalleryItem, CRMLead, ContactMessage, AuditLog, Testimonial, FaqItem, UserProfile, ShortCourseCategory, ShortCourse, CorporateTrainingRequest, ShortCourseEnrollment, CorporateQuotation, CorporateInvoice, QuoteRequest, PriceVersionLog } from '../src/types';
import { comprehensiveCategories } from './courses/categories';
import { comprehensiveShortCourses } from './courses/courses';

export const initialSettings: InstituteSettings = {
  general: {
    instituteName: "AITI",
    shortName: "AITI",
    fullName: "AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE",
    alternativeName: "AFTATECH Institute of Information Technologies",
    parentOrganization: "AFTATECH.IT CONSULT",
    tagline: "BEYOND TECH",
    motto: "Empowering You Through ICT",
    description: "AITI (AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE) is a modern technology-focused institute dedicated to practical ICT education, digital skills development, innovation and emerging technologies. The institute equips students, graduates, professionals and aspiring technology professionals with practical skills needed to thrive in today's digital economy.",
    shortDescription: "Empowering students, graduates and professionals with hands-on ICT and emerging technology skills in Ilorin, Nigeria.",
    institutionType: "Technology & Information Technology Training Institute",
    logoUrl: "",
    faviconUrl: ""
  },
  contact: {
    primaryPhone: "08030947468",
    secondaryPhone: "08024142417",
    additionalPhone: "09056119667",
    email: "aftatechit@gmail.com",
    supportEmail: "aftatechit@gmail.com",
    address: "2 Babanla Street, Graceland Junction, Tanke, Ilorin, Kwara State, Nigeria.",
    street: "2 Babanla Street",
    junction: "Graceland Junction, Tanke",
    area: "Tanke",
    city: "Ilorin",
    state: "Kwara State",
    country: "Nigeria",
    googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.0469032549247!2d4.5828405!3d8.487042!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10364d9943486df5%3A0x8e820257ecae8b0e!2sTanke%20Junction%2C%20Ilorin!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng",
    openingHours: "Mon - Fri: 8:00 AM - 6:00 PM | Sat: 9:00 AM - 4:00 PM"
  },
  whatsapp: {
    primaryNumber: "08030947468",
    secondaryNumber: "08024142417",
    defaultMessage: "Hello AITI, I would like to make an enquiry about your programs and admission.",
    floatingEnabled: true
  },
  branding: {
    primaryColor: "#0284c7",
    secondaryColor: "#0f172a",
    accentColor: "#06b6d4",
    showMottoOnHeader: true
  },
  admissions: {
    activeSession: "2026/2027",
    applicationStatus: "open",
    applicationFee: 5000,
    certificateTuition: 65000,
    diplomaTuition: 120000,
    acceptanceFee: 10000,
    applicationOpeningDate: "2026-08-01",
    applicationDeadline: "2026-10-31",
    orientationDate: "2026-11-05",
    programStartDate: "2026-11-10",
    certificateRequirements: [
      "Basic literacy in English language",
      "Passion and willingness to learn practical technology skills",
      "Basic computer knowledge is helpful but not mandatory for beginner-level tracks"
    ],
    diplomaRequirements: [
      "Secondary school education (SSCE/WAEC/NECO) or equivalent qualification",
      "Basic computer literacy and fundamentals",
      "Dedication to intensive practical hands-on technology training and project work"
    ]
  },
  documents: {
    authorizedSignatoryName: "Director of Academic Affairs",
    authorizedSignatoryTitle: "Registrar / Director of Academics",
    signatorySignatureUrl: "",
    officialStampUrl: "",
    admissionLetterHeader: "OFFICIAL PROVISIONAL ADMISSION OFFER",
    certificateTitle: "DIPLOMA & CERTIFICATE OF PROFESSIONAL PROFICIENCY"
  },
  socialMedia: {
    facebook: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    linkedin: "",
    twitterX: ""
  },
  numbering: {
    applicationPrefix: "AITI/2026/",
    admissionPrefix: "AITI/ADM/2026/",
    studentPrefix: "AITI/STU/2026/",
    certificatePrefix: "AITI/CERT/2026/",
    invoicePrefix: "AITI/INV/2026/",
    receiptPrefix: "AITI/REC/2026/"
  },
  integrations: {
    paystackPublicKey: "pk_test_aiti_demo_paystack_key",
    flutterwavePublicKey: "FLWPUBK_TEST-aiti_demo_key-X",
    enableLivePayments: false,
    smsSenderId: "AITI"
  },
  pricing: {
    publicPriceDisplay: "quote_only",
    displayDisclaimer: true,
    customDisclaimerText: "Training fees are subject to change based on schedule, delivery format, cohort timing, and current institutional promotion. Please contact AITI for the current applicable fee before making payment.",
    customInternationalDisclaimerText: "International online training fees are subject to change. Please contact AITI to receive the current USD fee before making payment.",
    allowWhatsappQuotes: true,
    allowDirectCalls: true,
    quoteExpiryDaysDefault: 14,
    showApplicationFee: "public"
  }
};

export const initialPrograms: Program[] = [
  {
    id: "prog-cert-3m",
    code: "AITI-CERT",
    title: "3-Month Certificate Program",
    type: "certificate",
    duration: "3 Months",
    description: "An intensive, hands-on certification designed for rapid digital skills mastery, building strong foundations and career readiness in chosen ICT disciplines.",
    suitableFor: [
      "Beginners & Enthusiasts",
      "Undergraduate Students & NYSC Corp Members",
      "Working Professionals upgrading digital skills",
      "Individuals seeking immediate practical digital competence"
    ],
    features: [
      "100% Practical & Project-Based Curriculum",
      "Experienced Industry Instructors",
      "Flexible Schedules (Weekday & Weekend)",
      "Official AITI Certificate of Competence",
      "Free Lab & Internet Access during training"
    ],
    tuitionFee: 65000,
    applicationFee: 5000,
    scheduleOptions: [
      "Weekday Morning: Mon & Wed (9:00 AM - 12:00 PM)",
      "Weekday Afternoon: Tue & Thu (1:00 PM - 4:00 PM)",
      "Weekend Intensive: Saturdays (9:00 AM - 3:00 PM)"
    ],
    active: true,
    coursesCount: 12,
    coursesIncluded: ["ICT-101", "ICT-102", "ICT-103", "ICT-104", "DEV-201", "DEV-204", "DAT-301", "DES-401", "DES-402", "MKT-501", "ENG-601", "EMG-801"]
  },
  {
    id: "prog-dip-6m",
    code: "AITI-DIP",
    title: "6-Month Diploma Program",
    type: "diploma",
    duration: "6 Months",
    description: "A comprehensive professional diploma featuring in-depth technical immersion, advanced specialization modules, live capstone projects, and technology entrepreneurship training.",
    suitableFor: [
      "Students & Higher Institution Graduates",
      "Aspiring Software Engineers & Tech Professionals",
      "Entrepreneurs building digital products",
      "Individuals seeking advanced practical engineering capabilities"
    ],
    features: [
      "Advanced Project-Based Specialization",
      "Live Capstone Industry Project with Portfolio Review",
      "Mentorship from Senior Technology Leaders",
      "Career Guidance & Freelancing Preparation",
      "Official Verified AITI Professional Diploma"
    ],
    tuitionFee: 120000,
    applicationFee: 5000,
    scheduleOptions: [
      "Weekday Regular: Mon, Wed & Fri (9:00 AM - 1:00 PM)",
      "Executive Evening: Mon, Wed & Fri (5:00 PM - 7:30 PM)",
      "Weekend Professional: Saturdays (9:00 AM - 4:00 PM)"
    ],
    active: true,
    coursesCount: 16,
    coursesIncluded: ["ICT-101", "ICT-102", "ICT-104", "DEV-201", "DEV-202", "DEV-203", "DEV-204", "DAT-301", "DAT-302", "DES-401", "DES-402", "DES-403", "MKT-501", "MKT-502", "ENG-601", "ENG-602", "EMG-801", "EMG-802"]
  }
];

export const initialCourses: Course[] = [
  // ICT & DIGITAL SKILLS
  { id: "c-1", code: "ICT-101", title: "ICT Fundamentals & Computer Appreciation", category: "ICT & Digital Skills", programType: "both", durationWeeks: 4, description: "Master essential computer architecture, file systems, operating systems, and computer hygiene.", learningOutcomes: ["Understand OS internals", "Navigate file systems", "Troubleshoot common desktop problems"], active: true },
  { id: "c-2", code: "ICT-102", title: "Microsoft Office Suite (Word, Excel, PowerPoint)", category: "ICT & Digital Skills", programType: "both", durationWeeks: 6, description: "Professional document formatting, advanced spreadsheets, data formulas, and dynamic presentation designs.", learningOutcomes: ["Create executive reports", "Automate Excel formulas and lookup tables", "Build pitch decks"], active: true },
  { id: "c-3", code: "ICT-103", title: "Digital Literacy & Internet Operations", category: "ICT & Digital Skills", programType: "certificate", durationWeeks: 4, description: "Cloud computing basics, email etiquette, safe web operations, collaboration tools.", learningOutcomes: ["Master cloud storage & Google Workspace", "Cyber safety hygiene", "Professional digital communication"], active: true },
  { id: "c-4", code: "ICT-104", title: "Artificial Intelligence Fundamentals & Productivity Tools", category: "ICT & Digital Skills", programType: "both", durationWeeks: 4, description: "Hands-on generative AI prompting, workflow automation, and productivity scaling.", learningOutcomes: ["Master LLM prompting techniques", "Automate business workflows with AI tools", "AI ethics & data privacy"], active: true },

  // SOFTWARE & WEB DEVELOPMENT
  { id: "c-5", code: "DEV-201", title: "Front-End Web Development (HTML5, CSS3, JavaScript, React)", category: "Software & Web Development", programType: "both", durationWeeks: 10, description: "Build responsive, modern web applications with semantic HTML, modern styling, and component frameworks.", learningOutcomes: ["Build production-ready responsive websites", "Master DOM manipulation & ES6+", "Develop reactive SPAs"], active: true },
  { id: "c-6", code: "DEV-202", title: "Back-End Development (Node.js, Express, REST APIs)", category: "Software & Web Development", programType: "diploma", durationWeeks: 10, description: "Server architectures, RESTful API design, middleware patterns, and authentication.", learningOutcomes: ["Build scalable server backends", "Implement JWT and role auth", "Design secure web APIs"], active: true },
  { id: "c-7", code: "DEV-203", title: "Full-Stack Software Engineering", category: "Software & Web Development", programType: "diploma", durationWeeks: 12, description: "End-to-end full stack architecture connecting relational databases, server APIs, and dynamic clients.", learningOutcomes: ["Architect full-stack systems", "Deploy to cloud containers", "Implement automated CI/CD"], active: true },
  { id: "c-8", code: "DEV-204", title: "Programming & Algorithmic Thinking (Python / TypeScript)", category: "Software & Web Development", programType: "both", durationWeeks: 6, description: "Logic building, data structures, algorithms, and modular object-oriented programming.", learningOutcomes: ["Write clean structured code", "Optimize problem-solving efficiency", "Build practical automation scripts"], active: true },

  // DATA & AI
  { id: "c-9", code: "DAT-301", title: "Data Analysis & Business Intelligence (Excel, SQL, PowerBI)", category: "Data & AI", programType: "both", durationWeeks: 8, description: "Data wrangling, relational SQL queries, interactive dashboards, and business reporting.", learningOutcomes: ["Query relational databases with SQL", "Clean and transform raw data", "Design interactive executive dashboards"], active: true },
  { id: "c-10", code: "DAT-302", title: "Applied Artificial Intelligence & Machine Learning", category: "Data & AI", programType: "diploma", durationWeeks: 10, description: "Machine learning algorithms, Python pandas, model evaluation, and predictive analytics.", learningOutcomes: ["Train supervised learning models", "Evaluate accuracy metrics", "Deploy predictive inference APIs"], active: true },

  // GRAPHICS & CREATIVE TECHNOLOGY
  { id: "c-11", code: "DES-401", title: "Professional Graphics Design (Photoshop, Illustrator, CorelDraw)", category: "Graphics & Creative Technology", programType: "both", durationWeeks: 8, description: "Visual identity, brand assets, vector illustration, typography, and print design.", learningOutcomes: ["Create professional brand identities", "Master raster and vector manipulation", "Prepare print-ready press artwork"], active: true },
  { id: "c-12", code: "DES-402", title: "UI/UX Design & Product Prototyping (Figma)", category: "Graphics & Creative Technology", programType: "both", durationWeeks: 8, description: "User research, wireframing, design systems, interactive prototypes, and usability testing.", learningOutcomes: ["Conduct user research & empathy mapping", "Construct complete design systems", "Prototype high-fidelity interactive flows"], active: true },
  { id: "c-13", code: "DES-403", title: "Video Editing & Motion Graphics (Premiere Pro, After Effects)", category: "Graphics & Creative Technology", programType: "both", durationWeeks: 8, description: "Non-linear video editing, audio mastering, visual effects, and cinematic transitions.", learningOutcomes: ["Edit high-impact promotional videos", "Apply motion graphic typography", "Master audio mixing for digital channels"], active: true },

  // BUSINESS & DIGITAL MARKETING
  { id: "c-14", code: "MKT-501", title: "Digital Marketing & Social Media Growth Management", category: "Business & Digital Marketing", programType: "both", durationWeeks: 6, description: "Search engine optimization (SEO), social media ad campaigns, content marketing, and conversions.", learningOutcomes: ["Run high-converting Facebook & Google ads", "Execute SEO content strategies", "Analyze campaign ROAS"], active: true },
  { id: "c-15", code: "MKT-502", title: "Online Business Strategy & Tech Entrepreneurship", category: "Business & Digital Marketing", programType: "diploma", durationWeeks: 6, description: "Monetizing tech skills, freelancing on global platforms, business pitching, and client management.", learningOutcomes: ["Set up international freelance profiles", "Invoice and manage remote clients", "Formulate tech business proposals"], active: true },

  // HARDWARE & TECHNICAL
  { id: "c-16", code: "ENG-601", title: "Computer Hardware Engineering & Maintenance", category: "Hardware & Technical", programType: "both", durationWeeks: 8, description: "Component troubleshooting, PC assembly, motherboard diagnostics, thermal management.", learningOutcomes: ["Assemble desktop and laptop hardware", "Diagnose power and motherboard faults", "Perform preventative maintenance"], active: true },
  { id: "c-17", code: "ENG-602", title: "Computer Networking & Infrastructure Setup", category: "Hardware & Technical", programType: "both", durationWeeks: 8, description: "LAN/WAN topologies, router and switch configuration, cabling, IP subnetting, Wi-Fi security.", learningOutcomes: ["Crimp and test network cables", "Configure wireless routers & access points", "Subnet and allocate IP address pools"], active: true },

  // ENGINEERING / DESIGN SOFTWARE
  { id: "c-18", code: "CAD-701", title: "AutoCAD 2D & 3D Computer-Aided Drafting", category: "Engineering / Design Software", programType: "both", durationWeeks: 8, description: "Architectural floor plans, mechanical drawings, elevation sections, and 3D modeling.", learningOutcomes: ["Draw standard 2D building plans", "Generate accurate dimensions & sections", "Render 3D isometric models"], active: true },
  { id: "c-19", code: "CAD-702", title: "Autodesk Revit Building Information Modeling (BIM)", category: "Engineering / Design Software", programType: "both", durationWeeks: 8, description: "Parametric building modeling, structural drafting, schedules, and realistic renderings.", learningOutcomes: ["Build parametric architectural BIM models", "Generate structural schedules", "Produce photorealistic renders"], active: true },

  // EMERGING TECHNOLOGIES
  { id: "c-20", code: "EMG-801", title: "Cybersecurity Fundamentals & Threat Defense", category: "Emerging Technologies", programType: "both", durationWeeks: 8, description: "Network defense, vulnerability assessments, encryption, ethical hacking basics, security policies.", learningOutcomes: ["Audit common system vulnerabilities", "Implement defense-in-depth policies", "Understand cryptographic fundamentals"], active: true },
  { id: "c-21", code: "EMG-802", title: "Cloud Computing (AWS / Azure Foundations)", category: "Emerging Technologies", programType: "both", durationWeeks: 8, description: "Cloud virtual machines, object storage, serverless functions, VPC networking, cloud cost control.", learningOutcomes: ["Provision cloud compute and storage", "Manage IAM security roles", "Deploy web apps on cloud containers"], active: true }
];

export const initialUsers: UserProfile[] = [
  {
    id: "usr-admin-1",
    email: "admin@aftatech.com",
    fullName: "Engr. A. F. Taiwo",
    phone: "08030947468",
    whatsapp: "08030947468",
    role: "super_admin",
    department: "Executive Management",
    createdAt: "2026-01-10T09:00:00Z"
  },
  {
    id: "usr-adm-officer",
    email: "admissions@aftatech.com",
    fullName: "Mrs. K. O. Balogun",
    phone: "08024142417",
    whatsapp: "08024142417",
    role: "admissions_officer",
    department: "Admissions & Registry",
    createdAt: "2026-01-15T10:00:00Z"
  },
  {
    id: "usr-fin-officer",
    email: "bursary@aftatech.com",
    fullName: "Mr. S. A. Adeleke",
    phone: "09056119667",
    whatsapp: "09056119667",
    role: "finance_officer",
    department: "Bursary & Accounts",
    createdAt: "2026-01-18T11:00:00Z"
  },
  {
    id: "usr-inst-1",
    email: "samuel.inst@aftatech.com",
    fullName: "Samuel K. Olatunji",
    phone: "08031234567",
    whatsapp: "08031234567",
    role: "instructor",
    department: "Software Engineering",
    createdAt: "2026-02-01T08:30:00Z"
  },
  {
    id: "usr-inst-2",
    email: "mary.inst@aftatech.com",
    fullName: "Mary A. Ibrahim",
    phone: "08039876543",
    whatsapp: "08039876543",
    role: "instructor",
    department: "Design & Creative Tech",
    createdAt: "2026-02-05T08:30:00Z"
  },
  {
    id: "usr-stu-1",
    email: "oluwaseun.student@gmail.com",
    fullName: "Oluwaseun David Ajayi",
    phone: "08145678901",
    whatsapp: "08145678901",
    role: "student",
    studentNumber: "AITI/STU/2026/000001",
    admissionNumber: "AITI/ADM/2026/000001",
    createdAt: "2026-03-01T12:00:00Z"
  },
  {
    id: "usr-parent-1",
    email: "ajayi.parent@gmail.com",
    fullName: "Chief E. B. Ajayi",
    phone: "08051239876",
    role: "parent",
    linkedStudentId: "stu-1",
    createdAt: "2026-03-05T14:00:00Z"
  }
];

export const initialClasses: AcademicClass[] = [
  {
    id: "cls-1",
    code: "CLS-DIP-SW-26A",
    title: "Software Engineering Diploma (Alpha Cohort)",
    programType: "diploma",
    programId: "prog-dip-6m",
    academicSession: "2026/2027",
    instructorId: "usr-inst-1",
    instructorName: "Samuel K. Olatunji",
    classRoomId: "room-1",
    classRoomName: "Lab Alpha (Innovation Hub)",
    scheduleDays: ["Monday", "Wednesday", "Friday"],
    scheduleTime: "9:00 AM - 1:00 PM",
    totalStudents: 18,
    startDate: "2026-08-01",
    endDate: "2027-01-30",
    active: true
  },
  {
    id: "cls-2",
    code: "CLS-CERT-DES-26B",
    title: "Graphics & UI/UX Design Certificate (Weekend Cohort)",
    programType: "certificate",
    programId: "prog-cert-3m",
    academicSession: "2026/2027",
    instructorId: "usr-inst-2",
    instructorName: "Mary A. Ibrahim",
    classRoomId: "room-2",
    classRoomName: "Lab Beta (Design Studio)",
    scheduleDays: ["Saturday"],
    scheduleTime: "9:00 AM - 3:00 PM",
    totalStudents: 14,
    startDate: "2026-08-15",
    endDate: "2026-11-15",
    active: true
  },
  {
    id: "cls-3",
    code: "CLS-CERT-ICT-26C",
    title: "ICT Fundamentals & Office Productivity (Morning)",
    programType: "certificate",
    programId: "prog-cert-3m",
    academicSession: "2026/2027",
    instructorId: "usr-inst-1",
    instructorName: "Samuel K. Olatunji",
    classRoomId: "room-1",
    classRoomName: "Lab Alpha (Innovation Hub)",
    scheduleDays: ["Tuesday", "Thursday"],
    scheduleTime: "10:00 AM - 1:00 PM",
    totalStudents: 12,
    startDate: "2026-09-01",
    endDate: "2026-12-01",
    active: true
  }
];

export const initialStudents: Student[] = [
  {
    id: "stu-1",
    studentNumber: "AITI/STU/2026/000001",
    admissionNumber: "AITI/ADM/2026/000001",
    userId: "usr-stu-1",
    fullName: "Oluwaseun David Ajayi",
    email: "oluwaseun.student@gmail.com",
    phone: "08145678901",
    whatsapp: "08145678901",
    dateOfBirth: "2003-05-14",
    gender: "male",
    residentialAddress: "14 Pipeline Road, Tanke, Ilorin, Kwara State",
    passportPhotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    programTitle: "6-Month Diploma Program (Software & Web Engineering)",
    programType: "diploma",
    academicSession: "2026/2027",
    classId: "cls-1",
    className: "Software Engineering Diploma (Alpha Cohort)",
    enrollmentDate: "2026-08-01",
    expectedGraduationDate: "2027-01-30",
    status: "active",
    totalTuition: 120000,
    amountPaid: 120000,
    outstandingBalance: 0,
    attendancePercentage: 94,
    qrCodeUrl: ""
  },
  {
    id: "stu-2",
    studentNumber: "AITI/STU/2026/000002",
    admissionNumber: "AITI/ADM/2026/000002",
    userId: "usr-stu-2",
    fullName: "Fatima Zainab Umar",
    email: "fatima.umar@gmail.com",
    phone: "08081234567",
    whatsapp: "08081234567",
    dateOfBirth: "2004-11-20",
    gender: "female",
    residentialAddress: "Block 4, University Road, Fate, Ilorin",
    passportPhotoUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400",
    programTitle: "3-Month Certificate Program (UI/UX & Graphics Design)",
    programType: "certificate",
    academicSession: "2026/2027",
    classId: "cls-2",
    className: "Graphics & UI/UX Design Certificate (Weekend Cohort)",
    enrollmentDate: "2026-08-15",
    expectedGraduationDate: "2026-11-15",
    status: "active",
    totalTuition: 65000,
    amountPaid: 45000,
    outstandingBalance: 20000,
    attendancePercentage: 88,
    qrCodeUrl: ""
  },
  {
    id: "stu-3",
    studentNumber: "AITI/STU/2026/000003",
    admissionNumber: "AITI/ADM/2026/000003",
    userId: "usr-stu-3",
    fullName: "Emmanuel Chukwuemeka Okoye",
    email: "emmanuel.okoye@gmail.com",
    phone: "09071112233",
    whatsapp: "09071112233",
    dateOfBirth: "2002-03-09",
    gender: "male",
    residentialAddress: "8 Tipper Garage, Tanke Buka, Ilorin",
    passportPhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    programTitle: "6-Month Diploma Program (Data & Artificial Intelligence)",
    programType: "diploma",
    academicSession: "2026/2027",
    classId: "cls-1",
    className: "Software Engineering Diploma (Alpha Cohort)",
    enrollmentDate: "2026-08-01",
    expectedGraduationDate: "2027-01-30",
    status: "active",
    totalTuition: 120000,
    amountPaid: 70000,
    outstandingBalance: 50000,
    attendancePercentage: 91,
    qrCodeUrl: ""
  }
];

export const initialApplications: Application[] = [
  {
    id: "app-1",
    applicationId: "AITI/2026/000001",
    firstName: "Oluwaseun",
    middleName: "David",
    lastName: "Ajayi",
    dateOfBirth: "2003-05-14",
    gender: "male",
    nationality: "Nigerian",
    stateOfOrigin: "Kwara State",
    lga: "Ilorin South",
    residentialAddress: "14 Pipeline Road, Tanke, Ilorin, Kwara State",
    phone: "08145678901",
    whatsapp: "08145678901",
    email: "oluwaseun.student@gmail.com",
    passportPhotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    highestQualification: "B.Sc Computer Science (In Progress)",
    institution: "University of Ilorin",
    graduationYear: "2025",
    courseStudied: "Computer Science",
    previousIctExperience: "Basic HTML & Python knowledge",
    currentOccupation: "Student",
    programId: "prog-dip-6m",
    programTitle: "6-Month Diploma Program",
    programType: "diploma",
    intake: "August 2026 Cohort",
    studyMode: "Weekday Regular",
    preferredSchedule: "Mon, Wed & Fri (9:00 AM - 1:00 PM)",
    nextOfKinName: "Chief E. B. Ajayi",
    nextOfKinRelationship: "Father",
    nextOfKinPhone: "08051239876",
    nextOfKinEmail: "ajayi.parent@gmail.com",
    nextOfKinAddress: "14 Pipeline Road, Tanke, Ilorin",
    documents: [
      { id: "doc-1", type: "passport", title: "Passport Photograph", fileName: "passport.jpg", fileSize: "240 KB", fileUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400", uploadedAt: "2026-07-15T10:00:00Z", verified: true },
      { id: "doc-2", type: "id_card", title: "National ID / NIN Slip", fileName: "nin_slip.pdf", fileSize: "1.2 MB", fileUrl: "#", uploadedAt: "2026-07-15T10:05:00Z", verified: true }
    ],
    status: "enrolled",
    paymentStatus: "paid",
    paymentReference: "AITI_PAY_2026_001",
    paymentAmount: 5000,
    paidAt: "2026-07-15T10:15:00Z",
    submittedAt: "2026-07-15T10:20:00Z",
    reviewedAt: "2026-07-16T14:00:00Z",
    reviewNotes: "Strong academic background and prerequisite math skills. Approved for Diploma cohort.",
    createdAt: "2026-07-15T09:30:00Z",
    updatedAt: "2026-07-16T14:00:00Z"
  },
  {
    id: "app-2",
    applicationId: "AITI/2026/000002",
    firstName: "Fatima",
    middleName: "Zainab",
    lastName: "Umar",
    dateOfBirth: "2004-11-20",
    gender: "female",
    nationality: "Nigerian",
    stateOfOrigin: "Kogi State",
    lga: "Okene",
    residentialAddress: "Block 4, University Road, Fate, Ilorin",
    phone: "08081234567",
    whatsapp: "08081234567",
    email: "fatima.umar@gmail.com",
    passportPhotoUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400",
    highestQualification: "SSCE / WAEC",
    institution: "Federal Government College, Ilorin",
    graduationYear: "2023",
    previousIctExperience: "Beginner level with keen interest in visual design",
    currentOccupation: "Applicant / Pre-Degree",
    programId: "prog-cert-3m",
    programTitle: "3-Month Certificate Program",
    programType: "certificate",
    intake: "August 2026 Cohort",
    studyMode: "Weekend Intensive",
    preferredSchedule: "Saturdays (9:00 AM - 3:00 PM)",
    nextOfKinName: "Dr. A. S. Umar",
    nextOfKinRelationship: "Guardian",
    nextOfKinPhone: "08034567890",
    nextOfKinAddress: "Block 4, Fate Road, Ilorin",
    documents: [
      { id: "doc-3", type: "passport", title: "Passport Photo", fileName: "fatima_passport.jpg", fileSize: "310 KB", fileUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400", uploadedAt: "2026-07-20T11:00:00Z", verified: true }
    ],
    status: "enrolled",
    paymentStatus: "paid",
    paymentReference: "AITI_PAY_2026_002",
    paymentAmount: 5000,
    paidAt: "2026-07-20T11:10:00Z",
    submittedAt: "2026-07-20T11:15:00Z",
    reviewedAt: "2026-07-21T09:00:00Z",
    reviewNotes: "Approved for UI/UX & Graphics Design Certificate.",
    createdAt: "2026-07-20T10:45:00Z",
    updatedAt: "2026-07-21T09:00:00Z"
  },
  {
    id: "app-3",
    applicationId: "AITI/2026/000003",
    firstName: "Ibrahim",
    middleName: "Korede",
    lastName: "Lawal",
    dateOfBirth: "2001-08-12",
    gender: "male",
    nationality: "Nigerian",
    stateOfOrigin: "Kwara State",
    lga: "Ilorin West",
    residentialAddress: "Post Office Area, Muritala Way, Ilorin",
    phone: "08129998877",
    whatsapp: "08129998877",
    email: "korede.lawal@yahoo.com",
    passportPhotoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    highestQualification: "HND Electrical Engineering",
    institution: "Kwara State Polytechnic, Ilorin",
    graduationYear: "2024",
    previousIctExperience: "Hardware troubleshooting & basic networking",
    currentOccupation: "NYSC Corp Member",
    programId: "prog-dip-6m",
    programTitle: "6-Month Diploma Program",
    programType: "diploma",
    intake: "2026/2027 Session",
    studyMode: "Weekday Regular",
    preferredSchedule: "Mon, Wed & Fri (9:00 AM - 1:00 PM)",
    nextOfKinName: "Mrs. R. M. Lawal",
    nextOfKinRelationship: "Mother",
    nextOfKinPhone: "08031119988",
    nextOfKinAddress: "Post Office Area, Ilorin",
    documents: [
      { id: "doc-4", type: "passport", title: "Passport Photo", fileName: "passport_lawal.jpg", fileSize: "195 KB", fileUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400", uploadedAt: "2026-08-20T14:20:00Z", verified: true }
    ],
    status: "submitted",
    paymentStatus: "paid",
    paymentReference: "AITI_PAY_2026_003",
    paymentAmount: 5000,
    paidAt: "2026-08-20T14:25:00Z",
    submittedAt: "2026-08-20T14:30:00Z",
    createdAt: "2026-08-20T14:00:00Z",
    updatedAt: "2026-08-20T14:30:00Z"
  },
  {
    id: "app-4",
    applicationId: "AITI/2026/000004",
    firstName: "Blessing",
    middleName: "Chidinma",
    lastName: "Eze",
    dateOfBirth: "2000-02-18",
    gender: "female",
    nationality: "Nigerian",
    stateOfOrigin: "Enugu State",
    lga: "Nsukka",
    residentialAddress: "Basin Road, Ilorin, Kwara State",
    phone: "07065554433",
    whatsapp: "07065554433",
    email: "blessing.eze@gmail.com",
    highestQualification: "B.A. Mass Communication",
    institution: "Kwara State University, Malete",
    graduationYear: "2023",
    previousIctExperience: "Social media marketing & content creation",
    currentOccupation: "Digital Marketer",
    programId: "prog-cert-3m",
    programTitle: "3-Month Certificate Program",
    programType: "certificate",
    intake: "2026/2027 Session",
    studyMode: "Evening Executive",
    preferredSchedule: "Evening (5:00 PM - 7:30 PM)",
    nextOfKinName: "Mr. P. N. Eze",
    nextOfKinRelationship: "Brother",
    nextOfKinPhone: "08027778899",
    nextOfKinAddress: "Basin Road, Ilorin",
    documents: [],
    status: "under_review",
    paymentStatus: "paid",
    paymentReference: "AITI_PAY_2026_004",
    paymentAmount: 5000,
    paidAt: "2026-08-22T09:10:00Z",
    submittedAt: "2026-08-22T09:20:00Z",
    createdAt: "2026-08-22T08:50:00Z",
    updatedAt: "2026-08-22T09:20:00Z"
  }
];

export const initialAdmissions: AdmissionRecord[] = [
  {
    id: "adm-1",
    admissionNumber: "AITI/ADM/2026/000001",
    applicationId: "app-1",
    applicationRef: "AITI/2026/000001",
    studentName: "Oluwaseun David Ajayi",
    studentEmail: "oluwaseun.student@gmail.com",
    studentPhone: "08145678901",
    programTitle: "6-Month Diploma Program in Software & Web Development",
    programType: "diploma",
    duration: "6 Months",
    academicSession: "2026/2027",
    commencementDate: "2026-08-01",
    orientationDate: "2026-07-28",
    conditions: [
      "Payment of prescribed tuition and laboratory fee prior to class resumption.",
      "Strict compliance with AITI code of conduct and safety regulations in technical laboratories.",
      "Maintenance of minimum 80% attendance rate throughout practical class sessions."
    ],
    tuitionFee: 120000,
    acceptanceFee: 10000,
    status: "enrolled",
    offeredAt: "2026-07-16T14:30:00Z",
    acceptedAt: "2026-07-18T10:00:00Z",
    assignedClassId: "cls-1",
    assignedStudentId: "AITI/STU/2026/000001",
    qrVerificationUrl: "/verify?type=admission&code=AITI/ADM/2026/000001"
  },
  {
    id: "adm-2",
    admissionNumber: "AITI/ADM/2026/000002",
    applicationId: "app-2",
    applicationRef: "AITI/2026/000002",
    studentName: "Fatima Zainab Umar",
    studentEmail: "fatima.umar@gmail.com",
    studentPhone: "08081234567",
    programTitle: "3-Month Certificate Program in UI/UX & Graphics Design",
    programType: "certificate",
    duration: "3 Months",
    academicSession: "2026/2027",
    commencementDate: "2026-08-15",
    orientationDate: "2026-08-10",
    conditions: [
      "Payment of tuition fee or approved installment schedule.",
      "Participation in all laboratory design reviews and capstone critiques."
    ],
    tuitionFee: 65000,
    acceptanceFee: 10000,
    status: "enrolled",
    offeredAt: "2026-07-21T09:30:00Z",
    acceptedAt: "2026-07-22T11:00:00Z",
    assignedClassId: "cls-2",
    assignedStudentId: "AITI/STU/2026/000002",
    qrVerificationUrl: "/verify?type=admission&code=AITI/ADM/2026/000002"
  }
];

export const initialTimetable: TimetableEntry[] = [
  { id: "tt-1", classId: "cls-1", className: "Software Engineering Diploma", courseCode: "DEV-201", courseTitle: "Front-End Web Development (React & JavaScript)", instructorId: "usr-inst-1", instructorName: "Samuel K. Olatunji", roomName: "Lab Alpha (Innovation Hub)", dayOfWeek: "Monday", startTime: "09:00", endTime: "12:00" },
  { id: "tt-2", classId: "cls-1", className: "Software Engineering Diploma", courseCode: "DEV-202", courseTitle: "Back-End Architecture & REST APIs", instructorId: "usr-inst-1", instructorName: "Samuel K. Olatunji", roomName: "Lab Alpha (Innovation Hub)", dayOfWeek: "Wednesday", startTime: "09:00", endTime: "12:00" },
  { id: "tt-3", classId: "cls-1", className: "Software Engineering Diploma", courseCode: "DEV-203", courseTitle: "Full-Stack Project Lab", instructorId: "usr-inst-1", instructorName: "Samuel K. Olatunji", roomName: "Lab Alpha (Innovation Hub)", dayOfWeek: "Friday", startTime: "09:00", endTime: "13:00" },
  { id: "tt-4", classId: "cls-2", className: "Graphics & UI/UX Design Certificate", courseCode: "DES-402", courseTitle: "UI/UX Prototyping in Figma", instructorId: "usr-inst-2", instructorName: "Mary A. Ibrahim", roomName: "Lab Beta (Design Studio)", dayOfWeek: "Saturday", startTime: "09:00", endTime: "12:30" },
  { id: "tt-5", classId: "cls-2", className: "Graphics & UI/UX Design Certificate", courseCode: "DES-401", courseTitle: "Brand Graphics & Typography", instructorId: "usr-inst-2", instructorName: "Mary A. Ibrahim", roomName: "Lab Beta (Design Studio)", dayOfWeek: "Saturday", startTime: "13:00", endTime: "15:30" }
];

export const initialAttendance: AttendanceRecord[] = [
  { id: "att-1", classId: "cls-1", studentId: "stu-1", studentName: "Oluwaseun David Ajayi", studentNumber: "AITI/STU/2026/000001", date: "2026-08-25", status: "present", recordedBy: "Samuel K. Olatunji", recordedAt: "2026-08-25T09:15:00Z" },
  { id: "att-2", classId: "cls-1", studentId: "stu-3", studentName: "Emmanuel Chukwuemeka Okoye", studentNumber: "AITI/STU/2026/000003", date: "2026-08-25", status: "present", recordedBy: "Samuel K. Olatunji", recordedAt: "2026-08-25T09:15:00Z" },
  { id: "att-3", classId: "cls-1", studentId: "stu-1", studentName: "Oluwaseun David Ajayi", studentNumber: "AITI/STU/2026/000001", date: "2026-08-27", status: "present", recordedBy: "Samuel K. Olatunji", recordedAt: "2026-08-27T09:10:00Z" },
  { id: "att-4", classId: "cls-1", studentId: "stu-3", studentName: "Emmanuel Chukwuemeka Okoye", studentNumber: "AITI/STU/2026/000003", date: "2026-08-27", status: "late", remarks: "Arrived 25 mins late due to transport", recordedBy: "Samuel K. Olatunji", recordedAt: "2026-08-27T09:35:00Z" },
  { id: "att-5", classId: "cls-2", studentId: "stu-2", studentName: "Fatima Zainab Umar", studentNumber: "AITI/STU/2026/000002", date: "2026-08-23", status: "present", recordedBy: "Mary A. Ibrahim", recordedAt: "2026-08-23T09:05:00Z" }
];

export const initialAssignments: Assignment[] = [
  {
    id: "asg-1",
    classId: "cls-1",
    className: "Software Engineering Diploma",
    courseCode: "DEV-201",
    courseTitle: "Front-End Web Development",
    instructorId: "usr-inst-1",
    instructorName: "Samuel K. Olatunji",
    title: "Responsive E-Commerce Product Showcase & Cart UI",
    description: "Develop a mobile-first responsive 3-page web layout utilizing semantic HTML5, Flexbox/Grid, and modern JavaScript state management.",
    dueDate: "2026-09-05T23:59:00Z",
    maxScore: 20,
    submissionsCount: 1,
    createdAt: "2026-08-20T10:00:00Z"
  },
  {
    id: "asg-2",
    classId: "cls-2",
    className: "Graphics & UI/UX Design Certificate",
    courseCode: "DES-402",
    courseTitle: "UI/UX Prototyping in Figma",
    instructorId: "usr-inst-2",
    instructorName: "Mary A. Ibrahim",
    title: "Healthcare Mobile App Onboarding & Dashboard Prototype",
    description: "Design an empathetic 5-screen interactive mobile application flow in Figma adhering to WCAG 2.1 color contrast standards and 8pt grid typography.",
    dueDate: "2026-09-08T23:59:00Z",
    maxScore: 20,
    submissionsCount: 1,
    createdAt: "2026-08-24T12:00:00Z"
  }
];

export const initialSubmissions: AssignmentSubmission[] = [
  {
    id: "sub-1",
    assignmentId: "asg-1",
    assignmentTitle: "Responsive E-Commerce Product Showcase & Cart UI",
    studentId: "stu-1",
    studentName: "Oluwaseun David Ajayi",
    studentNumber: "AITI/STU/2026/000001",
    submissionText: "Repository URL: https://github.com/oluwaseun-dev/aiti-ecommerce-project\nLive Demo: https://oluwaseun-aiti-demo.netlify.app",
    attachmentName: "project_documentation.pdf",
    submittedAt: "2026-08-26T15:30:00Z",
    score: 19,
    maxScore: 20,
    graded: true,
    feedback: "Outstanding component structuring, clean CSS variables, and flawless responsive layout across iPhone and desktop viewport sizes.",
    gradedBy: "Samuel K. Olatunji",
    gradedAt: "2026-08-27T11:00:00Z"
  }
];

export const initialResults: AssessmentResult[] = [
  {
    id: "res-1",
    studentId: "stu-1",
    studentName: "Oluwaseun David Ajayi",
    studentNumber: "AITI/STU/2026/000001",
    classId: "cls-1",
    courseId: "c-5",
    courseCode: "DEV-201",
    courseTitle: "Front-End Web Development (HTML5, CSS3, React)",
    academicSession: "2026/2027",
    assignmentScore: 19,
    testScore: 18,
    practicalScore: 28,
    examScore: 27,
    totalScore: 92,
    grade: "A",
    status: "passed",
    remarks: "Distinction — Demonstrates exceptional practical programming execution and UI fidelity.",
    published: true,
    recordedAt: "2026-08-27T14:00:00Z"
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "AITI/INV/2026/000001",
    studentId: "stu-1",
    studentName: "Oluwaseun David Ajayi",
    studentEmail: "oluwaseun.student@gmail.com",
    studentNumber: "AITI/STU/2026/000001",
    title: "6-Month Diploma Program Tuition & Laboratory Fee",
    description: "Official academic tuition, workstation access, practical cloud lab credits, and curriculum handbook.",
    amount: 120000,
    amountPaid: 120000,
    balance: 0,
    dueDate: "2026-08-01",
    status: "paid",
    items: [
      { description: "6-Month Diploma Tuition", amount: 100000 },
      { description: "Technical Lab Access & Power Station", amount: 15000 },
      { description: "Student ID & Course Materials", amount: 5000 }
    ],
    createdAt: "2026-07-16T15:00:00Z"
  },
  {
    id: "inv-2",
    invoiceNumber: "AITI/INV/2026/000002",
    studentId: "stu-2",
    studentName: "Fatima Zainab Umar",
    studentEmail: "fatima.umar@gmail.com",
    studentNumber: "AITI/STU/2026/000002",
    title: "3-Month Certificate Program Tuition (UI/UX Design)",
    description: "Design studio laboratory access, software licenses guidance, and certification fee.",
    amount: 65000,
    amountPaid: 45000,
    balance: 20000,
    dueDate: "2026-09-15",
    status: "partially_paid",
    items: [
      { description: "3-Month Certificate Tuition", amount: 55000 },
      { description: "Lab & Studio Facilities", amount: 10000 }
    ],
    createdAt: "2026-07-21T10:00:00Z"
  }
];

export const initialPayments: PaymentTransaction[] = [
  {
    id: "pay-1",
    receiptNumber: "AITI/REC/2026/000001",
    invoiceId: "inv-1",
    studentId: "stu-1",
    studentName: "Oluwaseun David Ajayi",
    studentEmail: "oluwaseun.student@gmail.com",
    paymentType: "tuition",
    amount: 120000,
    gateway: "paystack",
    gatewayReference: "pstk_aiti_9984729182",
    status: "success",
    channel: "Mastercard / Debit Card",
    paidAt: "2026-07-18T10:30:00Z",
    verifiedBy: "AITI Automated Gateway Service",
    notes: "Full Tuition Payment for 6-Month Diploma Program",
    qrVerificationUrl: "/verify?type=receipt&code=AITI/REC/2026/000001"
  },
  {
    id: "pay-2",
    receiptNumber: "AITI/REC/2026/000002",
    invoiceId: "inv-2",
    studentId: "stu-2",
    studentName: "Fatima Zainab Umar",
    studentEmail: "fatima.umar@gmail.com",
    paymentType: "tuition",
    amount: 45000,
    gateway: "flutterwave",
    gatewayReference: "flw_aiti_3829104829",
    status: "success",
    channel: "Bank Transfer",
    paidAt: "2026-07-22T11:45:00Z",
    verifiedBy: "AITI Automated Gateway Service",
    notes: "First Installment Payment for 3-Month Certificate Program",
    qrVerificationUrl: "/verify?type=receipt&code=AITI/REC/2026/000002"
  }
];

export const initialCertificates: Certificate[] = [
  {
    id: "cert-1",
    certificateNumber: "AITI/CERT/2026/000001",
    studentId: "stu-demo-grad",
    studentName: "Victor Kayode Adebayo",
    studentNumber: "AITI/STU/2026/000099",
    programTitle: "6-Month Diploma in Full-Stack Software Engineering",
    programType: "diploma",
    duration: "6 Months",
    specializationArea: "Software Development & Cloud Engineering",
    completionDate: "2026-07-30",
    gradeAchieved: "Distinction (Grade A)",
    signatoryName: "Engr. A. F. Taiwo",
    signatoryTitle: "Director of Institute / Head of Academics",
    issuedAt: "2026-08-05T10:00:00Z",
    status: "issued",
    qrVerificationUrl: "/verify?type=certificate&code=AITI/CERT/2026/000001"
  }
];

export const initialAnnouncements: Announcement[] = [
  {
    id: "ann-1",
    title: "Admissions for 2026/2027 Academic Session are Officially Open!",
    content: "AITI invites prospective students, graduates, NYSC corp members and technology enthusiasts to apply for our 3-Month Certificate and 6-Month Diploma Programs. Applications can be completed online via our portal.",
    audience: "all",
    priority: "high",
    publishDate: "2026-08-01",
    active: true,
    authorName: "Admissions Directorate",
    createdAt: "2026-08-01T08:00:00Z"
  },
  {
    id: "ann-2",
    title: "Upcoming Tech Masterclass: Emerging AI Workflows & Modern Web Tech",
    content: "All active students and instructors are invited to the upcoming technical hands-on workshop taking place in Lab Alpha this Friday. Attendance is highly encouraged.",
    audience: "students",
    priority: "medium",
    publishDate: "2026-08-25",
    active: true,
    authorName: "Samuel K. Olatunji (Instructor)",
    createdAt: "2026-08-25T09:00:00Z"
  }
];

export const initialNewsEvents: NewsEventItem[] = [
  {
    id: "ne-1",
    title: "AITI Launches 2026 Technology Training Cohort at Tanke, Ilorin",
    slug: "aiti-launches-2026-technology-training-cohort",
    type: "admission",
    summary: "Empowering Kwara youth and professionals with hands-on ICT education, software development, data science, and graphic engineering.",
    content: "AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE (AITI), the educational arm of AFTATECH.IT CONSULT, has officially commenced enrollment for the 2026/2027 academic session at its Tanke, Ilorin campus. With world-class computer labs and dedicated mentorship, students will build real-world project portfolios.",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
    date: "2026-08-10",
    location: "2 Babanla Street, Graceland Junction, Tanke, Ilorin",
    published: true,
    featured: true,
    createdAt: "2026-08-10T10:00:00Z"
  },
  {
    id: "ne-2",
    title: "Weekend Intensive Bootcamp on UI/UX Design & Product Prototyping",
    slug: "weekend-intensive-bootcamp-ui-ux-figma",
    type: "bootcamp",
    summary: "A practical 2-day immersive workshop mastering Figma design systems, wireframing, and interactive prototyping for mobile applications.",
    content: "Join experienced product designers at AITI as we break down human-computer interaction, typography scales, accessibility guidelines, and component prototyping. Registration is open to both beginner and intermediate designers.",
    imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800",
    date: "2026-09-12",
    location: "Lab Beta (Design Studio), AITI Campus, Ilorin",
    published: true,
    featured: false,
    createdAt: "2026-08-18T14:00:00Z"
  }
];

export const initialGallery: GalleryItem[] = [
  { id: "gal-1", title: "Modern Software Lab & Workstations", category: "Labs", imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800", description: "Students working on live coding and web development projects.", date: "2026-08-15" },
  { id: "gal-2", title: "Interactive UI/UX Design Critique Session", category: "Classes", imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800", description: "Design students presenting mobile app prototypes to instructors.", date: "2026-08-20" },
  { id: "gal-3", title: "Hardware Diagnostic & Networking Workshop", category: "Workshops", imageUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=800", description: "Hands-on motherboards repair, component testing, and LAN cabling.", date: "2026-08-22" },
  { id: "gal-4", title: "Graduation & Certificate Presentation Ceremony", category: "Graduation", imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800", description: "Graduating tech students receiving verified AITI Diplomas.", date: "2026-07-30" }
];

export const initialLeads: CRMLead[] = [
  { id: "lead-1", fullName: "Adebayo Sikiru", email: "adebayo.s@gmail.com", phone: "08034567890", whatsapp: "08034567890", programInterest: "Full-Stack Web Development (6-Month Diploma)", source: "website", status: "interested", notes: "Inquired about weekend class availability and payment installments.", createdAt: "2026-08-26T11:00:00Z" },
  { id: "lead-2", fullName: "Chiamaka Nnadi", email: "chiamaka.n@yahoo.com", phone: "08167890123", whatsapp: "08167890123", programInterest: "Data Analysis & AI (3-Month Certificate)", source: "whatsapp", status: "application_started", notes: "Started application on portal; assisted with course selection.", createdAt: "2026-08-27T08:30:00Z" }
];

export const initialContacts: ContactMessage[] = [
  { id: "cnt-1", fullName: "Dr. Alabi Rasheed", email: "alabi.r@gmail.com", phone: "08023456789", subject: "Inquiry on Corporate Training for Staff", message: "Good day, I would like to know if AITI offers custom on-site ICT and Data Analytics training for our corporate team in Ilorin.", status: "new", createdAt: "2026-08-27T16:00:00Z" }
];

export const initialAuditLogs: AuditLog[] = [
  { id: "log-1", userId: "usr-admin-1", userName: "Engr. A. F. Taiwo", userRole: "super_admin", action: "INSTITUTE_INITIALIZED", entityType: "System", entityId: "aiti-system", details: "AITI institutional management database initialized with official 2026/2027 session configuration.", timestamp: "2026-08-01T08:00:00Z" },
  { id: "log-2", userId: "usr-adm-officer", userName: "Mrs. K. O. Balogun", userRole: "admissions_officer", action: "ADMISSION_OFFERED", entityType: "Application", entityId: "AITI/2026/000001", details: "Approved application and offered provisional admission for 6-Month Diploma Program.", timestamp: "2026-07-16T14:30:00Z" },
  { id: "log-3", userId: "usr-fin-officer", userName: "Mr. S. A. Adeleke", userRole: "finance_officer", action: "PAYMENT_VERIFIED", entityType: "Payment", entityId: "AITI/REC/2026/000001", details: "Verified full tuition payment receipt of NGN 120,000 via Paystack Gateway.", timestamp: "2026-07-18T10:30:00Z" }
];

export const initialTestimonials: Testimonial[] = [
  { id: "t-1", name: "David O. Alao", role: "Software Developer at TechVantage", program: "6-Month Diploma Program", quote: "AITI gave me the real-world project skills I needed. The hands-on practice in React and Node.js in Tanke prepared me directly for my current developer role.", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200", rating: 5, featured: true },
  { id: "t-2", name: "Aisha Bello", role: "UI/UX Product Designer", program: "3-Month Certificate Program", quote: "The instructors at AITI are patient, knowledgeable, and always ready to help. Designing Figma projects with immediate feedback transformed my career.", avatarUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=200", rating: 5, featured: true },
  { id: "t-3", name: "Ibrahim K. Sanusi", role: "IT Support Engineer", program: "Hardware & Networking Certificate", quote: "Practical learning is taken seriously here. Crimp cables, disassemble CPUs, and configure real Cisco routers. Highly recommended!", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200", rating: 5, featured: true }
];

export const initialFaqs: FaqItem[] = [
  { id: "faq-1", question: "What is AITI and where is the campus located?", answer: "AITI (AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE) is a premier technology training institute under AFTATECH.IT CONSULT. We are located at 2 Babanla Street, Graceland Junction, Tanke, Ilorin, Kwara State, Nigeria.", category: "Admissions", order: 1 },
  { id: "faq-2", question: "What programs are currently available at AITI?", answer: "We offer an intensive 3-Month Certificate Program and a comprehensive 6-Month Diploma Program across Web Development, Data Science, AI, UI/UX, Hardware & Networking, AutoCAD/Revit, and Cyber Defense.", category: "Programs", order: 2 },
  { id: "faq-3", question: "How do I apply for the 2026/2027 admission session?", answer: "Click 'APPLY NOW' on the portal, complete the 8-step application form, upload your passport photograph and credentials, pay the application fee securely, and track your application status.", category: "Admissions", order: 3 },
  { id: "faq-4", question: "Are installment payment options available for school fees?", answer: "Yes, AITI supports structured installment payment plans for both Certificate and Diploma programs. You can pay an initial deposit before class commencement and balance in agreed milestones.", category: "Fees & Payment", order: 4 },
  { id: "faq-5", question: "Do you offer weekend or evening executive classes?", answer: "Yes, we provide flexible weekday morning/afternoon schedules, Saturday weekend intensives, and evening executive classes tailored for working professionals and university students.", category: "Classes & Schedules", order: 5 },
  { id: "faq-6", question: "Are AITI certificates verifiable online?", answer: "Yes! Every certificate and admission letter issued by AITI contains a unique reference number and a secure QR code verifiable instantly on our public Verification Portal.", category: "Certificates", order: 6 }
];

export const initialShortCourseCategories: ShortCourseCategory[] = comprehensiveCategories;

export const initialShortCourses: ShortCourse[] = comprehensiveShortCourses;

export const initialCorporateRequests: CorporateTrainingRequest[] = [
  {
    id: "corp-1",
    requestNumber: "AITI/CORP/2026/0001",
    requestCode: "AITI/CORP/2026/0001",
    organizationName: "Kwara State Ministry of Finance",
    companyName: "Kwara State Ministry of Finance",
    organizationType: "Government Ministries",
    contactPerson: "Alhaji M. K. Sulu-Gambari",
    contactName: "Alhaji M. K. Sulu-Gambari",
    position: "Director of Accounts & Statistics",
    phone: "08034567890",
    whatsapp: "08034567890",
    email: "finance.statistics@kwara.gov.ng",
    organizationAddress: "State Secretariat Complex, Ahmadu Bello Way, Ilorin",
    numberOfStaff: 35,
    estimatedParticipants: 35,
    targetStaffGroup: "Finance staff",
    targetStaffGroups: ["Finance staff", "Government officers", "Administrative staff"],
    preferredTrainingTopic: "Data Analysis with Advanced Microsoft Excel & Power BI",
    trainingTopic: "Data Analysis with Advanced Microsoft Excel & Power BI",
    trainingNeeds: "State revenue tracking spreadsheets, monthly payroll audit verification, and executive budget dashboards.",
    selectedTopics: ["Advanced Excel for Government Officers", "Power BI & Data Visualization", "Data Management"],
    preferredDuration: "2 Weeks Intensive",
    duration: "2 Weeks",
    preferredTrainingDate: "2026-09-15",
    preferredDate: "2026-09-15",
    preferredTrainingLocation: "Ministry Conference Hall, State Secretariat, Ilorin",
    trainingLocation: "Ministry Conference Hall, State Secretariat, Ilorin",
    trainingMode: "On-site",
    additionalRequirements: "Hands-on training tailored to state revenue tracking spreadsheets, monthly payroll audit verification, and executive budget dashboards.",
    status: "PROPOSAL_SENT",
    adminNotes: "Official proposal and quotation AITI/QUO/2026/00001 delivered on 2026-08-20. Total quote: NGN 1,850,000 for 35 officers including printed training manuals and verified AITI executive certificates.",
    estimatedBudget: "NGN 1,850,000",
    assignedOfficer: "Mrs. K. O. Balogun",
    assignedCoordinator: "Engr. A. F. Taiwo",
    assignedInstructor: "Engr. A. F. Taiwo",
    quotationNumber: "AITI/QUO/2026/00001",
    quotationAmountGHS: 1850000,
    scheduledStartDate: "2026-09-15",
    scheduledEndDate: "2026-09-29",
    venueAddress: "Ministry Conference Hall, State Secretariat, Ilorin",
    participantsList: [
      { id: "cp-1", fullName: "Ibrahim O. Salihu", email: "i.salihu@kwara.gov.ng", phone: "08031122331", department: "Payroll & Budget", attendanceRate: 95, completed: true, certificateNumber: "AITI/CERT/STC/2026/00001" },
      { id: "cp-2", fullName: "Fatima A. Mohammed", email: "f.mohammed@kwara.gov.ng", phone: "08031122332", department: "Revenue Audit", attendanceRate: 100, completed: true, certificateNumber: "AITI/CERT/STC/2026/00002" },
      { id: "cp-3", fullName: "Yusuf K. Adeleke", email: "y.adeleke@kwara.gov.ng", phone: "08031122333", department: "Treasury Operations", attendanceRate: 90, completed: false }
    ],
    submittedAt: "2026-08-18T10:15:00Z",
    createdAt: "2026-08-18T10:15:00Z",
    updatedAt: "2026-08-20T14:00:00Z"
  },
  {
    id: "corp-2",
    requestNumber: "AITI/CORP/2026/0002",
    requestCode: "AITI/CORP/2026/0002",
    organizationName: "Apex Zenith Microfinance Bank Ltd",
    companyName: "Apex Zenith Microfinance Bank Ltd",
    organizationType: "Banks & Financial Institutions",
    contactPerson: "Mrs. Folashade Adeleke",
    contactName: "Mrs. Folashade Adeleke",
    position: "Head of Human Resources & Operations",
    phone: "08023456781",
    whatsapp: "08023456781",
    email: "hr@apexzenithmfb.ng",
    organizationAddress: "14 Unity Road, Ilorin, Kwara State",
    numberOfStaff: 20,
    estimatedParticipants: 20,
    targetStaffGroup: "Management",
    targetStaffGroups: ["Management", "Customer service teams", "IT staff"],
    preferredTrainingTopic: "Cybersecurity Awareness & Digital Workplace Productivity",
    trainingTopic: "Cybersecurity Awareness & Digital Workplace Productivity",
    trainingNeeds: "Focus on preventing financial phishing, securing customer loan databases, and zero-trust authentication protocols.",
    selectedTopics: ["Cybersecurity Awareness", "Digital Workplace Productivity", "Cloud & Digital Collaboration"],
    preferredDuration: "3-Day Executive Workshop",
    duration: "3 Days",
    preferredTrainingDate: "2026-09-22",
    preferredDate: "2026-09-22",
    preferredTrainingLocation: "AITI Executive Lab Alpha, Tanke, Ilorin",
    trainingLocation: "AITI Executive Lab Alpha, Tanke, Ilorin",
    trainingMode: "At AITI",
    additionalRequirements: "Focus on preventing financial phishing, securing customer loan databases, and zero-trust authentication protocols.",
    status: "APPROVED",
    adminNotes: "Client approved curriculum. Invoiced AITI/INV/CORP/2026/00001. Deposit of 50% confirmed. Scheduled for Lab Alpha.",
    estimatedBudget: "NGN 750,000",
    assignedOfficer: "Mrs. K. O. Balogun",
    assignedCoordinator: "Engr. A. F. Taiwo",
    assignedInstructor: "Engr. S. A. Abdulkareem",
    quotationNumber: "AITI/QUO/2026/00002",
    invoiceNumber: "AITI/INV/CORP/2026/00001",
    quotationAmountGHS: 750000,
    scheduledStartDate: "2026-09-22",
    scheduledEndDate: "2026-09-24",
    venueAddress: "AITI Executive Lab Alpha, 2 Babanla Street, Graceland Junction, Tanke, Ilorin",
    participantsList: [
      { id: "cp-4", fullName: "Adeola F. Davies", email: "a.davies@apexzenithmfb.ng", department: "Operations", attendanceRate: 100, completed: true, certificateNumber: "AITI/CERT/STC/2026/00003" },
      { id: "cp-5", fullName: "Samuel T. Ajayi", email: "s.ajayi@apexzenithmfb.ng", department: "Credit & Risk", attendanceRate: 100, completed: true, certificateNumber: "AITI/CERT/STC/2026/00004" }
    ],
    submittedAt: "2026-08-22T09:30:00Z",
    createdAt: "2026-08-22T09:30:00Z",
    updatedAt: "2026-08-25T11:20:00Z"
  },
  {
    id: "corp-3",
    requestNumber: "AITI/CORP/2026/0003",
    requestCode: "AITI/CORP/2026/0003",
    organizationName: "Oluwole & Associates Engineering Consult",
    companyName: "Oluwole & Associates Engineering Consult",
    organizationType: "Private Companies",
    contactPerson: "Engr. T. J. Oluwole",
    contactName: "Engr. T. J. Oluwole",
    position: "Managing Partner",
    phone: "08167890123",
    whatsapp: "08167890123",
    email: "contact@oluwoleconsult.com",
    organizationAddress: "Suite 4B, Harmony Plaza, Fate Road, Ilorin",
    numberOfStaff: 8,
    estimatedParticipants: 8,
    targetStaffGroup: "IT staff",
    targetStaffGroups: ["IT staff", "Existing staff"],
    preferredTrainingTopic: "Revit Fundamentals & AutoCAD 2D Drafting",
    trainingTopic: "Revit Fundamentals & AutoCAD 2D Drafting",
    trainingNeeds: "Transitioning 8 architectural and civil technicians from manual drafting to BIM Revit modeling.",
    selectedTopics: ["Computer-Aided Design (CAD) & Architectural Tech", "3D Modeling"],
    preferredDuration: "4 Weeks Bootcamp",
    duration: "4 Weeks",
    preferredTrainingDate: "2026-10-05",
    preferredDate: "2026-10-05",
    preferredTrainingLocation: "AITI CAD Studio, Ilorin",
    trainingLocation: "AITI CAD Studio, Ilorin",
    trainingMode: "At AITI",
    additionalRequirements: "Transitioning 8 architectural and civil technicians from manual drafting to BIM Revit modeling.",
    status: "NEW",
    adminNotes: "New online corporate inquiry received. Contact person needs phone follow-up on schedule options.",
    estimatedBudget: "NGN 600,000",
    assignedOfficer: "Mrs. K. O. Balogun",
    assignedCoordinator: "Mrs. K. O. Balogun",
    assignedInstructor: "Engr. A. F. Taiwo",
    submittedAt: "2026-08-28T16:45:00Z",
    createdAt: "2026-08-28T16:45:00Z",
    updatedAt: "2026-08-28T16:45:00Z"
  }
];

export const initialCorporateQuotations: CorporateQuotation[] = [
  {
    id: "quo-1",
    quotationNumber: "AITI/QUO/2026/00001",
    requestId: "corp-1",
    requestNumber: "AITI/CORP/2026/0001",
    organizationName: "Kwara State Ministry of Finance",
    contactPerson: "Alhaji M. K. Sulu-Gambari",
    contactPosition: "Director of Accounts & Statistics",
    contactEmail: "finance.statistics@kwara.gov.ng",
    contactPhone: "08034567890",
    trainingTitle: "Data Analysis with Advanced Microsoft Excel & Power BI",
    trainingObjectives: [
      "Master advanced formula modeling (XLOOKUP, INDEX/MATCH, Dynamic Arrays)",
      "Design interactive executive financial dashboards using Power BI Desktop",
      "Automate monthly payroll and ministry expenditure audit pipelines",
      "Ensure digital data integrity and spreadsheet security protocols"
    ],
    numberOfParticipants: 35,
    trainingDuration: "2 Weeks Intensive (40 Practical Lab Hours)",
    trainingVenue: "Ministry Conference Hall, State Secretariat, Ilorin",
    trainerName: "Engr. A. F. Taiwo",
    trainerTitle: "Executive Director & Lead ICT Consultant",
    trainingFee: 1750000,
    additionalCosts: [
      { description: "Printed Course Manuals & Lab Practice Data USBs (35 Copies)", amount: 150000 },
      { description: "AITI Holographic Verifiable Certificates of Completion", amount: 50000 }
    ],
    discount: 100000,
    totalAmount: 1850000,
    paymentTerms: "70% mobilization deposit prior to commencement; 30% balance upon delivery and certification.",
    validityPeriod: "30 Days from date of issuance",
    authorizedSignatoryName: "Engr. A. F. Taiwo",
    authorizedSignatoryTitle: "Director of Institute",
    status: "sent",
    issuedAt: "2026-08-20T10:00:00Z",
    validUntil: "2026-09-20T23:59:59Z"
  },
  {
    id: "quo-2",
    quotationNumber: "AITI/QUO/2026/00002",
    requestId: "corp-2",
    requestNumber: "AITI/CORP/2026/0002",
    organizationName: "Apex Zenith Microfinance Bank Ltd",
    contactPerson: "Mrs. Folashade Adeleke",
    contactPosition: "Head of Human Resources & Operations",
    contactEmail: "hr@apexzenithmfb.ng",
    contactPhone: "08023456781",
    trainingTitle: "Cybersecurity Awareness & Digital Workplace Productivity",
    trainingObjectives: [
      "Identify and neutralize spear-phishing and social engineering attacks",
      "Safeguard microfinance customer databases and transaction workflows",
      "Implement multi-factor authentication and clean desk security policies"
    ],
    numberOfParticipants: 20,
    trainingDuration: "3-Day Executive Workshop (18 Intensive Hours)",
    trainingVenue: "AITI Executive Lab Alpha, Tanke, Ilorin",
    trainerName: "Engr. S. A. Abdulkareem",
    trainerTitle: "Senior Cybersecurity Specialist",
    trainingFee: 700000,
    additionalCosts: [
      { description: "Executive Lab Utilization, High-Speed Fiber & Coffee Breaks", amount: 80000 }
    ],
    discount: 30000,
    totalAmount: 750000,
    paymentTerms: "100% advance payment prior to workshop commencement.",
    validityPeriod: "30 Days from date of issuance",
    authorizedSignatoryName: "Engr. A. F. Taiwo",
    authorizedSignatoryTitle: "Director of Institute",
    status: "accepted",
    issuedAt: "2026-08-23T11:00:00Z",
    validUntil: "2026-09-23T23:59:59Z"
  }
];

export const initialCorporateInvoices: CorporateInvoice[] = [
  {
    id: "cinv-1",
    invoiceNumber: "AITI/INV/CORP/2026/00001",
    quotationId: "quo-2",
    quotationNumber: "AITI/QUO/2026/00002",
    requestId: "corp-2",
    organizationName: "Apex Zenith Microfinance Bank Ltd",
    trainingTitle: "Cybersecurity Awareness & Digital Workplace Productivity",
    contactPerson: "Mrs. Folashade Adeleke",
    contactEmail: "hr@apexzenithmfb.ng",
    contactPhone: "08023456781",
    amount: 750000,
    taxAmount: 0,
    discountAmount: 30000,
    netAmount: 750000,
    amountPaid: 375000,
    balance: 375000,
    dueDate: "2026-09-20",
    paymentStatus: "Partially Paid",
    items: [
      { description: "Cybersecurity Awareness & Digital Productivity Workshop (20 Staff)", quantity: 20, unitPrice: 35000, total: 700000 },
      { description: "Executive Lab Alpha Facilities & Practice Workbook Pack", quantity: 1, unitPrice: 80000, total: 80000 }
    ],
    paymentTerms: "50% initial payment credited; 50% remaining due on first day of workshop.",
    issuedAt: "2026-08-25T14:00:00Z",
    paidAt: "2026-08-25T16:30:00Z",
    receiptNumber: "AITI/REC/2026/00008"
  }
];

export const initialShortCourseEnrollments: ShortCourseEnrollment[] = [
  {
    id: "sce-1",
    registrationId: "AITI/STC/2026/00025",
    enrollmentNumber: "AITI/STC/2026/00025",
    shortCourseId: "sc-3",
    courseId: "sc-3",
    courseTitle: "Advanced Microsoft Excel",
    courseCode: "AITI-SC-003",
    categoryName: "Business, Productivity & Office Applications",
    duration: "2 Weeks",
    fullName: "Babatunde S. Bello",
    email: "babatunde.bello@gmail.com",
    phone: "08031122334",
    whatsapp: "08031122334",
    occupation: "Accountant",
    organization: "First Prime Logistics",
    preferredSchedule: "Weekday Morning (9:00 AM - 12:00 PM)",
    trainingMode: "Physical",
    batchDate: "2026-09-14",
    preferredBatchDate: "2026-09-14",
    fee: 35000,
    feeGHS: 35000,
    paymentMethod: "Paystack Card / Transfer",
    paymentStatus: "paid",
    paymentReference: "AITI-PAY-STC-00025",
    amountPaid: 35000,
    paidAt: "2026-08-24T12:15:00Z",
    status: "active",
    attendanceRate: 92,
    attendanceLog: [
      { date: "2026-09-14", topic: "Formulas, XLOOKUP, Nested IFs", status: "present" },
      { date: "2026-09-16", topic: "Pivot Tables, Slicers & Timelines", status: "present" },
      { date: "2026-09-18", topic: "Power Query Data Cleansing", status: "present" },
      { date: "2026-09-21", topic: "Interactive Financial Dashboards", status: "present" }
    ],
    materials: [
      { id: "mat-1", title: "AITI Advanced Excel Master Workbook.xlsx", type: "lab_sheet", size: "3.2 MB", downloadUrl: "#" },
      { id: "mat-2", title: "Financial Modeling & Power Query Cheat Sheet.pdf", type: "pdf", size: "1.4 MB", downloadUrl: "#" },
      { id: "mat-3", title: "Class Lecture Slides & Formulas Reference.pdf", type: "slides", size: "5.8 MB", downloadUrl: "#" }
    ],
    assignments: [
      {
        id: "asg-sc-1",
        title: "CapStone Project: 3-Statement Dynamic Financial Dashboard",
        description: "Build an interactive automated financial performance dashboard with dynamic KPIs, monthly trends, and scenario toggle slicers.",
        dueDate: "2026-09-26",
        maxScore: 100,
        submitted: true,
        submissionText: "Submitted Google Drive link with complete workbook and dynamic formulas.",
        submissionLink: "https://drive.google.com/aiti-bello-capstone",
        submittedAt: "2026-09-25T18:00:00Z",
        score: 94,
        graded: true,
        feedback: "Outstanding work on the dynamic array formulas and clean executive formatting!"
      }
    ],
    announcements: [
      { id: "ann-sc-1", title: "Welcome to AITI Advanced Excel Batch!", date: "2026-09-13", message: "Classes hold in Lab Bravo from 9:00 AM prompt. Please bring your practice laptops with Microsoft Excel 2021/365 installed." },
      { id: "ann-sc-2", title: "Capstone Presentation & Certificate Issuance", date: "2026-09-24", message: "Capstone evaluation takes place Friday. Certificates of Completion will be generated immediately after presentation." }
    ],
    certificateIssued: true,
    certificateNumber: "AITI/CERT/STC/2026/00025",
    certificateDate: "2026-09-26",
    enrolledAt: "2026-08-24T12:00:00Z",
    createdAt: "2026-08-24T12:00:00Z"
  },
  {
    id: "sce-2",
    registrationId: "AITI/STC/2026/00026",
    enrollmentNumber: "AITI/STC/2026/00026",
    shortCourseId: "sc-7",
    courseId: "sc-7",
    courseTitle: "Generative AI & Productivity Tools",
    courseCode: "AITI-SC-007",
    categoryName: "Artificial Intelligence, Data & Emerging Tech",
    duration: "2 Weeks",
    fullName: "Amina Yusuf",
    email: "amina.yusuf@outlook.com",
    phone: "08149988776",
    whatsapp: "08149988776",
    occupation: "Digital Marketing Specialist",
    organization: "Novafield Media",
    preferredSchedule: "Weekday Evening (6:00 PM - 8:30 PM)",
    trainingMode: "Online",
    batchDate: "2026-09-14",
    preferredBatchDate: "2026-09-14",
    fee: 40000,
    feeGHS: 40000,
    paymentMethod: "Bank Transfer",
    paymentStatus: "paid",
    paymentReference: "AITI-PAY-STC-00026",
    amountPaid: 40000,
    paidAt: "2026-08-26T15:40:00Z",
    status: "active",
    attendanceRate: 100,
    attendanceLog: [
      { date: "2026-09-14", topic: "Prompt Engineering Foundations & LLM Architecture", status: "present" },
      { date: "2026-09-16", topic: "AI Image & Video Generation Pipelines", status: "present" },
      { date: "2026-09-18", topic: "Custom GPTs, Automation & API Workflows", status: "present" }
    ],
    materials: [
      { id: "mat-4", title: "Enterprise Prompt Engineering Playbook.pdf", type: "pdf", size: "4.1 MB", downloadUrl: "#" },
      { id: "mat-5", title: "AI Automation Starter Pack & Zapier Templates.zip", type: "code", size: "12.5 MB", downloadUrl: "#" }
    ],
    assignments: [
      {
        id: "asg-sc-2",
        title: "Automated Content Production Machine",
        description: "Configure an end-to-end multi-modal content workflow utilizing Gemini, Claude, and Canva AI plugins.",
        dueDate: "2026-09-25",
        maxScore: 100,
        submitted: true,
        submittedAt: "2026-09-24T20:10:00Z",
        score: 98,
        graded: true,
        feedback: "Exceptional prompt design and workflow structure!"
      }
    ],
    announcements: [
      { id: "ann-sc-3", title: "Live Zoom Link for Evening Session", date: "2026-09-14", message: "Join each evening at 6:00 PM via: https://meet.aiti.edu.ng/gen-ai-batch2" }
    ],
    certificateIssued: true,
    certificateNumber: "AITI/CERT/STC/2026/00026",
    certificateDate: "2026-09-26",
    enrolledAt: "2026-08-26T15:30:00Z",
    createdAt: "2026-08-26T15:30:00Z"
  }
];

export const initialQuoteRequests: QuoteRequest[] = [
  {
    id: "qr-2026-001",
    referenceNumber: "AITI/QT/2026/000001",
    createdAt: "2026-08-28T09:30:00Z",
    updatedAt: "2026-08-28T11:00:00Z",
    fullName: "Babatunde Adeleke",
    email: "babatunde.adeleke@gmail.com",
    phone: "08034567890",
    whatsapp: "08034567890",
    country: "Nigeria",
    city: "Ilorin",
    studentType: "nigerian_local",
    courseId: "sc-react-next",
    courseTitle: "Full-Stack React & Next.js Masterclass",
    courseCode: "AITI-STC-002",
    trainingType: "short_course",
    deliveryMode: "physical_campus",
    preferredSchedule: "Weekday Morning (9:00 AM - 12:00 PM)",
    preferredStartDate: "2026-09-14",
    message: "I would like to inquire about the current tuition fee for the upcoming September cohort at Tanke campus.",
    status: "quote_sent",
    assignedStaff: "Admissions Office",
    currency: "NGN",
    baseFee: 75000,
    additionalFees: 5000,
    additionalFeesBreakdown: [
      { id: "fee-1", description: "Course Lab Pack & Starter Assets", amount: 5000 }
    ],
    discountAmount: 10000,
    discountReason: "Early Bird September Cohort Discount",
    finalQuotedAmount: 70000,
    quoteSentAt: "2026-08-28T11:00:00Z",
    quoteValidUntil: "2026-09-11",
    adminNotes: "Applicant contacted on WhatsApp. Sent official quote with 10k early registration incentive.",
    quoteMessageToApplicant: "Dear Babatunde, thank you for your interest in AITI. Your confirmed fee for the Full-Stack React & Next.js Masterclass is NGN 70,000 (discounted from ₦75,000 + ₦5,000 lab pack). This quote is valid until September 11, 2026."
  },
  {
    id: "qr-2026-002",
    referenceNumber: "AITI/QT/2026/000002",
    createdAt: "2026-08-29T14:15:00Z",
    updatedAt: "2026-08-29T14:15:00Z",
    fullName: "Kwame Mensah",
    email: "kwame.mensah@ghantech.io",
    phone: "+233241234567",
    whatsapp: "+233241234567",
    country: "Ghana",
    city: "Accra",
    studentType: "international_online",
    courseId: "sc-powerbi-sql",
    courseTitle: "Power BI & SQL Data Analytics Masterclass",
    courseCode: "AITI-STC-003",
    trainingType: "online_course",
    deliveryMode: "online_live",
    preferredSchedule: "Executive Evening (5:00 PM - 7:30 PM WAT)",
    preferredStartDate: "2026-09-21",
    message: "Interested in the live online cohort from Ghana. Please send current USD fee and payment terms.",
    status: "new",
    assignedStaff: "Global Admissions Desk",
    currency: "USD"
  },
  {
    id: "qr-2026-003",
    referenceNumber: "AITI/QT/2026/000003",
    createdAt: "2026-08-29T16:40:00Z",
    updatedAt: "2026-08-30T08:20:00Z",
    fullName: "Folashade Oladipo",
    email: "folashade.oladipo@zenithbank.com",
    phone: "08123456789",
    whatsapp: "08123456789",
    country: "Nigeria",
    city: "Lagos",
    studentType: "corporate_group",
    participantCount: 6,
    courseTitle: "Enterprise Cybersecurity & Network Defense",
    trainingType: "corporate_training",
    deliveryMode: "hybrid",
    preferredSchedule: "Weekend Intensive",
    preferredStartDate: "2026-10-03",
    message: "We need custom group training for 6 branch IT compliance officers.",
    status: "processing",
    assignedStaff: "Corporate Partnerships Director",
    currency: "NGN",
    baseFee: 360000,
    discountAmount: 40000,
    discountReason: "Corporate Group Tier 1 Incentive",
    finalQuotedAmount: 320000,
    adminNotes: "Drafting formal custom corporate proposal and schedule alignment."
  },
  {
    id: "qr-2026-004",
    referenceNumber: "AITI/QT/2026/000004",
    createdAt: "2026-08-30T08:00:00Z",
    updatedAt: "2026-08-30T09:45:00Z",
    fullName: "Amina Yusuf",
    email: "amina.yusuf@kwarastate.gov.ng",
    phone: "08051239876",
    whatsapp: "08051239876",
    country: "Nigeria",
    city: "Ilorin",
    studentType: "nigerian_local",
    programId: "prog-dip-6m",
    programTitle: "6-Month Professional Diploma Program",
    trainingType: "diploma_program",
    deliveryMode: "physical_campus",
    preferredSchedule: "Weekday Morning",
    message: "Seeking admission for the 6-Month Diploma in Software Engineering. Need current tuition structure.",
    status: "accepted",
    assignedStaff: "Admissions Office",
    currency: "NGN",
    baseFee: 120000,
    discountAmount: 10000,
    discountReason: "Merit Tech Applicant Waiver",
    finalQuotedAmount: 110000,
    quoteSentAt: "2026-08-30T08:45:00Z",
    quoteValidUntil: "2026-09-30",
    convertedApplicationId: "app-2026-amina",
    adminNotes: "Applicant accepted quote and progressed to application submission."
  }
];

export const initialPriceVersions: PriceVersionLog[] = [
  {
    id: "pv-001",
    itemId: "prog-cert-3m",
    itemTitle: "3-Month Certificate Program",
    itemType: "program",
    currency: "NGN",
    previousPrice: 60000,
    newPrice: 65000,
    changedBy: "Director of Academic Affairs",
    changedAt: "2026-08-01T08:00:00Z",
    reason: "Updated 2026/2027 curriculum materials and upgraded technical workstation labs."
  },
  {
    id: "pv-002",
    itemId: "prog-dip-6m",
    itemTitle: "6-Month Professional Diploma Program",
    itemType: "program",
    currency: "NGN",
    previousPrice: 110000,
    newPrice: 120000,
    changedBy: "Executive Directorate",
    changedAt: "2026-08-01T08:00:00Z",
    reason: "Added Capstone Cloud Hosting and AI Developer Subscriptions into standard tuition."
  },
  {
    id: "pv-003",
    itemId: "sc-gen-ai",
    itemTitle: "Generative AI Engineering & Automation",
    itemType: "short_course",
    currency: "NGN",
    previousPrice: 35000,
    newPrice: 40000,
    changedBy: "Head of Training",
    changedAt: "2026-08-15T10:30:00Z",
    reason: "Added specialized Gemini 2.5 Live API and Claude Enterprise tooling modules."
  }
];


