import React, { useState, useEffect } from 'react';
import { 
  User, Award, FileText, CreditCard, CheckCircle2, 
  Clock, BookOpen, Download, Printer, ShieldCheck, 
  Send, ExternalLink, RefreshCw, Sparkles 
} from 'lucide-react';
import { api } from '../../services/api';
import { Student, Assignment, AcademicResult, PaymentTransaction, AdmissionOffer, CertificateRecord } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { DocumentViewerModal } from '../common/DocumentViewer';

export const StudentPortal: React.FC = () => {
  const { currentUser } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [results, setResults] = useState<AcademicResult[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [admissionOffer, setAdmissionOffer] = useState<AdmissionOffer | null>(null);
  const [certificate, setCertificate] = useState<CertificateRecord | null>(null);
  const [loading, setLoading] = useState(true);

  // Document modal viewer
  const [docModal, setDocModal] = useState<{ type: 'admission' | 'certificate' | 'idcard' | 'receipt'; data: any } | null>(null);

  // Pay tuition modal
  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(30000);
  const [payGateway, setPayGateway] = useState<string>('paystack');
  const [paying, setPaying] = useState(false);

  // Submit assignment modal
  const [submittingAssign, setSubmittingAssign] = useState<Assignment | null>(null);
  const [projectRepoUrl, setProjectRepoUrl] = useState('');
  const [projectNotes, setProjectNotes] = useState('');
  const [assignSubmitting, setAssignSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [stus, assigns, res, pays, adms, certs] = await Promise.all([
        api.getStudents(),
        api.getAssignments(),
        api.getResults(),
        api.getPayments(),
        api.getAdmissions(),
        api.getCertificates()
      ]);

      // Find current student or default to first student for demo
      const currentStu = stus.find(s => s.email === currentUser.email) || stus[0];
      setStudent(currentStu);

      if (currentStu) {
        setAssignments(assigns.assignments || []);
        setResults(res.filter(r => r.studentId === currentStu.id));
        setPayments(pays.filter(p => p.studentId === currentStu.id));
        
        const adm = adms.find(a => a.admissionNumber === currentStu.admissionNumber);
        if (adm) setAdmissionOffer(adm);

        const cert = certs.find(c => c.studentId === currentStu.id);
        if (cert) setCertificate(cert);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handlePayTuition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;
    setPaying(true);
    try {
      const res = await api.recordTuitionPayment(
        student.id,
        payAmount,
        payGateway,
        'tuition_installment'
      );
      setShowPayModal(false);
      setDocModal({ type: 'receipt', data: res.receipt });
      await loadData();
    } catch (err: any) {
      alert('Payment failed: ' + err.message);
    } finally {
      setPaying(false);
    }
  };

  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingAssign) return;
    setAssignSubmitting(true);
    try {
      await api.submitAssignment(submittingAssign.id, {
        studentId: student?.id || 'stu_01',
        studentName: student?.fullName || 'AITI Student',
        studentNumber: student?.studentNumber || '',
        submissionText: `${projectNotes} (Repository: ${projectRepoUrl})`,
        attachmentName: projectRepoUrl
      });
      alert('Assignment successfully submitted to instructor for review!');
      setSubmittingAssign(null);
      setProjectRepoUrl('');
      setProjectNotes('');

    } catch (err: any) {
      alert('Submission failed: ' + err.message);
    } finally {
      setAssignSubmitting(false);
    }
  };

  if (!student) {
    return (
      <div className="text-center py-20 text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-cyan-400" />
        <span>Loading Student Portal...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Student Profile Hero */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-24 rounded-2xl overflow-hidden border-2 border-cyan-500/40 shrink-0 bg-slate-950">
              <img
                src={student.passportPhotoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"}
                alt={student.fullName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800">
                  {student.programType.toUpperCase()} COHORT
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 uppercase font-bold">
                  {student.status}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
                {student.fullName}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-mono">
                <span>Matric No: <strong className="text-cyan-300">{student.studentNumber}</strong></span>
                <span>Class: <strong className="text-slate-200">{student.className}</strong></span>
                <span>Session: <strong className="text-slate-200">{student.session}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Print Hub Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setDocModal({ type: 'idcard', data: student })}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Digital Student ID</span>
            </button>

            {admissionOffer && (
              <button
                onClick={() => setDocModal({ type: 'admission', data: admissionOffer })}
                className="bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-slate-700"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Admission Letter</span>
              </button>
            )}

            {certificate && (
              <button
                onClick={() => setDocModal({ type: 'certificate', data: certificate })}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Graduation Certificate</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Laboratory Attendance</span>
            <div className="text-2xl font-bold text-emerald-400 font-mono">{student.attendancePercentage || 96}%</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: `${student.attendancePercentage || 96}%` }}></div>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Tuition Paid</span>
            <div className="text-2xl font-bold text-white font-mono">
              NGN {Number(student.amountPaid || 0).toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Total Billed: NGN {Number(student.totalTuition || 0).toLocaleString()}
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Outstanding Balance</span>
              <div className="text-2xl font-bold text-amber-400 font-mono">
                NGN {Number(student.outstandingBalance || 0).toLocaleString()}
              </div>
            </div>
            {student.outstandingBalance > 0 && (
              <button
                onClick={() => {
                  setPayAmount(student.outstandingBalance);
                  setShowPayModal(true);
                }}
                className="mt-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>Pay Balance Online</span>
                <CreditCard className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Academic Results & Transcripts */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-lg font-bold text-white font-serif">Academic Course Scores & Transcripts</h3>
            <p className="text-xs text-slate-400">Continuous assessments, practical test marks, and GPA grades.</p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-3 py-1 rounded-lg border border-cyan-800">
            Session: {student.session}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Course Title / Code</th>
                <th className="py-3 px-4 font-mono">Assignment (20)</th>
                <th className="py-3 px-4 font-mono">Test (20)</th>
                <th className="py-3 px-4 font-mono">Practical Lab (20)</th>
                <th className="py-3 px-4 font-mono">Exam (40)</th>
                <th className="py-3 px-4 font-mono">Total (100)</th>
                <th className="py-3 px-4">Grade & GPA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {results.map((res) => (
                <tr key={res.id} className="hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-bold text-white text-sm">{res.courseTitle}</td>
                  <td className="py-3.5 px-4 font-mono text-cyan-400">{res.assignmentScore}</td>
                  <td className="py-3.5 px-4 font-mono text-cyan-400">{res.testScore}</td>
                  <td className="py-3.5 px-4 font-mono text-cyan-400">{res.practicalLabScore}</td>
                  <td className="py-3.5 px-4 font-mono text-cyan-400">{res.examScore}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 text-sm">{res.totalScore}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 font-black text-xs border border-emerald-800 font-mono">
                      {res.grade} ({res.gpaPoints} GPA)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Practical Assignments Hub */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-lg font-bold text-white font-serif">Assigned Practical Projects</h3>
            <p className="text-xs text-slate-400">Submit your GitHub repository links and project write-ups.</p>
          </div>
          <span className="text-xs text-slate-400">{assignments.length} Projects assigned</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map((item) => (
            <div key={item.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[10px] uppercase font-bold text-purple-400">{item.className}</span>
                  <span className="text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> Due: {item.dueDate}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 font-mono font-semibold">Max: {item.maxScore} pts</span>
                <button
                  onClick={() => setSubmittingAssign(item)}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow-xs"
                >
                  <Send className="w-3 h-3" />
                  <span>Submit Solution</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History & Receipts */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-white font-serif">Bursary Payment History & e-Receipts</h3>
          <span className="text-xs text-slate-400">{payments.length} receipts issued</span>
        </div>

        <div className="space-y-2">
          {payments.map((p) => (
            <div key={p.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <strong className="text-cyan-400 font-mono">{p.receiptNumber}</strong>
                  <span className="text-slate-300 capitalize">{p.paymentType?.replace('_', ' ')}</span>
                </div>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {new Date(p.paidAt).toLocaleString()} via {p.gateway}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <strong className="text-emerald-400 font-mono text-sm">
                  NGN {Number(p.amount).toLocaleString()}
                </strong>
                <button
                  onClick={() => setDocModal({ type: 'receipt', data: p })}
                  className="bg-slate-800 hover:bg-slate-700 text-cyan-400 px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-slate-700 flex items-center gap-1"
                >
                  <Printer className="w-3 h-3" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assignment Submission Modal */}
      {submittingAssign && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-cyan-400 font-mono">{submittingAssign.className}</span>
                <h3 className="text-lg font-bold text-white font-serif">{submittingAssign.title}</h3>
              </div>
              <button
                onClick={() => setSubmittingAssign(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitAssignment} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">GitHub / Project Repository URL *</label>
                <input
                  type="url"
                  required
                  value={projectRepoUrl}
                  onChange={(e) => setProjectRepoUrl(e.target.value)}
                  placeholder="https://github.com/your-username/my-project-repo"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Submission Notes & Live Demo Link</label>
                <textarea
                  rows={4}
                  value={projectNotes}
                  onChange={(e) => setProjectNotes(e.target.value)}
                  placeholder="Explain how you built the project, setup steps, or any special architectural decisions..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSubmittingAssign(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assignSubmitting}
                  className="px-6 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                >
                  {assignSubmitting ? 'Submitting...' : 'Submit to Instructor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Online Tuition Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white font-serif">Pay Tuition Balance Online</h3>
              <button
                onClick={() => setShowPayModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePayTuition} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Amount to Pay (NGN) *</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-mono text-sm"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Payment Channel</label>
                <select
                  value={payGateway}
                  onChange={(e) => setPayGateway(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white"
                >
                  <option value="paystack">Paystack Online Payment</option>
                  <option value="flutterwave">Flutterwave Online Gateway</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={paying}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  {paying ? 'Processing...' : `Pay NGN ${payAmount.toLocaleString()}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Document Modal */}
      {docModal && (
        <DocumentViewerModal
          type={docModal.type}
          data={docModal.data}
          onClose={() => setDocModal(null)}
        />
      )}

    </div>
  );
};
