import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Clock, Calendar, CheckCircle2, Award, 
  ArrowRight, Sparkles, Filter, Search, Layers, 
  Code, Database, Palette, Cpu, ShieldCheck, DollarSign 
} from 'lucide-react';
import { api } from '../../services/api';
import { Program, Course } from '../../types';
import { useSettings } from '../../context/SettingsContext';
import { FeeNoticeDisplay } from './FeeNoticeDisplay';
import { QuoteRequestModal } from './QuoteRequestModal';

interface ProgramCatalogueProps {
  onNavigate: (view: string, prefillProgramId?: string) => void;
}

export const ProgramCatalogue: React.FC<ProgramCatalogueProps> = ({ onNavigate }) => {
  const { settings } = useSettings();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'certificate' | 'diploma'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  // Quote modal state
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

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [progs, crs] = await Promise.all([api.getPrograms(), api.getCourses()]);
        setPrograms(progs);
        setCourses(crs);
      } catch (err) {
        console.error('Error loading programs:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredPrograms = programs.filter(p => {
    if (activeTab !== 'all' && p.type !== activeTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = (p.title || '').toLowerCase().includes(q);
      const descMatch = (p.description || '').toLowerCase().includes(q);
      const suitableMatch = (p.suitableFor || []).some(s => (s || '').toLowerCase().includes(q));
      return titleMatch || descMatch || suitableMatch;
    }
    return true;
  });

  return (
    <div className="space-y-12 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" /> Official Curriculum & Programs
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-serif tracking-tight">
          AITI Academic Program Catalogue
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Structured, industry-aligned training designed to build job-ready proficiency. Choose between our intensive <strong className="text-cyan-400">3-Month Certificate</strong> or comprehensive <strong className="text-cyan-400">6-Month Professional Diploma</strong>.
        </p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'all' ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Programs ({programs.length})
          </button>
          <button
            onClick={() => setActiveTab('certificate')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'certificate' ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            3-Month Certificate Programs
          </button>
          <button
            onClick={() => setActiveTab('diploma')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'diploma' ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            6-Month Diploma Programs
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses, tracks..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Program Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredPrograms.map((prog) => {
          const progCourses = courses.filter(c => 
            (prog.coursesIncluded && Array.isArray(prog.coursesIncluded)) 
              ? prog.coursesIncluded.includes(c.code)
              : (c.programType === prog.type || c.programType === 'both')
          );

          return (
            <div
              key={prog.id}
              className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all shadow-xl hover:shadow-cyan-950/20 group"
            >
              <div className="space-y-5">
                
                {/* Badge & Duration */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                    prog.type === 'diploma'
                      ? 'bg-purple-950/60 text-purple-300 border-purple-800/60'
                      : 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60'
                  }`}>
                    {prog.duration} • {prog.type.toUpperCase()}
                  </span>
                  
                  <span className="text-[11px] font-semibold text-amber-400 bg-amber-950/50 px-2.5 py-1 rounded-lg border border-amber-800/50">
                    Fee on Request
                  </span>
                </div>

                {/* Title & Desc */}
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors font-serif">
                    {prog.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {prog.description}
                  </p>
                </div>

                {/* Included Courses Modules */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    Core Technical Modules ({progCourses.length}):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {progCourses.map(c => (
                      <div key={c.id} className="bg-slate-950/80 border border-slate-800/80 p-2.5 rounded-xl text-xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] text-cyan-400 font-bold">{c.code}</span>
                            <span className="text-[9px] text-slate-400">{c.practicalHours || 20}h practicals</span>
                          </div>
                          <p className="text-slate-200 font-medium text-[11px] mt-1 line-clamp-1">{c.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fee Notice Section */}
                <FeeNoticeDisplay
                  courseTitle={prog.title}
                  courseId={prog.id}
                  courseCode={prog.type}
                  exactPrice={prog.tuitionFee}
                  trainingType={prog.type === 'diploma' ? 'diploma_program' : 'certificate_program'}
                  deliveryMode="physical_campus"
                  onOpenQuoteModal={handleOpenQuoteModal}
                  layout="card"
                />

                {/* Suitable For */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Target Audience:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(prog.suitableFor || []).map((aud, i) => (
                      <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                        {aud}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => onNavigate('apply', prog.id)}
                  className="w-full sm:flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-3 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-102"
                >
                  <span>Apply for {prog.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setSelectedProgram(prog)}
                  className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 px-4 rounded-xl text-xs transition-colors"
                >
                  Curriculum Details
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* SCHEDULES & STUDY MODES */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-10 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h3 className="text-2xl font-bold text-white font-serif">Flexible Session Cohorts</h3>
          <p className="text-xs text-slate-400">
            AITI classes operate in 4 convenient time shifts to accommodate full-time students, working professionals, and corps members (NYSC).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block mb-1">Weekday Morning</span>
            <h4 className="text-sm font-bold text-white">9:00 AM – 12:00 PM</h4>
            <p className="text-xs text-slate-400 mt-1">Monday through Thursday. Ideal for full-time learners & tech enthusiasts.</p>
          </div>
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block mb-1">Weekday Afternoon</span>
            <h4 className="text-sm font-bold text-white">1:00 PM – 4:00 PM</h4>
            <p className="text-xs text-slate-400 mt-1">Monday through Thursday. Suited for secondary school leavers & polytechnic students.</p>
          </div>
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block mb-1">Weekend Intensive</span>
            <h4 className="text-sm font-bold text-white">Saturdays 9:00 AM – 4:00 PM</h4>
            <p className="text-xs text-slate-400 mt-1">Full-day deep-dive practical lab for working civil servants & entrepreneurs.</p>
          </div>
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">Executive Evening</span>
            <h4 className="text-sm font-bold text-white">5:00 PM – 7:30 PM</h4>
            <p className="text-xs text-slate-400 mt-1">Monday, Wednesday, Friday. Fast-paced modern technology upskilling.</p>
          </div>
        </div>
      </div>

      {/* Program Detail Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                  {selectedProgram.duration} • {selectedProgram.type.toUpperCase()}
                </span>
                <h3 className="text-2xl font-bold text-white font-serif mt-1">{selectedProgram.title}</h3>
              </div>
              <button
                onClick={() => setSelectedProgram(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <p className="leading-relaxed">{selectedProgram.description}</p>

              {/* Fee Notice Display */}
              <FeeNoticeDisplay
                courseTitle={selectedProgram.title}
                courseId={selectedProgram.id}
                courseCode={selectedProgram.type}
                exactPrice={selectedProgram.tuitionFee}
                trainingType={selectedProgram.type === 'diploma' ? 'diploma_program' : 'certificate_program'}
                deliveryMode="physical_campus"
                onOpenQuoteModal={(opts) => {
                  setSelectedProgram(null);
                  handleOpenQuoteModal(opts);
                }}
                layout="modal"
              />

              <div>
                <h4 className="font-bold text-white uppercase text-[11px] mb-2">Detailed Course Modules</h4>
                <div className="space-y-2">
                  {courses.filter(c => 
                    (selectedProgram.coursesIncluded && Array.isArray(selectedProgram.coursesIncluded))
                      ? selectedProgram.coursesIncluded.includes(c.code)
                      : (c.programType === selectedProgram.type || c.programType === 'both')
                  ).map(c => (
                    <div key={c.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="flex justify-between font-semibold text-cyan-300">
                        <span>{c.code}: {c.title}</span>
                        <span className="text-slate-400">{c.practicalHours} hrs</span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-1">{c.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  const id = selectedProgram.id;
                  setSelectedProgram(null);
                  onNavigate('apply', id);
                }}
                className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-xl text-xs uppercase tracking-wider"
              >
                Proceed to Online Application
              </button>
              <button
                onClick={() => setSelectedProgram(null)}
                className="px-5 py-3 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quote Request Modal */}
      <QuoteRequestModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        initialCourseTitle={quoteModalData.courseTitle}
        initialCourseId={quoteModalData.courseId}
        initialCourseCode={quoteModalData.courseCode}
        initialTrainingType={quoteModalData.trainingType || 'certificate_program'}
        initialDeliveryMode={quoteModalData.deliveryMode || 'physical_campus'}
        initialIsInternational={quoteModalData.isInternational || false}
      />

    </div>
  );
};
