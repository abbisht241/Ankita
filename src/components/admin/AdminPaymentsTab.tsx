import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  Copy, 
  MessageCircle, 
  PhoneCall, 
  CreditCard,
  Sparkles,
  Receipt,
  TrendingUp
} from 'lucide-react';
import type { StudentEnrollment } from '../../services/adminStorageService';
import { coursesData } from '../../data/coursesData';

interface AdminPaymentsTabProps {
  students: StudentEnrollment[];
  onMarkPaid: (id: string) => void;
  onExportCSV?: () => void;
}

export const AdminPaymentsTab: React.FC<AdminPaymentsTabProps> = ({
  students,
  onMarkPaid
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [modeFilter, setModeFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Calculations
  const paidStudents = students.filter(s => s.paymentStatus === 'paid' || (s.amount > 0 && s.status === 'active'));
  const pendingStudents = students.filter(s => s.paymentStatus === 'pending' || s.amount === 0 || s.status === 'pending_payment');

  const totalCollectedRevenue = paidStudents.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
  const totalPendingDue = pendingStudents.reduce((sum, s) => sum + (Number(s.feeDue) || 999), 0);

  const razorpayPaid = paidStudents.filter(s => s.paymentMode === 'razorpay');
  const razorpayTotal = razorpayPaid.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

  const directUpiPaid = paidStudents.filter(s => s.paymentMode === 'upi_direct' || s.paymentMode === 'cash');
  const directUpiTotal = directUpiPaid.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

  // Filtered List
  const filteredList = students.filter(s => {
    const isPaid = s.paymentStatus === 'paid' || (s.amount > 0 && s.status === 'active');

    // Status filter
    if (statusFilter === 'paid' && !isPaid) return false;
    if (statusFilter === 'pending' && isPaid) return false;

    // Mode filter
    if (modeFilter !== 'all' && s.paymentMode !== modeFilter) return false;

    // Course filter
    if (courseFilter !== 'all' && s.courseId !== courseFilter) return false;

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q);
      const matchPhone = s.phone.includes(q);
      const matchEmail = (s.email || '').toLowerCase().includes(q);
      const matchPaymentId = (s.paymentId || '').toLowerCase().includes(q);
      const matchOrderId = (s.orderId || '').toLowerCase().includes(q);
      const matchId = s.id.toLowerCase().includes(q);
      return matchName || matchPhone || matchEmail || matchPaymentId || matchOrderId || matchId;
    }

    return true;
  });

  const handleCopyPaymentId = (idStr: string) => {
    navigator.clipboard.writeText(idStr);
    setCopiedId(idStr);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportPaymentsCSV = () => {
    const headers = ['Transaction Date', 'Student Name', 'Phone', 'Email', 'Course', 'Amount Paid (₹)', 'Fee Due (₹)', 'Payment Status', 'Payment Mode', 'Payment/UTR ID', 'Order ID', 'Notes'];
    const rows = filteredList.map(s => {
      const isPaid = s.paymentStatus === 'paid' || (s.amount > 0 && s.status === 'active');
      const paidAmt = isPaid ? (Number(s.amount) || 999) : 0;
      const dueAmt = isPaid ? 0 : (Number(s.feeDue) || 999);
      const pStatus = isPaid ? 'PAID' : 'PENDING_DUE';
      return [
        `"${new Date(s.enrolledAt).toLocaleString('en-IN')}"`,
        `"${s.name.replace(/"/g, '""')}"`,
        `"${s.phone}"`,
        `"${s.email || ''}"`,
        `"${s.courseTitle.replace(/"/g, '""')}"`,
        paidAmt,
        dueAmt,
        `"${pStatus}"`,
        `"${s.paymentMode}"`,
        `"${s.paymentId}"`,
        `"${s.orderId || ''}"`,
        `"${(s.notes || '').replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Dr_Ankita_Bisht_Payments_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-900 to-indigo-950 text-white p-6 sm:p-7 rounded-3xl border border-brand-800/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-400/20 text-emerald-300 text-xs font-bold px-3 py-0.5 rounded-full border border-emerald-400/30">
            <Receipt className="w-3.5 h-3.5" />
            <span>Payments &amp; Transaction Ledger</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
            Fee &amp; Payment Collections
          </h2>
          <p className="text-xs sm:text-sm text-brand-200 max-w-xl">
            Real-time ledger of Razorpay online transactions, Direct UPI registrations, pending fees, and verified receipts.
          </p>
        </div>

        <div className="flex items-center gap-2.5 z-10 flex-wrap sm:flex-nowrap">
          <button
            onClick={handleExportPaymentsCSV}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs sm:text-sm font-extrabold px-4 py-2.5 rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Payments CSV</span>
          </button>
        </div>

        <div className="absolute right-0 top-0 w-80 h-80 bg-brand-500/10 blur-3xl rounded-full pointer-events-none" />
      </div>

      {/* 2. Four KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Card 1: Total Collected */}
        <div className="bg-white p-5 rounded-3xl border border-emerald-200 shadow-subtle hover:shadow-premium transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Collected Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            ₹{totalCollectedRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{paidStudents.length} Verified Paid Receipts</span>
          </p>
        </div>

        {/* Card 2: Pending Fees Due */}
        <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-subtle hover:shadow-premium transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pending Fees Due</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-display">
            ₹{totalPendingDue.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-amber-700 font-semibold mt-1">
            {pendingStudents.length} Unpaid Registrations Due
          </p>
        </div>

        {/* Card 3: Razorpay Online */}
        <div className="bg-white p-5 rounded-3xl border border-blue-200 shadow-subtle hover:shadow-premium transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Razorpay Gateway</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-900 font-display">
            ₹{razorpayTotal.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-blue-600 font-semibold mt-1">
            {razorpayPaid.length} Auto-verified Web Payments
          </p>
        </div>

        {/* Card 4: Direct UPI / Cash */}
        <div className="bg-white p-5 rounded-3xl border border-purple-200 shadow-subtle hover:shadow-premium transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Direct UPI / Cash</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-900 font-display">
            ₹{directUpiTotal.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-purple-600 font-semibold mt-1">
            {directUpiPaid.length} Admin Confirmed Admissions
          </p>
        </div>

      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-subtle space-y-4">
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, phone (+91), email, payment ID, or UTR..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
            />
          </div>

          {/* Mode Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Payment Modes</option>
              <option value="razorpay">Razorpay Gateway</option>
              <option value="upi_direct">Direct UPI QR</option>
              <option value="cash">Cash / Offline</option>
              <option value="scholarship">Scholarship</option>
            </select>

            {/* Course Dropdown */}
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Courses</option>
              {coursesData.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title.split('(')[0]}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 border-t border-slate-100">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Transactions ({students.length})
          </button>

          <button
            onClick={() => setStatusFilter('paid')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'paid'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Paid &amp; Verified ({paidStudents.length}) • ₹{totalCollectedRevenue.toLocaleString('en-IN')}</span>
          </button>

          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'pending'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Fees ({pendingStudents.length}) • ₹{totalPendingDue.toLocaleString('en-IN')} Due</span>
          </button>
        </div>

      </div>

      {/* 4. Transactions Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Date &amp; Time</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Course</th>
                <th className="py-3.5 px-4">Gateway &amp; Mode</th>
                <th className="py-3.5 px-4">Transaction / Payment ID</th>
                <th className="py-3.5 px-4 text-center">Amount Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No transactions match your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredList.map((s) => {
                  const isPaid = s.paymentStatus === 'paid' || (s.amount > 0 && s.status === 'active');
                  const dueAmount = s.feeDue !== undefined ? s.feeDue : (isPaid ? 0 : 999);

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors group">
                      
                      {/* Date & Time */}
                      <td className="py-4 px-4 whitespace-nowrap text-slate-600">
                        <div className="font-bold text-slate-800">
                          {new Date(s.enrolledAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(s.enrolledAt).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>

                      {/* Student Info */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900">{s.name}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-medium text-slate-700">{s.phone}</span>
                          <a
                            href={`https://wa.me/91${s.phone}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-600 hover:text-emerald-700"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-3 h-3" />
                          </a>
                          <a
                            href={`tel:+91${s.phone}`}
                            className="text-slate-500 hover:text-slate-700"
                            title="Call Phone"
                          >
                            <PhoneCall className="w-3 h-3" />
                          </a>
                        </div>
                        {s.email && (
                          <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                            {s.email}
                          </div>
                        )}
                      </td>

                      {/* Course */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="font-medium text-slate-800 line-clamp-2">
                          {s.courseTitle}
                        </div>
                        <span className="font-mono text-[9px] text-slate-400">
                          ID: {s.id}
                        </span>
                      </td>

                      {/* Gateway & Mode */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border ${
                          s.paymentMode === 'razorpay'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : s.paymentMode === 'upi_direct'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {s.paymentMode === 'razorpay' && <CreditCard className="w-3 h-3" />}
                          {s.paymentMode === 'upi_direct' && <Sparkles className="w-3 h-3" />}
                          <span>{s.paymentMode.replace('_', ' ')}</span>
                        </span>
                        {s.orderId && (
                          <div className="font-mono text-[9px] text-slate-400 mt-1 truncate max-w-[120px]" title={s.orderId}>
                            Ord: {s.orderId}
                          </div>
                        )}
                      </td>

                      {/* Transaction / Reference ID */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-semibold text-slate-800 truncate max-w-[130px]" title={s.paymentId}>
                            {s.paymentId}
                          </span>
                          <button
                            onClick={() => handleCopyPaymentId(s.paymentId)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 cursor-pointer transition-colors"
                            title="Copy Payment ID"
                          >
                            {copiedId === s.paymentId ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        {s.notes && (
                          <div className="text-[10px] text-slate-400 truncate max-w-[140px]" title={s.notes}>
                            {s.notes}
                          </div>
                        )}
                      </td>

                      {/* Amount & Status */}
                      <td className="py-4 px-4 text-center">
                        {isPaid ? (
                          <div className="space-y-1">
                            <div className="font-extrabold text-sm text-emerald-700 font-display">
                              ₹{s.amount}
                            </div>
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>PAID ✓</span>
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="font-extrabold text-sm text-rose-600 font-display">
                              ₹0 <span className="text-[10px] text-amber-700">(₹{dueAmount} Due)</span>
                            </div>
                            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                              <Clock className="w-3 h-3 text-amber-700" />
                              <span>PENDING ⏳</span>
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isPaid ? (
                            <>
                              <button
                                onClick={() => {
                                  if (confirm(`Confirm fee payment of ₹${dueAmount} received for ${s.name}? This will mark status as Paid & Active.`)) {
                                    onMarkPaid(s.id);
                                  }
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-2.5 py-1.5 rounded-lg shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                                title="Verify payment and activate student"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Mark Paid</span>
                              </button>

                              <a
                                href={`https://wa.me/91${s.phone}?text=${encodeURIComponent(
                                  `Namaste ${s.name} ji,\n\nDr. Ankita Bisht Academic Academy me aapka registration prapt hua hai.\n\n📚 Course: ${s.courseTitle}\n💰 Admission Fee Due: ₹${dueAmount}\n\n👉 Batch access activate karne ke liye kripya admission fee payment UPI se complete karein:\n\nUPI ID: 7417268651@okbizaxis\nGooglePay / PhonePe / Paytm: +91 7417268651\n\nPayment karne ke baad receipt/screenshot isi WhatsApp par share kar dein taaki batch access turant shuru ho sake.\n\nHelpline: +91 7417268651`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-[11px] px-2.5 py-1.5 rounded-lg shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                                title="Send WhatsApp Fee Reminder"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>Remind</span>
                              </a>
                            </>
                          ) : (
                            <a
                              href={`https://wa.me/91${s.phone}?text=${encodeURIComponent(
                                `🎓 *Dr. Ankita Bisht Academic Academy - Fee Payment Receipt*\n\n✅ *Payment Status:* Successful & Verified\n\n👤 *Student Name:* ${s.name}\n📚 *Course Batch:* ${s.courseTitle}\n💰 *Amount Paid:* ₹${s.amount}\n💳 *Payment Mode:* ${s.paymentMode.toUpperCase()}\n🆔 *Transaction ID:* ${s.paymentId}\n📅 *Date:* ${new Date(s.enrolledAt).toLocaleDateString('en-IN')}\n\nDr. Ankita Bisht Academy me aapka swagat hai. Aapka batch access active hai.\n\nAdmissions Helpline: +91 7417268651`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 font-bold text-[11px] px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              title="Send Official Receipt via WhatsApp"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                              <span>WhatsApp Receipt</span>
                            </a>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
