import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, Clock, Calendar, 
  DollarSign, FileText, Printer, Search, 
  ShieldCheck, MessageCircle, RefreshCw, Award 
} from 'lucide-react';
import { api } from '../../services/api';
import { Student, AcademicResult, PaymentTransaction } from '../../types';
import { DocumentViewerModal } from '../common/DocumentViewer';
import { useSettings } from '../../context/SettingsContext';

export const ParentPortal: React.FC = () => {
  const { settings } = useSettings();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [results, setResults] = useState<AcademicResult[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Document modal
  const [activeReceipt, setActiveReceipt] = useState<PaymentTransaction | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [stus, res, pays] = await Promise.all([
        api.getStudents(),
        api.getResults(),
        api.getPayments()
      ]);
      setStudents(stus);
      if (stus.length > 0) {
        const first = stus[0];
        setSelectedStudentId(first.id);
        setSelectedStudent(first);
        setResults(res.filter(r => r.studentId === first.id));
        setPayments(pays.filter(p => p.studentId === first.id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectStudent = (stuId: string) => {
    setSelectedStudentId(stuId);
    const stu = students.find(s => s.id === stuId) || null;
    setSelectedStudent(stu);
    if (stu) {
      api.getResults().then(res => setResults(res.filter(r => r.studentId === stu.id)));
      api.getPayments().then(pays => setPayments(pays.filter(p => p.studentId === stu.id)));
    }
  };

  const whatsapp = settings?.whatsapp;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              Parent & Guardian Portal
            </span>
            <span className="text-xs text-slate-400">Ward Progress & Attendance Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif mt-1">
            Student Ward Academic & Attendance Overview
          </h1>
          <p className="text-xs text-slate-400">
            Monitor your child or sponsored student's classroom attendance, continuous assessment scores, and tuition status at AITI.
          </p>
        </div>

        {/* Student Ward Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-400 hidden sm:inline">Select Ward:</label>
          <select
            value={selectedStudentId}
            onChange={(e) => handleSelectStudent(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-cyan-300 font-semibold focus:outline-hidden"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.fullName} ({s.studentNumber})</option>
            ))}
          </select>
        </div>
      </div>

      {selectedStudent && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Summary Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-20 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shrink-0">
                  <img
                    src={selectedStudent.passportPhotoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"}
                    alt={selectedStudent.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">{selectedStudent.fullName}</h2>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-400 font-mono mt-1">
                    <span>ID: <strong className="text-cyan-400">{selectedStudent.studentNumber}</strong></span>
                    <span>Program: <strong className="text-slate-200">{selectedStudent.programTitle}</strong></span>
                    <span>Cohort: <strong className="text-slate-200">{selectedStudent.className}</strong></span>
                  </div>
                </div>
              </div>

              <a
                href={`https://wa.me/234${(whatsapp?.primaryNumber || '08030947468').replace(/^0/, '')}?text=Hello%20AITI%20Student%20Affairs,%20I%20am%20the%20parent/guardian%20of%20${encodeURIComponent(selectedStudent.fullName)}%20(${selectedStudent.studentNumber}).`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contact Student Affairs</span>
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Laboratory Attendance</span>
                <div className="text-2xl font-bold text-emerald-400 font-mono">{selectedStudent.attendancePercentage || 95}%</div>
                <p className="text-[10px] text-slate-400 mt-1">Punctual & regular at physical lab classes</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Tuition Paid to Date</span>
                <div className="text-2xl font-bold text-white font-mono">
                  NGN {Number(selectedStudent.amountPaid || 0).toLocaleString()}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Billed: NGN {Number(selectedStudent.totalTuition || 0).toLocaleString()}</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Outstanding Balance</span>
                <div className="text-2xl font-bold text-amber-400 font-mono">
                  NGN {Number(selectedStudent.outstandingBalance || 0).toLocaleString()}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  {selectedStudent.outstandingBalance === 0 ? 'No outstanding fees' : 'Installment balance due'}
                </p>
              </div>
            </div>
          </div>

          {/* Academic Transcripts */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white font-serif">Academic Course Scores & Gradebook</h3>
                <p className="text-xs text-slate-400">Continuous assessments and official end-of-term examinations.</p>
              </div>
              <span className="text-xs text-slate-400 font-mono">Session: {selectedStudent.session}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4 font-mono">Assignment (20)</th>
                    <th className="py-3 px-4 font-mono">Test (20)</th>
                    <th className="py-3 px-4 font-mono">Lab (20)</th>
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

          {/* Payment Receipts */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white font-serif">Verified Bursary Payment Receipts</h3>
              <span className="text-xs text-slate-400">{payments.length} verified receipts</span>
            </div>

            <div className="space-y-2">
              {payments.map((p) => (
                <div key={p.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-cyan-400 font-mono">{p.receiptNumber}</strong>
                    <span className="text-slate-300 block text-[11px] capitalize">{p.paymentType?.replace('_', ' ')} • via {p.gateway}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <strong className="text-emerald-400 font-mono">NGN {Number(p.amount).toLocaleString()}</strong>
                    <button
                      onClick={() => setActiveReceipt(p)}
                      className="bg-slate-800 hover:bg-slate-700 text-cyan-400 px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-slate-700 flex items-center gap-1"
                    >
                      <Printer className="w-3 h-3" />
                      <span>View Receipt</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Official Payment Receipt Modal */}
      {activeReceipt && (
        <DocumentViewerModal
          type="receipt"
          data={activeReceipt}
          onClose={() => setActiveReceipt(null)}
        />
      )}

    </div>
  );
};
