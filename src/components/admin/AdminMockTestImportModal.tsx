import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Upload, 
  FileSpreadsheet, 
  Copy, 
  Check, 
  CheckCircle2, 
  Trash2, 
  X, 
  Award, 
  FileText, 
  AlertCircle, 
  Download,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  parseQuestionsFromText, 
  parseQuestionsFromSpreadsheet, 
  downloadSampleExcelTemplate, 
  GEMINI_PROMPT_TEMPLATE,
  type ParseResult
} from '../../services/aiQuestionParserService';
import { 
  MockTestStorage, 
  type MockTest, 
  formatTestDuration, 
  calculateTestDurationMinutes 
} from '../../services/mockTestService';

interface AdminMockTestImportModalProps {
  existingTests: MockTest[];
  preSelectedTest?: MockTest | null;
  onClose: () => void;
  onSuccess: (updatedTests: MockTest[], message: string) => void;
}

export const AdminMockTestImportModal: React.FC<AdminMockTestImportModalProps> = ({
  existingTests,
  preSelectedTest = null,
  onClose,
  onSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'paste' | 'file' | 'prompt'>('paste');

  // Text input for AI paste
  const [rawText, setRawText] = useState('');
  
  // Parsed Questions state
  const [parseResult, setParseResult] = useState<ParseResult>({ questions: [], warnings: [], totalDetected: 0 });

  // File upload state
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Copy Feedback
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Target Destination Configuration
  const [importMode, setImportMode] = useState<'new' | 'existing'>(preSelectedTest ? 'existing' : 'new');
  const [targetTestId, setTargetTestId] = useState<string>(preSelectedTest?.id || (existingTests[0]?.id || ''));

  // New Test form fields
  const [newTestTitle, setNewTestTitle] = useState('UGC NET Paper 1 - All India CBT Mock Test 2026');
  const [newTestCategory, setNewTestCategory] = useState('UGC NET Paper 1');
  const [positiveMarks, setPositiveMarks] = useState(2);
  const [negativeMarks, setNegativeMarks] = useState(0);
  const [newTestDescription, setNewTestDescription] = useState('Comprehensive mock test covering core examination concepts with step-by-step rationales by Dr. Ankita Bisht.');

  // Auto-parse when raw text changes
  const handleTextChange = (text: string) => {
    setRawText(text);
    if (!text.trim()) {
      setParseResult({ questions: [], warnings: [], totalDetected: 0 });
      return;
    }
    const result = parseQuestionsFromText(text);
    setParseResult(result);
  };

  // Handle spreadsheet file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsProcessingFile(true);

    try {
      if (file.name.endsWith('.json') || file.name.endsWith('.txt')) {
        const text = await file.text();
        const result = parseQuestionsFromText(text);
        setParseResult(result);
      } else {
        const buffer = await file.arrayBuffer();
        const result = parseQuestionsFromSpreadsheet(buffer);
        setParseResult(result);
      }
    } catch (err: any) {
      setParseResult({
        questions: [],
        warnings: [`Failed to read file: ${err?.message || 'Invalid file format'}`],
        totalDetected: 0
      });
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(GEMINI_PROMPT_TEMPLATE);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 3000);
  };

  const handleRemoveParsedQuestion = (index: number) => {
    const updated = parseResult.questions.filter((_, i) => i !== index);
    setParseResult({
      ...parseResult,
      questions: updated,
      totalDetected: updated.length
    });
  };

  // Paste Sample Questions for immediate demonstration
  const handlePasteSample = () => {
    const sample = `Q1. Which of the following levels of teaching emphasizes on understanding relations, seeing patterns, and grasping meaning rather than rote memorization?
A) Memory Level (Herbartian Theory)
B) Understanding Level (Morrison Theory)
C) Reflective Level (Hunt Theory)
D) Autonomous Development Level
Correct Answer: B
Step-by-Step Solution & Conceptual Rationale: The Understanding Level of teaching propounded by H.C. Morrison focuses on the mastery of subject matter, exploring relationships, facts, and grasping generalizations rather than mere recall.
Subject: Teaching Aptitude
Topic: Levels of Teaching

Q2. In statistical research hypothesis testing, if the calculated p-value (Sig. 2-tailed) is 0.018 for an alpha level of 0.05, what is the appropriate research decision?
A) Accept the Null Hypothesis (H0)
B) Reject the Null Hypothesis (H0) and accept Alternate Hypothesis (H1)
C) Increase the sample size and repeat calculation
D) Data is insufficient for hypothesis decision
Correct Answer: B
Step-by-Step Solution & Conceptual Rationale: Decision Rule: When p-value < 0.05 (here 0.018 < 0.05), we reject the Null Hypothesis (H0) and conclude a statistically significant difference exists between experimental groups.
Subject: Research Methodology
Topic: Hypothesis Testing & Data Analysis

Q3. According to National Education Policy (NEP) 2020, what is the targeted Gross Enrolment Ratio (GER) in higher education by 2035?
A) 35%
B) 40%
C) 50%
D) 65%
Correct Answer: C
Step-by-Step Solution & Conceptual Rationale: NEP 2020 aims to increase the Gross Enrolment Ratio (GER) in higher education including vocational education from 26.3% (2018) to 50% by the year 2035.
Subject: Higher Education System
Topic: NEP 2020 Goals`;

    handleTextChange(sample);
  };

  // Final Action: Import questions
  const handleExecuteImport = async () => {
    if (parseResult.questions.length === 0) return;

    if (importMode === 'new') {
      // Create new MockTest
      const newTestId = `test-${Date.now().toString().slice(-5)}`;
      const newTest: MockTest = {
        id: newTestId,
        title: newTestTitle.trim() || 'UGC NET Paper 1 - CBT Mock Test 2026',
        category: newTestCategory,
        description: newTestDescription.trim(),
        durationMinutes: calculateTestDurationMinutes(parseResult.questions.length),
        totalMarks: parseResult.questions.length * positiveMarks,
        positiveMarks: positiveMarks,
        negativeMarks: negativeMarks,
        passingPercentage: 50,
        status: 'active',
        createdAt: new Date().toISOString(),
        questions: parseResult.questions
      };

      await MockTestStorage.saveTest(newTest);
      const updatedTests = MockTestStorage.getTests();

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      onSuccess(updatedTests, `Successfully created new Mock Test "${newTest.title}" with ${parseResult.questions.length} questions!`);
    } else {
      // Append to existing MockTest
      const existing = existingTests.find(t => t.id === targetTestId);
      if (!existing) {
        alert('Please select a valid existing mock test.');
        return;
      }

      const mergedQuestions = [...existing.questions, ...parseResult.questions];
      const updatedTest: MockTest = {
        ...existing,
        questions: mergedQuestions,
        durationMinutes: calculateTestDurationMinutes(mergedQuestions.length),
        totalMarks: mergedQuestions.length * (existing.positiveMarks || 2)
      };

      await MockTestStorage.saveTest(updatedTest);
      const updatedTests = MockTestStorage.getTests();

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      onSuccess(updatedTests, `Successfully added ${parseResult.questions.length} questions to "${existing.title}"! (Total: ${mergedQuestions.length} Questions)`);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 relative max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-400/20 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md">
                  AI &amp; Spreadsheet Importer
                </span>
                <span className="text-xs text-slate-300 hidden sm:inline">
                  Gemini • ChatGPT • Excel • CSV
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-display text-white mt-0.5">
                Import Mock Test &amp; Question Bank
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Quick Actions Bar (Copy Gemini Prompt & Download Excel Template) */}
        <div className="bg-amber-50/80 border-b border-amber-200/80 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-amber-950 font-medium text-center sm:text-left">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Generate high-yield questions with <b>Gemini AI</b> or prepare them in <b>Excel</b>, then paste or upload below!
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyPrompt}
              className="bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              {copiedPrompt ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Prompt Copied! ✓</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-700" />
                  <span>Copy Gemini Prompt</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => downloadSampleExcelTemplate()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Excel Template (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-slate-200 bg-white px-6 pt-2 shrink-0 gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'paste'
                ? 'border-indigo-900 text-indigo-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>1. Paste Gemini / AI Text</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'file'
                ? 'border-indigo-900 text-indigo-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>2. Upload File (Excel / CSV)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('prompt')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'prompt'
                ? 'border-indigo-900 text-indigo-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>3. Gemini Instructions &amp; Prompt Guide</span>
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 bg-slate-50/50">

          {/* TAB 1: PASTE AI TEXT */}
          {activeTab === 'paste' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block font-bold text-slate-800 text-xs">
                    Paste Generated Questions from Gemini / ChatGPT:
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Questions, options (A, B, C, D), correct answers, and conceptual rationales are parsed in real-time.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePasteSample}
                    className="text-xs text-indigo-700 hover:text-indigo-900 font-bold underline cursor-pointer"
                  >
                    Load Sample Questions
                  </button>
                  {rawText && (
                    <button
                      type="button"
                      onClick={() => handleTextChange('')}
                      className="text-xs text-rose-600 hover:text-rose-800 font-bold ml-2 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <textarea
                rows={7}
                value={rawText}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder={`Paste your questions here, e.g.:&#10;&#10;Q1. Which evaluation system is conducted during instruction?&#10;A) Summative Evaluation&#10;B) Diagnostic Evaluation&#10;C) Formative Evaluation&#10;D) Norm-Referenced Evaluation&#10;Correct Answer: C&#10;Step-by-Step Solution & Conceptual Rationale: Formative evaluation is conducted during learning...`}
                className="w-full px-4 py-3 border border-slate-300 rounded-2xl bg-white text-xs font-mono text-slate-800 leading-relaxed shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}

          {/* TAB 2: UPLOAD FILE (EXCEL / CSV / JSON) */}
          {activeTab === 'file' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center hover:border-indigo-400 transition-colors">
                <FileSpreadsheet className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-800">
                  {uploadedFileName ? uploadedFileName : 'Upload Excel Sheet, CSV, or JSON File'}
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Supports <b>.xlsx</b>, <b>.xls</b>, <b>.csv</b>, and <b>.json</b>. Columns for Question, Option A, Option B, Option C, Option D, Correct Answer, and Conceptual Rationale are detected automatically.
                </p>

                <div className="mt-4 flex items-center justify-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv,.json,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Select Spreadsheet File</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => downloadSampleExcelTemplate()}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 border border-slate-300 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Blank Template</span>
                  </button>
                </div>

                {isProcessingFile && (
                  <p className="text-xs text-indigo-700 font-bold mt-3 animate-pulse">
                    Reading spreadsheet data...
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PROMPT GUIDE */}
          {activeTab === 'prompt' && (
            <div className="space-y-4 bg-white rounded-2xl p-5 border border-slate-200 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    How to Create Mock Tests with Gemini AI:
                  </h4>
                  <p className="text-slate-500">
                    Follow these 3 simple steps to generate hundreds of test questions in minutes.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="bg-indigo-900 text-white px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedPrompt ? 'Copied! ✓' : 'Copy Prompt'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-brand-700 text-white font-bold text-[10px] flex items-center justify-center mb-1.5">
                    1
                  </span>
                  <div className="font-bold text-slate-800">Copy the Prompt</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Click "Copy Gemini Prompt" button above to copy Dr. Ankita's optimized prompt template.
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-brand-700 text-white font-bold text-[10px] flex items-center justify-center mb-1.5">
                    2
                  </span>
                  <div className="font-bold text-slate-800">Open Gemini &amp; Ask</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Go to <b>gemini.google.com</b>, paste the prompt, and specify your desired topic or unit.
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-brand-700 text-white font-bold text-[10px] flex items-center justify-center mb-1.5">
                    3
                  </span>
                  <div className="font-bold text-slate-800">Paste &amp; Import</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Copy Gemini's answer and paste it into Tab 1. Your test is built in 1 click!
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <div className="font-bold text-slate-700 mb-1">Standard Prompt Template Text:</div>
                <pre className="bg-slate-900 text-emerald-400 p-3 rounded-xl text-[11px] font-mono whitespace-pre-wrap overflow-x-auto">
                  {GEMINI_PROMPT_TEMPLATE}
                </pre>
              </div>
            </div>
          )}

          {/* DESTINATION CONFIGURATION */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-700" />
              <span>Import Destination &amp; Test Settings</span>
            </h4>

            <div className="flex flex-col sm:flex-row gap-3">
              <label className={`flex-1 p-3.5 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-colors ${
                importMode === 'new' ? 'border-indigo-900 bg-indigo-50/50' : 'border-slate-200 bg-white hover:border-slate-300'
              }`}>
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'new'}
                  onChange={() => setImportMode('new')}
                  className="text-indigo-900 cursor-pointer"
                />
                <div>
                  <div className="font-bold text-xs text-slate-900">Create a Brand New Mock Test</div>
                  <div className="text-[11px] text-slate-500">Create a new CBT test on the portal with these questions</div>
                </div>
              </label>

              <label className={`flex-1 p-3.5 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-colors ${
                importMode === 'existing' ? 'border-indigo-900 bg-indigo-50/50' : 'border-slate-200 bg-white hover:border-slate-300'
              }`}>
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'existing'}
                  onChange={() => setImportMode('existing')}
                  className="text-indigo-900 cursor-pointer"
                />
                <div>
                  <div className="font-bold text-xs text-slate-900">Add to Existing Mock Test</div>
                  <div className="text-[11px] text-slate-500">Append questions into an existing test's question bank</div>
                </div>
              </label>
            </div>

            {/* If New Test: Form */}
            {importMode === 'new' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 text-xs mb-1">New Test Title *</label>
                  <input
                    type="text"
                    value={newTestTitle}
                    onChange={(e) => setNewTestTitle(e.target.value)}
                    placeholder="e.g. UGC NET Paper 1 - Unit 2 Research Methodology Speed Test"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 text-xs mb-1">Category</label>
                  <select
                    value={newTestCategory}
                    onChange={(e) => setNewTestCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-medium"
                  >
                    <option value="UGC NET Paper 1">UGC NET Paper 1</option>
                    <option value="Research Methodology">Research Methodology</option>
                    <option value="CDP & Pedagogy">CDP &amp; Pedagogy</option>
                    <option value="Home Science">Home Science</option>
                    <option value="Teaching Aptitude">Teaching Aptitude</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 text-xs mb-1">Marks per Question (+)</label>
                  <input
                    type="number"
                    value={positiveMarks}
                    onChange={(e) => setPositiveMarks(parseFloat(e.target.value) || 2)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 text-xs mb-1">Negative Marks (-)</label>
                  <input
                    type="number"
                    step="0.25"
                    value={negativeMarks}
                    onChange={(e) => setNegativeMarks(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-bold"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block font-semibold text-slate-700 text-xs mb-1">Test Description &amp; Instructions</label>
                  <textarea
                    rows={2}
                    value={newTestDescription}
                    onChange={(e) => setNewTestDescription(e.target.value)}
                    placeholder="Test syllabus coverage and instructions..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white text-slate-800"
                  />
                </div>
              </div>
            ) : (
              <div className="pt-2">
                <label className="block font-semibold text-slate-700 text-xs mb-1">
                  Select Target Mock Test:
                </label>
                <select
                  value={targetTestId}
                  onChange={(e) => setTargetTestId(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 bg-white"
                >
                  {existingTests.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.questions?.length || 0} Questions currently)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* LIVE PARSING & PREVIEW SECTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Live Detected Questions ({parseResult.questions.length})
                </h4>
                {parseResult.questions.length > 0 && (
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{parseResult.questions.length} Valid Questions Ready</span>
                  </span>
                )}
              </div>

              {parseResult.questions.length > 0 && (
                <div className="text-xs text-slate-500">
                  Total Exam Marks: <b>{parseResult.questions.length * positiveMarks}</b> • Time: <b>{formatTestDuration(parseResult.questions.length)}</b>
                </div>
              )}
            </div>

            {/* Warnings Alert Box */}
            {parseResult.warnings.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Format Observations:</div>
                  <ul className="list-disc pl-4 space-y-0.5 mt-1 text-[11px] text-amber-800">
                    {parseResult.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Questions List Preview */}
            {parseResult.questions.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border-2 border-dashed border-slate-200 p-6">
                <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-slate-700 text-sm">No Questions Detected Yet</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Paste questions from Gemini AI in Tab 1, or upload an Excel sheet in Tab 2 to preview them here.
                </p>
                <button
                  type="button"
                  onClick={handlePasteSample}
                  className="mt-3 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold px-3 py-1.5 rounded-xl border border-indigo-200 cursor-pointer"
                >
                  Try with Sample Questions
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {parseResult.questions.map((q, qIdx) => (
                  <div key={q.id || qIdx} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5 hover:border-indigo-300 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-900 font-bold text-xs flex items-center justify-center shrink-0">
                          {qIdx + 1}
                        </span>
                        <div className="font-bold text-xs text-slate-900">
                          {q.question}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveParsedQuestion(qIdx)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer shrink-0"
                        title="Remove question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* 4 Options Grid with Correct Answer Highlighted */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = q.correctIndex === optIdx;
                        return (
                          <div
                            key={optIdx}
                            className={`p-2 rounded-xl text-xs flex items-center gap-2 border ${
                              isCorrect 
                                ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                                : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                              isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="truncate flex-1">{opt}</span>
                            {isCorrect && (
                              <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Conceptual Rationale */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                      <div className="font-bold text-indigo-900 text-[11px] flex items-center gap-1 mb-0.5">
                        <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                        <span>Step-by-Step Solution &amp; Conceptual Rationale:</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {q.explanation}
                      </p>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            {parseResult.questions.length > 0 ? (
              <span>
                Ready to import <b>{parseResult.questions.length} questions</b> into{' '}
                <b>{importMode === 'new' ? `"${newTestTitle}"` : 'selected test'}</b>.
              </span>
            ) : (
              <span>Paste questions or upload a file above to begin.</span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={parseResult.questions.length === 0}
              onClick={handleExecuteImport}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {importMode === 'new'
                  ? `Create Test with ${parseResult.questions.length} Questions 🚀`
                  : `Add ${parseResult.questions.length} Questions to Test ✓`}
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
