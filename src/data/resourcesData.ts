import type { Resource } from '../types';

export const resourcesData: Resource[] = [
  {
    id: 'res-1',
    title: 'Research Methodology 50 Golden Concepts & Formula Sheet',
    category: 'Research Methodology',
    type: 'PDF Notes',
    fileSize: '4.8 MB',
    pageCount: 32,
    downloadCount: '18,400+ Downloads',
    isPopular: true,
    description: 'High-yield revision capsule covering Research Types, Parametric vs Non-Parametric Tests, Sampling Techniques, Types of Validity & APA 7th Referencing rules.',
    topicsCovered: [
      'Positivism vs Post-Positivism comparison chart',
      't-test, ANOVA, Chi-Square decision tree',
      'Internal vs External Validity threats',
      'APA 7th referencing quick table'
    ],
    previewSnippet: 'Hypothesis Testing Framework: When sample size is small (<30) and population standard deviation is unknown, use Student\'s t-distribution. Type I error (alpha) = Rejecting null hypothesis when true. Type II error (beta) = Failing to reject null hypothesis when false.'
  },
  {
    id: 'res-2',
    title: 'UGC NET Paper 1 Solved PYQ Compilation (2020-2024)',
    category: 'PYQ Papers',
    type: 'PYQ Solved',
    fileSize: '12.4 MB',
    pageCount: 140,
    downloadCount: '24,200+ Downloads',
    isPopular: true,
    description: 'Unit-wise sorted Previous Year Questions with step-by-step detailed explanations, option elimination rationale, and trend analysis for the upcoming exam.',
    topicsCovered: [
      'Unit 1 Teaching Aptitude (120+ Solved PYQs)',
      'Unit 2 Research Aptitude (110+ Solved PYQs)',
      'Unit 6 Logical Reasoning & Indian Logic (100+ Solved PYQs)',
      'Unit 9 People & Environment (85+ Solved PYQs)'
    ],
    previewSnippet: 'Question: In the Classical Square of Opposition, if statement "All swans are white" (A) is true, what is the truth value of "Some swans are not white" (O)? Answer: Contradictory proposition — therefore "O" is definitely FALSE.'
  },
  {
    id: 'res-3',
    title: 'Child Development & Pedagogy (CDP) 100 Key Theorists Mindmap',
    category: 'CDP & Pedagogy',
    type: 'Mindmap',
    fileSize: '6.2 MB',
    pageCount: 28,
    downloadCount: '15,800+ Downloads',
    isPopular: true,
    description: 'Visual color-coded mindmaps for Piaget’s 4 stages, Vygotsky’s ZPD & Scaffolding, Kohlberg’s 6 stages of moral development, and Erikson’s psychosocial stages.',
    topicsCovered: [
      'Piagetian concepts: Assimilation, Accommodation, Schema, Conservation',
      'Vygotsky vs Piaget core differences table',
      'Howard Gardner 8 Multiple Intelligences with classroom applications',
      'RPWD Act 2016 21 disability conditions summary'
    ],
    previewSnippet: 'Vygotsky\'s Zone of Proximal Development (ZPD): The distance between actual developmental level determined by independent problem solving and level of potential development determined through problem solving under adult guidance or in collaboration with more capable peers.'
  },
  {
    id: 'res-4',
    title: 'Teaching Aptitude Bloom’s Revised Taxonomy & Maxims Cheat Sheet',
    category: 'UGC NET Paper 1',
    type: 'Formula Sheet',
    fileSize: '3.1 MB',
    pageCount: 18,
    downloadCount: '11,300+ Downloads',
    isPopular: false,
    description: 'Concise summary of Bloom’s Taxonomy verbs, Micro-teaching 36-minute cycle, Evaluation types (Formative, Summative, Diagnostic, Ipsative), and ICT in education.',
    topicsCovered: [
      'Bloom\'s cognitive domain action verbs for question design',
      'Microteaching 6-step cycle with exact time distribution',
      'Evaluation types: Norm vs Criterion referenced comparison',
      'SWAYAM, SWAYAM PRABHA & MOOCs quadrant architecture'
    ],
    previewSnippet: 'Micro-Teaching Time Breakdown (NCERT Standard 36 Mins): Teach (6m) -> Feedback (6m) -> Re-plan (12m) -> Re-teach (6m) -> Re-feedback (6m). Developed by Dwight W. Allen at Stanford.'
  },
  {
    id: 'res-5',
    title: 'Educational Psychology Core Thinkers & Learning Laws Handbook',
    category: 'Educational Psychology',
    type: 'E-Book',
    fileSize: '8.5 MB',
    pageCount: 64,
    downloadCount: '9,900+ Downloads',
    isPopular: false,
    description: 'In-depth study handbook covering Thorndike’s Laws of Learning, Skinner’s Operant Conditioning schedules, Maslow’s hierarchy, and memory processing models.',
    topicsCovered: [
      'Thorndike Primary Laws: Readiness, Exercise, and Effect',
      'Reinforcement Schedules: Fixed Ratio, Variable Ratio, Fixed Interval, Variable Interval',
      'Atkinson-Shiffrin Multi-Store Memory Model',
      'Ego Defense Mechanisms in educational contexts'
    ],
    previewSnippet: 'Operant Conditioning: Variable Ratio (VR) schedule produces the highest rate of steady responding and greatest resistance to extinction (e.g., slot machines, lottery, random classroom surprise quizzes).'
  }
];
