import { GoogleGenAI } from '@google/genai';
import { db } from './db';

// Server-side lazy initialization for Google GenAI
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

export async function askVisitorAdmissionAi(message: string, history: { role: string; content: string }[] = []): Promise<string> {
  const state = db.getState();
  const settings = state.settings;
  const programs = state.programs;
  const courses = state.courses;

  const systemContext = `
You are the official AI Admission & Information Consultant for AITI (AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE), located in Ilorin, Kwara State, Nigeria.
Institute Details:
- Short Name: ${settings.general.shortName}
- Full Name: ${settings.general.fullName}
- Parent Organization: ${settings.general.parentOrganization}
- Tagline: ${settings.general.tagline}
- Corporate Motto: ${settings.general.motto}
- Institution Type: ${settings.general.institutionType}
- Address: ${settings.contact.address} (Near ${settings.contact.junction}, ${settings.contact.city})
- Primary Phone: ${settings.contact.primaryPhone}
- Secondary Phone: ${settings.contact.secondaryPhone}
- Email: ${settings.contact.email}
- WhatsApp Number: ${settings.whatsapp.primaryNumber}

Active Admissions Cycle:
- Academic Session: ${settings.admissions.activeSession}
- Application Fee: NGN ${settings.admissions.applicationFee.toLocaleString()}
- Certificate Program Duration: 3 Months (Tuition: NGN ${settings.admissions.certificateTuition.toLocaleString()})
- Diploma Program Duration: 6 Months (Tuition: NGN ${settings.admissions.diplomaTuition.toLocaleString()})
- Study Modes: Weekday Morning, Weekday Afternoon, Weekend Intensive (Saturdays), Executive Evening.

Available Programs & Courses Summary:
${programs.map(p => `- ${p.title} (${p.duration}): NGN ${p.tuitionFee.toLocaleString()} tuition. Suitable for: ${p.suitableFor.join(', ')}`).join('\n')}

Course Catalogue Specialties:
- ICT & Digital Skills (Office Suite, AI Productivity, Computer Appreciation)
- Software & Web Development (React, Node.js, Full Stack, Python/TypeScript)
- Data & AI (Excel, SQL, PowerBI, Machine Learning)
- Graphics & Creative Tech (Photoshop, Illustrator, Figma UI/UX, Video Editing)
- Business & Digital Marketing (SEO, Social Ads, Online Business)
- Hardware & Networking (PC Assembly, Repairs, LAN Cabling)
- Engineering Software (AutoCAD 2D/3D, Autodesk Revit)
- Emerging Tech (Cybersecurity Defense, Cloud Computing)

Guidelines:
1. Always be polite, professional, encouraging, and informative.
2. Ground your answers strictly in the official facts above. Do NOT invent unaccredited certifications or unlisted courses.
3. If an applicant asks how to apply, explain the straightforward 8-step online portal process (Account -> Info -> Education -> Program -> Next of Kin -> Documents -> Review -> Payment) or visiting the campus at 2 Babanla Street, Graceland Junction, Tanke, Ilorin.
4. When information is unavailable or requires special approval, advise the visitor to call 08030947468 or chat with AITI on WhatsApp.
`;

  const ai = getAiClient();
  if (!ai) {
    // Graceful fallback response when API key is not yet set
    return `Welcome to AITI (AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE)! We offer practical 3-Month Certificate and 6-Month Diploma programs in Software Engineering, UI/UX Design, Data & AI, Hardware Engineering, and Digital Literacy at our campus in Tanke, Ilorin. Applications for the ${settings.admissions.activeSession} session are currently open! You can reach our admissions desk directly on ${settings.contact.primaryPhone} or click the WhatsApp button to chat with an admissions officer.`;
  }

  try {
    const formattedPrompt = `${systemContext}\n\nVisitor Message: ${message}`;
    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: formattedPrompt,
    });

    return response.text || "Thank you for contacting AITI. Please call 08030947468 or chat on WhatsApp for immediate guidance.";
  } catch (err: any) {
    console.error('Visitor AI error:', err);
    return `Welcome to AITI! For direct assistance with programs, admission requirements, and tuition for the ${settings.admissions.activeSession} session, please contact our admissions office at ${settings.contact.primaryPhone} or WhatsApp ${settings.whatsapp.primaryNumber}.`;
  }
}

export async function askAdminAi(query: string, adminRole: string): Promise<string> {
  const state = db.getState();
  const totalApplicants = state.applications.length;
  const submittedApps = state.applications.filter(a => a.status === 'submitted' || a.status === 'under_review').length;
  const admittedStudents = state.admissions.length;
  const activeStudents = state.students.filter(s => s.status === 'active').length;
  const totalRevenue = state.payments.filter(p => p.status === 'success').reduce((acc, p) => acc + p.amount, 0);
  const totalOutstanding = state.students.reduce((acc, s) => acc + s.outstandingBalance, 0);
  const avgAttendance = state.students.length ? Math.round(state.students.reduce((acc, s) => acc + s.attendancePercentage, 0) / state.students.length) : 100;

  const adminSystemContext = `
You are the AI Executive School Intelligence Assistant for the AITI Command Center.
Current Real-Time Institutional Metrics:
- Total Applications: ${totalApplicants} (Pending Review: ${submittedApps})
- Total Admitted / Enrolled: ${admittedStudents}
- Active Enrolled Students: ${activeStudents}
- Total Revenue Collected: NGN ${totalRevenue.toLocaleString()}
- Total Outstanding Student Fees: NGN ${totalOutstanding.toLocaleString()}
- Average Institutional Attendance Rate: ${avgAttendance}%
- Active Classes: ${state.classes.length}
- Total Instructors / Staff: ${state.users.filter(u => u.role === 'instructor' || u.role.includes('admin') || u.role.includes('officer')).length}

Recent Applications List:
${state.applications.slice(0, 5).map(a => `- [${a.applicationId}] ${a.firstName} ${a.lastName} (${a.programTitle}) - Status: ${a.status}`).join('\n')}

Students with Outstanding Balances:
${state.students.filter(s => s.outstandingBalance > 0).map(s => `- ${s.fullName} (${s.studentNumber}): Owes NGN ${s.outstandingBalance.toLocaleString()}`).join('\n') || 'None'}

Provide an executive, concise, and actionable response strictly derived from this live database context.
`;

  const ai = getAiClient();
  if (!ai) {
    return `[AITI Intelligence Report] Current Status: ${activeStudents} active students, ${totalApplicants} total applications received. Total revenue collected: NGN ${totalRevenue.toLocaleString()} with NGN ${totalOutstanding.toLocaleString()} outstanding tuition. Attendance rate is averaging ${avgAttendance}%.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `${adminSystemContext}\n\nAdmin Query: ${query}`,
    });
    return response.text || "Report generated successfully.";
  } catch (err: any) {
    console.error('Admin AI error:', err);
    return `Current Metrics: Total Applicants: ${totalApplicants}, Active Students: ${activeStudents}, Collected Revenue: NGN ${totalRevenue.toLocaleString()}.`;
  }
}
