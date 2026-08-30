import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroAndFeatures } from './components/public/HeroAndFeatures';
import { ProgramCatalogue } from './components/public/ProgramCatalogue';
import { TrainingCatalogueHub } from './components/public/TrainingCatalogueHub';
import { ShortCoursesPage } from './components/public/ShortCoursesPage';
import { CorporateTrainingPage } from './components/public/CorporateTrainingPage';
import { AboutPage } from './components/public/AboutPage';
import { AdmissionsPage } from './components/public/AdmissionsPage';
import { ApplicationForm } from './components/public/ApplicationForm';
import { VerificationPage } from './components/public/VerificationPage';
import { NewsAndGallery } from './components/public/NewsAndGallery';
import { ContactPage } from './components/public/ContactPage';
import { InternationalLandingPage } from './components/public/InternationalLandingPage';
import { OnlineCoursesPublicPage } from './components/public/OnlineCoursesPublicPage';
import { OnlineClassroomPortal } from './components/portal/OnlineClassroomPortal';

import { AdminCommandCenter } from './components/portal/AdminCommandCenter';
import { AdmissionsPortal } from './components/portal/AdmissionsPortal';
import { FinancePortal } from './components/portal/FinancePortal';
import { InstructorPortal } from './components/portal/InstructorPortal';
import { StudentPortal } from './components/portal/StudentPortal';
import { ParentPortal } from './components/portal/ParentPortal';

import { WhatsAppWidget } from './components/common/WhatsAppWidget';
import { AiAdmissionChatbot } from './components/common/AiAdmissionChatbot';
import { useAuth } from './context/AuthContext';
import { useSettings } from './context/SettingsContext';

export const App: React.FC = () => {

  const { currentUser } = useAuth();
  const { settings, loading } = useSettings();
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProgramId, setSelectedProgramId] = useState<string | undefined>(undefined);

  // Check URL query on initial load (e.g. ?view=verify or ?code=...)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    const codeParam = urlParams.get('code');
    if (codeParam || viewParam === 'verify') {
      setCurrentView('verify');
    } else if (viewParam) {
      setCurrentView(viewParam);
    }
  }, []);

  const handleNavigate = (view: string, programId?: string) => {
    setCurrentView(view);
    if (programId) setSelectedProgramId(programId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProgram = (program: any) => {
    setSelectedProgramId(program.id);
    setCurrentView('apply');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center animate-pulse mb-4">
          <span className="font-serif font-black text-cyan-400 text-xl">AITI</span>
        </div>
        <div className="text-sm font-semibold tracking-wide text-white">
          AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE
        </div>
        <span className="text-xs text-cyan-400 font-mono mt-1">Booting Institutional Campus System...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans antialiased">
      
      {/* Top Navbar */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      {/* Main Content Router */}
      <main className="flex-1">
        {/* PUBLIC VIEWS */}
        {currentView === 'home' && (
          <div className="space-y-16">
            <HeroAndFeatures onNavigate={handleNavigate} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <TrainingCatalogueHub onSelectProgram={handleSelectProgram} onNavigate={handleNavigate} />
            </div>
          </div>
        )}

        {(currentView === 'training_catalogue' || currentView === 'catalogue') && (
          <TrainingCatalogueHub onSelectProgram={handleSelectProgram} onNavigate={handleNavigate} />
        )}

        {currentView === 'short_courses' && (
          <ShortCoursesPage onNavigate={handleNavigate} />
        )}

        {(currentView === 'online_courses' || currentView === 'online') && (
          <OnlineCoursesPublicPage onNavigate={handleNavigate} />
        )}

        {currentView === 'international' && (
          <InternationalLandingPage onNavigate={handleNavigate} />
        )}

        {currentView === 'corporate' && (
          <CorporateTrainingPage onNavigate={handleNavigate} />
        )}

        {currentView === 'programs' && (
          <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <TrainingCatalogueHub initialTab="certificate_diploma" onSelectProgram={handleSelectProgram} onNavigate={handleNavigate} />
          </div>
        )}

        {currentView === 'admissions' && (
          <AdmissionsPage onNavigate={handleNavigate} />
        )}

        {currentView === 'apply' && (
          <ApplicationForm
            initialProgramId={selectedProgramId}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'verify' && (
          <VerificationPage />
        )}

        {currentView === 'about' && (
          <AboutPage onNavigate={handleNavigate} />
        )}

        {currentView === 'news' && (
          <NewsAndGallery />
        )}

        {currentView === 'contact' && (
          <ContactPage />
        )}

        {/* INSTITUTIONAL PORTALS (RBAC & Role-Aware) */}
        {currentView === 'portal_admin' && (
          <AdminCommandCenter />
        )}

        {currentView === 'portal_online_lms' && (
          <OnlineClassroomPortal onBackToMain={() => handleNavigate('home')} />
        )}

        {currentView === 'portal_admissions' && (
          <AdmissionsPortal />
        )}

        {currentView === 'portal_finance' && (
          <FinancePortal />
        )}

        {currentView === 'portal_instructor' && (
          <InstructorPortal />
        )}

        {currentView === 'portal_student' && (
          <StudentPortal />
        )}

        {currentView === 'portal_parent' && (
          <ParentPortal />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating Institutional WhatsApp Chat Widget */}
      <WhatsAppWidget />

      {/* Floating Gemini AI Admissions Advisor Chatbot */}
      <AiAdmissionChatbot onNavigate={handleNavigate} />

    </div>
  );
};

export default App;

