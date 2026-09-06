import React, { useState } from 'react';
import { 
  MessageCircle, 
  PhoneCall, 
  Trash2, 
  Mail, 
  Clock, 
  Search,
  Sparkles
} from 'lucide-react';
import type { LeadInquiry } from '../../services/adminStorageService';

interface AdminInquiriesTabProps {
  inquiries: LeadInquiry[];
  onUpdateStatus: (id: string, status: LeadInquiry['status'], notes?: string) => void;
  onDeleteInquiry: (id: string) => void;
}

export const AdminInquiriesTab: React.FC<AdminInquiriesTabProps> = ({
  inquiries,
  onUpdateStatus,
  onDeleteInquiry
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | LeadInquiry['status']>('all');

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
    <div className="space-y-6 animate-fadeIn">
      
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
          filteredInquiries.map((inq) => (
            <div
              key={inq.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-subtle hover:shadow-premium transition-all flex flex-col justify-between space-y-4"
            >
              <div>
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
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="font-semibold text-slate-800">Target: {inq.targetExam}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{inq.phone}</span>
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
                  <div className="mt-3 p-2 bg-slate-50 rounded-xl border border-slate-200/70 text-[11px] text-slate-600 italic">
                    "{inq.notes}"
                  </div>
                )}
              </div>

              {/* Action Controls */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                
                {/* Status Dropdown */}
                <select
                  value={inq.status}
                  onChange={(e) => onUpdateStatus(inq.id, e.target.value as any)}
                  className="text-xs bg-slate-100 border border-slate-200 rounded-lg px-2 py-1.5 font-medium text-slate-700 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="new">New Lead</option>
                  <option value="contacted">Contacted</option>
                  <option value="demo_scheduled">Demo Scheduled</option>
                  <option value="enrolled">Enrolled</option>
                  <option value="closed">Closed</option>
                </select>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`https://wa.me/91${inq.phone}?text=Namaste%20${encodeURIComponent(inq.name)},%20Dr.%20Ankita%20Bisht%20Academy%20se%20baat%20kar%20rahe%20hain.%20Aapne%20${encodeURIComponent(inq.targetExam)}%20ki%20demo%20class%20ke%20liye%20inquire%20kiya%20tha.`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white flex items-center justify-center transition-colors"
                    title="WhatsApp Message"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>

                  <a
                    href={`tel:+91${inq.phone}`}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-700 text-slate-700 hover:text-white flex items-center justify-center transition-colors"
                    title="Call Student"
                  >
                    <PhoneCall className="w-4 h-4" />
                  </a>

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
          ))
        )}
      </div>

    </div>
  );
};
