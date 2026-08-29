import React, { useState, useEffect } from 'react';
import { 
  Check, ArrowRight, ArrowLeft, Upload, FileText, 
  CreditCard, CheckCircle2, AlertCircle, Sparkles, 
  GraduationCap, User, Phone, MapPin, ShieldCheck, 
  Download, Printer, RefreshCw 
} from 'lucide-react';
import { api } from '../../services/api';
import { Program, Application, PaymentTransaction } from '../../types';
import { useSettings } from '../../context/SettingsContext';
import { DocumentViewerModal } from '../common/DocumentViewer';
import { QrCodeViewer } from '../common/QrCodeViewer';

interface ApplicationFormProps {
  initialProgramId?: string;
  onNavigate: (view: string) => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ initialProgramId, onNavigate }) => {
  const { settings } = useSettings();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [paying, setPaying] = useState(false);
  const [completedApp, setCompletedApp] = useState<Application | null>(null);
  const [completedReceipt, setCompletedReceipt] = useState<PaymentTransaction | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Account
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    whatsapp: '',
    
    // Step 2: Personal Profile
    dateOfBirth: '',
    gender: 'male',
    stateOfOrigin: 'Kwara State',
    lga: 'Ilorin South',
    residentialAddress: '',

    // Step 3: Education
    highestQualification: 'Senior Secondary Certificate (SSCE / WAEC / NECO)',
    previousInstitution: '',
    yearOfGraduation: '2024',
    priorCodingExperience: 'Beginner (No prior experience)',

    // Step 4: Program Choice
    programId: initialProgramId || '',
    programTitle: '',
    programType: 'certificate',
    preferredSchedule: 'Weekday Morning (9:00 AM - 12:00 PM)',

    // Step 5: Next of Kin
    nextOfKinName: '',
    nextOfKinRelationship: 'Parent / Guardian',
    nextOfKinPhone: '',
    nextOfKinAddress: '',

    // Step 6: Documents
    passportPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    certificateDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600',
    idCardDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600',

    // Step 7: Declaration
    termsAccepted: true,

    // Step 8: Payment
    paymentGateway: 'paystack',
    paymentAmount: settings?.admissions.applicationFee || 5000,
  });

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const list = await api.getPrograms();
        setPrograms(list);
        if (list.length > 0) {
          const selected = initialProgramId ? list.find(p => p.id === initialProgramId) || list[0] : list[0];
          setFormData(prev => ({
            ...prev,
            programId: selected.id,
            programTitle: selected.title,
            programType: selected.type,
            paymentAmount: settings?.admissions.applicationFee || 5000
          }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadPrograms();
  }, [initialProgramId, settings]);

  const handleProgramSelect = (progId: string) => {
    const prog = programs.find(p => p.id === progId);
    if (prog) {
      setFormData(prev => ({
        ...prev,
        programId: prog.id,
        programTitle: prog.title,
        programType: prog.type
      }));
    }
  };

  const stepsList = [
    { num: 1, title: 'Account' },
    { num: 2, title: 'Profile' },
    { num: 3, title: 'Education' },
    { num: 4, title: 'Program' },
    { num: 5, title: 'Next of Kin' },
    { num: 6, title: 'Documents' },
    { num: 7, title: 'Review' },
    { num: 8, title: 'Payment' },
  ];

  const handleNext = () => {
    // Basic validations
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        alert('Please fill in your first name, last name, email, and phone number.');
        return;
      }
    }
    if (step === 2) {
      if (!formData.dateOfBirth || !formData.residentialAddress) {
        alert('Please provide your date of birth and residential address.');
        return;
      }
    }
    if (step === 5) {
      if (!formData.nextOfKinName || !formData.nextOfKinPhone) {
        alert('Please provide your next of kin details.');
        return;
      }
    }
    setStep(prev => Math.min(prev + 1, 8));
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleFinalSubmitAndPay = async () => {
    try {
      setSubmitting(true);
      const appPayload = {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.whatsapp || formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        stateOfOrigin: formData.stateOfOrigin,
        lga: formData.lga,
        residentialAddress: formData.residentialAddress,
        highestQualification: formData.highestQualification,
        previousInstitution: formData.previousInstitution,
        yearOfGraduation: formData.yearOfGraduation,
        priorCodingExperience: formData.priorCodingExperience,
        programId: formData.programId,
        programTitle: formData.programTitle,
        programType: formData.programType as any,
        preferredSchedule: formData.preferredSchedule,
        nextOfKinName: formData.nextOfKinName,
        nextOfKinRelationship: formData.nextOfKinRelationship,
        nextOfKinPhone: formData.nextOfKinPhone,
        nextOfKinAddress: formData.nextOfKinAddress,
        passportPhotoUrl: formData.passportPhotoUrl,
        certificateDocUrl: formData.certificateDocUrl,
        idCardDocUrl: formData.idCardDocUrl,
        paymentStatus: 'pending' as const,
        paymentAmount: settings?.admissions.applicationFee || 5000,
        status: 'submitted' as const
      };

      const result = await api.submitApplication(appPayload);
      setCompletedApp(result.application);

      // Now process immediate fee payment simulation
      setPaying(true);
      const payResult = await api.payApplicationFee(
        result.application.id,
        formData.paymentGateway,
        `AITI_GW_${Date.now()}`
      );

      setCompletedApp(payResult.application);
      setCompletedReceipt(payResult.receipt);
      setStep(9); // Success state
    } catch (err: any) {
      alert('Error submitting application: ' + err.message);
    } finally {
      setSubmitting(false);
      setPaying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <GraduationCap className="w-3.5 h-3.5" /> {settings?.admissions.activeSession || '2026/2027'} Admissions
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">
          AITI Online Admission Application
        </h1>
        <p className="text-xs text-slate-300">
          Complete the 8-step application below to join our next practical cohort in Tanke, Ilorin.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      {step <= 8 && (
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between overflow-x-auto pb-2 sm:pb-0 gap-2">
            {stepsList.map((s) => (
              <div
                key={s.num}
                className={`flex items-center gap-1.5 shrink-0 ${
                  s.num === step
                    ? 'text-cyan-400 font-bold'
                    : s.num < step
                    ? 'text-emerald-400 font-semibold'
                    : 'text-slate-500'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    s.num === step
                      ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-400/40'
                      : s.num < step
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {s.num < step ? <Check className="w-3.5 h-3.5" /> : s.num}
                </div>
                <span className="text-xs hidden md:inline">{s.title}</span>
                {s.num < 8 && <span className="text-slate-700 mx-1 hidden lg:inline">›</span>}
              </div>
            ))}
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full transition-all duration-300"
              style={{ width: `${(step / 8) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Step Container Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
        
        {/* ========================================================= */}
        {/* STEP 1: ACCOUNT & CONTACT */}
        {/* ========================================================= */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-400" /> Step 1: Applicant Name & Contact Information
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your official name as it appears on your birth certificate or secondary school records.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">First Name *</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="e.g. Oluwaseun"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Middle Name</label>
                <input
                  type="text"
                  value={formData.middleName}
                  onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                  placeholder="e.g. David"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Last Name (Surname) *</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="e.g. Ajayi"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. oluwaseun.student@gmail.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Primary Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 08145678901"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">WhatsApp Number</label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="e.g. 08145678901"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 2: PERSONAL PROFILE */}
        {/* ========================================================= */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-400" /> Step 2: Personal Profile & Address
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Provide your demographic details and residential location in Ilorin or surrounding areas.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Date of Birth *</label>
                <input
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Gender *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">State of Origin</label>
                <input
                  type="text"
                  value={formData.stateOfOrigin}
                  onChange={(e) => setFormData({ ...formData, stateOfOrigin: e.target.value })}
                  placeholder="e.g. Kwara State"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">LGA (Local Govt. Area)</label>
                <input
                  type="text"
                  value={formData.lga}
                  onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
                  placeholder="e.g. Ilorin South / Ilorin West"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Residential Address in Ilorin / Nigeria *</label>
                <input
                  type="text"
                  required
                  value={formData.residentialAddress}
                  onChange={(e) => setFormData({ ...formData, residentialAddress: e.target.value })}
                  placeholder="e.g. 14 University Road, Tanke Oke, Ilorin"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 3: EDUCATIONAL BACKGROUND */}
        {/* ========================================================= */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" /> Step 3: Educational Background
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Tell us about your previous academic qualifications and existing computer familiarity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Highest Qualification Obtained</label>
                <select
                  value={formData.highestQualification}
                  onChange={(e) => setFormData({ ...formData, highestQualification: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                >
                  <option value="Senior Secondary Certificate (SSCE / WAEC / NECO)">Senior Secondary Certificate (SSCE / WAEC / NECO)</option>
                  <option value="National Diploma (OND / ND)">National Diploma (OND / ND)</option>
                  <option value="Higher National Diploma (HND)">Higher National Diploma (HND)</option>
                  <option value="Bachelor's Degree (B.Sc / B.Tech / B.A)">Bachelor's Degree (B.Sc / B.Tech / B.A)</option>
                  <option value="Postgraduate / Masters">Postgraduate / Masters</option>
                  <option value="Other Certification">Other Certification</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Previous School / Institution Name</label>
                <input
                  type="text"
                  value={formData.previousInstitution}
                  onChange={(e) => setFormData({ ...formData, previousInstitution: e.target.value })}
                  placeholder="e.g. University of Ilorin / Kwara State Polytechnic"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Year of Graduation / Completion</label>
                <input
                  type="text"
                  value={formData.yearOfGraduation}
                  onChange={(e) => setFormData({ ...formData, yearOfGraduation: e.target.value })}
                  placeholder="e.g. 2024"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Prior Computer / Tech Experience</label>
                <select
                  value={formData.priorCodingExperience}
                  onChange={(e) => setFormData({ ...formData, priorCodingExperience: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                >
                  <option value="Beginner (No prior experience)">Beginner (Complete beginner, starting fresh)</option>
                  <option value="Basic Computer Appreciation">Basic (Can operate Windows, MS Word, Web)</option>
                  <option value="Intermediate Self-taught">Intermediate (Some HTML, CSS, Graphics, or Hardware)</option>
                  <option value="Practicing Developer/Designer">Advanced (Working on projects, seeking institutional diploma)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 4: PROGRAM CHOICE & SCHEDULE */}
        {/* ========================================================= */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-cyan-400" /> Step 4: Program Selection & Schedule
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Select your intended specialty track and preferred class timing in Ilorin.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">Select Program Track *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {programs.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleProgramSelect(p.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      formData.programId === p.id
                        ? 'bg-cyan-950/60 border-cyan-500 text-white ring-2 ring-cyan-500/20'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                        {p.duration} • {p.type.toUpperCase()}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        NGN {p.tuitionFee.toLocaleString()}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm">{p.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">Preferred Class Shift / Schedule *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: 'Weekday Morning (9:00 AM - 12:00 PM)', desc: 'Monday to Thursday' },
                  { title: 'Weekday Afternoon (1:00 PM - 4:00 PM)', desc: 'Monday to Thursday' },
                  { title: 'Weekend Intensive (Saturdays 9:00 AM - 4:00 PM)', desc: 'Full Day Practical Labs' },
                  { title: 'Executive Evening (5:00 PM - 7:30 PM)', desc: 'Mon, Wed, Fri for working professionals' },
                ].map((sch) => (
                  <div
                    key={sch.title}
                    onClick={() => setFormData({ ...formData, preferredSchedule: sch.title })}
                    className={`p-3.5 rounded-xl border cursor-pointer text-xs ${
                      formData.preferredSchedule === sch.title
                        ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-white">{sch.title}</div>
                    <div className="text-[10px] text-slate-400">{sch.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 5: NEXT OF KIN */}
        {/* ========================================================= */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" /> Step 5: Next of Kin / Guardian Information
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Emergency contact information for institutional administrative records.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Next of Kin Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.nextOfKinName}
                  onChange={(e) => setFormData({ ...formData, nextOfKinName: e.target.value })}
                  placeholder="e.g. Chief E. B. Ajayi"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Relationship</label>
                <select
                  value={formData.nextOfKinRelationship}
                  onChange={(e) => setFormData({ ...formData, nextOfKinRelationship: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                >
                  <option value="Parent / Guardian">Parent / Guardian</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Employer / Sponsor">Employer / Sponsor</option>
                  <option value="Relative / Other">Relative / Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Next of Kin Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.nextOfKinPhone}
                  onChange={(e) => setFormData({ ...formData, nextOfKinPhone: e.target.value })}
                  placeholder="e.g. 08051239876"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Next of Kin Residential Address</label>
              <input
                type="text"
                value={formData.nextOfKinAddress}
                onChange={(e) => setFormData({ ...formData, nextOfKinAddress: e.target.value })}
                placeholder="e.g. Same as applicant or specific address"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
              />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 6: DOCUMENTS & PASSPORT UPLOAD */}
        {/* ========================================================= */}
        {step === 6 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-cyan-400" /> Step 6: Passport Photograph & Document Uploads
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Upload your digital passport photo and academic credentials (clear JPEG or PNG).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Passport */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-3">
                <span className="text-xs font-bold text-slate-200 block">Recent Passport Photo *</span>
                <div className="w-28 h-32 mx-auto rounded-xl border-2 border-dashed border-cyan-500/50 overflow-hidden relative group">
                  <img
                    src={formData.passportPhotoUrl}
                    alt="Passport Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-[10px] text-slate-400">Clear face, light background</p>
              </div>

              {/* Certificate */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-3">
                <span className="text-xs font-bold text-slate-200 block">O'Level / Degree Slip</span>
                <div className="w-full h-32 rounded-xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-400 p-2">
                  <FileText className="w-8 h-8 text-cyan-400 mb-1" />
                  <span className="text-[11px] font-semibold text-slate-300">academic_result_slip.pdf</span>
                  <span className="text-[9px] text-emerald-400">Attached & Verified</span>
                </div>
                <p className="text-[10px] text-slate-400">SSCE, WAEC, or Degree</p>
              </div>

              {/* Valid ID */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-3">
                <span className="text-xs font-bold text-slate-200 block">Valid Govt. ID / NIN</span>
                <div className="w-full h-32 rounded-xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-400 p-2">
                  <ShieldCheck className="w-8 h-8 text-cyan-400 mb-1" />
                  <span className="text-[11px] font-semibold text-slate-300">national_nin_slip.pdf</span>
                  <span className="text-[9px] text-emerald-400">Attached & Verified</span>
                </div>
                <p className="text-[10px] text-slate-400">NIN, Voters Card, or License</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 7: APPLICATION REVIEW & DECLARATION */}
        {/* ========================================================= */}
        {step === 7 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" /> Step 7: Summary Review & Declaration
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Please double check all submitted information before initiating application fee processing.
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-slate-500 uppercase text-[10px] block">Full Name</span>
                  <strong className="text-white text-sm">{formData.firstName} {formData.middleName} {formData.lastName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[10px] block">Email</span>
                  <span className="text-slate-300">{formData.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[10px] block">Phone / WhatsApp</span>
                  <span className="text-slate-300">{formData.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-slate-500 uppercase text-[10px] block">Selected Program</span>
                  <strong className="text-cyan-300">{formData.programTitle}</strong>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[10px] block">Duration / Track</span>
                  <span className="text-slate-300 capitalize">{formData.programType}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[10px] block">Schedule Shift</span>
                  <span className="text-slate-300">{formData.preferredSchedule}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 uppercase text-[10px] block">Residential Address</span>
                  <span className="text-slate-300">{formData.residentialAddress}, {formData.lga}, {formData.stateOfOrigin}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[10px] block">Next of Kin Contact</span>
                  <span className="text-slate-300">{formData.nextOfKinName} ({formData.nextOfKinPhone})</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={formData.termsAccepted}
                onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                className="mt-1 rounded text-cyan-500 focus:ring-cyan-400 bg-slate-900 border-slate-700"
              />
              <label htmlFor="terms" className="text-xs text-slate-300 leading-relaxed cursor-pointer">
                I hereby declare that the information provided in this application form is true and correct. I agree to abide by the academic guidelines, laboratory safety rules, and administrative policies of <strong>AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE (AITI)</strong>.
              </label>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 8: PAYMENT GATEWAY CHECKOUT */}
        {/* ========================================================= */}
        {step === 8 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-cyan-400" /> Step 8: Application Processing Fee Payment
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                A non-refundable application fee is required to process and register your credentials in the AITI admissions database.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Application Fee</span>
                <div className="text-3xl font-black text-emerald-400 font-mono mt-1">
                  NGN {Number(formData.paymentAmount).toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Session: {settings?.admissions.activeSession || '2026/2027'} • Instant e-Receipt Issued</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-center">
                  <span className="text-[10px] text-cyan-400 uppercase font-bold block">Paystack Direct</span>
                  <span className="text-[9px] text-slate-400">Card / USSD / Transfer</span>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-center">
                  <span className="text-[10px] text-amber-400 uppercase font-bold block">Flutterwave</span>
                  <span className="text-[9px] text-slate-400">Instant Verification</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">Select Payment Channel:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'paystack', name: 'Paystack Payment Gateway', desc: 'Instant Debit Card, USSD, Bank Transfer (Auto-verified)' },
                  { id: 'flutterwave', name: 'Flutterwave Online Gateway', desc: 'Visa, Mastercard, Verve & Bank Account Transfer' },
                ].map((gw) => (
                  <div
                    key={gw.id}
                    onClick={() => setFormData({ ...formData, paymentGateway: gw.id })}
                    className={`p-4 rounded-xl border cursor-pointer ${
                      formData.paymentGateway === gw.id
                        ? 'bg-cyan-950/60 border-cyan-500 text-white ring-2 ring-cyan-500/20'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs">{gw.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{gw.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-950/30 border border-emerald-800/40 p-4 rounded-xl flex items-center gap-3 text-xs text-emerald-300">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                256-Bit SSL Encrypted. After payment, your application reference and official receipt with verification QR code will be generated immediately.
              </span>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 9: APPLICATION SUCCESS SCREEN */}
        {/* ========================================================= */}
        {step === 9 && completedApp && (
          <div className="text-center space-y-6 py-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                Application Successfully Submitted & Fee Paid!
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif">
                Welcome to AITI, {completedApp.firstName}!
              </h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Your admission application for <strong className="text-cyan-300">{completedApp.programTitle}</strong> has been logged in the AITI registry database.
              </p>
            </div>

            {/* Reference Badge Card */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 max-w-md mx-auto text-center space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Official Application Reference</span>
                <div className="text-xl font-mono font-black text-cyan-400 tracking-wider select-all mt-0.5">
                  {completedApp.applicationId}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-center">
                <QrCodeViewer
                  value={`${window.location.origin}/verify?type=receipt&code=${completedReceipt?.receiptNumber || completedApp.applicationId}`}
                  size={90}
                  darkColor="#0284c7"
                />
              </div>
              <span className="text-[10px] text-slate-400 font-mono block">Receipt Ref: {completedReceipt?.receiptNumber}</span>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              {completedReceipt && (
                <button
                  onClick={() => setShowDocumentModal('receipt')}
                  className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-3 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700"
                >
                  <Printer className="w-4 h-4 text-cyan-400" />
                  <span>View / Print Official e-Receipt</span>
                </button>
              )}

              <button
                onClick={() => onNavigate('portal_admissions')}
                className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider"
              >
                Track Admission Status
              </button>
            </div>
          </div>
        )}

        {/* Navigation Action Buttons (For Steps 1 to 8) */}
        {step <= 8 && (
          <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div></div>
            )}

            {step < 8 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold flex items-center gap-2 transition-all shadow-md"
              >
                <span>Continue to Step {step + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinalSubmitAndPay}
                disabled={submitting || paying}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-black flex items-center gap-2 transition-all shadow-xl shadow-emerald-950/50 disabled:opacity-50"
              >
                {submitting || paying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Processing Application & Fee...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" /> Pay NGN {Number(formData.paymentAmount).toLocaleString()} & Submit
                  </>
                )}
              </button>
            )}
          </div>
        )}

      </div>

      {/* Printable Receipt Modal */}
      {showDocumentModal === 'receipt' && completedReceipt && (
        <DocumentViewerModal
          type="receipt"
          data={completedReceipt}
          onClose={() => setShowDocumentModal(null)}
        />
      )}

    </div>
  );
};
