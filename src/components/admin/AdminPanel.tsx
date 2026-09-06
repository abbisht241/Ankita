import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Users, 
  PhoneCall, 
  BookOpen, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  Menu, 
  X,
  Key,
  Share2,
  CreditCard,
  FileText
} from 'lucide-react';
import { AdminStorage, type StudentEnrollment, type LeadInquiry, type BatchConfig } from '../../services/adminStorageService';
import { AdminDashboardTab } from './AdminDashboardTab';
import { AdminStudentsTab } from './AdminStudentsTab';
import { AdminPaymentsTab } from './AdminPaymentsTab';
import { AdminInvoicesTab } from './AdminInvoicesTab';
import { AdminShareLinkTab } from './AdminShareLinkTab';
import { AdminInquiriesTab } from './AdminInquiriesTab';
import { AdminBatchesTab } from './AdminBatchesTab';
import { AdminSettingsTab } from './AdminSettingsTab';

interface AdminPanelProps {
  onBackToWebsite: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToWebsite }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcodeAttempt, setPasscodeAttempt] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'payments' | 'invoices' | 'share-link' | 'inquiries' | 'batches' | 'settings'>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);

  // Live Data States
  const [students, setStudents] = useState<StudentEnrollment[]>([]);
  const [inquiries, setInquiries] = useState<LeadInquiry[]>([]);
  const [batches, setBatches] = useState<BatchConfig[]>([]);
  const [currentPasscode, setCurrentPasscode] = useState(AdminStorage.getPasscode());

  const refreshData = async () => {
    // 1. Instant local cache render
    setStudents(AdminStorage.getStudents());
    setInquiries(AdminStorage.getInquiries());
    setBatches(AdminStorage.getBatches());
    setCurrentPasscode(AdminStorage.getPasscode());

    // 2. Fetch live global cloud data
    try {
      const [remoteStudents, remoteInquiries, remoteBatches] = await Promise.all([
        AdminStorage.fetchRemoteStudents(),
        AdminStorage.fetchRemoteInquiries(),
        AdminStorage.fetchRemoteBatches()
      ]);
      setStudents(remoteStudents);
      setInquiries(remoteInquiries);
      setBatches(remoteBatches);
    } catch (e) {
      console.warn('Cloud sync error', e);
    }
  };

  useEffect(() => {
    setIsAuthenticated(AdminStorage.isAuthenticated());
    refreshData();

    // Auto-sync live inquiries and students every 5 seconds
    const interval = setInterval(() => {
      refreshData();
    }, 5000);

    // Disallow Google & Search Engines from indexing this panel
    let robotsMeta = document.querySelector('meta[name="robots"]');
    const originalContent = robotsMeta ? robotsMeta.getAttribute('content') : 'index, follow';
    const originalTitle = document.title;

    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', 'noindex, nofollow, noarchive, nosnippet');
    document.title = 'Faculty & Admin Console | Dr. Ankita Bisht';

    return () => {
      clearInterval(interval);
      if (robotsMeta) {
        robotsMeta.setAttribute('content', originalContent || 'index, follow');
      }
      document.title = originalTitle;
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = AdminStorage.login(passcodeAttempt.trim());
    if (success) {
      setIsAuthenticated(true);
      setLoginError(null);
      refreshData();
    } else {
      setLoginError('Invalid Passcode. Please enter the correct admin passcode.');
    }
  };

  const handleLogout = () => {
    AdminStorage.logout();
    setIsAuthenticated(false);
    setPasscodeAttempt('');
  };

  const handleAddStudent = async (studentData: Omit<StudentEnrollment, 'id' | 'enrolledAt'>) => {
    await AdminStorage.addStudent(studentData);
    refreshData();
  };

  const handleMarkStudentPaid = async (id: string) => {
    // 1. Optimistically update local state immediately
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          amount: 999,
          feeDue: 0,
          paymentStatus: 'paid',
          status: 'active',
          notes: 'Payment verified and confirmed by Admin'
        };
      }
      return s;
    }));

    // 2. Persist to storage & cloud
    await AdminStorage.markStudentPaid(id);
    await refreshData();
  };

  const handleDeleteStudent = async (id: string) => {
    await AdminStorage.deleteStudent(id);
    refreshData();
  };

  const handleUpdateInquiryStatus = async (id: string, status: LeadInquiry['status'], notes?: string) => {
    await AdminStorage.updateInquiryStatus(id, status, notes);
    refreshData();
  };

  const handleDeleteInquiry = async (id: string) => {
    await AdminStorage.deleteInquiry(id);
    refreshData();
  };

  const handleEnrollLead = async (
    inquiryId: string, 
    studentData: Omit<StudentEnrollment, 'id' | 'enrolledAt'>,
    generateInvoice: boolean = true
  ): Promise<StudentEnrollment> => {
    // 1. Add student record
    const newStudent = await AdminStorage.addStudent(studentData);

    // 2. Auto-generate invoice if requested
    if (generateInvoice) {
      const isPaid = studentData.paymentStatus === 'paid';
      const amt = isPaid ? (Number(studentData.amount) || 999) : (Number(studentData.feeDue) || 999);
      await AdminStorage.addInvoice({
        studentId: newStudent.id,
        studentName: studentData.name,
        studentPhone: studentData.phone,
        studentEmail: studentData.email,
        studentCity: 'India',
        courseId: studentData.courseId,
        courseTitle: studentData.courseTitle,
        subtotal: amt,
        discount: 0,
        totalAmount: amt,
        dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
        status: isPaid ? 'paid' : 'pending',
        paymentMode: isPaid ? (studentData.paymentMode || 'upi_direct') : undefined,
        notes: `Converted from Demo Lead (${inquiryId})`
      });
    }

    // 3. Mark inquiry status as 'enrolled'
    await AdminStorage.updateInquiryStatus(
      inquiryId, 
      'enrolled', 
      `Enrolled in ${studentData.courseTitle} (Ref: ${newStudent.id})`
    );

    // 4. Refresh live data
    await refreshData();
    return newStudent;
  };

  const handleUpdateBatch = async (id: string, updates: Partial<BatchConfig>) => {
    await AdminStorage.updateBatch(id, updates);
    refreshData();
  };

  const handleUpdatePasscode = (newPasscode: string) => {
    AdminStorage.setPasscode(newPasscode);
    setCurrentPasscode(newPasscode);
  };

  const handleResetData = () => {
    AdminStorage.resetAllData();
    refreshData();
  };

  const handleExportCSV = () => {
    AdminStorage.exportStudentsCSV();
  };

  // 1. Passcode Gate Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-600/20 blur-3xl rounded-full pointer-events-none" />

        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 relative z-10 space-y-6 animate-scaleUp">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-brand-700 flex items-center justify-center text-white mx-auto shadow-md shadow-brand-700/30">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 font-display">
              Admin Access Gate
            </h2>
            <p className="text-xs text-slate-500">
              Dr. Ankita Bisht Academy Management Portal
            </p>
          </div>

          {loginError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs font-semibold animate-fadeIn text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Enter Admin Security Passcode
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  autoFocus
                  value={passcodeAttempt}
                  onChange={(e) => setPasscodeAttempt(e.target.value)}
                  placeholder="e.g. ankita2026"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-center tracking-widest"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-700 hover:bg-brand-600 text-white font-extrabold text-sm py-3.5 px-4 rounded-xl shadow-lg transition-all cursor-pointer"
            >
              Unlock Admin Console
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <button
              onClick={onBackToWebsite}
              className="hover:text-brand-600 font-medium flex items-center gap-1 cursor-pointer"
            >
              ← Back to Main Website
            </button>
            <span className="font-mono text-[11px] text-slate-400">Default: ankita2026</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Full Admin Dashboard Layout
  interface NavItem {
    id: 'dashboard' | 'students' | 'payments' | 'invoices' | 'share-link' | 'inquiries' | 'batches' | 'settings';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    badgeStyle?: string;
  }

  const pendingPaymentsCount = students.filter(s => s.paymentStatus === 'pending' || s.amount === 0 || s.status === 'pending_payment').length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'students', label: 'Students & Enrollments', icon: Users, badge: students.length },
    { id: 'inquiries', label: 'Demo Leads & Inquiries 📞', icon: PhoneCall, badge: inquiries.filter(i => i.status === 'new').length },
    { 
      id: 'payments', 
      label: 'Payments & Fee Ledger 💳', 
      icon: CreditCard, 
      badge: pendingPaymentsCount > 0 ? `${pendingPaymentsCount} Due` : `${students.length} Trans.`,
      badgeStyle: pendingPaymentsCount > 0 ? 'bg-amber-400 text-slate-950 font-extrabold' : 'bg-emerald-100 text-emerald-800 font-bold'
    },
    { 
      id: 'invoices', 
      label: 'Invoices & Billing 🧾', 
      icon: FileText 
    },
    { id: 'share-link', label: 'Share Registration Link 🔗', icon: Share2 },
    { id: 'batches', label: 'Batch & Class Links', icon: BookOpen },
    { id: 'settings', label: 'Settings & Security', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      
      {/* Top Navbar */}
      <header className="bg-slate-950 text-white sticky top-0 z-30 border-b border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          
          {/* Brand & Mode */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="p-1.5 rounded-lg bg-slate-900 md:hidden text-slate-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-700 flex items-center justify-center text-white shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm sm:text-base tracking-tight text-white block">
                  Dr. Ankita Bisht Academy
                </span>
                <span className="text-[10px] text-slate-400 font-medium -mt-0.5 block">
                  Management Console (learnwithdrankita.com/panel)
                </span>
              </div>
            </div>
          </div>

          {/* Right Live Gateway Status & Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Razorpay Live Active</span>
            </span>

            <button
              onClick={onBackToWebsite}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleLogout}
              className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-rose-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Logout from Admin Panel"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main App Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col md:flex-row gap-6 w-full">
        
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 shrink-0 space-y-2">
          <div className="bg-white p-3 rounded-3xl border border-slate-200/90 shadow-subtle space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-brand-700 text-white shadow-md shadow-brand-700/20'
                      : 'text-slate-600 hover:text-brand-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge !== '' && (
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isActive 
                        ? 'bg-white text-brand-700' 
                        : (item.badgeStyle || 'bg-brand-50 text-brand-700')
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Help Card */}
          <div className="bg-gradient-to-br from-brand-900 to-navy-950 p-5 rounded-3xl text-white space-y-2 shadow-lg">
            <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Admissions Support</span>
            </div>
            <p className="text-xs text-brand-200 leading-relaxed">
              Helpline: <strong>+91 7417268651</strong>
            </p>
            <p className="text-[11px] text-slate-400">
              Payments auto-sync directly via Razorpay webhook / API.
            </p>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs md:hidden flex">
            <div className="bg-white w-72 h-full p-5 space-y-4 flex flex-col justify-between animate-fadeIn">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="font-extrabold text-sm text-slate-900">Admin Navigation</span>
                  <button onClick={() => setMobileSidebarOpen(false)} className="text-slate-400 p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as any);
                          setMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-brand-700 text-white'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && item.badge !== '' && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.badgeStyle || 'bg-brand-100 text-brand-800'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={onBackToWebsite}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  <span>Back to Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Tabs Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && (
            <AdminDashboardTab
              students={students}
              inquiries={inquiries}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenAddStudentModal={() => {
                setActiveTab('students');
                setIsOpenAddModal(true);
              }}
              onExportCSV={handleExportCSV}
            />
          )}

          {activeTab === 'students' && (
            <AdminStudentsTab
              students={students}
              onAddStudent={handleAddStudent}
              onMarkPaid={handleMarkStudentPaid}
              onDeleteStudent={handleDeleteStudent}
              onExportCSV={handleExportCSV}
              isOpenAddModal={isOpenAddModal}
              onCloseAddModal={() => setIsOpenAddModal(false)}
              onOpenAddModal={() => setIsOpenAddModal(true)}
            />
          )}

          {activeTab === 'payments' && (
            <AdminPaymentsTab
              students={students}
              onMarkPaid={handleMarkStudentPaid}
              onExportCSV={handleExportCSV}
            />
          )}

          {activeTab === 'invoices' && (
            <AdminInvoicesTab
              students={students}
              onRefreshData={refreshData}
            />
          )}

          {activeTab === 'share-link' && (
            <AdminShareLinkTab />
          )}

          {activeTab === 'inquiries' && (
            <AdminInquiriesTab
              inquiries={inquiries}
              students={students}
              onUpdateStatus={handleUpdateInquiryStatus}
              onDeleteInquiry={handleDeleteInquiry}
              onEnrollLead={handleEnrollLead}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'batches' && (
            <AdminBatchesTab
              batches={batches}
              students={students}
              onUpdateBatch={handleUpdateBatch}
            />
          )}

          {activeTab === 'settings' && (
            <AdminSettingsTab
              currentPasscode={currentPasscode}
              onUpdatePasscode={handleUpdatePasscode}
              onResetData={handleResetData}
              onExportCSV={handleExportCSV}
            />
          )}
        </main>

      </div>

    </div>
  );
};
