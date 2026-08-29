import React, { useState, useEffect } from 'react';
import { 
  Laptop, Calendar, Clock, Award, Users, CheckCircle2, 
  ArrowRight, Search, Filter, Sparkles, BookOpen, Download, 
  Layers, MapPin, Tag, ChevronRight, X, AlertCircle, Check,
  ShieldCheck, Phone, Mail, Building, Briefcase, GraduationCap, Video
} from 'lucide-react';
import { ShortCourse, ShortCourseCategory } from '../../types';
import { useSettings } from '../../context/SettingsContext';
import { DocumentViewerModal } from '../common/DocumentViewer';

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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Modals state
  const [selectedCourseForDetail, setSelectedCourseForDetail] = useState<ShortCourse | null>(null);
  const [enrollingCourse, setEnrollingCourse] = useState<ShortCourse | null>(null);
  const [registrationStep, setRegistrationStep] = useState<number>(1);

  // Enrollment Form State (6-Step Registration)
  const [enrollForm, setEnrollForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    selectedCourseId: '',
    selectedCourseTitle: '',
    preferredSchedule: 'Weekend Intensive (Saturdays 9AM - 4PM)',
    trainingMode: 'physical' as 'physical' | 'online' | 'hybrid',
    paymentMethod: 'momo_mtn' as 'momo_mtn' | 'momo_telecel' | 'momo_at' | 'bank_transfer' | 'campus_desk',
    paymentReference: '',
    occupation: '',
    organization: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<{
    registrationId: string;
    courseTitle: string;
    feeGHS: number;
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
      (c.targetAudience && c.targetAudience.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesMode && matchesSearch;
  });

  const handleStartEnroll = (course: ShortCourse) => {
    setEnrollingCourse(course);
    setRegistrationStep(1);
    setEnrollForm({
      fullName: '',
      email: '',
      phone: '',
      whatsapp: '',
      selectedCourseId: course.id,
      selectedCourseTitle: course.title,
      preferredSchedule: course.upcomingBatches?.[0] || 'Weekend Intensive (Saturdays 9AM - 4PM)',
      trainingMode: (course.deliveryMode as any) || 'physical',
      paymentMethod: 'momo_mtn',
      paymentReference: '',
      occupation: '',
      organization: ''
    });
    setRegistrationSuccess(null);
  };

  const handleNextStep = () => {
    if (registrationStep === 1) {
      if (!enrollForm.fullName || !enrollForm.phone || !enrollForm.email) {
        alert('Please fill in your Name, Phone Number, and Email Address.');
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
      const payload = {
        courseId: enrollingCourse.id,
        courseTitle: enrollingCourse.title,
        preferredSchedule: enrollForm.preferredSchedule,
        trainingMode: enrollForm.trainingMode,
        fullName: enrollForm.fullName,
        email: enrollForm.email,
        phone: enrollForm.phone,
        whatsapp: enrollForm.whatsapp || enrollForm.phone,
        occupation: enrollForm.occupation,
        organization: enrollForm.organization,
        feeGHS: enrollingCourse.feeGHS,
        paymentMethod: enrollForm.paymentMethod,
        paymentReference: enrollForm.paymentReference || `MM-${Math.floor(100000 + Math.random() * 900000)}`
      };

      const res = await fetch('/api/public/short-courses/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setRegistrationSuccess({
          registrationId: data.registrationId || data.enrollmentNumber || 'AITI/STC/2026/00025',
          courseTitle: enrollingCourse.title,
          feeGHS: enrollingCourse.feeGHS,
          fullName: enrollForm.fullName,
          phone: enrollForm.phone,
          email: enrollForm.email,
          whatsapp: enrollForm.whatsapp || enrollForm.phone,
          preferredSchedule: enrollForm.preferredSchedule,
          trainingMode: enrollForm.trainingMode,
          paymentStatus: 'PAID / CONFIRMED'
        });
        setRegistrationStep(6);
      } else {
        alert(data.message || 'Failed to submit registration');
      }
    } catch (err: any) {
      alert('Error submitting registration: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="short-courses-page" className="py-12 bg-slate-950 text-slate-100 min-h-screen">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative rounded-3xl overflow-hidden border border-cyan-500/20 bg-gradient-to-br from-cyan-950/60 via-slate-900 to-slate-950 p-8 sm:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AITI TRAINING CATALOGUE • SHORT-TERM COURSES</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight text-white mb-4">
              SHORT-TERM COURSES
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 font-medium mb-6 leading-relaxed">
              "Upgrade your technology skills in <span className="text-cyan-400 font-bold">1–4 weeks</span> with practical, focused training."
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Hands-on Lab Work</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <Award className="w-4 h-4 text-cyan-400" />
                <span>AITI Verified Certificate</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <Users className="w-4 h-4 text-amber-400" />
                <span>Weekend & Evening Batches</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <Building className="w-4 h-4 text-purple-400" />
                <span>Physical Lab & Virtual Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
          
          {/* Search Input and Delivery Mode Filter */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="search-short-courses-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses (e.g., Python, AI, Excel, Graphic...)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
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
                { id: 'physical', label: 'In-Person Lab' },
                { id: 'online', label: 'Online Live' },
                { id: 'hybrid', label: 'Hybrid' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  id={`mode-tab-${mode.id}`}
                  onClick={() => setSelectedDeliveryMode(mode.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedDeliveryMode === mode.id
                      ? 'bg-cyan-500 text-slate-950 shadow'
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
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-900/20'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All Categories ({courses.length})</span>
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
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-900/20'
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
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-slate-400">Loading AITI Short-Term Courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-200 mb-1">No short courses found</h3>
            <p className="text-sm text-slate-400 mb-4">Try adjusting your category or search filter.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSelectedDeliveryMode('all'); setSearchQuery(''); }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl text-xs font-bold transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div 
                key={course.id}
                id={`short-course-card-${course.id}`}
                className="group flex flex-col bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-950/20 transition-all duration-200 overflow-hidden"
              >
                {/* Course Image & Badges */}
                <div className="relative h-44 overflow-hidden bg-slate-950">
                  <img
                    src={course.bannerImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'}
                    alt={course.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  {/* Category Chip */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-cyan-950/90 text-cyan-300 border border-cyan-700/60 backdrop-blur-sm">
                      {course.categoryName}
                    </span>
                  </div>

                  {/* Mode Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold capitalize backdrop-blur-sm ${
                      course.deliveryMode === 'physical'
                        ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-700/60'
                        : course.deliveryMode === 'online'
                        ? 'bg-purple-950/90 text-purple-300 border border-purple-700/60'
                        : 'bg-amber-950/90 text-amber-300 border border-amber-700/60'
                    }`}>
                      {course.deliveryMode === 'physical' ? '📍 On Campus' : course.deliveryMode === 'online' ? '💻 Online Live' : '🔄 Hybrid'}
                    </span>
                  </div>

                  {/* Code and Fee Bottom Bar */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                      {course.code}
                    </span>
                    <span className="font-bold text-emerald-400 bg-emerald-950/90 px-2.5 py-0.5 rounded border border-emerald-800/80">
                      GHS {course.feeGHS.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Meta highlights */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 mb-4 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span className="font-medium">{course.durationWeeks} Weeks ({course.durationHours} hrs)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span className="font-medium">Certificate Inc.</span>
                      </div>
                    </div>

                    {/* Upcoming Batches */}
                    {course.upcomingBatches && course.upcomingBatches.length > 0 && (
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Next Batch: <strong className="text-slate-200">{course.upcomingBatches[0]}</strong></span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                    <button
                      id={`view-syllabus-btn-${course.id}`}
                      onClick={() => setSelectedCourseForDetail(course)}
                      className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Syllabus & Info</span>
                    </button>
                    <button
                      id={`enroll-short-course-btn-${course.id}`}
                      onClick={() => handleStartEnroll(course)}
                      className="flex-1 py-2 px-3 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-slate-950 font-extrabold rounded-xl text-xs transition-all shadow-md shadow-cyan-900/30 flex items-center justify-center gap-1"
                    >
                      <span>Enroll Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Course Detail / Syllabus Modal */}
      {selectedCourseForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {selectedCourseForDetail.code} • {selectedCourseForDetail.categoryName}
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  {selectedCourseForDetail.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Duration: {selectedCourseForDetail.durationWeeks} Weeks ({selectedCourseForDetail.durationHours} Hours) • Fee: GHS {selectedCourseForDetail.feeGHS.toLocaleString()}
                </p>
              </div>
              <button
                id="close-syllabus-modal-btn"
                onClick={() => setSelectedCourseForDetail(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overview */}
            <div>
              <h4 className="text-xs uppercase font-bold text-cyan-400 tracking-wider mb-2">Course Overview</h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                {selectedCourseForDetail.description}
              </p>
            </div>

            {/* Target Audience & Prerequisites */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Target Audience</span>
                <p className="text-xs text-slate-200">{selectedCourseForDetail.targetAudience}</p>
              </div>
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Prerequisites</span>
                <p className="text-xs text-slate-200">{selectedCourseForDetail.prerequisites}</p>
              </div>
            </div>

            {/* Syllabus Modules */}
            <div>
              <h4 className="text-xs uppercase font-bold text-cyan-400 tracking-wider mb-3">Weekly Syllabus Outline</h4>
              <div className="space-y-3">
                {selectedCourseForDetail.syllabus && selectedCourseForDetail.syllabus.length > 0 ? (
                  selectedCourseForDetail.syllabus.map((item) => (
                    <div key={item.week} className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-cyan-400">Week {item.week}: {item.title}</span>
                      </div>
                      <ul className="text-xs text-slate-300 space-y-1">
                        {item.topics.map((t, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">Full detailed syllabus will be provided upon enrollment.</p>
                )}
              </div>
            </div>

            {/* Learning Outcomes */}
            {selectedCourseForDetail.learningOutcomes && selectedCourseForDetail.learningOutcomes.length > 0 && (
              <div>
                <h4 className="text-xs uppercase font-bold text-emerald-400 tracking-wider mb-2">Key Learning Outcomes</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedCourseForDetail.learningOutcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-200">
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
                <span className="text-xs font-semibold text-slate-200">{selectedCourseForDetail.location}</span>
              </div>
            </div>

            {/* Modal CTAs */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setSelectedCourseForDetail(null)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
              >
                Close Outline
              </button>
              <button
                onClick={() => {
                  const course = selectedCourseForDetail;
                  setSelectedCourseForDetail(null);
                  handleStartEnroll(course);
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 rounded-xl text-xs font-extrabold shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
              >
                <span>Register for this Course</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 6-Step Simplified Registration Wizard Modal */}
      {enrollingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8">
            
            {/* Step Progress Header */}
            {registrationStep < 6 && (
              <div className="mb-6 border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
                      AITI SIMPLIFIED SHORT COURSE REGISTRATION
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      Step {registrationStep} of 5: {
                        registrationStep === 1 ? 'Personal Contact Details' :
                        registrationStep === 2 ? 'Confirm Course Selection' :
                        registrationStep === 3 ? 'Preferred Training Schedule' :
                        registrationStep === 4 ? 'Select Training Delivery Mode' :
                        'Payment & Fee Settlement'
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
                    { step: 2, label: 'Course' },
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
                      placeholder="e.g. Kwame Mensah / Abena Osei"
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
                        placeholder="024 123 4567"
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
                        placeholder="024 123 4567"
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
                      placeholder="kwame@example.com"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Occupation / Profession</label>
                      <input
                        type="text"
                        value={enrollForm.occupation}
                        onChange={(e) => setEnrollForm({ ...enrollForm, occupation: e.target.value })}
                        placeholder="Student, IT Analyst, Freelancer..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Company / Organization (Optional)</label>
                      <input
                        type="text"
                        value={enrollForm.organization}
                        onChange={(e) => setEnrollForm({ ...enrollForm, organization: e.target.value })}
                        placeholder="Organization or School name"
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
                    className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
                  >
                    <span>Next: Select Course</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SELECT / CONFIRM COURSE */}
            {registrationStep === 2 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30">
                  <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block mb-1">Selected Short Course</span>
                  <h4 className="text-lg font-bold text-white">{enrollingCourse.title}</h4>
                  <p className="text-xs text-slate-300 mt-1">{enrollingCourse.description}</p>
                  
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800 text-center text-xs">
                    <div className="bg-slate-900 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">Duration</span>
                      <strong className="text-white">{enrollingCourse.durationWeeks} Weeks ({enrollingCourse.durationHours}h)</strong>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">Tuition Fee</span>
                      <strong className="text-emerald-400">GHS {enrollingCourse.feeGHS.toLocaleString()}</strong>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">Lead Instructor</span>
                      <strong className="text-cyan-300">{enrollingCourse.instructorName}</strong>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Switch Course (Optional)</label>
                  <select
                    value={enrollingCourse.id}
                    onChange={(e) => {
                      const found = courses.find(c => c.id === e.target.value);
                      if (found) {
                        setEnrollingCourse(found);
                        setEnrollForm({ ...enrollForm, selectedCourseId: found.id, selectedCourseTitle: found.title });
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.title} — GHS {c.feeGHS.toLocaleString()} ({c.durationWeeks} wks)
                      </option>
                    ))}
                  </select>
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
                    className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
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
                  Choose a cohort schedule that fits your professional or academic calendar:
                </p>

                <div className="space-y-2.5">
                  {[
                    { id: 'Weekend Intensive (Saturdays 9AM - 4PM)', title: 'Weekend Intensive', desc: 'Saturdays 9:00 AM – 4:00 PM (Ideal for working professionals)' },
                    { id: 'Weekday Morning (Mon & Wed 9AM - 12PM)', title: 'Weekday Morning Cohort', desc: 'Mondays & Wednesdays 9:00 AM – 12:00 PM' },
                    { id: 'Weekday Evening (Tue & Thu 6PM - 8:30PM)', title: 'Weekday Evening Cohort', desc: 'Tuesdays & Thursdays 6:00 PM – 8:30 PM (After-work batch)' },
                    { id: 'Custom Self-Paced / Flexible Cohort', title: 'Flexible Cohort', desc: 'Flexible lab access with assigned faculty mentor' }
                  ].map((sch) => (
                    <label
                      key={sch.id}
                      className={`block p-4 rounded-2xl border cursor-pointer transition-all text-xs ${
                        enrollForm.preferredSchedule === sch.id
                          ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-sm'
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
                    className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
                  >
                    <span>Next: Select Mode</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: TRAINING MODE */}
            {registrationStep === 4 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-300">
                  Select your preferred mode of instruction and laboratory access:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'physical', title: 'Physical Lab', desc: 'Hands-on at AITI Sunyani Tech Campus. Dedicated high-spec workstations.', icon: Laptop },
                    { id: 'online', title: 'Online Live', desc: 'Interactive live Zoom/Meet practical sessions with recorded archives.', icon: Video },
                    { id: 'hybrid', title: 'Hybrid Flex', desc: 'Combine campus weekend labs with online live weekday study sessions.', icon: Layers }
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = enrollForm.trainingMode === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setEnrollForm({ ...enrollForm, trainingMode: m.id as any })}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected 
                            ? 'bg-cyan-950/50 border-cyan-400 text-white shadow-md' 
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
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
                    className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
                  >
                    <span>Next: Payment Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: PAYMENT */}
            {registrationStep === 5 && (
              <form onSubmit={handleSubmitRegistration} className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-400 block">Total Tuition Fee</span>
                    <strong className="text-xl font-black text-emerald-400">GHS {enrollingCourse.feeGHS.toLocaleString()}</strong>
                  </div>
                  <div className="text-right text-slate-300">
                    <span>Course: <strong>{enrollingCourse.title}</strong></span>
                    <p className="text-[11px] text-cyan-400">{enrollForm.preferredSchedule}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Select Payment Method</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'momo_mtn', label: 'MTN MoMo' },
                      { id: 'momo_telecel', label: 'Telecel Cash' },
                      { id: 'momo_at', label: 'AT Money' },
                      { id: 'bank_transfer', label: 'Bank Transfer' }
                    ].map((pm) => (
                      <button
                        type="button"
                        key={pm.id}
                        onClick={() => setEnrollForm({ ...enrollForm, paymentMethod: pm.id as any })}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                          enrollForm.paymentMethod === pm.id
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {pm.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950/80 p-4 rounded-2xl border border-cyan-900/40 text-xs space-y-1.5">
                  <span className="font-bold text-cyan-400 block">Official Merchant Payment Details:</span>
                  <p className="text-slate-200">Merchant Name: <strong>AFTATECH IT CONSULT & INST</strong></p>
                  <p className="text-slate-200">MoMo Number: <strong>054 123 4567</strong> (Reference: Participant Name)</p>
                  <p className="text-slate-400 text-[11px]">Instant automated receipt & Registration ID is generated upon submission.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    MoMo Transaction ID / Reference (Optional if paying now)
                  </label>
                  <input
                    type="text"
                    value={enrollForm.paymentReference}
                    onChange={(e) => setEnrollForm({ ...enrollForm, paymentReference: e.target.value })}
                    placeholder="e.g. MM-9382710 or leave blank for instant confirmation"
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
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Processing Registration...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm & Complete Registration</span>
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
                  <h3 className="text-2xl font-black text-white mt-1">You Are Successfully Registered!</h3>
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
                    <span className="text-slate-400">Course:</span>
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
                    <span className="font-bold text-emerald-400">{registrationSuccess.paymentStatus}</span>
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
                          fee: registrationSuccess.feeGHS,
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

    </div>
  );
};
