import React from 'react';
import { 
  GraduationCap, Calendar, CheckCircle2, ArrowRight, 
  Clock, DollarSign, FileText, ShieldCheck, PhoneCall, 
  Download, HelpCircle, Award, Sparkles 
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

interface AdmissionsPageProps {
  onNavigate: (view: string) => void;
}

export const AdmissionsPage: React.FC<AdmissionsPageProps> = ({ onNavigate }) => {
  const { settings } = useSettings();

  const admissions = settings?.admissions;
  const contact = settings?.contact;

  const stepsGuide = [
    { step: 1, title: "Account & Contact", desc: "Provide your official name, active email, phone, and WhatsApp contact." },
    { step: 2, title: "Profile & Address", desc: "Specify date of birth, gender, state of origin, and residential address in Ilorin." },
    { step: 3, title: "Educational History", desc: "Declare highest qualification (SSCE/WAEC, OND, HND, B.Sc) and previous school." },
    { step: 4, title: "Program & Schedule", desc: "Select your 3M Certificate or 6M Diploma track and shift (Morning, Afternoon, Weekend, Evening)." },
    { step: 5, title: "Next of Kin", desc: "Submit emergency contact name, relationship, and contact telephone number." },
    { step: 6, title: "Document Uploads", desc: "Attach passport photograph, academic slip, and valid identification card/NIN." },
    { step: 7, title: "Review & Declaration", desc: "Review complete application summary and agree to institutional code of conduct." },
    { step: 8, title: "Fee Checkout", desc: "Pay NGN 5,000 application fee online via Paystack/Flutterwave for instant receipt." },
  ];

  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Hero Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Admissions Office • Tanke Ilorin Campus
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-serif tracking-tight">
          Admissions & Enrollment Guide
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Everything you need to know about joining <strong className="text-cyan-400">AITI</strong> for the <strong>{admissions?.activeSession || '2026/2027'} Academic Session</strong>.
        </p>

        <div className="pt-2">
          <button
            onClick={() => onNavigate('apply')}
            className="bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-black px-8 py-3.5 rounded-2xl text-xs tracking-wider uppercase shadow-xl shadow-cyan-500/25 transition-all hover:scale-105"
          >
            Start 2026 Online Application Now
          </button>
        </div>
      </div>

      {/* Key Dates & Admission Calendar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block">Academic Schedule</span>
            <h3 className="text-xl font-bold text-white font-serif">Admissions Cycle & Key Dates</h3>
          </div>
          <span className="text-xs font-mono bg-cyan-950 text-cyan-300 px-3 py-1.5 rounded-lg border border-cyan-800">
            Session: {admissions?.activeSession || '2026/2027'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <Calendar className="w-5 h-5 text-cyan-400 mb-2" />
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Application Deadline</span>
            <strong className="text-sm text-white font-bold block mt-0.5">{admissions?.applicationDeadline || '2026-10-31'}</strong>
            <span className="text-[10px] text-emerald-400">Applications currently ongoing</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <Clock className="w-5 h-5 text-purple-400 mb-2" />
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Orientation & Onboarding</span>
            <strong className="text-sm text-white font-bold block mt-0.5">{admissions?.orientationDate || '2026-11-05'}</strong>
            <span className="text-[10px] text-slate-400">Tanke Campus Hall, Ilorin</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <GraduationCap className="w-5 h-5 text-emerald-400 mb-2" />
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Technical Labs Resumption</span>
            <strong className="text-sm text-white font-bold block mt-0.5">{admissions?.programStartDate || '2026-11-10'}</strong>
            <span className="text-[10px] text-slate-400">Hands-on practical classes start</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <DollarSign className="w-5 h-5 text-amber-400 mb-2" />
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Application Processing Fee</span>
            <strong className="text-sm text-emerald-400 font-bold block mt-0.5 font-mono">
              NGN {Number(admissions?.applicationFee || 5000).toLocaleString()}
            </strong>
            <span className="text-[10px] text-slate-400">Instant online receipt generated</span>
          </div>
        </div>
      </div>

      {/* 8-Step Application Process */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Step-by-Step Procedure</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif">How to Apply Online in 8 Simple Steps</h2>
          <p className="text-xs text-slate-400">The entire application takes less than 5 minutes to complete.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stepsGuide.map((s) => (
            <div key={s.step} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative space-y-2">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xs font-bold font-mono">
                {s.step}
              </div>
              <h4 className="font-bold text-sm text-white">{s.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tuition & Fee Structure Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Certificate Card */}
        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
              3-Month Intensive
            </span>
            <span className="text-xs font-semibold text-slate-400">Certificate of Proficiency</span>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white font-serif">3-Month Certificate Programs</h3>
            <div className="text-3xl font-black text-emerald-400 font-mono mt-2">
              NGN {Number(admissions?.certificateTuition || 85000).toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-1">Full tuition covering practical laboratory access, course pack & certification.</p>
          </div>

          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full hands-on lab workstation access</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>End-of-term capstone project assessment</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Official QR-verifiable Certificate of Proficiency</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Flexible 2-installment payment option available</span>
            </li>
          </ul>

          <button
            onClick={() => onNavigate('apply')}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-xl text-xs uppercase tracking-wider"
          >
            Apply for 3-Month Certificate
          </button>
        </div>

        {/* Diploma Card */}
        <div className="bg-slate-900 border-2 border-purple-500/30 rounded-3xl p-8 space-y-5 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
              6-Month Advanced
            </span>
            <span className="text-xs font-semibold text-slate-400">Professional Diploma</span>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white font-serif">6-Month Professional Diploma</h3>
            <div className="text-3xl font-black text-emerald-400 font-mono mt-2">
              NGN {Number(admissions?.diplomaTuition || 160000).toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-1">Deep-dive professional track with enterprise systems, advanced projects & internship support.</p>
          </div>

          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Comprehensive multi-module technical curriculum</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Enterprise portfolio creation & code review</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Official QR-verifiable Professional Diploma</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Flexible 3-installment payment option available</span>
            </li>
          </ul>

          <button
            onClick={() => onNavigate('apply')}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg"
          >
            Apply for 6-Month Diploma
          </button>
        </div>

      </div>

    </div>
  );
};
