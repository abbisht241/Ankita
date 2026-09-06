import React from 'react';
import { 
  Users, 
  IndianRupee, 
  BookOpen, 
  UserPlus, 
  Download, 
  TrendingUp, 
  PhoneCall, 
  Calendar,
  MessageCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import type { StudentEnrollment, LeadInquiry } from '../../services/adminStorageService';

interface AdminDashboardTabProps {
  students: StudentEnrollment[];
  inquiries: LeadInquiry[];
  onNavigateTab: (tab: 'students' | 'inquiries' | 'batches' | 'settings') => void;
  onOpenAddStudentModal: () => void;
  onExportCSV: () => void;
}

export const AdminDashboardTab: React.FC<AdminDashboardTabProps> = ({
  students,
  inquiries,
  onNavigateTab,
  onOpenAddStudentModal,
  onExportCSV
}) => {
  const totalRevenue = students.reduce((sum, s) => sum + s.amount, 0);
  const paidStudentsCount = students.length;
  const newInquiriesCount = inquiries.filter(i => i.status === 'new').length;
  const activeBatchesCount = 6;

  const recentStudents = students.slice(0, 5);
  const recentInquiries = inquiries.slice(0, 5);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner Greeting */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-navy-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Admin Management Console</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
            Welcome back, Dr. Ankita Bisht &amp; Team 👋
          </h2>
          <p className="text-xs sm:text-sm text-brand-200 max-w-xl">
            Here is your live admissions overview, student enrollment registrations, and batch management metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <button
            onClick={onOpenAddStudentModal}
            className="bg-brand-600 hover:bg-brand-500 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Student</span>
          </button>
          <button
            onClick={onExportCSV}
            className="bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-500/10 blur-3xl rounded-full pointer-events-none" />
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-subtle hover:shadow-premium transition-all">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>100% Flat ₹999 Fee Standard</span>
          </p>
        </div>

        {/* Paid Students */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-subtle hover:shadow-premium transition-all">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Paid Students</span>
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            {paidStudentsCount}
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Active enrolled batch learners
          </p>
        </div>

        {/* Demo Inquiries */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-subtle hover:shadow-premium transition-all">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Inquiries</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            {newInquiriesCount} <span className="text-xs font-normal text-slate-400">/ {inquiries.length} total</span>
          </div>
          <p className="text-xs text-amber-600 font-semibold mt-1">
            Requires counselor follow-up
          </p>
        </div>

        {/* Active Batches */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-subtle hover:shadow-premium transition-all">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Batches</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            {activeBatchesCount}
          </div>
          <p className="text-xs text-indigo-600 font-semibold mt-1">
            UGC NET, CDP, Research &amp; SPSS
          </p>
        </div>

      </div>

      {/* Two Columns: Recent Registrations + Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Column 1: Recent Enrollments */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-600" />
                <span>Recent Enrollments</span>
              </h3>
              <p className="text-xs text-slate-500">Latest students enrolled via online gateway &amp; direct</p>
            </div>
            <button
              onClick={() => onNavigateTab('students')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-800 hover:underline cursor-pointer"
            >
              View All ({students.length}) →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentStudents.map((student) => (
              <div key={student.id} className="py-3.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 truncate">{student.name}</span>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      ₹{student.amount}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{student.courseTitle.split('(')[0]}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(student.enrolledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`https://wa.me/91${student.phone}?text=Namaste%20${encodeURIComponent(student.name)},%20Dr.%20Ankita%20Bisht%20Academy%20me%20aapka%20swagat%20hai!%20Aapka%20batch%20access%20active%20hai.`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-600 flex items-center justify-center transition-colors"
                    title="Send WhatsApp Welcome Message"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                  <a
                    href={`tel:+91${student.phone}`}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-800 hover:text-white text-slate-700 flex items-center justify-center transition-colors"
                    title="Call Student"
                  >
                    <PhoneCall className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Recent Demo / Inquiries */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>Recent Inquiries &amp; Demos</span>
              </h3>
              <p className="text-xs text-slate-500">Website leads requesting trial classes &amp; course details</p>
            </div>
            <button
              onClick={() => onNavigateTab('inquiries')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-800 hover:underline cursor-pointer"
            >
              View All ({inquiries.length}) →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentInquiries.map((inquiry) => (
              <div key={inquiry.id} className="py-3.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 truncate">{inquiry.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      inquiry.status === 'new' 
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {inquiry.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">Target: {inquiry.targetExam}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{inquiry.phone} • {inquiry.email}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`https://wa.me/91${inquiry.phone}?text=Namaste%20${encodeURIComponent(inquiry.name)},%20Dr.%20Ankita%20Bisht%20Academy%20se%20baat%20kar%20rahe%20hain.%20Aapne%20${encodeURIComponent(inquiry.targetExam)}%20ki%20demo%20class%20ke%20liye%20request%20kiya%20tha.`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-600 flex items-center justify-center transition-colors"
                    title="WhatsApp Student"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                  <a
                    href={`tel:+91${inquiry.phone}`}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-800 hover:text-white text-slate-700 flex items-center justify-center transition-colors"
                    title="Call Student"
                  >
                    <PhoneCall className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
