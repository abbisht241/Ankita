import type { QuizQuestion } from '../types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    subject: 'UGC NET Home Science & Research',
    topic: 'SPSS & Hypothesis Testing',
    question: 'A researcher rejects a null hypothesis (H₀) when it is actually true in the population. Which type of error has been committed by the researcher?',
    options: [
      'Type I Error (Alpha Error)',
      'Type II Error (Beta Error)',
      'Sampling Bias Error',
      'Systematic Measurement Error'
    ],
    correctIndex: 0,
    explanation: 'Type I error (denoted by alpha α) occurs when a true null hypothesis is incorrectly rejected (false positive). In SPSS testing, this is checked against the chosen significance level (typically p < 0.05).',
    difficulty: 'Medium'
  },
  {
    id: 2,
    subject: 'Child / Human Development (CDP)',
    topic: 'Vygotsky Socio-Cultural Theory',
    question: 'According to Lev Vygotsky, the gap between what a child can do independently and what they can achieve with guidance from a competent adult or peer is termed as:',
    options: [
      'Schema Equilibration',
      'Zone of Proximal Development (ZPD)',
      'Sensorimotor Reflex',
      'Egocentric Internalization'
    ],
    correctIndex: 1,
    explanation: 'Zone of Proximal Development (ZPD) is the range of tasks that are too difficult for an individual to master alone, but can be mastered with the assistance and scaffolding of a More Knowledgeable Other (MKO).',
    difficulty: 'Easy'
  },
  {
    id: 3,
    subject: 'Food Science & Nutrition',
    topic: 'RDA 2020 & Maternal Health',
    question: 'According to ICMR-NIN RDA 2020 guidelines, what is the additional daily protein requirement recommended during the second and third trimesters of pregnancy in India?',
    options: [
      '+5.5 g/day (2nd Trim) & +15.5 g/day (3rd Trim)',
      '+9.5 g/day (2nd Trim) & +22.0 g/day (3rd Trim)',
      '+18.0 g/day for both trimesters',
      '+2.0 g/day during pregnancy'
    ],
    correctIndex: 1,
    explanation: 'As per ICMR-NIN RDA 2020 recommendations for an adult reference woman, the additional protein requirement during pregnancy is +9.5 g/day in the second trimester and +22.0 g/day in the third trimester for fetal tissue growth.',
    difficulty: 'Medium'
  },
  {
    id: 4,
    subject: 'Extension Education & Community Development',
    topic: 'Self-Help Groups (SHGs)',
    question: 'Which of the following is the primary principle behind the formation of Self-Help Groups (SHGs) for rural women empowerment?',
    options: [
      'Compulsory government subsidy without personal savings',
      'Homogeneous group affinity, voluntary regular savings & mutual internal lending',
      'Commercial banking collateral requirements',
      'External contractor-driven decision making'
    ],
    correctIndex: 1,
    explanation: 'Self-Help Groups (SHGs) are voluntary associations of 10-20 homogeneous rural women who pool small regular savings, practice internal lending for emergency & entrepreneurial needs, and build collective socio-economic empowerment.',
    difficulty: 'Easy'
  },
  {
    id: 5,
    subject: 'UGC NET Paper 1 - Teaching Aptitude',
    topic: 'Levels of Teaching',
    question: 'Which level of teaching aims at developing problem-solving abilities, critical thinking, and independent cognitive inquiry among students?',
    options: [
      'Memory Level (Herbartian Approach)',
      'Understanding Level (Morrison Approach)',
      'Reflective Level (Hunt Approach)',
      'Autonomous Development Level'
    ],
    correctIndex: 2,
    explanation: 'Reflective Level of teaching (formulated by Hunt) is the highest, most thoughtful level of teaching where students analyze problems, formulate hypotheses, and critically evaluate real-life situations.',
    difficulty: 'Medium'
  }
];
