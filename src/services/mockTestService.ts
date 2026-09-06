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
    durationMinutes: 30,
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
  },
  {
    id: 'test-cdp-pedagogy-speed',
    title: 'Child Development & Pedagogy (CDP 30/30) Diagnostic Test',
    category: 'CDP & Pedagogy',
    description: 'Master constructivist learning theories, cognitive stages, social development, and inclusive educational adaptations.',
    durationMinutes: 20,
    totalMarks: 10,
    positiveMarks: 2,
    negativeMarks: 0,
    passingPercentage: 60,
    status: 'active',
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'cdp-1',
        question: 'A child is able to reverse mental operations and understands that water poured from a tall thin glass to a wide bowl retains the same volume (Conservation). According to Piaget, which stage is the child in?',
        options: [
          'Sensorimotor Stage (0-2 years)',
          'Pre-Operational Stage (2-7 years)',
          'Concrete Operational Stage (7-11 years)',
          'Formal Operational Stage (11+ years)'
        ],
        correctIndex: 2,
        explanation: 'Decentration, Reversibility, and Conservation of mass, volume, and number are the hallmark milestones achieved during Piaget’s Concrete Operational Stage (7-11 years).',
        subject: 'CDP & Pedagogy',
        topic: 'Piaget Cognitive Stages',
        marks: 2
      },
      {
        id: 'cdp-2',
        question: 'In Vygotsky’s Socio-Cultural Theory, temporary support provided by an adult or competent peer to help a learner bridge the gap in understanding is known as:',
        options: [
          'Schema Adaptation',
          'Scaffolding (सहारा देना)',
          'Ego-centric Private Speech',
          'Classical Conditioning'
        ],
        correctIndex: 1,
        explanation: 'Scaffolding (term coined by Jerome Bruner in collaboration with Vygotskian principles) refers to temporary, calibrated assistance given within the Zone of Proximal Development (ZPD).',
        subject: 'CDP & Pedagogy',
        topic: 'Vygotsky ZPD & Scaffolding',
        marks: 2
      },
      {
        id: 'cdp-3',
        question: 'According to Lawrence Kohlberg’s stages of Moral Development, a person who argues "Rules and laws are rigid and must be obeyed unconditionally to maintain social order" is in:',
        options: [
          'Stage 1: Punishment and Obedience',
          'Stage 2: Individualism and Exchange',
          'Stage 4: Law and Order Morality (Conventional Level)',
          'Stage 6: Universal Ethical Principles'
        ],
        correctIndex: 2,
        explanation: 'Stage 4 (Conventional Level) focuses on maintaining social harmony, respecting authority, and performing social duties by strictly upholding laws without individual exceptions.',
        subject: 'CDP & Pedagogy',
        topic: 'Kohlberg Moral Development',
        marks: 2
      },
      {
        id: 'cdp-4',
        question: 'Which of the following Multiple Intelligences proposed by Howard Gardner is characterized by sensitivity to rhythm, pitch, melody, and timbre?',
        options: [
          'Spatial Intelligence',
          'Bodily-Kinesthetic Intelligence',
          'Musical-Rhythmic Intelligence',
          'Interpersonal Intelligence'
        ],
        correctIndex: 2,
        explanation: 'Musical-Rhythmic Intelligence involves the capacity to recognize, create, reproduce, and reflect on music, pitch, rhythm, and tone structures.',
        subject: 'CDP & Pedagogy',
        topic: 'Gardner Multiple Intelligences',
        marks: 2
      },
      {
        id: 'cdp-5',
        question: 'Under the Rights of Persons with Disabilities (RPWD) Act 2016, how many benchmark disability categories are officially recognized in India?',
        options: [
          '7 Disabilities',
          '14 Disabilities',
          '21 Disabilities',
          '28 Disabilities'
        ],
        correctIndex: 2,
        explanation: 'The RPWD Act 2016 expanded the recognized disabilities from 7 (under the 1995 Act) to 21 categories, including Acid Attack Victims, Dwarfism, Autism Spectrum, and Specific Learning Disabilities.',
        subject: 'CDP & Pedagogy',
        topic: 'Inclusive Education & RPWD Act',
        marks: 2
      }
    ]
  },
  {
    id: 'test-research-methodology-spss',
    title: 'Research Methodology & SPSS Statistics Ph.D. Entrance Test',
    category: 'Research Methodology',
    description: 'Empirical research designs, hypothesis formulation, sampling methods, and parametric/non-parametric statistical decision trees.',
    durationMinutes: 25,
    totalMarks: 6,
    positiveMarks: 2,
    negativeMarks: 0,
    passingPercentage: 50,
    status: 'active',
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'res-1',
        question: 'A researcher wants to compare the mean test scores of two independent groups (e.g. Male vs Female). When data is normally distributed, which statistical test is most appropriate?',
        options: [
          'Chi-Square Test of Independence',
          'Independent Samples t-Test',
          'Mann-Whitney U Test',
          'Wilcoxon Signed-Rank Test'
        ],
        correctIndex: 1,
        explanation: 'Independent Samples t-Test is a parametric test used to compare the means between two mutually exclusive independent groups with normally distributed continuous data.',
        subject: 'Research Methodology',
        topic: 'Parametric Tests',
        marks: 2
      },
      {
        id: 'res-2',
        question: 'When sampling a diverse population across geographical zones with heterogeneous clusters, which probability sampling method ensures proportional representation?',
        options: [
          'Convenience Sampling',
          'Stratified Random Sampling',
          'Snowball Sampling',
          'Purposive Quota Sampling'
        ],
        correctIndex: 1,
        explanation: 'Stratified Random Sampling divides the population into homogeneous strata (e.g. based on gender, region, or socio-economic status) and samples randomly from each stratum.',
        subject: 'Research Methodology',
        topic: 'Sampling Designs',
        marks: 2
      },
      {
        id: 'res-3',
        question: 'What type of error is committed when a researcher rejects a Null Hypothesis (H0) that is actually TRUE in the population?',
        options: [
          'Type I Error (Alpha α Error)',
          'Type II Error (Beta β Error)',
          'Standard Error of Mean',
          'Measurement Variance Error'
        ],
        correctIndex: 0,
        explanation: 'Type I Error (False Positive) occurs when the researcher falsely detects an effect and rejects a true Null Hypothesis (probability denoted by alpha α level, usually 0.05).',
        subject: 'Research Methodology',
        topic: 'Hypothesis Errors',
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
    timeSpentSeconds: 940,
    answers: { q1: 1, q2: 1, q3: 1, q4: 2, q5: 2, q6: 0, q7: 2, q8: 3, q9: 1, q10: 2 },
    reviewStatus: {},
    submittedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
  },
  {
    id: 'SUB-102',
    testId: 'test-cdp-pedagogy-speed',
    testTitle: 'Child Development & Pedagogy (CDP 30/30) Diagnostic Test',
    studentName: 'Amit Negi',
    studentPhone: '9412345678',
    studentEmail: 'amit.negi@yahoo.com',
    score: 10,
    totalMarks: 10,
    percentage: 100,
    isPassed: true,
    correctCount: 5,
    incorrectCount: 0,
    unattemptedCount: 0,
    timeSpentSeconds: 420,
    answers: { 'cdp-1': 2, 'cdp-2': 1, 'cdp-3': 2, 'cdp-4': 2, 'cdp-5': 2 },
    reviewStatus: {},
    submittedAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString()
  }
];

export const MockTestStorage = {
  // Tests
  getTests(): MockTest[] {
    if (typeof window === 'undefined') return INITIAL_MOCK_TESTS;
    const data = localStorage.getItem(STORAGE_KEYS.TESTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(INITIAL_MOCK_TESTS));
      return INITIAL_MOCK_TESTS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_MOCK_TESTS;
    }
  },

  getTestById(id: string): MockTest | null {
    const tests = this.getTests();
    return tests.find(t => t.id === id) || null;
  },

  async saveTest(test: MockTest): Promise<void> {
    const tests = this.getTests();
    const existingIndex = tests.findIndex(t => t.id === test.id);
    if (existingIndex >= 0) {
      tests[existingIndex] = test;
    } else {
      tests.unshift(test);
    }
    localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(tests));

    // Cloud sync
    try {
      await fetch('/api/mock-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_test', test })
      });
    } catch (e) {}
  },

  async deleteTest(id: string): Promise<void> {
    const tests = this.getTests().filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(tests));

    try {
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
      } catch {
        subs = INITIAL_SUBMISSIONS;
      }
    }

    if (testId) {
      return subs.filter(s => s.testId === testId);
    }
    return subs;
  },

  async saveSubmission(submission: Omit<TestSubmission, 'id' | 'submittedAt'>): Promise<TestSubmission> {
    const subs = this.getSubmissions();
    const newSub: TestSubmission = {
      ...submission,
      id: `SUB-${Math.floor(1000 + Math.random() * 9000)}`,
      submittedAt: new Date().toISOString()
    };
    subs.unshift(newSub);
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(subs));

    // Cloud sync in background
    try {
      await fetch('/api/mock-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_submission', submission: newSub })
      });
    } catch (e) {}

    return newSub;
  },

  async deleteSubmission(id: string): Promise<void> {
    const subs = this.getSubmissions().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(subs));
  },

  resetToDefaults(): MockTest[] {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(INITIAL_MOCK_TESTS));
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
    }
    return INITIAL_MOCK_TESTS;
  }
};
