import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Calendar, Clock, CheckCircle2, Award, Download, 
  Layers, FileText, AlertCircle, Sparkles, User, ShieldCheck, 
  CreditCard, ChevronRight, LogOut, UploadCloud, Check, ExternalLink,
  MessageSquare, Bell, Video, BookMarked, MapPin, Laptop, Printer
} from 'lucide-react';
import { ShortCourseEnrollment } from '../../types';
import { DocumentViewerModal } from '../common/DocumentViewer';
import { useSettings } from '../../context/SettingsContext';

interface ShortCourseStudentPortalProps {
  initialRegistrationId?: string;
  onNavigate?: (view: string) => void;
}

export const ShortCourseStudentPortal: React.FC<ShortCourseStudentPortalProps> = ({
  initialRegistrationId,
  onNavigate
}) => {
  const { settings } = useSettings();
  const [registrationIdInput, setRegistrationIdInput] = useState<string>(initialRegistrationId || 'AITI/STC/2026/00025');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  
  const [studentData, setStudentData] = useState<ShortCourseEnrollment | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'materials' | 'attendance' | 'assignments' | 'announcements' | 'payment' | 'certificate'>('overview');

  // Assignment submission modal
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState<string>('');
  const [submissionNotes, setSubmissionNotes] = useState<string>('');
  const [isSubmittingAssignment, setIsSubmittingAssignment] = useState<boolean>(false);

  // Document modal
  const [documentModal, setDocumentModal] = useState<{
    isOpen: boolean;
    type: 'short_course_certificate' | 'short_course_registration';
    data: any;
  }>({
    isOpen: false,
    type: 'short_course_certificate',
    data: null
  });

  useEffect(() => {
    if (initialRegistrationId) {
      handleLoginWithId(initialRegistrationId);
    }
  }, [initialRegistrationId]);

  const handleLoginWithId = async (idToLogin: string) => {
    if (!idToLogin.trim()) {
      setErrorMsg('Please enter your Short Course Registration ID or Phone Number');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const res = await fetch('/api/short-courses/portal/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: idToLogin.trim() })
      });
      const data = await res.json();

      if (data.success && data.student) {
        setStudentData(data.student);
        setIsLoggedIn(true);
      } else {
        setErrorMsg(data.message || 'Registration record not found. Please verify your Registration ID.');
      }
    } catch (err: any) {
      setErrorMsg('Server connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (id: string) => {
    setRegistrationIdInput(id);
    handleLoginWithId(id);
  };

  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentData || !selectedAssignment) return;

    try {
      setIsSubmittingAssignment(true);
      const res = await fetch('/api/short-courses/portal/submit-assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId: studentData.registrationId,
          assignmentId: selectedAssignment.id,
          submissionUrl: submissionUrl || 'https://github.com/aiti-student/lab-project',
          submissionNotes: submissionNotes || 'Completed practical milestone'
        })
      });
      const data = await res.json();

      if (data.success && data.student) {
        setStudentData(data.student);
        setSelectedAssignment(null);
        setSubmissionUrl('');
        setSubmissionNotes('');
        alert('Assignment submitted successfully!');
      } else {
        alert(data.message || 'Failed to submit assignment');
      }
    } catch (err: any) {
      alert('Error submitting assignment: ' + err.message);
    } finally {
      setIsSubmittingAssignment(false);
    }
  };

  // Login view
  if (!isLoggedIn || !studentData) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 flex items-center justify-center font-serif font-black text-2xl mx-auto mb-4 shadow-lg shadow-cyan-500/10">
              AITI
            </div>
            <h1 className="text-2xl font-black font-serif text-white tracking-tight">
              Short-Term Course Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Lightweight Participant Account & Certificate Hub
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handleLoginWithId(registrationIdInput); }} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Registration ID / Phone Number
              </label>
              <input
                type="text"
                value={registrationIdInput}
                onChange={(e) => setRegistrationIdInput(e.target.value)}
                placeholder="e.g. AITI/STC/2026/00025 or 0541234567"
                required
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-extrabold rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Access Participant Portal</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-2 text-center">
              Quick Test Sign-In Accounts:
            </span>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('AITI/STC/2026/00025')}
                className="w-full text-left p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-xs transition-colors flex items-center justify-between text-slate-300 hover:text-white"
              >
                <div>
                  <span className="font-bold text-cyan-400">AITI/STC/2026/00025</span>
                  <span className="text-slate-400 block text-[11px]">Kwame Mensah • Python for Data Analysis (Completed & Certified)</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-semibold">Ready</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('AITI/STC/2026/00026')}
                className="w-full text-left p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-xs transition-colors flex items-center justify-between text-slate-300 hover:text-white"
              >
                <div>
                  <span className="font-bold text-cyan-400">AITI/STC/2026/00026</span>
                  <span className="text-slate-400 block text-[11px]">Abena Osei • Graphic Design & Branding (In-Progress)</span>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-semibold">Active</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => onNavigate && onNavigate('short_courses')}
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
            >
              ← Back to Short Courses Catalog
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard calculations
  const totalClasses = studentData.attendance?.length || 8;
  const attendedClasses = studentData.attendance?.filter(a => a.present).length || 7;
  const attendanceRate = Math.round((attendedClasses / (totalClasses || 1)) * 100);

  const totalAssignments = studentData.assignments?.length || 2;
  const submittedAssignments = studentData.assignments?.filter(a => a.status === 'submitted' || a.status === 'graded').length || 2;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Header Banner */}
      <div className="bg-slate-900 border-b border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 flex items-center justify-center font-bold text-lg">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">{studentData.fullName}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {studentData.registrationId}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Enrolled in: <strong className="text-slate-200">{studentData.courseTitle}</strong> • Batch: {studentData.batchDate || 'Current'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setDocumentModal({
                  isOpen: true,
                  type: 'short_course_registration',
                  data: {
                    registrationId: studentData.registrationId,
                    fullName: studentData.fullName,
                    email: studentData.email,
                    phone: studentData.phone,
                    whatsapp: studentData.whatsapp,
                    courseTitle: studentData.courseTitle,
                    preferredSchedule: studentData.preferredSchedule || 'Weekend Intensive',
                    trainingMode: studentData.trainingMode || 'Physical (AITI Campus)',
                    fee: studentData.feeGHS,
                    paymentStatus: studentData.paymentStatus === 'paid' ? 'PAID / CONFIRMED' : 'PENDING'
                  }
                });
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>Registration Pass</span>
            </button>

            {studentData.certificateIssued && (
              <button
                onClick={() => {
                  setDocumentModal({
                    isOpen: true,
                    type: 'short_course_certificate',
                    data: {
                      certificateNumber: studentData.certificateNumber || `AITI/CERT/STC/2026/00025`,
                      participantName: studentData.fullName,
                      registrationId: studentData.registrationId,
                      courseTitle: studentData.courseTitle,
                      duration: '4-Week Intensive Course',
                      trainingMode: studentData.trainingMode || 'Practical Hands-on',
                      completionDate: studentData.completionDate || new Date().toISOString().split('T')[0]
                    }
                  });
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                <span>View Certificate</span>
              </button>
            )}

            <button
              onClick={() => setIsLoggedIn(false)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-300 border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex border-b border-slate-800 overflow-x-auto space-x-1 sm:space-x-2 scrollbar-none">
          {[
            { id: 'overview', label: 'Course Overview', icon: BookOpen },
            { id: 'schedule', label: 'Training Schedule', icon: Calendar },
            { id: 'materials', label: 'Course Materials', icon: FileText },
            { id: 'attendance', label: 'Attendance', icon: CheckCircle2 },
            { id: 'assignments', label: 'Assignments', icon: Layers },
            { id: 'announcements', label: 'Announcements', icon: Bell },
            { id: 'payment', label: 'Payment Status', icon: CreditCard },
            { id: 'certificate', label: 'Certificate', icon: Award }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors whitespace-nowrap flex items-center gap-2 border-b-2 ${
                  isActive 
                    ? 'border-cyan-400 text-cyan-400 bg-slate-900/80' 
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.id === 'certificate' && studentData.certificateIssued && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="mt-8 space-y-8">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-xs text-slate-400 font-medium">Training Mode</span>
                <p className="text-lg font-bold text-white mt-1 capitalize">{studentData.trainingMode || 'Physical'}</p>
                <span className="text-[11px] text-cyan-400 mt-1 block">AITI Tech Labs</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-xs text-slate-400 font-medium">Attendance Rate</span>
                <p className="text-lg font-bold text-emerald-400 mt-1">{attendanceRate}%</p>
                <span className="text-[11px] text-slate-400 mt-1 block">{attendedClasses} of {totalClasses} classes attended</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-xs text-slate-400 font-medium">Practical Assignments</span>
                <p className="text-lg font-bold text-sky-400 mt-1">{submittedAssignments} / {totalAssignments}</p>
                <span className="text-[11px] text-slate-400 mt-1 block">Completed & Graded</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-xs text-slate-400 font-medium">Certificate Status</span>
                <p className={`text-lg font-bold mt-1 ${studentData.certificateIssued ? 'text-amber-400' : 'text-slate-300'}`}>
                  {studentData.certificateIssued ? 'Issued & Verified' : 'In Progress'}
                </p>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {studentData.certificateIssued ? studentData.certificateNumber : 'Requires 80% attendance'}
                </span>
              </div>
            </div>

            {/* Course Summary Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Enrolled Program</span>
                  <h2 className="text-2xl sm:text-3xl font-black font-serif text-white mt-1">{studentData.courseTitle}</h2>
                  <p className="text-sm text-slate-300 mt-2 max-w-2xl">
                    Intensive practical workshop focusing on real-world industrial workflows, tooling setups, and project milestones.
                  </p>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-1.5 shrink-0">
                  <div><strong className="text-slate-400">Schedule:</strong> <span className="text-white">{studentData.preferredSchedule || 'Weekend Intensive (Saturdays 9AM - 4PM)'}</span></div>
                  <div><strong className="text-slate-400">Delivery:</strong> <span className="text-white">{studentData.trainingMode || 'Physical (AITI Tech Lab 2)'}</span></div>
                  <div><strong className="text-slate-400">Instructor:</strong> <span className="text-cyan-400">AITI Certified Lead Instructor</span></div>
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="pt-6">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">Course Progression</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Overall Completion</span>
                    <span className="font-mono text-cyan-400 font-bold">{studentData.certificateIssued ? '100%' : '75%'}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 rounded-full transition-all duration-500" 
                      style={{ width: studentData.certificateIssued ? '100%' : '75%' }} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRAINING SCHEDULE */}
        {activeTab === 'schedule' && (
          <div className="mt-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-2">Cohort Training Schedule</h2>
            <p className="text-xs text-slate-400 mb-6">Upcoming live sessions, practical lab times, and milestone submission deadlines.</p>

            <div className="space-y-4">
              {(studentData.schedule || [
                { session: 1, topic: 'Curriculum Kickoff & Environment Setup', date: 'Saturday, Week 1', time: '9:00 AM - 1:00 PM', location: 'Lab 1 / Virtual Link', status: 'Completed' },
                { session: 2, topic: 'Hands-on Labs & Core Framework Practice', date: 'Saturday, Week 2', time: '9:00 AM - 1:00 PM', location: 'Lab 1 / Virtual Link', status: 'Completed' },
                { session: 3, topic: 'Advanced Practical Implementation & Lab Exercises', date: 'Saturday, Week 3', time: '9:00 AM - 1:00 PM', location: 'Lab 1 / Virtual Link', status: 'Completed' },
                { session: 4, topic: 'Capstone Milestone Project Review & Assessment', date: 'Saturday, Week 4', time: '9:00 AM - 2:00 PM', location: 'Lab 1 / Virtual Link', status: studentData.certificateIssued ? 'Completed' : 'Upcoming' }
              ]).map((item: any, idx: number) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-sm shrink-0">
                      S{item.session || idx + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.topic}</h4>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-cyan-400" /> {item.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {item.time}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {item.location}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'Completed' 
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: COURSE MATERIALS */}
        {activeTab === 'materials' && (
          <div className="mt-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-2">Course Lecture Notes & Lab Workbooks</h2>
            <p className="text-xs text-slate-400 mb-6">Download authorized slide decks, code snippets, project datasets, and reference guides.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Module 1: Comprehensive Lecture Slides & Handout', type: 'PDF Document', size: '4.8 MB', icon: FileText },
                { title: 'Module 2: Practical Lab Manual & Exercise Worksheets', type: 'PDF Document', size: '6.2 MB', icon: BookMarked },
                { title: 'Starter Codebase & GitHub Practice Repository', type: 'Source Archive', size: '12.4 MB', icon: Layers },
                { title: 'Capstone Milestone Project Brief & Assessment Rubric', type: 'PDF Document', size: '1.9 MB', icon: ShieldCheck }
              ].map((mat, idx) => {
                const Icon = mat.icon;
                return (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">{mat.title}</h4>
                        <span className="text-[11px] text-slate-400">{mat.type} • {mat.size}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => alert(`Downloading ${mat.title}...`)}
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 hover:text-cyan-300 transition-colors shrink-0"
                      title="Download Resource"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div className="mt-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Attendance Record</h2>
                <p className="text-xs text-slate-400 mt-0.5">A minimum of 80% attendance is required for Certificate of Completion eligibility.</p>
              </div>
              <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 font-bold text-xs">
                Attendance Standing: {attendanceRate}% (Qualifying)
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                    <th className="pb-3 font-semibold">Session Date</th>
                    <th className="pb-3 font-semibold">Class Topic / Activity</th>
                    <th className="pb-3 font-semibold">Mode</th>
                    <th className="pb-3 font-semibold text-right">Attendance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {(studentData.attendance || [
                    { date: '2026-05-02', topic: 'Orientation & Python Fundamentals', mode: 'Physical', present: true },
                    { date: '2026-05-09', topic: 'Data Structures & Control Flow', mode: 'Physical', present: true },
                    { date: '2026-05-16', topic: 'NumPy Arrays & Data Manipulation', mode: 'Physical', present: true },
                    { date: '2026-05-23', topic: 'Pandas DataFrames & Visualization', mode: 'Physical', present: true }
                  ]).map((att: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-950/40">
                      <td className="py-3.5 font-mono text-slate-300">{att.date}</td>
                      <td className="py-3.5 font-medium text-white">{att.topic}</td>
                      <td className="py-3.5 text-slate-400">{att.mode || 'Physical'}</td>
                      <td className="py-3.5 text-right">
                        {att.present ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                            <Check className="w-3 h-3" /> Present
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-300 border border-red-500/30 font-semibold">
                            Absent
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: ASSIGNMENTS */}
        {activeTab === 'assignments' && (
          <div className="mt-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-2">Practical Lab Assignments & Projects</h2>
            <p className="text-xs text-slate-400 mb-6">Submit your homework milestones or repository links for instructor review and scoring.</p>

            <div className="space-y-4">
              {(studentData.assignments || [
                { id: 'asgn-1', title: 'Assignment 1: Data Cleaning & Transformation Pipeline', dueDate: 'May 15, 2026', status: 'graded', score: '95/100', feedback: 'Excellent data wrangling logic and clean code formatting.' },
                { id: 'asgn-2', title: 'Capstone Milestone: End-to-End Analytics Dashboard', dueDate: 'May 28, 2026', status: 'submitted', score: 'Pending Review', feedback: 'Submission received by lead instructor.' }
              ]).map((asgn: any) => (
                <div key={asgn.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{asgn.title}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        asgn.status === 'graded' 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {asgn.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Due: {asgn.dueDate} • Score: <strong className="text-cyan-400">{asgn.score}</strong></p>
                    {asgn.feedback && (
                      <p className="text-xs text-slate-300 italic mt-2 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        Instructor Feedback: "{asgn.feedback}"
                      </p>
                    )}
                  </div>

                  <div className="shrink-0">
                    <button
                      onClick={() => setSelectedAssignment(asgn)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>{asgn.status === 'pending' ? 'Submit Assignment' : 'Resubmit / Edit'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Assignment Submission Modal */}
            {selectedAssignment && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full">
                  <h3 className="text-lg font-bold text-white mb-1">Submit Assignment</h3>
                  <p className="text-xs text-slate-400 mb-4">{selectedAssignment.title}</p>

                  <form onSubmit={handleSubmitAssignment} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Repository / Project URL (GitHub, Google Drive, or Live Link)
                      </label>
                      <input
                        type="url"
                        value={submissionUrl}
                        onChange={(e) => setSubmissionUrl(e.target.value)}
                        placeholder="https://github.com/username/project"
                        required
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Notes for Instructor (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={submissionNotes}
                        onChange={(e) => setSubmissionNotes(e.target.value)}
                        placeholder="Describe how to run the project or highlight key features..."
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedAssignment(null)}
                        className="px-4 py-2 bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingAssignment}
                        className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl disabled:opacity-50"
                      >
                        {isSubmittingAssignment ? 'Submitting...' : 'Upload Submission'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (
          <div className="mt-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-2">Class Announcements & Broadcasts</h2>
            <p className="text-xs text-slate-400 mb-6">Important updates regarding class timing, guest lectures, and lab facilities.</p>

            <div className="space-y-4">
              {[
                { title: 'Capstone Project Evaluation & Showcase Notice', date: 'May 20, 2026', sender: 'Director of Training', content: 'All participants should prepare a 5-minute presentation demonstrating their final capstone workflow. Industry mentors will be in attendance.' },
                { title: 'Supplementary Virtual Office Hours This Thursday', date: 'May 12, 2026', sender: 'Lead Instructor', content: 'We will be hosting an optional 1-hour live Q&A via Google Meet on Thursday at 7:00 PM for anyone needing assistance with lab datasets.' },
                { title: 'Welcome to AITI Applied Tech Cohort!', date: 'May 1, 2026', sender: 'AITI Admissions', content: 'Welcome to your intensive training. Please ensure you have configured your development workstation according to the Module 1 checklist.' }
              ].map((ann, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-white">{ann.title}</h4>
                    <span className="text-[11px] text-slate-500 font-mono">{ann.date}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">{ann.content}</p>
                  <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">Posted by: {ann.sender}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: PAYMENT STATUS */}
        {activeTab === 'payment' && (
          <div className="mt-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-2">Tuition Fee & Billing History</h2>
            <p className="text-xs text-slate-400 mb-6">Review your registration payment confirmation, billing details, and download your official receipt pass.</p>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 max-w-xl mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Total Course Tuition</span>
                  <p className="text-2xl font-black text-white mt-0.5">GHS {Number(studentData.feeGHS || 1200).toLocaleString()}</p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    studentData.paymentStatus === 'paid' 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {studentData.paymentStatus === 'paid' ? 'Paid / Settled' : 'Pending Verification'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 pt-4 border-t border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Reference:</span>
                  <span className="font-mono text-white">{studentData.paymentReference || 'MM-2026-CONFIRMED'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Participant Name:</span>
                  <span className="text-white font-medium">{studentData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Registration ID:</span>
                  <span className="font-mono text-cyan-400">{studentData.registrationId}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex gap-3">
                <button
                  onClick={() => {
                    setDocumentModal({
                      isOpen: true,
                      type: 'short_course_registration',
                      data: {
                        registrationId: studentData.registrationId,
                        fullName: studentData.fullName,
                        email: studentData.email,
                        phone: studentData.phone,
                        whatsapp: studentData.whatsapp,
                        courseTitle: studentData.courseTitle,
                        preferredSchedule: studentData.preferredSchedule || 'Weekend Intensive',
                        trainingMode: studentData.trainingMode || 'Physical (AITI Campus)',
                        fee: studentData.feeGHS,
                        paymentStatus: 'PAID / CONFIRMED'
                      }
                    });
                  }}
                  className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Download Registration Pass & Receipt</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: CERTIFICATE */}
        {activeTab === 'certificate' && (
          <div className="mt-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
            <div className="max-w-2xl mx-auto text-center py-6">
              {studentData.certificateIssued ? (
                <div>
                  <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-500/10">
                    <Award className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Credential Conferred</span>
                  <h2 className="text-2xl sm:text-3xl font-black font-serif text-white mt-1 mb-2">
                    AITI Certificate of Completion
                  </h2>
                  <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
                    Congratulations! You have fulfilled all requirements for <strong>{studentData.courseTitle}</strong>.
                  </p>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs max-w-sm mx-auto mb-6 text-left space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Certificate No:</span>
                      <span className="font-mono font-bold text-amber-300">{studentData.certificateNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Recipient:</span>
                      <span className="text-white font-medium">{studentData.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Completion Date:</span>
                      <span className="text-slate-200">{studentData.completionDate || '2026-05-30'}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => {
                        setDocumentModal({
                          isOpen: true,
                          type: 'short_course_certificate',
                          data: {
                            certificateNumber: studentData.certificateNumber,
                            participantName: studentData.fullName,
                            registrationId: studentData.registrationId,
                            courseTitle: studentData.courseTitle,
                            duration: '4-Week Intensive Course',
                            trainingMode: studentData.trainingMode || 'Practical Hands-on',
                            completionDate: studentData.completionDate || '2026-05-30'
                          }
                        });
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
                    >
                      <Award className="w-4 h-4" />
                      <span>View & Print Official Certificate</span>
                    </button>

                    <a
                      href={`/verify?type=certificate&code=${studentData.certificateNumber}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      <span>Public Verification Link</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="w-16 h-16 rounded-3xl bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Certificate In Progress</h2>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
                    Certificates of Completion are officially generated by AITI upon reaching 80% class attendance and submitting all practical milestone exercises.
                  </p>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs max-w-sm mx-auto space-y-2 text-left">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Current Attendance:</span>
                      <span className="font-bold text-emerald-400">{attendanceRate}% (Min. 80% required)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Assignments Graded:</span>
                      <span className="font-bold text-sky-400">{submittedAssignments} of {totalAssignments}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Document Viewer Modal */}
      {documentModal.isOpen && (
        <DocumentViewerModal
          type={documentModal.type}
          data={documentModal.data}
          onClose={() => setDocumentModal({ ...documentModal, isOpen: false })}
        />
      )}
    </div>
  );
};
