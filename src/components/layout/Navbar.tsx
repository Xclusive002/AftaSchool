import React, { useState } from 'react';
import { 
  Menu, X, ChevronDown, GraduationCap, ShieldCheck, UserCheck, 
  Phone, Sparkles, BookOpen, Layers, Laptop, MessageCircle 
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { settings } = useSettings();
  const { currentUser, setRole, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPortalsDropdownOpen, setIsPortalsDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Programs', view: 'programs' },
    { label: 'Short Courses', view: 'short_courses' },
    { label: 'Online Training', view: 'online_courses', badge: 'Live LMS' },
    { label: 'International', view: 'international', badge: '$ USD', isSpecial: true },
    { label: 'Corporate Training', view: 'corporate' },
    { label: 'Admissions', view: 'admissions' },
    { label: 'Verify Certificate', view: 'verify' },
    { label: 'About', view: 'about' },
    { label: 'Contact', view: 'contact' },
  ];

  const portals = [
    { label: 'Admin Command Center', role: 'super_admin', view: 'portal_admin', desc: 'Full Institutional Control, Online & Finance' },
    { label: 'Online LMS Classroom', role: 'student', view: 'portal_online_lms', desc: 'Active Video Lessons, Quizzes & Meets' },
    { label: 'Admissions Desk', role: 'admissions_officer', view: 'portal_admissions', desc: 'Review Applications & Issue Letters' },
    { label: 'Finance & Bursary', role: 'finance_officer', view: 'portal_finance', desc: 'Invoices, Fees & NGN/USD Revenue' },
    { label: 'Instructor Portal', role: 'instructor', view: 'portal_instructor', desc: 'Classes, Attendance & Assignments' },
    { label: 'Student Portal', role: 'student', view: 'portal_student', desc: 'My Courses, Results, ID Card & Fees' },
    { label: 'Parent / Guardian Portal', role: 'parent', view: 'portal_parent', desc: 'Attendance & Performance Monitor' },
  ];

  const handlePortalSelect = (portal: typeof portals[0]) => {
    setRole(portal.role as any);
    onNavigate(portal.view);
    setIsPortalsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleOnlineTrainingClick = () => {
    onNavigate(currentUser ? 'portal_online_lms' : 'online_courses');
    setIsPortalsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-cyan-950 border-b border-cyan-900/40 text-[11px] py-1.5 px-4 text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-bold border border-cyan-500/30">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              {settings?.admissions?.activeSession || '2026/2027'} ADMISSIONS OPEN
            </span>
            <span className="hidden md:inline text-slate-400">
              3-Month Certificate & 6-Month Diploma Programs • Tanke, Ilorin
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300 text-[11px]">
            <a 
              href={`tel:${settings?.contact?.primaryPhone || ''}`}
              className="hover:text-cyan-400 flex items-center gap-1 transition-colors"
            >
              <Phone className="w-3 h-3 text-cyan-400" /> {settings?.contact?.primaryPhone || ''}
            </a>
            <span className="text-slate-600">|</span>
            <a 
              href={settings?.whatsapp?.primaryNumber ? `https://wa.me/234${settings.whatsapp.primaryNumber.replace(/^0/, '')}` : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium transition-colors"
            >
              <MessageCircle className="w-3 h-3" /> WhatsApp Desk
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Branding */}
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 via-sky-600 to-slate-900 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-lg tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-200 to-cyan-400">
                AITI
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white font-serif">
                  AITI
                </span>
                <span className="text-[10px] font-black tracking-widest text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/60 uppercase">
                  {settings?.general?.tagline || ''}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wide line-clamp-1 font-medium">
                {settings?.general?.parentOrganization || ''}
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => link.view === 'online_courses' ? handleOnlineTrainingClick() : onNavigate(link.view)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-1 ${
                  (currentView === link.view || (link.view === 'online_courses' && currentView === 'portal_online_lms'))
                    ? 'text-cyan-400 bg-cyan-950/50 border border-cyan-800/60'
                    : link.isSpecial
                    ? 'text-amber-300 hover:text-amber-200 bg-amber-950/30 border border-amber-800/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold ${
                    link.isSpecial ? 'bg-amber-900/80 text-amber-300' : 'bg-cyan-900/80 text-cyan-300'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {currentUser ? (
              <>
                <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200">
                  <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold">
                    {currentUser.fullName?.charAt(0) || 'U'}
                  </div>
                  <div className="leading-tight">
                    <div className="font-bold text-white">{currentUser.fullName}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide">{currentUser.role}</div>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    await logout();
                    onNavigate('home');
                  }}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold px-4 py-2 rounded-xl text-xs tracking-wide transition-all"
              >
                Sign in
              </button>
            )}

            {/* Portals Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsPortalsDropdownOpen(!isPortalsDropdownOpen)}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Portals Login</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isPortalsDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setIsPortalsDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                      AITI Digital Campus Portals
                    </span>
                    <span className="text-[11px] text-cyan-400">Select your account role:</span>
                  </div>
                  {portals.map((p) => (
                    <button
                      key={p.role}
                      onClick={() => handlePortalSelect(p)}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/90 transition-colors flex flex-col gap-0.5 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">
                          {p.label}
                        </span>
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 group-hover:bg-cyan-950 group-hover:text-cyan-400">
                          {p.role.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{p.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Apply CTA Button */}
            <button
              onClick={() => onNavigate('apply')}
              className="bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-extrabold px-4 py-2 rounded-xl text-xs tracking-wide shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
            >
              <GraduationCap className="w-4 h-4 text-slate-950" />
              <span>APPLY NOW</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => onNavigate('apply')}
              className="sm:hidden bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs"
            >
              Apply
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((link) => (
              <button
                key={link.view}
                  onClick={() => link.view === 'online_courses' ? handleOnlineTrainingClick() : onNavigate(link.view)}
                className={`p-2.5 text-left rounded-xl text-xs font-semibold ${
                  (currentView === link.view || (link.view === 'online_courses' && currentView === 'portal_online_lms'))
                    ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/60'
                    : 'bg-slate-900/60 text-slate-300 hover:bg-slate-900'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-3">
            <span className="text-[11px] font-bold text-slate-400 block mb-2 uppercase tracking-wider">
              Access Institutional Portals:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {portals.map((p) => (
                <button
                  key={p.role}
                  onClick={() => handlePortalSelect(p)}
                  className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-left hover:border-cyan-500/50"
                >
                  <span className="text-xs font-bold text-cyan-300 block">{p.label}</span>
                  <span className="text-[10px] text-slate-400">{p.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                onNavigate('apply');
                setIsMobileMenuOpen(false);
              }}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-3 rounded-xl text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2"
            >
              <GraduationCap className="w-4 h-4" /> Start 2026 Online Application
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
