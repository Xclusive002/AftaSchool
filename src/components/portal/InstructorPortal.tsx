import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, Clock, Calendar, 
  FileText, Award, Check, X, AlertCircle, 
  RefreshCw, Plus, Send, Sparkles, MessageSquare
} from 'lucide-react';
import { api } from '../../services/api';
import { Student, AttendanceRecord, Assignment, AcademicResult } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const InstructorPortal: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'attendance' | 'assignments' | 'grading' | 'messages'>('attendance');
  
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('class_fs_01');
  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [results, setResults] = useState<AcademicResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Attendance Register Form
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceMarks, setAttendanceMarks] = useState<{ [studentId: string]: 'present' | 'absent' | 'late' | 'excused' }>({});
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [attendanceSuccess, setAttendanceSuccess] = useState(false);

  // Create Assignment State
  const [showCreateAssignModal, setShowCreateAssignModal] = useState(false);
  const [newAssignTitle, setNewAssignTitle] = useState('');
  const [newAssignDesc, setNewAssignDesc] = useState('');
  const [newAssignDeadline, setNewAssignDeadline] = useState('2026-11-25');
  const [newAssignMaxScore, setNewAssignMaxScore] = useState(100);

  // Grading Modal / Result input
  const [editingResult, setEditingResult] = useState<AcademicResult | null>(null);
  const [assignScore, setAssignScore] = useState<number>(18);
  const [testScore, setTestScore] = useState<number>(17);
  const [practicalScore, setPracticalScore] = useState<number>(19);
  const [examScore, setExamScore] = useState<number>(36);
  const [savingGrade, setSavingGrade] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState('');
  const [messageRecipientId, setMessageRecipientId] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cls, stus, assigns, res] = await Promise.all([
        api.getClasses(),
        api.getStudents(),
        api.getAssignments(),
        api.getResults()
      ]);
      setClasses(cls);
      setStudents(stus);
      setAssignments(assigns.assignments || []);
      setResults(res);


      // Initialize default attendance
      const initialMarks: { [key: string]: 'present' | 'absent' | 'late' | 'excused' } = {};
      stus.forEach(s => { initialMarks[s.id] = 'present'; });
      setAttendanceMarks(initialMarks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab !== 'messages') return;
    api.getLmsMessages(undefined, currentUser.id).then(setMessages).catch(console.error);
  }, [activeTab, currentUser.id]);

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!messageText.trim()) return;
    setSendingMessage(true);
    try {
      const message = await api.sendLmsMessage({ senderId: currentUser.id, recipientId: messageRecipientId || undefined, body: messageText });
      setMessages(previous => [...previous, message]);
      setMessageText('');
    } catch (err: any) {
      alert(`Message failed: ${err.message}`);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSaveAttendance = async () => {
    setSavingAttendance(true);
    try {
      const records = Object.entries(attendanceMarks).map(([studentId, status]) => {
        const s = students.find(item => item.id === studentId);
        return {
          studentId,
          studentName: s?.fullName || '',
          studentNumber: s?.studentNumber || '',
          status: String(status)
        };
      });


      await api.markAttendance({
        classId: selectedClassId,
        records,
        date: attendanceDate,
        recordedBy: currentUser.fullName
      });

      setAttendanceSuccess(true);
      setTimeout(() => setAttendanceSuccess(false), 3000);
      await loadData();
    } catch (err: any) {
      alert('Error recording attendance: ' + err.message);
    } finally {
      setSavingAttendance(false);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAssignment({
        classId: selectedClassId,
        className: classes.find(c => c.id === selectedClassId)?.name || 'Practical Cohort',
        title: newAssignTitle,
        description: newAssignDesc,
        dueDate: newAssignDeadline,
        maxScore: newAssignMaxScore,
        instructorName: currentUser.fullName
      });
      setShowCreateAssignModal(false);
      setNewAssignTitle('');
      setNewAssignDesc('');
      await loadData();
    } catch (err: any) {
      alert('Error creating assignment: ' + err.message);
    }
  };

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResult) return;
    setSavingGrade(true);
    try {
      await api.submitResultScore({
        resultId: editingResult.id,
        assignmentScore: Number(assignScore),
        testScore: Number(testScore),
        practicalLabScore: Number(practicalScore),
        examScore: Number(examScore)
      });
      setEditingResult(null);
      await loadData();
    } catch (err: any) {
      alert('Error saving grade: ' + err.message);
    } finally {
      setSavingGrade(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
              Technical Faculty & Instructors
            </span>
            <span className="text-xs text-slate-400">Classroom Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif mt-1">
            Instructor Practical Portal
          </h1>
          <p className="text-xs text-slate-400">
            Track daily laboratory attendance, issue coding assignments, and grade continuous assessments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-cyan-300 font-semibold focus:outline-hidden"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.schedule})</option>
            ))}
          </select>

          <button
            onClick={loadData}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700"
            title="Refresh Classroom"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'attendance', label: 'Daily Attendance Register', icon: <Calendar className="w-4 h-4" /> },
          { id: 'assignments', label: 'Technical Assignments', icon: <FileText className="w-4 h-4" /> },
          { id: 'grading', label: 'Assessments & Gradebook', icon: <Award className="w-4 h-4" /> },
          { id: 'messages', label: 'Student Messages', icon: <MessageSquare className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ========================================================= */}
      {/* 0. STUDENT MESSAGES */}
      {/* ========================================================= */}
      {activeTab === 'messages' && (
        <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 animate-in fade-in duration-200">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">Student Messages</h3>
            <p className="text-xs text-slate-400">Send course updates and answer student questions.</p>
            <select value={messageRecipientId} onChange={event => setMessageRecipientId(event.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white">
              <option value="">All enrolled students</option>
              {students.map(student => <option key={student.id} value={student.userId || student.id}>{student.fullName}</option>)}
            </select>
          </div>
          <div className="space-y-4">
            <div className="min-h-56 max-h-96 overflow-y-auto space-y-2 bg-slate-950 rounded-2xl border border-slate-800 p-4">
              {messages.length === 0 ? <p className="text-xs text-slate-500 text-center py-12">No messages yet.</p> : messages.map(message => <div key={message.id} className="rounded-xl border border-slate-800 p-3 text-xs"><div className="text-[10px] text-cyan-400">{message.senderId === currentUser.id ? 'You' : 'Student'} · {new Date(message.createdAt).toLocaleString()}</div><p className="text-slate-200 mt-1">{message.body}</p></div>)}
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input value={messageText} onChange={event => setMessageText(event.target.value)} placeholder="Write a message to your students..." className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 text-xs text-white" />
              <button type="submit" disabled={sendingMessage} className="bg-purple-600 hover:bg-purple-500 text-white px-4 rounded-xl text-xs font-bold"><Send className="w-4 h-4" /></button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. ATTENDANCE REGISTER */}
      {/* ========================================================= */}
      {activeTab === 'attendance' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white font-serif">Mark Practical Session Attendance</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Record student laboratory presence for {new Date(attendanceDate).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />

              <button
                onClick={handleSaveAttendance}
                disabled={savingAttendance}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-5 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-md"
              >
                {savingAttendance ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>Save Register</span>
              </button>
            </div>
          </div>

          {attendanceSuccess && (
            <div className="bg-emerald-950/60 border border-emerald-500/50 p-3 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Attendance register saved and synced to student records!
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Student Number</th>
                  <th className="py-3 px-4">Current Attendance %</th>
                  <th className="py-3 px-4">Session Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {students.map((stu) => (
                  <tr key={stu.id} className="hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-bold text-white text-sm">{stu.fullName}</td>
                    <td className="py-3.5 px-4 font-mono text-cyan-400">{stu.studentNumber}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{stu.attendancePercentage || 95}%</span>
                        <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full"
                            style={{ width: `${stu.attendancePercentage || 95}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {['present', 'absent', 'late', 'excused'].map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => setAttendanceMarks(prev => ({ ...prev, [stu.id]: status as any }))}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                              attendanceMarks[stu.id] === status
                                ? status === 'present' ? 'bg-emerald-600 text-white'
                                : status === 'absent' ? 'bg-rose-600 text-white'
                                : status === 'late' ? 'bg-amber-600 text-white'
                                : 'bg-cyan-600 text-white'
                                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. ASSIGNMENTS */}
      {/* ========================================================= */}
      {activeTab === 'assignments' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <div>
              <h3 className="text-xl font-bold text-white font-serif">Laboratory Assignments & Projects</h3>
              <p className="text-xs text-slate-400">Post technical specifications, coding tasks, and grade submissions.</p>
            </div>
            <button
              onClick={() => setShowCreateAssignModal(true)}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" /> Create New Assignment
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((item) => (
              <div key={item.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-950 px-2.5 py-0.5 rounded border border-purple-800">
                    {item.className}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> Due: {item.dueDate}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Instructor: <strong className="text-slate-200">{item.instructorName}</strong></span>
                  <span className="text-emerald-400 font-mono font-bold">Max Score: {item.maxScore} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. ASSESSMENTS & GRADEBOOK */}
      {/* ========================================================= */}
      {activeTab === 'grading' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-xl font-bold text-white font-serif">Continuous Assessment & Gradebook</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Input Assignment (20%), Midterm Test (20%), Practical Labs (20%), and Final Examination (40%) to calculate final GPA grade.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4 font-mono">Assign (20)</th>
                  <th className="py-3 px-4 font-mono">Test (20)</th>
                  <th className="py-3 px-4 font-mono">Lab (20)</th>
                  <th className="py-3 px-4 font-mono">Exam (40)</th>
                  <th className="py-3 px-4 font-mono">Total (100)</th>
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {results.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-bold text-white text-sm">{res.studentName}</td>
                    <td className="py-3.5 px-4 text-slate-300">{res.courseTitle}</td>
                    <td className="py-3.5 px-4 font-mono text-cyan-400">{res.assignmentScore}</td>
                    <td className="py-3.5 px-4 font-mono text-cyan-400">{res.testScore}</td>
                    <td className="py-3.5 px-4 font-mono text-cyan-400">{res.practicalLabScore}</td>
                    <td className="py-3.5 px-4 font-mono text-cyan-400">{res.examScore}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 text-sm">{res.totalScore}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 font-black text-xs border border-emerald-800 font-mono">
                        {res.grade} ({res.gpaPoints})
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setEditingResult(res);
                          setAssignScore(res.assignmentScore);
                          setTestScore(res.testScore);
                          setPracticalScore(res.practicalLabScore);
                          setExamScore(res.examScore);
                        }}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-3 py-1 rounded-lg text-xs"
                      >
                        Edit Scores
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {showCreateAssignModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white font-serif">Create New Technical Assignment</h3>
              <button
                onClick={() => setShowCreateAssignModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  value={newAssignTitle}
                  onChange={(e) => setNewAssignTitle(e.target.value)}
                  placeholder="e.g. Build an E-Commerce Cart in React & Tailwind"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Project Specification & Requirements *</label>
                <textarea
                  required
                  rows={4}
                  value={newAssignDesc}
                  onChange={(e) => setNewAssignDesc(e.target.value)}
                  placeholder="Provide instructions, required components, and GitHub repository submission guidelines..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newAssignDeadline}
                    onChange={(e) => setNewAssignDeadline(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Max Score (pts)</label>
                  <input
                    type="number"
                    value={newAssignMaxScore}
                    onChange={(e) => setNewAssignMaxScore(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateAssignModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grade Edit Modal */}
      {editingResult && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-cyan-400 font-bold uppercase">{editingResult.courseTitle}</span>
                <h3 className="text-lg font-bold text-white font-serif">{editingResult.studentName}</h3>
              </div>
              <button
                onClick={() => setEditingResult(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Assignment (/20)</label>
                  <input
                    type="number"
                    max={20}
                    min={0}
                    value={assignScore}
                    onChange={(e) => setAssignScore(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Midterm Test (/20)</label>
                  <input
                    type="number"
                    max={20}
                    min={0}
                    value={testScore}
                    onChange={(e) => setTestScore(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Practical Lab (/20)</label>
                  <input
                    type="number"
                    max={20}
                    min={0}
                    value={practicalScore}
                    onChange={(e) => setPracticalScore(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Final Exam (/40)</label>
                  <input
                    type="number"
                    max={40}
                    min={0}
                    value={examScore}
                    onChange={(e) => setExamScore(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Total Computed Score:</span>
                <strong className="text-emerald-400 font-mono text-base">
                  {Number(assignScore) + Number(testScore) + Number(practicalScore) + Number(examScore)} / 100
                </strong>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingResult(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingGrade}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  {savingGrade ? 'Saving...' : 'Save Grade Score'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
