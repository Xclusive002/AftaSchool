import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, Clock, Search, Filter, 
  FileText, ArrowRight, UserCheck, ShieldCheck, 
  Printer, RefreshCw, Mail, Phone, Eye 
} from 'lucide-react';
import { api } from '../../services/api';
import { Application, AdmissionOffer } from '../../types';
import { DocumentViewerModal } from '../common/DocumentViewer';

export const AdmissionsPortal: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals & Action States
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAdmissionDoc, setSelectedAdmissionDoc] = useState<AdmissionOffer | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [apps, adms] = await Promise.all([
        api.getApplications(),
        api.getAdmissions()
      ]);
      setApplications(apps);
      setAdmissions(adms);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOfferAdmission = async (app: Application) => {
    if (!confirm(`Generate and issue official Admission Offer for ${app.firstName} ${app.lastName}?`)) return;
    try {
      setProcessingId(app.id);
      const res = await api.offerAdmission({ applicationId: app.id });
      alert(`Admission Offer ${res.admissionNumber} successfully generated!`);
      await loadData();
    } catch (err: any) {
      alert('Error offering admission: ' + err.message);
    } finally {
      setProcessingId(null);
    }
  };


  const handleEnrollStudent = async (admissionNumber: string) => {
    if (!confirm(`Finalize enrollment and issue official Student Matriculation ID for ${admissionNumber}?`)) return;
    try {
      setProcessingId(admissionNumber);
      const res = await api.enrollStudent(admissionNumber);
      alert(`Student officially enrolled with Student ID: ${res.student.studentNumber}`);
      await loadData();
    } catch (err: any) {
      alert('Error enrolling student: ' + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      (app.firstName || '').toLowerCase().includes(q) ||
      (app.lastName || '').toLowerCase().includes(q) ||
      (app.applicationId || '').toLowerCase().includes(q) ||
      (app.email || '').toLowerCase().includes(q) ||
      (app.programTitle || '').toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              Registrar & Admissions
            </span>
            <span className="text-xs text-slate-400">Application Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif mt-1">
            Student Admissions Management
          </h1>
          <p className="text-xs text-slate-400">
            Review applicant profiles, issue official provisional admission letters, and matriculate students into cohorts.
          </p>
        </div>

        <button
          onClick={loadData}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
          title="Refresh Applications"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Applications' },
            { id: 'submitted', label: 'Submitted' },
            { id: 'under_review', label: 'Under Review' },
            { id: 'admitted', label: 'Admitted' },
            { id: 'enrolled', label: 'Enrolled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                statusFilter === tab.id
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ref, program..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Applications Table / Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Applicant / Reference</th>
                <th className="py-3.5 px-4">Program & Track</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">App Fee Status</th>
                <th className="py-3.5 px-4">Admission Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredApps.map((app) => {
                const admission = admissions.find((a) => a.applicationId === app.id);
                const isProcessing = processingId === app.id || (admission && processingId === admission.admissionNumber);

                return (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">
                        {app.firstName} {app.middleName ? app.middleName + ' ' : ''}{app.lastName}
                      </div>
                      <span className="font-mono text-[10px] text-cyan-400 block">{app.applicationId}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">{app.programTitle}</div>
                      <span className="text-[10px] text-slate-400 capitalize">{app.programType} • {app.preferredSchedule}</span>
                    </td>

                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="flex items-center gap-1 text-slate-300">
                        <Mail className="w-3 h-3 text-cyan-400" />
                        <span>{app.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                        <Phone className="w-3 h-3 text-emerald-400" />
                        <span>{app.phone}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          app.paymentStatus === 'paid'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {app.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          app.status === 'enrolled'
                            ? 'bg-purple-950 text-purple-300 border border-purple-800'
                            : app.status === 'admitted'
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Detail Modal Trigger */}
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setShowDetailModal(true);
                          }}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                          title="View Full Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* If not admitted yet -> Offer Admission button */}
                        {app.status === 'submitted' || app.status === 'under_review' ? (
                          <button
                            onClick={() => handleOfferAdmission(app)}
                            disabled={isProcessing}
                            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Offer Admission</span>
                          </button>
                        ) : null}

                        {/* If admitted -> View letter & Enroll Student */}
                        {admission && (
                          <>
                            <button
                              onClick={() => setSelectedAdmissionDoc(admission)}
                              className="bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 border border-slate-700"
                              title="Print Official Admission Letter"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Letter</span>
                            </button>

                            {app.status === 'admitted' && (
                              <button
                                onClick={() => handleEnrollStudent(admission.admissionNumber)}
                                disabled={isProcessing}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Enroll</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Applicant Full Detail Modal */}
      {showDetailModal && selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-cyan-400 font-mono">{selectedApp.applicationId}</span>
                <h3 className="text-xl font-bold text-white font-serif">
                  {selectedApp.firstName} {selectedApp.middleName || ''} {selectedApp.lastName}
                </h3>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 uppercase text-[10px] block">Program Applied</span>
                <strong className="text-white text-sm block">{selectedApp.programTitle}</strong>
                <span className="text-slate-400 capitalize">{selectedApp.programType} ({selectedApp.preferredSchedule})</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 uppercase text-[10px] block">Contact</span>
                <span className="text-slate-300 block">{selectedApp.email}</span>
                <span className="text-slate-300 block">{selectedApp.phone} (WA: {selectedApp.whatsapp})</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 uppercase text-[10px] block">Demographics</span>
                <span className="text-slate-300 block">{selectedApp.gender}, DOB: {selectedApp.dateOfBirth}</span>
                <span className="text-slate-400 block">{selectedApp.lga}, {selectedApp.stateOfOrigin}</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 uppercase text-[10px] block">Education</span>
                <span className="text-slate-300 block">{selectedApp.highestQualification}</span>
                <span className="text-slate-400 block">{selectedApp.previousInstitution} ({selectedApp.yearOfGraduation})</span>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <span className="text-slate-500 uppercase text-[10px] block">Residential Address</span>
                <span className="text-slate-300 block">{selectedApp.residentialAddress}</span>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <span className="text-slate-500 uppercase text-[10px] block">Next of Kin</span>
                <span className="text-slate-300 block">{selectedApp.nextOfKinName} ({selectedApp.nextOfKinRelationship}) - {selectedApp.nextOfKinPhone}</span>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Admission Offer Letter Viewer Modal */}
      {selectedAdmissionDoc && (
        <DocumentViewerModal
          type="admission"
          data={selectedAdmissionDoc}
          onClose={() => setSelectedAdmissionDoc(null)}
        />
      )}

    </div>
  );
};
