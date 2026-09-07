import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Users, 
  Clock, 
  Calendar, 
  ExternalLink, 
  Save, 
  CheckCircle2,
  MessageCircle,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Check,
  RotateCcw,
  Eye
} from 'lucide-react';
import { 
  AdminStorage, 
  DEFAULT_BATCH_TIMINGS, 
  type BatchConfig, 
  type StudentEnrollment 
} from '../../services/adminStorageService';

interface AdminBatchesTabProps {
  batches: BatchConfig[];
  students: StudentEnrollment[];
  onUpdateBatch: (id: string, updates: Partial<BatchConfig>) => void;
}

export const AdminBatchesTab: React.FC<AdminBatchesTabProps> = ({
  batches,
  students,
  onUpdateBatch
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<BatchConfig>>({});
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);

  // Preferred Batch Timings State (for Student Registration Dropdown)
  const [timings, setTimings] = useState<string[]>(() => AdminStorage.getBatchTimings());
  const [newTimingInput, setNewTimingInput] = useState('');
  const [isAddingTiming, setIsAddingTiming] = useState(false);
  const [editingTimingIdx, setEditingTimingIdx] = useState<number | null>(null);
  const [editingTimingValue, setEditingTimingValue] = useState('');
  const [timingSuccessMsg, setTimingSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    AdminStorage.fetchRemoteBatchTimings().then(remote => {
      if (Array.isArray(remote) && remote.length > 0) {
        setTimings(remote);
      }
    });
  }, []);

  const showTimingSuccess = (msg: string) => {
    setTimingSuccessMsg(msg);
    setTimeout(() => setTimingSuccessMsg(null), 3000);
  };

  const handleAddTiming = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = newTimingInput.trim();
    if (!val) return;
    if (timings.includes(val)) {
      alert('This timing slot already exists.');
      return;
    }
    const updated = [...timings, val];
    setTimings(updated);
    setNewTimingInput('');
    setIsAddingTiming(false);
    await AdminStorage.saveBatchTimings(updated);
    showTimingSuccess('New batch timing slot added and published to registration form!');
  };

  const handleSaveEditTiming = async (idx: number) => {
    const val = editingTimingValue.trim();
    if (!val) return;
    const updated = [...timings];
    updated[idx] = val;
    setTimings(updated);
    setEditingTimingIdx(null);
    await AdminStorage.saveBatchTimings(updated);
    showTimingSuccess('Batch timing updated successfully!');
  };

  const handleDeleteTiming = async (idx: number) => {
    const target = timings[idx];
    if (confirm(`Are you sure you want to remove "${target}" from student registration?`)) {
      const updated = timings.filter((_, i) => i !== idx);
      const finalList = updated.length > 0 ? updated : DEFAULT_BATCH_TIMINGS;
      setTimings(finalList);
      await AdminStorage.saveBatchTimings(finalList);
      showTimingSuccess('Batch timing slot deleted.');
    }
  };

  const handleMoveTiming = async (idx: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= timings.length) return;
    const updated = [...timings];
    const temp = updated[idx];
    updated[idx] = updated[newIdx];
    updated[newIdx] = temp;
    setTimings(updated);
    await AdminStorage.saveBatchTimings(updated);
    showTimingSuccess('Dropdown order updated!');
  };

  const handleResetTimings = async () => {
    if (confirm('Reset batch timings to the 4 default options?')) {
      setTimings(DEFAULT_BATCH_TIMINGS);
      await AdminStorage.saveBatchTimings(DEFAULT_BATCH_TIMINGS);
      showTimingSuccess('Batch timings reset to default options.');
    }
  };

  const handleStartEdit = (batch: BatchConfig) => {
    setEditingId(batch.id);
    setEditForm({ ...batch });
  };

  const handleSave = (id: string) => {
    onUpdateBatch(id, editForm);
    setEditingId(null);
    setSavedSuccessId(id);
    setTimeout(() => setSavedSuccessId(null), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. PREFERRED BATCH TIMINGS (FOR STUDENT REGISTRATION FORM) */}
      <div className="bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-brand-800/50 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-400/30 mb-2">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>Student Registration Field • learnwithdrankita.com/register</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-display text-white">
              Preferred Batch Timings (Admission Form Slots)
            </h3>
            <p className="text-xs text-brand-200 mt-1 max-w-2xl">
              Ye timing slots students ko admission form ke <strong>"Preferred Batch Timing *"</strong> dropdown me dikhte hain. Yahan se aap naye slots add kar sakte hain, existing edit kar sakte hain, ya delete kar sakte hain.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={() => setIsAddingTiming(!isAddingTiming)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-extrabold px-4 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingTiming ? 'Close Add Form' : '+ Add New Batch Timing'}</span>
            </button>
            <button
              onClick={handleResetTimings}
              className="bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-semibold px-3 py-2.5 rounded-xl border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Reset to 4 default timing options"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Success toast if updated */}
        {timingSuccessMsg && (
          <div className="bg-emerald-500/20 border border-emerald-400 text-emerald-200 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{timingSuccessMsg}</span>
          </div>
        )}

        {/* Add Timing Form */}
        {isAddingTiming && (
          <form onSubmit={handleAddTiming} className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 space-y-3 animate-fadeIn">
            <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Add New Preferred Batch Timing Slot</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                required
                value={newTimingInput}
                onChange={(e) => setNewTimingInput(e.target.value)}
                placeholder="e.g. Afternoon Batch (2:00 PM - 3:30 PM)"
                className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow cursor-pointer whitespace-nowrap"
              >
                Add Timing Slot ✓
              </button>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-brand-200">
              <span className="text-slate-400 font-medium">Quick Suggestions:</span>
              <button
                type="button"
                onClick={() => setNewTimingInput('Afternoon Batch (2:00 PM - 3:30 PM)')}
                className="bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded-md cursor-pointer"
              >
                + Afternoon (2:00 PM - 3:30 PM)
              </button>
              <button
                type="button"
                onClick={() => setNewTimingInput('Early Morning Batch (6:30 AM - 8:00 AM)')}
                className="bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded-md cursor-pointer"
              >
                + Early Morning (6:30 AM - 8:00 AM)
              </button>
              <button
                type="button"
                onClick={() => setNewTimingInput('Late Night Doubt Batch (10:00 PM - 11:15 PM)')}
                className="bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded-md cursor-pointer"
              >
                + Late Night (10:00 PM - 11:15 PM)
              </button>
            </div>
          </form>
        )}

        {/* Timings List & Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* List of Timings */}
          <div className="lg:col-span-8 space-y-2.5">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Active Timing Slots ({timings.length})</span>
              <span className="text-[11px] text-slate-400 normal-case">Use arrows to reorder in dropdown</span>
            </div>

            {timings.map((timing, idx) => {
              const isEditing = editingTimingIdx === idx;

              return (
                <div
                  key={idx}
                  className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between gap-3 transition-all"
                >
                  {isEditing ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={editingTimingValue}
                        onChange={(e) => setEditingTimingValue(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-slate-900 border border-emerald-400 rounded-lg text-xs text-white focus:outline-none"
                      />
                      <button
                        onClick={() => handleSaveEditTiming(idx)}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg cursor-pointer"
                      >
                        Save ✓
                      </button>
                      <button
                        onClick={() => setEditingTimingIdx(null)}
                        className="bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs px-2.5 py-1.5 rounded-lg cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-brand-800 text-amber-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div className="truncate">
                          <span className="font-bold text-white text-xs sm:text-sm block truncate">
                            {timing}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleMoveTiming(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveTiming(idx, 'down')}
                          disabled={idx === timings.length - 1}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingTimingIdx(idx);
                            setEditingTimingValue(timing);
                          }}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-300 hover:text-amber-200 cursor-pointer"
                          title="Edit Timing"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTiming(idx)}
                          className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-rose-200 cursor-pointer"
                          title="Delete Timing Slot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Student Form Live Preview */}
          <div className="lg:col-span-4 bg-white/5 rounded-2xl p-4 border border-white/10 flex flex-col justify-between space-y-3">
            <div>
              <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>Live Student Form Preview</span>
              </div>
              <div className="text-xs font-bold text-slate-200 mb-2">
                Preferred Batch Timing *
              </div>
              <div className="bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-300 space-y-1">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Previewing First Option:</div>
                <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{timings[0] || 'No timings configured'}</span>
                </div>
                <div className="text-slate-500 text-[10px] mt-1">
                  +{Math.max(0, timings.length - 1)} more option{timings.length > 2 ? 's' : ''} in dropdown
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <a
                href="/register"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-amber-300 hover:text-amber-200 flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <span>Open Live Registration Page</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TAB HEADER BANNER FOR COURSE PROGRAMS */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-brand-100 text-brand-800 text-xs font-bold px-2.5 py-0.5 rounded-md">
              Batch Schedules &amp; Links
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-display">
            Active Batch Management ({batches.length} Programs)
          </h3>
          <p className="text-xs text-slate-500">
            Set and update live class Zoom / Google Meet links and batch WhatsApp community groups.
          </p>
        </div>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {batches.map((batch) => {
          const batchStudentsCount = students.filter(s => s.courseId === batch.courseId).length;
          const isEditing = editingId === batch.id;

          return (
            <div
              key={batch.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-subtle hover:shadow-premium transition-all space-y-4 flex flex-col justify-between"
            >
              <div>
                {/* Top Info */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    batch.status === 'active' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {batch.status}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-xl">
                    <Users className="w-3.5 h-3.5" />
                    <span>{batchStudentsCount} Enrolled</span>
                  </div>
                </div>

                <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                  {batch.title}
                </h4>

                {/* Batch Config Details */}
                {isEditing ? (
                  <div className="mt-4 space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Class Timings</label>
                      <input
                        type="text"
                        value={editForm.timing || ''}
                        onChange={(e) => setEditForm({ ...editForm, timing: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Live Class Link (Google Meet / Zoom)</label>
                      <input
                        type="url"
                        value={editForm.liveClassLink || ''}
                        onChange={(e) => setEditForm({ ...editForm, liveClassLink: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">WhatsApp Group Invite Link</label>
                      <input
                        type="url"
                        value={editForm.whatsappGroupLink || ''}
                        onChange={(e) => setEditForm({ ...editForm, whatsappGroupLink: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleSave(batch.id)}
                        className="flex-1 bg-brand-700 hover:bg-brand-600 text-white font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 shadow"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Changes</span>
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                      <span><strong>Schedule:</strong> {batch.timing}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                      <span><strong>Start Date:</strong> {batch.startDate}</span>
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                      <a
                        href={batch.liveClassLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-brand-50 rounded-xl border border-slate-200/80 transition-colors group/link"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Video className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-slate-800 group-hover/link:text-brand-700 truncate">
                            Live Class Room Link
                          </span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </a>

                      <a
                        href={batch.whatsappGroupLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-emerald-50 rounded-xl border border-slate-200/80 transition-colors group/link"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-slate-800 group-hover/link:text-emerald-700 truncate">
                            Batch WhatsApp Community
                          </span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {!isEditing && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  {savedSuccessId === batch.id ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Updated Successfully!
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">Flat ₹999 / Student</span>
                  )}

                  <button
                    onClick={() => handleStartEdit(batch)}
                    className="text-xs font-bold text-brand-700 hover:text-brand-900 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Edit Links &amp; Timings
                  </button>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
