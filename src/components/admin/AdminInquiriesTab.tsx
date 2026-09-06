import React, { useState } from 'react';
import { 
  MessageCircle, 
  PhoneCall, 
  Trash2, 
  Mail, 
  Clock, 
  Search,
  Sparkles,
  UserPlus,
  CheckCircle2,
  X,
  Users,
  Check,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { LeadInquiry, StudentEnrollment } from '../../services/adminStorageService';
import { coursesData } from '../../data/coursesData';

interface AdminInquiriesTabProps {
  inquiries: LeadInquiry[];
  students?: StudentEnrollment[];
  onUpdateStatus: (id: string, status: LeadInquiry['status'], notes?: string) => void;
  onDeleteInquiry: (id: string) => void;
  onEnrollLead?: (
    inquiryId: string, 
    studentData: Omit<StudentEnrollment, 'id' | 'enrolledAt'>,
    generateInvoice?: boolean
  ) => Promise<StudentEnrollment>;
  onNavigateTab?: (tab: 'dashboard' | 'students' | 'payments' | 'invoices' | 'share-link' | 'inquiries' | 'batches' | 'settings') => void;
}

export const AdminInquiriesTab: React.FC<AdminInquiriesTabProps> = ({
  inquiries,
  students = [],
  onUpdateStatus,
  onDeleteInquiry,
  onEnrollLead,
  onNavigateTab
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | LeadInquiry['status']>('all');

  // Modal State for Enrolling a Lead
  const [selectedInquiryForEnroll, setSelectedInquiryForEnroll] = useState<LeadInquiry | null>(null);
  const [isSubmittingEnroll, setIsSubmittingEnroll] = useState(false);

  // Success Feedback State
  const [enrolledSuccessData, setEnrolledSuccessData] = useState<{
    student: StudentEnrollment;
    inquiry: LeadInquiry;
    invoiceUrl?: string;
  } | null>(null);

  // Enroll Form State
  const [enrollForm, setEnrollForm] = useState({
    name: '',
    phone: '',
    email: '',
    courseId: coursesData[0]?.id || 'ugc-net-paper-1',
    courseTitle: coursesData[0]?.title || 'UGC NET Paper 1 Complete Masterclass',
    amount: 999,
    feeStatus: 'paid' as 'paid' | 'pending',
    paymentMode: 'upi_direct' as StudentEnrollment['paymentMode'],
    autoCreateInvoice: true,
    notes: 'Converted from Demo Lead'
  });

  const matchCourseFromTarget = (targetText: string = '') => {
    const t = targetText.toLowerCase();
    if (t.includes('spss') || t.includes('research') || t.includes('ph.d')) {
      const spss = coursesData.find(c => c.id.includes('spss') || c.id.includes('research'));
      if (spss) return spss;
    }
    if (t.includes('cdp') || t.includes('pedagogy') || t.includes('ctet')) {
      const cdp = coursesData.find(c => c.id.includes('cdp') || c.id.includes('pedagogy'));
      if (cdp) return cdp;
    }
    if (t.includes('paper') || t.includes('net') || t.includes('ugc')) {
      const paper1 = coursesData.find(c => c.id.includes('paper-1') || c.id.includes('ugc'));
      if (paper1) return paper1;
    }
    return coursesData[0] || { id: 'ugc-net-paper-1', title: 'UGC NET Paper 1 Complete Masterclass', price: 999 };
  };

  const handleOpenEnrollModal = (inq: LeadInquiry) => {
    const matchedCourse = matchCourseFromTarget(inq.targetExam);
    setSelectedInquiryForEnroll(inq);
    setEnrollForm({
      name: inq.name,
      phone: inq.phone,
      email: inq.email || '',
      courseId: matchedCourse.id,
      courseTitle: matchedCourse.title,
      amount: matchedCourse.price || 999,
      feeStatus: 'paid',
      paymentMode: 'upi_direct',
      autoCreateInvoice: true,
      notes: `Converted from Demo Lead (${inq.id}) - Target: ${inq.targetExam}`
    });
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiryForEnroll || !enrollForm.name || !enrollForm.phone) return;

    setIsSubmittingEnroll(true);

    const isPaid = enrollForm.feeStatus === 'paid';
    const courseObj = coursesData.find(c => c.id === enrollForm.courseId);
    const finalCourseTitle = courseObj ? courseObj.title : enrollForm.courseTitle;
    const finalAmount = Number(enrollForm.amount) || 999;

    const studentData: Omit<StudentEnrollment, 'id' | 'enrolledAt'> = {
      name: enrollForm.name.trim(),
      phone: enrollForm.phone.replace(/\D/g, ''),
      email: enrollForm.email.trim() || 'student@learnwithdrankita.com',
      courseId: enrollForm.courseId,
      courseTitle: finalCourseTitle,
      amount: isPaid ? finalAmount : 0,
      feeDue: isPaid ? 0 : finalAmount,
      paymentStatus: isPaid ? 'paid' : 'pending',
      paymentId: isPaid ? `DEMO_CONV_${Date.now().toString().slice(-6)}` : `DUE_${Date.now().toString().slice(-6)}`,
      paymentMode: enrollForm.paymentMode,
      status: isPaid ? 'active' : 'pending_payment',
      notes: enrollForm.notes
    };

    let newStudent: StudentEnrollment;
    if (onEnrollLead) {
      newStudent = await onEnrollLead(selectedInquiryForEnroll.id, studentData, enrollForm.autoCreateInvoice);
    } else {
      onUpdateStatus(selectedInquiryForEnroll.id, 'enrolled', `Enrolled in ${finalCourseTitle}`);
      newStudent = {
        ...studentData,
        id: `ENR-${Math.floor(1000 + Math.random() * 9000)}`,
        enrolledAt: new Date().toISOString()
      };
    }

    setIsSubmittingEnroll(false);
    setSelectedInquiryForEnroll(null);

    // Trigger confetti celebration
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });

    setEnrolledSuccessData({
      student: newStudent,
      inquiry: selectedInquiryForEnroll,
      invoiceUrl: `https://learnwithdrankita.com/invoice?id=${newStudent.id}`
    });
  };

  const isLeadAlreadyEnrolled = (inq: LeadInquiry) => {
    if (inq.status === 'enrolled') return true;
    const cleanPhone = inq.phone.replace(/\D/g, '');
    return students.some(s => s.phone.replace(/\D/g, '') === cleanPhone);
  };

  const filteredInquiries = inquiries.filter(i => {
    const matchesSearch = 
      i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.phone.includes(searchTerm) ||
      i.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.targetExam.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: LeadInquiry['status']) => {
    switch (status) {
      case 'new':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'contacted':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'demo_scheduled':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'enrolled':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'closed':
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      
      {/* Header Overview Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-950 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-brand-800/40 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-2 bg-purple-400/20 text-purple-300 text-xs font-bold px-3 py-1 rounded-full border border-purple-400/30">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Lead to Student Admission Pipeline</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-display">
            Demo Inquiries &amp; Direct Student Enrollment
          </h2>
          <p className="text-xs text-brand-200 max-w-xl">
            Track prospective students who requested free demos. Click <strong>"🎓 Enroll to Students"</strong> on any lead to convert them into an active enrolled student with 1 click.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <div className="bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 text-center">
            <div className="text-lg font-black text-amber-300">{inquiries.length}</div>
            <div className="text-[10px] text-slate-300 uppercase font-semibold">Total Inquiries</div>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 text-center">
            <div className="text-lg font-black text-emerald-300">
              {inquiries.filter(i => isLeadAlreadyEnrolled(i)).length}
            </div>
            <div className="text-[10px] text-slate-300 uppercase font-semibold">Enrolled</div>
          </div>
        </div>
      </div>

      {/* Search and Status Tabs */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search inquiries by student name, phone, email, or target exam..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(['all', 'new', 'contacted', 'demo_scheduled', 'enrolled', 'closed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                statusFilter === tab
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

      </div>

      {/* Inquiries Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredInquiries.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
            No inquiries match your filter criteria.
          </div>
        ) : (
          filteredInquiries.map((inq) => {
            const isEnrolled = isLeadAlreadyEnrolled(inq);

            return (
              <div
                key={inq.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-subtle hover:shadow-premium transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                <div>
                  
                  {/* Top Badges */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(inq.status)}`}>
                      {inq.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {inq.id}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-slate-900">
                    {inq.name}
                  </h4>

                  <div className="mt-2.5 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="font-semibold text-slate-800 line-clamp-2">
                        Target: {inq.targetExam}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneCall className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono font-medium">{inq.phone}</span>
                    </div>
                    {inq.email && (
                      <div className="flex items-center gap-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{inq.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>Requested: {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {inq.notes && (
                    <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 text-[11px] text-slate-600 italic">
                      "{inq.notes}"
                    </div>
                  )}

                  {/* Enrolled Status Banner or Quick Enroll CTA */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    {isEnrolled ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Enrolled in Students List ✓</span>
                        </div>
                        {onNavigateTab && (
                          <button
                            onClick={() => onNavigateTab('students')}
                            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
                          >
                            View
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleOpenEnrollModal(inq)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>🎓 Enroll as Student &amp; Add to List</span>
                      </button>
                    )}
                  </div>

                </div>

                {/* Action Controls & Contact */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  
                  {/* Status Dropdown */}
                  <select
                    value={inq.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as any;
                      if (newStatus === 'enrolled' && !isEnrolled) {
                        handleOpenEnrollModal(inq);
                      } else {
                        onUpdateStatus(inq.id, newStatus);
                      }
                    }}
                    className="text-xs bg-slate-100 border border-slate-200 rounded-lg px-2 py-1.5 font-medium text-slate-700 focus:ring-2 focus:ring-brand-500 focus:outline-none cursor-pointer"
                  >
                    <option value="new">New Lead</option>
                    <option value="contacted">Contacted</option>
                    <option value="demo_scheduled">Demo Scheduled</option>
                    <option value="enrolled">Enrolled</option>
                    <option value="closed">Closed</option>
                  </select>

                  <div className="flex items-center gap-1.5">
                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/91${inq.phone}?text=Namaste%20${encodeURIComponent(inq.name)},%20Dr.%20Ankita%20Bisht%20Academy%20se%20baat%20kar%20rahe%20hain.%20Aapne%20${encodeURIComponent(inq.targetExam)}%20ki%20demo%20class%20ke%20liye%20inquire%20kiya%20tha.`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="WhatsApp Message"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>

                    {/* Call */}
                    <a
                      href={`tel:+91${inq.phone}`}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-700 text-slate-700 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Call Student"
                    >
                      <PhoneCall className="w-4 h-4" />
                    </a>

                    {/* Delete */}
                    <button
                      onClick={() => {
                        if (confirm(`Delete inquiry for ${inq.name}?`)) {
                          onDeleteInquiry(inq.id);
                        }
                      }}
                      className="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                      title="Delete inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* 1. Interactive Modal: Convert Lead to Enrolled Student */}
      {selectedInquiryForEnroll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative max-h-[92vh] overflow-y-auto my-auto">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-3.5 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 font-display">
                    Enroll Student to Academy
                  </h3>
                  <p className="text-xs text-slate-500">
                    Converting Lead: <strong className="text-slate-800">{selectedInquiryForEnroll.name}</strong> ({selectedInquiryForEnroll.id})
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedInquiryForEnroll(null)} 
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-4 text-xs">
              
              {/* Student Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={enrollForm.name}
                  onChange={(e) => setEnrollForm({ ...enrollForm, name: e.target.value })}
                  placeholder="e.g. Manoja Chauhan"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp Phone *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={enrollForm.phone}
                    onChange={(e) => setEnrollForm({ ...enrollForm, phone: e.target.value })}
                    placeholder="9760455002"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-mono font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={enrollForm.email}
                    onChange={(e) => setEnrollForm({ ...enrollForm, email: e.target.value })}
                    placeholder="student@gmail.com"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Target Course Batch */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Enrolled Course Batch *</label>
                <select
                  value={enrollForm.courseId}
                  onChange={(e) => {
                    const c = coursesData.find(item => item.id === e.target.value);
                    setEnrollForm({
                      ...enrollForm,
                      courseId: e.target.value,
                      courseTitle: c ? c.title : enrollForm.courseTitle,
                      amount: c?.price || enrollForm.amount
                    });
                  }}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-semibold bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  {coursesData.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.title} (₹{c.price})
                    </option>
                  ))}
                </select>
                <div className="text-[10px] text-slate-400 mt-1">
                  Inquired for: <em>"{selectedInquiryForEnroll.targetExam}"</em>
                </div>
              </div>

              {/* Fee Amount & Payment Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Admission Fee (₹)</label>
                  <input
                    type="number"
                    required
                    value={enrollForm.amount}
                    onChange={(e) => setEnrollForm({ ...enrollForm, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-extrabold text-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Status</label>
                  <select
                    value={enrollForm.feeStatus}
                    onChange={(e) => setEnrollForm({ ...enrollForm, feeStatus: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold bg-white"
                  >
                    <option value="paid">🟢 Fee Paid (Settled)</option>
                    <option value="pending">🟡 Payment Due (Pay Later)</option>
                  </select>
                </div>
              </div>

              {/* Payment Mode (if paid) */}
              {enrollForm.feeStatus === 'paid' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Mode</label>
                  <select
                    value={enrollForm.paymentMode}
                    onChange={(e) => setEnrollForm({ ...enrollForm, paymentMode: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium bg-white"
                  >
                    <option value="upi_direct">Direct UPI (GooglePay / PhonePe / Paytm)</option>
                    <option value="razorpay">Razorpay Online Gateway</option>
                    <option value="cash">Direct SBI Bank Transfer / Cash</option>
                  </select>
                </div>
              )}

              {/* Checkbox: Auto-generate invoice */}
              <label className="flex items-center gap-2 p-2.5 bg-blue-50/70 rounded-xl border border-blue-200/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enrollForm.autoCreateInvoice}
                  onChange={(e) => setEnrollForm({ ...enrollForm, autoCreateInvoice: e.target.checked })}
                  className="rounded text-brand-600 w-4 h-4"
                />
                <span className="text-slate-800 text-[11px] font-semibold">
                  Auto-generate official fee invoice in <strong>Invoices &amp; Billing 🧾</strong>
                </span>
              </label>

              {/* Notes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Internal Notes</label>
                <input
                  type="text"
                  value={enrollForm.notes}
                  onChange={(e) => setEnrollForm({ ...enrollForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-600"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedInquiryForEnroll(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEnroll}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmittingEnroll ? 'Enrolling...' : 'Confirm & Enroll Student'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 2. Success Modal After Enrollment */}
      {enrolledSuccessData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 text-center space-y-5 animate-scaleUp">
            
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-slate-900 font-display">
                Student Enrolled Successfully! 🎉
              </h3>
              <p className="text-xs text-slate-600">
                <strong>{enrolledSuccessData.student.name}</strong> has been added to <strong>Students &amp; Enrollments</strong>.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Student ID:</span>
                <span className="font-mono font-bold text-brand-900">{enrolledSuccessData.student.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Course Batch:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[200px]">{enrolledSuccessData.student.courseTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Status:</span>
                <span className={`font-bold uppercase ${enrolledSuccessData.student.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {enrolledSuccessData.student.paymentStatus} (₹{enrolledSuccessData.student.amount || enrolledSuccessData.student.feeDue})
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 pt-2">
              <a
                href={`https://wa.me/91${enrolledSuccessData.student.phone}?text=${encodeURIComponent(
                  `Namaste ${enrolledSuccessData.student.name}! 🎓\n\nWelcome to Dr. Ankita Bisht Academic Academy!\nAapka admission *${enrolledSuccessData.student.courseTitle}* me successfully confirm ho gaya hai.\n\nStudent ID: ${enrolledSuccessData.student.id}\nOfficial Portal: https://learnwithdrankita.com\nInvoice / Receipt: https://learnwithdrankita.com/invoice?id=${enrolledSuccessData.student.id}\n\nLive Class & WhatsApp batch link jald share kiya jayega.\nHelpline: +91 7417268651`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs py-3 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send Welcome &amp; Invoice on WhatsApp</span>
              </a>

              {onNavigateTab && (
                <button
                  onClick={() => {
                    setEnrolledSuccessData(null);
                    onNavigateTab('students');
                  }}
                  className="w-full bg-brand-700 hover:bg-brand-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  <span>Go to Students &amp; Enrollments Tab</span>
                </button>
              )}

              <button
                onClick={() => setEnrolledSuccessData(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

