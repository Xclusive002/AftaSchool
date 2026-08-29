import React from 'react';
import { 
  GraduationCap, ShieldCheck, Laptop, Users, Award, 
  ArrowRight, Sparkles, CheckCircle2, BookOpen, Clock, 
  Calendar, MapPin, PhoneCall, Code, Database, Palette, 
  Cpu, Layers, ShieldAlert 
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

interface HeroProps {
  onNavigate: (view: string) => void;
  onSelectProgram?: (programId: string) => void;
}

export const HeroAndFeatures: React.FC<HeroProps> = ({ onNavigate, onSelectProgram }) => {
  const { settings } = useSettings();

  const general = settings?.general;
  const admissions = settings?.admissions;
  const contact = settings?.contact;

  const features = [
    {
      icon: <Laptop className="w-6 h-6 text-cyan-400" />,
      title: "100% Practical Technical Labs",
      desc: "Work on real-world projects with dedicated workstations, high-speed internet, and industry development environments."
    },
    {
      icon: <Award className="w-6 h-6 text-amber-400" />,
      title: "Recognized Certification",
      desc: "Earn accredited 3-Month Certificates & 6-Month Diplomas with tamper-proof QR digital verification."
    },
    {
      icon: <Users className="w-6 h-6 text-emerald-400" />,
      title: "Expert Industry Mentors",
      desc: "Learn directly from senior software engineers, data scientists, and creative directors active in the tech ecosystem."
    },
    {
      icon: <Clock className="w-6 h-6 text-purple-400" />,
      title: "Flexible Class Schedules",
      desc: "Choose between Weekday Morning, Weekday Afternoon, Saturday Weekend Intensive, or Executive Evening batches."
    }
  ];

  const specialtyTracks = [
    { name: "Software & Web Engineering", icon: <Code className="w-5 h-5" />, duration: "3 or 6 Months", desc: "React, Node.js, Python, TypeScript & Full-Stack Systems" },
    { name: "Data Science & AI Intelligence", icon: <Database className="w-5 h-5" />, duration: "3 or 6 Months", desc: "PowerBI, SQL, Advanced Excel, Python & Machine Learning" },
    { name: "UI/UX & Creative Graphics", icon: <Palette className="w-5 h-5" />, duration: "3 or 6 Months", desc: "Figma, Photoshop, Illustrator, Brand Identity & UI Motion" },
    { name: "Hardware & Network Engineering", icon: <Cpu className="w-5 h-5" />, duration: "3 or 6 Months", desc: "System Architecture, Diagnostics, LAN Cabling & Micro-repairs" },
    { name: "Cybersecurity & Cloud Systems", icon: <ShieldAlert className="w-5 h-5" />, duration: "3 or 6 Months", desc: "Network Defense, Ethical Penetration Testing & Cloud Admin" },
    { name: "ICT Office Productivity & AI", icon: <Layers className="w-5 h-5" />, duration: "3 Months", desc: "Computer Appreciation, Executive Office Tools & AI Workflows" },
  ];

  return (
    <div className="space-y-20 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-cyan-600/15 via-sky-500/10 to-transparent blur-3xl pointer-events-none rounded-full"></div>
        <div className="absolute top-10 right-10 w-96 h-96 bg-blue-600/10 blur-3xl pointer-events-none rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 shadow-lg shadow-cyan-950/50 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest font-mono">
                {admissions?.activeSession || '2026/2027'} ADMISSIONS PORTAL NOW ACTIVE
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white font-serif tracking-tight leading-[1.1]">
              Master Practical Tech. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                Go Beyond Tech at AITI.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Accelerate your career with industry-driven <strong className="text-cyan-300">3-Month Certificate</strong> and <strong className="text-cyan-300">6-Month Professional Diploma</strong> programs in Ilorin, Kwara State. Powered by <span className="text-white font-semibold">AFTATECH.IT CONSULT</span>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => onNavigate('apply')}
                className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-black px-8 py-4 rounded-2xl text-sm tracking-wider shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
              >
                <GraduationCap className="w-5 h-5 text-slate-950" />
                <span>START ONLINE APPLICATION</span>
                <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('programs')}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-slate-200 font-bold px-7 py-4 rounded-2xl text-sm transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Explore All Programs</span>
              </button>
            </div>

            {/* Key Campus Quick Badges */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Campus Location</span>
                <strong className="text-xs text-white block">Tanke, Ilorin</strong>
                <span className="text-[10px] text-slate-400 font-mono">2 Babanla St.</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Programs Offered</span>
                <strong className="text-xs text-cyan-300 block">3M Cert & 6M Diploma</strong>
                <span className="text-[10px] text-slate-400">Practical & Project-Based</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Application Fee</span>
                <strong className="text-xs text-emerald-400 block">NGN {Number(admissions?.applicationFee || 5000).toLocaleString()}</strong>
                <span className="text-[10px] text-slate-400">Instant Online Receipt</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Verification</span>
                <strong className="text-xs text-amber-300 block">QR-Secured</strong>
                <span className="text-[10px] text-slate-400">Official Portal Check</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* WHY CHOOSE AITI FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
            Institutional Excellence
          </span>
          <h2 className="text-3xl font-extrabold text-white font-serif">
            Why Train at AITI Ilorin?
          </h2>
          <p className="text-xs text-slate-400">
            We bridge the gap between academic theory and high-demand commercial technology execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 p-6 rounded-2xl transition-all hover:-translate-y-1 shadow-lg group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SPECIALTY TECH TRACKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-10">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Curriculum Specialization</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif mt-1">
                Explore High-Impact Tech Disciplines
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Choose a targeted 3-Month intensive or full 6-Month career diploma.
              </p>
            </div>
            <button
              onClick={() => onNavigate('programs')}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-colors shrink-0"
            >
              <span>View Full Syllabus & Fees</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialtyTracks.map((track, idx) => (
              <div
                key={idx}
                className="bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/50 p-5 rounded-2xl transition-all flex flex-col justify-between group cursor-pointer"
                onClick={() => onNavigate('programs')}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 flex items-center justify-center">
                      {track.icon}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                      {track.duration}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {track.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {track.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-xs text-cyan-400 font-semibold group-hover:text-cyan-300">
                  <span>Enrol for 2026/2027</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADMISSION PROMPT CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border-2 border-cyan-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Ready to Advance Your Future?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
              Join the Next Academic Cohort in Ilorin
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Applications are reviewed on a rolling basis. Complete your 8-step application online today and secure your seat in our hands-on technical labs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('apply')}
              className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-6 py-3.5 rounded-xl text-xs tracking-wider uppercase shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
            >
              Apply Online Now
            </button>
            <a
              href={`tel:${contact?.primaryPhone || '08030947468'}`}
              className="w-full sm:w-auto bg-slate-800/90 hover:bg-slate-700 text-white font-semibold px-5 py-3.5 rounded-xl text-xs border border-slate-700 flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-cyan-400" />
              <span>Call Admissions: {contact?.primaryPhone || '08030947468'}</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
