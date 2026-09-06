import React, { useState } from 'react';
import { 
  Video, 
  Users, 
  Clock, 
  Calendar, 
  ExternalLink, 
  Save, 
  CheckCircle2,
  MessageCircle
} from 'lucide-react';
import type { BatchConfig, StudentEnrollment } from '../../services/adminStorageService';

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
      
      {/* Tab Header Banner */}
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
