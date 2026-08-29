import React from 'react';
import { 
  Building2, Award, ShieldCheck, Laptop, Users, 
  MapPin, Phone, Mail, CheckCircle2, ChevronRight, 
  Sparkles, Target, Compass 
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

interface AboutProps {
  onNavigate: (view: string) => void;
}

export const AboutPage: React.FC<AboutProps> = ({ onNavigate }) => {
  const { settings } = useSettings();

  const general = settings?.general;
  const contact = settings?.contact;

  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <Building2 className="w-3.5 h-3.5" /> About Our Institute
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-serif tracking-tight">
          AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE
        </h1>
        <p className="text-base text-cyan-300 font-semibold tracking-wide">
          {general?.tagline || 'BEYOND TECH'} • {general?.motto || 'Empowering You Through ICT'}
        </p>
      </div>

      {/* Main Narrative & Parent Org */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-2xl font-bold text-white font-serif">
            Pioneering Commercial Technology Mastery in Ilorin
          </h2>
          <p>
            <strong>AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE (AITI)</strong> is a premier vocational and professional technology institute established under <strong className="text-white">{general?.parentOrganization || 'AFTATECH.IT CONSULT'}</strong>.
          </p>
          <p>
            Headquartered at <strong>2 Babanla Street, Graceland Junction, Tanke, Ilorin, Kwara State</strong>, AITI was founded to transform ambitious youths, graduates, civil servants, and business professionals into globally competitive tech practitioners.
          </p>
          <p>
            Unlike traditional lecture-only academies, AITI emphasizes <strong>100% practical lab experience</strong>. Every student builds real-world applications, configures actual network hardware, designs commercial brand identities, or implements enterprise database solutions before graduation.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
              <span className="text-xs font-bold text-cyan-400 block mb-1">Practical Laboratories</span>
              <p className="text-[11px] text-slate-400">High-performance workstations with high-speed fiber internet.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
              <span className="text-xs font-bold text-emerald-400 block mb-1">Verifiable Credentials</span>
              <p className="text-[11px] text-slate-400">QR-coded transcripts & certificates checked by employers.</p>
            </div>
          </div>
        </div>

        {/* Visual Campus Card */}
        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block">Campus Headquarters</span>
              <h3 className="text-lg font-bold text-white font-serif">AITI Tanke Campus</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400 font-bold text-sm">
              HQ
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">{contact?.address || '2 Babanla Street, Graceland Junction'}</strong>
                <span className="text-slate-400">{contact?.junction || 'Graceland Junction'}, {contact?.city || 'Tanke, Ilorin, Kwara State'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Admissions: {contact?.primaryPhone || '08030947468'} / {contact?.secondaryPhone || '08024142417'}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Email: {contact?.email || 'aftatechit@gmail.com'}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => onNavigate('contact')}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View Map Directions</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('apply')}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs"
            >
              Apply Online
            </button>
          </div>
        </div>
      </div>

      {/* Mission & Vision Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 p-8 rounded-3xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white font-serif">Our Institutional Mission</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            To provide accessible, cutting-edge, hands-on information technology education that equips learners with the technical acumen, problem-solving mindset, and entrepreneurial vigor required to thrive in the modern digital economy.
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40 border border-slate-800 p-8 rounded-3xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white font-serif">Our Strategic Vision</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            To become the premier technological institute in North-Central Nigeria and beyond, celebrated for producing elite software developers, data practitioners, cyber defenders, and digital innovators who build transformative solutions.
          </p>
        </div>
      </div>

      {/* Core Institutional Pillars */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-white font-serif">The AITI Academic Philosophy</h3>
          <p className="text-xs text-slate-400 mt-1">Four core principles that drive all our courses and laboratories</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Project-First Learning', desc: 'No passive rote learning. You build end-to-end commercial software and hardware prototypes.' },
            { title: 'Industry-Relevant Stack', desc: 'Curriculum is updated continuously to match modern tooling (React, Python, SQL, Figma, Cloud).' },
            { title: 'Mentorship & Accountability', desc: 'Direct 1-on-1 feedback, code reviews, and structured milestone deadlines.' },
            { title: 'Career & Freelancing Guidance', desc: 'Resume packaging, GitHub portfolios, LinkedIn optimization, and remote work readiness.' },
          ].map((pillar, idx) => (
            <div key={idx} className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
              <span className="text-cyan-400 font-mono text-xs font-bold block mb-1">0{idx + 1}.</span>
              <h4 className="font-bold text-sm text-white mb-1">{pillar.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
