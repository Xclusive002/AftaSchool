import React, { useState } from 'react';
import { 
  Building2, Users, CheckCircle2, ShieldCheck, Award, Briefcase, 
  Send, Sparkles, MapPin, Laptop, FileText, ArrowRight, Phone,
  Mail, Check, HelpCircle, Target, TrendingUp, MonitorCheck
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

interface CorporateTrainingPageProps {
  onNavigate?: (view: string) => void;
}

export const CorporateTrainingPage: React.FC<CorporateTrainingPageProps> = ({ onNavigate }) => {
  const { settings } = useSettings();

  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    industry: 'Corporate / Enterprise',
    contactPerson: '',
    email: '',
    phone: '',
    estimatedParticipants: '15',
    trainingFormat: 'onsite_client' as 'onsite_client' | 'campus_aiti' | 'virtual_live' | 'hybrid',
    preferredDates: '',
    customRequirements: '',
    selectedTopics: [] as string[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    requestNumber: string;
    companyName: string;
    contactPerson: string;
  } | null>(null);

  const trainingTopics = [
    'Corporate ICT & Advanced Office Productivity',
    'Executive Data Analytics & Business Intelligence (Power BI / Excel)',
    'Enterprise Artificial Intelligence & Automation Workflow',
    'Cybersecurity Awareness & Information Security for Staff',
    'Database Management & SQL for Business Analysts',
    'Custom Software & Web Application Development',
    'Cloud Computing & Infrastructure Fundamentals',
    'Graphic Design & Corporate Digital Branding',
    'IT Service Desk & Network Hardware Maintenance'
  ];

  const handleToggleTopic = (topic: string) => {
    setFormData(prev => {
      const exists = prev.selectedTopics.includes(topic);
      if (exists) {
        return { ...prev, selectedTopics: prev.selectedTopics.filter(t => t !== topic) };
      } else {
        return { ...prev, selectedTopics: [...prev.selectedTopics, topic] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.selectedTopics.length === 0) {
      alert('Please select at least one training topic/area of interest.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/public/corporate-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          estimatedParticipants: Number(formData.estimatedParticipants) || 10,
          trainingNeeds: formData.selectedTopics.join(', ')
        })
      });

      const data = await res.json();
      if (data.success) {
        setSubmissionResult({
          requestNumber: data.requestNumber,
          companyName: formData.companyName,
          contactPerson: formData.contactPerson
        });
      } else {
        alert(data.message || 'Failed to submit corporate request');
      }
    } catch (err: any) {
      alert('Error submitting request: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="corporate-training-page" className="py-12 bg-slate-950 text-slate-100 min-h-screen">
      
      {/* Executive Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative rounded-3xl overflow-hidden border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-cyan-950/40 to-slate-950 p-8 sm:p-14 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-4">
              <Building2 className="w-3.5 h-3.5" />
              <span>AITI ENTERPRISE & CAPACITY BUILDING</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight text-white mb-6 leading-tight">
              CORPORATE & ORGANIZATIONAL TRAINING
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-300 font-medium mb-8 leading-relaxed">
              "Customized technology workforce training and digital transformation capacity building for corporate institutions, government agencies, schools, and NGOs."
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#corporate-form"
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-extrabold rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2"
              >
                <span>Request a Custom Proposal</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={`tel:${settings?.contact.primaryPhone || '08030947468'}`}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold rounded-xl text-sm transition-colors flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>Speak to Corporate Director</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Corporate Delivery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            Delivery Flexibility
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Tailored Training Formats for Every Organization
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Choose how, when, and where your workforce undergoes world-class technology upskilling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">On-Site Client Training</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our expert senior trainers travel to your corporate office or facility with full curriculum, hands-on labs, and equipment.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Executive Bootcamps</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Intensive 1 to 3-day executive masterclasses hosted at AITI's air-conditioned high-tech lab facilities in Sunyani.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
              <Laptop className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Virtual Live Masterclasses</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Live interactive online cohorts with recorded sessions, practical exercises, and digital certificates for distributed teams.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Custom Upskilling Programs</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Co-designed custom syllabus aligned strictly to your company's proprietary software, workflows, and KPIs.
            </p>
          </div>
        </div>
      </div>

      {/* Enterprise Benefits Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                Institutional Credibility
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1 mb-4">
                Why Organizations Trust AITI for Tech Upskilling
              </h2>
              <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE combines real-world industrial expertise with pedagogical rigor to deliver measurable productivity boosts.
              </p>

              <div className="space-y-3 text-xs text-slate-200">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Pre & Post Training Competency Assessment</strong>
                    <span className="text-slate-400">Measurable reporting on staff skill growth and practical output.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Industry-Certified Senior Faculty</strong>
                    <span className="text-slate-400">Learn from seasoned software engineers, data scientists, and systems architects.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Official Institutional Certification</strong>
                    <span className="text-slate-400">Tamper-proof verifiable digital and physical certificates for all completing participants.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Impact on Partner Organizations</span>
              </h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                  <span className="text-2xl font-black text-cyan-400 font-serif">40%+</span>
                  <p className="text-[11px] text-slate-400 mt-1">Boost in daily task efficiency & automation</p>
                </div>
                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                  <span className="text-2xl font-black text-emerald-400 font-serif">100%</span>
                  <p className="text-[11px] text-slate-400 mt-1">Hands-on practical project outcomes</p>
                </div>
                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                  <span className="text-2xl font-black text-purple-400 font-serif">500+</span>
                  <p className="text-[11px] text-slate-400 mt-1">Corporate professionals trained across Ghana</p>
                </div>
                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                  <span className="text-2xl font-black text-amber-400 font-serif">24hr</span>
                  <p className="text-[11px] text-slate-400 mt-1">Proposal turnaround and curriculum consultation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Corporate Proposal Request Form */}
      <div id="corporate-form" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          
          {submissionResult ? (
            <div className="text-center py-8 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mx-auto border border-cyan-500/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white">Proposal Request Received!</h3>
              <p className="text-sm text-slate-300 max-w-lg mx-auto">
                Thank you, <strong className="text-white">{submissionResult.contactPerson}</strong>. We have received the corporate training request for <strong className="text-cyan-400">{submissionResult.companyName}</strong>.
              </p>

              {/* Proposal Reference Box */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-cyan-800/60 max-w-md mx-auto text-left space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Request Reference:</span>
                  <span className="font-mono font-bold text-cyan-400 text-sm">{submissionResult.requestNumber}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Organization:</span>
                  <span className="font-semibold text-white">{submissionResult.companyName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-bold text-amber-400 uppercase">Under Review by Executive Director</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Contact Desk:</span>
                  <span className="text-slate-300">{settings?.contact.primaryPhone || '08030947468'}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Our Executive Training Director will prepare a customized syllabus outline and formal quote, contacting you within 24 hours.
              </p>

              <button
                onClick={() => { setSubmissionResult(null); }}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="border-b border-slate-800 pb-4">
                <span className="text-[11px] font-mono uppercase text-cyan-400 font-bold block mb-1">
                  Step 1 • Organization & Contact Details
                </span>
                <h3 className="text-xl font-bold text-white">
                  Request a Tailored Corporate Training Proposal
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Fill out this brief form to receive a detailed curriculum roadmap and official fee quotation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Company / Organization Name *</label>
                  <input
                    id="corp-company-name"
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Standard Bank / Ministry of Education / TechCorp"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Industry / Sector</label>
                  <select
                    id="corp-industry-select"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Banking, Finance & Insurance">Banking, Finance & Insurance</option>
                    <option value="Government & Public Sector">Government & Public Sector</option>
                    <option value="Education & Schools">Education & Schools</option>
                    <option value="Healthcare & Pharmaceuticals">Healthcare & Pharmaceuticals</option>
                    <option value="Telecommunications & Tech">Telecommunications & Tech</option>
                    <option value="Non-Profit / NGO">Non-Profit / NGO</option>
                    <option value="Manufacturing & Logistics">Manufacturing & Logistics</option>
                    <option value="Other Commercial Business">Other Commercial Business</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Contact Person & Title *</label>
                  <input
                    id="corp-contact-person"
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="e.g. Sarah Boateng (HR Director)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Official Email Address *</label>
                  <input
                    id="corp-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sarah.boateng@company.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Phone / WhatsApp Number *</label>
                  <input
                    id="corp-phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="024 000 0000"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Estimated Number of Participants</label>
                  <input
                    id="corp-participants"
                    type="number"
                    min="1"
                    value={formData.estimatedParticipants}
                    onChange={(e) => setFormData({ ...formData, estimatedParticipants: e.target.value })}
                    placeholder="e.g. 15"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Step 2: Training Topics */}
              <div className="pt-4 border-t border-slate-800">
                <span className="text-[11px] font-mono uppercase text-cyan-400 font-bold block mb-2">
                  Step 2 • Select Training Areas & Key Topics *
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {trainingTopics.map((topic) => {
                    const isChecked = formData.selectedTopics.includes(topic);
                    return (
                      <div
                        key={topic}
                        onClick={() => handleToggleTopic(topic)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                          isChecked
                            ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="font-medium pr-2">{topic}</span>
                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                          isChecked ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-600'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Format & Dates */}
              <div className="pt-4 border-t border-slate-800 space-y-4 text-xs">
                <span className="text-[11px] font-mono uppercase text-cyan-400 font-bold block">
                  Step 3 • Format & Schedule Preferences
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Preferred Training Delivery Format</label>
                    <select
                      id="corp-format-select"
                      value={formData.trainingFormat}
                      onChange={(e) => setFormData({ ...formData, trainingFormat: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="onsite_client">On-site at Client Facility (Trainer travels to you)</option>
                      <option value="campus_aiti">At AITI Executive Campus (Sunyani)</option>
                      <option value="virtual_live">Virtual Live Instructor Cohort</option>
                      <option value="hybrid">Hybrid (Blended On-site & Online)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Preferred Timeline / Target Start Date</label>
                    <input
                      id="corp-dates"
                      type="text"
                      value={formData.preferredDates}
                      onChange={(e) => setFormData({ ...formData, preferredDates: e.target.value })}
                      placeholder="e.g. Next Month / October 2026 / Weekend only"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Special Requirements & Organizational Objectives</label>
                  <textarea
                    id="corp-requirements"
                    rows={3}
                    value={formData.customRequirements}
                    onChange={(e) => setFormData({ ...formData, customRequirements: e.target.value })}
                    placeholder="Specify any custom software, specific departments, or particular organizational goals you want the training to address..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  🔒 We respect your enterprise privacy. No spam.
                </span>
                <button
                  id="submit-corp-request-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 disabled:opacity-50 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Submitting Request...</span>
                  ) : (
                    <>
                      <span>Submit Proposal Request</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>
      </div>

    </div>
  );
};
