import React, { useState } from 'react';
import { 
  Laptop, Globe, Sparkles, Search, Filter, PlayCircle, BookOpen, 
  CheckCircle2, Clock, Calendar, Video, FileText, Award, DollarSign, 
  ArrowRight, ShieldCheck, Tag, X, User, Mail, Phone, MapPin, Check
} from 'lucide-react';
import { INITIAL_ONLINE_COURSES, DetailedOnlineCourse } from '../../data/onlineCoursesSeed';
import { formatCurrency, calculateStudentPricing, COUNTRY_OPTIONS, SupportedCurrency } from '../../services/currency';
import { useSettings } from '../../context/SettingsContext';
import { QuoteRequestModal } from './QuoteRequestModal';
import { FeeNoticeDisplay } from './FeeNoticeDisplay';

interface OnlineCoursesPublicPageProps {
  onNavigate: (view: string, id?: string) => void;
  onEnrollCourse?: (course: DetailedOnlineCourse, studentData: any) => void;
}

export const OnlineCoursesPublicPage: React.FC<OnlineCoursesPublicPageProps> = ({ onNavigate, onEnrollCourse }) => {
  const { settings } = useSettings();

  // Filters & State
  const [studentLocation, setStudentLocation] = useState<'Nigeria' | 'Outside Nigeria'>('Nigeria');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDeliveryMode, setSelectedDeliveryMode] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Quote modal state
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteModalData, setQuoteModalData] = useState<{
    courseTitle?: string;
    courseId?: string;
    courseCode?: string;
    trainingType?: any;
    deliveryMode?: any;
    isInternational?: boolean;
  }>({});

  const handleOpenQuoteModal = (opts?: {
    courseTitle?: string;
    courseId?: string;
    courseCode?: string;
    trainingType?: any;
    deliveryMode?: any;
    isInternational?: boolean;
  }) => {
    setQuoteModalData(opts || {});
    setIsQuoteModalOpen(true);
  };
  
  // Selected course for full syllabus & lesson preview modal
  const [activeCourseModal, setActiveCourseModal] = useState<DetailedOnlineCourse | null>(null);
  const [activeLessonPreview, setActiveLessonPreview] = useState<any | null>(null);

  // Enrollment Drawer / Modal State
  const [enrollModalCourse, setEnrollModalCourse] = useState<DetailedOnlineCourse | null>(null);
  const [enrollForm, setEnrollForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    country: 'Nigeria',
    studyMode: 'Online' as 'Physical' | 'Online' | 'Hybrid',
    couponCode: '',
    discountApplied: 0
  });
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [enrollmentSuccessData, setEnrollmentSuccessData] = useState<any | null>(null);

  // Categories list
  const categories = ['All', 'Software & Web Development', 'Data & AI', 'Cybersecurity & Cloud', 'Graphics & Creative Technology', 'ICT & Digital Skills'];

  const filteredCourses = INITIAL_ONLINE_COURSES.filter(c => {
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.technologyArea.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = selectedDeliveryMode === 'All' || c.deliveryModes.includes(selectedDeliveryMode as any);
    return matchesCat && matchesSearch && matchesMode;
  });

  const handleApplyCoupon = () => {
    setCouponError('');
    setCouponSuccess('');
    const code = enrollForm.couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'AITI2026') {
      setEnrollForm(prev => ({ ...prev, discountApplied: 15 })); // 15% off
      setCouponSuccess('15% Institutional discount applied!');
    } else if (code === 'GLOBALTECH' && studentLocation === 'Outside Nigeria') {
      setEnrollForm(prev => ({ ...prev, discountApplied: 20 })); // $20 off
      setCouponSuccess('$20 Global student voucher applied!');
    } else if (code === 'ILORINPROMO' && studentLocation === 'Nigeria') {
      setEnrollForm(prev => ({ ...prev, discountApplied: 10 })); // 10% off
      setCouponSuccess('₦ Discount applied!');
    } else {
      setCouponError('Invalid or expired coupon code.');
    }
  };

  const handleCompleteEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollModalCourse) return;

    setIsProcessingPayment(true);
    
    // Simulate server-side verification and instant enrollment generation
    setTimeout(() => {
      setIsProcessingPayment(false);
      const isNigeria = studentLocation === 'Nigeria';
      const pricing = calculateStudentPricing(enrollModalCourse, studentLocation, enrollForm.studyMode);
      
      let finalAmount = pricing.amount;
      if (enrollForm.discountApplied > 0) {
        if (enrollForm.discountApplied < 100) {
          finalAmount = Math.max(0, finalAmount * ((100 - enrollForm.discountApplied) / 100));
        } else {
          finalAmount = Math.max(0, finalAmount - enrollForm.discountApplied);
        }
      }

      const record = {
        enrollmentNumber: `AITI/ONL/2026/${Math.floor(1000 + Math.random() * 9000)}`,
        fullName: enrollForm.fullName,
        email: enrollForm.email,
        phone: enrollForm.phone,
        country: enrollForm.country,
        studentLocation,
        courseTitle: enrollModalCourse.title,
        courseCode: enrollModalCourse.code,
        studyMode: enrollForm.studyMode,
        currency: pricing.currency,
        amountPaid: finalAmount,
        paymentReference: `PAY-VERIFIED-${Date.now().toString(36).toUpperCase()}`,
        status: 'ACTIVE_LMS_UNLOCKED',
        enrolledAt: new Date().toISOString()
      };

      setEnrollmentSuccessData(record);
      if (onEnrollCourse) {
        onEnrollCourse(enrollModalCourse, record);
      }
    }, 1200);
  };

  return (
    <div className="space-y-12 pb-20">
      
      {/* 1. HEADER BANNER */}
      <section className="bg-slate-950 border-b border-slate-800 pt-10 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-bold uppercase tracking-wider">
                <Laptop className="w-3.5 h-3.5" />
                <span>AITI Online & Blended Learning Hub</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-serif">
                Technology Courses — Learn Online or On-Campus
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Every AITI course is engineered for practical mastery. Choose to study 100% online from anywhere in the world, or join physical labs at Tanke Campus, Ilorin.
              </p>
            </div>

            {/* DUAL LOCATION & CURRENCY SELECTOR */}
            <div className="bg-slate-900 border border-slate-700 p-4 rounded-2xl space-y-3 shrink-0 shadow-xl">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Select Your Student Location & Currency
              </span>
              
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => {
                    setStudentLocation('Nigeria');
                    setEnrollForm(prev => ({ ...prev, country: 'Nigeria' }));
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    studentLocation === 'Nigeria'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🇳🇬 Nigeria (₦ NGN)</span>
                </button>

                <button
                  onClick={() => {
                    setStudentLocation('Outside Nigeria');
                    setEnrollForm(prev => ({ ...prev, country: 'United States' }));
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    studentLocation === 'Outside Nigeria'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>International ($ USD)</span>
                </button>
              </div>

              <div className="text-[10px] text-slate-400 flex items-center justify-between">
                <span>Active Currency:</span>
                <strong className={studentLocation === 'Nigeria' ? 'text-emerald-400' : 'text-cyan-400'}>
                  {studentLocation === 'Nigeria' ? 'Nigerian Naira (₦)' : 'United States Dollar ($)'}
                </strong>
              </div>
            </div>
          </div>

          {/* SEARCH & FILTERS BAR */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-4 border-t border-slate-800/80">
            <div className="md:col-span-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search course title, syllabus, or tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs focus:ring-1 focus:ring-cyan-400 focus:outline-none"
              />
            </div>

            <div className="md:col-span-5 flex items-center gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="md:col-span-3">
              <select
                value={selectedDeliveryMode}
                onChange={(e) => setSelectedDeliveryMode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-cyan-400"
              >
                <option value="All">All Delivery Modes</option>
                <option value="Online">Online Remote</option>
                <option value="Physical">Physical Lab (Tanke Campus)</option>
                <option value="Hybrid">Hybrid (Lab + Online)</option>
              </select>
            </div>
          </div>

        </div>
      </section>

      {/* 2. COURSES CARDS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const pricing = calculateStudentPricing(course, studentLocation, 'Online');
            
            return (
              <div 
                key={course.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-3xl p-6 transition-all hover:-translate-y-1 shadow-xl flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                      {course.technologyArea}
                    </span>
                    <span className="text-xs font-mono text-slate-400 font-semibold">
                      {course.durationText}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {course.description}
                  </p>

                  {/* Delivery Modes Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {course.deliveryModes.map((mode) => (
                      <span 
                        key={mode} 
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          mode === 'Online'
                            ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/60'
                            : mode === 'Physical'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                            : 'bg-indigo-950 text-indigo-400 border border-indigo-800/60'
                        }`}
                      >
                        {mode}
                      </span>
                    ))}
                  </div>

                  {/* Syllabus Highlights */}
                  <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{course.modules.length} Modules &amp; Video Lessons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Live Mentoring + Downloadable Files</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Digital QR Verified Certificate</span>
                    </div>
                  </div>

                  {/* Instructor Preview */}
                  <div className="flex items-center gap-2.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    {course.instructorAvatar && (
                      <img 
                        src={course.instructorAvatar} 
                        alt={course.instructorName} 
                        className="w-8 h-8 rounded-lg object-cover border border-slate-700" 
                      />
                    )}
                    <div>
                      <strong className="text-xs text-white block">{course.instructorName}</strong>
                      <span className="text-[10px] text-slate-400">Senior Instructor</span>
                    </div>
                  </div>

                </div>

                {/* Bottom Pricing & CTAs */}
                <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
                  <FeeNoticeDisplay
                    courseTitle={course.title}
                    courseId={course.id}
                    courseCode={course.id}
                    exactPrice={course.tuitionNGN || 70000}
                    exactPriceUSD={course.tuitionUSD || 120}
                    isInternational={studentLocation === 'Outside Nigeria'}
                    trainingType="online_course"
                    deliveryMode="online_live"
                    onOpenQuoteModal={handleOpenQuoteModal}
                    layout="card"
                  />

                  <div className="flex items-center justify-between text-xs pt-1 px-1">
                    <button
                      onClick={() => setActiveCourseModal(course)}
                      className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>View Full Syllabus</span>
                    </button>
                    <button
                      onClick={() => setActiveCourseModal(course)}
                      className="text-slate-400 hover:text-slate-200 flex items-center gap-1"
                    >
                      <PlayCircle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Free Lesson Preview</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* 3. SYLLABUS & LESSON PREVIEW MODAL */}
      {activeCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-950/80 sticky top-0 z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                    {activeCourseModal.code}
                  </span>
                  <span className="text-xs text-slate-400">{activeCourseModal.durationText}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">
                  {activeCourseModal.title}
                </h2>
              </div>
              <button
                onClick={() => {
                  setActiveCourseModal(null);
                  setActiveLessonPreview(null);
                }}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-8">
              
              {/* Overview */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Course Overview</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeCourseModal.overview || activeCourseModal.description}
                </p>
              </div>

              {/* Learning Outcomes */}
              <div className="space-y-3 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Key Competencies & Learning Outcomes</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {activeCourseModal.learningOutcomes?.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Lesson Preview Player */}
              {activeLessonPreview ? (
                <div className="bg-slate-950 border border-cyan-800/60 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400 flex items-center gap-2">
                      <PlayCircle className="w-4 h-4" /> Free Preview Lesson: {activeLessonPreview.title}
                    </span>
                    <button
                      onClick={() => setActiveLessonPreview(null)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Close Player
                    </button>
                  </div>
                  
                  {activeLessonPreview.videoUrl ? (
                    <div className="aspect-video bg-black rounded-xl overflow-hidden border border-slate-800">
                      <iframe
                        src={activeLessonPreview.videoUrl}
                        title={activeLessonPreview.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-900 rounded-xl text-xs text-slate-400">
                      Video stream will unlock upon cohort session commencement.
                    </div>
                  )}

                  <p className="text-xs text-slate-300">
                    {activeLessonPreview.summary}
                  </p>
                </div>
              ) : null}

              {/* Modules Syllabus Breakdown */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Detailed Course Syllabus ({activeCourseModal.modules.length} Modules)
                </h3>

                <div className="space-y-3">
                  {activeCourseModal.modules.map((mod) => (
                    <div key={mod.id} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <strong className="text-xs font-bold text-white">{mod.title}</strong>
                        <span className="text-[11px] text-slate-400">{mod.lessons.length} Lessons</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{mod.description}</p>

                      <div className="space-y-2 pt-2">
                        {mod.lessons.map((les) => (
                          <div 
                            key={les.id} 
                            className="bg-slate-900/90 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2.5">
                              <PlayCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                              <div>
                                <span className="font-semibold text-white block">{les.title}</span>
                                <span className="text-[10px] text-slate-400">{les.durationMinutes} mins • {les.summary}</span>
                              </div>
                            </div>

                            {les.isPreviewFree ? (
                              <button
                                onClick={() => setActiveLessonPreview(les)}
                                className="bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                              >
                                <span>Free Preview</span>
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-500 font-mono">Enrolled Only</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Classes Schedule */}
              {activeCourseModal.liveClasses && activeCourseModal.liveClasses.length > 0 && (
                <div className="bg-cyan-950/30 border border-cyan-900/60 p-5 rounded-2xl space-y-3">
                  <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Scheduled Interactive Live Masterclasses</span>
                  </h3>
                  {activeCourseModal.liveClasses.map((live) => (
                    <div key={live.id} className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <strong className="text-white">{live.title}</strong>
                        <span className="text-cyan-400 font-mono font-bold">{live.meetingPlatform}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{live.description}</p>
                      <div className="text-[10px] text-slate-300 flex items-center gap-4 pt-1">
                        <span>Instructor: <strong>{live.instructorName}</strong></span>
                        <span>Duration: <strong>{live.durationMinutes} mins</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Modal Footer with Fee Notice & Quote CTA */}
            <div className="p-6 border-t border-slate-800 bg-slate-950 sticky bottom-0 z-10">
              <FeeNoticeDisplay
                courseTitle={activeCourseModal.title}
                courseId={activeCourseModal.id}
                courseCode={activeCourseModal.id}
                exactPrice={activeCourseModal.tuitionNGN || 70000}
                exactPriceUSD={activeCourseModal.tuitionUSD || 120}
                isInternational={studentLocation === 'Outside Nigeria'}
                trainingType="online_course"
                deliveryMode="online_live"
                onOpenQuoteModal={(opts) => {
                  setActiveCourseModal(null);
                  handleOpenQuoteModal(opts);
                }}
                layout="modal"
              />
            </div>

          </div>
        </div>
      )}

      {/* 4. ENROLLMENT / APPLICATION DRAWER MODAL */}
      {enrollModalCourse && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl">
            
            {enrollmentSuccessData ? (
              // SUCCESS CONFIRMATION STATE
              <div className="p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-700 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-emerald-400">PAYMENT &amp; ENROLLMENT VERIFIED</span>
                  <h3 className="text-2xl font-bold text-white font-serif">Welcome to AITI Online!</h3>
                  <p className="text-xs text-slate-300">
                    Your student enrollment record has been initialized and classroom LMS access is unlocked.
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Enrollment ID:</span>
                    <strong className="text-cyan-400 font-mono">{enrollmentSuccessData.enrollmentNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Course:</span>
                    <strong className="text-white">{enrollmentSuccessData.courseTitle}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Study Mode:</span>
                    <strong className="text-white">{enrollmentSuccessData.studyMode}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Amount Paid:</span>
                    <strong className="text-emerald-400">{formatCurrency(enrollmentSuccessData.amountPaid, enrollmentSuccessData.currency, { showCode: true })}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment Ref:</span>
                    <strong className="text-slate-300 font-mono text-[10px]">{enrollmentSuccessData.paymentReference}</strong>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setEnrollModalCourse(null);
                      setEnrollmentSuccessData(null);
                      onNavigate('student_portal');
                    }}
                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider transition-all"
                  >
                    Open Student Classroom Portal
                  </button>

                  <button
                    onClick={() => {
                      setEnrollModalCourse(null);
                      setEnrollmentSuccessData(null);
                    }}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              // APPLICATION & CHECKOUT FORM
              <form onSubmit={handleCompleteEnrollment} className="p-6 sm:p-8 space-y-6">
                
                <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                      Enrollment &amp; Instant LMS Activation
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      {enrollModalCourse.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnrollModalCourse(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form Fields */}
                <div className="space-y-4 text-xs">
                  
                  {/* Full Name */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={enrollForm.fullName}
                      onChange={(e) => setEnrollForm(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="you@domain.com"
                        value={enrollForm.email}
                        onChange={(e) => setEnrollForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+234..."
                        value={enrollForm.phone}
                        onChange={(e) => setEnrollForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Country & Study Mode */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Country *</label>
                      <select
                        value={enrollForm.country}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEnrollForm(prev => ({ ...prev, country: val }));
                          if (val === 'Nigeria') setStudentLocation('Nigeria');
                          else setStudentLocation('Outside Nigeria');
                        }}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 focus:ring-1 focus:ring-cyan-400"
                      >
                        {COUNTRY_OPTIONS.map((c) => (
                          <option key={c.code} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Preferred Study Mode *</label>
                      <select
                        value={enrollForm.studyMode}
                        onChange={(e) => setEnrollForm(prev => ({ ...prev, studyMode: e.target.value as any }))}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 focus:ring-1 focus:ring-cyan-400"
                      >
                        <option value="Online">Online Live (Global LMS)</option>
                        <option value="Physical">Physical Lab (Tanke, Ilorin)</option>
                        <option value="Hybrid">Hybrid (Lab + Online)</option>
                      </select>
                    </div>
                  </div>

                  {/* Coupon Code input */}
                  <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 space-y-2">
                    <label className="block text-slate-300 font-semibold">Have a Scholarship / Coupon Code?</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. AITI2026 or GLOBALTECH"
                        value={enrollForm.couponCode}
                        onChange={(e) => setEnrollForm(prev => ({ ...prev, couponCode: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs uppercase"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold px-4 py-2 rounded-xl text-xs shrink-0"
                      >
                        Apply
                      </button>
                    </div>
                    {couponSuccess && <span className="text-[11px] text-emerald-400 font-bold block">{couponSuccess}</span>}
                    {couponError && <span className="text-[11px] text-rose-400 font-bold block">{couponError}</span>}
                  </div>

                  {/* Pricing Breakdown Card */}
                  {(() => {
                    const pricing = calculateStudentPricing(enrollModalCourse, studentLocation, enrollForm.studyMode);
                    let finalAmount = pricing.amount;
                    if (enrollForm.discountApplied > 0) {
                      if (enrollForm.discountApplied < 100) {
                        finalAmount = Math.max(0, finalAmount * ((100 - enrollForm.discountApplied) / 100));
                      } else {
                        finalAmount = Math.max(0, finalAmount - enrollForm.discountApplied);
                      }
                    }

                    return (
                      <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                        <div className="flex justify-between text-slate-400">
                          <span>Base Tuition Fee:</span>
                          <span>{formatCurrency(pricing.regularAmount, pricing.currency)}</span>
                        </div>
                        {pricing.hasPromo && (
                          <div className="flex justify-between text-cyan-400">
                            <span>Promotional Cohort Discount:</span>
                            <span>-{formatCurrency(pricing.regularAmount - pricing.amount, pricing.currency)}</span>
                          </div>
                        )}
                        {enrollForm.discountApplied > 0 && (
                          <div className="flex justify-between text-emerald-400">
                            <span>Coupon Discount:</span>
                            <span>{enrollForm.discountApplied}% OFF</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                          <span>Total Amount Due:</span>
                          <span className="text-emerald-400 text-base">{formatCurrency(finalAmount, pricing.currency, { showCode: true })}</span>
                        </div>
                      </div>
                    );
                  })()}

                </div>

                {/* Submit Action */}
                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
                  >
                    {isProcessingPayment ? (
                      <span>Verifying &amp; Initializing LMS...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Complete Verified Enrollment ({studentLocation === 'Nigeria' ? 'Paystack / Transfer' : 'Global Card'})</span>
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-slate-500">
                    256-bit encrypted checkout. Instant digital student receipt and LMS access credentials generated upon confirmation.
                  </p>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

      {/* Quote Request Modal */}
      <QuoteRequestModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        initialCourseTitle={quoteModalData.courseTitle}
        initialCourseId={quoteModalData.courseId}
        initialCourseCode={quoteModalData.courseCode}
        initialTrainingType={quoteModalData.trainingType || 'online_course'}
        initialDeliveryMode={quoteModalData.deliveryMode || 'online_live'}
        initialIsInternational={quoteModalData.isInternational || (studentLocation === 'Outside Nigeria')}
      />

    </div>
  );
};
