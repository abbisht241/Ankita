import type { QuizQuestion } from '../types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    subject: 'Research Methodology',
    topic: 'Hypothesis Testing & Errors',
    question: 'A researcher rejects a null hypothesis (H₀) when it is actually true in reality. Which type of error has been committed by the researcher?',
    options: [
      'Type I Error (Alpha Error)',
      'Type II Error (Beta Error)',
      'Sampling Bias Error',
      'Systematic Measurement Error'
    ],
    correctIndex: 0,
    explanation: 'Type I error (denoted by alpha α) occurs when a true null hypothesis is incorrectly rejected (false positive). Type II error (beta β) occurs when a false null hypothesis is not rejected (false negative).',
    difficulty: 'Medium'
  },
  {
    id: 2,
    subject: 'Child Development & Pedagogy',
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
    subject: 'Teaching Aptitude',
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
  },
  {
    id: 4,
    subject: 'Educational Psychology',
    topic: 'Operant Conditioning',
    question: 'In B.F. Skinner\'s Operant Conditioning, which schedule of reinforcement yields the highest and most consistent response rate with the strongest resistance to extinction?',
    options: [
      'Fixed Interval Schedule (FI)',
      'Fixed Ratio Schedule (FR)',
      'Variable Interval Schedule (VI)',
      'Variable Ratio Schedule (VR)'
    ],
    correctIndex: 3,
    explanation: 'Variable Ratio (VR) schedule provides reinforcement after an unpredictable number of responses. It generates the highest rate of steady responding and is extremely resistant to extinction (e.g., gambling, surprise class praises).',
    difficulty: 'Advanced'
  },
  {
    id: 5,
    subject: 'UGC NET Paper 1 - Evaluation',
    topic: 'Assessment Systems',
    question: 'An evaluation conducted throughout the instructional process to monitor student learning progress and provide ongoing feedback to improve teaching-learning is known as:',
    options: [
      'Summative Evaluation',
      'Formative Evaluation',
      'Norm-Referenced Evaluation',
      'Prognostic Evaluation'
    ],
    correctIndex: 1,
    explanation: 'Formative Assessment is diagnostic, continuous, and process-oriented conducted DURING instruction to identify learning gaps, unlike Summative Assessment which occurs at the END of instruction for grading.',
    difficulty: 'Easy'
  }
];
