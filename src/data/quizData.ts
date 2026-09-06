import type { QuizQuestion } from '../types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    subject: 'Research Methodology',
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
    subject: 'Child Development & Pedagogy (CDP)',
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
    subject: 'Educational Psychology',
    topic: 'Operant Conditioning & Reinforcement',
    question: 'In B.F. Skinner\'s Operant Conditioning, which schedule of reinforcement yields the highest and most consistent response rate with the strongest resistance to extinction?',
    options: [
      'Fixed Interval Schedule (FI)',
      'Fixed Ratio Schedule (FR)',
      'Variable Interval Schedule (VI)',
      'Variable Ratio Schedule (VR)'
    ],
    correctIndex: 3,
    explanation: 'Variable Ratio (VR) schedule provides reinforcement after an unpredictable number of responses. It generates the highest rate of steady responding and is extremely resistant to extinction (e.g., surprise class praises).',
    difficulty: 'Advanced'
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
