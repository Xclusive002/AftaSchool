import React, { useEffect, useState } from 'react';
import { 
  Laptop, BookOpen, PlayCircle, CheckCircle2, Award, Calendar, 
  FileText, Download, Upload, MessageSquare, Clock, ShieldCheck, 
  ExternalLink, ChevronRight, AlertCircle, ArrowLeft, Video, HelpCircle, 
  DollarSign, Check, Eye
} from 'lucide-react';
import { DetailedOnlineCourse } from '../../data/onlineCoursesSeed';
import { formatCurrency } from '../../services/currency';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

interface OnlineClassroomPortalProps {
  onBackToMain?: () => void;
}

export const OnlineClassroomPortal: React.FC<OnlineClassroomPortalProps> = ({ onBackToMain }) => {
  const { settings } = useSettings();
  const { currentUser } = useAuth();

  // Active enrolled course
  const [selectedCourse, setSelectedCourse] = useState<DetailedOnlineCourse | null>(null);
  const [activeTab, setActiveTab] = useState<'curriculum' | 'live_classes' | 'assignments' | 'quizzes' | 'certificate' | 'invoices' | 'messages'>('curriculum');
  const [messages, setMessages] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  
  // Active lesson being viewed
  const [activeLesson, setActiveLesson] = useState<any>(selectedCourse.modules[0]?.lessons[0] || null);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(['les-dev-101']);

  // Active Quiz taking state
  const [activeQuiz, setActiveQuiz] = useState<any | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Assignment submission state
  const [assignmentSubmissionText, setAssignmentSubmissionText] = useState('');
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false);

  useEffect(() => {
    api.getLmsCourses().then(courses => {
      const course = courses[0];
      if (course) setSelectedCourse(course);
    }).catch(console.error);
    if (currentUser) {
      const studentId = currentUser.studentId || currentUser.id;
      api.getCertificates(studentId).then(setCertificates).catch(console.error);
      api.getInvoices(studentId).then(setInvoices).catch(console.error);
    }
  }, [currentUser]);

  if (!selectedCourse) {
    return <div className="min-h-screen bg-slate-950 text-slate-300 flex items-center justify-center">No online course is currently available.</div>;
  }

  useEffect(() => {
    if (activeTab === 'messages' && currentUser) {
      api.getLmsMessages(selectedCourse.id, currentUser.id).then(setMessages).catch(console.error);
    }
  }, [activeTab, currentUser, selectedCourse.id]);

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentUser || !messageText.trim()) return;
    setSendingMessage(true);
    try {
      const message = await api.sendLmsMessage({ courseId: selectedCourse.id, senderId: currentUser.id, body: messageText });
      setMessages(previous => [...previous, message]);
      setMessageText('');
    } catch (err: any) {
      alert(`Message failed: ${err.message}`);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSubmitAssignment = async (assignmentId: string) => {
    if (!currentUser || !assignmentSubmissionText.trim()) {
      alert('Please provide your project link or submission notes.');
      return;
    }
    try {
      await api.submitAssignment(assignmentId, {
        studentId: currentUser.studentId || currentUser.id,
        studentName: currentUser.fullName,
        studentNumber: currentUser.studentNumber || currentUser.id,
        submissionText: assignmentSubmissionText.trim()
      });
      setAssignmentSubmitted(true);
    } catch (err: any) {
      alert(`Submission failed: ${err.message}`);
    }
  };

  const toggleLessonComplete = (lessonId: string) => {
    if (completedLessonIds.includes(lessonId)) {
      setCompletedLessonIds(prev => prev.filter(id => id !== lessonId));
    } else {
      setCompletedLessonIds(prev => [...prev, lessonId]);
    }
  };

  const totalLessons = selectedCourse.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const progressPercent = Math.round((completedLessonIds.length / (totalLessons || 1)) * 100);

  const handleStartQuiz = (quiz: any) => {
    setActiveQuiz(quiz);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  const handleGradeQuiz = () => {
    if (!activeQuiz) return;
    let correct = 0;
    activeQuiz.questions.forEach((q: any) => {
      if (quizAnswers[q.id] === q.correctAnswerIndex) {
        correct++;
      }
    });
    const pct = Math.round((correct / activeQuiz.questions.length) * 100);
    setQuizScore(pct);
    setQuizSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* 1. TOP LMS NAVIGATION HEADER */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          {onBackToMain && (
            <button
              onClick={onBackToMain}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800/80 px-3 py-1.5 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portal Home</span>
            </button>
          )}

          <div className="flex items-center gap-2 border-l border-slate-700 pl-4">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold text-white tracking-wide">
              {selectedCourse.title}
            </span>
          </div>
        </div>

        {/* Student Profile Pill */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <strong className="text-xs text-white block">{currentUser?.fullName || 'Learner'}</strong>
            <span className="text-[10px] text-cyan-400 font-mono">{currentUser?.studentNumber || currentUser?.id || ''}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-cyan-600 border border-cyan-400 flex items-center justify-center font-bold text-xs text-slate-950">
            {(currentUser?.fullName || 'L').slice(0, 2).toUpperCase()}
          </div>
        </div>
      </header>

      {/* 2. SUB NAVIGATION TABS & PROGRESS BAR */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-4 sm:px-6 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'curriculum', label: 'Curriculum & Videos', icon: BookOpen },
            { id: 'live_classes', label: 'Live Masterclasses', icon: Video },
            { id: 'assignments', label: 'Assignments & Projects', icon: FileText },
            { id: 'quizzes', label: 'Quizzes & Tests', icon: HelpCircle },
            { id: 'certificate', label: 'Verified Certificate', icon: Award },
            { id: 'invoices', label: 'Receipt & Invoice', icon: DollarSign }
            , { id: 'messages', label: 'Instructor Messages', icon: MessageSquare }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Course Progress */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-slate-400 font-mono">
            Progress: <strong className="text-cyan-400">{progressPercent}%</strong>
          </span>
          <div className="w-32 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE CONTENT */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        
        {/* TAB 1: CURRICULUM & ACTIVE LESSON PLAYER */}
        {activeTab === 'curriculum' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Video Player & Content (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {activeLesson ? (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-[10px] text-cyan-400 font-mono uppercase font-bold">
                        Active Interactive Lesson
                      </span>
                      <h2 className="text-xl font-bold text-white">
                        {activeLesson.title}
                      </h2>
                    </div>

                    <button
                      onClick={() => toggleLessonComplete(activeLesson.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        completedLessonIds.includes(activeLesson.id)
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{completedLessonIds.includes(activeLesson.id) ? 'Completed' : 'Mark as Complete'}</span>
                    </button>
                  </div>

                  {/* Video Lesson Embed */}
                  {activeLesson.videoUrl ? (
                    <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                      <iframe
                        src={activeLesson.videoUrl}
                        title={activeLesson.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    <div className="p-12 text-center bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                      <Video className="w-10 h-10 text-cyan-400 mx-auto" />
                      <h4 className="text-sm font-bold text-white">Live Classroom Lecture</h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        This lesson is conducted live with your cohort. Check the Live Masterclasses tab for meeting links.
                      </p>
                    </div>
                  )}

                  {/* Lesson Notes & Markdown Text */}
                  <div className="space-y-3 bg-slate-950/70 p-5 rounded-2xl border border-slate-800">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <span>Lesson Guide &amp; Instructions</span>
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {activeLesson.contentMarkdown || activeLesson.summary}
                    </p>
                  </div>

                  {/* Downloadable Resources */}
                  {activeLesson.resources && activeLesson.resources.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Downloadable Learning Materials
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {activeLesson.resources.map((res: any) => (
                          <div 
                            key={res.id}
                            className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-emerald-400" />
                              <div>
                                <strong className="text-white block">{res.title}</strong>
                                <span className="text-[10px] text-slate-400">{res.fileSize || 'Asset'}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => alert(`Downloading ${res.title}`)}
                              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800">
                  <p className="text-xs text-slate-400">Select a lesson from the syllabus sidebar to begin.</p>
                </div>
              )}

            </div>

            {/* Right: Modules & Lessons Syllabus List (4 cols) */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Course Syllabus</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  {completedLessonIds.length}/{totalLessons} Done
                </span>
              </div>

              <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
                {selectedCourse.modules.map((mod) => (
                  <div key={mod.id} className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3.5 space-y-2">
                    <strong className="text-xs text-white block">{mod.title}</strong>
                    
                    <div className="space-y-1.5">
                      {mod.lessons.map((les) => {
                        const isDone = completedLessonIds.includes(les.id);
                        const isSelected = activeLesson?.id === les.id;

                        return (
                          <button
                            key={les.id}
                            onClick={() => setActiveLesson(les)}
                            className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between ${
                              isSelected
                                ? 'bg-cyan-950 border border-cyan-700 text-white'
                                : 'bg-slate-900/60 hover:bg-slate-900 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              ) : (
                                <PlayCircle className="w-4 h-4 text-slate-500 shrink-0" />
                              )}
                              <span className="line-clamp-1 font-medium">{les.title}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono shrink-0">
                              {les.durationMinutes}m
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {activeTab === 'messages' && (
          <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            <div><h2 className="text-xl font-bold text-white">Instructor Messages</h2><p className="text-xs text-slate-400 mt-1">Ask questions and receive course updates from your instructor.</p></div>
            <div className="min-h-64 max-h-[32rem] overflow-y-auto space-y-2 bg-slate-950 rounded-2xl border border-slate-800 p-4">
              {messages.length === 0 ? <p className="text-xs text-slate-500 text-center py-16">No messages yet.</p> : messages.map(message => <div key={message.id} className="rounded-xl border border-slate-800 p-3 text-xs"><div className="text-[10px] text-cyan-400">{message.senderId === currentUser?.id ? 'You' : 'Instructor'} · {new Date(message.createdAt).toLocaleString()}</div><p className="text-slate-200 mt-1">{message.body}</p></div>)}
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-2"><input value={messageText} onChange={event => setMessageText(event.target.value)} placeholder="Ask your instructor a question..." className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 text-xs text-white" /><button type="submit" disabled={sendingMessage} className="bg-cyan-500 text-slate-950 px-4 rounded-xl"><MessageSquare className="w-4 h-4" /></button></form>
          </div>
        )}

        {/* TAB 2: LIVE MASTERCLASSES */}
        {activeTab === 'live_classes' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="space-y-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                  Real-time Interactive Mentorship
                </span>
                <h2 className="text-2xl font-bold text-white font-serif">
                  Live Cohort Video Masterclasses
                </h2>
                <p className="text-xs text-slate-300">
                  Join live interactive screen shares, ask questions directly to instructors, and participate in code reviews.
                </p>
              </div>

              <div className="space-y-4">
                {selectedCourse.liveClasses && selectedCourse.liveClasses.length > 0 ? (
                  selectedCourse.liveClasses.map((live) => (
                    <div key={live.id} className="bg-slate-950 border border-cyan-900/60 rounded-2xl p-6 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-cyan-400 uppercase bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-800">
                            Upcoming Live Masterclass
                          </span>
                          <h3 className="text-base font-bold text-white mt-1">{live.title}</h3>
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-800">
                          {live.meetingPlatform}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {live.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-900 p-3 rounded-xl border border-slate-800">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Lead Instructor:</span>
                          <strong className="text-white">{live.instructorName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Class Notes / Prerequisites:</span>
                          <span className="text-slate-300">{live.classNotes || 'None'}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-2">
                        <a
                          href={live.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg"
                        >
                          <Video className="w-4 h-4" />
                          <span>Join Live Classroom on {live.meetingPlatform}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-slate-950 rounded-2xl text-xs text-slate-400">
                    No live sessions currently scheduled for this module.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ASSIGNMENTS & PROJECT SUBMISSIONS */}
        {activeTab === 'assignments' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="space-y-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                  Hands-on Project Work
                </span>
                <h2 className="text-2xl font-bold text-white font-serif">
                  Practical Course Assignments &amp; Milestones
                </h2>
                <p className="text-xs text-slate-300">
                  Submit practical code repositories, design prototypes, or analysis dashboards for instructor review and grading.
                </p>
              </div>

              {selectedCourse.assignments && selectedCourse.assignments.length > 0 ? (
                selectedCourse.assignments.map((asg) => (
                  <div key={asg.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white">{asg.title}</h3>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        Max Score: {asg.maxScore} pts
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {asg.description}
                    </p>

                    <div className="text-xs text-slate-400">
                      Due Date: <strong className="text-white">{asg.dueDate}</strong>
                    </div>

                    {/* Submission box */}
                    {assignmentSubmitted ? (
                      <div className="bg-emerald-950/60 border border-emerald-800 p-4 rounded-xl text-xs space-y-1">
                        <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Assignment Submitted Successfully!
                        </span>
                        <p className="text-slate-300">
                          Your submission has been queued for review by {selectedCourse.instructorName}. You will receive feedback here once evaluated.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
                        <label className="block text-slate-300 font-semibold">
                          Submission Notes / GitHub Repository / Live URL:
                        </label>
                        <textarea
                          rows={3}
                          placeholder="e.g. GitHub: https://github.com/... | Live Preview: https://..."
                          value={assignmentSubmissionText}
                          onChange={(e) => setAssignmentSubmissionText(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                        ></textarea>

                        <button
                          onClick={() => handleSubmitAssignment(asg.id)}
                          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Submit Project Milestone</span>
                        </button>
                      </div>
                    )}

                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-slate-950 rounded-2xl text-xs text-slate-400">
                  No assignments currently active for this track.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: QUIZZES & TESTS */}
        {activeTab === 'quizzes' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="space-y-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                  Knowledge Evaluation
                </span>
                <h2 className="text-2xl font-bold text-white font-serif">
                  Practical Module Quizzes
                </h2>
              </div>

              {activeQuiz ? (
                // Active Quiz Taking Interface
                <div className="space-y-6 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-white">{activeQuiz.title}</h3>
                      <span className="text-xs text-slate-400">Passing Score: {activeQuiz.passingScorePercent}%</span>
                    </div>
                    <button
                      onClick={() => setActiveQuiz(null)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Exit Quiz
                    </button>
                  </div>

                  {/* Question list */}
                  <div className="space-y-6">
                    {activeQuiz.questions.map((q: any, idx: number) => (
                      <div key={q.id} className="space-y-3 bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs">
                        <span className="font-bold text-white block">
                          Question {idx + 1}: {q.questionText}
                        </span>

                        <div className="space-y-2">
                          {q.options?.map((opt: string, optIdx: number) => (
                            <label
                              key={optIdx}
                              className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all ${
                                quizAnswers[q.id] === optIdx
                                  ? 'bg-cyan-950 border-cyan-500 text-white'
                                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              <input
                                type="radio"
                                name={q.id}
                                checked={quizAnswers[q.id] === optIdx}
                                onChange={() => setQuizAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                                className="text-cyan-500"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>

                        {quizSubmitted && (
                          <div className={`p-3 rounded-lg text-xs ${
                            quizAnswers[q.id] === q.correctAnswerIndex
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700'
                              : 'bg-rose-950/80 text-rose-300 border border-rose-700'
                          }`}>
                            <strong>{quizAnswers[q.id] === q.correctAnswerIndex ? 'Correct!' : 'Incorrect.'}</strong>
                            <p className="text-[11px] mt-1">{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Quiz actions */}
                  {quizSubmitted ? (
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 block">Your Score:</span>
                        <strong className={`text-xl font-bold ${
                          (quizScore || 0) >= activeQuiz.passingScorePercent ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {quizScore}% {(quizScore || 0) >= activeQuiz.passingScorePercent ? '(Passed)' : '(Retake Recommended)'}
                        </strong>
                      </div>
                      <button
                        onClick={() => handleStartQuiz(activeQuiz)}
                        className="bg-slate-800 hover:bg-slate-700 text-cyan-300 px-4 py-2 rounded-xl text-xs font-bold"
                      >
                        Retake Quiz
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleGradeQuiz}
                      className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider"
                    >
                      Submit Quiz Answers
                    </button>
                  )}

                </div>
              ) : (
                <div className="space-y-4">
                  {selectedCourse.quizzes && selectedCourse.quizzes.length > 0 ? (
                    selectedCourse.quizzes.map((quiz) => (
                      <div key={quiz.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-white">{quiz.title}</h3>
                          <span className="text-xs text-slate-400">{quiz.questions.length} Questions • Passing: {quiz.passingScorePercent}%</span>
                        </div>
                        <button
                          onClick={() => handleStartQuiz(quiz)}
                          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs"
                        >
                          Start Quiz
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center bg-slate-950 rounded-2xl text-xs text-slate-400">
                      No quizzes currently assigned for this module.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: QR VERIFIED DIGITAL CERTIFICATE */}
        {activeTab === 'certificate' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl text-center">
              
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Public QR-Secured Verification</span>
                </div>
                <h2 className="text-2xl font-bold text-white font-serif">
                  AITI Official Digital Certificate
                </h2>
              </div>

              {/* Certificate Preview Card */}
              <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 border-4 border-double border-amber-500/40 p-8 rounded-3xl text-left space-y-6 shadow-2xl relative">
                
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-black text-white font-serif tracking-wide">
                      AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE
                    </h3>
                    <span className="text-xs text-cyan-400 font-mono block">
                      AITI • Beyond Tech • Ilorin, Nigeria
                    </span>
                  </div>

                  <div className="w-14 h-14 bg-white p-1 rounded-lg shadow">
                    {/* Simulated QR code box */}
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center text-[8px] font-mono text-cyan-400 text-center leading-tight">
                      AITI QR VERIFY
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-slate-400 uppercase font-semibold">This is to certify that</span>
                  <div className="text-2xl font-serif font-black text-amber-300">
                    {currentUser?.fullName || ''}
                  </div>
                  <p className="text-xs text-slate-300">
                    has successfully completed the comprehensive professional training program in
                  </p>
                  <div className="text-base font-bold text-white">
                    {selectedCourse.title}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px] pt-4 border-t border-slate-800 text-slate-300">
                  <div>
                    <span className="text-slate-500 block">Certificate No:</span>
                    <strong className="text-white font-mono">{certificates[0]?.certificateNumber || ''}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Issue Date:</span>
                    <strong className="text-white">{certificates[0]?.completionDate || ''}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Verification:</span>
                    <strong className="text-emerald-400">{certificates[0] ? 'Authentic / Secured' : 'Pending completion'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Delivery:</span>
                    <strong className="text-cyan-400">Online Live Cohort</strong>
                  </div>
                </div>

              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => alert('Certificate downloaded in high-resolution PDF with embedded QR token.')}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Verified Certificate (PDF)</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* TAB 6: RECEIPT & INVOICE */}
        {activeTab === 'invoices' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                    Billing &amp; Tax Receipt
                  </span>
                  <h2 className="text-2xl font-bold text-white font-serif">
                    Official Student Receipt
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 text-xs font-bold">
                  PAID IN FULL
                </span>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Student Name:</span>
                  <strong className="text-white">{currentUser?.fullName || ''}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Student ID / Location:</span>
                  <strong className="text-white">{currentUser?.studentNumber || currentUser?.id || ''}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Course:</span>
                  <strong className="text-white">{selectedCourse.title}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Gateway:</span>
                  <strong className="text-emerald-400">{invoices[0]?.status || ''}</strong>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                  <span>Total Amount Paid:</span>
                  <span className="text-emerald-400 text-base">{invoices[0] ? formatCurrency(invoices[0].amountPaid || 0, 'NGN', { showCode: true }) : ''}</span>
                </div>
              </div>

              <button
                onClick={() => alert('Printing official AITI student receipt.')}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print Official Receipt</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
