import React, { useRef } from 'react';
import { Printer, Download, CheckCircle2, ShieldCheck, Award, FileText, QrCode } from 'lucide-react';
import { QrCodeViewer } from './QrCodeViewer';
import { useSettings } from '../../context/SettingsContext';
import { AdmissionRecord, Certificate, Invoice, PaymentTransaction, Student, AssessmentResult } from '../../types';

interface DocumentModalProps {
  type: 'admission_letter' | 'student_id' | 'receipt' | 'certificate' | 'result_transcript' | 'short_course_certificate' | 'corporate_quotation' | 'corporate_invoice' | 'short_course_registration';
  data: any;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentModalProps> = ({ type, data, onClose }) => {
  const { settings } = useSettings();
  const printRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const currentHost = window.location.origin;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 print:p-0 print:bg-white print:static">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:border-none print:shadow-none print:bg-white">
        {/* Modal Action Bar (Hidden on print) */}
        <div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-white text-sm sm:text-base capitalize">
              {type.replace('_', ' ')} — Official Document
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white px-2.5 py-1.5 text-xs rounded-lg hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div ref={printRef} className="p-6 sm:p-10 overflow-y-auto bg-white text-slate-900 font-sans print:p-0">
          
          {/* ======================================================== */}
          {/* 1. ADMISSION LETTER */}
          {/* ======================================================== */}
          {type === 'admission_letter' && (
            <div className="max-w-3xl mx-auto border border-slate-300 p-8 sm:p-12 bg-white relative text-slate-800 shadow-sm print:border-none print:p-4">
              {/* Header Letterhead */}
              <div className="border-b-2 border-slate-900 pb-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-xs font-bold uppercase tracking-widest text-cyan-800 block">
                    {settings?.general.parentOrganization || 'AFTATECH.IT CONSULT'}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 font-serif">
                    {settings?.general.fullName || 'AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE'}
                  </h1>
                  <p className="text-xs font-semibold tracking-wider text-slate-600 mt-0.5">
                    {settings?.general.tagline || 'BEYOND TECH'} • {settings?.general.motto || 'Empowering You Through ICT'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {settings?.contact.address || '2 Babanla Street, Graceland Junction, Tanke, Ilorin, Kwara State, Nigeria.'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Tel: {settings?.contact.primaryPhone} | {settings?.contact.secondaryPhone} • Email: {settings?.contact.email}
                  </p>
                </div>
                <div className="shrink-0 text-center">
                  <QrCodeViewer
                    value={`${currentHost}${data.qrVerificationUrl || `/verify?type=admission&code=${data.admissionNumber}`}`}
                    size={90}
                    darkColor="#0284c7"
                  />
                  <span className="text-[9px] text-slate-500 block mt-0.5 font-mono">Scan to Verify</span>
                </div>
              </div>

              {/* Title & Ref */}
              <div className="flex flex-col sm:flex-row justify-between text-xs font-medium text-slate-600 mb-6 gap-2">
                <div>
                  <p><strong className="text-slate-900">Admission Ref:</strong> {data.admissionNumber}</p>
                  <p><strong className="text-slate-900">Application No:</strong> {data.applicationRef}</p>
                </div>
                <div className="sm:text-right">
                  <p><strong className="text-slate-900">Date Issued:</strong> {new Date(data.offeredAt || Date.now()).toLocaleDateString('en-GB')}</p>
                  <p><strong className="text-slate-900">Academic Session:</strong> {data.academicSession || '2026/2027'}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-semibold text-slate-900">To:</p>
                <h2 className="text-lg font-bold text-slate-900">{data.studentName}</h2>
                <p className="text-xs text-slate-600">{data.studentEmail} • {data.studentPhone}</p>
              </div>

              <div className="bg-slate-100 p-3 text-center my-4 border border-slate-200">
                <h3 className="font-bold text-sm sm:text-base tracking-wide text-slate-950 uppercase">
                  {settings?.documents.admissionLetterHeader || 'PROVISIONAL OFFER OF ADMISSION'}
                </h3>
              </div>

              <div className="text-xs sm:text-sm leading-relaxed space-y-3 text-slate-700">
                <p>
                  We are pleased to notify you that following your application and evaluation of your submitted credentials, you have been offered provisional admission into the <strong>{data.programTitle}</strong> for the <strong>{data.academicSession}</strong> Academic Session at the AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE (AITI).
                </p>
                
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-md border border-slate-200 text-xs my-2">
                  <div><strong>Program:</strong> {data.programTitle}</div>
                  <div><strong>Duration:</strong> {data.duration}</div>
                  <div><strong>Commencement Date:</strong> {data.commencementDate || 'TBD'}</div>
                  <div><strong>Orientation:</strong> {data.orientationDate || 'TBD'}</div>
                  <div><strong>Tuition Fee:</strong> NGN {Number(data.tuitionFee || 0).toLocaleString()}</div>
                  <div><strong>Campus:</strong> Tanke, Ilorin, Kwara State</div>
                </div>

                <p className="font-semibold text-slate-900">Terms & Conditions of Admission:</p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                  {data.conditions?.map((c: string, idx: number) => (
                    <li key={idx}>{c}</li>
                  )) || (
                    <>
                      <li>Full or approved installment payment of prescribed tuition prior to technical class commencement.</li>
                      <li>Strict compliance with technical laboratory code of conduct, power handling, and hardware safety.</li>
                      <li>Minimum 80% practical class attendance rate is required for graduation assessment eligibility.</li>
                    </>
                  )}
                </ul>

                <p className="text-xs text-slate-600 pt-2">
                  We look forward to welcoming you to AITI as you take this pivotal step toward mastering practical technology and digital excellence.
                </p>
              </div>

              {/* Signatures & Seal */}
              <div className="mt-10 pt-6 border-t border-slate-200 flex items-end justify-between">
                <div>
                  <div className="h-12 flex items-center font-serif italic text-cyan-900 text-lg">
                    A. F. Taiwo (Engr.)
                  </div>
                  <div className="border-t border-slate-400 pt-1 text-xs">
                    <p className="font-bold text-slate-900">{settings?.documents.authorizedSignatoryName || 'Director of Academic Affairs'}</p>
                    <p className="text-slate-500">{settings?.documents.authorizedSignatoryTitle || 'Registrar / Director of Academics'}</p>
                    <p className="text-[10px] text-slate-400">AITI • AFTATECH.IT CONSULT</p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-cyan-800 flex flex-col items-center justify-center text-[9px] text-cyan-900 font-bold uppercase p-1 leading-tight rotate-12 bg-cyan-50/50">
                    <ShieldCheck className="w-5 h-5 mb-0.5 text-cyan-700" />
                    <span>AITI OFFICIAL</span>
                    <span>VERIFIED SEAL</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. STUDENT ID CARD */}
          {/* ======================================================== */}
          {type === 'student_id' && (
            <div className="max-w-md mx-auto space-y-6">
              {/* Front Side */}
              <div className="w-full bg-linear-to-br from-slate-950 via-slate-900 to-cyan-950 text-white rounded-2xl p-6 border-2 border-cyan-500/40 shadow-2xl relative overflow-hidden">
                {/* Accent Ribbon */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

                {/* Header */}
                <div className="flex items-center justify-between border-b border-cyan-800/60 pb-3 mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 block">AFTATECH.IT CONSULT</span>
                    <h2 className="text-base font-black tracking-wide text-white">AITI DIGITAL CAMPUS</h2>
                    <span className="text-[9px] text-slate-400 font-mono">STUDENT IDENTITY CARD</span>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-cyan-600/30 border border-cyan-400/50 flex items-center justify-center font-bold text-cyan-300 text-xs">
                    ID
                  </div>
                </div>

                {/* Photo & Info */}
                <div className="flex gap-4 items-center mb-4">
                  <div className="w-24 h-28 rounded-xl bg-slate-800 border-2 border-cyan-400 overflow-hidden shrink-0 shadow-md">
                    <img
                      src={data.passportPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                      alt={data.fullName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-1 text-xs">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Student Name:</span>
                      <strong className="text-sm text-white font-bold block">{data.fullName}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Student ID No:</span>
                      <strong className="text-xs text-cyan-300 font-mono font-bold">{data.studentNumber}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Program:</span>
                      <p className="text-[11px] text-slate-200 line-clamp-1">{data.programTitle}</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Session / Status:</span>
                      <p className="text-[10px] text-slate-300 font-semibold">{data.academicSession || '2026/2027'} • <span className="text-emerald-400 uppercase">Active</span></p>
                    </div>
                  </div>
                </div>

                {/* Bottom Verification & Barcode */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[8px] text-slate-400 uppercase block">Authorized Signature</span>
                    <span className="font-serif italic text-xs text-cyan-300">Registrar AITI</span>
                  </div>
                  <div className="text-right">
                    <QrCodeViewer
                      value={`${currentHost}/verify?type=student&code=${data.studentNumber}`}
                      size={45}
                      darkColor="#0f172a"
                    />
                  </div>
                </div>
              </div>

              {/* Back Side */}
              <div className="w-full bg-slate-900 text-slate-300 rounded-2xl p-5 border border-slate-800 shadow-lg text-[10px] space-y-2">
                <div className="text-center border-b border-slate-800 pb-2">
                  <p className="font-bold text-white uppercase text-[11px]">Property of AITI</p>
                  <p className="text-slate-400">{settings?.contact.address || '2 Babanla Street, Tanke, Ilorin, Kwara State, Nigeria.'}</p>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-slate-400 leading-tight">
                  <li>This card remains the official property of AITI and must be presented on demand within all institute premises and laboratories.</li>
                  <li>Loss of this card should be reported immediately to the AITI Admissions Desk or Registry.</li>
                  <li>Found cards should be returned to: 2 Babanla Street, Graceland Junction, Tanke, Ilorin. Tel: {settings?.contact.primaryPhone}.</li>
                </ul>
                <div className="pt-2 border-t border-slate-800 text-center font-mono text-[9px] text-slate-500">
                  REF: {data.admissionNumber} • EMERGENCY: {settings?.contact.primaryPhone}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. PAYMENT RECEIPT */}
          {/* ======================================================== */}
          {type === 'receipt' && (
            <div className="max-w-2xl mx-auto border border-slate-300 p-8 bg-white text-slate-800 shadow-sm">
              <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-800 block">
                    {settings?.general.parentOrganization || 'AFTATECH.IT CONSULT'}
                  </span>
                  <h2 className="text-xl font-black text-slate-950 font-serif">
                    {settings?.general.fullName || 'AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {settings?.contact.address || '2 Babanla Street, Graceland Junction, Tanke, Ilorin, Kwara State.'}
                  </p>
                  <p className="text-xs text-slate-500">Tel: {settings?.contact.primaryPhone} • Email: {settings?.contact.email}</p>
                </div>
                <div className="text-right">
                  <div className="inline-block bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-3 py-1 text-xs rounded-md uppercase">
                    PAID & VERIFIED
                  </div>
                  <p className="text-xs font-mono font-semibold text-slate-700 mt-1">{data.receiptNumber}</p>
                </div>
              </div>

              <div className="text-center bg-slate-100 py-2 border border-slate-200 mb-4">
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900">OFFICIAL PAYMENT RECEIPT</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs mb-6">
                <div>
                  <p><strong className="text-slate-900">Received From:</strong> {data.studentName}</p>
                  <p><strong className="text-slate-900">Email:</strong> {data.studentEmail}</p>
                  <p><strong className="text-slate-900">Payment Type:</strong> <span className="capitalize">{data.paymentType?.replace('_', ' ')}</span></p>
                </div>
                <div className="text-right">
                  <p><strong className="text-slate-900">Date Paid:</strong> {new Date(data.paidAt || Date.now()).toLocaleString('en-GB')}</p>
                  <p><strong className="text-slate-900">Gateway Ref:</strong> <span className="font-mono">{data.gatewayReference}</span></p>
                  <p><strong className="text-slate-900">Channel:</strong> {data.channel || 'Online Gateway'}</p>
                </div>
              </div>

              <table className="w-full text-xs border border-slate-200 mb-6">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-700">
                  <tr>
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-right">Amount (NGN)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="p-2 text-slate-800 font-medium">
                      {data.notes || 'Institutional Fee Payment'}
                    </td>
                    <td className="p-2 text-right font-bold text-slate-900">
                      NGN {Number(data.amount || 0).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 font-bold">
                    <td className="p-2 text-right uppercase text-slate-700">Total Amount Paid:</td>
                    <td className="p-2 text-right text-emerald-700 text-sm">
                      NGN {Number(data.amount || 0).toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs">
                <div>
                  <p className="text-[10px] text-slate-500">Verified By: {data.verifiedBy || 'AITI Bursary'}</p>
                  <p className="text-[10px] text-slate-400">Computer generated official receipt. Valid without physical stamp.</p>
                </div>
                <div>
                  <QrCodeViewer
                    value={`${currentHost}${data.qrVerificationUrl || `/verify?type=receipt&code=${data.receiptNumber}`}`}
                    size={70}
                    darkColor="#047857"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 4. CERTIFICATE OF PROFICIENCY / DIPLOMA */}
          {/* ======================================================== */}
          {type === 'certificate' && (
            <div className="max-w-3xl mx-auto border-8 border-double border-amber-600/70 p-10 bg-linear-to-b from-amber-50/40 via-white to-amber-50/30 text-slate-900 text-center relative shadow-xl">
              {/* Ornate corners */}
              <div className="border border-amber-400 p-8 relative">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-800 block mb-1">
                  {settings?.general.parentOrganization || 'AFTATECH.IT CONSULT'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 font-serif tracking-tight">
                  {settings?.general.fullName || 'AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE'}
                </h1>
                <p className="text-xs font-semibold text-slate-600 tracking-widest uppercase mt-1">
                  ILORIN, KWARA STATE, NIGERIA
                </p>

                <div className="my-6">
                  <Award className="w-12 h-12 mx-auto text-amber-600 mb-2" />
                  <p className="text-xs uppercase tracking-widest font-semibold text-slate-500">THIS IS TO CERTIFY THAT</p>
                  <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-950 mt-1 mb-2 border-b-2 border-amber-600/40 inline-block px-8 pb-1">
                    {data.studentName}
                  </h2>
                  <p className="text-xs text-slate-600">Student Ref: {data.studentNumber}</p>
                </div>

                <div className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed mb-6">
                  <p>
                    having successfully completed the prescribed curriculum, laboratory practicals, and capstone project assessments, is hereby awarded this
                  </p>
                  <h3 className="text-lg sm:text-xl font-extrabold text-cyan-900 uppercase tracking-wide my-2">
                    {data.programTitle}
                  </h3>
                  <p className="text-xs font-semibold text-slate-600">
                    Specialization in: <strong className="text-slate-900">{data.specializationArea || data.programTitle}</strong>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Grade Achieved: <strong className="text-emerald-700">{data.gradeAchieved || 'Distinction'}</strong> • Completed on: {data.completionDate || '2026-07-30'}
                  </p>
                </div>

                {/* Footer Signatories & QR Seal */}
                <div className="mt-8 pt-4 border-t border-amber-200 flex items-end justify-between text-left text-xs">
                  <div>
                    <p className="font-serif italic text-sm text-slate-900">{data.signatoryName || 'Engr. A. F. Taiwo'}</p>
                    <p className="border-t border-slate-400 font-bold text-[11px] text-slate-800">{data.signatoryTitle || 'Director of Institute'}</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full border-2 border-amber-600 flex flex-col items-center justify-center text-[8px] text-amber-900 font-bold uppercase p-1 leading-tight bg-amber-100/60 shadow-xs">
                      <Award className="w-4 h-4 text-amber-700" />
                      <span>AITI GOLD</span>
                      <span>SEAL</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <QrCodeViewer
                      value={`${currentHost}${data.qrVerificationUrl || `/verify?type=certificate&code=${data.certificateNumber}`}`}
                      size={65}
                      darkColor="#78350f"
                    />
                    <span className="text-[9px] font-mono block text-slate-500 mt-0.5">{data.certificateNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 5. RESULT TRANSCRIPT */}
          {/* ======================================================== */}
          {type === 'result_transcript' && (
            <div className="max-w-2xl mx-auto border border-slate-300 p-8 bg-white text-slate-800 shadow-sm">
              <div className="border-b-2 border-slate-900 pb-4 mb-4 flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-800 block">
                    {settings?.general.fullName || 'AITI ACADEMIC REGISTRY'}
                  </span>
                  <h2 className="text-xl font-bold text-slate-950 font-serif">OFFICIAL RESULT TRANSCRIPT</h2>
                  <p className="text-xs text-slate-500">2 Babanla Street, Tanke, Ilorin, Kwara State</p>
                </div>
                <div className="text-right text-xs">
                  <p><strong>Student:</strong> {data.studentName}</p>
                  <p><strong>ID No:</strong> {data.studentNumber}</p>
                  <p><strong>Session:</strong> {data.academicSession || '2026/2027'}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg mb-6">
                <h4 className="font-bold text-sm text-slate-900 mb-2">{data.courseCode}: {data.courseTitle}</h4>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-white p-2 border border-slate-200 rounded-sm">
                    <span className="text-[10px] text-slate-500 block">Assignment (20)</span>
                    <strong className="text-sm text-slate-900">{data.assignmentScore}</strong>
                  </div>
                  <div className="bg-white p-2 border border-slate-200 rounded-sm">
                    <span className="text-[10px] text-slate-500 block">Test (20)</span>
                    <strong className="text-sm text-slate-900">{data.testScore}</strong>
                  </div>
                  <div className="bg-white p-2 border border-slate-200 rounded-sm">
                    <span className="text-[10px] text-slate-500 block">Practical (30)</span>
                    <strong className="text-sm text-slate-900">{data.practicalScore}</strong>
                  </div>
                  <div className="bg-white p-2 border border-slate-200 rounded-sm">
                    <span className="text-[10px] text-slate-500 block">Exam (30)</span>
                    <strong className="text-sm text-slate-900">{data.examScore}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500">Total Score:</span> <strong className="text-base text-slate-950">{data.totalScore} / 100</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Grade:</span> <strong className="text-base text-emerald-700 font-bold px-2 py-0.5 bg-emerald-100 rounded-sm">Grade {data.grade}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Status:</span> <strong className="uppercase text-emerald-700 font-bold">{data.status}</strong>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3 italic bg-white p-2 border border-slate-200 rounded-sm">
                  Instructor Remarks: {data.remarks || 'Satisfactory demonstration of technical coursework.'}
                </p>
              </div>

              <div className="text-[10px] text-slate-500 text-center border-t border-slate-200 pt-3">
                AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE • Registrar Directorate • Ilorin Campus
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 6. AITI CERTIFICATE OF COMPLETION (Short-Term & Corporate) */}
          {/* ======================================================== */}
          {type === 'short_course_certificate' && (
            <div className="max-w-3xl mx-auto border-8 border-double border-cyan-800/80 p-8 sm:p-12 bg-linear-to-b from-sky-50/40 via-white to-sky-50/20 text-slate-900 text-center relative shadow-2xl print:border-4 print:p-6">
              <div className="border-2 border-cyan-600/40 p-6 sm:p-8 relative bg-white/90">
                {/* Logo & Institute Header */}
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-cyan-900 text-cyan-300 flex items-center justify-center font-serif font-black text-xl border border-cyan-700 shadow-md">
                    AITI
                  </div>
                </div>

                <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-900 block mb-0.5">
                  {settings?.general.parentOrganization || 'AFTATECH.IT CONSULT'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 font-serif tracking-tight">
                  {settings?.general.fullName || 'AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE'}
                </h1>
                <p className="text-[11px] font-semibold text-slate-600 tracking-wider uppercase mt-0.5">
                  DIRECTORATE OF EXECUTIVE CAPACITY BUILDING & PROFESSIONAL TRAINING
                </p>

                <div className="my-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs font-bold uppercase tracking-widest mb-3">
                    <Award className="w-4 h-4 text-cyan-700" />
                    <span>AITI CERTIFICATE OF COMPLETION</span>
                  </div>
                  <p className="text-xs uppercase tracking-widest font-semibold text-slate-500">THIS IS PROUDLY CONFERRED UPON</p>
                  <h2 className="text-2xl sm:text-4xl font-black font-serif text-slate-950 mt-1 mb-2 border-b-2 border-cyan-600/40 inline-block px-8 pb-1">
                    {data.participantName || data.studentName || data.fullName}
                  </h2>
                  <p className="text-xs font-mono font-medium text-slate-600">
                    Registration Ref: <strong className="text-cyan-900">{data.registrationId || data.enrollmentNumber || data.studentNumber}</strong>
                  </p>
                </div>

                <div className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed mb-6">
                  <p>
                    for successfully fulfilling all requirements, active laboratory engagements, and practical capstone milestone deliverables in
                  </p>
                  <h3 className="text-lg sm:text-2xl font-extrabold text-cyan-950 uppercase tracking-wide my-2 font-serif">
                    {data.courseTitle || data.programTitle || 'Applied Tech Short Course'}
                  </h3>
                  <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-medium text-slate-600 mt-2 bg-slate-50 py-2 px-4 rounded-lg border border-slate-200">
                    <div><strong>Duration:</strong> {data.duration || '2-4 Weeks Intensive Training'}</div>
                    <div>•</div>
                    <div><strong>Mode:</strong> {data.trainingMode || 'Physical / Practical Hands-on'}</div>
                    <div>•</div>
                    <div><strong>Date of Issue:</strong> {data.completionDate || data.certificateDate || new Date().toISOString().split('T')[0]}</div>
                  </div>
                </div>

                {/* Footer Signatories & QR Seal */}
                <div className="mt-8 pt-4 border-t border-cyan-100 flex items-end justify-between text-left text-xs">
                  <div>
                    <p className="font-serif italic text-base text-slate-900 font-bold">{data.directorSignature || 'Engr. A. F. Taiwo'}</p>
                    <p className="border-t border-slate-400 font-bold text-[11px] text-slate-800 pt-0.5">Executive Director & Provost, AITI</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full border-2 border-cyan-700 flex flex-col items-center justify-center text-[8px] text-cyan-950 font-bold uppercase p-1 leading-tight bg-cyan-50 shadow-sm">
                      <ShieldCheck className="w-5 h-5 text-cyan-700 mb-0.5" />
                      <span>OFFICIAL</span>
                      <span>AITI SEAL</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <QrCodeViewer
                      value={`${currentHost}/verify?type=certificate&code=${data.certificateNumber || data.registrationId}`}
                      size={70}
                      darkColor="#0e7490"
                    />
                    <span className="text-[10px] font-mono font-bold block text-cyan-950 mt-1">
                      {data.certificateNumber || `AITI/CERT/STC/2026/00025`}
                    </span>
                    <span className="text-[8px] text-slate-500">Scan to Verify Authentic Record</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 7. CORPORATE TRAINING PROPOSAL & QUOTATION */}
          {/* ======================================================== */}
          {type === 'corporate_quotation' && (
            <div className="max-w-3xl mx-auto border border-slate-300 p-8 sm:p-12 bg-white text-slate-900 shadow-sm print:border-none print:p-2">
              {/* Header Letterhead */}
              <div className="border-b-2 border-slate-900 pb-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-cyan-900 text-cyan-300 flex items-center justify-center font-serif font-black text-sm">
                      AITI
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-cyan-800">
                      {settings?.general.parentOrganization || 'AFTATECH.IT CONSULT'}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 font-serif">
                    {settings?.general.fullName || 'AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE'}
                  </h1>
                  <p className="text-xs font-semibold text-slate-600">
                    DIRECTORATE OF CORPORATE CAPACITY BUILDING & WORKFORCE DEVELOPMENT
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {settings?.contact.address} • Tel: {settings?.contact.primaryPhone} • Email: {settings?.contact.email}
                  </p>
                </div>
                <div className="shrink-0 text-center sm:text-right">
                  <div className="inline-block px-3 py-1 bg-cyan-900 text-white font-mono font-bold text-xs rounded-md">
                    OFFICIAL QUOTATION
                  </div>
                  <p className="text-xs font-mono font-bold text-slate-900 mt-1">{data.quotationNumber}</p>
                  <p className="text-[11px] text-slate-500">Date: {new Date(data.issuedAt || Date.now()).toLocaleDateString('en-GB')}</p>
                </div>
              </div>

              {/* Client Details */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs mb-6">
                <div>
                  <span className="text-slate-500 uppercase font-semibold text-[10px] block">Prepared For:</span>
                  <p className="text-sm font-bold text-slate-950">{data.organizationName}</p>
                  <p className="text-slate-700">Attn: <strong>{data.contactPerson}</strong></p>
                  <p className="text-slate-600">{data.email} • {data.phone}</p>
                </div>
                <div>
                  <span className="text-slate-500 uppercase font-semibold text-[10px] block">Training Specifications:</span>
                  <p className="text-slate-800"><strong>Topic:</strong> {data.trainingTitle}</p>
                  <p className="text-slate-800"><strong>Participants:</strong> {data.numberOfParticipants} Staff</p>
                  <p className="text-slate-800"><strong>Duration / Format:</strong> {data.trainingDuration} ({data.trainingFormat || 'Onsite / Hybrid'})</p>
                  <p className="text-slate-600"><strong>Validity:</strong> Valid until {data.validUntil || '2026-10-31'}</p>
                </div>
              </div>

              {/* Cost Breakdown Table */}
              <div className="mb-6">
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-900 text-white">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Deliverable / Service Description</th>
                      <th className="p-3 text-center">Qty / Staff</th>
                      <th className="p-3 text-right">Unit Rate (GHS)</th>
                      <th className="p-3 text-right">Total (GHS)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {data.items?.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 text-slate-500">{idx + 1}</td>
                        <td className="p-3">
                          <p className="font-semibold text-slate-900">{item.description}</p>
                          <p className="text-[11px] text-slate-500">Curriculum customisation, lab setups, practical exercises & workbooks.</p>
                        </td>
                        <td className="p-3 text-center font-medium text-slate-700">{item.quantity}</td>
                        <td className="p-3 text-right font-medium text-slate-700">{Number(item.unitPrice || 0).toLocaleString()}</td>
                        <td className="p-3 text-right font-bold text-slate-900">{Number(item.totalPrice || 0).toLocaleString()}</td>
                      </tr>
                    )) || (
                      <tr>
                        <td className="p-3 text-slate-500">1</td>
                        <td className="p-3 font-semibold text-slate-900">{data.trainingTitle}</td>
                        <td className="p-3 text-center">{data.numberOfParticipants}</td>
                        <td className="p-3 text-right">1,200</td>
                        <td className="p-3 text-right font-bold">{(data.numberOfParticipants || 10) * 1200}</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-100 font-semibold text-xs divide-y divide-slate-200">
                    <tr>
                      <td colSpan={4} className="p-2.5 text-right text-slate-600">Subtotal:</td>
                      <td className="p-2.5 text-right text-slate-900">GHS {Number(data.subtotal || data.totalAmount || 0).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="p-2.5 text-right text-slate-600">Statutory Levies & Taxes (15%):</td>
                      <td className="p-2.5 text-right text-slate-900">GHS {Number(data.taxAmount || 0).toLocaleString()}</td>
                    </tr>
                    <tr className="bg-slate-950 text-white font-bold text-sm">
                      <td colSpan={4} className="p-3 text-right">Grand Total Proposed Fee:</td>
                      <td className="p-3 text-right text-cyan-400">GHS {Number(data.totalAmount || data.netAmount || 0).toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Terms and Banking */}
              <div className="grid grid-cols-2 gap-4 text-xs text-slate-700 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Commercial Terms & Payment:</h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                    <li>{data.paymentTerms || '60% advance payment on commitment, 40% balance upon training completion.'}</li>
                    <li>Includes official individual AITI Certificates of Completion for all qualifying participants.</li>
                    <li>Full technical curriculum materials and cloud sandbox licenses included.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Official Remittance Details:</h4>
                  <p className="text-[11px] text-slate-700">Bank: <strong>Ghana Commercial Bank (GCB) / Ecobank</strong></p>
                  <p className="text-[11px] text-slate-700">Account Name: <strong>AFTATECH INFORMATION TECH INST</strong></p>
                  <p className="text-[11px] text-slate-700">Account No: <strong>14410029384729</strong></p>
                  <p className="text-[11px] text-slate-700">Payment Reference: <strong>{data.quotationNumber}</strong></p>
                </div>
              </div>

              {/* Signatures */}
              <div className="flex items-end justify-between border-t border-slate-300 pt-4 text-xs">
                <div>
                  <p className="font-serif italic text-base font-bold text-slate-900">{data.authorizedSignatoryName || 'Engr. A. F. Taiwo'}</p>
                  <p className="border-t border-slate-400 font-bold text-[11px] text-slate-800 pt-0.5">{data.authorizedSignatoryTitle || 'Executive Director & Provost, AITI'}</p>
                </div>
                <div className="text-right">
                  <QrCodeViewer
                    value={`${currentHost}/verify?type=corporate_quotation&code=${data.quotationNumber}`}
                    size={65}
                    darkColor="#0f172a"
                  />
                  <span className="text-[9px] font-mono text-slate-500 block mt-0.5">Scan to verify quotation</span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 8. CORPORATE TRAINING TAX INVOICE */}
          {/* ======================================================== */}
          {type === 'corporate_invoice' && (
            <div className="max-w-3xl mx-auto border border-slate-300 p-8 sm:p-12 bg-white text-slate-900 shadow-sm print:border-none print:p-2">
              <div className="border-b-2 border-slate-900 pb-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-cyan-900 text-cyan-300 flex items-center justify-center font-serif font-black text-sm">
                      AITI
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-cyan-800">
                      {settings?.general.parentOrganization || 'AFTATECH.IT CONSULT'}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 font-serif">
                    {settings?.general.fullName || 'AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE'}
                  </h1>
                  <p className="text-xs font-semibold text-slate-600">BURSARY & CORPORATE BILLING DIVISION</p>
                </div>
                <div className="shrink-0 text-center sm:text-right">
                  <div className="inline-block px-3 py-1 bg-emerald-900 text-white font-mono font-bold text-xs rounded-md">
                    OFFICIAL TAX INVOICE
                  </div>
                  <p className="text-xs font-mono font-bold text-slate-900 mt-1">{data.invoiceNumber}</p>
                  <p className="text-[11px] text-slate-500">Issued: {new Date(data.issuedAt || Date.now()).toLocaleDateString('en-GB')}</p>
                  <p className="text-[11px] text-amber-700 font-bold">Due Date: {data.dueDate || '2026-10-15'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs mb-6">
                <div>
                  <span className="text-slate-500 uppercase font-semibold text-[10px] block">Billed To:</span>
                  <p className="text-sm font-bold text-slate-950">{data.organizationName}</p>
                  <p className="text-slate-700">Attn: <strong>{data.contactPerson}</strong></p>
                  <p className="text-slate-600">{data.email} • {data.phone}</p>
                  {data.quotationNumber && <p className="text-[11px] text-slate-500 mt-1">Ref Quotation: {data.quotationNumber}</p>}
                </div>
                <div>
                  <span className="text-slate-500 uppercase font-semibold text-[10px] block">Payment Summary:</span>
                  <p className="text-slate-800"><strong>Training Scope:</strong> {data.trainingTitle}</p>
                  <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-200 text-slate-800 font-bold text-xs">
                    Status: <span className={data.paymentStatus === 'PAID' ? 'text-emerald-700' : 'text-amber-700'}>{data.paymentStatus}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-900 text-white">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Description</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Rate</th>
                      <th className="p-3 text-right">Amount (GHS)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {data.items?.map((item: any, idx: number) => (
                      <tr key={idx}>
                        <td className="p-3 text-slate-500">{idx + 1}</td>
                        <td className="p-3 font-semibold text-slate-900">{item.description}</td>
                        <td className="p-3 text-center">{item.quantity}</td>
                        <td className="p-3 text-right">{Number(item.unitPrice || 0).toLocaleString()}</td>
                        <td className="p-3 text-right font-bold">{Number(item.totalPrice || 0).toLocaleString()}</td>
                      </tr>
                    )) || (
                      <tr>
                        <td className="p-3 text-slate-500">1</td>
                        <td className="p-3 font-semibold text-slate-900">{data.trainingTitle}</td>
                        <td className="p-3 text-center">1</td>
                        <td className="p-3 text-right">{Number(data.netAmount || 0).toLocaleString()}</td>
                        <td className="p-3 text-right font-bold">{Number(data.netAmount || 0).toLocaleString()}</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-100 font-semibold text-xs divide-y divide-slate-200">
                    <tr>
                      <td colSpan={4} className="p-2 text-right text-slate-600">Net Invoice Amount:</td>
                      <td className="p-2 text-right text-slate-900">GHS {Number(data.netAmount || 0).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="p-2 text-right text-emerald-700">Amount Remitted / Paid:</td>
                      <td className="p-2 text-right text-emerald-700">GHS {Number(data.amountPaid || 0).toLocaleString()}</td>
                    </tr>
                    <tr className="bg-slate-900 text-white font-bold text-sm">
                      <td colSpan={4} className="p-3 text-right">Outstanding Balance Due:</td>
                      <td className="p-3 text-right text-amber-400">GHS {Number(data.balance || (data.netAmount - (data.amountPaid || 0))).toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-slate-300 pt-4 text-xs">
                <div>
                  <p className="font-bold text-slate-900">Payment Remittance Reference:</p>
                  <p className="font-mono text-cyan-900 text-sm font-bold">{data.invoiceNumber}</p>
                  <p className="text-[10px] text-slate-500 mt-1">Please include invoice number on bank transfer description.</p>
                </div>
                <div className="text-right">
                  <QrCodeViewer
                    value={`${currentHost}/verify?type=corporate_invoice&code=${data.invoiceNumber}`}
                    size={65}
                    darkColor="#0f172a"
                  />
                  <span className="text-[9px] font-mono text-slate-500 block mt-0.5">Scan to verify invoice</span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 9. SHORT COURSE REGISTRATION PASS / RECEIPT SLIP */}
          {/* ======================================================== */}
          {type === 'short_course_registration' && (
            <div className="max-w-2xl mx-auto border-2 border-dashed border-cyan-700 p-8 bg-white text-slate-900 shadow-sm print:border-solid print:p-2">
              <div className="border-b-2 border-slate-900 pb-4 mb-4 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-900 text-cyan-300 flex items-center justify-center font-serif font-black text-sm">
                      AITI
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-800">
                      {settings?.general.fullName || 'AITI APPLIED TECH SHORT COURSES'}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-950 font-serif mt-1">COHORT REGISTRATION & ACCESS PASS</h2>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-500 block">Registration ID</span>
                  <strong className="text-sm text-cyan-900 bg-cyan-50 px-2 py-0.5 rounded-sm border border-cyan-200">
                    {data.registrationId || data.enrollmentNumber || 'AITI/STC/2026/00025'}
                  </strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs mb-4">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-semibold block">Participant Details:</span>
                  <p className="text-sm font-bold text-slate-950">{data.fullName}</p>
                  <p className="text-slate-700">{data.phone} • {data.email}</p>
                  <p className="text-slate-600">WhatsApp: {data.whatsapp || data.phone}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-semibold block">Enrolled Course:</span>
                  <p className="font-bold text-slate-900">{data.courseTitle}</p>
                  <p className="text-slate-700"><strong>Schedule:</strong> {data.preferredSchedule}</p>
                  <p className="text-slate-700"><strong>Training Mode:</strong> {data.trainingMode}</p>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex justify-between items-center text-xs mb-4">
                <div>
                  <span className="text-emerald-800 font-semibold block">Tuition / Registration Fee:</span>
                  <strong className="text-base text-emerald-950">GHS {Number(data.fee || data.feeGHS || 1200).toLocaleString()}</strong>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-md text-[11px] uppercase tracking-wider">
                    {data.paymentStatus || 'CONFIRMED'}
                  </span>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">Ref: {data.paymentReference || 'MM-CONFIRMED'}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                <div>
                  <p className="font-semibold text-slate-800">Student Portal Access Notice:</p>
                  <p className="text-[11px] text-slate-600">Use your Registration ID <strong className="text-cyan-900">{data.registrationId}</strong> to sign in to the AITI Short-Term Student Portal.</p>
                </div>
                <div>
                  <QrCodeViewer
                    value={`${currentHost}/verify?type=short_course_registration&code=${data.registrationId}`}
                    size={65}
                    darkColor="#0e7490"
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
