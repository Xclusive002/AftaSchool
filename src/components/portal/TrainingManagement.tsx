import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Layers, Building2, Users, Plus, Edit2, Trash2, 
  CheckCircle2, Clock, AlertCircle, Search, Filter, Sparkles, 
  DollarSign, Calendar, Eye, ShieldCheck, ChevronRight, X, 
  Check, ArrowRight, Phone, Mail, FileText, Send, UserCheck,
  Receipt, Award, MessageSquare, Download, MapPin, Briefcase,
  TrendingUp, ExternalLink, Globe, Cpu, CheckSquare, ListPlus
} from 'lucide-react';
import { ShortCourse, ShortCourseCategory, CorporateTrainingRequest, ShortCourseEnrollment, ShortCourseModuleItem, ShortCourseCompletionRule } from '../../types';
import { DocumentViewerModal } from '../common/DocumentViewer';

export const TrainingManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'categories' | 'corporate' | 'enrollments'>('courses');
  
  // Data state
  const [courses, setCourses] = useState<ShortCourse[]>([]);
  const [categories, setCategories] = useState<ShortCourseCategory[]>([]);
  const [corporateRequests, setCorporateRequests] = useState<CorporateTrainingRequest[]>([]);
  const [enrollments, setEnrollments] = useState<ShortCourseEnrollment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [corporateStatusFilter, setCorporateStatusFilter] = useState<string>('all');

  // Modals
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<ShortCourse | null>(null);
  const [courseModalTab, setCourseModalTab] = useState<'overview' | 'pricing' | 'modules' | 'rules' | 'instructor'>('overview');
  const [courseFormData, setCourseFormData] = useState<Partial<ShortCourse>>({
    title: '',
    code: '',
    categoryId: '',
    categoryName: '',
    description: '',
    durationWeeks: 8,
    durationHours: 64,
    feeNGN: 70000,
    feeGHS: 70000,
    internationalOnlineFee: 100,
    deliveryMode: 'hybrid',
    deliveryModes: ['Physical (Weekday)', 'Physical (Weekend)', 'Online (Live Evening)', 'Online (Self-Paced)'],
    location: 'AITI Campus, Tanke, Ilorin, Nigeria / Online',
    instructorName: 'AITI Certified Faculty Lead',
    instructorTitle: 'Senior Technical Instructor',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    prerequisites: 'Basic computer literacy and enthusiasm to build practical technical skills.',
    targetAudience: 'Students, graduates, working professionals, career switchers, and entrepreneurs.',
    whoCanEnroll: ['Beginners with no prior experience', 'Working professionals looking to upskill', 'Students & Graduates'],
    toolsCovered: [],
    finalProject: 'Industry-Standard Capstone Project Portfolio',
    upcomingBatches: ['Next Cohort Starts 1st of Next Month', 'Weekend Immersion Batch'],
    active: true,
    featured: false,
    modules: [],
    completionRules: {
      minAttendancePercent: 80,
      minAssignmentScorePercent: 65,
      finalProjectRequired: true,
      passGradePercent: 60
    },
    certificateDetails: {
      type: 'Certificate of Completion',
      issuingAuthority: 'AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE (AITI)',
      format: 'Digital Verifiable Certificate with QR Code + Hardcopy at Graduation',
      verifiability: 'Globally Verifiable at verify.aiti.edu.ng'
    }
  });

  // Corporate Request Detail Modal
  const [selectedCorporateRequest, setSelectedCorporateRequest] = useState<CorporateTrainingRequest | null>(null);
  const [corporateModalTab, setCorporateModalTab] = useState<'overview' | 'quotation' | 'invoice' | 'roster' | 'schedule' | 'notes'>('overview');
  const [corporateUpdateForm, setCorporateUpdateForm] = useState({
    status: 'NEW' as any,
    assignedTrainer: '',
    assignedOfficer: 'Corporate Training Directorate',
    quotationAmountGHS: 0,
    trainingVenue: 'Client On-Premise / AITI Lab',
    startDate: '2026-06-15',
    endDate: '2026-06-26',
    durationHours: 36,
    internalNotes: '',
    // Quotation items
    quotationItems: [
      { description: 'Executive Tailored Curriculum & Hands-on Lab Material', quantity: 1, unitPrice: 4500, total: 4500 },
      { description: 'Senior Faculty Instructor Facilitation (36 Hours)', quantity: 1, unitPrice: 6500, total: 6500 },
      { description: 'Digital Certification & Verifiable Credential Badges', quantity: 15, unitPrice: 100, total: 1500 }
    ],
    quotationDiscount: 0,
    quotationValidUntil: '2026-07-31',
    // Invoice details
    invoiceNumber: '',
    amountPaidGHS: 0,
    paymentStatus: 'UNPAID' as 'UNPAID' | 'DEPOSIT_PAID' | 'FULLY_PAID',
    // Participant Roster
    newParticipant: { name: '', email: '', role: '', attendance: 100, grade: 'Distinction' },
    participantsList: [
      { name: 'Dr. Michael K. Mensah', email: 'm.mensah@company.com', role: 'Head of Operations', attendance: 100, grade: 'Distinction' },
      { name: 'Grace Adomaa Owusu', email: 'g.owusu@company.com', role: 'Senior Systems Analyst', attendance: 95, grade: 'Credit' },
      { name: 'Emmanuel Asante', email: 'e.asante@company.com', role: 'Branch Operations Lead', attendance: 100, grade: 'Distinction' }
    ]
  });

  // Document Modal state
  const [documentModal, setDocumentModal] = useState<{
    isOpen: boolean;
    type: 'corporate_quotation' | 'corporate_invoice' | 'short_course_certificate' | 'short_course_registration';
    data: any;
  }>({
    isOpen: false,
    type: 'corporate_quotation',
    data: null
  });

  // Category Modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    icon: 'BookOpen',
    order: 1
  });

  useEffect(() => {
    loadAllTrainingData();
  }, []);

  const loadAllTrainingData = async () => {
    try {
      setLoading(true);
      const [coursesRes, catsRes, corpRes, enrRes] = await Promise.all([
        fetch('/api/short-courses'),
        fetch('/api/short-course-categories'),
        fetch('/api/corporate-requests'),
        fetch('/api/short-course-enrollments')
      ]);

      const [coursesData, catsData, corpData, enrData] = await Promise.all([
        coursesRes.json(),
        catsRes.json(),
        corpRes.json(),
        enrRes.json()
      ]);

      if (coursesData.success) setCourses(coursesData.shortCourses || []);
      if (catsData.success) setCategories(catsData.categories || []);
      if (corpData.success) setCorporateRequests(corpData.requests || []);
      if (enrData.success) setEnrollments(enrData.enrollments || []);
    } catch (err) {
      console.error('Error loading training data:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- Course Operations ---
  const handleOpenCourseModal = (course?: ShortCourse) => {
    setCourseModalTab('overview');
    if (course) {
      setEditingCourse(course);
      setCourseFormData({
        ...course,
        feeNGN: course.feeNGN !== undefined ? course.feeNGN : (course.feeGHS || 70000),
        internationalOnlineFee: course.internationalOnlineFee || 100,
        durationWeeks: course.durationWeeks || 8,
        durationHours: course.durationHours || 64,
        deliveryModes: course.deliveryModes || ['Physical (Weekday)', 'Physical (Weekend)', 'Online (Live Evening)', 'Online (Self-Paced)'],
        whoCanEnroll: course.whoCanEnroll || ['Beginners with no prior experience', 'Working professionals upskilling', 'Students & Graduates'],
        toolsCovered: course.toolsCovered || [],
        finalProject: course.finalProject || 'Comprehensive Capstone Portfolio Project',
        modules: course.modules && course.modules.length > 0 ? course.modules : (
          course.syllabus ? course.syllabus.map((s, idx) => ({
            id: `mod-${idx + 1}`,
            moduleNumber: s.week || idx + 1,
            title: s.title,
            topics: s.topics || [],
            duration: 'Week ' + (s.week || idx + 1),
            practicalAssignment: 'Hands-on practical exercise and project work'
          })) : []
        ),
        completionRules: course.completionRules || {
          minAttendancePercent: 80,
          minAssignmentScorePercent: 65,
          finalProjectRequired: true,
          passGradePercent: 60
        },
        certificateDetails: course.certificateDetails || {
          type: 'Certificate of Completion',
          issuingAuthority: 'AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE (AITI)',
          format: 'Digital Verifiable Certificate with QR Code + Hardcopy at Graduation',
          verifiability: 'Globally Verifiable at verify.aiti.edu.ng'
        }
      });
    } else {
      setEditingCourse(null);
      const defaultCat = categories[0];
      setCourseFormData({
        title: '',
        code: `AITI-SC-${(courses.length + 1).toString().padStart(3, '0')}`,
        categoryId: defaultCat?.id || 'scc-1',
        categoryName: defaultCat?.name || 'ICT & Computer Fundamentals',
        description: '',
        durationWeeks: 8,
        durationHours: 64,
        feeNGN: 70000,
        feeGHS: 70000,
        internationalOnlineFee: 100,
        deliveryMode: 'hybrid',
        deliveryModes: ['Physical (Weekday)', 'Physical (Weekend)', 'Online (Live Evening)', 'Online (Self-Paced)'],
        location: 'AITI Campus, Tanke, Ilorin, Nigeria / Online',
        instructorName: 'AITI Certified Faculty Lead',
        instructorTitle: 'Senior Technical Instructor',
        instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        prerequisites: 'Basic computer literacy and enthusiasm to learn.',
        targetAudience: 'Students, graduates, working professionals, and entrepreneurs.',
        whoCanEnroll: ['Beginners with no prior experience', 'Working professionals upskilling', 'Students & Graduates'],
        toolsCovered: [],
        finalProject: 'Comprehensive Capstone Portfolio Project',
        upcomingBatches: ['Next Cohort Starts 1st of Next Month', 'Weekend Immersion Batch'],
        active: true,
        featured: false,
        modules: [
          {
            id: 'mod-1',
            moduleNumber: 1,
            title: 'Foundations & Architecture',
            topics: ['Core concepts', 'Environment setup', 'Essential workflows'],
            duration: 'Week 1-2',
            practicalAssignment: 'Initial Setup & Lab Exercise 1'
          },
          {
            id: 'mod-2',
            moduleNumber: 2,
            title: 'Intermediate Implementation & Tools',
            topics: ['Tool mastery', 'Applied best practices', 'Intermediate projects'],
            duration: 'Week 3-4',
            practicalAssignment: 'Intermediate Lab Build'
          },
          {
            id: 'mod-3',
            moduleNumber: 3,
            title: 'Advanced Operations & Real Scenarios',
            topics: ['Advanced features', 'Troubleshooting & optimization', 'Integration'],
            duration: 'Week 5-6',
            practicalAssignment: 'Full Integration Project'
          },
          {
            id: 'mod-4',
            moduleNumber: 4,
            title: 'Capstone Project & Certification Portfolio',
            topics: ['Capstone design', 'Live deployment / presentation', 'Assessment'],
            duration: 'Week 7-8',
            practicalAssignment: 'Final Capstone Project Defense'
          }
        ],
        completionRules: {
          minAttendancePercent: 80,
          minAssignmentScorePercent: 65,
          finalProjectRequired: true,
          passGradePercent: 60
        },
        certificateDetails: {
          type: 'Certificate of Completion',
          issuingAuthority: 'AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE (AITI)',
          format: 'Digital Verifiable Certificate with QR Code + Hardcopy at Graduation',
          verifiability: 'Globally Verifiable at verify.aiti.edu.ng'
        }
      });
    }
    setIsCourseModalOpen(true);
  };

  const handleAddModule = () => {
    const nextNum = (courseFormData.modules?.length || 0) + 1;
    const newMod: ShortCourseModuleItem = {
      id: `mod-${Date.now()}`,
      moduleNumber: nextNum,
      title: `Module ${nextNum}: New Topic Focus`,
      duration: `Week ${nextNum}`,
      topics: ['Topic Overview', 'Hands-on Practice'],
      practicalAssignment: 'Module practical project submission'
    };
    setCourseFormData({
      ...courseFormData,
      modules: [...(courseFormData.modules || []), newMod]
    });
  };

  const handleUpdateModule = (index: number, updated: Partial<ShortCourseModuleItem>) => {
    const list = [...(courseFormData.modules || [])];
    if (list[index]) {
      list[index] = { ...list[index], ...updated };
      setCourseFormData({ ...courseFormData, modules: list });
    }
  };

  const handleRemoveModule = (index: number) => {
    const list = [...(courseFormData.modules || [])].filter((_, i) => i !== index);
    setCourseFormData({ ...courseFormData, modules: list });
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedCat = categories.find(c => c.id === courseFormData.categoryId);
      const payload = {
        ...courseFormData,
        categoryName: selectedCat ? selectedCat.name : courseFormData.categoryName
      };

      if (editingCourse) {
        const res = await fetch(`/api/short-courses/${editingCourse.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          setCourses(prev => prev.map(c => c.id === editingCourse.id ? data.shortCourse : c));
        }
      } else {
        const res = await fetch('/api/short-courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          setCourses(prev => [data.shortCourse, ...prev]);
        }
      }
      setIsCourseModalOpen(false);
    } catch (err: any) {
      alert('Error saving course: ' + err.message);
    }
  };

  const handleDeleteCourse = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove course "${title}"?`)) return;
    try {
      const res = await fetch(`/api/short-courses/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCourses(prev => prev.filter(c => c.id !== id));
      }
    } catch (err: any) {
      alert('Error deleting course: ' + err.message);
    }
  };

  // --- Corporate Operations ---
  const handleOpenCorporateDetail = (req: CorporateTrainingRequest, defaultTab: 'overview' | 'quotation' | 'invoice' | 'roster' | 'schedule' | 'notes' = 'overview') => {
    setSelectedCorporateRequest(req);
    setCorporateModalTab(defaultTab);
    
    // Calculate total from items
    const baseItems = [
      { description: `Tailored Executive Curriculum & Lab Manual (${req.selectedTopics?.join(', ') || 'Custom IT Tracks'})`, quantity: 1, unitPrice: 4500, total: 4500 },
      { description: `Senior Instructor Facilitation (${req.estimatedParticipants || 10} Participants)`, quantity: 1, unitPrice: (req.quotationAmountGHS || 8500) - 4500 - ((req.estimatedParticipants || 10) * 100), total: (req.quotationAmountGHS || 8500) - 4500 - ((req.estimatedParticipants || 10) * 100) },
      { description: 'AITI Executive Digital Certification & Verifiable Badges', quantity: req.estimatedParticipants || 10, unitPrice: 100, total: (req.estimatedParticipants || 10) * 100 }
    ];

    setCorporateUpdateForm(prev => ({
      ...prev,
      status: (req.status as any) || 'NEW',
      assignedTrainer: req.assignedTrainer || 'Senior Faculty Evans Adjei',
      assignedOfficer: 'Corporate Training Directorate (AITI Sunyani)',
      quotationAmountGHS: req.quotationAmountGHS || 12500,
      trainingVenue: req.trainingFormat === 'On-Premise (Company Office)' ? `${req.companyName} Headquarters / Training Room` : 'AITI Tech Labs, Sunyani Campus',
      startDate: '2026-06-15',
      endDate: '2026-06-26',
      durationHours: 36,
      internalNotes: req.internalNotes || `Initial inquiry received on ${new Date(req.createdAt || Date.now()).toLocaleDateString()}. Client requested ${req.trainingFormat} training for ${req.estimatedParticipants} staff members.`,
      quotationItems: baseItems,
      quotationDiscount: 0,
      quotationValidUntil: '2026-07-31',
      invoiceNumber: `AITI/INV/CORP/2026/${(req.id || '001').slice(-3).padStart(5, '0')}`,
      amountPaidGHS: req.status === 'PAID' ? (req.quotationAmountGHS || 12500) : req.status === 'APPROVED' ? 5000 : 0,
      paymentStatus: req.status === 'PAID' ? 'FULLY_PAID' : req.status === 'APPROVED' ? 'DEPOSIT_PAID' : 'UNPAID'
    }));
  };

  const handleUpdateCorporateRequest = async () => {
    if (!selectedCorporateRequest) return;
    try {
      const res = await fetch(`/api/corporate-requests/${selectedCorporateRequest.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: corporateUpdateForm.status,
          assignedTrainer: corporateUpdateForm.assignedTrainer,
          quotationAmountGHS: Number(corporateUpdateForm.quotationAmountGHS),
          internalNotes: corporateUpdateForm.internalNotes
        })
      });
      const data = await res.json();
      if (data.success) {
        setCorporateRequests(prev => prev.map(r => r.id === selectedCorporateRequest.id ? { ...r, ...data.request, status: corporateUpdateForm.status, quotationAmountGHS: Number(corporateUpdateForm.quotationAmountGHS), assignedTrainer: corporateUpdateForm.assignedTrainer, internalNotes: corporateUpdateForm.internalNotes } : r));
        alert('Corporate record updated successfully!');
      }
    } catch (err: any) {
      alert('Error updating corporate request: ' + err.message);
    }
  };

  const handleGenerateQuotation = () => {
    if (!selectedCorporateRequest) return;
    const subtotal = corporateUpdateForm.quotationItems.reduce((sum, item) => sum + item.total, 0);
    const total = Math.max(0, subtotal - corporateUpdateForm.quotationDiscount);

    setDocumentModal({
      isOpen: true,
      type: 'corporate_quotation',
      data: {
        quotationNumber: `AITI/QUO/2026/${selectedCorporateRequest.id?.slice(-3).padStart(5, '0') || '00021'}`,
        companyName: selectedCorporateRequest.companyName,
        contactPerson: selectedCorporateRequest.contactPerson,
        email: selectedCorporateRequest.email,
        phone: selectedCorporateRequest.phone,
        trainingTitle: selectedCorporateRequest.selectedTopics?.join(' & ') || selectedCorporateRequest.trainingNeeds || 'Executive Corporate IT Masterclass',
        format: selectedCorporateRequest.trainingFormat || 'Hybrid / On-Premise',
        estimatedParticipants: selectedCorporateRequest.estimatedParticipants || 15,
        items: corporateUpdateForm.quotationItems,
        subtotal: subtotal,
        discount: corporateUpdateForm.quotationDiscount,
        total: total,
        validUntil: corporateUpdateForm.quotationValidUntil
      }
    });
  };

  const handleConvertToInvoice = () => {
    if (!selectedCorporateRequest) return;
    const subtotal = corporateUpdateForm.quotationItems.reduce((sum, item) => sum + item.total, 0);
    const total = Math.max(0, subtotal - corporateUpdateForm.quotationDiscount);

    setDocumentModal({
      isOpen: true,
      type: 'corporate_invoice',
      data: {
        invoiceNumber: corporateUpdateForm.invoiceNumber,
        companyName: selectedCorporateRequest.companyName,
        contactPerson: selectedCorporateRequest.contactPerson,
        email: selectedCorporateRequest.email,
        phone: selectedCorporateRequest.phone,
        trainingTitle: selectedCorporateRequest.selectedTopics?.join(' & ') || 'Enterprise Technology Training',
        items: corporateUpdateForm.quotationItems,
        totalAmount: total,
        amountPaid: corporateUpdateForm.amountPaidGHS,
        balanceDue: Math.max(0, total - corporateUpdateForm.amountPaidGHS),
        paymentStatus: corporateUpdateForm.paymentStatus,
        dueDate: '2026-06-30'
      }
    });
  };

  const handleAddParticipant = () => {
    if (!corporateUpdateForm.newParticipant.name) {
      alert('Please enter participant name');
      return;
    }
    setCorporateUpdateForm(prev => ({
      ...prev,
      participantsList: [
        ...prev.participantsList,
        { ...prev.newParticipant }
      ],
      newParticipant: { name: '', email: '', role: '', attendance: 100, grade: 'Distinction' }
    }));
  };

  const handleGenerateCorporateCertificates = (participant: any) => {
    if (!selectedCorporateRequest) return;
    setDocumentModal({
      isOpen: true,
      type: 'short_course_certificate',
      data: {
        certificateNumber: `AITI/CERT/CORP/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
        studentName: participant.name,
        courseTitle: selectedCorporateRequest.selectedTopics?.join(' & ') || 'Executive Corporate IT & AI Mastery',
        categoryName: 'Corporate & Organizational Training',
        durationHours: corporateUpdateForm.durationHours || 36,
        completionDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        instructorName: corporateUpdateForm.assignedTrainer || 'Senior Faculty Evans Adjei',
        instructorTitle: 'Lead Corporate Training Facilitator',
        verificationCode: `VER-CORP-${Math.floor(100000 + Math.random() * 900000)}`,
        specialization: `${selectedCorporateRequest.companyName} Tailored Cohort`
      }
    });
  };

  // --- Enrollment Operations ---
  const handleUpdateEnrollmentStatus = async (id: string, updates: Partial<ShortCourseEnrollment>) => {
    try {
      const res = await fetch(`/api/short-course-enrollments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success) {
        setEnrollments(prev => prev.map(e => e.id === id ? data.enrollment : e));
      }
    } catch (err: any) {
      alert('Error updating enrollment: ' + err.message);
    }
  };

  // Filtered lists
  const filteredCourses = courses.filter(c => 
    !searchTerm || 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCorporate = corporateRequests.filter(r => {
    const matchesStatus = corporateStatusFilter === 'all' || r.status === corporateStatusFilter;
    const matchesSearch = !searchTerm ||
      r.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.requestNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div id="admin-training-management" className="space-y-6">
      
      {/* Top Header & Metrics Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800">
                AITI Administrative Control
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              Training Catalogue & Corporate Management
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage short courses, categories, enterprise training requests, and student enrollments.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800 text-center">
              <span className="text-lg font-black text-cyan-400 font-mono">{courses.length}</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Short Courses</span>
            </div>
            <div className="bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800 text-center">
              <span className="text-lg font-black text-purple-400 font-mono">{corporateRequests.length}</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Corp Proposals</span>
            </div>
            <div className="bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800 text-center">
              <span className="text-lg font-black text-emerald-400 font-mono">{enrollments.length}</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Enrollments</span>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800 overflow-x-auto">
          {[
            { id: 'courses', label: 'Short-Term Courses', icon: BookOpen, count: courses.length },
            { id: 'corporate', label: 'Corporate Training Requests', icon: Building2, count: corporateRequests.filter(r => r.status === 'pending').length, alert: true },
            { id: 'enrollments', label: 'Short Course Enrollments', icon: Users, count: enrollments.length },
            { id: 'categories', label: 'Course Categories', icon: Layers, count: categories.length },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                id={`admin-training-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === tab.id
                      ? 'bg-slate-950 text-cyan-300'
                      : tab.alert ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: SHORT-TERM COURSES */}
      {activeTab === 'courses' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="search-admin-courses"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search short courses..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              id="add-short-course-btn"
              onClick={() => handleOpenCourseModal()}
              className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Short Course</span>
            </button>
          </div>

          {/* Courses Table */}
          <div className="overflow-x-auto border border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Course Info</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Duration & Modules</th>
                  <th className="p-3.5">Tuition (Local & Int'l)</th>
                  <th className="p-3.5">Delivery Modes</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/60">
                {filteredCourses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={c.bannerImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=300&q=80'}
                          alt={c.title}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-xl object-cover border border-slate-700 shadow-sm"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white block">{c.title}</span>
                            {c.featured && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[10px] text-cyan-400 font-semibold">{c.code}</span>
                            <span className="text-slate-500 text-[10px]">• {c.instructorName || 'AITI Faculty'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-950 text-slate-300 border border-slate-800 inline-block">
                        {c.categoryName}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="space-y-1">
                        <span className="font-semibold text-slate-200 block">{c.durationWeeks || 8} Weeks ({c.durationHours || 64}h)</span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded-full font-mono">
                          <Layers className="w-2.5 h-2.5" />
                          {(c.modules?.length || c.syllabus?.length || 0)} Modules
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono">
                      <div className="space-y-0.5">
                        <div className="text-emerald-400 font-bold text-[13px]">
                          ₦{(c.feeNGN || c.feeGHS || 70000).toLocaleString()}
                        </div>
                        <div className="text-slate-400 text-[10px] flex items-center gap-1">
                          <Globe className="w-2.5 h-2.5 text-sky-400" />
                          <span>${c.internationalOnlineFee || 100} USD (Int'l)</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1 max-w-[160px]">
                        <span className="capitalize text-slate-300 text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                          {c.deliveryMode || 'Hybrid'}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        c.active ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {c.active ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          id={`edit-course-${c.id}`}
                          onClick={() => handleOpenCourseModal(c)}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl transition-colors"
                          title="Edit Course"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`delete-course-${c.id}`}
                          onClick={() => handleDeleteCourse(c.id, c.title)}
                          className="p-2 bg-slate-800 hover:bg-rose-900/60 text-rose-400 rounded-xl transition-colors"
                          title="Delete Course"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CORPORATE TRAINING REQUESTS */}
      {activeTab === 'corporate' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-400" />
                <span>Corporate & Organizational Training CRM</span>
              </h3>
              <p className="text-xs text-slate-400">
                Enterprise pipeline, quotation engine, invoices, participant roster & certificate issuance.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="search-corporate-reqs"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search organization, person or ref..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Status Filter */}
              <select
                id="filter-corp-status"
                value={corporateStatusFilter}
                onChange={(e) => setCorporateStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All CRM Stages</option>
                <option value="NEW">New Inquiries</option>
                <option value="CONTACTED">Contacted</option>
                <option value="REQUIREMENTS_RECEIVED">Requirements Received</option>
                <option value="PROPOSAL_SENT">Proposal / Quote Sent</option>
                <option value="NEGOTIATION">Negotiation</option>
                <option value="APPROVED">Approved / Confirmed</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="TRAINING_IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="INVOICED">Invoiced</option>
                <option value="PAID">Paid / Settled</option>
                <option value="CLOSED">Closed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Corporate Requests List */}
          <div className="space-y-3">
            {filteredCorporate.length === 0 ? (
              <div className="py-12 text-center text-slate-500 bg-slate-950 rounded-2xl border border-slate-800">
                <Building2 className="w-10 h-10 mx-auto mb-2 opacity-50 text-cyan-400" />
                <p className="text-xs">No corporate training requests match your filter.</p>
              </div>
            ) : (
              filteredCorporate.map((req) => {
                const statusColor = 
                  req.status === 'NEW' || req.status === 'pending' ? 'bg-amber-950/80 text-amber-300 border-amber-800' :
                  req.status === 'PROPOSAL_SENT' || req.status === 'quoted' ? 'bg-sky-950/80 text-sky-300 border-sky-800' :
                  req.status === 'APPROVED' || req.status === 'approved' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800' :
                  req.status === 'PAID' || req.status === 'COMPLETED' ? 'bg-purple-950/80 text-purple-300 border-purple-800' :
                  'bg-slate-800 text-slate-300 border-slate-700';

                return (
                  <div 
                    key={req.id}
                    id={`corp-req-card-${req.id}`}
                    className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800">
                          {req.requestNumber}
                        </span>
                        <h4 className="text-base font-bold text-white">{req.companyName}</h4>
                        <span className="text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {req.industry || 'Enterprise'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-cyan-400" />
                          <strong>{req.estimatedParticipants}</strong> Staff
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                          {req.trainingFormat}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {req.contactPerson} ({req.phone})
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {req.email}
                        </span>
                      </div>

                      {req.selectedTopics && req.selectedTopics.length > 0 && (
                        <div className="text-[11px] text-slate-400">
                          <strong className="text-slate-300">Selected Topics:</strong> {req.selectedTopics.join(', ')}
                        </div>
                      )}
                    </div>

                    {/* Status & CRM Controls */}
                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-between lg:justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${statusColor}`}>
                        {req.status?.replace(/_/g, ' ')}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          id={`manage-corp-req-${req.id}`}
                          onClick={() => handleOpenCorporateDetail(req, 'overview')}
                          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-700"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>CRM Suite</span>
                        </button>
                        <button
                          id={`quote-corp-req-${req.id}`}
                          onClick={() => handleOpenCorporateDetail(req, 'quotation')}
                          className="px-3.5 py-1.5 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-cyan-800"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Quote</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SHORT COURSE ENROLLMENTS */}
      {activeTab === 'enrollments' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="overflow-x-auto border border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Enrollment Ref</th>
                  <th className="p-3.5">Student Name</th>
                  <th className="p-3.5">Course</th>
                  <th className="p-3.5">Batch</th>
                  <th className="p-3.5">Fee (GHS)</th>
                  <th className="p-3.5">Payment</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/60">
                {enrollments.map((enr) => (
                  <tr key={enr.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-3.5 font-mono text-cyan-400 font-bold">
                      {enr.enrollmentNumber}
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-white block">{enr.fullName}</span>
                      <span className="text-[10px] text-slate-400">{enr.phone} • {enr.email}</span>
                    </td>
                    <td className="p-3.5 font-medium text-slate-200">
                      {enr.courseTitle}
                    </td>
                    <td className="p-3.5 text-slate-400">
                      {enr.batchDate}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-emerald-400">
                      GHS {enr.feeGHS?.toLocaleString()}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        enr.paymentStatus === 'paid' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        enr.paymentStatus === 'partial' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {enr.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="capitalize text-slate-300 text-[11px] font-medium">
                        {enr.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleUpdateEnrollmentStatus(enr.id, { paymentStatus: enr.paymentStatus === 'paid' ? 'pending' : 'paid' })}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-[11px] font-semibold transition-colors"
                      >
                        {enr.paymentStatus === 'paid' ? 'Mark Pending' : 'Mark as Paid'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Short Course Categories</h3>
            <button
              id="add-cat-btn"
              onClick={() => setIsCategoryModalOpen(true)}
              className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{cat.name}</span>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                    Order: {cat.order}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{cat.description}</p>
                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800 flex justify-between">
                  <span>Courses: {courses.filter(c => c.categoryId === cat.id).length}</span>
                  <span className="text-emerald-400 font-semibold">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE/EDIT SHORT COURSE MODAL */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  <span>{editingCourse ? `Edit: ${courseFormData.title || 'Course'}` : 'Create Master Short Course'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure curriculum modules, local ₦ & international $ pricing, delivery modes, and certification rules.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCourseModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Sub-Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 gap-2 overflow-x-auto">
              {[
                { id: 'overview', label: '1. Overview & Audience' },
                { id: 'pricing', label: '2. Fees & Schedules' },
                { id: 'modules', label: `3. Curriculum Modules (${courseFormData.modules?.length || 0})` },
                { id: 'rules', label: '4. Completion Rules' },
                { id: 'instructor', label: '5. Instructor & Visibility' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCourseModalTab(tab.id as any)}
                  className={`py-3 px-3.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all flex items-center gap-1.5 ${
                    courseModalTab === tab.id
                      ? 'border-cyan-400 text-cyan-300'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveCourse} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: OVERVIEW */}
              {courseModalTab === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-slate-300 font-semibold mb-1">Course Title *</label>
                      <input
                        id="modal-course-title"
                        type="text"
                        required
                        value={courseFormData.title}
                        onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
                        placeholder="e.g. Data Analytics & Business Intelligence"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 font-semibold mb-1">Course Code *</label>
                      <input
                        id="modal-course-code"
                        type="text"
                        required
                        value={courseFormData.code}
                        onChange={(e) => setCourseFormData({ ...courseFormData, code: e.target.value })}
                        placeholder="AITI-SC-001"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500 font-bold text-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-300 font-semibold mb-1">Category</label>
                      <select
                        id="modal-course-cat"
                        value={courseFormData.categoryId}
                        onChange={(e) => setCourseFormData({ ...courseFormData, categoryId: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 font-semibold mb-1">Banner Image URL</label>
                      <input
                        type="url"
                        value={courseFormData.bannerImage || ''}
                        onChange={(e) => setCourseFormData({ ...courseFormData, bannerImage: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 font-semibold mb-1">Comprehensive Course Description *</label>
                    <textarea
                      id="modal-course-desc"
                      rows={3}
                      required
                      value={courseFormData.description}
                      onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
                      placeholder="Detailed overview describing the course scope, hands-on lab approach, and real-world utility..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-300 font-semibold mb-1">Prerequisites</label>
                      <input
                        type="text"
                        value={courseFormData.prerequisites || ''}
                        onChange={(e) => setCourseFormData({ ...courseFormData, prerequisites: e.target.value })}
                        placeholder="e.g. Basic computer literacy. No coding experience required."
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 font-semibold mb-1">Target Audience</label>
                      <input
                        type="text"
                        value={courseFormData.targetAudience || ''}
                        onChange={(e) => setCourseFormData({ ...courseFormData, targetAudience: e.target.value })}
                        placeholder="e.g. Beginners, students, graduates, working professionals."
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-300 font-semibold mb-1">
                        Tools & Technologies Covered (comma separated)
                      </label>
                      <input
                        type="text"
                        value={(courseFormData.toolsCovered || []).join(', ')}
                        onChange={(e) => setCourseFormData({
                          ...courseFormData,
                          toolsCovered: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                        })}
                        placeholder="e.g. Python, SQL, Power BI, Excel, Tableau"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 font-semibold mb-1">Final Capstone Project</label>
                      <input
                        type="text"
                        value={courseFormData.finalProject || ''}
                        onChange={(e) => setCourseFormData({ ...courseFormData, finalProject: e.target.value })}
                        placeholder="e.g. Production-grade full stack web application / End-to-end dashboard"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: FEES & SCHEDULES */}
              {courseModalTab === 'pricing' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                    <div>
                      <label className="block text-xs text-emerald-400 font-bold mb-1 flex items-center gap-1.5">
                        <span>Local Nigerian Naira Fee (₦) *</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-emerald-400">₦</span>
                        <input
                          id="modal-course-fee-ngn"
                          type="number"
                          required
                          value={courseFormData.feeNGN !== undefined ? courseFormData.feeNGN : (courseFormData.feeGHS || 70000)}
                          onChange={(e) => setCourseFormData({ 
                            ...courseFormData, 
                            feeNGN: Number(e.target.value),
                            feeGHS: Number(e.target.value)
                          })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-slate-100 font-mono font-bold text-emerald-400 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">Default initial tuition: ₦70,000</span>
                    </div>

                    <div>
                      <label className="block text-xs text-sky-400 font-bold mb-1 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5" />
                        <span>International Online Fee ($ USD) *</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-sky-400">$</span>
                        <input
                          id="modal-course-fee-usd"
                          type="number"
                          required
                          value={courseFormData.internationalOnlineFee || 100}
                          onChange={(e) => setCourseFormData({ ...courseFormData, internationalOnlineFee: Number(e.target.value) })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-slate-100 font-mono font-bold text-sky-400 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">Independent USD pricing for international enrollments</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-300 font-semibold mb-1">Standard Duration (Weeks)</label>
                      <input
                        id="modal-course-weeks"
                        type="number"
                        min="1"
                        max="24"
                        value={courseFormData.durationWeeks || 8}
                        onChange={(e) => setCourseFormData({ ...courseFormData, durationWeeks: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 font-semibold mb-1">Total Practical Hours</label>
                      <input
                        type="number"
                        min="10"
                        max="300"
                        value={courseFormData.durationHours || 64}
                        onChange={(e) => setCourseFormData({ ...courseFormData, durationHours: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 font-semibold mb-2">Available Delivery Formats</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {[
                        'Physical (Weekday Morning / Afternoon)',
                        'Physical (Weekend Immersion)',
                        'Online (Evening Live Facilitated)',
                        'Online (Self-Paced / Flexible Access)'
                      ].map((modeStr) => {
                        const isChecked = (courseFormData.deliveryModes || []).includes(modeStr);
                        return (
                          <label key={modeStr} className="flex items-center gap-2 p-2.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const current = courseFormData.deliveryModes || [];
                                const updated = e.target.checked
                                  ? [...current, modeStr]
                                  : current.filter(m => m !== modeStr);
                                setCourseFormData({ ...courseFormData, deliveryModes: updated });
                              }}
                              className="rounded bg-slate-900 border-slate-700 text-cyan-500"
                            />
                            <span className="text-slate-200">{modeStr}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 font-semibold mb-1">Physical Location / Campus</label>
                    <input
                      type="text"
                      value={courseFormData.location || 'AITI Campus, Tanke, Ilorin, Kwara State, Nigeria / Online'}
                      onChange={(e) => setCourseFormData({ ...courseFormData, location: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: CURRICULUM MODULES */}
              {courseModalTab === 'modules' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div>
                      <h4 className="text-sm font-bold text-white">Course Syllabus & Weekly Modules</h4>
                      <p className="text-[11px] text-slate-400">Structured modular curriculum with hands-on lab exercises and deliverables.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddModule}
                      className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Module</span>
                    </button>
                  </div>

                  {(!courseFormData.modules || courseFormData.modules.length === 0) ? (
                    <div className="text-center py-8 bg-slate-950/40 border border-dashed border-slate-800 rounded-2xl space-y-2">
                      <Layers className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-400">No custom modules created yet.</p>
                      <button
                        type="button"
                        onClick={handleAddModule}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-bold"
                      >
                        Create First Module
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {courseFormData.modules.map((mod, idx) => (
                        <div key={mod.id || idx} className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="px-2 py-1 rounded bg-cyan-950 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-800">
                                Module {mod.moduleNumber || idx + 1}
                              </span>
                              <input
                                type="text"
                                value={mod.title}
                                onChange={(e) => handleUpdateModule(idx, { title: e.target.value })}
                                placeholder="Module Title..."
                                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-bold focus:outline-none focus:border-cyan-500"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={mod.duration || `Week ${idx + 1}`}
                                onChange={(e) => handleUpdateModule(idx, { duration: e.target.value })}
                                placeholder="e.g. Week 1-2"
                                className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveModule(idx)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-400 transition-colors"
                                title="Remove Module"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <label className="block text-[11px] text-slate-400 font-medium mb-1">
                                Topics & Lessons (comma separated)
                              </label>
                              <input
                                type="text"
                                value={(mod.topics || []).join(', ')}
                                onChange={(e) => handleUpdateModule(idx, {
                                  topics: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                                })}
                                placeholder="e.g. Python Syntax, Variables, Control Flow, Data Structures"
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-slate-400 font-medium mb-1">
                                Weekly Practical Lab / Assignment
                              </label>
                              <input
                                type="text"
                                value={mod.practicalAssignment || mod.assignment || ''}
                                onChange={(e) => handleUpdateModule(idx, { practicalAssignment: e.target.value })}
                                placeholder="e.g. Build an automated data scraper and save output to CSV"
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: COMPLETION RULES */}
              {courseModalTab === 'rules' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-4">
                    <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Certification Eligibility Requirements</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Minimum Class Attendance Required (%)</label>
                        <input
                          type="number"
                          min="50"
                          max="100"
                          value={courseFormData.completionRules?.minAttendancePercent || 80}
                          onChange={(e) => setCourseFormData({
                            ...courseFormData,
                            completionRules: {
                              ...courseFormData.completionRules,
                              minAttendancePercent: Number(e.target.value),
                              minAssignmentScorePercent: courseFormData.completionRules?.minAssignmentScorePercent || 65,
                              finalProjectRequired: courseFormData.completionRules?.finalProjectRequired ?? true,
                              passGradePercent: courseFormData.completionRules?.passGradePercent || 60
                            }
                          })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Minimum Lab / Assignment Score (%)</label>
                        <input
                          type="number"
                          min="40"
                          max="100"
                          value={courseFormData.completionRules?.minAssignmentScorePercent || 65}
                          onChange={(e) => setCourseFormData({
                            ...courseFormData,
                            completionRules: {
                              ...courseFormData.completionRules,
                              minAttendancePercent: courseFormData.completionRules?.minAttendancePercent || 80,
                              minAssignmentScorePercent: Number(e.target.value),
                              finalProjectRequired: courseFormData.completionRules?.finalProjectRequired ?? true,
                              passGradePercent: courseFormData.completionRules?.passGradePercent || 60
                            }
                          })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Overall Course Pass Mark (%)</label>
                        <input
                          type="number"
                          min="40"
                          max="100"
                          value={courseFormData.completionRules?.passGradePercent || 60}
                          onChange={(e) => setCourseFormData({
                            ...courseFormData,
                            completionRules: {
                              ...courseFormData.completionRules,
                              minAttendancePercent: courseFormData.completionRules?.minAttendancePercent || 80,
                              minAssignmentScorePercent: courseFormData.completionRules?.minAssignmentScorePercent || 65,
                              finalProjectRequired: courseFormData.completionRules?.finalProjectRequired ?? true,
                              passGradePercent: Number(e.target.value)
                            }
                          })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div className="flex items-center pt-5">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={courseFormData.completionRules?.finalProjectRequired ?? true}
                            onChange={(e) => setCourseFormData({
                              ...courseFormData,
                              completionRules: {
                                ...courseFormData.completionRules,
                                minAttendancePercent: courseFormData.completionRules?.minAttendancePercent || 80,
                                minAssignmentScorePercent: courseFormData.completionRules?.minAssignmentScorePercent || 65,
                                finalProjectRequired: e.target.checked,
                                passGradePercent: courseFormData.completionRules?.passGradePercent || 60
                              }
                            })}
                            className="rounded bg-slate-900 border-slate-700 text-cyan-500"
                          />
                          <span className="text-slate-200 font-semibold">Final Capstone Project Defense Required</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Official Certificate Nomenclature</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Award Title</label>
                        <input
                          type="text"
                          value={courseFormData.certificateDetails?.type || 'Certificate of Completion'}
                          onChange={(e) => setCourseFormData({
                            ...courseFormData,
                            certificateDetails: {
                              ...courseFormData.certificateDetails,
                              type: e.target.value,
                              issuingAuthority: courseFormData.certificateDetails?.issuingAuthority || 'AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE (AITI)',
                              format: courseFormData.certificateDetails?.format || 'Digital Verifiable Certificate with QR Code + Hardcopy at Graduation',
                              verifiability: courseFormData.certificateDetails?.verifiability || 'Globally Verifiable at verify.aiti.edu.ng'
                            }
                          })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Issuing Authority</label>
                        <input
                          type="text"
                          value={courseFormData.certificateDetails?.issuingAuthority || 'AFTATECH INFORMATION TECHNOLOGICAL INSTITUTE (AITI)'}
                          onChange={(e) => setCourseFormData({
                            ...courseFormData,
                            certificateDetails: {
                              ...courseFormData.certificateDetails,
                              type: courseFormData.certificateDetails?.type || 'Certificate of Completion',
                              issuingAuthority: e.target.value,
                              format: courseFormData.certificateDetails?.format || 'Digital Verifiable Certificate with QR Code + Hardcopy at Graduation',
                              verifiability: courseFormData.certificateDetails?.verifiability || 'Globally Verifiable at verify.aiti.edu.ng'
                            }
                          })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: INSTRUCTOR & VISIBILITY */}
              {courseModalTab === 'instructor' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Lead Instructor Name</label>
                      <input
                        type="text"
                        value={courseFormData.instructorName || ''}
                        onChange={(e) => setCourseFormData({ ...courseFormData, instructorName: e.target.value })}
                        placeholder="e.g. Engr. Oladimeji Adebayo"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Instructor Professional Title</label>
                      <input
                        type="text"
                        value={courseFormData.instructorTitle || ''}
                        onChange={(e) => setCourseFormData({ ...courseFormData, instructorTitle: e.target.value })}
                        placeholder="e.g. Principal Cloud & AI Solutions Architect"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="block text-slate-300 font-medium mb-1">Instructor Photo URL</label>
                    <input
                      type="url"
                      value={courseFormData.instructorAvatar || ''}
                      onChange={(e) => setCourseFormData({ ...courseFormData, instructorAvatar: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 bg-slate-950/60 rounded-2xl border border-slate-800 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={courseFormData.active}
                        onChange={(e) => setCourseFormData({ ...courseFormData, active: e.target.checked })}
                        className="rounded bg-slate-900 border-slate-700 text-cyan-500"
                      />
                      <span className="text-slate-200 font-bold">Published / Active for Student Enrollment</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={courseFormData.featured}
                        onChange={(e) => setCourseFormData({ ...courseFormData, featured: e.target.checked })}
                        className="rounded bg-slate-900 border-slate-700 text-cyan-500"
                      />
                      <span className="text-slate-200 font-bold">Featured on Home & Course Landing Pages</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="text-xs text-slate-500">
                  {editingCourse ? 'Modifying existing course database entry' : 'New course will be saved to database'}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCourseModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    id="save-short-course-btn"
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Course Changes</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CORPORATE CRM SUITE MODAL */}
      {selectedCorporateRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800">
                    {selectedCorporateRequest.requestNumber}
                  </span>
                  <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    Corporate Pipeline CRM
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white">
                  {selectedCorporateRequest.companyName}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-3 flex-wrap">
                  <span>Contact: <strong className="text-slate-200">{selectedCorporateRequest.contactPerson}</strong></span>
                  <span>•</span>
                  <span>Email: <strong className="text-slate-200">{selectedCorporateRequest.email}</strong></span>
                  <span>•</span>
                  <span>Phone: <strong className="text-slate-200">{selectedCorporateRequest.phone}</strong></span>
                </p>
              </div>
              <button
                onClick={() => setSelectedCorporateRequest(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Quick Communication:</span>
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${selectedCorporateRequest.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedCorporateRequest.contactPerson)},%20this%20is%20AITI%20Corporate%20Training%20Directorate%20regarding%20your%20training%20request%20${encodeURIComponent(selectedCorporateRequest.requestNumber)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded-xl text-xs font-bold border border-emerald-800 flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp HR</span>
                </a>
                <a
                  href={`tel:${selectedCorporateRequest.phone}`}
                  className="px-3 py-1.5 bg-sky-950 hover:bg-sky-900 text-sky-300 rounded-xl text-xs font-bold border border-sky-800 flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Organization</span>
                </a>
                <a
                  href={`mailto:${selectedCorporateRequest.email}?subject=AITI Corporate Training Proposal - ${encodeURIComponent(selectedCorporateRequest.companyName)}`}
                  className="px-3 py-1.5 bg-purple-950 hover:bg-purple-900 text-purple-300 rounded-xl text-xs font-bold border border-purple-800 flex items-center gap-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Official Proposal</span>
                </a>
              </div>
            </div>

            {/* Sub Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview & Requirements', icon: Building2 },
                { id: 'quotation', label: 'Quotation Engine', icon: FileText },
                { id: 'invoice', label: 'Invoices & Payments', icon: Receipt },
                { id: 'roster', label: 'Participant Roster & Certificates', icon: Award },
                { id: 'schedule', label: 'Schedule & Logistics', icon: Calendar },
                { id: 'notes', label: 'CRM Notes & History', icon: MessageSquare }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    id={`corp-modal-tab-${tab.id}`}
                    onClick={() => setCorporateModalTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      corporateModalTab === tab.id
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT: 1. OVERVIEW */}
            {corporateModalTab === 'overview' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Training Format</span>
                    <span className="text-white font-bold text-sm">{selectedCorporateRequest.trainingFormat}</span>
                    <span className="text-slate-500 block text-[11px]">Preferred Delivery Mode</span>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Staff Cohort Size</span>
                    <span className="text-cyan-400 font-bold text-sm">{selectedCorporateRequest.estimatedParticipants} Participants</span>
                    <span className="text-slate-500 block text-[11px]">Nominated employees</span>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Industry Sector</span>
                    <span className="text-emerald-400 font-bold text-sm">{selectedCorporateRequest.industry || 'Corporate Partner'}</span>
                    <span className="text-slate-500 block text-[11px]">Domain specialization</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
                  <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-cyan-400">
                    Client Requirements & Target Outcomes
                  </h4>
                  <div>
                    <span className="text-slate-400 block font-medium mb-1">Selected Technical Modules:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCorporateRequest.selectedTopics?.map((topic, i) => (
                        <span key={i} className="px-2.5 py-1 bg-cyan-950/70 text-cyan-300 rounded-lg text-xs border border-cyan-800">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedCorporateRequest.trainingNeeds && (
                    <div>
                      <span className="text-slate-400 block font-medium mb-1">Stated Needs:</span>
                      <p className="text-slate-200 bg-slate-900 p-3 rounded-xl border border-slate-800">
                        {selectedCorporateRequest.trainingNeeds}
                      </p>
                    </div>
                  )}

                  {selectedCorporateRequest.customRequirements && (
                    <div>
                      <span className="text-slate-400 block font-medium mb-1">Custom Organizational Directives:</span>
                      <p className="text-slate-200 bg-slate-900 p-3 rounded-xl border border-slate-800">
                        {selectedCorporateRequest.customRequirements}
                      </p>
                    </div>
                  )}
                </div>

                {/* Pipeline Stage Update */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider text-cyan-400">
                    CRM Pipeline Status & Assignment
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Pipeline Status</label>
                      <select
                        id="crm-status-dropdown"
                        value={corporateUpdateForm.status}
                        onChange={(e) => setCorporateUpdateForm({ ...corporateUpdateForm, status: e.target.value as any })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                      >
                        <option value="NEW">NEW - Inquiry Received</option>
                        <option value="CONTACTED">CONTACTED - Call / Email Made</option>
                        <option value="REQUIREMENTS_RECEIVED">REQUIREMENTS RECEIVED</option>
                        <option value="PROPOSAL_SENT">PROPOSAL SENT - Formal Quotation Delivered</option>
                        <option value="NEGOTIATION">NEGOTIATION - Reviewing Terms</option>
                        <option value="APPROVED">APPROVED - Contract Confirmed</option>
                        <option value="SCHEDULED">SCHEDULED - Dates Locked</option>
                        <option value="TRAINING_IN_PROGRESS">TRAINING IN PROGRESS</option>
                        <option value="COMPLETED">COMPLETED - Program Finished</option>
                        <option value="INVOICED">INVOICED - Billing Issued</option>
                        <option value="PAID">PAID - Payment Fully Settled</option>
                        <option value="CLOSED">CLOSED - Archived Cohort</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Assigned Lead Trainer</label>
                      <input
                        type="text"
                        value={corporateUpdateForm.assignedTrainer}
                        onChange={(e) => setCorporateUpdateForm({ ...corporateUpdateForm, assignedTrainer: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 2. QUOTATION ENGINE */}
            {corporateModalTab === 'quotation' && (
              <div className="space-y-5 animate-in fade-in duration-150 text-xs">
                <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div>
                    <span className="font-bold text-white text-sm block">Official Quotation Builder</span>
                    <span className="text-slate-400 text-[11px]">Generate formal pro-forma proposals with itemized breakdown</span>
                  </div>
                  <button
                    id="preview-quotation-doc-btn"
                    onClick={handleGenerateQuotation}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-extrabold rounded-xl flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View & Print Official Quotation</span>
                  </button>
                </div>

                {/* Line Items Table */}
                <div className="border border-slate-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="p-3">Deliverable Item</th>
                        <th className="p-3 w-20">Qty</th>
                        <th className="p-3 w-28">Unit (GHS)</th>
                        <th className="p-3 w-28 text-right">Total (GHS)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-900/70">
                      {corporateUpdateForm.quotationItems.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-3">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => {
                                const newItems = [...corporateUpdateForm.quotationItems];
                                newItems[idx].description = e.target.value;
                                setCorporateUpdateForm({ ...corporateUpdateForm, quotationItems: newItems });
                              }}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-100 focus:outline-none focus:border-cyan-500 text-xs"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const newItems = [...corporateUpdateForm.quotationItems];
                                newItems[idx].quantity = Number(e.target.value);
                                newItems[idx].total = newItems[idx].quantity * newItems[idx].unitPrice;
                                setCorporateUpdateForm({ ...corporateUpdateForm, quotationItems: newItems });
                              }}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-slate-100 text-center font-mono text-xs"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => {
                                const newItems = [...corporateUpdateForm.quotationItems];
                                newItems[idx].unitPrice = Number(e.target.value);
                                newItems[idx].total = newItems[idx].quantity * newItems[idx].unitPrice;
                                setCorporateUpdateForm({ ...corporateUpdateForm, quotationItems: newItems });
                              }}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-slate-100 font-mono text-xs"
                            />
                          </td>
                          <td className="p-3 font-mono font-bold text-emerald-400 text-right">
                            GHS {item.total.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Quotation Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="space-y-2">
                    <label className="block text-slate-300 font-medium">Discount / Corporate Subsidy (GHS)</label>
                    <input
                      type="number"
                      value={corporateUpdateForm.quotationDiscount}
                      onChange={(e) => setCorporateUpdateForm({ ...corporateUpdateForm, quotationDiscount: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
                    />
                    <span className="text-[11px] text-slate-500 block">Offer validity until: {corporateUpdateForm.quotationValidUntil}</span>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <div className="flex justify-between text-slate-400 text-xs">
                      <span>Subtotal:</span>
                      <span className="font-mono text-white">GHS {corporateUpdateForm.quotationItems.reduce((s, i) => s + i.total, 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-xs">
                      <span>Corporate Discount:</span>
                      <span className="font-mono text-rose-400">- GHS {corporateUpdateForm.quotationDiscount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-slate-800 mt-2">
                      <span>Net Proposal Quote:</span>
                      <span className="font-mono text-cyan-400">
                        GHS {Math.max(0, corporateUpdateForm.quotationItems.reduce((s, i) => s + i.total, 0) - corporateUpdateForm.quotationDiscount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 3. INVOICE & PAYMENTS */}
            {corporateModalTab === 'invoice' && (
              <div className="space-y-5 animate-in fade-in duration-150 text-xs">
                <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div>
                    <span className="font-bold text-white text-sm block">Billing & Payment Tracking</span>
                    <span className="text-slate-400 text-[11px]">Convert accepted quotes into official institutional invoices</span>
                  </div>
                  <button
                    id="preview-invoice-doc-btn"
                    onClick={handleConvertToInvoice}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    <Receipt className="w-4 h-4" />
                    <span>Generate Official Corporate Invoice</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Invoice Number</span>
                    <input
                      type="text"
                      value={corporateUpdateForm.invoiceNumber}
                      onChange={(e) => setCorporateUpdateForm({ ...corporateUpdateForm, invoiceNumber: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 mt-1 font-mono text-cyan-400 text-xs"
                    />
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Amount Settled / Paid (GHS)</span>
                    <input
                      type="number"
                      value={corporateUpdateForm.amountPaidGHS}
                      onChange={(e) => setCorporateUpdateForm({ ...corporateUpdateForm, amountPaidGHS: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 mt-1 font-mono text-emerald-400 font-bold text-xs"
                    />
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Payment Status</span>
                    <select
                      value={corporateUpdateForm.paymentStatus}
                      onChange={(e) => setCorporateUpdateForm({ ...corporateUpdateForm, paymentStatus: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 mt-1 text-slate-100 text-xs font-bold"
                    >
                      <option value="UNPAID">UNPAID (Pending)</option>
                      <option value="DEPOSIT_PAID">DEPOSIT PAID (50% Milestone)</option>
                      <option value="FULLY_PAID">FULLY PAID (100% Cleared)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Total Contract Value:</span>
                    <span className="font-mono text-white font-bold">
                      GHS {corporateUpdateForm.quotationItems.reduce((s, i) => s + i.total, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Amount Paid to AITI Accounts:</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      GHS {corporateUpdateForm.amountPaidGHS.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800 font-bold">
                    <span className="text-slate-300">Remaining Balance Due:</span>
                    <span className="font-mono text-amber-400">
                      GHS {Math.max(0, corporateUpdateForm.quotationItems.reduce((s, i) => s + i.total, 0) - corporateUpdateForm.amountPaidGHS).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 4. PARTICIPANT ROSTER & CERTIFICATES */}
            {corporateModalTab === 'roster' && (
              <div className="space-y-5 animate-in fade-in duration-150 text-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div>
                    <span className="font-bold text-white text-sm block">Participant Roster & Executive Certifications</span>
                    <span className="text-slate-400 text-[11px]">Enroll staff members and issue verifiable AITI Certificates of Completion</span>
                  </div>
                  <span className="px-3 py-1 bg-cyan-950 text-cyan-300 rounded-full font-mono font-bold text-xs border border-cyan-800">
                    {corporateUpdateForm.participantsList.length} Nominated Staff
                  </span>
                </div>

                {/* Add New Participant Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <input
                    type="text"
                    placeholder="Full Name (e.g. John Doe)"
                    value={corporateUpdateForm.newParticipant.name}
                    onChange={(e) => setCorporateUpdateForm({
                      ...corporateUpdateForm,
                      newParticipant: { ...corporateUpdateForm.newParticipant, name: e.target.value }
                    })}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  />
                  <input
                    type="email"
                    placeholder="Staff Email"
                    value={corporateUpdateForm.newParticipant.email}
                    onChange={(e) => setCorporateUpdateForm({
                      ...corporateUpdateForm,
                      newParticipant: { ...corporateUpdateForm.newParticipant, email: e.target.value }
                    })}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  />
                  <input
                    type="text"
                    placeholder="Designation / Role"
                    value={corporateUpdateForm.newParticipant.role}
                    onChange={(e) => setCorporateUpdateForm({
                      ...corporateUpdateForm,
                      newParticipant: { ...corporateUpdateForm.newParticipant, role: e.target.value }
                    })}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    id="add-roster-participant-btn"
                    onClick={handleAddParticipant}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl px-3 py-1.5 text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Roster</span>
                  </button>
                </div>

                {/* Participants Roster Table */}
                <div className="border border-slate-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="p-3">Staff Name</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Attendance</th>
                        <th className="p-3">Grade</th>
                        <th className="p-3 text-right">Certificate Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-900/70">
                      {corporateUpdateForm.participantsList.map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3">
                            <span className="font-bold text-white block">{p.name}</span>
                            <span className="text-[10px] text-slate-400">{p.email || 'corporate-delegate@company.com'}</span>
                          </td>
                          <td className="p-3 text-slate-300">
                            {p.role || 'Corporate Delegate'}
                          </td>
                          <td className="p-3 font-mono text-cyan-400 font-bold">
                            {p.attendance}%
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                              {p.grade || 'Pass'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              id={`issue-cert-${idx}`}
                              onClick={() => handleGenerateCorporateCertificates(p)}
                              className="px-3 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 rounded-lg text-xs font-bold border border-cyan-800 inline-flex items-center gap-1.5 transition-colors"
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>View & Issue Certificate</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 5. SCHEDULE & LOGISTICS */}
            {corporateModalTab === 'schedule' && (
              <div className="space-y-4 animate-in fade-in duration-150 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <label className="block text-slate-300 font-medium">Training Start Date</label>
                    <input
                      type="date"
                      value={corporateUpdateForm.startDate}
                      onChange={(e) => setCorporateUpdateForm({ ...corporateUpdateForm, startDate: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                    />
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <label className="block text-slate-300 font-medium">Training End Date</label>
                    <input
                      type="date"
                      value={corporateUpdateForm.endDate}
                      onChange={(e) => setCorporateUpdateForm({ ...corporateUpdateForm, endDate: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <label className="block text-slate-300 font-medium">Total Instructional Hours</label>
                    <input
                      type="number"
                      value={corporateUpdateForm.durationHours}
                      onChange={(e) => setCorporateUpdateForm({ ...corporateUpdateForm, durationHours: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
                    />
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <label className="block text-slate-300 font-medium">Assigned Training Venue</label>
                    <input
                      type="text"
                      value={corporateUpdateForm.trainingVenue}
                      onChange={(e) => setCorporateUpdateForm({ ...corporateUpdateForm, trainingVenue: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 6. NOTES & LOGS */}
            {corporateModalTab === 'notes' && (
              <div className="space-y-4 animate-in fade-in duration-150 text-xs">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <label className="block text-slate-300 font-medium">Executive CRM Log & Stakeholder Notes</label>
                  <textarea
                    rows={6}
                    value={corporateUpdateForm.internalNotes}
                    onChange={(e) => setCorporateUpdateForm({ ...corporateUpdateForm, internalNotes: e.target.value })}
                    placeholder="Log conversation history, client requirements, discount approvals, or dietary/equipment requests..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            )}

            {/* Modal Footer Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <span className="text-[11px] text-slate-400">
                Changes saved to AITI Central Training CRM database.
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCorporateRequest(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors"
                >
                  Close Suite
                </button>
                <button
                  id="save-corp-crm-btn"
                  type="button"
                  onClick={handleUpdateCorporateRequest}
                  className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save CRM Updates</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* DOCUMENT VIEWER MODAL (QUOTATIONS, INVOICES, REGISTRATIONS & CERTIFICATES) */}
      <DocumentViewerModal
        isOpen={documentModal.isOpen}
        onClose={() => setDocumentModal({ ...documentModal, isOpen: false })}
        type={documentModal.type}
        data={documentModal.data}
      />

    </div>
  );
};
