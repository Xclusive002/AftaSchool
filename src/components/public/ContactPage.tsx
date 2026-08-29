import React, { useState } from 'react';
import { 
  MapPin, Phone, Mail, MessageCircle, Clock, 
  Send, CheckCircle2, Building2, Sparkles, PhoneCall 
} from 'lucide-react';
import { api } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';

export const ContactPage: React.FC = () => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: 'Admission Inquiry',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const contact = settings?.contact;
  const whatsapp = settings?.whatsapp;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) {
      alert('Please fill in your name, email and message.');
      return;
    }
    setSubmitting(true);
    try {
      await api.submitContact(formData);
      setSentSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: 'Admission Inquiry',
        message: ''
      });
    } catch (err: any) {
      alert('Error sending message: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <PhoneCall className="w-3.5 h-3.5" /> Admissions Desk & Enquiries
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-serif tracking-tight">
          Get in Touch with AITI
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Have questions about program curricula, tuition installments, or physical campus visits? We're here to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Contact Information & Map Card */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h3 className="text-xl font-bold text-white font-serif border-b border-slate-800 pb-3">
              Campus Location & Directory
            </h3>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center shrink-0 mt-0.5 text-cyan-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-sm text-white block">Main Campus Address</strong>
                  <p className="text-slate-300 mt-0.5">{contact?.address || '2 Babanla Street, Graceland Junction'}</p>
                  <p className="text-slate-400">{contact?.junction || 'Graceland Junction'}, {contact?.city || 'Tanke, Ilorin, Kwara State, Nigeria'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center shrink-0 mt-0.5 text-cyan-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <strong className="text-sm text-white block">Direct Telephone Lines</strong>
                  <a href={`tel:${contact?.primaryPhone || '08030947468'}`} className="block text-cyan-400 hover:underline">
                    {contact?.primaryPhone || '08030947468'} (Admissions & Registrar)
                  </a>
                  <a href={`tel:${contact?.secondaryPhone || '08024142417'}`} className="block text-cyan-400 hover:underline">
                    {contact?.secondaryPhone || '08024142417'} (Enquiries Desk)
                  </a>
                  <a href={`tel:${contact?.tertiaryPhone || '09056119667'}`} className="block text-slate-300 hover:text-cyan-400">
                    {contact?.tertiaryPhone || '09056119667'} (Technical Support)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center shrink-0 mt-0.5 text-cyan-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-sm text-white block">Official Email</strong>
                  <a href={`mailto:${contact?.email || 'aftatechit@gmail.com'}`} className="text-cyan-400 hover:underline">
                    {contact?.email || 'aftatechit@gmail.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-sm text-white block">WhatsApp Admissions Desk</strong>
                  <a 
                    href={`https://wa.me/234${(whatsapp?.primaryNumber || '08030947468').replace(/^0/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 font-semibold hover:underline"
                  >
                    Chat on WhatsApp ({whatsapp?.primaryNumber || '08030947468'})
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-800 flex items-center justify-center shrink-0 mt-0.5 text-purple-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-sm text-white block">Operating Hours</strong>
                  <p className="text-slate-300">{contact?.workingHours || 'Monday – Friday: 8:00 AM – 6:00 PM'}</p>
                  <p className="text-slate-400">Saturdays: 9:00 AM – 4:00 PM (Weekend Classes)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Contact Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <h3 className="text-xl font-bold text-white font-serif border-b border-slate-800 pb-3">
            Send an Online Inquiry
          </h3>

          {sentSuccess ? (
            <div className="p-6 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white">Message Sent Successfully!</h4>
              <p className="text-xs text-slate-300">
                Thank you for contacting AITI. Our admissions team will get back to you via phone or email shortly.
              </p>
              <button
                onClick={() => setSentSuccess(false)}
                className="text-xs text-cyan-400 underline font-semibold mt-2 block mx-auto"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Oluwaseun Ajayi"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-600 focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. oluwaseun@gmail.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-600 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 08145678901"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-600 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">Inquiry Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-hidden focus:border-cyan-500"
                >
                  <option value="Admission Inquiry">Admission & Application Inquiry</option>
                  <option value="Program & Curriculum">Program & Curriculum Details</option>
                  <option value="Fee Schedule">Tuition Fees & Installment Plans</option>
                  <option value="Weekend & Evening Classes">Weekend & Executive Classes</option>
                  <option value="Certificate Verification">Certificate Verification</option>
                  <option value="Partnership & Sponsorship">Corporate Training / Partnership</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">Your Message *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist you with our programs or admissions?"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-600 focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting Inquiry...' : 'Submit Inquiry to Admissions'}</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
