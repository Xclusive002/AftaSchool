import React, { useState, useEffect } from 'react';
import { 
  DollarSign, CreditCard, CheckCircle2, AlertCircle, 
  Search, RefreshCw, Printer, FileText, ArrowRight, 
  ShieldCheck, UserCheck, Plus, Sparkles 
} from 'lucide-react';
import { api } from '../../services/api';
import { Student, PaymentTransaction } from '../../types';
import { DocumentViewerModal } from '../common/DocumentViewer';

export const FinancePortal: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Payment recording state
  const [selectedStudentForPay, setSelectedStudentForPay] = useState<Student | null>(null);
  const [payAmount, setPayAmount] = useState<number>(40000);
  const [payGateway, setPayGateway] = useState<string>('paystack');
  const [payType, setPayType] = useState<'tuition_deposit' | 'tuition_installment' | 'tuition_balance' | 'certificate_fee'>('tuition_installment');
  const [submittingPay, setSubmittingPay] = useState(false);

  // Document modal state
  const [activeReceiptDoc, setActiveReceiptDoc] = useState<PaymentTransaction | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [stus, pays] = await Promise.all([
        api.getStudents(),
        api.getPayments()
      ]);
      setStudents(stus);
      setPayments(pays);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalBilled = students.reduce((acc, s) => acc + (s.totalTuition || 0), 0);
  const totalCollected = students.reduce((acc, s) => acc + (s.amountPaid || 0), 0);
  const totalOutstanding = students.reduce((acc, s) => acc + (s.outstandingBalance || 0), 0);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForPay) return;
    if (payAmount <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    setSubmittingPay(true);
    try {
      const res = await api.recordTuitionPayment(
        selectedStudentForPay.id,
        payAmount,
        payGateway,
        payType
      );
      setSelectedStudentForPay(null);
      setActiveReceiptDoc(res.receipt);
      await loadData();
    } catch (err: any) {
      alert('Error recording payment: ' + err.message);
    } finally {
      setSubmittingPay(false);
    }
  };

  const filteredStudents = students.filter(s => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (s.fullName || '').toLowerCase().includes(q) ||
      (s.studentNumber || '').toLowerCase().includes(q) ||
      (s.programTitle || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              Bursary & Financial Registry
            </span>
            <span className="text-xs text-slate-400">Institutional Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif mt-1">
            Tuition & Revenue Operations
          </h1>
          <p className="text-xs text-slate-400">
            Process student installment payments, monitor outstanding balances, and issue official QR-verifiable e-Receipts.
          </p>
        </div>

        <button
          onClick={loadData}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
          title="Refresh Ledger"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Total Invoiced Tuition</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            NGN {totalBilled.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Active matriculated cohorts</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Tuition Revenue Collected</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
            NGN {totalCollected.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-400 mt-1 block">
            {totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0}% recovery rate
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Outstanding Tuition Balance</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
            NGN {totalOutstanding.toLocaleString()}
          </div>
          <span className="text-[10px] text-amber-300/80 mt-1 block">Pending student installments</span>
        </div>
      </div>

      {/* Student Ledger Accounts */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl space-y-4 p-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white font-serif">Student Tuition Accounts</h3>
            <p className="text-xs text-slate-400">Manage individual student balances and record payments.</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name or ID..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Student Name / ID</th>
                <th className="py-3 px-4">Program</th>
                <th className="py-3 px-4 font-mono">Total Billed</th>
                <th className="py-3 px-4 font-mono">Amount Paid</th>
                <th className="py-3 px-4 font-mono">Outstanding</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStudents.map((stu) => (
                <tr key={stu.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white text-sm">{stu.fullName}</div>
                    <span className="font-mono text-[10px] text-cyan-400">{stu.studentNumber}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-slate-200">{stu.programTitle}</div>
                    <span className="text-[10px] text-slate-400 capitalize">{stu.programType}</span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-white">
                    NGN {Number(stu.totalTuition || 0).toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-emerald-400 font-semibold">
                    NGN {Number(stu.amountPaid || 0).toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                    NGN {Number(stu.outstandingBalance || 0).toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        stu.outstandingBalance === 0
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {stu.outstandingBalance === 0 ? 'Fully Settled' : 'Has Balance'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedStudentForPay(stu);
                        setPayAmount(stu.outstandingBalance > 0 ? stu.outstandingBalance : 20000);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 ml-auto transition-colors shadow-xs"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Record Payment</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Payment Transactions Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-white font-serif">Recent Payment Transactions</h3>
          <span className="text-xs text-slate-400">{payments.length} receipts recorded</span>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto">
          {payments.map((p) => (
            <div
              key={p.id}
              className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-cyan-400">{p.receiptNumber}</span>
                  <span className="text-white font-bold">{p.studentName}</span>
                </div>
                <span className="text-slate-400 capitalize text-[11px] block">
                  {p.paymentType?.replace('_', ' ')} • via {p.gateway}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-mono font-extrabold text-emerald-400">
                  NGN {Number(p.amount).toLocaleString()}
                </span>
                <button
                  onClick={() => setActiveReceiptDoc(p)}
                  className="bg-slate-800 hover:bg-slate-700 text-cyan-400 px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-slate-700 flex items-center gap-1"
                >
                  <Printer className="w-3 h-3" />
                  <span>Receipt</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Processing Modal */}
      {selectedStudentForPay && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-cyan-400 font-mono">
                  {selectedStudentForPay.studentNumber}
                </span>
                <h3 className="text-lg font-bold text-white font-serif">
                  Record Payment for {selectedStudentForPay.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedStudentForPay(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Current Outstanding Balance:</span>
                <strong className="text-amber-400 font-mono text-sm">
                  NGN {Number(selectedStudentForPay.outstandingBalance).toLocaleString()}
                </strong>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Amount to Pay (NGN) *</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-mono text-sm focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Payment Type</label>
                <select
                  value={payType}
                  onChange={(e) => setPayType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-hidden focus:border-cyan-500"
                >
                  <option value="tuition_installment">Tuition Installment</option>
                  <option value="tuition_balance">Full Tuition Balance Settlement</option>
                  <option value="tuition_deposit">Initial Tuition Deposit</option>
                  <option value="certificate_fee">Certificate / Graduation Fee</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Payment Method / Channel</label>
                <select
                  value={payGateway}
                  onChange={(e) => setPayGateway(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-hidden focus:border-cyan-500"
                >
                  <option value="paystack">Paystack Online Payment</option>
                  <option value="flutterwave">Flutterwave Online Gateway</option>
                  <option value="bank_transfer">Direct Bank Transfer to AITI Account</option>
                  <option value="cash_pos">POS / Cash at Tanke Campus Bursary</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedStudentForPay(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPay}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-wider flex items-center gap-2"
                >
                  {submittingPay ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Generate e-Receipt</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Payment Receipt Modal */}
      {activeReceiptDoc && (
        <DocumentViewerModal
          type="receipt"
          data={activeReceiptDoc}
          onClose={() => setActiveReceiptDoc(null)}
        />
      )}

    </div>
  );
};
