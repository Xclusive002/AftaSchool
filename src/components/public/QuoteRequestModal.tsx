import React, { useState, useEffect } from 'react';
import { 
  X, Send, CheckCircle2, MessageSquare, Phone, HelpCircle, 
  Sparkles, Calendar, Globe, MapPin, User, Mail, ShieldAlert,
  GraduationCap, BookOpen, Layers, Check, Copy, ExternalLink, ArrowRight
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { api } from '../../services/api';
import { QuoteRequest } from '../../types';

interface QuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCourseTitle?: string;
  initialCourseId?: string;
  initialCourseCode?: string;
  initialTrainingType?: 'short_course' | 'certificate_program' | 'diploma_program' | 'online_course' | 'corporate_training';
  initialDeliveryMode?: 'physical_campus' | 'online_live' | 'hybrid' | 'weekend_intensive';
  isInternational?: boolean;
}

export const QuoteRequestModal: React.FC<QuoteRequestModalProps> = ({
  isOpen,
  onClose,
  initialCourseTitle,
  initialCourseId,
  initialCourseCode,
  initialTrainingType = 'short_course',
  initialDeliveryMode = 'physical_campus',
  isInternational = false
}) => {
  const { settings } = useSettings();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [country, setCountry] = useState(isInternational ? 'Ghana' : 'Nigeria');
  const [city, setCity] = useState('');
  const [studentType, setStudentType] = useState<'nigerian_local' | 'international_online' | 'corporate_group' | 'sponsored'>(
    isInternational ? 'international_online' : 'nigerian_local'
  );
  
  const [courseTitle, setCourseTitle] = useState(initialCourseTitle || 'Full-Stack Software Engineering');
  const [trainingType, setTrainingType] = useState(initialTrainingType);
  const [deliveryMode, setDeliveryMode] = useState(initialDeliveryMode);
  const [preferredSchedule, setPreferredSchedule] = useState('Weekday Morning (9:00 AM - 12:00 PM)');
  const [preferredStartDate, setPreferredStartDate] = useState('Next Immediate Cohort (September 2026)');
  const [participantCount, setParticipantCount] = useState(1);
  const [message, setMessage] = useState('');
  const [questions, setQuestions] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedQuote, setSubmittedQuote] = useState<QuoteRequest | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialCourseTitle) setCourseTitle(initialCourseTitle);
      if (initialTrainingType) setTrainingType(initialTrainingType);
      if (initialDeliveryMode) setDeliveryMode(initialDeliveryMode);
      if (isInternational) {
        setStudentType('international_online');
        if (country === 'Nigeria') setCountry('Ghana');
      }
      setError(null);
      setSubmittedQuote(null);
    }
  }, [isOpen, initialCourseTitle, initialTrainingType, initialDeliveryMode, isInternational]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError('Please provide your Full Name, Email Address, and Phone Number.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload: Partial<QuoteRequest> = {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        country: country.trim(),
        city: city.trim(),
        studentType,
        courseId: initialCourseId,
        courseCode: initialCourseCode,
        courseTitle: courseTitle.trim(),
        trainingType,
        deliveryMode,
        preferredSchedule,
        preferredStartDate,
        participantCount: studentType === 'corporate_group' ? Number(participantCount) : 1,
        message: message.trim(),
        questions: questions.trim(),
        currency: studentType === 'international_online' || (country && country !== 'Nigeria') ? 'USD' : 'NGN'
      };

      const res = await api.submitQuoteRequest(payload);
      setSubmittedQuote(res.quoteRequest);
    } catch (err: any) {
      setError(err.message || 'Failed to submit quote request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyRef = () => {
    if (submittedQuote?.referenceNumber) {
      navigator.clipboard.writeText(submittedQuote.referenceNumber);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 3000);
    }
  };

  const getWhatsappUrl = () => {
    const phone = settings?.contact?.primaryPhone || '';
    const rawNumber = phone.replace(/[^0-9]/g, '');
    const intlNumber = rawNumber.startsWith('0') ? `234${rawNumber.slice(1)}` : rawNumber;
    const greeting = studentType === 'international_online'
      ? `Hello AITI, I am an international applicant interested in the current USD fee for "${courseTitle}". My Quote Reference is ${submittedQuote?.referenceNumber || 'N/A'}.`
      : `Hello AITI Admissions, I would like to get the current training fee for "${courseTitle}" (${deliveryMode === 'online_live' ? 'Online' : 'Physical'}). Quote Ref: ${submittedQuote?.referenceNumber || 'N/A'}.`;
    return `https://wa.me/${intlNumber}?text=${encodeURIComponent(greeting)}`;
  };

  return (
    <div id="quote-request-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
      <div 
        id="quote-request-modal-container" 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-indigo-900 text-white p-6 sm:p-8 flex items-start justify-between relative">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-semibold uppercase tracking-wider border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Official Tuition & Fee Confirmation
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif">
              {submittedQuote ? 'Quote Request Received' : 'Get Current Course Fee'}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {submittedQuote 
                ? 'Your inquiry is registered with AITI Admissions. We will furnish your customized fee quote and schedule.'
                : 'AITI fees are customized by delivery format, schedule, cohort size, and active training promotions. Receive your verified fee directly.'}
            </p>
          </div>
          <button
            id="quote-modal-close-btn"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {submittedQuote ? (
            /* Success & Action View */
            <div className="space-y-6 animate-fadeIn">
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Inquiry Logged Successfully!</h3>
                  <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                    Your request has been routed to the Admissions Office. We will prepare your official fee quotation shortly.
                  </p>
                </div>

                <div className="inline-flex items-center gap-3 bg-white px-5 py-3 rounded-xl border border-emerald-300 shadow-xs">
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Your Unique Quote Reference</div>
                    <div className="text-lg font-mono font-bold text-navy-900 tracking-wider">
                      {submittedQuote.referenceNumber}
                    </div>
                  </div>
                  <button
                    onClick={handleCopyRef}
                    className="p-2 text-slate-500 hover:text-navy-900 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Copy Reference"
                  >
                    {copiedRef ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Quote Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 text-sm">
                <div>
                  <span className="text-slate-500 text-xs block">Applicant Name</span>
                  <span className="font-semibold text-slate-800">{submittedQuote.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block">Course / Track</span>
                  <span className="font-semibold text-slate-800">{submittedQuote.courseTitle}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block">Delivery Format</span>
                  <span className="font-semibold text-slate-800 capitalize">
                    {submittedQuote.deliveryMode.replace('_', ' ')} ({submittedQuote.preferredSchedule})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block">Candidate Type</span>
                  <span className="font-semibold text-slate-800 capitalize">
                    {submittedQuote.studentType.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Instant WhatsApp / Call Connect */}
              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 text-center">
                  Want an Instant Fee Confirmation via WhatsApp or Phone?
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    id="quote-instant-whatsapp-link"
                    href={getWhatsappUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs transition-colors text-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Chat on WhatsApp Now
                    <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
                  </a>

                  <a
                    id="quote-instant-call-link"
                    href={`tel:${settings?.contact?.primaryPhone || ''}`}
                    className="flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-xs transition-colors text-sm"
                  >
                    <Phone className="w-4 h-4 text-amber-400" />
                    Call AITI Desk ({settings?.contact?.primaryPhone || ''})
                  </a>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors text-sm"
                >
                  Done & Return
                </button>
              </div>
            </div>
          ) : (
            /* Input Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Section 1: Candidate Category */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  1. Candidate Category & Region
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setStudentType('nigerian_local');
                      setCountry('Nigeria');
                    }}
                    className={`p-3 text-left rounded-xl border text-xs font-semibold transition-all ${
                      studentType === 'nigerian_local'
                        ? 'border-navy-600 bg-navy-50/70 text-navy-900 ring-2 ring-navy-600/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-slate-900">Nigerian Resident</div>
                    <div className="text-[11px] text-slate-500 font-normal mt-0.5">Physical / Online (₦ NGN)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStudentType('international_online');
                      if (country === 'Nigeria') setCountry('Ghana');
                    }}
                    className={`p-3 text-left rounded-xl border text-xs font-semibold transition-all ${
                      studentType === 'international_online'
                        ? 'border-navy-600 bg-navy-50/70 text-navy-900 ring-2 ring-navy-600/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-slate-900">International Student</div>
                    <div className="text-[11px] text-slate-500 font-normal mt-0.5">Global Online ($ USD)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStudentType('corporate_group')}
                    className={`p-3 text-left rounded-xl border text-xs font-semibold transition-all ${
                      studentType === 'corporate_group'
                        ? 'border-navy-600 bg-navy-50/70 text-navy-900 ring-2 ring-navy-600/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-slate-900">Corporate Group</div>
                    <div className="text-[11px] text-slate-500 font-normal mt-0.5">Custom Staff Cohort</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStudentType('sponsored')}
                    className={`p-3 text-left rounded-xl border text-xs font-semibold transition-all ${
                      studentType === 'sponsored'
                        ? 'border-navy-600 bg-navy-50/70 text-navy-900 ring-2 ring-navy-600/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-slate-900">Sponsored Candidate</div>
                    <div className="text-[11px] text-slate-500 font-normal mt-0.5">NGO / Government / Org</div>
                  </button>
                </div>
              </div>

              {/* Section 2: Contact Information */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  2. Personal & Contact Information
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Babatunde Adeleke"
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-navy-600 focus:border-navy-600 outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. babatunde@gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-navy-600 focus:border-navy-600 outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Phone Number (Calls) *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 0803 123 4567 or +234..."
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-navy-600 focus:border-navy-600 outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">WhatsApp Number (For Instant Fee Dispatch)</label>
                    <div className="relative">
                      <MessageSquare className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="Same as phone or enter WhatsApp"
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-navy-600 focus:border-navy-600 outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Country</label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="e.g. Nigeria, Ghana, UK, USA"
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-navy-600 focus:border-navy-600 outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">City / State</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Ilorin, Lagos, Accra"
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-navy-600 focus:border-navy-600 outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Training & Delivery Details */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  3. Training Program & Delivery Specifications
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Course / Program of Interest *</label>
                    <input
                      type="text"
                      required
                      value={courseTitle}
                      onChange={(e) => setCourseTitle(e.target.value)}
                      placeholder="e.g. Full-Stack React & Next.js Masterclass"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-navy-600 focus:border-navy-600 outline-hidden bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Training Type</label>
                    <select
                      value={trainingType}
                      onChange={(e) => setTrainingType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-navy-600 focus:border-navy-600 outline-hidden bg-white"
                    >
                      <option value="short_course">Professional Short Course (2 - 8 Weeks)</option>
                      <option value="certificate_program">3-Month Certificate Program</option>
                      <option value="diploma_program">6-Month Professional Diploma Program</option>
                      <option value="online_course">100% Live Instructor-Led Online Course</option>
                      <option value="corporate_training">Corporate Staff Training Package</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Delivery Format</label>
                    <select
                      value={deliveryMode}
                      onChange={(e) => setDeliveryMode(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-navy-600 focus:border-navy-600 outline-hidden bg-white"
                    >
                      <option value="physical_campus">Physical Campus (Tanke, Ilorin)</option>
                      <option value="online_live">Live Interactive Online (Zoom/Classroom)</option>
                      <option value="hybrid">Hybrid (Campus Workstations + Online)</option>
                      <option value="weekend_intensive">Weekend Intensive (Saturdays Only)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Preferred Schedule</label>
                    <select
                      value={preferredSchedule}
                      onChange={(e) => setPreferredSchedule(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-navy-600 focus:border-navy-600 outline-hidden bg-white"
                    >
                      <option value="Weekday Morning (9:00 AM - 12:00 PM)">Weekday Morning (9:00 AM - 12:00 PM)</option>
                      <option value="Weekday Afternoon (1:00 PM - 4:00 PM)">Weekday Afternoon (1:00 PM - 4:00 PM)</option>
                      <option value="Executive Evening (5:00 PM - 7:30 PM)">Executive Evening (5:00 PM - 7:30 PM)</option>
                      <option value="Weekend Intensive (Saturdays 9:00 AM - 4:00 PM)">Weekend Intensive (Saturdays 9:00 AM - 4:00 PM)</option>
                      <option value="Flexible / Self-Paced Mentorship">Flexible / Self-Paced Mentorship</option>
                    </select>
                  </div>

                  {studentType === 'corporate_group' && (
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Estimated Number of Trainees</label>
                      <input
                        type="number"
                        min={2}
                        max={200}
                        value={participantCount}
                        onChange={(e) => setParticipantCount(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-navy-600 focus:border-navy-600 outline-hidden"
                      />
                    </div>
                  )}

                  <div className={studentType === 'corporate_group' ? '' : 'sm:col-span-1'}>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Target Start Timeframe</label>
                    <input
                      type="text"
                      value={preferredStartDate}
                      onChange={(e) => setPreferredStartDate(e.target.value)}
                      placeholder="e.g. Next Immediate Cohort (September 2026)"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-navy-600 focus:border-navy-600 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Special Inquiries */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Questions or Special Requirements (Optional)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about installment plans, group discounts, workstation setups, or laptop requirements..."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-navy-600 focus:border-navy-600 outline-hidden resize-none"
                />
              </div>

              {/* Price Notice Banner */}
              <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Official Institutional Policy:</strong> {settings.pricing?.customDisclaimerText || 'Training fees are subject to change based on schedule, delivery format, cohort timing, and current institutional promotion. Please contact AITI for the current applicable fee before making payment.'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 text-slate-600 hover:text-slate-900 font-semibold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="quote-submit-btn"
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-navy-900 to-indigo-900 hover:from-navy-800 hover:to-indigo-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Registering Request...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-amber-400" />
                      Get Current Fee Quote
                      <ArrowRight className="w-4 h-4" />
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
