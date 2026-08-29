import React, { useState } from 'react';
import { 
  GraduationCap, Zap, Building2, ChevronRight, Sparkles, 
  Award, Clock, CheckCircle2, ArrowRight, BookOpen, Layers
} from 'lucide-react';
import { ProgramCatalogue } from './ProgramCatalogue';
import { ShortCoursesPage } from './ShortCoursesPage';
import { CorporateTrainingPage } from './CorporateTrainingPage';

interface TrainingCatalogueHubProps {
  initialTab?: 'certificate_diploma' | 'short_courses' | 'corporate';
  onSelectProgram?: (program: any) => void;
  onNavigate?: (view: string, id?: string) => void;
}

export const TrainingCatalogueHub: React.FC<TrainingCatalogueHubProps> = ({
  initialTab = 'certificate_diploma',
  onSelectProgram,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'certificate_diploma' | 'short_courses' | 'corporate'>(initialTab);

  return (
    <div id="training-catalogue-hub" className="py-8 bg-slate-950 text-slate-100 min-h-screen">
      
      {/* Top Breadcrumb & Pillar Selector Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE (AITI)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-serif tracking-tight text-white mb-3">
            AITI TRAINING CATALOGUE
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Choose your learning pathway — from accredited 3 & 6-month foundational career tracks to intensive short upskilling courses and corporate enterprise workforce training.
          </p>
        </div>

        {/* 3 Main Category Pillar Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/90 p-2 rounded-2xl border border-slate-800 shadow-xl">
          
          {/* Pillar 1: Certificate & Diploma */}
          <button
            id="tab-pillar-cert-dip"
            onClick={() => setActiveTab('certificate_diploma')}
            className={`p-4 rounded-xl text-left transition-all relative overflow-hidden flex flex-col justify-between ${
              activeTab === 'certificate_diploma'
                ? 'bg-gradient-to-br from-cyan-950 to-slate-900 border border-cyan-500/60 shadow-lg shadow-cyan-950/40 text-white'
                : 'bg-slate-950/60 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                activeTab === 'certificate_diploma' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-cyan-400'
              }`}>
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                activeTab === 'certificate_diploma' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'
              }`}>
                3 & 6 Months
              </span>
            </div>
            <div>
              <span className="text-xs font-mono font-bold block text-cyan-400">CATEGORY 1</span>
              <h3 className="text-sm font-black text-white">Certificate & Diploma Programs</h3>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                Full-semester foundational & professional IT diplomas.
              </p>
            </div>
          </button>

          {/* Pillar 2: Short-Term Courses */}
          <button
            id="tab-pillar-short-courses"
            onClick={() => setActiveTab('short_courses')}
            className={`p-4 rounded-xl text-left transition-all relative overflow-hidden flex flex-col justify-between ${
              activeTab === 'short_courses'
                ? 'bg-gradient-to-br from-sky-950 to-slate-900 border border-sky-500/60 shadow-lg shadow-sky-950/40 text-white'
                : 'bg-slate-950/60 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                activeTab === 'short_courses' ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-sky-400'
              }`}>
                <Zap className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                activeTab === 'short_courses' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'bg-slate-800 text-slate-400'
              }`}>
                1 – 4 Weeks
              </span>
            </div>
            <div>
              <span className="text-xs font-mono font-bold block text-sky-400">CATEGORY 2</span>
              <h3 className="text-sm font-black text-white">Short-Term Courses</h3>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                Fast-track practical upskilling in AI, Data, Web & Graphics.
              </p>
            </div>
          </button>

          {/* Pillar 3: Corporate & Organizational */}
          <button
            id="tab-pillar-corporate"
            onClick={() => setActiveTab('corporate')}
            className={`p-4 rounded-xl text-left transition-all relative overflow-hidden flex flex-col justify-between ${
              activeTab === 'corporate'
                ? 'bg-gradient-to-br from-purple-950 to-slate-900 border border-purple-500/60 shadow-lg shadow-purple-950/40 text-white'
                : 'bg-slate-950/60 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                activeTab === 'corporate' ? 'bg-purple-500 text-slate-950' : 'bg-slate-800 text-purple-400'
              }`}>
                <Building2 className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                activeTab === 'corporate' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-slate-800 text-slate-400'
              }`}>
                Custom / Enterprise
              </span>
            </div>
            <div>
              <span className="text-xs font-mono font-bold block text-purple-400">CATEGORY 3</span>
              <h3 className="text-sm font-black text-white">Corporate & Organizational Training</h3>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                Bespoke capacity building for companies, schools & NGOs.
              </p>
            </div>
          </button>

        </div>
      </div>

      {/* Render Active Category Section */}
      <div className="animate-in fade-in duration-200">
        {activeTab === 'certificate_diploma' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 bg-cyan-950/30 border border-cyan-900/50 p-4 rounded-2xl flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="text-xs font-bold text-cyan-400 block">Accredited Academic Programs</span>
                <p className="text-xs text-slate-300">
                  Offering structured <strong>3-Month Certificate</strong> and <strong>6-Month Diploma</strong> curriculum with direct online admission portal.
                </p>
              </div>
              <button
                onClick={() => onNavigate && onNavigate('admissions')}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1"
              >
                <span>View Admissions Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <ProgramCatalogue onSelectProgram={onSelectProgram} />
          </div>
        )}

        {activeTab === 'short_courses' && (
          <ShortCoursesPage onNavigate={onNavigate} />
        )}

        {activeTab === 'corporate' && (
          <CorporateTrainingPage onNavigate={onNavigate} />
        )}
      </div>

    </div>
  );
};
