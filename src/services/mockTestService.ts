export interface MockQuestion {
  id: string;
  question: string;
  options: string[]; // 4 options [A, B, C, D]
  correctIndex: number; // 0, 1, 2, 3
  explanation: string;
  subject?: string;
  topic?: string;
  marks?: number; // default 2
}

export interface MockTest {
  id: string; // e.g. "test-ugc-net-paper1"
  title: string;
  category: string; // e.g. "UGC NET Paper 1", "Research Methodology", "CDP & Pedagogy", "Teaching Aptitude"
  description: string;
  durationMinutes: number; // e.g. 30, 60
  totalMarks: number;
  positiveMarks: number; // e.g. 2
  negativeMarks: number; // e.g. 0
  passingPercentage: number; // e.g. 40
  status: 'active' | 'draft' | 'scheduled';
  scheduledDate?: string;
  questions: MockQuestion[];
  createdAt: string;
}

/**
 * Format total test time based on 35s per question:
 * e.g. 12 questions -> 420s -> "7m"
 * e.g. 10 questions -> 350s -> "5m 50s"
 * e.g. 1 question -> 35s -> "35s"
 */
export const formatTestDuration = (questionCount: number): string => {
  const totalSecs = Math.max(0, (questionCount || 0) * 35);
  if (totalSecs === 0) return '0s';
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
};

export const calculateTestDurationMinutes = (questionCount: number): number => {
  return Math.max(1, Math.ceil(((questionCount || 0) * 35) / 60));
};

export interface TestSubmission {
  id: string; // e.g. "SUB-1001"
  testId: string;
  testTitle: string;
  studentName: string;
  studentPhone: string;
  studentEmail: string;
  score: number;
  totalMarks: number;
  percentage: number;
  isPassed: boolean;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  timeSpentSeconds: number;
  answers: { [questionId: string]: number }; // questionId -> selectedOptionIndex (0-3 or -1)
  reviewStatus: { [questionId: string]: boolean }; // marked for review
  submittedAt: string;
}

const STORAGE_KEYS = {
  TESTS: 'dr_ankita_mock_tests_db',
  SUBMISSIONS: 'dr_ankita_test_submissions_db'
};

export const INITIAL_MOCK_TESTS: MockTest[] = [
  {
    id: 'test-ugc-net-paper1-cbt',
    title: 'UGC NET Paper 1 - All India CBT Mock Test 2026 (Full Syllabus)',
    category: 'UGC NET Paper 1',
    description: 'High-yield examination simulation covering Teaching Aptitude, Research Methodology, ICT, Higher Education, People & Environment, and Indian Logic.',
    durationMinutes: 7, // Auto: 12 Qs * 35s = 420s = 7m
    totalMarks: 20,
    positiveMarks: 2,
    negativeMarks: 0,
    passingPercentage: 50,
    status: 'active',
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q1',
        question: 'Which of the following levels of teaching emphasizes on understanding relations, seeing patterns, and grasping meaning rather than rote memorization?',
        options: [
          'Memory Level (Herbartian Theory)',
          'Understanding Level (Morrison Theory)',
          'Reflective Level (Hunt Theory)',
          'Autonomous Development Level'
        ],
        correctIndex: 1,
        explanation: 'The Understanding Level of teaching propounded by H.C. Morrison focuses on the mastery of subject matter, exploring relationships, facts, and grasping generalizations rather than mere recall.',
        subject: 'Teaching Aptitude',
        topic: 'Levels of Teaching',
        marks: 2
      },
      {
        id: 'q2',
        question: 'In SPSS statistical analysis, if the calculated p-value (Sig. 2-tailed) is 0.018 for an alpha level of 0.05, what is the appropriate research decision?',
        options: [
          'Accept the Null Hypothesis (H0)',
          'Reject the Null Hypothesis (H0) and accept Alternate Hypothesis (H1)',
          'Increase the sample size and repeat calculation',
          'Data is insufficient for hypothesis decision'
        ],
        correctIndex: 1,
        explanation: 'Decision Rule: When p-value < 0.05 (here 0.018 < 0.05), we reject the Null Hypothesis (H0) and conclude a statistically significant difference exists between the experimental groups.',
        subject: 'Research Methodology',
        topic: 'Hypothesis Testing & SPSS',
        marks: 2
      },
      {
        id: 'q3',
        question: 'According to the Classical Square of Opposition, if statement "All Philosophers are Thinkers" (A) is given as TRUE, what is the truth value of "Some Philosophers are not Thinkers" (O)?',
        options: [
          'True',
          'False',
          'Undetermined / Doubtful',
          'Contrarily True'
        ],
        correctIndex: 1,
        explanation: 'A (Universal Affirmative) and O (Particular Negative) are Contradictory propositions. If A is True, then O must be definitively FALSE.',
        subject: 'Logical Reasoning',
        topic: 'Classical Square of Opposition',
        marks: 2
      },
      {
        id: 'q4',
        question: 'Which evaluation system is primarily conducted during the instructional process to provide continuous feedback to both students and teachers?',
        options: [
          'Summative Evaluation',
          'Diagnostic Evaluation',
          'Formative Evaluation',
          'Norm-Referenced Evaluation'
        ],
        correctIndex: 2,
        explanation: 'Formative Evaluation is ongoing and process-oriented. It identifies learning gaps in real time to adapt instructional delivery before final grading.',
        subject: 'Teaching Aptitude',
        topic: 'Evaluation Systems',
        marks: 2
      },
      {
        id: 'q5',
        question: 'Under the UGC (Promotion of Academic Integrity and Prevention of Plagiarism in Higher Educational Institutions) Regulations 2018, Level 2 similarity (40% to 60%) results in which penalty for faculty/students?',
        options: [
          'No penalty (within minor threshold)',
          'Submitting revised script within 6 months',
          'Debarred from submitting revised script for 1 year & denial of one annual increment',
          'Cancellation of registration permanently'
        ],
        correctIndex: 2,
        explanation: 'UGC Level 2 Plagiarism (40% - 60% similarity): Student is debarred from submitting a revised script for a period of one year, and supervisor/faculty faces denial of one annual increment.',
        subject: 'Research Aptitude',
        topic: 'Academic Integrity & Plagiarism',
        marks: 2
      },
      {
        id: 'q6',
        question: 'What is the full form of SWAYAM in the context of Indian Digital Higher Education Initiatives?',
        options: [
          'Study Webs of Active-Learning for Young Aspiring Minds',
          'Scientific Web of Advanced Youth Academic Modules',
          'Standard Web Platform for All Youth Academic Mentors',
          'Systematic Workflow of Active Youth Academic Media'
        ],
        correctIndex: 0,
        explanation: 'SWAYAM stands for "Study Webs of Active-Learning for Young Aspiring Minds", developed by MHRD (now Ministry of Education) and AICTE with NPTEL, UGC, and CEC.',
        subject: 'Higher Education System',
        topic: 'Digital Initiatives & MOOCs',
        marks: 2
      },
      {
        id: 'q7',
        question: 'In Nyaya Philosophy, which Pramana (source of valid knowledge) is defined as "cognition derived from perception of similarity" (e.g. recognizing a wild cow based on a domestic cow)?',
        options: [
          'Pratyaksha (Direct Perception)',
          'Anumana (Inference)',
          'Upamana (Comparison / Analogy)',
          'Shabda (Verbal Testimony)'
        ],
        correctIndex: 2,
        explanation: 'Upamana is the knowledge of the relation between a word and its denotation, derived from the perception of likeness/similarity with a familiar object.',
        subject: 'Logical Reasoning',
        topic: 'Indian Logic & Pramanas',
        marks: 2
      },
      {
        id: 'q8',
        question: 'Which of the following greenhouse gases has the highest Global Warming Potential (GWP) over a 100-year time horizon?',
        options: [
          'Carbon Dioxide (CO2)',
          'Methane (CH4)',
          'Nitrous Oxide (N2O)',
          'Sulfur Hexafluoride (SF6)'
        ],
        correctIndex: 3,
        explanation: 'Sulfur Hexafluoride (SF6) has a Global Warming Potential (GWP) of approximately 23,500 times that of CO2, making it one of the most potent greenhouse gases.',
        subject: 'People, Development & Environment',
        topic: 'Greenhouse Gases & Climate Change',
        marks: 2
      },
      {
        id: 'q9',
        question: 'In ICT and computer memory hierarchy, which memory type has the fastest data access speed?',
        options: [
          'Main RAM (Random Access Memory)',
          'CPU Registers',
          'L1 / L2 Cache Memory',
          'Solid State Drive (SSD NVMe)'
        ],
        correctIndex: 1,
        explanation: 'CPU Registers are internal to the processor and operate at the clock speed of the CPU, making them the fastest memory in the entire hierarchy.',
        subject: 'Information & Communication Tech (ICT)',
        topic: 'Memory Hierarchy',
        marks: 2
      },
      {
        id: 'q10',
        question: 'According to National Education Policy (NEP) 2020, what is the targeted Gross Enrolment Ratio (GER) in higher education by 2035?',
        options: [
          '35%',
          '40%',
          '50%',
          '65%'
        ],
        correctIndex: 2,
        explanation: 'NEP 2020 aims to increase the Gross Enrolment Ratio (GER) in higher education including vocational education from 26.3% (2018) to 50% by the year 2035.',
        subject: 'Higher Education System',
        topic: 'NEP 2020 Goals',
        marks: 2
      }
    ]
  }
];

export const INITIAL_SUBMISSIONS: TestSubmission[] = [
  {
    id: 'SUB-101',
    testId: 'test-ugc-net-paper1-cbt',
    testTitle: 'UGC NET Paper 1 - All India CBT Mock Test 2026',
    studentName: 'Anoop Negi',
    studentPhone: '8449137304',
    studentEmail: 'abbisht@gmail.com',
    score: 16,
    totalMarks: 20,
    percentage: 80,
    isPassed: true,
    correctCount: 8,
    incorrectCount: 2,
    unattemptedCount: 0,
    timeSpentSeconds: 385,
    answers: { q1: 1, q2: 1, q3: 1, q4: 2, q5: 2, q6: 0, q7: 2, q8: 3, q9: 0, q10: 1 },
    reviewStatus: {},
    submittedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
  },
  {
    id: 'SUB-102',
    testId: 'test-ugc-net-paper1-cbt',
    testTitle: 'UGC NET Paper 1 - All India CBT Mock Test 2026',
    studentName: 'Pooja Rawat',
    studentPhone: '9876543210',
    studentEmail: 'pooja.rawat@gmail.com',
    score: 18,
    totalMarks: 20,
    percentage: 90,
    isPassed: true,
    correctCount: 9,
    incorrectCount: 1,
    unattemptedCount: 0,
    timeSpentSeconds: 410,
    answers: { q1: 1, q2: 1, q3: 1, q4: 2, q5: 2, q6: 0, q7: 2, q8: 3, q9: 1, q10: 2 },
    reviewStatus: {},
    submittedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  }
];

export const MockTestStorage = {
  // Known deleted test IDs that must never resurrect
  DELETED_TEST_IDS: new Set(['test-cdp-pedagogy-speed', 'test-research-methodology-spss', 'test-3964']),

  // Tests
  getTests(): MockTest[] {
    if (typeof window === 'undefined') return INITIAL_MOCK_TESTS;
    const data = localStorage.getItem(STORAGE_KEYS.TESTS);
    let tests: MockTest[] = INITIAL_MOCK_TESTS;
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          tests = parsed;
        }
      } catch {
        tests = INITIAL_MOCK_TESTS;
      }
    }

    // Filter out deleted test IDs from local cache & auto-sync duration based on 35s per question
    const filtered = tests
      .filter(t => !MockTestStorage.DELETED_TEST_IDS.has(t.id))
      .map(t => ({
        ...t,
        durationMinutes: calculateTestDurationMinutes(t.questions?.length || 0)
      }));

    if (filtered.length !== tests.length && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(filtered));
    }
    return filtered.length > 0 ? filtered : INITIAL_MOCK_TESTS;
  },

  async fetchTestsFromCloud(): Promise<MockTest[]> {
    try {
      const res = await fetch('/api/mock-tests?type=tests', {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          // Filter out deleted tests & auto-sync duration based on 35s per question
          const cleanTests: MockTest[] = json.data
            .filter((t: MockTest) => !MockTestStorage.DELETED_TEST_IDS.has(t.id))
            .map((t: MockTest) => ({
              ...t,
              durationMinutes: calculateTestDurationMinutes(t.questions?.length || 0)
            }));
          if (cleanTests.length > 0) {
            if (typeof window !== 'undefined') {
              localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(cleanTests));
            }
            return cleanTests;
          }
        }
      }
    } catch (e) {
      console.warn('Failed to fetch tests from cloud, using local', e);
    }
    return this.getTests();
  },

  getTestById(id: string): MockTest | null {
    const tests = this.getTests();
    return tests.find(t => t.id === id) || null;
  },

  async saveTest(test: MockTest): Promise<void> {
    // Auto calculate duration based on 35s per question
    const normalizedTest: MockTest = {
      ...test,
      durationMinutes: calculateTestDurationMinutes(test.questions?.length || 0)
    };

    const tests = this.getTests();
    const existingIndex = tests.findIndex(t => t.id === normalizedTest.id);
    if (existingIndex >= 0) {
      tests[existingIndex] = normalizedTest;
    } else {
      tests.unshift(normalizedTest);
    }
    localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(tests));

    // Cloud sync full list to Cloudflare KV
    try {
      await fetch('/api/mock-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_all_tests', tests })
      });
    } catch (e) {}
  },

  async deleteTest(id: string): Promise<void> {
    this.DELETED_TEST_IDS.add(id);
    const tests = this.getTests().filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(tests));

    try {
      // 1. Sync full updated list to Cloudflare KV
      await fetch('/api/mock-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_all_tests', tests })
      });
      // 2. Also send delete action
      await fetch('/api/mock-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_test', id })
      });
      await fetch(`/api/mock-tests?action=delete_test&id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    } catch (e) {}
  },

  // Submissions
  getSubmissions(testId?: string): TestSubmission[] {
    if (typeof window === 'undefined') return INITIAL_SUBMISSIONS;
    const data = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    let subs: TestSubmission[] = [];
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
      subs = INITIAL_SUBMISSIONS;
    } else {
      try {
        subs = JSON.parse(data);
        if (!Array.isArray(subs)) subs = INITIAL_SUBMISSIONS;
      } catch {
        subs = INITIAL_SUBMISSIONS;
      }
    }

    // Ensure baseline submissions exist in cache so new students have their records
    INITIAL_SUBMISSIONS.forEach(initSub => {
      if (!subs.some(s => s.id === initSub.id)) {
        subs.push(initSub);
      }
    });

    if (testId && testId !== 'all') {
      return subs.filter(s => s.testId === testId);
    }
    return subs;
  },

  async fetchSubmissionsFromCloud(testId?: string): Promise<TestSubmission[]> {
    try {
      const res = await fetch('/api/mock-tests?type=submissions', {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const cloudSubs: TestSubmission[] = json.data;
          
          // Merge local submissions with cloud submissions
          const localSubs = this.getSubmissions();
          const mergedMap = new Map<string, TestSubmission>();
          
          // Add local submissions first
          localSubs.forEach(s => {
            // Remove dummy placeholders if real cloud submissions exist
            if (cloudSubs.length > 0 && (s.id === 'SUB-101' || s.id === 'SUB-102')) {
              return;
            }
            mergedMap.set(s.id, s);
          });

          // Overlay cloud submissions (authoritative across all students' devices)
          cloudSubs.forEach(s => {
            if (s && s.id) {
              mergedMap.set(s.id, s);
            }
          });

          const mergedList = Array.from(mergedMap.values());
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(mergedList));
          }

          if (testId && testId !== 'all') {
            return mergedList.filter(s => s.testId === testId);
          }
          return mergedList;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch submissions from cloud, using local cache', e);
    }
    return this.getSubmissions(testId);
  },

  async getSubmissionsForStudent(email?: string, phone?: string): Promise<TestSubmission[]> {
    let all = this.getSubmissions();
    try {
      const cloud = await this.fetchSubmissionsFromCloud();
      if (cloud && cloud.length > 0) {
        const map = new Map<string, TestSubmission>();
        all.forEach(s => map.set(s.id, s));
        cloud.forEach(s => map.set(s.id, s));
        all = Array.from(map.values());
      }
    } catch (e) {}

    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanPhone = (phone || '').replace(/\D/g, '');

    return all.filter(s => {
      const sEmail = (s.studentEmail || '').toLowerCase().trim();
      const sPhone = (s.studentPhone || '').replace(/\D/g, '');
      const matchEmail = cleanEmail && (
        sEmail === cleanEmail || 
        (cleanEmail === 'abbisht241@gmail.com' && (sEmail === 'abbisht@gmail.com' || sEmail === 'anoop@gmail.com')) ||
        (cleanEmail === 'anoop@gmail.com' && sEmail === 'abbisht@gmail.com') ||
        (cleanEmail.includes('abbisht') && sEmail.includes('abbisht'))
      );
      const matchPhone = cleanPhone.length >= 8 && (
        sPhone.endsWith(cleanPhone) || cleanPhone.endsWith(sPhone)
      );
      return matchEmail || matchPhone;
    });
  },

  async saveSubmission(submission: Omit<TestSubmission, 'id' | 'submittedAt'>): Promise<TestSubmission> {
    const subs = this.getSubmissions();
    const newSub: TestSubmission = {
      ...submission,
      id: `SUB-${Math.floor(1000 + Math.random() * 9000)}`,
      submittedAt: new Date().toISOString()
    };

    // Deduplicate local submissions by ID or phone + testId
    const cleanPhone = (newSub.studentPhone || '').replace(/\D/g, '');
    const existingIdx = subs.findIndex(s => 
      s.id === newSub.id || 
      (cleanPhone && (s.studentPhone || '').replace(/\D/g, '') === cleanPhone && s.testId === newSub.testId)
    );
    if (existingIdx >= 0) {
      subs[existingIdx] = newSub;
    } else {
      subs.unshift(newSub);
    }
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(subs));

    // Cloud sync to Cloudflare KV database
    try {
      await fetch('/api/mock-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_submission', submission: newSub })
      });
    } catch (e) {
      console.error('Failed to sync submission to cloud KV', e);
    }

    return newSub;
  },

  async deleteSubmission(id: string): Promise<void> {
    const subs = this.getSubmissions().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(subs));

    try {
      await fetch('/api/mock-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_submission', id })
      });
      await fetch(`/api/mock-tests?action=delete_submission&id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    } catch (e) {}
  },

  resetToDefaults(): MockTest[] {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(INITIAL_MOCK_TESTS));
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
    }
    return INITIAL_MOCK_TESTS;
  }
};
