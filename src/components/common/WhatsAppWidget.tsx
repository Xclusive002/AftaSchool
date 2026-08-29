import React, { useState } from 'react';
import { MessageCircle, X, Send, PhoneCall } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const WhatsAppWidget: React.FC = () => {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  if (!settings || !settings.whatsapp?.floatingEnabled) return null;

  const rawNumber = settings.whatsapp.primaryNumber || '08030947468';
  // Format for WhatsApp international link (Nigeria: replace leading 0 with 234)
  const formattedNumber = rawNumber.replace(/^0/, '234').replace(/[^0-9]/g, '');
  const defaultMessage = settings.whatsapp.defaultMessage || 'Hello AITI, I would like to make an enquiry about your programs and admission.';

  const handleSend = () => {
    const textToSend = customMsg.trim() || defaultMessage;
    const url = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(textToSend)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setCustomMsg('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md transition-all">
          <div className="bg-emerald-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Chat with AITI Admissions</h4>
                <p className="text-xs text-emerald-100 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                  Online Desk • Ilorin Campus
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 bg-slate-950/60 space-y-3">
            <div className="bg-slate-800/90 text-slate-200 text-xs p-3 rounded-xl rounded-tl-none border border-slate-700 leading-relaxed">
              Hello! 👋 Welcome to <strong className="text-cyan-400">AITI</strong>. How can we help you today with admissions, course fees, or schedules for the 2026/2027 session?
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-400 font-medium">Your Message:</label>
              <textarea
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder={defaultMessage}
                rows={2}
                className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSend}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <Send className="w-3.5 h-3.5" /> Start WhatsApp Chat
              </button>
              <a
                href={`tel:${settings.contact.primaryPhone}`}
                className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1.5"
                title="Direct Phone Call"
              >
                <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
              </a>
            </div>
            <p className="text-[10px] text-center text-slate-500">
              Direct response from AITI Admissions Desk: {settings.whatsapp.primaryNumber}
            </p>
          </div>
        </div>
      )}

      <button
        id="aiti-whatsapp-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-3 rounded-full shadow-xl shadow-emerald-950/50 hover:shadow-emerald-600/30 transition-all hover:scale-105"
      >
        <MessageCircle className="w-5 h-5 text-white" />
        <span className="text-sm font-semibold hidden sm:inline">WhatsApp AITI</span>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
      </button>
    </div>
  );
};
