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
  Filter
} from 'lucide-react';
import type { StudentEnrollment } from '../../services/adminStorageService';
import { coursesData } from '../../data/coursesData';

interface AdminStudentsTabProps {
  students: StudentEnrollment[];
  onAddStudent: (student: Omit<StudentEnrollment, 'id' | 'enrolledAt'>) => void;
  onDeleteStudent: (id: string) => void;
  onExportCSV: () => void;
  isOpenAddModal: boolean;
  onCloseAddModal: () => void;
  onOpenAddModal: () => void;
}

export const AdminStudentsTab: React.FC<AdminStudentsTabProps> = ({
  students,
  onAddStudent,
  onDeleteStudent,
  onExportCSV,
  isOpenAddModal,
  onCloseAddModal,
  onOpenAddModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('All');

  // Manual Add Student Form State
  const [newStudentForm, setNewStudentForm] = useState({
    name: '',
    email: '',
    phone: '',
    courseId: coursesData[0]?.id || 'ugc-net-paper-1',
    amount: 999,
    paymentMode: 'upi_direct' as StudentEnrollment['paymentMode'],
    notes: 'Direct Enrollment'
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentForm.name || !newStudentForm.phone) return;

    const courseObj = coursesData.find(c => c.id === newStudentForm.courseId);

    onAddStudent({
      name: newStudentForm.name.trim(),
      email: newStudentForm.email.trim(),
      phone: newStudentForm.phone.replace(/\D/g, ''),
      courseId: newStudentForm.courseId,
      courseTitle: courseObj ? courseObj.title : 'Course Batch',
      amount: Number(newStudentForm.amount) || 999,
      paymentId: `DIR_${Date.now().toString().slice(-6)}`,
      paymentMode: newStudentForm.paymentMode,
      status: 'active',
      notes: newStudentForm.notes
    });

    setNewStudentForm({
      name: '',
      email: '',
      phone: '',
      courseId: coursesData[0]?.id || 'ugc-net-paper-1',
      amount: 999,
      paymentMode: 'upi_direct',
      notes: 'Direct Enrollment'
    });
    onCloseAddModal();
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCourse = selectedCourseFilter === 'All' || s.courseId === selectedCourseFilter;

    return matchesSearch && matchesCourse;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Bar with Search & Actions */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, phone (+91), email, or enrollment ID..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
          />
        </div>

        {/* Course Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="All">All Courses ({students.length})</option>
            {coursesData.map(c => (
              <option key={c.id} value={c.id}>
                {c.title.split('(')[0]}
              </option>
            ))}
          </select>

          <button
            onClick={onOpenAddModal}
            className="bg-brand-700 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Student</span>
          </button>

          <button
            onClick={onExportCSV}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            title="Download CSV"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>

      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Student &amp; ID</th>
                <th className="py-3.5 px-4">Contact (WhatsApp / Call)</th>
                <th className="py-3.5 px-4">Enrolled Course</th>
                <th className="py-3.5 px-4">Amount &amp; Mode</th>
                <th className="py-3.5 px-4">Payment ID / Date</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No student registrations match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors group">
                    {/* Name & ID */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{s.name}</div>
                      <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                        {s.id}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-800">{s.phone}</span>
                        <a
                          href={`https://wa.me/91${s.phone}?text=Namaste%20${encodeURIComponent(s.name)},%20Dr.%20Ankita%20Bisht%20Academy%20me%20aapka%20swagat%20hai!`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-6 h-6 rounded-md bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white flex items-center justify-center transition-colors"
                          title="WhatsApp Chat"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`tel:+91${s.phone}`}
                          className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-700 text-slate-600 hover:text-white flex items-center justify-center transition-colors"
                          title="Call Phone"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 truncate max-w-[180px]">
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{s.email}</span>
                      </div>
                    </td>

                    {/* Course */}
                    <td className="py-4 px-4 max-w-xs">
                      <div className="font-medium text-slate-800 line-clamp-2">
                        {s.courseTitle}
                      </div>
                    </td>

                    {/* Amount & Mode */}
                    <td className="py-4 px-4">
                      <div className="font-extrabold text-sm text-brand-900">
                        ₹{s.amount}
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        s.paymentMode === 'razorpay'
                          ? 'bg-blue-50 text-blue-700'
                          : s.paymentMode === 'upi_direct'
                          ? 'bg-purple-50 text-purple-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {s.paymentMode.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Payment ID & Date */}
                    <td className="py-4 px-4 text-slate-500">
                      <div className="font-mono text-[10px] text-slate-700 truncate max-w-[120px]">
                        {s.paymentId}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(s.enrolledAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to remove registration for ${s.name}?`)) {
                            onDeleteStudent(s.id);
                          }
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
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
                <h3 className="font-bold text-lg text-slate-900">Add Manual Student Enrollment</h3>
                <p className="text-xs text-slate-500">For cash, direct UPI, or offline admissions</p>
              </div>
              <button onClick={onCloseAddModal} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
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

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fee Amount (₹)</label>
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
                  placeholder="e.g. Paid in cash at campus office"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={onCloseAddModal}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-brand-700 hover:bg-brand-600 text-white font-bold py-2.5 rounded-xl transition-colors shadow"
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
