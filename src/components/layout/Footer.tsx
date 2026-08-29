import React from 'react';
import { 
  MapPin, Phone, Mail, MessageCircle, Clock, ShieldCheck, 
  ExternalLink, GraduationCap, ChevronRight, Award, Laptop 
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings } = useSettings();

  const general = settings?.general;
  const contact = settings?.contact;
  const whatsapp = settings?.whatsapp;

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Institute Identity & Mission (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 via-sky-600 to-slate-900 p-0.5 shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-xl text-cyan-300">
                  AITI
                </div>
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-white font-serif tracking-tight">
                  {general?.fullName || 'AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE'}
                </h3>
                <p className="text-xs font-bold text-cyan-400 tracking-wider">
                  {general?.tagline || 'BEYOND TECH'} • {general?.motto || 'Empowering You Through ICT'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pr-4">
              AITI is a premier technological training institute under <strong className="text-slate-300">{general?.parentOrganization || 'AFTATECH.IT CONSULT'}</strong>, offering hands-on, industry-certified 3-Month Certificate and 6-Month Diploma programs in Software Engineering, Data & AI, Cyber Defense, UI/UX, Hardware & Network Systems in Ilorin, Kwara State.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-[11px] text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Govt. & Industry Accredited Training</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-[11px] text-slate-300">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>QR-Verifiable Credentials</span>
              </div>
            </div>
          </div>

          {/* Column 2: Programs & Academics */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Academic Programs
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('programs')} className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-cyan-500" /> 3-Month Certificate
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('programs')} className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-cyan-500" /> 6-Month Diploma
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('programs')} className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-cyan-500" /> Software & Web Dev
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('programs')} className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-cyan-500" /> Data Analysis & AI
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('programs')} className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-cyan-500" /> Graphics & UI/UX Design
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('programs')} className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-cyan-500" /> Hardware & Networking
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links & Portals */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Quick Portals
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('apply')} className="text-cyan-400 font-semibold hover:underline flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" /> 2026/2027 Online Application
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('verify')} className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Certificate & ID Verification
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('portal_student')} className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <Laptop className="w-3 h-3 text-cyan-500" /> Student Campus Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('portal_admin')} className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-cyan-500" /> Admin Command Center
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('portal_finance')} className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-cyan-500" /> Bursary / Tuition Payments
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('news')} className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-cyan-500" /> News & Institute Events
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Official Contact & Campus Location */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Campus Location
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p className="leading-snug">
                  <strong className="text-slate-200 block">{contact?.address || '2 Babanla Street, Graceland Junction'}</strong>
                  {contact?.junction || 'Graceland Junction'}, {contact?.city || 'Tanke, Ilorin, Kwara State, Nigeria'}
                </p>
              </div>

              <div className="pt-1 space-y-1.5">
                <a 
                  href={`tel:${contact?.primaryPhone || '08030947468'}`}
                  className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{contact?.primaryPhone || '08030947468'} (Admissions)</span>
                </a>
                <a 
                  href={`tel:${contact?.secondaryPhone || '08024142417'}`}
                  className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{contact?.secondaryPhone || '08024142417'} (Enquiries)</span>
                </a>
                <a 
                  href={`tel:${contact?.tertiaryPhone || '09056119667'}`}
                  className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{contact?.tertiaryPhone || '09056119667'} (Registry)</span>
                </a>
                <a 
                  href={`mailto:${contact?.email || 'aftatechit@gmail.com'}`}
                  className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{contact?.email || 'aftatechit@gmail.com'}</span>
                </a>
              </div>

              <div className="pt-2">
                <a 
                  href={`https://wa.me/234${(whatsapp?.primaryNumber || '08030947468').replace(/^0/, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-emerald-600/30 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp: {whatsapp?.primaryNumber || '08030947468'}</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} <strong className="text-slate-400">{general?.fullName || 'AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE'}</strong> (AITI). All Rights Reserved.
          </p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('about')} className="hover:text-slate-300">About</button>
            <button onClick={() => onNavigate('verify')} className="hover:text-slate-300">Verification Portal</button>
            <button onClick={() => onNavigate('contact')} className="hover:text-slate-300">Contact & Support</button>
            <span className="text-slate-700">|</span>
            <span className="text-cyan-400/80 font-mono">BEYOND TECH</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
