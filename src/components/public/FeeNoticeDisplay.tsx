import React from 'react';
import { MessageSquare, Phone, HelpCircle, ArrowRight, Sparkles, ShieldAlert, Tag } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

interface FeeNoticeDisplayProps {
  courseTitle: string;
  courseId?: string;
  courseCode?: string;
  exactPrice?: number;
  exactPriceUSD?: number;
  isInternational?: boolean;
  trainingType?: 'short_course' | 'certificate_program' | 'diploma_program' | 'online_course' | 'corporate_training';
  deliveryMode?: 'physical_campus' | 'online_live' | 'hybrid' | 'weekend_intensive';
  onOpenQuoteModal: (opts?: {
    courseTitle?: string;
    courseId?: string;
    courseCode?: string;
    trainingType?: any;
    deliveryMode?: any;
    isInternational?: boolean;
  }) => void;
  layout?: 'card' | 'hero' | 'modal' | 'compact' | 'inline';
  className?: string;
}

export const FeeNoticeDisplay: React.FC<FeeNoticeDisplayProps> = ({
  courseTitle,
  courseId,
  courseCode,
  exactPrice,
  exactPriceUSD,
  isInternational = false,
  trainingType = 'short_course',
  deliveryMode = 'physical_campus',
  onOpenQuoteModal,
  layout = 'card',
  className = ''
}) => {
  const { settings } = useSettings();
  const pricingMode = settings.pricing?.publicPriceDisplay || 'quote_only';

  const rawPhone = settings.general.phone1.replace(/[^0-9]/g, '');
  const intlPhone = rawPhone.startsWith('0') ? `234${rawPhone.slice(1)}` : rawPhone;
  const whatsappMsg = isInternational
    ? `Hello AITI, I am an international student interested in taking ${courseTitle} online. Please send me the current international USD course fee.`
    : `Hello AITI, I would like to know the current fee for ${courseTitle}.`;
  const whatsappUrl = `https://wa.me/${intlPhone}?text=${encodeURIComponent(whatsappMsg)}`;

  const handleOpen = () => {
    onOpenQuoteModal({
      courseTitle,
      courseId,
      courseCode,
      trainingType,
      deliveryMode,
      isInternational
    });
  };

  // If admin configured 'show_exact' and exact price is provided
  if (pricingMode === 'show_exact' && (exactPrice || exactPriceUSD)) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">
            {isInternational && exactPriceUSD
              ? `$${exactPriceUSD.toLocaleString()}`
              : `₦${(exactPrice || 0).toLocaleString()}`}
          </span>
          <span className="text-xs text-slate-500 font-medium">/ confirmed fee</span>
        </div>
        <button
          onClick={handleOpen}
          className="w-full py-2.5 px-4 bg-navy-900 hover:bg-navy-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Request Enrollment & Fee Lock
        </button>
      </div>
    );
  }

  // Compact layout (used inside course listing cards)
  if (layout === 'compact') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200/70 rounded-lg text-xs font-semibold">
            <Tag className="w-3 h-3 text-amber-600" />
            {isInternational ? 'USD Fee on Request' : 'Fee on Request'}
          </span>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 hover:text-emerald-800 text-[11px] font-semibold inline-flex items-center gap-1 hover:underline"
            title="Chat on WhatsApp"
          >
            <MessageSquare className="w-3 h-3" />
            WhatsApp
          </a>
        </div>
        <button
          onClick={handleOpen}
          className="w-full py-2 px-3 bg-navy-900 hover:bg-navy-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
        >
          <span>{isInternational ? 'Request International Fee' : 'Get Current Fee'}</span>
          <ArrowRight className="w-3 h-3 text-amber-400" />
        </button>
      </div>
    );
  }

  // Standard Card layout
  if (layout === 'card') {
    return (
      <div className={`space-y-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
              Tuition & Training Fee
            </div>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              {isInternational ? 'International fee available on request' : 'Current fee available on request'}
            </div>
          </div>
          <span className="px-2 py-0.5 bg-navy-100 text-navy-800 text-[10px] font-bold rounded-md uppercase tracking-wider">
            {isInternational ? 'USD Quote' : 'NGN Quote'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            onClick={handleOpen}
            className="py-2.5 px-3.5 bg-gradient-to-r from-navy-900 to-indigo-900 hover:from-navy-800 hover:to-indigo-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isInternational ? 'Request USD Fee' : 'Get Current Fee'}</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Fee</span>
          </a>
        </div>
      </div>
    );
  }

  // Modal / Detail view layout
  if (layout === 'modal') {
    return (
      <div className={`space-y-4 bg-gradient-to-br from-slate-50 to-amber-50/40 p-5 rounded-2xl border border-amber-200/60 ${className}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              TRAINING FEE & TUITION
            </div>
            <div className="text-lg font-extrabold text-slate-900 mt-1">
              Contact AITI for the current fee.
            </div>
          </div>
          <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full border border-amber-300">
            Available on Request
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Our training fees may vary depending on the course, delivery format, schedule, cohort size, and current training promotional offers. Contact AITI Admissions to receive the latest applicable fee.
        </p>

        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <button
            onClick={handleOpen}
            className="flex-1 min-w-[160px] py-3 px-4 bg-navy-900 hover:bg-navy-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {isInternational ? 'Request International Fee' : 'Get Current Fee Quote'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Chat on WhatsApp
          </a>

          <a
            href={`tel:${settings.general.phone1}`}
            className="py-3 px-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-navy-800" />
            Call AITI
          </a>
        </div>
      </div>
    );
  }

  // Hero layout
  return (
    <div className={`inline-flex flex-wrap items-center gap-3 ${className}`}>
      <button
        onClick={handleOpen}
        className="py-3 px-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-navy-950 font-bold rounded-xl text-sm flex items-center gap-2 shadow-md transition-all"
      >
        <Sparkles className="w-4 h-4" />
        <span>{isInternational ? 'Request International Fee ($ USD)' : 'Get Current Fee Quote'}</span>
      </button>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="py-3 px-4 bg-emerald-600/90 hover:bg-emerald-600 text-white font-semibold rounded-xl text-sm flex items-center gap-2 backdrop-blur-xs transition-colors"
      >
        <MessageSquare className="w-4 h-4" />
        <span>WhatsApp AITI</span>
      </a>
    </div>
  );
};
