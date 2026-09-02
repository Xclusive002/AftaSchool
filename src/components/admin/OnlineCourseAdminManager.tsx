import React, { useState } from 'react';
import { 
  Laptop, Globe, DollarSign, Plus, Edit2, Trash2, CheckCircle2, 
  Calendar, Video, FileText, HelpCircle, Users, Tag, ArrowRight, 
  ShieldCheck, Search, Filter, Save, Eye, X, Award
} from 'lucide-react';
import { DetailedOnlineCourse } from '../../data/onlineCoursesSeed';
import { formatCurrency, SupportedCurrency } from '../../services/currency';
import { Coupon } from '../../types';
import { api } from '../../services/api';

export const OnlineCourseAdminManager: React.FC = () => {
  const [courses, setCourses] = useState<DetailedOnlineCourse[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<DetailedOnlineCourse | null>(null);
  const [adminTab, setAdminTab] = useState<'courses' | 'finance' | 'coupons' | 'submissions'>('courses');

  // New coupon modal state
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountPercent: 10,
    discountAmount: 0,
    currency: 'NGN' as SupportedCurrency,
    validUntil: '2026-12-31'
  });

  const [submissions, setSubmissions] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  // Selected submission for grading modal
  const [gradingSubmission, setGradingSubmission] = useState<any | null>(null);
  const [gradeInput, setGradeInput] = useState<number>(90);
  const [feedbackInput, setFeedbackInput] = useState<string>('');

  // Course Editing Form State
  const [editingCourse, setEditingCourse] = useState<DetailedOnlineCourse | null>(null);

  const handleSaveCoursePricing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    setCourses(prev => prev.map(c => c.id === editingCourse.id ? editingCourse : c));
    if (selectedCourse?.id === editingCourse.id) {
      setSelectedCourse(editingCourse);
    }
    setEditingCourse(null);
    alert('Course delivery modes and multi-currency pricing updated successfully.');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Coupon = {
      id: `coup-${Date.now()}`,
      code: newCoupon.code.toUpperCase(),
      discountPercent: Number(newCoupon.discountPercent) || undefined,
      discountAmount: Number(newCoupon.discountAmount) || undefined,
      currency: newCoupon.currency,
      validUntil: newCoupon.validUntil,
      maxUses: 100,
      usedCount: 0,
      active: true
    };
    setCoupons(prev => [created, ...prev]);
    setShowCouponModal(false);
    setNewCoupon({ code: '', discountPercent: 10, discountAmount: 0, currency: 'NGN', validUntil: '2026-12-31' });
  };

  const handleSaveGrade = () => {
    if (!gradingSubmission) return;
    setSubmissions(prev => prev.map(s => s.id === gradingSubmission.id ? {
      ...s,
      graded: true,
      score: gradeInput,
      feedback: feedbackInput
    } : s));
    setGradingSubmission(null);
  };

  // Financial metrics calculation
  React.useEffect(() => {
    api.getLmsCourses().then(loadedCourses => {
      setCourses(loadedCourses);
      setSelectedCourse(loadedCourses[0] || null);
    }).catch(console.error);
    api.getPayments().then(setPayments).catch(console.error);
  }, []);

  const totalNgnRevenue = payments.filter(payment => payment.status === 'success' && payment.currency !== 'USD').reduce((total, payment) => total + Number(payment.amount || 0), 0);
  const totalUsdRevenue = payments.filter(payment => payment.status === 'success' && payment.currency === 'USD').reduce((total, payment) => total + Number(payment.amount || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* 1. TOP HEADER & TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Laptop className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-white">
              Online Training &amp; Multi-Currency Management
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Configure online course delivery, set independent NGN/USD pricing, manage live sessions, coupons, and grade student submissions.
          </p>
        </div>

        {/* Admin Tabs */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {[
            { id: 'courses', label: 'Online Courses & Pricing', icon: Laptop },
            { id: 'finance', label: 'Multi-Currency Revenue', icon: DollarSign },
            { id: 'submissions', label: 'Student Submissions', icon: FileText },
            { id: 'coupons', label: 'Coupons & Discounts', icon: Tag }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  adminTab === tab.id
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. TAB CONTENT: ONLINE COURSES & PRICING */}
      {adminTab === 'courses' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Courses List (4 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase">Available Tech Courses ({courses.length})</span>
              
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {courses.map((c) => {
                  const isSelected = selectedCourse?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCourse(c)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-500'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-cyan-400 font-bold">{c.code}</span>
                        <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-md font-semibold">
                          Online Ready
                        </span>
                      </div>
                      
                      <strong className="text-xs text-white block leading-snug">{c.title}</strong>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-[11px]">
                        <span className="text-emerald-400 font-bold">₦{c.localOnlinePrice?.toLocaleString()} (Local)</span>
                        <span className="text-cyan-300 font-bold">${c.internationalOnlinePrice} USD (Intl)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Selected Course Details & Pricing Editor (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {selectedCourse && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                
                <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs text-cyan-400 font-mono font-bold">{selectedCourse.code}</span>
                    <h3 className="text-lg font-bold text-white">{selectedCourse.title}</h3>
                  </div>
                  <button
                    onClick={() => setEditingCourse(selectedCourse)}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Multi-Currency Pricing</span>
                  </button>
                </div>

                {/* Current Pricing Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Local Physical Tuition</span>
                    <span className="text-base font-black text-emerald-400">
                      {selectedCourse.localPhysicalPrice != null ? formatCurrency(selectedCourse.localPhysicalPrice, 'NGN') : ''}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Tanke Campus, Ilorin</span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Local Online Tuition</span>
                    <span className="text-base font-black text-cyan-400">
                      {selectedCourse.localOnlinePrice != null ? formatCurrency(selectedCourse.localOnlinePrice, 'NGN') : ''}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Nigeria Online Students</span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">International Online Tuition</span>
                    <span className="text-base font-black text-indigo-400">
                      {selectedCourse.internationalOnlinePrice != null ? formatCurrency(selectedCourse.internationalOnlinePrice, 'USD', { showCode: true }) : ''}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Worldwide Remote</span>
                  </div>
                </div>

                {/* Modules & Syllabus Overview */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Curriculum Modules ({selectedCourse.modules.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedCourse.modules.map((mod) => (
                      <div key={mod.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <strong className="text-white block">{mod.title}</strong>
                          <span className="text-[10px] text-slate-400">{mod.lessons.length} Lessons</span>
                        </div>
                        <span className="text-cyan-400 font-mono text-[10px]">Active</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Classes Configured */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Scheduled Live Video Classes
                  </h4>
                  {selectedCourse.liveClasses && selectedCourse.liveClasses.length > 0 ? (
                    selectedCourse.liveClasses.map((live) => (
                      <div key={live.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <strong className="text-white block">{live.title}</strong>
                          <span className="text-[10px] text-cyan-400">{live.meetingPlatform} • {live.instructorName}</span>
                        </div>
                        <span className="text-slate-400 font-mono text-[10px]">{live.durationMinutes} mins</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500">No live sessions scheduled.</div>
                  )}
                </div>

              </div>
            )}
          </div>

        </div>
      )}

      {/* 3. TAB CONTENT: MULTI-CURRENCY REVENUE DASHBOARD */}
      {adminTab === 'finance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Nigerian Naira Revenue Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-900/50 p-6 sm:p-8 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Local Nigerian Revenue (NGN)
                </span>
                <span className="text-xl">🇳🇬</span>
              </div>
              
              <div className="space-y-1">
                <span className="text-3xl sm:text-4xl font-black text-white">
                  {formatCurrency(totalNgnRevenue, 'NGN')}
                </span>
                <span className="text-xs text-slate-400 block">
                  Processed via Paystack &amp; Flutterwave (Verified)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block">Total Local Students:</span>
                  <strong className="text-white">{payments.filter(payment => payment.status === 'success' && payment.currency !== 'USD').length} Enrollments</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Avg Course Price:</span>
                  <strong className="text-emerald-400">{totalNgnRevenue ? formatCurrency(totalNgnRevenue / Math.max(1, payments.filter(payment => payment.status === 'success' && payment.currency !== 'USD').length), 'NGN') : ''}</strong>
                </div>
              </div>
            </div>

            {/* USD International Revenue Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-900/50 p-6 sm:p-8 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span> International Revenue (USD)
                </span>
                <span className="text-xl">🌎</span>
              </div>
              
              <div className="space-y-1">
                <span className="text-3xl sm:text-4xl font-black text-white">
                  {formatCurrency(totalUsdRevenue, 'USD', { showCode: true })}
                </span>
                <span className="text-xs text-slate-400 block">
                  Processed via International Card Gateways
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block">International Students:</span>
                  <strong className="text-white">{payments.filter(payment => payment.status === 'success' && payment.currency === 'USD').length} Enrollments</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Top Countries:</span>
                  <strong className="text-cyan-300">{payments.filter(payment => payment.status === 'success' && payment.currency === 'USD').length ? 'Recorded international payments' : ''}</strong>
                </div>
              </div>
            </div>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Strict Currency Separation Enforced: Local NGN and International USD are never aggregated or converted with speculative exchange rates.</span>
            </span>
          </div>
        </div>
      )}

      {/* 4. TAB CONTENT: STUDENT SUBMISSIONS & GRADING */}
      {adminTab === 'submissions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Student Assignment Submissions ({submissions.length})</h3>
          </div>

          <div className="space-y-3">
            {submissions.map((sub) => (
              <div key={sub.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <strong className="text-white text-sm block">{sub.studentName}</strong>
                    <span className="text-[10px] text-cyan-400">{sub.studentLocation} • {sub.studentEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {sub.graded ? (
                      <span className="px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-400 font-bold border border-emerald-800">
                        Graded: {sub.score}/100
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-md bg-amber-950 text-amber-400 font-bold border border-amber-800">
                        Pending Review
                      </span>
                    )}

                    <button
                      onClick={() => {
                        setGradingSubmission(sub);
                        setGradeInput(sub.score || 90);
                        setFeedbackInput(sub.feedback || '');
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1 rounded-lg text-xs"
                    >
                      {sub.graded ? 'Update Grade' : 'Grade Submission'}
                    </button>
                  </div>
                </div>

                <div className="text-slate-300">
                  <span className="text-slate-500 block text-[10px]">Assignment: {sub.assignmentTitle}</span>
                  <p className="mt-1 font-mono text-[11px] bg-slate-900 p-2 rounded-lg text-slate-200">{sub.submissionText}</p>
                </div>

                {sub.feedback && (
                  <div className="text-[11px] text-emerald-300 bg-emerald-950/40 p-2 rounded-lg border border-emerald-900/50">
                    <strong>Instructor Feedback:</strong> {sub.feedback}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT: COUPONS & DISCOUNTS */}
      {adminTab === 'coupons' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Coupons &amp; Scholarship Codes</h3>
              <p className="text-xs text-slate-400">Offer percentage or fixed discounts on NGN or USD enrollments.</p>
            </div>
            <button
              onClick={() => setShowCouponModal(true)}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon Code</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div key={c.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black font-mono text-cyan-400">{c.code}</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-semibold">Active</span>
                </div>
                <div className="text-slate-300">
                  Discount: <strong className="text-white">{c.discountPercent ? `${c.discountPercent}% OFF` : `${c.discountAmount} ${c.currency}`}</strong>
                </div>
                <div className="text-[10px] text-slate-500">
                  Valid Until: {c.validUntil} • Uses: {c.usedCount}/{c.maxUses || 100}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDIT COURSE PRICING MODAL */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Edit Multi-Currency Pricing</h3>
              <button onClick={() => setEditingCourse(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoursePricing} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Local Physical Tuition (NGN ₦)</label>
                <input
                  type="number"
                  value={editingCourse.localPhysicalPrice}
                  onChange={(e) => setEditingCourse(prev => prev ? { ...prev, localPhysicalPrice: Number(e.target.value) } : null)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Local Online Tuition (NGN ₦)</label>
                <input
                  type="number"
                  value={editingCourse.localOnlinePrice}
                  onChange={(e) => setEditingCourse(prev => prev ? { ...prev, localOnlinePrice: Number(e.target.value) } : null)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">International Online Tuition (USD $)</label>
                <input
                  type="number"
                  value={editingCourse.internationalOnlinePrice}
                  onChange={(e) => setEditingCourse(prev => prev ? { ...prev, internationalOnlinePrice: Number(e.target.value) } : null)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-xl text-xs uppercase"
                >
                  Save Pricing Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GRADING MODAL */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-white">Grade Student Project</h3>
            <p className="text-slate-300">{gradingSubmission.studentName} — {gradingSubmission.assignmentTitle}</p>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Score (out of 100):</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={gradeInput}
                  onChange={(e) => setGradeInput(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Instructor Feedback:</label>
                <textarea
                  rows={3}
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                ></textarea>
              </div>

              <button
                onClick={handleSaveGrade}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs uppercase"
              >
                Submit Grade &amp; Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE COUPON MODAL */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-white">Create New Promotional Code</h3>
            
            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FLASH20"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, code: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 uppercase"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Discount Percentage (%)</label>
                <input
                  type="number"
                  value={newCoupon.discountPercent}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, discountPercent: Number(e.target.value) }))}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Valid Until Date</label>
                <input
                  type="date"
                  value={newCoupon.validUntil}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, validUntil: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs uppercase"
                >
                  Create Code
                </button>
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
