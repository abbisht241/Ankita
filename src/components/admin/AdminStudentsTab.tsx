import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  UserPlus, 
  Trash2, 
  MessageCircle, 
  PhoneCall, 
  Mail, 
  X, 
  CheckCircle2, 
  Copy,
  ExternalLink,
  Sparkles,
  Clock
} from 'lucide-react';
import type { StudentEnrollment } from '../../services/adminStorageService';
import { coursesData } from '../../data/coursesData';

interface AdminStudentsTabProps {
  students: StudentEnrollment[];
  onAddStudent: (student: Omit<StudentEnrollment, 'id' | 'enrolledAt'>) => void;
  onMarkPaid: (id: string) => void;
  onDeleteStudent: (id: string) => void;
  onExportCSV: () => void;
  isOpenAddModal: boolean;
  onCloseAddModal: () => void;
  onOpenAddModal: () => void;
}

export const AdminStudentsTab: React.FC<AdminStudentsTabProps> = ({
  students,
  onAddStudent,
  onMarkPaid,
  onDeleteStudent,
  onExportCSV,
  isOpenAddModal,
  onCloseAddModal,
  onOpenAddModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('All');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [copySuccess, setCopySuccess] = useState(false);

  // Manual Add Student Form State
  const [newStudentForm, setNewStudentForm] = useState({
    name: '',
    email: '',
    phone: '',
    courseId: coursesData[0]?.id || 'ugc-net-paper-1',
    amount: 999,
    feeStatus: 'paid' as 'paid' | 'pending',
    paymentMode: 'upi_direct' as StudentEnrollment['paymentMode'],
    notes: 'Direct Enrollment'
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://learnwithdrankita.com/register');
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentForm.name || !newStudentForm.phone) return;

    const courseObj = coursesData.find(c => c.id === newStudentForm.courseId);
    const isPaid = newStudentForm.feeStatus === 'paid';

    onAddStudent({
      name: newStudentForm.name.trim(),
      email: newStudentForm.email.trim(),
      phone: newStudentForm.phone.replace(/\D/g, ''),
      courseId: newStudentForm.courseId,
      courseTitle: courseObj ? courseObj.title : 'Course Batch',
      amount: isPaid ? (Number(newStudentForm.amount) || 999) : 0,
      feeDue: isPaid ? 0 : (Number(newStudentForm.amount) || 999),
      paymentStatus: isPaid ? 'paid' : 'pending',
      paymentId: isPaid ? `DIR_${Date.now().toString().slice(-6)}` : `DUE_${Date.now().toString().slice(-6)}`,
      paymentMode: newStudentForm.paymentMode,
      status: isPaid ? 'active' : 'pending_payment',
      notes: newStudentForm.notes
    });

    setNewStudentForm({
      name: '',
      email: '',
      phone: '',
      courseId: coursesData[0]?.id || 'ugc-net-paper-1',
      amount: 999,
      feeStatus: 'paid',
      paymentMode: 'upi_direct',
      notes: 'Direct Enrollment'
    });
    onCloseAddModal();
  };

  const paidCount = students.filter(s => s.paymentStatus === 'paid' || (s.amount > 0 && s.status === 'active')).length;
  const pendingCount = students.filter(s => s.paymentStatus === 'pending' || s.amount === 0 || s.status === 'pending_payment').length;

  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCourse = selectedCourseFilter === 'All' || s.courseId === selectedCourseFilter;

    const isStudentPaid = s.paymentStatus === 'paid' || (s.amount > 0 && s.status === 'active');
    const matchesPaymentStatus = 
      paymentStatusFilter === 'all' ||
      (paymentStatusFilter === 'paid' && isStudentPaid) ||
      (paymentStatusFilter === 'pending' && !isStudentPaid);

    return matchesSearch && matchesCourse && matchesPaymentStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. Public Student Registration Link Share Bar */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 text-white p-4 rounded-2xl border border-brand-700/50 shadow-md space-y-3">
        <div className="flex items-start gap-2 flex-wrap">
          <span className="bg-amber-400 text-slate-950 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3" />
            <span>Registration Link</span>
          </span>
          <div className="font-mono text-xs text-amber-300 font-bold break-all">
            learnwithdrankita.com/register
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2 rounded-xl border border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {copySuccess ? <><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span className="text-emerald-300">Copied!</span></> : <><Copy className="w-4 h-4" /><span>Copy Link</span></>}
          </button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent('🎓 *Dr. Ankita Bisht Academy - Admissions Open*\n\n👉 Register: https://learnwithdrankita.com/register\n\nHelpline: +91 7417268651')}`}
            target="_blank" rel="noreferrer"
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold px-3 py-2 rounded-xl shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Share on WhatsApp</span>
          </a>
          <a href="/register" target="_blank" rel="noreferrer"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0">
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
      
      {/* Search & Actions */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, phone, email..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="flex-1 min-w-0 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none"
          >
            <option value="All">All Courses ({students.length})</option>
            {coursesData.map(c => (
              <option key={c.id} value={c.id}>{c.title.split('(')[0]}</option>
            ))}
          </select>
          <button onClick={onOpenAddModal}
            className="bg-brand-700 hover:bg-brand-600 text-white font-bold text-xs px-3 py-2.5 rounded-xl shadow flex items-center gap-1.5 shrink-0 cursor-pointer">
            <UserPlus className="w-4 h-4" /><span>+ Add</span>
          </button>
          <button onClick={onExportCSV}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-xl border border-slate-200 shrink-0 cursor-pointer" title="Export CSV">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button onClick={() => setPaymentStatusFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap ${paymentStatusFilter === 'all' ? 'bg-slate-900 text-white shadow' : 'bg-white text-slate-600 border border-slate-200'}`}>
          All ({students.length})
        </button>
        <button onClick={() => setPaymentStatusFilter('paid')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap flex items-center gap-1 ${paymentStatusFilter === 'paid' ? 'bg-emerald-600 text-white shadow' : 'bg-white text-emerald-700 border border-emerald-200'}`}>
          <CheckCircle2 className="w-3.5 h-3.5" /><span>Paid ({paidCount})</span>
        </button>
        <button onClick={() => setPaymentStatusFilter('pending')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap flex items-center gap-1 ${paymentStatusFilter === 'pending' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-white text-amber-800 border border-amber-300'}`}>
          <Clock className="w-3.5 h-3.5" /><span>Due ({pendingCount})</span>
        </button>
      </div>

      {/* ── MOBILE: Card List ── */}
      <div className="sm:hidden space-y-3">
        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-sm">No students match your filter.</div>
        ) : filteredStudents.map((s) => {
          const isPaid = s.paymentStatus === 'paid' || (s.amount > 0 && s.status === 'active');
          const dueAmount = s.feeDue !== undefined ? s.feeDue : (isPaid ? 0 : 999);
          return (
            <div key={s.id} className={`bg-white rounded-2xl border shadow-xs p-4 space-y-3 ${isPaid ? 'border-emerald-200' : 'border-amber-200'}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-slate-900">{s.name}</div>
                  <div className="font-mono text-[10px] text-slate-400 mt-0.5">{s.id}</div>
                </div>
                {isPaid ? (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0">
                    <CheckCircle2 className="w-3 h-3" />Paid
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0">
                    <Clock className="w-3 h-3" />Due ₹{dueAmount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-700 flex-1">{s.phone}</span>
                <a href={`https://wa.me/91${s.phone}`} target="_blank" rel="noreferrer"
                  className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white flex items-center justify-center transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a href={`tel:+91${s.phone}`}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-700 text-slate-600 hover:text-white flex items-center justify-center transition-colors">
                  <PhoneCall className="w-4 h-4" />
                </a>
              </div>
              <div className="text-xs text-slate-500 line-clamp-1">{s.courseTitle.split('(')[0]}</div>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                {!isPaid && (
                  <>
                    <button onClick={() => { if (confirm(`Confirm ₹${dueAmount} received for ${s.name}?`)) onMarkPaid(s.id); }}
                      className="flex-1 bg-emerald-600 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer">
                      <CheckCircle2 className="w-3.5 h-3.5" />Mark Paid
                    </button>
                    <a href={`https://wa.me/91${s.phone}?text=${encodeURIComponent(`Namaste ${s.name} ji, fee ₹${dueAmount} baaki hai. UPI: 7417268651@okbizaxis`)}`}
                      target="_blank" rel="noreferrer"
                      className="flex-1 bg-amber-400 text-slate-950 font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer">
                      <MessageCircle className="w-3.5 h-3.5" />Remind
                    </a>
                  </>
                )}
                <a
                  href={`/portal?email=${encodeURIComponent(s.email || s.phone)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-slate-50 hover:bg-brand-50 text-slate-500 hover:text-brand-600 cursor-pointer"
                  title="View Student Portal"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button onClick={() => { if (confirm(`Remove ${s.name}?`)) onDeleteStudent(s.id); }}
                  className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── DESKTOP: Table ── */}
      <div className="hidden sm:block bg-white rounded-3xl border border-slate-200/90 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Student & ID</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Course</th>
                <th className="py-3.5 px-4">Fee & Mode</th>
                <th className="py-3.5 px-4">Payment ID / Date</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStudents.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-slate-400">No students match your filter.</td></tr>
              ) : filteredStudents.map((s) => {
                const isPaid = s.paymentStatus === 'paid' || (s.amount > 0 && s.status === 'active');
                const dueAmount = s.feeDue !== undefined ? s.feeDue : (isPaid ? 0 : 999);
                return (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{s.name}</div>
                      <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 rounded">{s.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-800">{s.phone}</span>
                        <a href={`https://wa.me/91${s.phone}`} target="_blank" rel="noreferrer" className="w-6 h-6 rounded-md bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white flex items-center justify-center transition-colors"><MessageCircle className="w-3.5 h-3.5" /></a>
                        <a href={`tel:+91${s.phone}`} className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-700 text-slate-600 hover:text-white flex items-center justify-center transition-colors"><PhoneCall className="w-3.5 h-3.5" /></a>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 truncate max-w-[180px]">
                        <Mail className="w-3 h-3 shrink-0" /><span className="truncate">{s.email || 'No email'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 max-w-xs"><div className="font-medium text-slate-800 line-clamp-2">{s.courseTitle}</div></td>
                    <td className="py-4 px-4">
                      {isPaid ? (<><div className="font-extrabold text-sm text-emerald-700">₹{s.amount} Paid</div><span className="text-[10px] font-bold px-1.5 rounded uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">{s.paymentMode.replace('_',' ')}</span></>) 
                      : (<><div className="font-extrabold text-sm text-rose-600">₹0 <span className="text-[11px] text-amber-700">(₹{dueAmount} Due)</span></div><span className="text-[10px] font-bold px-1.5 rounded uppercase bg-amber-50 text-amber-800 border border-amber-300">Pending</span></>)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-mono text-[10px] text-slate-700 truncate max-w-[120px]">{s.paymentId}</div>
                      <div className="text-[10px] text-slate-400">{new Date(s.enrolledAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {isPaid ? (<span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full"><CheckCircle2 className="w-3 h-3" />Paid</span>)
                      : (<span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full animate-pulse"><Clock className="w-3 h-3 text-amber-700" />Pending</span>)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!isPaid && (<>
                          <button onClick={() => { if(confirm(`Confirm ₹${dueAmount} for ${s.name}?`)) onMarkPaid(s.id); }} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"><CheckCircle2 className="w-3.5 h-3.5" />Mark Paid</button>
                          <a href={`https://wa.me/91${s.phone}?text=${encodeURIComponent(`Namaste ${s.name} ji, fee ₹${dueAmount} baaki hai. UPI: 7417268651@okbizaxis`)}`} target="_blank" rel="noreferrer" className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-[11px] px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"><MessageCircle className="w-3.5 h-3.5" />Remind</a>
                        </>)}
                        <a
                          href={`/portal?email=${encodeURIComponent(s.email || s.phone)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-brand-600 p-1.5 rounded-lg hover:bg-brand-50 cursor-pointer"
                          title={`Open Student Portal for ${s.name}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button onClick={() => { if(confirm(`Remove ${s.name}?`)) onDeleteStudent(s.id); }} className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Student Add Modal */}
      {isOpenAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Add Student Enrollment</h3>
                <p className="text-xs text-slate-500">For direct registrations, offline, or fee-pending entries</p>
              </div>
              <button onClick={onCloseAddModal} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={newStudentForm.name}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">WhatsApp Phone *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={newStudentForm.phone}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newStudentForm.email}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, email: e.target.value })}
                    placeholder="student@gmail.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Course Batch *</label>
                <select
                  value={newStudentForm.courseId}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, courseId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  {coursesData.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Status Option */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <label className="block font-semibold text-slate-700">Payment Status *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewStudentForm({ ...newStudentForm, feeStatus: 'paid' })}
                    className={`py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      newStudentForm.feeStatus === 'paid'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Paid (Active)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewStudentForm({ ...newStudentForm, feeStatus: 'pending' })}
                    className={`py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      newStudentForm.feeStatus === 'pending'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Fee Pending (Due)</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {newStudentForm.feeStatus === 'paid' ? 'Paid Amount (₹)' : 'Fee Due (₹)'}
                  </label>
                  <input
                    type="number"
                    value={newStudentForm.amount}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Mode</label>
                  <select
                    value={newStudentForm.paymentMode}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, paymentMode: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="upi_direct">Direct UPI QR</option>
                    <option value="cash">Cash / Offline</option>
                    <option value="razorpay">Razorpay Gateway</option>
                    <option value="scholarship">Scholarship / Free</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Admission Notes</label>
                <input
                  type="text"
                  value={newStudentForm.notes}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, notes: e.target.value })}
                  placeholder="e.g. Paid in cash or UPI receipt verified"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={onCloseAddModal}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-brand-700 hover:bg-brand-600 text-white font-bold py-2.5 rounded-xl transition-colors shadow cursor-pointer"
                >
                  Save Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
