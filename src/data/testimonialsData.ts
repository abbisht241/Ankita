import type { Testimonial } from '../types';

export const testimonialsData: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Dr. Priya Sharma',
    exam: 'UGC NET JRF (Education) & Paper 1',
    scoreOrRank: 'AIR 12 (Score: 218/300, Paper 1: 88/100)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
    quote: 'Dr. Ankita Bisht’s concept-based method completely changed my approach. I previously failed Paper 1 twice because of Research Methodology and DI. Her shortcut methods and live doubt solving helped me jump from 46 to 88 marks in Paper 1!',
    year: 'Dec 2024 Cycle',
    collegeOrRole: 'Now Ph.D. Scholar at Delhi University',
    videoDuration: '3:45 min',
    videoThumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop',
    hasVideo: true,
    beforeAfter: {
      before: 'Struggled with Research Aptitude & Indian Logic (Scored 46/100 in 1st attempt)',
      after: 'Scored 88/100 in Paper 1, Secured AIR 12 in JRF Education with 99.89 Percentile'
    },
    badge: 'JRF AIR 12'
  },
  {
    id: 'test-2',
    name: 'Rajesh Kumar Meena',
    exam: 'CTET Paper 1 & 2 + DSSSB PRT',
    scoreOrRank: 'CDP: 30/30 (Total CTET: 136/150)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop',
    quote: 'Pedagogy was my biggest fear. Dr. Ankita ma’am doesn’t just teach theories; she connects Piaget and Vygotsky to actual classroom situations. I scored a perfect 30/30 in CDP and cleared CTET with 136 marks in my very first attempt.',
    year: 'July 2024 Cycle',
    collegeOrRole: 'Selected as Govt Primary Teacher (DSSSB)',
    videoDuration: '2:30 min',
    videoThumbnail: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600&auto=format&fit=crop',
    hasVideo: true,
    beforeAfter: {
      before: 'Memorized CDP rote-wise, got confused in situational options',
      after: 'Scored perfect 30/30 in CDP, cleared CTET & DSSSB in 1st attempt'
    },
    badge: 'CDP 30/30 Perfect Score'
  },
  {
    id: 'test-3',
    name: 'Ananya Mukherjee',
    exam: 'Ph.D. Entrance PET & UGC NET JRF',
    scoreOrRank: 'Rank 1 (Ph.D. PET BHU) + JRF Qualified',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=250&auto=format&fit=crop',
    quote: 'The Research Methodology course is pure gold. Ma’am explained parametric vs non-parametric tests, sampling bias, and research proposal drafting so intuitively that my Ph.D. synopsis was approved in one go at BHU interview!',
    year: '2024 Selection',
    collegeOrRole: 'Ph.D. Research Fellow, Banaras Hindu University',
    videoDuration: '4:15 min',
    videoThumbnail: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?q=80&w=600&auto=format&fit=crop',
    hasVideo: true,
    beforeAfter: {
      before: 'Zero statistical clarity, had proposal rejected in two university interviews',
      after: 'Rank 1 in BHU PET, published 1st Scopus research paper under mentorship'
    },
    badge: 'Rank 1 Ph.D. Entrance'
  },
  {
    id: 'test-4',
    name: 'Vikas Deshmukh',
    exam: 'MH-SET & UGC NET Assistant Professor',
    scoreOrRank: 'Paper 1: 84/100 (Qualified NET & MH-SET)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250&auto=format&fit=crop',
    quote: 'The mock test platform replicates the exact NTA CBT interface. The unit-wise PDF mindmaps saved me 100+ hours of note-making. If you want conceptual mastery without overwhelm, Dr. Ankita Bisht is the ultimate mentor.',
    year: 'June 2024 Cycle',
    collegeOrRole: 'Assistant Professor (College Cadre)',
    videoDuration: '3:10 min',
    videoThumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop',
    hasVideo: false,
    beforeAfter: {
      before: 'Time management issues during CBT exam, scored only 52 marks',
      after: 'Completed Paper 1 in 50 minutes with 42/50 correct answers'
    },
    badge: 'Assistant Professor Selected'
  },
  {
    id: 'test-5',
    name: 'Meenakshi Sundaram',
    exam: 'UGC NET Paper 1 & Educational Psychology',
    scoreOrRank: 'Paper 1: 86/100 (JRF Qualified)',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=250&auto=format&fit=crop',
    quote: 'Being a working professional, I had only 2 hours daily. Dr. Ankita ma’am’s recorded lecture structure, 1.5x speed player, and crisp PDF capsules allowed me to cover the syllabus systematically while working full-time.',
    year: 'Dec 2024 Cycle',
    collegeOrRole: 'Senior Lecturer & JRF Scholar',
    videoDuration: '2:50 min',
    videoThumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
    hasVideo: true,
    beforeAfter: {
      before: 'Working professional with only 2 hrs/day, missed cutoff by 4 marks',
      after: 'Cleared JRF with 99.4% percentile using high-yield capsule notes'
    },
    badge: 'Working Professional JRF'
  }
];

export const statisticsData = [
  { value: '15,000+', label: 'Students Mentored Across India', subtext: 'Online Live & Self-Paced Courses' },
  { value: '500+', label: 'JRF & NET Selections', subtext: 'Top All-India Rankers in Paper 1 & Education' },
  { value: '94.8%', label: 'Success & Qualification Rate', subtext: 'Aspirants clearing cutoffs on 1st/2nd attempt' },
  { value: '4.95 / 5', label: 'Average Student Rating', subtext: 'Rated by 4,500+ verified learners' }
];
