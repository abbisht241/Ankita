import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  Copy, 
  CheckCircle2, 
  Clock, 
  MessageCircle, 
  Printer, 
  X, 
  Building2, 
  Trash2, 
  Edit2, 
  Check, 
  ShieldCheck,
  ExternalLink,
  Share2
} from 'lucide-react';
import { 
  AdminStorage, 
  type Invoice, 
  type BankDetailsConfig, 
  type StudentEnrollment
} from '../../services/adminStorageService';
import { coursesData } from '../../data/coursesData';

interface AdminInvoicesTabProps {
  students: StudentEnrollment[];
  onRefreshData?: () => void;
}

export const AdminInvoicesTab: React.FC<AdminInvoicesTabProps> = ({
  students
}) => {
  const [invoices, setInvoices] = useState<Invoice[]>(() => AdminStorage.getInvoices());
  const [bankDetails, setBankDetails] = useState<BankDetailsConfig>(() => AdminStorage.getBankDetails());
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [editBankForm, setEditBankForm] = useState<BankDetailsConfig>(bankDetails);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  
  // Modals
  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState<Invoice | null>(null);
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);

  // Copy success states
  const [copiedBankText, setCopiedBankText] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [copiedInvoiceId, setCopiedInvoiceId] = useState<string | null>(null);

  // Create Invoice Form State
  const [createForm, setCreateForm] = useState({
    studentId: '',
    studentName: '',
    studentPhone: '',
    studentEmail: '',
    studentCity: 'India',
    courseId: coursesData[0]?.id || 'ugc-net-paper-1',
    courseTitle: coursesData[0]?.title || 'UGC NET Paper 1 Complete Masterclass',
    subtotal: 999,
    discount: 0,
    status: 'pending' as Invoice['status'],
    notes: 'Official Admission Fee Invoice'
  });

  const refreshInvoices = () => {
    setInvoices(AdminStorage.getInvoices());
  };

  const handleCopyText = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCopyInvoiceLink = (inv: Invoice) => {
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://learnwithdrankita.com';
    const url = `${origin}/invoice?id=${inv.id}`;
    navigator.clipboard.writeText(url);
    setCopiedInvoiceId(inv.id);
    setTimeout(() => setCopiedInvoiceId(null), 2500);
  };

  const handleCopyFullBankDetails = () => {
    const text = `🎓 *Dr. Ankita Bisht Academic Academy - Official Payment Details*

Bank Name: ${bankDetails.bankName}
Account Holder: ${bankDetails.accountName}
Account Number: ${bankDetails.accountNumber}
IFSC Code: ${bankDetails.ifscCode}
Primary UPI ID: ${bankDetails.upiId}
Secondary UPI: ${bankDetails.secondaryUpi}

👉 *Online Checkout (Cards/NetBanking/UPI):* ${bankDetails.razorpayCheckoutUrl}

Admissions Helpline: ${bankDetails.helplinePhone}
Website: https://learnwithdrankita.com`;
    navigator.clipboard.writeText(text);
    setCopiedBankText(true);
    setTimeout(() => setCopiedBankText(false), 2500);
  };

  const handleSaveBankDetails = (e: React.FormEvent) => {
    e.preventDefault();
    AdminStorage.setBankDetails(editBankForm);
    setBankDetails(editBankForm);
    setIsEditingBank(false);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.studentName || !createForm.studentPhone) return;

    const courseObj = coursesData.find(c => c.id === createForm.courseId);
    const totalAmt = Math.max(0, Number(createForm.subtotal) - Number(createForm.discount));

    const newInv = await AdminStorage.addInvoice({
      studentId: createForm.studentId || undefined,
      studentName: createForm.studentName.trim(),
      studentPhone: createForm.studentPhone.replace(/\D/g, ''),
      studentEmail: createForm.studentEmail.trim(),
      studentCity: createForm.studentCity.trim() || 'India',
      courseId: createForm.courseId,
      courseTitle: courseObj ? courseObj.title : createForm.courseTitle,
      subtotal: Number(createForm.subtotal) || 999,
      discount: Number(createForm.discount) || 0,
      totalAmount: totalAmt,
      dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      status: createForm.status,
      paymentMode: createForm.status === 'paid' ? 'upi_direct' : undefined,
      notes: createForm.notes
    });

    setInvoices(AdminStorage.getInvoices());
    setIsOpenCreateModal(false);
    setSelectedInvoiceForView(newInv);
  };

  const handleMarkInvoicePaid = async (id: string) => {
    await AdminStorage.updateInvoice(id, {
      status: 'paid',
      paymentMode: 'upi_direct',
      paymentId: `INV_PAY_${Date.now().toString().slice(-6)}`
    });
    refreshInvoices();
    if (selectedInvoiceForView && selectedInvoiceForView.id === id) {
      setSelectedInvoiceForView({
        ...selectedInvoiceForView,
        status: 'paid',
        paymentMode: 'upi_direct'
      });
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      await AdminStorage.deleteInvoice(id);
      refreshInvoices();
      if (selectedInvoiceForView?.id === id) {
        setSelectedInvoiceForView(null);
      }
    }
  };

  const handleStudentSelectInCreate = (studentId: string) => {
    const s = students.find(item => item.id === studentId);
    if (s) {
      const isPaid = s.paymentStatus === 'paid' || (s.amount > 0 && s.status === 'active');
      setCreateForm({
        ...createForm,
        studentId: s.id,
        studentName: s.name,
        studentPhone: s.phone,
        studentEmail: s.email,
        courseId: s.courseId,
        courseTitle: s.courseTitle,
        subtotal: isPaid ? s.amount : (s.feeDue || 999),
        discount: 0,
        status: isPaid ? 'paid' : 'pending',
        notes: `Invoice for ${s.name} (${s.id})`
      });
    }
  };

  // Calculations
  const paidInvoices = invoices.filter(i => i.status === 'paid');
  const pendingInvoices = invoices.filter(i => i.status === 'pending');

  const totalInvoicedAmount = invoices.reduce((sum, i) => sum + (Number(i.totalAmount) || 0), 0);
  const totalCollectedAmount = paidInvoices.reduce((sum, i) => sum + (Number(i.totalAmount) || 0), 0);
  const totalPendingDue = pendingInvoices.reduce((sum, i) => sum + (Number(i.totalAmount) || 0), 0);

  // Filtered Invoices
  const filteredInvoices = invoices.filter(i => {
    if (statusFilter === 'paid' && i.status !== 'paid') return false;
    if (statusFilter === 'pending' && i.status !== 'pending') return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        i.invoiceNumber.toLowerCase().includes(q) ||
        i.studentName.toLowerCase().includes(q) ||
        i.studentPhone.includes(q) ||
        i.studentEmail.toLowerCase().includes(q) ||
        i.courseTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      
      {/* 1. Official Bank & Razorpay Billing Details Card */}
      <div className="bg-gradient-to-r from-slate-900 via-navy-950 to-brand-950 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-brand-800/40 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-400/30">
              <Building2 className="w-3.5 h-3.5" />
              <span>Official Academic Billing &amp; Bank Profile</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold font-display">
              {bankDetails.instituteName}
            </h2>
            <p className="text-xs text-brand-200">
              Account Holder: <strong className="text-white">{bankDetails.accountName}</strong> | Helpline: <strong>{bankDetails.helplinePhone}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleCopyFullBankDetails}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-extrabold px-4 py-2.5 rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copiedBankText ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>Full Bank Details Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Bank &amp; UPI Details</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setEditBankForm(bankDetails);
                setIsEditingBank(!isEditingBank);
              }}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditingBank ? 'Close Edit' : 'Edit Bank Details'}</span>
            </button>
          </div>

        </div>

        {/* Bank Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-5 border-t border-white/10 text-xs relative z-10">
          
          {/* Bank & A/C Name */}
          <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Bank &amp; Beneficiary</div>
            <div className="font-bold text-white text-sm">{bankDetails.bankName}</div>
            <div className="text-brand-200 text-[11px]">A/C: {bankDetails.accountName}</div>
          </div>

          {/* Account Number */}
          <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">A/C Number</div>
              <div className="font-mono font-bold text-amber-300 text-sm tracking-wider">{bankDetails.accountNumber}</div>
              <div className="text-slate-400 text-[10px]">SBI Savings A/C</div>
            </div>
            <button
              onClick={() => handleCopyText(bankDetails.accountNumber, 'acc')}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer"
              title="Copy A/C Number"
            >
              {copiedField === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* IFSC Code */}
          <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">IFSC Code</div>
              <div className="font-mono font-bold text-amber-300 text-sm tracking-wider">{bankDetails.ifscCode}</div>
              <div className="text-slate-400 text-[10px]">SBI Branch Code</div>
            </div>
            <button
              onClick={() => handleCopyText(bankDetails.ifscCode, 'ifsc')}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer"
              title="Copy IFSC Code"
            >
              {copiedField === 'ifsc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* UPI ID */}
          <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Primary UPI ID</div>
              <div className="font-mono font-bold text-emerald-300 text-xs sm:text-sm truncate max-w-[130px]" title={bankDetails.upiId}>
                {bankDetails.upiId}
              </div>
              <div className="text-slate-400 text-[10px]">GooglePay/PhonePe/Paytm</div>
            </div>
            <button
              onClick={() => handleCopyText(bankDetails.upiId, 'upi')}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer"
              title="Copy UPI ID"
            >
              {copiedField === 'upi' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

        </div>

        {/* Edit Bank Details Inline Form */}
        {isEditingBank && (
          <form onSubmit={handleSaveBankDetails} className="mt-5 p-5 bg-white/10 rounded-2xl border border-white/10 space-y-4 animate-fadeIn">
            <h3 className="font-bold text-sm text-white">Edit Academic Billing &amp; Bank Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Account Holder Name</label>
                <input
                  type="text"
                  value={editBankForm.accountName}
                  onChange={(e) => setEditBankForm({ ...editBankForm, accountName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={editBankForm.bankName}
                  onChange={(e) => setEditBankForm({ ...editBankForm, bankName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Account Number</label>
                <input
                  type="text"
                  value={editBankForm.accountNumber}
                  onChange={(e) => setEditBankForm({ ...editBankForm, accountNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={editBankForm.ifscCode}
                  onChange={(e) => setEditBankForm({ ...editBankForm, ifscCode: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Primary UPI ID</label>
                <input
                  type="text"
                  value={editBankForm.upiId}
                  onChange={(e) => setEditBankForm({ ...editBankForm, upiId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Secondary / Helpline UPI</label>
                <input
                  type="text"
                  value={editBankForm.secondaryUpi}
                  onChange={(e) => setEditBankForm({ ...editBankForm, secondaryUpi: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingBank(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow"
              >
                Save Bank Details
              </button>
            </div>
          </form>
        )}

      </div>

      {/* 2. Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Total Invoiced */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Invoiced</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            ₹{totalInvoicedAmount.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {invoices.length} Total Generated Invoices
          </p>
        </div>

        {/* Paid Invoices */}
        <div className="bg-white p-5 rounded-3xl border border-emerald-200 shadow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Paid Invoices</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-display">
            ₹{totalCollectedAmount.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-1">
            {paidInvoices.length} Settled Invoices
          </p>
        </div>

        {/* Pending Due Invoices */}
        <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pending Due</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-display">
            ₹{totalPendingDue.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-amber-700 font-semibold mt-1">
            {pendingInvoices.length} Awaiting Payment
          </p>
        </div>

        {/* Razorpay Web Status */}
        <div className="bg-white p-5 rounded-3xl border border-blue-200 shadow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Online Gateway</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-extrabold text-blue-900 mt-1">
            Razorpay Live Active
          </div>
          <p className="text-[11px] text-blue-600 mt-1">
            Linked to learnwithdrankita.com/register
          </p>
        </div>

      </div>

      {/* 3. Toolbar & Filters */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, invoice number (INV-2026...), phone, or course..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
          />
        </div>

        {/* Filter Pills & Actions */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              All ({invoices.length})
            </button>
            <button
              onClick={() => setStatusFilter('paid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'paid' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Paid ({paidInvoices.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'pending' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600'
              }`}
            >
              Due ({pendingInvoices.length})
            </button>
          </div>

          <button
            onClick={() => setIsOpenCreateModal(true)}
            className="bg-brand-700 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Invoice</span>
          </button>
        </div>

      </div>

      {/* 4. Invoices Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Invoice # &amp; Date</th>
                <th className="py-3.5 px-4">Student Name &amp; Contact</th>
                <th className="py-3.5 px-4">Course Description</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No invoices match your search criteria. Click "+ Create Invoice" to generate one.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const isPaid = inv.status === 'paid';

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors group">
                      
                      {/* Invoice Number & Date */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-brand-900 text-xs sm:text-sm">
                          {inv.invoiceNumber}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(inv.issueDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </td>

                      {/* Student Info */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900">{inv.studentName}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-medium text-slate-700">{inv.studentPhone}</span>
                          <a
                            href={`https://wa.me/91${inv.studentPhone}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-600 hover:text-emerald-700"
                            title="WhatsApp Chat"
                          >
                            <MessageCircle className="w-3 h-3" />
                          </a>
                        </div>
                        {inv.studentEmail && (
                          <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                            {inv.studentEmail}
                          </div>
                        )}
                      </td>

                      {/* Course */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="font-medium text-slate-800 line-clamp-2">
                          {inv.courseTitle}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4">
                        <div className="font-extrabold text-sm text-slate-900 font-display">
                          ₹{inv.totalAmount}
                        </div>
                        {inv.discount > 0 && (
                          <div className="text-[10px] text-emerald-600 font-semibold">
                            ₹{inv.discount} Discount Applied
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 text-center">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>PAID</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full animate-pulse">
                            <Clock className="w-3 h-3 text-amber-700" />
                            <span>PENDING DUE</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Copy Direct Invoice Link */}
                          <button
                            onClick={() => handleCopyInvoiceLink(inv)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
                            title="Copy Direct Shareable Invoice Link"
                          >
                            {copiedInvoiceId === inv.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700">Link Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>

                          {/* View & Print Invoice */}
                          <button
                            onClick={() => setSelectedInvoiceForView(inv)}
                            className="bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-[11px] px-2.5 py-1.5 rounded-lg border border-brand-200 transition-colors flex items-center gap-1 cursor-pointer"
                            title="View / Print Invoice Letterhead"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>View / Print</span>
                          </button>

                          {/* WhatsApp Share */}
                          <a
                            href={`https://wa.me/91${inv.studentPhone}?text=${encodeURIComponent(
                              isPaid
                                ? `🎓 *Dr. Ankita Bisht Academic Academy - Fee Invoice Receipt*\n\n✅ *Invoice Number:* ${inv.invoiceNumber}\n👤 *Student:* ${inv.studentName}\n📚 *Course:* ${inv.courseTitle}\n💰 *Amount Paid:* ₹${inv.totalAmount}\n📅 *Status:* Fully Paid & Verified\n\n👉 *View & Download Official Invoice Online:*\nhttps://learnwithdrankita.com/invoice?id=${inv.id}\n\nThank you for enrolling with Dr. Ankita Bisht Academy.\nHelpline: +91 7417268651`
                                : `🎓 *Dr. Ankita Bisht Academic Academy - Official Fee Invoice*\n\n📄 *Invoice Number:* ${inv.invoiceNumber}\n👤 *Student:* ${inv.studentName}\n📚 *Course Batch:* ${inv.courseTitle}\n💰 *Total Fee Due:* ₹${inv.totalAmount}\n\n👉 *View & Pay Online via Razorpay / Card / UPI:*\nhttps://learnwithdrankita.com/invoice?id=${inv.id}\n\n*Or Direct Bank Transfer (SBI):*\n• Bank: ${bankDetails.bankName}\n• A/C Holder: ${bankDetails.accountName}\n• A/C Number: ${bankDetails.accountNumber}\n• IFSC: ${bankDetails.ifscCode}\n• Primary UPI: ${bankDetails.upiId}\n\nPlease complete payment to activate batch access.\nHelpline: +91 7417268651`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-[11px] px-2.5 py-1.5 rounded-lg shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                            title="Send Invoice to WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>

                          {/* Mark Paid (if pending) */}
                          {!isPaid && (
                            <button
                              onClick={() => handleMarkInvoicePaid(inv.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-2 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
                              title="Mark Invoice as Paid"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteInvoice(inv.id)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Invoice"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

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

      {/* 5. Create Custom Invoice Modal */}
      {isOpenCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Generate Student Fee Invoice</h3>
                <p className="text-xs text-slate-500">Includes official bank details &amp; Razorpay payment link</p>
              </div>
              <button onClick={() => setIsOpenCreateModal(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              
              {/* Optional: Pre-fill from existing student */}
              {students.length > 0 && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <label className="block font-semibold text-slate-700 mb-1">Pre-fill From Enrolled Student (Optional)</label>
                  <select
                    onChange={(e) => handleStudentSelectInCreate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="">-- Or enter student manually below --</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.phone}) - {s.courseTitle.split('(')[0]}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={createForm.studentName}
                  onChange={(e) => setCreateForm({ ...createForm, studentName: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">WhatsApp Phone *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={createForm.studentPhone}
                    onChange={(e) => setCreateForm({ ...createForm, studentPhone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={createForm.studentEmail}
                    onChange={(e) => setCreateForm({ ...createForm, studentEmail: e.target.value })}
                    placeholder="student@gmail.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Course Batch *</label>
                <select
                  value={createForm.courseId}
                  onChange={(e) => {
                    const c = coursesData.find(item => item.id === e.target.value);
                    setCreateForm({ 
                      ...createForm, 
                      courseId: e.target.value,
                      courseTitle: c ? c.title : createForm.courseTitle 
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  {coursesData.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fee (₹)</label>
                  <input
                    type="number"
                    value={createForm.subtotal}
                    onChange={(e) => setCreateForm({ ...createForm, subtotal: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount (₹)</label>
                  <input
                    type="number"
                    value={createForm.discount}
                    onChange={(e) => setCreateForm({ ...createForm, discount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Status</label>
                  <select
                    value={createForm.status}
                    onChange={(e) => setCreateForm({ ...createForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="pending">🟡 Pending Due</option>
                    <option value="paid">🟢 Paid (Settled)</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-700">Total Invoice Amount:</span>
                <span className="text-base font-extrabold text-brand-900 font-display">
                  ₹{Math.max(0, Number(createForm.subtotal) - Number(createForm.discount))}
                </span>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpenCreateModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-brand-700 hover:bg-brand-600 text-white font-bold py-2.5 rounded-xl transition-colors shadow cursor-pointer"
                >
                  Generate Invoice
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 6. Printable Official Letterhead Invoice Modal */}
      {selectedInvoiceForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-auto">
            
            {/* Header Actions Bar (Hidden on print) */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-3 print:hidden">
              <div className="flex items-center gap-2">
                <span className="bg-brand-100 text-brand-800 text-xs font-bold px-3 py-1 rounded-full">
                  Official Academic Invoice Preview
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* 1-Click Copy Public Invoice URL */}
                <button
                  onClick={() => handleCopyInvoiceLink(selectedInvoiceForView)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="Copy Direct Public Link for Student"
                >
                  {copiedInvoiceId === selectedInvoiceForView.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Invoice Link</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => window.print()}
                  className="bg-brand-700 hover:bg-brand-600 text-white text-xs font-bold px-3 py-2 rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / PDF</span>
                </button>

                <a
                  href={`https://wa.me/91${selectedInvoiceForView.studentPhone}?text=${encodeURIComponent(
                    selectedInvoiceForView.status === 'paid'
                      ? `🎓 *Dr. Ankita Bisht Academic Academy - Fee Invoice Receipt*\n\n✅ *Invoice Number:* ${selectedInvoiceForView.invoiceNumber}\n👤 *Student:* ${selectedInvoiceForView.studentName}\n📚 *Course:* ${selectedInvoiceForView.courseTitle}\n💰 *Amount Paid:* ₹${selectedInvoiceForView.totalAmount}\n📅 *Status:* Fully Paid & Verified\n\n👉 *View & Download Official Invoice Online:*\nhttps://learnwithdrankita.com/invoice?id=${selectedInvoiceForView.id}\n\nThank you for enrolling with Dr. Ankita Bisht Academy.\nHelpline: +91 7417268651`
                      : `🎓 *Dr. Ankita Bisht Academic Academy - Official Fee Invoice*\n\n📄 *Invoice Number:* ${selectedInvoiceForView.invoiceNumber}\n👤 *Student:* ${selectedInvoiceForView.studentName}\n📚 *Course:* ${selectedInvoiceForView.courseTitle}\n💰 *Total Due Amount:* ₹${selectedInvoiceForView.totalAmount}\n\n👉 *View & Pay Online (Razorpay / UPI / Card):*\nhttps://learnwithdrankita.com/invoice?id=${selectedInvoiceForView.id}\n\n*Or Direct Bank Transfer (SBI):*\n• Bank: ${bankDetails.bankName}\n• A/C Name: ${bankDetails.accountName}\n• A/C No: ${bankDetails.accountNumber}\n• IFSC: ${bankDetails.ifscCode}\n• Primary UPI: ${bankDetails.upiId}\n\nHelpline: +91 7417268651`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold px-3.5 py-2 rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send WhatsApp</span>
                </a>

                <button
                  onClick={() => setSelectedInvoiceForView(null)}
                  className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Public Shareable Link Banner (Hidden on print) */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-3 sm:p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 print:hidden">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                  <Share2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Direct Public Invoice &amp; Payment Link:</span>
                </div>
                <div className="font-mono text-xs text-blue-700 break-all select-all font-semibold">
                  https://learnwithdrankita.com/invoice?id={selectedInvoiceForView.id}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => handleCopyInvoiceLink(selectedInvoiceForView)}
                  className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  {copiedInvoiceId === selectedInvoiceForView.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>

                <a
                  href={`/invoice?id=${selectedInvoiceForView.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white hover:bg-blue-50 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-blue-200 transition-all flex items-center justify-center gap-1 cursor-pointer"
                  title="Open live student invoice page"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Page</span>
                </a>
              </div>
            </div>

            {/* Print Area - Official Letterhead Invoice */}
            <div id="printable-invoice" className="space-y-6 text-slate-800">
              
              {/* Academy Letterhead Top */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-brand-800 pb-5 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-8 h-8 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-sm shadow">
                      DA
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black text-brand-950 font-display tracking-tight">
                      Dr. Ankita Bisht Academic Academy
                    </h1>
                  </div>
                  <p className="text-xs text-slate-500 max-w-sm">
                    Center for Advanced UGC NET, CDP, Research Methodology (SPSS) &amp; Educational Excellence
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    🌐 learnwithdrankita.com | 📞 {bankDetails.helplinePhone} | 📍 Uttarakhand, India
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    STUDENT INVOICE
                  </div>
                  <div className="font-mono text-base sm:text-lg font-extrabold text-brand-900 mt-0.5">
                    {selectedInvoiceForView.invoiceNumber}
                  </div>
                  <div className="mt-1.5">
                    {selectedInvoiceForView.status === 'paid' ? (
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider">
                        PAID / SETTLED ✓
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider">
                        PAYMENT DUE ⏳
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Billed To & Dates Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <div className="font-bold text-slate-400 text-[10px] uppercase tracking-wider mb-1">
                    BILLED TO (STUDENT):
                  </div>
                  <div className="font-bold text-slate-900 text-sm">
                    {selectedInvoiceForView.studentName}
                  </div>
                  <div className="text-slate-600 mt-0.5 font-medium">
                    Phone: {selectedInvoiceForView.studentPhone}
                  </div>
                  {selectedInvoiceForView.studentEmail && (
                    <div className="text-slate-500">
                      Email: {selectedInvoiceForView.studentEmail}
                    </div>
                  )}
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Student Ref ID: {selectedInvoiceForView.studentId || 'DIRECT'}
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div>
                    <span className="text-slate-400">Invoice Date: </span>
                    <span className="font-bold text-slate-800">
                      {new Date(selectedInvoiceForView.issueDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Due Date: </span>
                    <span className="font-bold text-slate-800">
                      {new Date(selectedInvoiceForView.dueDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Payment Channel: </span>
                    <span className="font-semibold text-brand-800 uppercase">
                      {selectedInvoiceForView.paymentMode || 'Online / Bank UPI'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-600 text-[11px] uppercase">
                    <tr>
                      <th className="py-2.5 px-4">Course Description</th>
                      <th className="py-2.5 px-4 text-center">Batch Term</th>
                      <th className="py-2.5 px-4 text-right">Amount (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{selectedInvoiceForView.courseTitle}</div>
                        <div className="text-[11px] text-slate-500">Includes Live Classes, PDF Notes, Test Series &amp; Doubt Support</div>
                      </td>
                      <td className="py-3 px-4 text-center text-slate-600 font-medium">
                        2026 Batch
                      </td>
                      <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                        ₹{selectedInvoiceForView.subtotal}
                      </td>
                    </tr>
                    {selectedInvoiceForView.discount > 0 && (
                      <tr className="text-emerald-700 bg-emerald-50/50">
                        <td className="py-2 px-4 font-semibold">Special Scholarship / Academy Discount</td>
                        <td className="py-2 px-4 text-center">-</td>
                        <td className="py-2 px-4 text-right font-bold">-₹{selectedInvoiceForView.discount}</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t border-slate-200 text-sm">
                    <tr>
                      <td colSpan={2} className="py-3 px-4 text-slate-700 uppercase tracking-wider text-xs">
                        Total Payable Amount:
                      </td>
                      <td className="py-3 px-4 text-right font-extrabold text-brand-900 font-display text-base">
                        ₹{selectedInvoiceForView.totalAmount}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Bank Transfer & Razorpay Details Box */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2.5 text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Official Bank &amp; UPI Payment Details</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Verified Educator Account</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Bank Name:</span>
                    <strong className="text-white">{bankDetails.bankName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">A/C Holder:</span>
                    <strong className="text-white">{bankDetails.accountName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">A/C Number:</span>
                    <strong className="font-mono text-amber-300">{bankDetails.accountNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">IFSC Code:</span>
                    <strong className="font-mono text-amber-300">{bankDetails.ifscCode}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400">UPI ID: </span>
                    <strong className="font-mono text-emerald-300">{bankDetails.upiId}</strong>
                    <span className="text-slate-400"> (GooglePay / PhonePe / Paytm: 7417268651)</span>
                  </div>
                  <div className="text-brand-200">
                    Online: <strong>learnwithdrankita.com/register</strong>
                  </div>
                </div>
              </div>

              {/* Signature & Seal Footer */}
              <div className="pt-4 flex items-end justify-between border-t border-slate-200 text-xs">
                <div className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                  * This is an officially generated academic fee invoice and admission receipt issued by Dr. Ankita Bisht Academic Academy.
                </div>

                <div className="text-center space-y-1">
                  <div className="w-24 h-9 border-b border-slate-400 mx-auto flex items-end justify-center font-display italic text-brand-900 font-bold">
                    Dr. Ankita Bisht
                  </div>
                  <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Authorized Signatory
                  </div>
                  <div className="text-[9px] text-slate-400">Founder &amp; Chief Educator</div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
