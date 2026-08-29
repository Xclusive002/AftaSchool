import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Search, CheckCircle2, XCircle, Award, 
  FileText, UserCheck, DollarSign, Sparkles, RefreshCw, 
  ExternalLink, Building2 
} from 'lucide-react';
import { api } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';

export const VerificationPage: React.FC = () => {
  const { settings } = useSettings();
  const [docType, setDocType] = useState<string>('all');
  const [searchCode, setSearchCode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  // Check URL params for QR code redirects
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get('code');
    const typeParam = urlParams.get('type');
    if (codeParam) {
      setSearchCode(codeParam);
      if (typeParam) setDocType(typeParam);
      handleVerify(codeParam, typeParam || undefined);
    }
  }, []);

  const handleVerify = async (codeToVerify?: string, typeToVerify?: string) => {
    const code = (codeToVerify || searchCode).trim();
    if (!code) {
      alert('Please enter an official AITI reference code, admission number, certificate number, or student ID.');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const type = (typeToVerify || docType) === 'all' ? undefined : (typeToVerify || docType);
      const res = await api.verifyCode(code, type);
      setVerificationResult(res);
    } catch (err: any) {
      setVerificationResult({ success: false, verified: false, message: err.message || 'Verification lookup failed' });
    } finally {
      setLoading(false);
    }
  };

  const sampleCodes = [
    { label: 'Sample Certificate', code: 'AITI/CERT/2026/000001', type: 'certificate' },
    { label: 'Sample Admission Letter', code: 'AITI/ADM/2026/000001', type: 'admission' },
    { label: 'Sample Student ID', code: 'AITI/STU/2026/000001', type: 'student' },
    { label: 'Sample Payment Receipt', code: 'AITI/REC/2026/000001', type: 'receipt' },
  ];

  return (
    <div className="space-y-12 py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" /> Official Digital Verification Gateway
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-serif tracking-tight">
          Verify Official AITI Records
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Instantly authenticate genuine certificates, provisional admission offers, student identity cards, and bursary payment receipts issued by <strong className="text-cyan-400">{settings?.general.fullName || 'AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE'}</strong>.
        </p>
      </div>

      {/* Search Console */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {/* Type Selector Tabs */}
        <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-800">
          {[
            { id: 'all', label: 'Universal Search' },
            { id: 'certificate', label: 'Certificate' },
            { id: 'admission', label: 'Admission Letter' },
            { id: 'student', label: 'Student ID' },
            { id: 'receipt', label: 'Payment Receipt' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setDocType(t.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                docType === t.id
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="e.g. AITI/CERT/2026/000001 or AITI/ADM/2026/000001..."
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-hidden focus:border-cyan-500 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !searchCode.trim()}
            className="bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-black px-8 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-slate-950" /> Verify Record
              </>
            )}
          </button>
        </form>

        {/* Quick Test Samples */}
        <div className="pt-2">
          <span className="text-[11px] font-semibold text-slate-400 block mb-2">Try sample issued references:</span>
          <div className="flex flex-wrap gap-2">
            {sampleCodes.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSearchCode(s.code);
                  setDocType(s.type);
                  handleVerify(s.code, s.type);
                }}
                className="text-[10px] font-mono bg-slate-950 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors"
              >
                {s.label} ({s.code})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Verification Result Card */}
      {searched && (
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-200">
          {verificationResult?.verified ? (
            <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
                    AUTHENTICITY CONFIRMED
                  </span>
                  <h3 className="text-xl font-bold text-white font-serif">
                    Official AITI Record Verified
                  </h3>
                  <p className="text-xs text-slate-400">
                    Recorded in the institutional registry at Tanke, Ilorin, Kwara State.
                  </p>
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
                {/* Details Breakdown based on verified document type */}
                {verificationResult.type === 'certificate' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-500 uppercase text-[10px] block">Certificate Reference</span>
                      <strong className="text-amber-400 font-mono text-sm">{verificationResult.data.certificateNumber}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase text-[10px] block">Awarded To</span>
                      <strong className="text-white text-sm">{verificationResult.data.studentName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase text-[10px] block">Program</span>
                      <span className="text-cyan-300 font-semibold">{verificationResult.data.programTitle}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase text-[10px] block">Grade Achieved</span>
                      <strong className="text-emerald-400 font-bold">{verificationResult.data.gradeAchieved}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase text-[10px] block">Completion Date</span>
                      <span className="text-slate-300">{verificationResult.data.completionDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase text-[10px] block">Issuing Authority</span>
                      <span className="text-slate-300">{verificationResult.data.institute}</span>
                    </div>
                  </div>
                )}

                {verificationResult.type === 'admission' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-500 uppercase text-[10px] block">Admission Reference</span>
                      <strong className="text-cyan-400 font-mono text-sm">{verificationResult.data.admissionNumber}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase text-[10px] block">Student Name</span>
                      <strong className="text-white text-sm">{verificationResult.data.studentName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase text-[10px] block">Program</span>
                      <span className="text-cyan-300">{verificationResult.data.programTitle}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase text-[10px] block">Academic Session</span>
                      <span className="text-slate-300">{verificationResult.data.session}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase text-[10px] block">Status</span>
                      <span className="text-emerald-400 uppercase font-bold">{verificationResult.data.status}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase text-[10px] block">Offer Date</span>
                      <span className="text-slate-300">{new Date(verificationResult.data.offeredAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}

                {verificationResult.type === 'student' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-500 uppercase text-[10px] block">Student ID Number</span>
                      <strong className="text-cyan-400 font-mono text-sm">{verificationResult.data.studentNumber}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase text-[10px] block">Student Full Name</span>
                      <strong className="text-white text-sm">{verificationResult.data.fullName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase text-[10px] block">Enrolled Program</span>
                      <span className="text-slate-300">{verificationResult.data.programTitle}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase text-[10px] block">Class / Cohort</span>
                      <span className="text-slate-300">{verificationResult.data.className}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase text-[10px] block">Student Status</span>
                      <span className="text-emerald-400 uppercase font-bold">{verificationResult.data.status}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase text-[10px] block">Session</span>
                      <span className="text-slate-300">{verificationResult.data.session}</span>
                    </div>
                  </div>
                )}

                {verificationResult.type === 'receipt' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-500 uppercase text-[10px] block">Receipt Reference</span>
                      <strong className="text-emerald-400 font-mono text-sm">{verificationResult.data.receiptNumber}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase text-[10px] block">Payer / Student</span>
                      <strong className="text-white text-sm">{verificationResult.data.studentName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase text-[10px] block">Amount Paid</span>
                      <strong className="text-emerald-400 font-mono">NGN {Number(verificationResult.data.amount).toLocaleString()}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase text-[10px] block">Payment Type</span>
                      <span className="text-slate-300 capitalize">{verificationResult.data.paymentType?.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase text-[10px] block">Payment Date</span>
                      <span className="text-slate-300">{new Date(verificationResult.data.paidAt).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase text-[10px] block">Status</span>
                      <span className="text-emerald-400 uppercase font-bold">{verificationResult.data.status}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <span>Verification Source: Official AITI Registry Node</span>
                <span className="text-emerald-400 font-semibold">100% Genuine & Secure</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border-2 border-red-500/50 rounded-3xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 border border-red-400/40 flex items-center justify-center mx-auto">
                <XCircle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white font-serif">Record Not Verified</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                {verificationResult?.message || 'No official institutional record matches the code provided. Please check the spelling or contact the admissions registry on 08030947468.'}
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
