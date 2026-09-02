import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, DollarSign, GraduationCap, 
  Settings, Bot, Sparkles, Database, Download, 
  RefreshCw, CheckCircle2, ShieldCheck, FileText, 
  Phone, Mail, MapPin, MessageCircle, Layers, BookOpen,
  UserCog, Plus, Search, PencilLine
} from 'lucide-react';
import { api } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import { TrainingManagement } from './TrainingManagement';
import { OnlineCourseAdminManager } from '../admin/OnlineCourseAdminManager';
import { Laptop, Globe } from 'lucide-react';

export const AdminCommandCenter: React.FC = () => {
  const { settings, refreshSettings, updateSettings } = useSettings();
  const { currentUser } = useAuth();

  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'metrics' | 'users' | 'training' | 'online_manager' | 'ai_assistant' | 'settings' | 'export_sql' | 'audit_logs'>('metrics');

  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [userForm, setUserForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'student',
    department: '',
    studentNumber: '',
    admissionNumber: '',
    linkedStudentId: '',
  });
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userSaving, setUserSaving] = useState(false);

  // AI Command Chat State
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Settings Form State
  const [formSettings, setFormSettings] = useState<any>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sum, logs] = await Promise.all([
        api.getReportsSummary(),
        api.getAuditLogs()
      ]);
      setSummary(sum);
      setAuditLogs(logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const result = await api.getAdminUsers();
      setUsers(result);
    } catch (err) {
      console.error('Failed to load users', err);
    }
  };

  useEffect(() => {
    loadData();
    if (settings) {
      setFormSettings(JSON.parse(JSON.stringify(settings)));
    }
  }, [settings]);

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    }
  }, [activeTab]);

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim() || aiLoading) return;
    setAiLoading(true);
    try {
      const reply = await api.askAdminAi(aiQuery, currentUser.role);
      setAiResponse(reply);
    } catch (err: any) {
      setAiResponse('AI intelligence query failed: ' + err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await updateSettings(formSettings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert('Error saving settings: ' + err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.fullName.trim() || !userForm.email.trim()) return;

    setUserSaving(true);
    try {
      if (editingUserId) {
        await api.updateAdminUser(editingUserId, { ...userForm, updatedAt: new Date().toISOString() });
      } else {
        await api.createAdminUser(userForm);
      }

      setUserForm({
        fullName: '',
        email: '',
        phone: '',
        role: 'student',
        department: '',
        studentNumber: '',
        admissionNumber: '',
        linkedStudentId: '',
      });
      setEditingUserId(null);
      await loadUsers();
    } catch (err: any) {
      alert(err.message || 'Unable to save user data.');
    } finally {
      setUserSaving(false);
    }
  };

  const handleEditUser = (user: any) => {
    setEditingUserId(user.id);
    setUserForm({
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'student',
      department: user.department || '',
      studentNumber: user.studentNumber || '',
      admissionNumber: user.admissionNumber || '',
      linkedStudentId: user.linkedStudentId || '',
    });
    setActiveTab('users');
  };

  const handleExportSql = () => {
    window.open('/api/db/export-sql', '_blank');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              Executive Directorate
            </span>
            <span className="text-xs text-slate-400">Live Campus State</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif mt-1">
            AITI Institutional Command Center
          </h1>
          <p className="text-xs text-slate-400">
            Managing <strong className="text-white">{settings?.general.fullName}</strong> • Ilorin Campus
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'metrics', label: 'Institutional KPIs & Summary', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'training', label: 'Training & Courses Manager', icon: <BookOpen className="w-4 h-4 text-cyan-400" /> },
          { id: 'online_manager', label: 'Online Training & Multi-Currency', icon: <Laptop className="w-4 h-4 text-emerald-400" /> },
          { id: 'ai_assistant', label: 'Gemini Executive Intelligence', icon: <Bot className="w-4 h-4 text-cyan-400" /> },
          { id: 'settings', label: 'Institute Information & Settings', icon: <Settings className="w-4 h-4" /> },
          { id: 'export_sql', label: 'Supabase / PostgreSQL DDL', icon: <Database className="w-4 h-4 text-emerald-400" /> },
          { id: 'audit_logs', label: 'System Audit Trail', icon: <ShieldCheck className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === tab.id
                ? 'bg-cyan-600 text-white shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ========================================================= */}
      {/* ONLINE & MULTI-CURRENCY MANAGER */}
      {/* ========================================================= */}
      {activeTab === 'online_manager' && (
        <div className="animate-in fade-in duration-200">
          <OnlineCourseAdminManager />
        </div>
      )}

      {/* ========================================================= */}
      {/* TRAINING MANAGEMENT */}
      {/* ========================================================= */}
      {activeTab === 'training' && (
        <div className="animate-in fade-in duration-200">
          <TrainingManagement />
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. METRICS & SUMMARY */}
      {/* ========================================================= */}
      {activeTab === 'metrics' && summary && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Total Applications</span>
                <Users className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono">{summary.totalApplicants}</div>
              <div className="text-[11px] text-cyan-400 mt-1">
                {summary.certApps} Certificate • {summary.dipApps} Diploma
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Active Enrolled Students</span>
                <GraduationCap className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono">{summary.activeStudents}</div>
              <div className="text-[11px] text-purple-300 mt-1">
                {summary.totalAdmitted} Offered Admission
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Total Revenue Collected</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                NGN {Number(summary.totalRevenue || 0).toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Application fees & Tuition
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Outstanding Tuition Balance</span>
                <DollarSign className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
                NGN {Number(summary.totalOutstanding || 0).toLocaleString()}
              </div>
              <div className="text-[11px] text-amber-300/80 mt-1">
                Unpaid student tuition
              </div>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Average Attendance</span>
              <div className="text-2xl font-bold text-white font-mono">{summary.avgAttendance}%</div>
              <p className="text-[11px] text-slate-400 mt-1">Across all practical lab sessions</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Active Technical Classes</span>
              <div className="text-2xl font-bold text-white font-mono">{summary.totalClasses} Active Classes</div>
              <p className="text-[11px] text-slate-400 mt-1">{summary.totalCourses} accredited courses in catalogue</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Graduated Students</span>
              <div className="text-2xl font-bold text-emerald-400 font-mono">{summary.graduatedStudents} Alumni</div>
              <p className="text-[11px] text-slate-400 mt-1">Issued official QR certificates</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. PEOPLE & ROLES DIRECTORY */}
      {/* ========================================================= */}
      {activeTab === 'users' && (
        <div className="grid grid-cols-1 xl:grid-cols-[420px_minmax(0,1fr)] gap-6 animate-in fade-in duration-200">
          <form onSubmit={handleUserSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-violet-400 font-bold">People Management</div>
                <h3 className="text-xl font-bold text-white font-serif mt-1">
                  {editingUserId ? 'Edit Account' : 'Create User'}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-violet-950/70 border border-violet-700/60 flex items-center justify-center text-violet-300">
                <UserCog className="w-5 h-5" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="text-slate-300 font-semibold block mb-1">Full Name</label>
                <input value={userForm.fullName} onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" placeholder="Full name" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-slate-300 font-semibold block mb-1">Email</label>
                <input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" placeholder="email@institution.com" />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Phone</label>
                <input value={userForm.phone} onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" placeholder="080..." />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Role</label>
                <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                  <option value="super_admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="admissions_officer">Admissions Officer</option>
                  <option value="finance_officer">Finance Officer</option>
                  <option value="instructor">Instructor</option>
                  <option value="student">Student</option>
                  <option value="parent">Parent</option>
                </select>
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Department</label>
                <input value={userForm.department} onChange={(e) => setUserForm({ ...userForm, department: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" placeholder="Department" />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Student Number</label>
                <input value={userForm.studentNumber} onChange={(e) => setUserForm({ ...userForm, studentNumber: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" placeholder="AITI/STU/..." />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Admission Number</label>
                <input value={userForm.admissionNumber} onChange={(e) => setUserForm({ ...userForm, admissionNumber: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" placeholder="AITI/ADM/..." />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Linked Student</label>
                <input value={userForm.linkedStudentId} onChange={(e) => setUserForm({ ...userForm, linkedStudentId: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" placeholder="student id" />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={userSaving} className="flex-1 bg-violet-500 hover:bg-violet-400 text-slate-950 font-black px-5 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2">
                {userSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {userSaving ? 'Saving...' : editingUserId ? 'Update User' : 'Save User'}
              </button>
              {editingUserId && (
                <button type="button" onClick={() => { setEditingUserId(null); setUserForm({ fullName: '', email: '', phone: '', role: 'student', department: '', studentNumber: '', admissionNumber: '', linkedStudentId: '' }); }} className="bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl text-xs font-bold text-slate-200">
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold">Institution Directory</div>
                <h3 className="text-xl font-bold text-white font-serif mt-1">All Users & Roles</h3>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500" placeholder="Search people..." />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['super_admin', 'admissions_officer', 'finance_officer', 'instructor', 'student', 'parent'].map((role) => {
                const count = users.filter((u) => u.role === role).length;
                return (
                  <div key={role} className="bg-slate-950 border border-slate-800 rounded-2xl p-3">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400">{role.replace('_', ' ')}</div>
                    <div className="text-2xl font-extrabold text-white mt-1">{count}</div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 max-h-[760px] overflow-y-auto pr-1">
              {users.filter((user) => {
                const value = userSearch.toLowerCase();
                return !value || [user.fullName, user.email, user.role, user.department, user.studentNumber || '', user.admissionNumber || ''].join(' ').toLowerCase().includes(value);
              }).map((user) => (
                <div key={user.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/30 flex items-center justify-center text-sm font-black text-white uppercase">
                      {user.fullName?.charAt(0) || 'U'}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-white truncate">{user.fullName}</div>
                      <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                      <div className="text-[10px] text-cyan-400 uppercase tracking-wider mt-1">{user.role}</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2 text-[11px] text-slate-300">
                    <div>{user.department || 'General'}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">{user.phone || 'No phone'}</span>
                      <button onClick={() => handleEditUser(user)} className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg font-semibold">
                        <PencilLine className="w-3 h-3" /> Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. GEMINI AI EXECUTIVE ASSISTANT */}
      {/* ========================================================= */}
      {activeTab === 'ai_assistant' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-700/60 flex items-center justify-center text-cyan-400">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-serif flex items-center gap-2">
                Gemini Institutional Intelligence Agent
                <Sparkles className="w-4 h-4 text-amber-300" />
              </h3>
              <p className="text-xs text-slate-400">
                Direct AI access to live AITI student records, payments, and admission pipelines.
              </p>
            </div>
          </div>

          <form onSubmit={handleAskAi} className="flex gap-3">
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="e.g. Give me an executive summary of admitted students and outstanding tuition fees..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={aiLoading || !aiQuery.trim()}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
            >
              {aiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
              <span>Ask AI</span>
            </button>
          </form>

          {aiResponse && (
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block">
                Executive Analysis Report
              </span>
              <p className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed">
                {aiResponse}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {[
              "What is our current total revenue vs outstanding student debt?",
              "List all students with low attendance below 80%",
              "Give me a breakdown of Certificate vs Diploma applications"
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => { setAiQuery(q); }}
                className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left text-cyan-300 text-xs transition-colors"
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. INSTITUTE SETTINGS (LIVE EDITING) */}
      {/* ========================================================= */}
      {activeTab === 'settings' && formSettings && (
        <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 animate-in fade-in duration-200">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white font-serif">Institute Information & Configuration</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Update general branding, contact phone numbers in Ilorin, WhatsApp lines, and tuition rates.
              </p>
            </div>
            {saveSuccess && (
              <div className="bg-emerald-950 border border-emerald-500 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Settings Saved!
              </div>
            )}
          </div>

          {/* Section 1: General & Branding */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">1. General & Branding</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Institute Full Name</label>
                <input
                  type="text"
                  value={formSettings.general.fullName}
                  onChange={(e) => setFormSettings({ ...formSettings, general: { ...formSettings.general, fullName: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Short Name / Acronym</label>
                <input
                  type="text"
                  value={formSettings.general.shortName}
                  onChange={(e) => setFormSettings({ ...formSettings, general: { ...formSettings.general, shortName: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Parent Organization</label>
                <input
                  type="text"
                  value={formSettings.general.parentOrganization}
                  onChange={(e) => setFormSettings({ ...formSettings, general: { ...formSettings.general, parentOrganization: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Tagline</label>
                <input
                  type="text"
                  value={formSettings.general.tagline}
                  onChange={(e) => setFormSettings({ ...formSettings, general: { ...formSettings.general, tagline: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Motto</label>
                <input
                  type="text"
                  value={formSettings.general.motto}
                  onChange={(e) => setFormSettings({ ...formSettings, general: { ...formSettings.general, motto: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Institution Type</label>
                <input
                  type="text"
                  value={formSettings.general.institutionType}
                  onChange={(e) => setFormSettings({ ...formSettings, general: { ...formSettings.general, institutionType: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Official Contact & Address */}
          <div className="space-y-4 border-t border-slate-800 pt-6">
            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">2. Campus Contact & Location</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="text-slate-300 font-semibold block mb-1">Full Campus Address</label>
                <input
                  type="text"
                  value={formSettings.contact.address}
                  onChange={(e) => setFormSettings({ ...formSettings, contact: { ...formSettings.contact, address: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Junction / Landmark</label>
                <input
                  type="text"
                  value={formSettings.contact.junction}
                  onChange={(e) => setFormSettings({ ...formSettings, contact: { ...formSettings.contact, junction: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Primary Phone Line</label>
                <input
                  type="text"
                  value={formSettings.contact.primaryPhone}
                  onChange={(e) => setFormSettings({ ...formSettings, contact: { ...formSettings.contact, primaryPhone: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Secondary Phone Line</label>
                <input
                  type="text"
                  value={formSettings.contact.secondaryPhone}
                  onChange={(e) => setFormSettings({ ...formSettings, contact: { ...formSettings.contact, secondaryPhone: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Official Email</label>
                <input
                  type="email"
                  value={formSettings.contact.email}
                  onChange={(e) => setFormSettings({ ...formSettings, contact: { ...formSettings.contact, email: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Admissions & Tuition Schedule */}
          <div className="space-y-4 border-t border-slate-800 pt-6">
            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">3. Admissions & Tuition Rates</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Active Academic Session</label>
                <input
                  type="text"
                  value={formSettings.admissions.activeSession}
                  onChange={(e) => setFormSettings({ ...formSettings, admissions: { ...formSettings.admissions, activeSession: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Application Fee (NGN)</label>
                <input
                  type="number"
                  value={formSettings.admissions.applicationFee}
                  onChange={(e) => setFormSettings({ ...formSettings, admissions: { ...formSettings.admissions, applicationFee: Number(e.target.value) } })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">3-Month Certificate Tuition (NGN)</label>
                <input
                  type="number"
                  value={formSettings.admissions.certificateTuition}
                  onChange={(e) => setFormSettings({ ...formSettings, admissions: { ...formSettings.admissions, certificateTuition: Number(e.target.value) } })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">6-Month Diploma Tuition (NGN)</label>
                <input
                  type="number"
                  value={formSettings.admissions.diplomaTuition}
                  onChange={(e) => setFormSettings({ ...formSettings, admissions: { ...formSettings.admissions, diplomaTuition: Number(e.target.value) } })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Application Deadline</label>
                <input
                  type="date"
                  value={formSettings.admissions.applicationDeadline}
                  onChange={(e) => setFormSettings({ ...formSettings, admissions: { ...formSettings.admissions, applicationDeadline: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Class Resumption Date</label>
                <input
                  type="date"
                  value={formSettings.admissions.programStartDate}
                  onChange={(e) => setFormSettings({ ...formSettings, admissions: { ...formSettings.admissions, programStartDate: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={savingSettings}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-8 py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
            >
              {savingSettings ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Save & Publish Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* 4. SUPABASE / POSTGRESQL DDL EXPORT */}
      {/* ========================================================= */}
      {activeTab === 'export_sql' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white font-serif flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" /> PostgreSQL / Supabase Migration Schema
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Full DDL definitions with primary keys, indexes, foreign keys, and default constraints ready to copy or download.
              </p>
            </div>
            <button
              onClick={handleExportSql}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md"
            >
              <Download className="w-4 h-4" /> Download .sql File
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-[11px] text-emerald-300 max-h-96 overflow-y-auto space-y-1">
            <pre className="whitespace-pre-wrap leading-relaxed">
{`-- =========================================================================
-- AITI (AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE) DATABASE SCHEMA
-- Generated for PostgreSQL / Supabase Migration
-- Session: 2026/2027 • Tanke, Ilorin, Kwara State, Nigeria
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS institute_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'current_settings',
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    role VARCHAR(50) NOT NULL,
    department VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(100) PRIMARY KEY,
    application_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    program_id VARCHAR(100) NOT NULL,
    program_title VARCHAR(255) NOT NULL,
    program_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'submitted',
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admissions (
    id VARCHAR(100) PRIMARY KEY,
    admission_number VARCHAR(100) UNIQUE NOT NULL,
    application_id VARCHAR(100) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    program_title VARCHAR(255) NOT NULL,
    tuition_fee NUMERIC(12,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'offered',
    offered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(100) PRIMARY KEY,
    student_number VARCHAR(100) UNIQUE NOT NULL,
    admission_number VARCHAR(100) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    program_title VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    total_tuition NUMERIC(12,2) NOT NULL,
    amount_paid NUMERIC(12,2) NOT NULL DEFAULT 0,
    outstanding_balance NUMERIC(12,2) NOT NULL,
    attendance_percentage INTEGER DEFAULT 100
);

CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(100) PRIMARY KEY,
    receipt_number VARCHAR(100) UNIQUE NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    gateway VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'success',
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
            </pre>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. AUDIT LOGS */}
      {/* ========================================================= */}
      {activeTab === 'audit_logs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-xl font-bold text-white font-serif">Institutional System Audit Trail</h3>
            <span className="text-xs text-slate-400">{auditLogs.length} logged actions</span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-400 font-mono">{log.action}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded uppercase font-semibold">
                      {log.userRole}
                    </span>
                    <span className="text-slate-200 font-semibold">{log.userName}</span>
                  </div>
                  <p className="text-slate-400 mt-1">{log.details}</p>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
