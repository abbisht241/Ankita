import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Building2, 
  CreditCard, 
  Printer, 
  Copy, 
  Check, 
  MessageCircle, 
  Sparkles, 
  ArrowLeft,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  AdminStorage, 
  type Invoice, 
  type BankDetailsConfig 
} from '../services/adminStorageService';
import { startRazorpayCheckout } from '../services/razorpayService';
import { coursesData } from '../data/coursesData';

interface PublicInvoicePageProps {
  onBackToWebsite: () => void;
}

export const PublicInvoicePage: React.FC<PublicInvoicePageProps> = ({ onBackToWebsite }) => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [bankDetails, setBankDetails] = useState<BankDetailsConfig>(() => AdminStorage.getBankDetails());
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const getTargetIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id') || params.get('num') || params.get('inv');
    if (idParam) return idParam.trim();

    // Check pathname like /invoice/INV-4917
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    if (pathParts.length > 1 && pathParts[0] === 'invoice') {
      return pathParts[1].trim();
    }
    return '';
  };

  const loadInvoiceData = async (targetId: string) => {
    setIsLoading(true);
    setBankDetails(AdminStorage.getBankDetails());

    // 1. Check local storage
    const allLocal = AdminStorage.getInvoices();
    let match = allLocal.find(i => 
      (targetId && (i.id.toLowerCase() === targetId.toLowerCase() || i.invoiceNumber.toLowerCase() === targetId.toLowerCase() || (i.studentId && i.studentId.toLowerCase() === targetId.toLowerCase())))
    );

    if (match) {
      setInvoice(match);
      setIsLoading(false);
      return;
    }

    // 2. Fetch from cloud API
    if (targetId) {
      try {
        const res = await fetch(`/api/invoices?id=${encodeURIComponent(targetId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.invoice) {
            setInvoice(data.invoice);
            setIsLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn('Remote invoice fetch error', e);
      }
    }

    // Fallback: If targetId is empty or not found, take first available invoice if any
    if (allLocal.length > 0 && !targetId) {
      setInvoice(allLocal[0]);
    } else {
      setInvoice(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const targetId = getTargetIdFromUrl();
    loadInvoiceData(targetId);
  }, []);

  const handleCopyText = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCopyInvoiceLink = () => {
    const url = invoice ? `https://learnwithdrankita.com/invoice?id=${invoice.id}` : window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSearchLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const q = searchQuery.trim().toLowerCase();
    const all = AdminStorage.getInvoices();
    const found = all.find(i => 
      i.invoiceNumber.toLowerCase().includes(q) ||
      i.id.toLowerCase().includes(q) ||
      i.studentPhone.includes(q) ||
      i.studentName.toLowerCase().includes(q)
    );

    if (found) {
      setInvoice(found);
      window.history.pushState(null, '', `/invoice?id=${found.id}`);
    } else {
      loadInvoiceData(searchQuery.trim());
    }
  };

  const handleOnlineRazorpayPayment = () => {
    if (!invoice) return;

    const courseObj = coursesData.find(c => c.id === invoice.courseId) || coursesData[0];
    const payableAmount = invoice.totalAmount || 999;

    setIsProcessingPayment(true);

    startRazorpayCheckout({
      course: {
        ...courseObj,
        price: payableAmount,
        title: invoice.courseTitle
      },
      studentName: invoice.studentName,
      studentEmail: invoice.studentEmail || 'student@learnwithdrankita.com',
      studentPhone: invoice.studentPhone,
      onSuccess: async (_verifyResult, payload) => {
        setIsProcessingPayment(false);
        setPaymentSuccess(true);

        const updatedInv: Invoice = {
          ...invoice,
          status: 'paid',
          paymentMode: 'razorpay',
          paymentId: payload.razorpay_payment_id
        };

        // Update local & cloud invoice
        await AdminStorage.updateInvoice(invoice.id, {
          status: 'paid',
          paymentMode: 'razorpay',
          paymentId: payload.razorpay_payment_id
        });

        // Also mark student paid if student ID exists
        if (invoice.studentId) {
          await AdminStorage.markStudentPaid(invoice.studentId, payableAmount, 'razorpay');
        }

        setInvoice(updatedInv);

        // Confetti celebration
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      },
      onFailure: (err) => {
        setIsProcessingPayment(false);
        alert(`Payment not completed: ${err}`);
      },
      onDismiss: () => {
        setIsProcessingPayment(false);
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      
      {/* Top Header Navigation */}
      <header className="bg-slate-950 text-white sticky top-0 z-30 border-b border-slate-800 shadow-sm print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToWebsite}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Website</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-brand-700 text-white font-black flex items-center justify-center text-xs shadow-xs">
                DA
              </span>
              <div>
                <span className="font-bold text-sm text-white block leading-tight">
                  Dr. Ankita Bisht Academic Academy
                </span>
                <span className="text-[10px] text-slate-400 block font-medium">
                  Official Student Fee Invoice Portal
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {invoice && (
              <>
                <button
                  onClick={handleCopyInvoiceLink}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Invoice Link</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => window.print()}
                  className="bg-brand-700 hover:bg-brand-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Print / Save PDF</span>
                </button>
              </>
            )}
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full flex-1 space-y-6">
        
        {/* Loading Spinner */}
        {isLoading && (
          <div className="bg-white rounded-3xl p-12 text-center shadow-subtle border border-slate-200 space-y-3">
            <div className="w-10 h-10 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-700">Loading Official Invoice...</p>
          </div>
        )}

        {/* Invoice Lookup Form if not found */}
        {!isLoading && !invoice && (
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200 text-center space-y-6 max-w-lg mx-auto animate-scaleUp">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mx-auto">
              <CreditCard className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                Find Your Fee Invoice
              </h2>
              <p className="text-xs text-slate-500">
                Enter your WhatsApp mobile number or Invoice Number (e.g. INV-2026-001) to view and pay your fee.
              </p>
            </div>

            <form onSubmit={handleSearchLookup} className="space-y-3">
              <input
                type="text"
                required
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter 10-digit Phone or Invoice ID..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-center text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                className="w-full bg-brand-700 hover:bg-brand-600 text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Search &amp; Open Invoice
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
              Need help? Contact Admissions: <strong>+91 7417268651</strong>
            </div>
          </div>
        )}

        {/* Invoice Found & Rendered */}
        {!isLoading && invoice && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Payment Success Banner */}
            {paymentSuccess && (
              <div className="bg-emerald-50 border-2 border-emerald-400 rounded-3xl p-6 text-center space-y-2 shadow-lg animate-scaleUp">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-emerald-950 font-display">
                  Payment Completed Successfully! 🎉
                </h3>
                <p className="text-xs text-emerald-800 max-w-md mx-auto">
                  Your payment has been received and verified. Your course batch access is active.
                </p>
              </div>
            )}

            {/* Main Letterhead Printable Document */}
            <div id="printable-invoice" className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/90 space-y-8">
              
              {/* Top Letterhead */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-brand-800 pb-6 gap-6">
                <div>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="w-9 h-9 rounded-xl bg-brand-800 text-white font-bold flex items-center justify-center text-sm shadow">
                      DA
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black text-brand-950 font-display tracking-tight">
                      Dr. Ankita Bisht Academic Academy
                    </h1>
                  </div>
                  <p className="text-xs text-slate-500 max-w-md">
                    Official Admissions &amp; Academic Learning Center (UGC NET Paper 1, CDP 30/30, SPSS)
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    🌐 learnwithdrankita.com | 📞 {bankDetails.helplinePhone} | 📍 Uttarakhand, India
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    OFFICIAL STUDENT INVOICE
                  </div>
                  <div className="font-mono text-lg sm:text-xl font-extrabold text-brand-900 mt-0.5">
                    {invoice.invoiceNumber}
                  </div>
                  <div className="mt-2">
                    {invoice.status === 'paid' ? (
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>PAID &amp; CONFIRMED ✓</span>
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 animate-pulse">
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        <span>PAYMENT DUE ⏳</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Student & Invoice Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div>
                  <div className="font-bold text-slate-400 text-[10px] uppercase tracking-wider mb-1">
                    BILLED TO (STUDENT):
                  </div>
                  <div className="font-bold text-slate-900 text-base">
                    {invoice.studentName}
                  </div>
                  <div className="text-slate-600 mt-0.5 font-medium">
                    WhatsApp Phone: <strong>+91 {invoice.studentPhone}</strong>
                  </div>
                  {invoice.studentEmail && (
                    <div className="text-slate-500">
                      Email: {invoice.studentEmail}
                    </div>
                  )}
                  <div className="text-slate-400 text-[11px] mt-1">
                    Student ID: {invoice.studentId || 'DIRECT_REG'}
                  </div>
                </div>

                <div className="space-y-1 sm:text-right">
                  <div>
                    <span className="text-slate-400">Invoice Date: </span>
                    <span className="font-bold text-slate-800">
                      {new Date(invoice.issueDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Payment Due Date: </span>
                    <span className="font-bold text-slate-800">
                      {new Date(invoice.dueDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Payment Status: </span>
                    <span className={`font-extrabold uppercase ${invoice.status === 'paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {invoice.status}
                    </span>
                  </div>
                  {invoice.paymentId && (
                    <div className="font-mono text-[10px] text-slate-500">
                      Ref: {invoice.paymentId}
                    </div>
                  )}
                </div>
              </div>

              {/* Line Items Table */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-600 text-[11px] uppercase">
                    <tr>
                      <th className="py-3 px-4">Course Description &amp; Deliverables</th>
                      <th className="py-3 px-4 text-center">Batch Period</th>
                      <th className="py-3 px-4 text-right">Fee (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 text-sm">{invoice.courseTitle}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          ✓ Live Interactive Classes &amp; Recordings<br />
                          ✓ PDF Notes, PYQ Practice, Test Series<br />
                          ✓ Direct Faculty Doubt Mentorship with Dr. Ankita Bisht
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center text-slate-600 font-medium whitespace-nowrap">
                        2026 Target Batch
                      </td>
                      <td className="py-4 px-4 text-right font-extrabold text-slate-900 text-sm">
                        ₹{invoice.subtotal}
                      </td>
                    </tr>
                    {invoice.discount > 0 && (
                      <tr className="text-emerald-700 bg-emerald-50/50">
                        <td className="py-2.5 px-4 font-semibold">Special Scholarship / Early-Bird Waiver</td>
                        <td className="py-2.5 px-4 text-center">-</td>
                        <td className="py-2.5 px-4 text-right font-bold">-₹{invoice.discount}</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t border-slate-200 text-sm">
                    <tr>
                      <td colSpan={2} className="py-3.5 px-4 text-slate-700 uppercase tracking-wider text-xs">
                        Total Amount Payable:
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-brand-950 font-display text-lg">
                        ₹{invoice.totalAmount}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Online Payment & Bank Transfer Section (Only shown if pending) */}
              {invoice.status !== 'paid' && (
                <div className="space-y-4 print:hidden">
                  
                  {/* Option 1: Instant Online Payment via Razorpay */}
                  <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl border border-brand-700/50 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5">
                    <div className="space-y-1 text-center sm:text-left">
                      <div className="inline-flex items-center gap-1.5 bg-emerald-400/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        <Sparkles className="w-3 h-3" />
                        <span>Recommended Instant Checkout</span>
                      </div>
                      <h3 className="text-lg font-bold">Pay ₹{invoice.totalAmount} Online Now</h3>
                      <p className="text-xs text-brand-200">
                        Supports UPI (GPay/PhonePe/Paytm), All Bank Cards, NetBanking &amp; Wallets
                      </p>
                    </div>

                    <button
                      onClick={handleOnlineRazorpayPayment}
                      disabled={isProcessingPayment}
                      className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm px-6 py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>{isProcessingPayment ? 'Opening Checkout...' : `Pay ₹${invoice.totalAmount} Online`}</span>
                    </button>
                  </div>

                  {/* Option 2: Direct Bank Transfer & UPI Details */}
                  <div className="bg-slate-900 text-white p-5 rounded-3xl space-y-3.5 text-xs border border-slate-800">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                      <span className="font-bold text-amber-300 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4" />
                        <span>Or Pay via Direct Bank Transfer (SBI / UPI)</span>
                      </span>
                      <span className="text-[10px] text-slate-400">Zero Transaction Fees</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="bg-white/5 p-2.5 rounded-xl">
                        <span className="text-slate-400 block text-[10px]">Bank Name:</span>
                        <strong className="text-white text-xs">{bankDetails.bankName}</strong>
                      </div>

                      <div className="bg-white/5 p-2.5 rounded-xl">
                        <span className="text-slate-400 block text-[10px]">A/C Holder:</span>
                        <strong className="text-white text-xs">{bankDetails.accountName}</strong>
                      </div>

                      <div className="bg-white/5 p-2.5 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-slate-400 block text-[10px]">A/C Number:</span>
                          <strong className="font-mono text-amber-300 text-xs">{bankDetails.accountNumber}</strong>
                        </div>
                        <button
                          onClick={() => handleCopyText(bankDetails.accountNumber, 'acc')}
                          className="p-1 text-slate-400 hover:text-white"
                          title="Copy A/C"
                        >
                          {copiedField === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="bg-white/5 p-2.5 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-slate-400 block text-[10px]">IFSC Code:</span>
                          <strong className="font-mono text-amber-300 text-xs">{bankDetails.ifscCode}</strong>
                        </div>
                        <button
                          onClick={() => handleCopyText(bankDetails.ifscCode, 'ifsc')}
                          className="p-1 text-slate-400 hover:text-white"
                          title="Copy IFSC"
                        >
                          {copiedField === 'ifsc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Primary UPI: </span>
                        <strong className="font-mono text-emerald-300 text-xs">{bankDetails.upiId}</strong>
                        <button
                          onClick={() => handleCopyText(bankDetails.upiId, 'upi')}
                          className="p-1 text-slate-400 hover:text-white cursor-pointer"
                          title="Copy UPI ID"
                        >
                          {copiedField === 'upi' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <a
                        href={`https://wa.me/917417268651?text=${encodeURIComponent(
                          `Namaste Dr. Ankita Bisht Academy,\n\nMaine Invoice ${invoice.invoiceNumber} ki fee (₹${invoice.totalAmount}) UPI/Bank se pay kar di hai.\n\nStudent: ${invoice.studentName}\nPhone: ${invoice.studentPhone}\n\nKripya receipt verify karke batch access activate kar dein.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-slate-950" />
                        <span>Share Payment Screenshot on WhatsApp</span>
                      </a>
                    </div>
                  </div>

                </div>
              )}

              {/* Bank Details in Print Mode */}
              <div className="hidden print:block bg-slate-100 p-3.5 rounded-xl text-xs space-y-1 border border-slate-300">
                <div className="font-bold text-slate-800">Official Settlement Bank: {bankDetails.bankName}</div>
                <div>A/C Name: {bankDetails.accountName} | A/C No: {bankDetails.accountNumber} | IFSC: {bankDetails.ifscCode}</div>
                <div>UPI ID: {bankDetails.upiId} | Online Checkout: learnwithdrankita.com/register</div>
              </div>

              {/* Signature Footer */}
              <div className="pt-6 flex items-end justify-between border-t border-slate-200 text-xs">
                <div className="text-[11px] text-slate-400 max-w-sm leading-relaxed">
                  * This is an officially generated electronic fee invoice &amp; admission confirmation slip issued by Dr. Ankita Bisht Academic Academy.
                </div>

                <div className="text-center space-y-1">
                  <div className="w-28 h-9 border-b border-slate-400 mx-auto flex items-end justify-center font-display italic text-brand-900 font-bold text-sm">
                    Dr. Ankita Bisht
                  </div>
                  <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Authorized Signatory
                  </div>
                  <div className="text-[9px] text-slate-400">Chief Educator &amp; Founder</div>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
};
