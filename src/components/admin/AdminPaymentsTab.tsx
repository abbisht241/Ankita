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
  TrendingUp, 
  Calendar, 
  AlertCircle, 
  X, 
  Check 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AdminStorage, type StudentEnrollment } from '../../services/adminStorageService';
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
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'this_month_due'>('all');
  const [modeFilter, setModeFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Next Month Fee Collect Modal State
  const [selectedStudentForMonthlyFee, setSelectedStudentForMonthlyFee] = useState<StudentEnrollment | null>(null);
  const [monthlyFeeForm, setMonthlyFeeForm] = useState({
    month: '',
    amount: 999,
    status: 'pending' as 'paid' | 'pending',
    notes: 'Monthly Tuition Fee'
  });
  const [isSubmittingMonthlyFee, setIsSubmittingMonthlyFee] = useState(false);

  // Month Helpers
  const currentMonthYear = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const getAvailableMonths = () => {
    const current = new Date();
    const months: string[] = [];
    for (let i = -2; i <= 4; i++) {
      const d = new Date(current.getFullYear(), current.getMonth() + i, 1);
      months.push(d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }));
    }
    return months;
  };

  const getStudentBillingMonth = (s: StudentEnrollment) => {
    if (s.billingMonth) return s.billingMonth;
    return new Date(s.enrolledAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  };

  // Calculations
  const paidStudents = students.filter(s => s.paymentStatus === 'paid' || (s.amount > 0 && s.status === 'active'));
  const pendingStudents = students.filter(s => s.paymentStatus === 'pending' || s.amount === 0 || s.status === 'pending_payment');

  const thisMonthDueStudents = students.filter(s => {
    const isPaid = s.paymentStatus === 'paid' || (s.amount > 0 && s.status === 'active');
    if (isPaid) return false;
    const bMonth = getStudentBillingMonth(s);
    return bMonth === currentMonthYear || s.nextDueMonth === currentMonthYear || !s.billingMonth;
  });

  const totalCollectedRevenue = paidStudents.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
  const totalPendingDue = pendingStudents.reduce((sum, s) => sum + (Number(s.feeDue) || 999), 0);
  const thisMonthDueTotal = thisMonthDueStudents.reduce((sum, s) => sum + (Number(s.feeDue) || 999), 0);

  const razorpayPaid = paidStudents.filter(s => s.paymentMode === 'razorpay');
  const razorpayTotal = razorpayPaid.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

  const directUpiPaid = paidStudents.filter(s => s.paymentMode === 'upi_direct' || s.paymentMode === 'cash');
  const directUpiTotal = directUpiPaid.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

  // Filtered List
  const filteredList = students.filter(s => {
    const isPaid = s.paymentStatus === 'paid' || (s.amount > 0 && s.status === 'active');
    const bMonth = getStudentBillingMonth(s);

    // Status filter
    if (statusFilter === 'paid' && !isPaid) return false;
    if (statusFilter === 'pending' && isPaid) return false;
    if (statusFilter === 'this_month_due') {
      if (isPaid) return false;
      if (bMonth !== currentMonthYear && s.nextDueMonth !== currentMonthYear && s.billingMonth) return false;
    }

    // Month filter
    if (selectedMonthFilter !== 'all' && bMonth !== selectedMonthFilter && s.nextDueMonth !== selectedMonthFilter) {
      return false;
    }

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
      const matchMonth = bMonth.toLowerCase().includes(q);
      return matchName || matchPhone || matchEmail || matchPaymentId || matchOrderId || matchId || matchMonth;
    }

    return true;
  });

  const handleCopyPaymentId = (idStr: string) => {
    navigator.clipboard.writeText(idStr);
    setCopiedId(idStr);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenMonthlyFeeModal = (student: StudentEnrollment) => {
    const nextMonthDate = new Date();
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    const nextMonthName = nextMonthDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

    setSelectedStudentForMonthlyFee(student);
    setMonthlyFeeForm({
      month: student.nextDueMonth || nextMonthName,
      amount: student.amount || 999,
      status: 'pending',
      notes: `Monthly Tuition Fee for ${student.nextDueMonth || nextMonthName}`
    });
  };

  const handleSaveMonthlyFeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForMonthlyFee) return;

    setIsSubmittingMonthlyFee(true);
    const isPaid = monthlyFeeForm.status === 'paid';
    const feeAmt = Number(monthlyFeeForm.amount) || 999;

    // 1. Create Invoice for this Month
    await AdminStorage.addInvoice({
      studentId: selectedStudentForMonthlyFee.id,
      studentName: selectedStudentForMonthlyFee.name,
      studentPhone: selectedStudentForMonthlyFee.phone,
      studentEmail: selectedStudentForMonthlyFee.email,
      studentCity: 'India',
      courseId: selectedStudentForMonthlyFee.courseId,
      courseTitle: `${selectedStudentForMonthlyFee.courseTitle} (${monthlyFeeForm.month} Batch Fee)`,
      subtotal: feeAmt,
      discount: 0,
      totalAmount: feeAmt,
      dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      status: isPaid ? 'paid' : 'pending',
      paymentMode: isPaid ? 'upi_direct' : undefined,
      notes: `Month-wise Tuition Fee: ${monthlyFeeForm.month}`
    });

    // 2. Update Student Record
    await AdminStorage.updateStudent(selectedStudentForMonthlyFee.id, {
      billingType: 'monthly',
      billingMonth: monthlyFeeForm.month,
      feeDue: isPaid ? 0 : feeAmt,
      paymentStatus: isPaid ? 'paid' : 'pending',
      notes: `Monthly Billing: ${monthlyFeeForm.month} (${isPaid ? 'Paid' : 'Due'})`
    });

    setIsSubmittingMonthlyFee(false);
    setSelectedStudentForMonthlyFee(null);

    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleExportPaymentsCSV = () => {
    const headers = ['Transaction Date', 'Billing Month', 'Student Name', 'Phone', 'Email', 'Course', 'Amount Paid (₹)', 'Fee Due (₹)', 'Payment Status', 'Payment Mode', 'Payment/UTR ID', 'Order ID', 'Notes'];
    const rows = filteredList.map(s => {
      const isPaid = s.paymentStatus === 'paid' || (s.amount > 0 && s.status === 'active');
      const paidAmt = isPaid ? (Number(s.amount) || 999) : 0;
      const dueAmt = isPaid ? 0 : (Number(s.feeDue) || 999);
      const pStatus = isPaid ? 'PAID' : 'PENDING_DUE';
      const bMonth = getStudentBillingMonth(s);
      return [
        `"${new Date(s.enrolledAt).toLocaleString('en-IN')}"`,
        `"${bMonth}"`,
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
            <span>Monthly Fee &amp; Transaction Ledger</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
            Month-Wise Fee &amp; Payment Collections
          </h2>
          <p className="text-xs sm:text-sm text-brand-200 max-w-xl">
            Track monthly tuition installments, current month pending dues (<strong>{currentMonthYear}</strong>), and send 1-click WhatsApp reminders with live payment links.
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

        {/* Card 2: THIS MONTH DUE (Highlighted) */}
        <div 
          onClick={() => setStatusFilter('this_month_due')}
          className="bg-gradient-to-br from-amber-50 to-orange-50/60 p-5 rounded-3xl border-2 border-amber-300 shadow-subtle hover:shadow-premium transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-700" />
              <span>This Month Due ({currentMonthYear.split(' ')[0]})</span>
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-900 font-display">
            ₹{thisMonthDueTotal.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-amber-800 font-bold mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>{thisMonthDueStudents.length} Students Pending ({currentMonthYear.split(' ')[0]})</span>
          </p>
        </div>

        {/* Card 3: Total Pending Dues */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-subtle hover:shadow-premium transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">All Pending Fees</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            ₹{totalPendingDue.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {pendingStudents.length} Total Outstanding Registrations
          </p>
        </div>

        {/* Card 4: Razorpay Online & Direct UPI */}
        <div className="bg-white p-5 rounded-3xl border border-blue-200 shadow-subtle hover:shadow-premium transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Payment Channels</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-black text-slate-900 font-display">
            ₹{razorpayTotal.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-500">(Web)</span>
          </div>
          <p className="text-xs text-purple-700 font-semibold mt-1">
            + ₹{directUpiTotal.toLocaleString('en-IN')} Direct UPI / SBI
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
              placeholder="Search by student name, phone (+91), email, month (e.g. September), payment ID..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
            />
          </div>

          {/* Month & Mode Dropdowns */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            
            {/* Month Filter Dropdown */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
              <Calendar className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <select
                value={selectedMonthFilter}
                onChange={(e) => setSelectedMonthFilter(e.target.value)}
                className="text-xs bg-transparent border-0 font-bold text-slate-800 focus:outline-none py-1.5"
              >
                <option value="all">All Months</option>
                {getAvailableMonths().map(m => (
                  <option key={m} value={m}>
                    {m} {m === currentMonthYear ? '(Current)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Mode Dropdown */}
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Modes</option>
              <option value="razorpay">Razorpay Gateway</option>
              <option value="upi_direct">Direct UPI QR</option>
              <option value="cash">SBI / Cash</option>
            </select>

            {/* Course Dropdown */}
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
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
          
          {/* All */}
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

          {/* THIS MONTH DUE FILTER (PRIMARY) */}
          <button
            onClick={() => setStatusFilter('this_month_due')}
            className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
              statusFilter === 'this_month_due'
                ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-md ring-2 ring-amber-300'
                : 'bg-amber-100/80 text-amber-950 border-amber-300 hover:bg-amber-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-800" />
            <span>📅 This Month Due: {currentMonthYear.split(' ')[0]} ({thisMonthDueStudents.length}) • ₹{thisMonthDueTotal.toLocaleString('en-IN')}</span>
          </button>

          {/* Paid */}
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

          {/* Total Pending */}
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'pending'
                ? 'bg-rose-600 text-white shadow'
                : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>All Pending ({pendingStudents.length})</span>
          </button>

        </div>

      </div>

      {/* 4. Transactions Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Billing Month &amp; Date</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Course Batch</th>
                <th className="py-3.5 px-4">Mode / Channel</th>
                <th className="py-3.5 px-4">Transaction Ref</th>
                <th className="py-3.5 px-4 text-center">Amount Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No transactions match your current search and "{statusFilter === 'this_month_due' ? 'This Month Due' : statusFilter}" filter.
                  </td>
                </tr>
              ) : (
                filteredList.map((s) => {
                  const isPaid = s.paymentStatus === 'paid' || (s.amount > 0 && s.status === 'active');
                  const dueAmount = s.feeDue !== undefined ? s.feeDue : (isPaid ? 0 : 999);
                  const bMonth = getStudentBillingMonth(s);
                  const isCurrentMonth = bMonth === currentMonthYear;

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors group">
                      
                      {/* Billing Month & Date */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                            isCurrentMonth
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            <Calendar className="w-3 h-3" />
                            <span>{bMonth}</span>
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Enrolled: {new Date(s.enrolledAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </div>
                      </td>

                      {/* Student Info */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900">{s.name}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono font-medium text-slate-700">{s.phone}</span>
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
                          <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
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
                          Ref: {s.id}
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
                      </td>

                      {/* Transaction / Reference ID */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-semibold text-slate-800 truncate max-w-[120px]" title={s.paymentId}>
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
                          <div className="text-[10px] text-slate-400 truncate max-w-[130px]" title={s.notes}>
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
                              ₹0 <span className="text-[10px] text-amber-700 font-bold">(₹{dueAmount} Due)</span>
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
                              {/* Mark Paid */}
                              <button
                                onClick={() => {
                                  if (confirm(`Confirm fee payment of ₹${dueAmount} for ${s.name} (${bMonth})? This will mark the month as Settled.`)) {
                                    onMarkPaid(s.id);
                                  }
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-2.5 py-1.5 rounded-lg shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                                title="Mark Month Paid"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Mark Paid</span>
                              </button>

                              {/* Monthly WhatsApp Reminder */}
                              <a
                                href={`https://wa.me/91${s.phone}?text=${encodeURIComponent(
                                  `🎓 *Dr. Ankita Bisht Academic Academy - Monthly Fee Reminder*\n\nNamaste ${s.name} ji,\nAapki *${bMonth}* batch tuition fee (*₹${dueAmount}*) due hai.\n\n📚 Course: ${s.courseTitle}\n📅 Billing Month: ${bMonth}\n💰 Total Amount Due: ₹${dueAmount}\n\n👉 *Pay Online via Razorpay / Cards / UPI:*\nhttps://learnwithdrankita.com/invoice?id=${s.id}\n\n*Or Direct Bank Transfer (SBI):*\n• Bank: State Bank of India (SBI)\n• A/C Holder: Ankita Bisht\n• A/C No: 39869278685\n• IFSC Code: SBIN0010583\n• Primary UPI: abbisht241-1@oksbi\n\nPayment complete karne ke baad confirmation screenshot WhatsApp karein taaki batch access active rahe.\n\nHelpline: +91 7417268651`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-[11px] px-2.5 py-1.5 rounded-lg shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                                title="Send Monthly Fee Reminder on WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>Remind</span>
                              </a>
                            </>
                          ) : (
                            <>
                              {/* Collect Next Month Fee */}
                              <button
                                onClick={() => handleOpenMonthlyFeeModal(s)}
                                className="bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200 font-bold text-[11px] px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                                title="Generate next month fee invoice"
                              >
                                <Calendar className="w-3.5 h-3.5" />
                                <span>+ Next Month</span>
                              </button>

                              {/* WhatsApp Receipt */}
                              <a
                                href={`https://wa.me/91${s.phone}?text=${encodeURIComponent(
                                  `🎓 *Dr. Ankita Bisht Academic Academy - Fee Receipt*\n\n✅ *Payment Status:* Successful & Verified\n\n👤 *Student Name:* ${s.name}\n📚 *Course Batch:* ${s.courseTitle}\n📅 *Billing Month:* ${bMonth}\n💰 *Amount Paid:* ₹${s.amount}\n💳 *Payment Mode:* ${s.paymentMode.toUpperCase()}\n🆔 *Transaction ID:* ${s.paymentId}\n📅 *Date:* ${new Date(s.enrolledAt).toLocaleDateString('en-IN')}\n\n👉 *View Online Receipt:* https://learnwithdrankita.com/invoice?id=${s.id}\n\nAdmissions Helpline: +91 7417268651`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 font-bold text-[11px] px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                                title="Send Receipt on WhatsApp"
                              >
                                <Receipt className="w-3.5 h-3.5" />
                                <span>Receipt</span>
                              </a>
                            </>
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

      {/* 5. Next Month Fee Modal */}
      {selectedStudentForMonthlyFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative space-y-4">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Collect Next Month Fee
                </h3>
                <p className="text-xs text-slate-500">
                  Student: <strong>{selectedStudentForMonthlyFee.name}</strong> ({selectedStudentForMonthlyFee.id})
                </p>
              </div>
              <button 
                onClick={() => setSelectedStudentForMonthlyFee(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMonthlyFeeSubmit} className="space-y-3.5 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Billing Month *</label>
                <select
                  value={monthlyFeeForm.month}
                  onChange={(e) => setMonthlyFeeForm({ ...monthlyFeeForm, month: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  {getAvailableMonths().map(m => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fee Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={monthlyFeeForm.amount}
                    onChange={(e) => setMonthlyFeeForm({ ...monthlyFeeForm, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-black text-brand-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={monthlyFeeForm.status}
                    onChange={(e) => setMonthlyFeeForm({ ...monthlyFeeForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="pending">🟡 Payment Due</option>
                    <option value="paid">🟢 Paid (Settled)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes</label>
                <input
                  type="text"
                  value={monthlyFeeForm.notes}
                  onChange={(e) => setMonthlyFeeForm({ ...monthlyFeeForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStudentForMonthlyFee(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingMonthlyFee}
                  className="flex-1 bg-brand-700 hover:bg-brand-600 text-white font-bold py-2.5 rounded-xl shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmittingMonthlyFee ? 'Creating...' : 'Save & Generate Invoice'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
