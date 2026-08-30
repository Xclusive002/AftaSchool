import React, { useState, useEffect } from 'react';
import { 
  Laptop, Calendar, Clock, Award, Users, CheckCircle2, 
  ArrowRight, Search, Filter, Sparkles, BookOpen, Download, 
  Layers, MapPin, Tag, ChevronRight, X, AlertCircle, Check,
  ShieldCheck, Phone, Mail, Building, Briefcase, GraduationCap, Video,
  Globe, CreditCard, ChevronDown, CheckCheck, HelpCircle, Code2,
  Cpu, Palette, Terminal, Smartphone, Lock, Bot
} from 'lucide-react';
import { ShortCourse, ShortCourseCategory } from '../../types';
import { useSettings } from '../../context/SettingsContext';
import { DocumentViewerModal } from '../common/DocumentViewer';
import { QuoteRequestModal } from './QuoteRequestModal';
import { FeeNoticeDisplay } from './FeeNoticeDisplay';

interface ShortCoursesPageProps {
  onNavigate?: (view: string, id?: string) => void;
  onSelectCourseForEnrollment?: (course: ShortCourse) => void;
}

export const ShortCoursesPage: React.FC<ShortCoursesPageProps> = ({ 
  onNavigate,
  onSelectCourseForEnrollment 
}) => {
  const { settings } = useSettings();
  const [courses, setCourses] = useState<ShortCourse[]>([]);
  const [categories, setCategories] = useState<ShortCourseCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDeliveryMode, setSelectedDeliveryMode] = useState<string>('all');
  const [currencyView, setCurrencyView] = useState<'NGN' | 'USD'>('NGN');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Modals state
  const [selectedCourseForDetail, setSelectedCourseForDetail] = useState<ShortCourse | null>(null);
  const [enrollingCourse, setEnrollingCourse] = useState<ShortCourse | null>(null);
  const [registrationStep, setRegistrationStep] = useState<number>(1);
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

  // Enrollment Form State (6-Step Registration)
  const [enrollForm, setEnrollForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    country: 'Nigeria',
    city: 'Ilorin',
    studentType: 'local' as 'local' | 'international',
    selectedCourseId: '',
    selectedCourseTitle: '',
    preferredSchedule: 'Weekday Regular (Mon, Wed, Fri: 9:00 AM - 11:00 AM)',
    trainingMode: 'physical' as 'physical' | 'online' | 'hybrid',
    paymentMethod: 'paystack' as 'paystack' | 'flutterwave' | 'bank_transfer' | 'stripe' | 'campus_desk',
    paymentReference: '',
    occupation: '',
    organization: '',
    feeAmount: 70000,
    feeCurrency: 'NGN' as 'NGN' | 'USD'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<{
    registrationId: string;
    courseTitle: string;
    fee: number;
    currency: string;
    fullName: string;
    phone: string;
    email: string;
    whatsapp: string;
    preferredSchedule: string;
    trainingMode: string;
    paymentStatus: string;
  } | null>(null);

  // Document Modal state
  const [documentModal, setDocumentModal] = useState<{
    isOpen: boolean;
    type: 'short_course_registration' | 'short_course_certificate';
    data: any;
  }>({
    isOpen: false,
    type: 'short_course_registration',
    data: null
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesRes, catsRes] = await Promise.all([
        fetch('/api/public/short-courses'),
        fetch('/api/public/short-course-categories')
      ]);
      const coursesData = await coursesRes.json();
      const catsData = await catsRes.json();

      if (coursesData.success) {
        setCourses(coursesData.shortCourses || []);
      }
      if (catsData.success) {
        setCategories(catsData.categories || []);
      }
    } catch (err) {
      console.error('Error loading short courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(c => {
    const matchesCategory = selectedCategory === 'all' || c.categoryId === selectedCategory || c.categoryName.toLowerCase() === selectedCategory.toLowerCase();
    const matchesMode = selectedDeliveryMode === 'all' || c.deliveryMode === selectedDeliveryMode || c.deliveryMode === 'hybrid';
    const matchesSearch = !searchQuery || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.targetAudience && c.targetAudience.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.toolsCovered && c.toolsCovered.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesMode && matchesSearch;
  });

  const handleStartEnroll = (course: ShortCourse, isInternational = false) => {
    setEnrollingCourse(course);
    setRegistrationStep(1);
    const isIntl = isInternational || currencyView === 'USD';
    const fee = isIntl ? (course.internationalOnlineFee || 120) : (course.feeNGN || course.feeGHS || 70000);
    const curr = isIntl ? 'USD' : 'NGN';
    
    setEnrollForm({
      fullName: '',
      email: '',
      phone: '',
      whatsapp: '',
      country: isIntl ? 'Ghana' : 'Nigeria',
      city: isIntl ? 'Accra' : 'Ilorin',
      studentType: isIntl ? 'international' : 'local',
      selectedCourseId: course.id,
      selectedCourseTitle: course.title,
      preferredSchedule: course.upcomingBatches?.[0] || 'Weekday Regular (Mon, Wed, Fri: 9:00 AM - 11:00 AM)',
      trainingMode: isIntl ? 'online' : ((course.deliveryMode as any) || 'physical'),
      paymentMethod: isIntl ? 'stripe' : 'paystack',
      paymentReference: '',
      occupation: '',
      organization: '',
      feeAmount: fee,
      feeCurrency: curr
    });
    setRegistrationSuccess(null);
  };

  const handleNextStep = () => {
    if (registrationStep === 1) {
      if (!enrollForm.fullName || !enrollForm.phone || !enrollForm.email) {
        alert('Please fill in your Full Name, Active Phone Number, and Email Address.');
        return;
      }
    }
    if (registrationStep < 5) {
      setRegistrationStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (registrationStep > 1) {
      setRegistrationStep(prev => prev - 1);
    }
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollingCourse) return;

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/public/short-course-enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: enrollForm.fullName,
          email: enrollForm.email,
          phone: enrollForm.phone,
          whatsapp: enrollForm.whatsapp || enrollForm.phone,
          country: enrollForm.country,
          city: enrollForm.city,
          studentType: enrollForm.studentType,
          courseId: enrollingCourse.id,
          courseTitle: enrollingCourse.title,
          preferredSchedule: enrollForm.preferredSchedule,
          trainingMode: enrollForm.trainingMode,
          paymentMethod: enrollForm.paymentMethod,
          paymentReference: enrollForm.paymentReference || `TXN-STC-${Date.now().toString(36).toUpperCase()}`,
          feeAmount: enrollForm.feeAmount,
          currency: enrollForm.feeCurrency,
          occupation: enrollForm.occupation,
          organization: enrollForm.organization
        })
      });

      const data = await res.json();
      if (data.success) {
        setRegistrationSuccess({
          registrationId: data.registrationId || `AITI/STC/2026/${Math.floor(1000 + Math.random() * 9000)}`,
          courseTitle: enrollingCourse.title,
          fee: enrollForm.feeAmount,
          currency: enrollForm.feeCurrency,
          fullName: enrollForm.fullName,
          phone: enrollForm.phone,
          email: enrollForm.email,
          whatsapp: enrollForm.whatsapp || enrollForm.phone,
          preferredSchedule: enrollForm.preferredSchedule,
          trainingMode: enrollForm.trainingMode,
          paymentStatus: enrollForm.paymentReference ? 'Verified Paid' : 'Pending Confirmation'
        });
        setRegistrationStep(6);
      } else {
        alert(data.error || 'Failed to complete registration. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      alert('Error submitting registration. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToCourses = () => {
    const el = document.getElementById('course-catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getCategoryIcon = (catName: string) => {
    const lower = catName.toLowerCase();
    if (lower.includes('design') || lower.includes('graphic')) return Palette;
    if (lower.includes('front-end') || lower.includes('web')) return Code2;
    if (lower.includes('back-end') || lower.includes('software')) return Terminal;
    if (lower.includes('mobile') || lower.includes('app')) return Smartphone;
    if (lower.includes('hardware') || lower.includes('network')) return Cpu;
    if (lower.includes('cyber') || lower.includes('security')) return Lock;
    if (lower.includes('ai') || lower.includes('data')) return Bot;
    return BookOpen;
  };

  return (
    <div id="short-courses-page" className="py-10 bg-slate-950 text-slate-100 min-h-screen">
      
      {/* 1. MASTER HERO SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative rounded-3xl overflow-hidden border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-cyan-950/50 to-slate-950 p-8 sm:p-14 shadow-2xl">
          {/* Subtle Glows */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-wide uppercase mb-5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AITI SHORT-TERM PROFESSIONAL COURSES</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight text-white mb-5 leading-tight">
              MASTER A PROFESSIONAL TECH SKILL IN <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300">JUST 2 MONTHS</span>
            </h1>
            
            <p className="text-base sm:text-xl text-slate-300 font-normal mb-8 leading-relaxed max-w-3xl">
              Gain practical, industry-relevant technology skills through intensive hands-on training designed for students, graduates, professionals, entrepreneurs and anyone ready to build a career in technology.
            </p>

            {/* CTAs & Currency Toggle */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <button
                id="hero-enroll-now-btn"
                onClick={() => {
                  if (filteredCourses.length > 0) {
                    handleStartEnroll(filteredCourses[0]);
                  } else {
                    scrollToCourses();
                  }
                }}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 via-sky-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black rounded-2xl text-sm transition-all duration-200 shadow-xl shadow-cyan-500/25 flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                <span>ENROLL NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-explore-courses-btn"
                onClick={scrollToCourses}
                className="px-7 py-4 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500/50 rounded-2xl text-sm font-bold transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>EXPLORE COURSES</span>
              </button>

              {/* Currency Selector Pill */}
              <div className="ml-auto flex items-center bg-slate-900/90 border border-slate-800 rounded-2xl p-1 text-xs">
                <span className="text-slate-400 text-[11px] px-3 font-semibold hidden sm:inline">Pricing Display:</span>
                <button
                  onClick={() => setCurrencyView('NGN')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                    currencyView === 'NGN'
                      ? 'bg-cyan-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🇳🇬 Nigerian Naira (₦)
                </button>
                <button
                  onClick={() => setCurrencyView('USD')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                    currencyView === 'USD'
                      ? 'bg-cyan-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🌍 International USD ($)
                </button>
              </div>
            </div>

            {/* Value Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold text-slate-300 pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-2 bg-slate-950/60 px-3.5 py-2.5 rounded-xl border border-slate-800">
                <Clock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>2 Months (8 Weeks)</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-950/60 px-3.5 py-2.5 rounded-xl border border-slate-800">
                <Calendar className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>3 Days / Wk (2h Class)</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-950/60 px-3.5 py-2.5 rounded-xl border border-slate-800">
                <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Verifiable Certificate</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-950/60 px-3.5 py-2.5 rounded-xl border border-slate-800">
                <Building className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Physical Lab & Online Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STANDARD COURSE STRUCTURE & VALUE PROPOSITION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Structure Breakdown Card */}
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Standard Course Architecture</h3>
                <p className="text-xs text-slate-400">Consistent, rigorous training format across all 7 professional specializations</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                  <Clock className="w-4 h-4" />
                  <span>Duration: 2 Months (8 Weeks)</span>
                </div>
                <p className="text-xs text-slate-300">
                  Intensive schedule structured for quick mastery without sacrificing foundational depth or hands-on practice.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
                  <Calendar className="w-4 h-4" />
                  <span>Schedule: 3 Days Per Week</span>
                </div>
                <p className="text-xs text-slate-300">
                  2 hours per session with dedicated practical lab slots. Available in Morning, Evening, and Weekend schedules.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center gap-2 text-teal-400 font-bold text-xs">
                  <Laptop className="w-4 h-4" />
                  <span>Delivery: Physical, Online & Hybrid</span>
                </div>
                <p className="text-xs text-slate-300">
                  Hands-on workstation access at Tanke Campus, Ilorin, or interactive live virtual classroom for remote students.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <Award className="w-4 h-4" />
                  <span>Verifiable Certificate Included</span>
                </div>
                <p className="text-xs text-slate-300">
                  QR-coded certificate issued upon completion of class attendance, assignments, and the capstone project.
                </p>
              </div>
            </div>

            {/* Standard Tuition Pricing Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-slate-950 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block">Institutional Default Tuition</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    {currencyView === 'NGN' ? '₦70,000' : '$120 - $160 USD'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {currencyView === 'NGN' ? 'per 2-Month course (Local)' : 'for International Online Cohorts'}
                  </span>
                </div>
              </div>
              <button
                onClick={scrollToCourses}
                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <span>View All 7 Courses</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Who Can Enroll Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <GraduationCap className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">Who Can Enroll?</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Our short-term courses are designed for learners at different stages of their education and careers:
              </p>

              <div className="space-y-2.5 text-xs text-slate-200">
                {[
                  { title: 'Students & Undergraduates', desc: 'Gain practical tech skills alongside academic studies' },
                  { title: 'Graduates & NYSC Corp Members', desc: 'Accelerate employability and portfolio building' },
                  { title: 'SIWES & SWEP Students', desc: 'Fulfill mandatory industrial training with real skills' },
                  { title: 'Working Professionals', desc: 'Upskill or transition into high-demand tech roles' },
                  { title: 'Entrepreneurs & Founders', desc: 'Build your own digital products and automate business' },
                  { title: 'Beginners & Enthusiasts', desc: 'Start from absolute scratch with patient mentorship' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">{item.title}</strong>
                      <span className="text-[11px] text-slate-400">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 block text-center">
                No strict prior programming background required for beginner cohorts.
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. WHY CHOOSE AITI SHORT-TERM COURSES (VALUE PILLARS) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold block mb-2">
              THE AITI ADVANTAGE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Why Choose AITI Short-Term Courses?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Every course is engineered to deliver immediate real-world competency, portfolio artifacts, and recognized certification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Laptop,
                title: 'Practical Hands-On Labs',
                desc: '80% practical workstation training using modern tools, frameworks, and real client simulation scenarios.'
              },
              {
                icon: Briefcase,
                title: 'Real-World Capstone Project',
                desc: 'Graduate with a verified, portfolio-ready project to demonstrate your skills to employers or clients.'
              },
              {
                icon: Users,
                title: 'Expert Faculty Mentorship',
                desc: 'Learn directly from practicing software engineers, designers, and cybersecurity consultants in Ilorin.'
              },
              {
                icon: ShieldCheck,
                title: 'Verifiable Certification',
                desc: 'Receive an official QR-verifiable certificate recognized for career advancement and academic portfolio.'
              },
              {
                icon: Clock,
                title: 'Flexible Cohort Schedules',
                desc: 'Morning, Evening, and Weekend batches designed so you can learn without interrupting school or work.'
              },
              {
                icon: Video,
                title: 'Interactive Live Online Option',
                desc: 'Attend live virtual classrooms with screen sharing, direct instructor Q&A, and archived session recordings.'
              },
              {
                icon: Globe,
                title: 'International Student Access',
                desc: 'Dedicated USD online pricing and schedules for African and global students joining our virtual cohorts.'
              },
              {
                icon: Building,
                title: 'State-of-the-Art Labs',
                desc: 'Air-conditioned computer labs with high-speed fiber internet and uninterrupted power supply in Tanke, Ilorin.'
              }
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 hover:border-cyan-500/40 transition-colors space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-white">{pillar.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. COURSE CATALOG SECTION */}
      <div id="course-catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>EXPLORE ALL 7 PROFESSIONAL TRACKS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Short-Term Course Catalog
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Select your desired specialization to view modules, schedule, tools covered, and tuition details.
            </p>
          </div>

          {/* Currency Switcher */}
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto">
            <span className="text-xs text-slate-400 font-semibold px-2">Show Fee In:</span>
            <button
              onClick={() => setCurrencyView('NGN')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currencyView === 'NGN' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ₦ NGN (Nigeria)
            </button>
            <button
              onClick={() => setCurrencyView('USD')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currencyView === 'USD' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              $ USD (International)
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="search-short-courses-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses (e.g., Python, Graphic, React, Hardware...)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Delivery Mode Tabs */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full md:w-auto overflow-x-auto">
              {[
                { id: 'all', label: 'All Modes' },
                { id: 'physical', label: '📍 Physical Lab' },
                { id: 'online', label: '💻 Online Live' },
                { id: 'hybrid', label: '🔄 Hybrid Flex' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  id={`mode-tab-${mode.id}`}
                  onClick={() => setSelectedDeliveryMode(mode.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedDeliveryMode === mode.id
                      ? 'bg-cyan-500 text-slate-950 shadow font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              <button
                id="cat-pill-all"
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === 'all'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All Tracks ({courses.length})</span>
              </button>

              {categories.map((cat) => {
                const count = courses.filter(c => c.categoryId === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    id={`cat-pill-${cat.id}`}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      selectedCategory === cat.id
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-sm'
                        : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-slate-400">Loading AITI Short-Term Professional Courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-200 mb-1">No short courses match your criteria</h3>
            <p className="text-sm text-slate-400 mb-4">Try clearing filters or search terms.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSelectedDeliveryMode('all'); setSearchQuery(''); }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl text-xs font-bold transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const displayFeeNGN = course.feeNGN || course.feeGHS || 70000;
              const displayFeeUSD = course.internationalOnlineFee || 120;
              const IconComp = getCategoryIcon(course.categoryName);

              return (
                <div 
                  key={course.id}
                  id={`short-course-card-${course.id}`}
                  className="group flex flex-col bg-slate-900/90 rounded-3xl border border-slate-800 hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-950/30 transition-all duration-200 overflow-hidden"
                >
                  {/* Card Banner Image & Badges */}
                  <div className="relative h-48 overflow-hidden bg-slate-950">
                    <img
                      src={course.bannerImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'}
                      alt={course.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    
                    {/* Category Chip */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-slate-950/90 text-cyan-300 border border-cyan-700/60 backdrop-blur-sm flex items-center gap-1">
                        <IconComp className="w-3 h-3 text-cyan-400" />
                        <span>{course.categoryName}</span>
                      </span>
                    </div>

                    {/* Mode Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize backdrop-blur-sm ${
                        course.deliveryMode === 'physical'
                          ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-700/60'
                          : course.deliveryMode === 'online'
                          ? 'bg-purple-950/90 text-purple-300 border border-purple-700/60'
                          : 'bg-amber-950/90 text-amber-300 border border-amber-700/60'
                      }`}>
                        {course.deliveryMode === 'physical' ? '📍 In-Person Lab' : course.deliveryMode === 'online' ? '💻 Online Live' : '🔄 Hybrid Flex'}
                      </span>
                    </div>

                    {/* Course Code & Duration overlay */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-300 bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-700 text-[11px]">
                        {course.code}
                      </span>
                      <span className="font-bold text-cyan-300 bg-slate-900/90 px-2.5 py-0.5 rounded-md border border-slate-700 text-[11px] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{course.durationWeeks || 8} Weeks • 3 Days/Wk</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                        {course.description}
                      </p>

                      {/* Tools Covered Pills */}
                      {course.toolsCovered && course.toolsCovered.length > 0 && (
                        <div className="mb-4">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                            Tools & Technologies
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {course.toolsCovered.slice(0, 4).map((tool, tIdx) => (
                              <span key={tIdx} className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] text-cyan-300 font-mono">
                                {tool}
                              </span>
                            ))}
                            {course.toolsCovered.length > 4 && (
                              <span className="px-1.5 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] text-slate-400 font-mono">
                                +{course.toolsCovered.length - 4}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Tuition & Get Current Fee Display */}
                      <FeeNoticeDisplay
                        courseTitle={course.title}
                        courseId={course.id}
                        courseCode={course.code}
                        exactPrice={course.feeNGN || 70000}
                        exactPriceUSD={course.internationalOnlineFee || 120}
                        isInternational={currencyView === 'USD' || course.deliveryMode === 'online'}
                        trainingType="short_course"
                        deliveryMode={course.deliveryMode === 'online' ? 'online_live' : course.deliveryMode === 'hybrid' ? 'hybrid' : 'physical_campus'}
                        onOpenQuoteModal={handleOpenQuoteModal}
                        layout="card"
                      />
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-800/80 space-y-2">
                      <div className="flex items-center gap-2">
                        <button
                          id={`view-course-btn-${course.id}`}
                          onClick={() => setSelectedCourseForDetail(course)}
                          className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                          <span>COURSE OUTLINE</span>
                        </button>
                        <button
                          id={`quote-btn-${course.id}`}
                          onClick={() => handleOpenQuoteModal({
                            courseTitle: course.title,
                            courseId: course.id,
                            courseCode: course.code,
                            trainingType: 'short_course',
                            deliveryMode: course.deliveryMode === 'online' ? 'online_live' : 'physical_campus',
                            isInternational: currencyView === 'USD'
                          })}
                          className="flex-1 py-2.5 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-navy-950 font-black rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>GET FEE QUOTE</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] px-1 text-slate-400">
                        <button
                          onClick={() => handleOpenQuoteModal({
                            courseTitle: course.title,
                            courseId: course.id,
                            courseCode: course.code,
                            trainingType: 'short_course',
                            deliveryMode: 'online_live',
                            isInternational: false
                          })}
                          className="hover:text-cyan-400 flex items-center gap-1 transition-colors"
                        >
                          <span>💻 Online Training Fee</span>
                        </button>
                        <button
                          onClick={() => handleOpenQuoteModal({
                            courseTitle: course.title,
                            courseId: course.id,
                            courseCode: course.code,
                            trainingType: 'short_course',
                            deliveryMode: 'online_live',
                            isInternational: true
                          })}
                          className="hover:text-amber-400 flex items-center gap-1 transition-colors"
                        >
                          <span>🌍 International USD Quote</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. COURSE DETAIL & 5-MODULE SYLLABUS MODAL */}
      {selectedCourseForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {selectedCourseForDetail.code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                    {selectedCourseForDetail.categoryName}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                    2 Months (8 Weeks)
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {selectedCourseForDetail.title}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    Tuition available on request
                  </span>
                  <span className="text-slate-500 text-xs">•</span>
                  <span className="text-xs text-slate-400">Physical Lab & Online Live Cohorts</span>
                </div>
              </div>
              <button
                id="close-syllabus-modal-btn"
                onClick={() => setSelectedCourseForDetail(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Fee Notice & Quote Actions within Modal */}
            <FeeNoticeDisplay
              courseTitle={selectedCourseForDetail.title}
              courseId={selectedCourseForDetail.id}
              courseCode={selectedCourseForDetail.code}
              exactPrice={selectedCourseForDetail.feeNGN || 70000}
              exactPriceUSD={selectedCourseForDetail.internationalOnlineFee || 120}
              isInternational={currencyView === 'USD' || selectedCourseForDetail.deliveryMode === 'online'}
              trainingType="short_course"
              deliveryMode={selectedCourseForDetail.deliveryMode === 'online' ? 'online_live' : 'physical_campus'}
              onOpenQuoteModal={(opts) => {
                setSelectedCourseForDetail(null);
                handleOpenQuoteModal(opts);
              }}
              layout="modal"
            />

            {/* Course Overview */}
            <div>
              <h4 className="text-xs uppercase font-bold text-cyan-400 tracking-wider mb-2">Course Overview</h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                {selectedCourseForDetail.description}
              </p>
            </div>

            {/* Tools Covered */}
            {selectedCourseForDetail.toolsCovered && selectedCourseForDetail.toolsCovered.length > 0 && (
              <div>
                <h4 className="text-xs uppercase font-bold text-cyan-400 tracking-wider mb-2">Tools & Technologies Covered</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCourseForDetail.toolsCovered.map((tool, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 font-semibold">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Complete 5-Module Syllabus Breakdown */}
            <div>
              <h4 className="text-xs uppercase font-bold text-cyan-400 tracking-wider mb-3">
                Curriculum & Module Breakdown (5 Key Modules)
              </h4>
              <div className="space-y-3">
                {selectedCourseForDetail.modules && selectedCourseForDetail.modules.length > 0 ? (
                  selectedCourseForDetail.modules.map((mod) => (
                    <div key={mod.moduleNumber} className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-300">
                          Module {mod.moduleNumber}: {mod.title}
                        </span>
                        {mod.duration && (
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            {mod.duration}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{mod.description}</p>
                      {mod.topics && mod.topics.length > 0 && (
                        <div className="pt-2 border-t border-slate-800/80">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Key Topics:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-300">
                            {mod.topics.map((top, tIdx) => (
                              <div key={tIdx} className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                                <span>{top}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : selectedCourseForDetail.syllabus && selectedCourseForDetail.syllabus.length > 0 ? (
                  selectedCourseForDetail.syllabus.map((syl) => (
                    <div key={syl.week} className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                      <span className="text-xs font-bold text-cyan-300">Week {syl.week}: {syl.title}</span>
                      <ul className="text-xs text-slate-400 space-y-1">
                        {syl.topics.map((t, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">Curriculum outline is actively updated by the department.</p>
                )}
              </div>
            </div>

            {/* Capstone Final Project */}
            {selectedCourseForDetail.finalProject && (
              <div className="bg-gradient-to-br from-cyan-950/50 to-slate-950 p-5 rounded-2xl border border-cyan-500/40 space-y-2">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase tracking-wide">
                  <Briefcase className="w-4 h-4 text-cyan-400" />
                  <span>Capstone Final Project (Mandatory for Certification)</span>
                </div>
                <h5 className="text-sm font-bold text-white">{selectedCourseForDetail.finalProject.title}</h5>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedCourseForDetail.finalProject.description}</p>
                {selectedCourseForDetail.finalProject.deliverables && (
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Expected Deliverables:</span>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {selectedCourseForDetail.finalProject.deliverables.map((del, dIdx) => (
                        <li key={dIdx} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span>{del}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Learning Outcomes */}
            {selectedCourseForDetail.learningOutcomes && selectedCourseForDetail.learningOutcomes.length > 0 && (
              <div>
                <h4 className="text-xs uppercase font-bold text-emerald-400 tracking-wider mb-2">Key Learning Outcomes</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedCourseForDetail.learningOutcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-200">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructor & Location */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCourseForDetail.instructorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={selectedCourseForDetail.instructorName}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-cyan-500/40"
                />
                <div>
                  <span className="text-xs font-bold text-white block">{selectedCourseForDetail.instructorName}</span>
                  <span className="text-[11px] text-slate-400">{selectedCourseForDetail.instructorTitle}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Training Location</span>
                <span className="text-xs font-semibold text-slate-200">{selectedCourseForDetail.location || 'AITI Campus, Tanke, Ilorin & Virtual Live'}</span>
              </div>
            </div>

            {/* Modal CTAs */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setSelectedCourseForDetail(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
              >
                Close Outline
              </button>
              <button
                onClick={() => {
                  const course = selectedCourseForDetail;
                  setSelectedCourseForDetail(null);
                  handleStartEnroll(course);
                }}
                className="px-7 py-2.5 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
              >
                <span>ENROLL IN THIS COURSE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 6. MULTI-CURRENCY 6-STEP ENROLLMENT WIZARD MODAL */}
      {enrollingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8">
            
            {/* Step Progress Header */}
            {registrationStep < 6 && (
              <div className="mb-6 border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
                      AITI SHORT COURSE ENROLLMENT WIZARD
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      Step {registrationStep} of 5: {
                        registrationStep === 1 ? 'Personal Contact Details' :
                        registrationStep === 2 ? 'Location & Currency Selection' :
                        registrationStep === 3 ? 'Preferred Training Schedule' :
                        registrationStep === 4 ? 'Delivery Mode Selection' :
                        'Tuition Fee Settlement'
                      }
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnrollingCourse(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Step indicator pills */}
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { step: 1, label: 'Contact' },
                    { step: 2, label: 'Location' },
                    { step: 3, label: 'Schedule' },
                    { step: 4, label: 'Mode' },
                    { step: 5, label: 'Payment' }
                  ].map((s) => (
                    <div
                      key={s.step}
                      className={`h-1.5 rounded-full transition-all ${
                        registrationStep >= s.step ? 'bg-cyan-400' : 'bg-slate-800'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* STEP 1: PERSONAL CONTACT DETAILS */}
            {registrationStep === 1 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-300">
                  Please provide your accurate contact information so we can generate your registration pass and assign your class group.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      value={enrollForm.fullName}
                      onChange={(e) => setEnrollForm({ ...enrollForm, fullName: e.target.value })}
                      placeholder="e.g. Ibrahim Korede Lawal"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Active Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={enrollForm.phone}
                        onChange={(e) => setEnrollForm({ ...enrollForm, phone: e.target.value, whatsapp: enrollForm.whatsapp || e.target.value })}
                        placeholder="0803 123 4567"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">WhatsApp Number *</label>
                      <input
                        type="tel"
                        required
                        value={enrollForm.whatsapp}
                        onChange={(e) => setEnrollForm({ ...enrollForm, whatsapp: e.target.value })}
                        placeholder="0803 123 4567"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={enrollForm.email}
                      onChange={(e) => setEnrollForm({ ...enrollForm, email: e.target.value })}
                      placeholder="student@example.com"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Occupation / Status</label>
                      <input
                        type="text"
                        value={enrollForm.occupation}
                        onChange={(e) => setEnrollForm({ ...enrollForm, occupation: e.target.value })}
                        placeholder="Student, NYSC Corp Member, Professional..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Company / Institution (Optional)</label>
                      <input
                        type="text"
                        value={enrollForm.organization}
                        onChange={(e) => setEnrollForm({ ...enrollForm, organization: e.target.value })}
                        placeholder="University, Polytechnic, Company..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEnrollingCourse(null)}
                    className="px-4 py-2.5 bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
                  >
                    <span>Next: Location & Currency</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: LOCATION & CURRENCY SELECTION */}
            {registrationStep === 2 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30">
                  <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block mb-1">Target Course</span>
                  <h4 className="text-base sm:text-lg font-bold text-white">{enrollingCourse.title}</h4>
                  <p className="text-xs text-slate-300 mt-1">{enrollingCourse.categoryName} • 2 Months (8 Weeks)</p>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-300">Are you enrolling within Nigeria or Internationally?</label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Nigeria Local Option */}
                    <div
                      onClick={() => {
                        const fee = enrollingCourse.feeNGN || enrollingCourse.feeGHS || 70000;
                        setEnrollForm({
                          ...enrollForm,
                          studentType: 'local',
                          country: 'Nigeria',
                          feeCurrency: 'NGN',
                          feeAmount: fee,
                          paymentMethod: 'paystack'
                        });
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        enrollForm.studentType === 'local'
                          ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">🇳🇬</span>
                        <span className="text-xs font-black text-emerald-400 font-mono">
                          ₦{(enrollingCourse.feeNGN || enrollingCourse.feeGHS || 70000).toLocaleString()}
                        </span>
                      </div>
                      <h5 className="font-bold text-sm text-white">Nigeria (Local Student)</h5>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Billed in Nigerian Naira (₦). Eligible for Physical Lab in Ilorin, Hybrid or Online.
                      </p>
                    </div>

                    {/* International Option */}
                    <div
                      onClick={() => {
                        const fee = enrollingCourse.internationalOnlineFee || 120;
                        setEnrollForm({
                          ...enrollForm,
                          studentType: 'international',
                          country: enrollForm.country === 'Nigeria' ? 'Ghana' : enrollForm.country,
                          feeCurrency: 'USD',
                          feeAmount: fee,
                          trainingMode: 'online',
                          paymentMethod: 'stripe'
                        });
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        enrollForm.studentType === 'international'
                          ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">🌍</span>
                        <span className="text-xs font-black text-cyan-300 font-mono">
                          ${(enrollingCourse.internationalOnlineFee || 120)} USD
                        </span>
                      </div>
                      <h5 className="font-bold text-sm text-white">International Student</h5>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Fixed USD pricing. Dedicated Online Live Classroom, interactive mentorship & global certificate.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Country of Residence</label>
                      <input
                        type="text"
                        value={enrollForm.country}
                        onChange={(e) => setEnrollForm({ ...enrollForm, country: e.target.value })}
                        placeholder="e.g. Nigeria, Ghana, United Kingdom..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">City / State</label>
                      <input
                        type="text"
                        value={enrollForm.city}
                        onChange={(e) => setEnrollForm({ ...enrollForm, city: e.target.value })}
                        placeholder="e.g. Ilorin, Lagos, Accra, London..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
                  >
                    <span>Next: Select Schedule</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PREFERRED SCHEDULE */}
            {registrationStep === 3 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-300">
                  Choose a cohort schedule that fits your professional or academic calendar (3 Days Per Week, 2 Hours Per Class):
                </p>

                <div className="space-y-2.5 text-xs">
                  {[
                    { 
                      id: 'Weekday Regular (Mon, Wed, Fri: 9:00 AM - 11:00 AM)', 
                      title: 'Weekday Regular Cohort', 
                      desc: 'Mondays, Wednesdays & Fridays (9:00 AM – 11:00 AM WAT) • Full interactive workstation practice' 
                    },
                    { 
                      id: 'Weekday Evening (Tue, Thu, Fri: 5:00 PM - 7:00 PM)', 
                      title: 'Weekday Evening Cohort', 
                      desc: 'Tuesdays, Thursdays & Fridays (5:00 PM – 7:00 PM WAT) • Designed for workers & students' 
                    },
                    { 
                      id: 'Weekend Intensive (Saturdays 9:00 AM - 3:00 PM)', 
                      title: 'Weekend Intensive Cohort', 
                      desc: 'Saturdays (9:00 AM – 3:00 PM WAT) • High-yield condensed lab sessions + online support' 
                    }
                  ].map((sch) => (
                    <label
                      key={sch.id}
                      className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                        enrollForm.preferredSchedule === sch.id
                          ? 'bg-cyan-950/50 border-cyan-400 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="preferredSchedule"
                          value={sch.id}
                          checked={enrollForm.preferredSchedule === sch.id}
                          onChange={(e) => setEnrollForm({ ...enrollForm, preferredSchedule: e.target.value })}
                          className="accent-cyan-400"
                        />
                        <div>
                          <p className="font-bold text-white">{sch.title}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{sch.desc}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
                  >
                    <span>Next: Delivery Mode</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: DELIVERY MODE */}
            {registrationStep === 4 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-300">
                  Select your preferred mode of instruction:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { 
                      id: 'physical', 
                      title: 'Physical Lab', 
                      desc: 'Hands-on at AITI Tanke Campus, Ilorin. Dedicated workstation & lab instructors.', 
                      icon: Laptop,
                      disabled: enrollForm.studentType === 'international'
                    },
                    { 
                      id: 'online', 
                      title: 'Online Live', 
                      desc: 'Interactive live Zoom/Meet practical sessions with recorded class archives.', 
                      icon: Video,
                      disabled: false
                    },
                    { 
                      id: 'hybrid', 
                      title: 'Hybrid Flex', 
                      desc: 'Combine campus lab practicals with live online weekday classes.', 
                      icon: Layers,
                      disabled: enrollForm.studentType === 'international'
                    }
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = enrollForm.trainingMode === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => {
                          if (!m.disabled) {
                            setEnrollForm({ ...enrollForm, trainingMode: m.id as any });
                          }
                        }}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                          m.disabled
                            ? 'opacity-40 cursor-not-allowed bg-slate-950 border-slate-800'
                            : isSelected 
                            ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-md cursor-pointer' 
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 cursor-pointer'
                        }`}
                      >
                        <div>
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${
                            isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <h4 className="font-bold text-sm text-white">{m.title}</h4>
                          <p className="text-[11px] text-slate-400 mt-1">{m.desc}</p>
                        </div>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-cyan-400 mt-3 block">✓ Selected</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
                  >
                    <span>Next: Tuition Settlement</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: PAYMENT DETAILS */}
            {registrationStep === 5 && (
              <form onSubmit={handleSubmitRegistration} className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-cyan-500/30 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-400 block">Total Tuition Fee</span>
                    <strong className="text-2xl font-black text-emerald-400">
                      {enrollForm.feeCurrency === 'NGN' ? `₦${enrollForm.feeAmount.toLocaleString()}` : `$${enrollForm.feeAmount} USD`}
                    </strong>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {enrollForm.feeCurrency === 'NGN' ? 'Nigerian Naira' : 'United States Dollar (No auto-conversion)'}
                    </span>
                  </div>
                  <div className="text-right text-slate-300">
                    <span>Course: <strong className="text-white">{enrollingCourse.title}</strong></span>
                    <p className="text-[11px] text-cyan-400 capitalize mt-0.5">{enrollForm.trainingMode} • {enrollForm.preferredSchedule.split('(')[0]}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Select Payment Channel</label>
                  
                  {enrollForm.feeCurrency === 'NGN' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      {[
                        { id: 'paystack', label: 'Paystack (Card / USSD)' },
                        { id: 'flutterwave', label: 'Flutterwave' },
                        { id: 'bank_transfer', label: 'Direct Bank Transfer' }
                      ].map((pm) => (
                        <button
                          type="button"
                          key={pm.id}
                          onClick={() => setEnrollForm({ ...enrollForm, paymentMethod: pm.id as any })}
                          className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                            enrollForm.paymentMethod === pm.id
                              ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {pm.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      {[
                        { id: 'stripe', label: 'International Card (Stripe)' },
                        { id: 'flutterwave', label: 'Flutterwave Global' },
                        { id: 'bank_transfer', label: 'International Wire / Transfer' }
                      ].map((pm) => (
                        <button
                          type="button"
                          key={pm.id}
                          onClick={() => setEnrollForm({ ...enrollForm, paymentMethod: pm.id as any })}
                          className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                            enrollForm.paymentMethod === pm.id
                              ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {pm.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Institutional Account Details */}
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs space-y-1.5">
                  <span className="font-bold text-cyan-400 block">Official Institutional Account:</span>
                  <p className="text-slate-200">Account Name: <strong>AFTATECH IT CONSULT & INST</strong></p>
                  <p className="text-slate-200">Bank: <strong>United Bank for Africa (UBA) / Zenith Bank</strong></p>
                  <p className="text-slate-200">Account Number: <strong>1024567890 (NGN)</strong> • Reference: <strong>{enrollForm.fullName || 'Participant Name'}</strong></p>
                  <p className="text-slate-400 text-[11px]">Instant automated receipt & Registration ID is generated upon submission.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Bank Reference / Payment Proof ID (Optional for instant pass)
                  </label>
                  <input
                    type="text"
                    value={enrollForm.paymentReference}
                    onChange={(e) => setEnrollForm({ ...enrollForm, paymentReference: e.target.value })}
                    placeholder="e.g. UBA-98374291 or leave empty for instant portal activation"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-7 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Processing Registration...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>COMPLETE ENROLLMENT</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 6: CONFIRMATION & REGISTRATION ID */}
            {registrationStep === 6 && registrationSuccess && (
              <div className="text-center py-4 space-y-5 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Step 6: Registration Confirmed</span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">Enrollment Successful!</h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                    Welcome <strong className="text-cyan-400">{registrationSuccess.fullName}</strong>. Your short course enrollment is active.
                  </p>
                </div>

                {/* Generated Registration ID Banner */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-cyan-500/40 text-left space-y-3 text-xs max-w-lg mx-auto shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-slate-400 font-semibold">Short Course Registration ID:</span>
                    <span className="font-mono font-black text-sm text-cyan-300 bg-cyan-950/60 px-3 py-1 rounded-lg border border-cyan-500/40">
                      {registrationSuccess.registrationId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Course Track:</span>
                    <span className="font-bold text-white">{registrationSuccess.courseTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Schedule:</span>
                    <span className="text-slate-200">{registrationSuccess.preferredSchedule}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mode:</span>
                    <span className="text-slate-200 capitalize">{registrationSuccess.trainingMode}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-2">
                    <span className="text-slate-400">Payment Status:</span>
                    <span className="font-bold text-emerald-400">
                      {registrationSuccess.currency === 'NGN' ? `₦${registrationSuccess.fee.toLocaleString()}` : `$${registrationSuccess.fee} USD`} ({registrationSuccess.paymentStatus})
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setDocumentModal({
                        isOpen: true,
                        type: 'short_course_registration',
                        data: {
                          registrationId: registrationSuccess.registrationId,
                          fullName: registrationSuccess.fullName,
                          email: registrationSuccess.email,
                          phone: registrationSuccess.phone,
                          whatsapp: registrationSuccess.whatsapp,
                          courseTitle: registrationSuccess.courseTitle,
                          preferredSchedule: registrationSuccess.preferredSchedule,
                          trainingMode: registrationSuccess.trainingMode,
                          fee: registrationSuccess.fee,
                          currency: registrationSuccess.currency,
                          paymentStatus: registrationSuccess.paymentStatus
                        }
                      });
                    }}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>Print Registration Pass</span>
                  </button>

                  <button
                    onClick={() => {
                      setEnrollingCourse(null);
                      if (onNavigate) {
                        onNavigate('portal_short_course', registrationSuccess.registrationId);
                      }
                    }}
                    className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-cyan-500/25 flex items-center gap-1.5"
                  >
                    <span>Go to Short Course Student Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Official Document Viewer Modal */}
      {documentModal.isOpen && (
        <DocumentViewerModal
          type={documentModal.type}
          data={documentModal.data}
          onClose={() => setDocumentModal({ ...documentModal, isOpen: false })}
        />
      )}

      {/* Quote Request Modal */}
      <QuoteRequestModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        initialCourseTitle={quoteModalData.courseTitle}
        initialCourseId={quoteModalData.courseId}
        initialCourseCode={quoteModalData.courseCode}
        initialTrainingType={quoteModalData.trainingType || 'short_course'}
        initialDeliveryMode={quoteModalData.deliveryMode || 'physical_campus'}
        initialIsInternational={quoteModalData.isInternational || false}
      />

    </div>
  );
};
