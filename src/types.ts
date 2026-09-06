export interface Course {
  id: string;
  title: string;
  slug: string;
  category: 'UGC NET' | 'Research' | 'Pedagogy & CDP' | 'Psychology';
  badge?: string;
  isPopular?: boolean;
  shortDesc: string;
  fullDesc: string;
  duration: string;
  liveHours: string;
  validity: string;
  originalPrice: number;
  price: number;
  rating: number;
  reviewsCount: number;
  studentCount: string;
  medium: string;
  targetExams: string[];
  highlights: string[];
  syllabusModules: {
    unitNumber: string;
    unitTitle: string;
    topics: string[];
    hours: string;
  }[];
  keyBenefits: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  exam: string;
  scoreOrRank: string;
  avatar: string;
  quote: string;
  year: string;
  collegeOrRole: string;
  videoDuration?: string;
  videoThumbnail?: string;
  hasVideo?: boolean;
  beforeAfter?: {
    before: string;
    after: string;
  };
  badge: string;
}

export interface Resource {
  id: string;
  title: string;
  category: 'UGC NET Paper 1' | 'Research Methodology' | 'CDP & Pedagogy' | 'Educational Psychology' | 'PYQ Papers';
  type: 'PDF Notes' | 'PYQ Solved' | 'Mindmap' | 'Formula Sheet' | 'E-Book';
  fileSize: string;
  pageCount: number;
  downloadCount: string;
  description: string;
  topicsCovered: string[];
  previewSnippet: string;
  isPopular?: boolean;
}

export interface QuizQuestion {
  id: number;
  subject: string;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
}

export interface FAQItem {
  id: string;
  category: 'Courses & Syllabus' | 'Live Classes & Recordings' | 'Fee & Validity' | 'Mentorship & Mock Tests';
  question: string;
  answer: string;
}

export interface LeadFormData {
  name: string;
  phone: string;
  email: string;
  course: string;
  prepStage: string;
  message: string;
}

export interface DemoBookingData {
  name: string;
  phone: string;
  email: string;
  course: string;
  preferredDate: string;
  preferredSlot: string;
}
