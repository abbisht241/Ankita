import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Plus, 
  Trash2, 
  Clock, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  ChevronUp, 
  ChevronDown, 
  Check, 
  FileText 
} from 'lucide-react';
import type { Course } from '../../types';

interface CourseSyllabusEditorModalProps {
  course: Course;
  onSave: (updatedCourse: Course) => void;
  onClose: () => void;
}

const PRESET_EXAMS = [
  'UGC NET Paper 1',
  'UGC NET JRF',
  'Ph.D. Entrance PET',
  'State SET / SLET',
  'Assistant Professor Exam',
  'CDP & Pedagogy (CTET/TET)'
];

export const CourseSyllabusEditorModal: React.FC<CourseSyllabusEditorModalProps> = ({
  course,
  onSave,
  onClose
}) => {
  const [draft, setDraft] = useState<Course>(() => JSON.parse(JSON.stringify(course)));
  const [activeTab, setActiveTab] = useState<'modules' | 'outcomes' | 'overview'>('modules');

  // Input states for quick additions
  const [newExamInput, setNewExamInput] = useState('');
  const [newBenefitInput, setNewBenefitInput] = useState('');
  const [newHighlightInput, setNewHighlightInput] = useState('');

  // -------------------------------------------------------------
  // Unit Modules Handlers
  // -------------------------------------------------------------
  const handleAddModule = () => {
    const nextIndex = (draft.syllabusModules || []).length + 1;
    const newModule = {
      unitNumber: `Unit ${nextIndex}`,
      unitTitle: `New Unit Title`,
      hours: '12 Hours',
      topics: [
        'Overview & Fundamental Concepts',
        'Key Theoretical Frameworks & Practice Questions'
      ]
    };

    setDraft(prev => ({
      ...prev,
      syllabusModules: [...(prev.syllabusModules || []), newModule]
    }));
  };

  const handleUpdateModule = (
    index: number,
    field: 'unitNumber' | 'unitTitle' | 'hours',
    val: string
  ) => {
    const updated = [...(draft.syllabusModules || [])];
    if (!updated[index]) return;
    updated[index] = { ...updated[index], [field]: val };
    setDraft(prev => ({ ...prev, syllabusModules: updated }));
  };

  const handleUpdateTopicsText = (index: number, text: string) => {
    const lines = text.split('\n');
    const updated = [...(draft.syllabusModules || [])];
    if (!updated[index]) return;
    updated[index] = { ...updated[index], topics: lines };
    setDraft(prev => ({ ...prev, syllabusModules: updated }));
  };

  const handleMoveModule = (index: number, direction: 'up' | 'down') => {
    const modules = [...(draft.syllabusModules || [])];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= modules.length) return;

    const temp = modules[index];
    modules[index] = modules[targetIdx];
    modules[targetIdx] = temp;

    setDraft(prev => ({ ...prev, syllabusModules: modules }));
  };

  const handleDeleteModule = (index: number) => {
    const mod = draft.syllabusModules?.[index];
    const title = mod?.unitTitle || `Unit #${index + 1}`;
    if (confirm(`Kya aap "${title}" module ko delete karna chahte hain?`)) {
      const filtered = (draft.syllabusModules || []).filter((_, i) => i !== index);
      setDraft(prev => ({ ...prev, syllabusModules: filtered }));
    }
  };

  // -------------------------------------------------------------
  // Target Exams Handlers
  // -------------------------------------------------------------
  const handleAddExam = (exam: string) => {
    const trimmed = exam.trim();
    if (!trimmed) return;
    if (draft.targetExams?.includes(trimmed)) return;
    setDraft(prev => ({
      ...prev,
      targetExams: [...(prev.targetExams || []), trimmed]
    }));
    setNewExamInput('');
  };

  const handleRemoveExam = (index: number) => {
    setDraft(prev => ({
      ...prev,
      targetExams: (prev.targetExams || []).filter((_, i) => i !== index)
    }));
  };

  // -------------------------------------------------------------
  // Key Benefits Handlers
  // -------------------------------------------------------------
  const handleAddBenefit = () => {
    const trimmed = newBenefitInput.trim();
    if (!trimmed) return;
    setDraft(prev => ({
      ...prev,
      keyBenefits: [...(prev.keyBenefits || []), trimmed]
    }));
    setNewBenefitInput('');
  };

  const handleUpdateBenefit = (index: number, val: string) => {
    const updated = [...(draft.keyBenefits || [])];
    updated[index] = val;
    setDraft(prev => ({ ...prev, keyBenefits: updated }));
  };

  const handleRemoveBenefit = (index: number) => {
    setDraft(prev => ({
      ...prev,
      keyBenefits: (prev.keyBenefits || []).filter((_, i) => i !== index)
    }));
  };

  // -------------------------------------------------------------
  // Highlights Handlers
  // -------------------------------------------------------------
  const handleAddHighlight = () => {
    const trimmed = newHighlightInput.trim();
    if (!trimmed) return;
    setDraft(prev => ({
      ...prev,
      highlights: [...(prev.highlights || []), trimmed]
    }));
    setNewHighlightInput('');
  };

  const handleUpdateHighlight = (index: number, val: string) => {
    const updated = [...(draft.highlights || [])];
    updated[index] = val;
    setDraft(prev => ({ ...prev, highlights: updated }));
  };

  const handleRemoveHighlight = (index: number) => {
    setDraft(prev => ({
      ...prev,
      highlights: (prev.highlights || []).filter((_, i) => i !== index)
    }));
  };

  // -------------------------------------------------------------
  // Final Save Handler
  // -------------------------------------------------------------
  const handleSave = () => {
    // Sanitize modules and topics
    const cleanedModules = (draft.syllabusModules || []).map(m => ({
      unitNumber: (m.unitNumber || '').trim(),
      unitTitle: (m.unitTitle || '').trim(),
      hours: (m.hours || '').trim(),
      topics: (m.topics || [])
        .map(t => t.trim())
        .filter(Boolean)
    }));

    const cleanedCourse: Course = {
      ...draft,
      syllabusModules: cleanedModules,
      targetExams: (draft.targetExams || []).map(e => e.trim()).filter(Boolean),
      keyBenefits: (draft.keyBenefits || []).map(b => b.trim()).filter(Boolean),
      highlights: (draft.highlights || []).map(h => h.trim()).filter(Boolean),
      liveHours: (draft.liveHours || '').trim(),
      fullDesc: (draft.fullDesc || '').trim()
    };

    onSave(cleanedCourse);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 relative max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-700 text-white flex items-center justify-center shadow-md shadow-brand-700/20 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-brand-100 text-brand-800 px-2 py-0.5 rounded-md">
                  Syllabus &amp; Curriculum Editor
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  {draft.category}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 line-clamp-1 mt-0.5">
                {draft.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-200 p-2 rounded-full border border-slate-200 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6 pt-2 shrink-0 gap-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('modules')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'modules'
                ? 'border-brand-700 text-brand-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Unit-by-Unit Modules ({draft.syllabusModules?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('outcomes')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'outcomes'
                ? 'border-brand-700 text-brand-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Target Exams &amp; Outcomes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'border-brand-700 text-brand-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Highlights &amp; Live Hours</span>
          </button>
        </div>

        {/* Scrollable Tab Content Area */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 bg-slate-50/50">

          {/* TAB 1: UNIT MODULES BREAKDOWN */}
          {activeTab === 'modules' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-brand-700" />
                    <span>Detailed Unit-wise Curriculum</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Each unit shows as a separate card on the website syllabus modal with topics bulleted.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddModule}
                  className="bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Unit Module</span>
                </button>
              </div>

              {(!draft.syllabusModules || draft.syllabusModules.length === 0) ? (
                <div className="text-center py-10 bg-white rounded-2xl border-2 border-dashed border-slate-300 p-6">
                  <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-slate-700 text-sm">No Syllabus Modules Added Yet</p>
                  <p className="text-xs text-slate-400 mt-1 mb-4">Add modules to display the complete curriculum to students.</p>
                  <button
                    type="button"
                    onClick={handleAddModule}
                    className="bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create First Unit</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {draft.syllabusModules.map((module, mIdx) => (
                    <div 
                      key={mIdx}
                      className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs space-y-3 hover:border-brand-300 transition-colors"
                    >
                      {/* Top Bar of Module Card */}
                      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-brand-50 text-brand-800 font-bold text-xs flex items-center justify-center border border-brand-200">
                            {mIdx + 1}
                          </span>
                          <span className="font-bold text-xs text-slate-700">Module #{mIdx + 1}</span>
                        </div>

                        {/* Reorder and Delete Actions */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={mIdx === 0}
                            onClick={() => handleMoveModule(mIdx, 'up')}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                            title="Move Unit Up"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={mIdx === draft.syllabusModules.length - 1}
                            onClick={() => handleMoveModule(mIdx, 'down')}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                            title="Move Unit Down"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteModule(mIdx)}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 ml-1 cursor-pointer"
                            title="Delete this Unit"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Unit Basic Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-600 text-[11px] mb-1">
                            Unit / Module Label
                          </label>
                          <input
                            type="text"
                            value={module.unitNumber}
                            onChange={(e) => handleUpdateModule(mIdx, 'unitNumber', e.target.value)}
                            placeholder="e.g. Unit 1 or Module 1"
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold text-brand-800 bg-white"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block font-semibold text-slate-600 text-[11px] mb-1">
                            Unit Title *
                          </label>
                          <input
                            type="text"
                            value={module.unitTitle}
                            onChange={(e) => handleUpdateModule(mIdx, 'unitTitle', e.target.value)}
                            placeholder="e.g. Teaching Aptitude &amp; Core Concepts"
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-600 text-[11px] mb-1">
                            Duration / Hours
                          </label>
                          <div className="relative">
                            <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                            <input
                              type="text"
                              value={module.hours}
                              onChange={(e) => handleUpdateModule(mIdx, 'hours', e.target.value)}
                              placeholder="e.g. 12 Hours"
                              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-700 bg-white"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2 flex items-end justify-between pb-1">
                          <span className="text-[11px] text-slate-400 font-medium">
                            {module.topics?.filter(t => t.trim()).length || 0} topic bullets listed below
                          </span>
                        </div>
                      </div>

                      {/* Topics Textarea (One topic per line) */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block font-bold text-slate-700 text-[11px]">
                            Topics Covered (Enter 1 topic per line)
                          </label>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                            Line Break = New Bullet
                          </span>
                        </div>
                        <textarea
                          rows={4}
                          value={(module.topics || []).join('\n')}
                          onChange={(e) => handleUpdateTopicsText(mIdx, e.target.value)}
                          placeholder="Levels of Teaching (Memory, Understanding, Reflective)&#10;Learner Characteristics & Individual Differences&#10;Modern Evaluation Systems & ICT in Teaching"
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs text-slate-800 font-normal leading-relaxed focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">
                          💡 Type or paste topics here. Each new line will show as an individual bullet point in the syllabus modal.
                        </p>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TARGET EXAMS & KEY OUTCOMES */}
          {activeTab === 'outcomes' && (
            <div className="space-y-6">

              {/* Target Examinations Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-brand-700" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Target Examinations (Chips)
                  </h4>
                </div>
                <p className="text-xs text-slate-500">
                  Target exams displayed at the top of the course curriculum popup.
                </p>

                {/* Current Exam Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(draft.targetExams || []).map((exam, eIdx) => (
                    <span 
                      key={eIdx}
                      className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-800 text-xs font-bold px-3 py-1 rounded-xl border border-brand-200"
                    >
                      <span>{exam}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExam(eIdx)}
                        className="text-brand-400 hover:text-brand-800 p-0.5 rounded cursor-pointer"
                        title="Remove exam"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  {(!draft.targetExams || draft.targetExams.length === 0) && (
                    <span className="text-xs text-slate-400 italic">No exams added yet</span>
                  )}
                </div>

                {/* Add Custom Exam */}
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newExamInput}
                    onChange={(e) => setNewExamInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddExam(newExamInput);
                      }
                    }}
                    placeholder="Type exam name and press Enter (e.g. UGC NET JRF)"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddExam(newExamInput)}
                    className="bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer shadow-xs"
                  >
                    + Add Exam
                  </button>
                </div>

                {/* Preset Suggestions */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-500 mb-1.5">Quick Presets:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_EXAMS.map((preset, pIdx) => {
                      const alreadyAdded = draft.targetExams?.includes(preset);
                      return (
                        <button
                          key={pIdx}
                          type="button"
                          disabled={alreadyAdded}
                          onClick={() => handleAddExam(preset)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-colors cursor-pointer ${
                            alreadyAdded 
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-brand-400 hover:text-brand-700'
                          }`}
                        >
                          + {preset}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Key Preparation Outcomes Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Key Preparation Outcomes
                  </h4>
                </div>
                <p className="text-xs text-slate-500">
                  Key outcomes displayed with green checkmarks in the syllabus modal.
                </p>

                {/* List of Outcomes */}
                <div className="space-y-2 pt-1">
                  {(draft.keyBenefits || []).map((benefit, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => handleUpdateBenefit(bIdx, e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-white text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveBenefit(bIdx)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Delete outcome"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Outcome */}
                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <input
                    type="text"
                    value={newBenefitInput}
                    onChange={(e) => setNewBenefitInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddBenefit();
                      }
                    }}
                    placeholder="e.g. Master all 10 Paper 1 units with high-yield short notes"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddBenefit}
                    className="bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer shadow-xs shrink-0"
                  >
                    + Add Outcome
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: HIGHLIGHTS & LIVE HOURS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">

              {/* What's Included / Highlights Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    What's Included / Course Highlights
                  </h4>
                </div>
                <p className="text-xs text-slate-500">
                  Bullet points shown directly on the course card under "WHAT'S INCLUDED".
                </p>

                {/* List of Highlights */}
                <div className="space-y-2 pt-1">
                  {(draft.highlights || []).map((highlight, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                      <input
                        type="text"
                        value={highlight}
                        onChange={(e) => handleUpdateHighlight(hIdx, e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-white text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(hIdx)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Delete highlight"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Highlight */}
                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <input
                    type="text"
                    value={newHighlightInput}
                    onChange={(e) => setNewHighlightInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddHighlight();
                      }
                    }}
                    placeholder="e.g. 60+ Live Interactive Classes with Recordings"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer shadow-xs shrink-0"
                  >
                    + Add Highlight
                  </button>
                </div>
              </div>

              {/* Live Hours & Full Description Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-700" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Course Live Hours &amp; Comprehensive Description
                  </h4>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 text-xs mb-1">
                    Live Hours Badge
                  </label>
                  <input
                    type="text"
                    value={draft.liveHours || ''}
                    onChange={(e) => setDraft({ ...draft, liveHours: e.target.value })}
                    placeholder="e.g. 60+ Live Interactive Hours"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 text-xs mb-1">
                    Full Description (Overview)
                  </label>
                  <textarea
                    rows={4}
                    value={draft.fullDesc || ''}
                    onChange={(e) => setDraft({ ...draft, fullDesc: e.target.value })}
                    placeholder="Comprehensive description of the course content, mentorship, and exam strategy..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white leading-relaxed"
                  />
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500 text-center sm:text-left">
            ✨ Changes will update this course. Remember to click <b>"Save &amp; Publish Live Website"</b> in the top bar to go live.
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
            >
              Discard &amp; Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md hover:shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save &amp; Apply Curriculum</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
