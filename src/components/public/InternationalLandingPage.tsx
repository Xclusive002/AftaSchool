import React, { useState } from 'react';
import { 
  Globe, ShieldCheck, Laptop, Clock, Award, Users, CheckCircle2, 
  ArrowRight, Sparkles, MessageCircle, Mail, Phone, ExternalLink, 
  CreditCard, BookOpen, Calendar, HelpCircle, MapPin, Search, DollarSign
} from 'lucide-react';
import { formatCurrency, calculateStudentPricing, COUNTRY_OPTIONS, CountryOption } from '../../services/currency';
import { INITIAL_ONLINE_COURSES, DetailedOnlineCourse } from '../../data/onlineCoursesSeed';
import { TECH_SCHOOL_IMAGES } from '../../data/techSchoolImages';
import { useSettings } from '../../context/SettingsContext';

interface InternationalLandingPageProps {
  onNavigate: (view: string, programId?: string) => void;
  onEnrollOnline?: (course: DetailedOnlineCourse) => void;
}

export const InternationalLandingPage: React.FC<InternationalLandingPageProps> = ({ onNavigate, onEnrollOnline }) => {
  const { settings } = useSettings();
  const [selectedCountry, setSelectedCountry] = useState<string>('US');
  const [selectedTimezone, setSelectedTimezone] = useState<string>('America/New_York (EST, UTC-5)');
  const [searchQuery, setSearchQuery] = useState('');

  const currentCountryObj = COUNTRY_OPTIONS.find(c => c.code === selectedCountry) || COUNTRY_OPTIONS[0];

  // Convert AITI scheduled time (e.g., 2:00 PM WAT, UTC+1) to chosen student timezone
  const getTimeInSelectedZone = (watHour: number, timezoneStr: string) => {
    // Basic timezone offset mapping
    if (timezoneStr.includes('UTC-5')) return `${watHour - 6}:00 AM (EST)`;
    if (timezoneStr.includes('UTC-4')) return `${watHour - 5}:00 AM (EDT)`;
    if (timezoneStr.includes('UTC+0')) return `${watHour - 1}:00 PM (GMT)`;
    if (timezoneStr.includes('UTC+1')) return `${watHour}:00 PM (WAT/BST)`;
    if (timezoneStr.includes('UTC+2')) return `${watHour + 1}:00 PM (CAT/SAST)`;
    if (timezoneStr.includes('UTC+3')) return `${watHour + 2}:00 PM (EAT/Cairo)`;
    if (timezoneStr.includes('UTC+4')) return `${watHour + 3}:00 PM (Dubai/GST)`;
    if (timezoneStr.includes('UTC+5:30')) return `${watHour + 4}:30 PM (IST)`;
    if (timezoneStr.includes('UTC+10')) return `${watHour + 9}:00 PM (AEST)`;
    return `${watHour}:00 PM (WAT / Nigeria Time)`;
  };

  const filteredCourses = INITIAL_ONLINE_COURSES.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.technologyArea.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-slate-950 border-b border-slate-800">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 blur-3xl pointer-events-none rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-3xl pointer-events-none rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold tracking-wider uppercase">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Global Remote Learning Pathway</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-serif tracking-tight leading-[1.15]">
                STUDY WITH AITI <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                  FROM ANYWHERE IN THE WORLD.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Learn practical technology skills remotely with AITI's flexible online training programs. Join live interactive cohorts, build real-world project portfolios, and earn industry-certified, QR-verifiable credentials in Software Engineering, Data & AI, Cybersecurity, UI/UX Design, and more.
              </p>

              {/* Country selector preview */}
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl max-w-lg space-y-3 shadow-xl">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Where are you joining from?
                  </span>
                  <span className="text-[11px] text-cyan-400 font-mono">USD International Rates</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    value={selectedCountry}
                    onChange={(e) => {
                      setSelectedCountry(e.target.value);
                      const opt = COUNTRY_OPTIONS.find(c => c.code === e.target.value);
                      if (opt) setSelectedTimezone(opt.timezone);
                    }}
                    className="bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                  >
                    {COUNTRY_OPTIONS.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name} ({c.dialCode})
                      </option>
                    ))}
                  </select>

                  <div className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Currency:</span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" /> USD (United States Dollar)
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <span>Scheduled Live Class Time:</span>
                  <strong className="text-cyan-300 font-mono">{getTimeInSelectedZone(2, selectedTimezone)}</strong>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('international-courses');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl text-xs tracking-wider shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-slate-950" />
                  <span>EXPLORE ONLINE COURSES (USD)</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>

                <button
                  onClick={() => onNavigate('contact')}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold px-5 py-3.5 rounded-xl text-xs transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-cyan-400" />
                  <span>Contact Global Admissions Desk</span>
                </button>
              </div>

            </div>

            {/* Right Side Visual Graphic */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl group">
                <img 
                  src={TECH_SCHOOL_IMAGES.learningExperience[0].url}
                  alt="International students learning online"
                  className="w-full h-80 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Complete Digital Campus
                    </span>
                    <span className="text-[10px] uppercase font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-full">
                      Global Access
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Access live interactive labs, recorded video modules, downloadable code resources, assignments, and digital QR-verified certificates.
                  </p>
                </div>
              </div>

              {/* Floating Quick Metric Badges */}
              <div className="absolute -top-4 -left-4 bg-slate-900/95 border border-slate-800 p-3 rounded-2xl shadow-xl flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Verification</span>
                  <span className="text-xs font-bold text-white">QR-Secured Credentials</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. 10-STEP INTERNATIONAL ENROLLMENT PATHWAY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
            Seamless Global Pathway
          </span>
          <h2 className="text-3xl font-extrabold text-white font-serif">
            How International Students Study with AITI
          </h2>
          <p className="text-xs text-slate-400">
            From online registration to instant LMS classroom unlock and digital graduation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { step: '01', title: 'Create Account', desc: 'Sign up in under 60 seconds with your email and international location.' },
            { step: '02', title: 'Choose Course', desc: 'Select any of our available tech courses with Online Delivery enabled.' },
            { step: '03', title: 'Select Online Mode', desc: 'Choose 100% remote online study mode tailored for international timezones.' },
            { step: '04', title: 'Transparent USD Price', desc: 'View exact independent USD pricing with zero hidden conversion charges.' },
            { step: '05', title: 'Submit Details', desc: 'Complete quick online application with optional bio or previous learning notes.' },
            { step: '06', title: 'International Payment', desc: 'Pay securely via supported global cards and verified payment gateways.' },
            { step: '07', title: 'Instant Activation', desc: 'Server-side payment verification instantly creates your student ID.' },
            { step: '08', title: 'Access LMS Classroom', desc: 'Unlock course dashboard, video lessons, downloadable files, and live meets.' },
            { step: '09', title: 'Hands-on Projects', desc: 'Submit practical assignments, participate in live Q&A, and take quizzes.' },
            { step: '10', title: 'Digital Certificate', desc: 'Receive your official AITI certificate with public QR verification upon completion.' }
          ].map((item) => (
            <div key={item.step} className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 p-5 rounded-2xl transition-all group flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-black text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-1 rounded-lg inline-block mb-3">
                  Step {item.step}
                </span>
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TIMEZONE INTERACTIVE CALCULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950 border border-cyan-900/50 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>Interactive Timezone Conversion</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
                Never Miss a Live Masterclass
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                All AITI live interactive sessions are stored in universal UTC and synchronized with West Africa Time (WAT). Our platform automatically converts every class schedule into your local country timezone so you can plan effortlessly.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
                  <span className="text-[11px] text-slate-400 block font-semibold mb-1">Select Your Timezone:</span>
                  <select
                    value={selectedTimezone}
                    onChange={(e) => setSelectedTimezone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-cyan-400"
                  >
                    {COUNTRY_OPTIONS.map((c) => (
                      <option key={c.code} value={c.timezone}>
                        {c.name} — {c.timezone}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex flex-col justify-center">
                  <span className="text-[11px] text-slate-400 block font-semibold mb-1">Class Time in Your Region:</span>
                  <div className="text-base font-black text-cyan-300 font-mono">
                    {getTimeInSelectedZone(2, selectedTimezone)}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5">Equivalent to 2:00 PM West Africa Time (WAT)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-3 bg-slate-950/90 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Live Class Delivery Platforms</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We integrate with enterprise video platforms allowing high-definition screen sharing, live terminal debugging, and recording replays.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div> Google Meet
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div> Zoom Video
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-indigo-400"></div> Microsoft Teams
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. ONLINE COURSES DIRECTORY (USD PRICING) */}
      <section id="international-courses" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Curated Syllabus & Independent USD Pricing
            </span>
            <h2 className="text-3xl font-extrabold text-white font-serif mt-1">
              Available Online Courses for International Students
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              All courses feature live instructor sessions, recorded lectures, downloadable files, and verified digital certificates.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input 
              type="text"
              placeholder="Search tech courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-9 pr-4 py-2.5 text-xs focus:ring-1 focus:ring-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const pricing = calculateStudentPricing(course, 'Outside Nigeria', 'Online');
            
            return (
              <div 
                key={course.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 rounded-3xl p-6 transition-all hover:-translate-y-1 shadow-xl flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                      {course.technologyArea}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-400">
                      {course.durationText}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {course.description}
                  </p>

                  {/* Modules count & features */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{course.modules.length || 3}+ Structured Curriculum Modules</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Live Q&A + Recorded Replays</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Tamper-Proof QR Digital Certificate</span>
                    </div>
                  </div>

                  {/* Instructor */}
                  <div className="flex items-center gap-3 pt-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                    {course.instructorAvatar && (
                      <img 
                        src={course.instructorAvatar} 
                        alt={course.instructorName} 
                        className="w-9 h-9 rounded-xl object-cover border border-slate-700" 
                      />
                    )}
                    <div>
                      <strong className="text-xs text-white block">{course.instructorName}</strong>
                      <span className="text-[10px] text-slate-400">Course Lead & Mentor</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Pricing & CTA */}
                <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">International Tuition</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-emerald-400">
                          {formatCurrency(pricing.amount, 'USD', { showCode: true })}
                        </span>
                        {pricing.hasPromo && (
                          <span className="text-xs text-slate-500 line-through">
                            {formatCurrency(pricing.regularAmount, 'USD')}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-cyan-400 bg-cyan-950/60 px-2 py-1 rounded-lg border border-cyan-800/50">
                      Online Live
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        if (onEnrollOnline) {
                          onEnrollOnline(course);
                        } else {
                          onNavigate('apply', course.id);
                        }
                      }}
                      className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider shadow transition-all flex items-center justify-center gap-1"
                    >
                      <span>Enroll Online</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onNavigate('online_courses', course.id)}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 rounded-xl text-xs transition-colors"
                    >
                      View Syllabus
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* 5. DEDICATED INTERNATIONAL STUDENT SUPPORT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Dedicated Global Mentorship
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
              International Student Support Desk
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              We provide dedicated multi-channel support for learners studying from across Africa, the UK, North America, Europe, Asia, and the Middle East.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Instant WhatsApp Hotline</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect directly with admissions officers and academic advisors for quick inquiries and enrollment assistance.
              </p>
              <a 
                href={`https://wa.me/234${(settings?.whatsapp?.primaryNumber || '08030947468').replace(/^0/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-emerald-400 font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>Chat with International Desk</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800 text-cyan-400 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Global Email Registry</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Official documentation, syllabus inquiries, and verified invoice dispatch for international organizations.
              </p>
              <a 
                href={`mailto:${settings?.contact?.email || 'aftatechit@gmail.com'}`}
                className="text-xs text-cyan-400 font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>{settings?.contact?.email || 'aftatechit@gmail.com'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-800 text-indigo-400 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Secure Global Gateways</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                International Visa, Mastercard, AMEX, and global online bank transfers with 256-bit encryption.
              </p>
              <span className="text-xs text-indigo-400 font-bold">
                Instant Server Verification
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTERNATIONAL STUDENT FAQs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
            Common Inquiries
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              q: "How do I receive my AITI Digital Certificate after completing an online course?",
              a: "Upon completing all required curriculum modules, assignments, and practical quizzes, a digital verified certificate is automatically generated in your Student LMS Portal with a permanent QR verification link."
            },
            {
              q: "Are the USD prices fixed or do they fluctuate with exchange rates?",
              a: "AITI maintains dedicated, independent USD prices for all international online courses. You will not experience random fluctuations during your enrollment."
            },
            {
              q: "What if I miss a live interactive class?",
              a: "Every live session is recorded and uploaded to your student online classroom dashboard within 24 hours alongside downloadable exercise files and instructor slides."
            },
            {
              q: "Can I transition to in-person physical learning at AITI Tanke Campus in Ilorin?",
              a: "Yes. If you wish to visit Nigeria for hands-on campus residency, please contact our international admissions desk to arrange campus onboarding and logistics."
            }
          ].map((faq, idx) => (
            <div key={idx} className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
