import React, { useState } from 'react';
import { 
  Key, 
  Download, 
  RotateCcw, 
  CheckCircle2, 
  PhoneCall, 
  AlertTriangle
} from 'lucide-react';

interface AdminSettingsTabProps {
  currentPasscode: string;
  onUpdatePasscode: (newPasscode: string) => void;
  onResetData: () => void;
  onExportCSV: () => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  currentPasscode,
  onUpdatePasscode,
  onResetData,
  onExportCSV
}) => {
  const [passcodeForm, setPasscodeForm] = useState({
    oldPasscode: '',
    newPasscode: '',
    confirmPasscode: ''
  });
  const [passcodeSuccess, setPasscodeSuccess] = useState(false);
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError(null);
    setPasscodeSuccess(false);

    if (passcodeForm.oldPasscode !== currentPasscode) {
      setPasscodeError('Current passcode is incorrect.');
      return;
    }

    if (passcodeForm.newPasscode.length < 4) {
      setPasscodeError('New passcode must be at least 4 characters long.');
      return;
    }

    if (passcodeForm.newPasscode !== passcodeForm.confirmPasscode) {
      setPasscodeError('New passcodes do not match.');
      return;
    }

    onUpdatePasscode(passcodeForm.newPasscode);
    setPasscodeSuccess(true);
    setPasscodeForm({ oldPasscode: '', newPasscode: '', confirmPasscode: '' });
    setTimeout(() => setPasscodeSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-fadeIn">
      
      {/* Security Passcode Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-subtle space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Admin Access Passcode
            </h3>
            <p className="text-xs text-slate-500">
              Change the PIN / Passcode required to unlock the Admin Panel (/panel).
            </p>
          </div>
        </div>

        {passcodeSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Passcode successfully updated!</span>
          </div>
        )}

        {passcodeError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>{passcodeError}</span>
          </div>
        )}

        <form onSubmit={handlePasscodeSubmit} className="space-y-4 max-w-md text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Current Passcode</label>
            <input
              type="password"
              required
              value={passcodeForm.oldPasscode}
              onChange={(e) => setPasscodeForm({ ...passcodeForm, oldPasscode: e.target.value })}
              placeholder="Enter current passcode"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">New Passcode</label>
              <input
                type="password"
                required
                value={passcodeForm.newPasscode}
                onChange={(e) => setPasscodeForm({ ...passcodeForm, newPasscode: e.target.value })}
                placeholder="New passcode"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Confirm New</label>
              <input
                type="password"
                required
                value={passcodeForm.confirmPasscode}
                onChange={(e) => setPasscodeForm({ ...passcodeForm, confirmPasscode: e.target.value })}
                placeholder="Repeat new passcode"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-brand-700 hover:bg-brand-600 text-white font-bold py-2.5 px-5 rounded-xl shadow transition-colors cursor-pointer"
          >
            Update Admin Passcode
          </button>
        </form>
      </div>

      {/* Admissions Contact & Helpline Reference */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-subtle space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Admissions Notification Contacts
            </h3>
            <p className="text-xs text-slate-500">
              Inquiries and payment notifications are delivered to these registered contacts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="font-bold text-slate-800 block mb-1">Helpline Mobile / WhatsApp:</span>
            <span className="font-mono text-brand-700 font-bold">+91 7417268651</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="font-bold text-slate-800 block mb-1">Admissions Email:</span>
            <span className="font-mono text-brand-700 font-bold">abbisht241@gmail.com</span>
          </div>
        </div>
      </div>

      {/* Data Backup & Reset Actions */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-subtle space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Data Backup &amp; Reset
            </h3>
            <p className="text-xs text-slate-500">
              Export student registrations or reset data to default seed.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={onExportCSV}
            className="bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-brand-200 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download All Students CSV</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset demo seed data? Your saved custom students will be restored.')) {
                onResetData();
                alert('Data reset to initial state.');
              }
            }}
            className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-rose-200 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restore Default Sample Data</span>
          </button>
        </div>
      </div>

    </div>
  );
};
