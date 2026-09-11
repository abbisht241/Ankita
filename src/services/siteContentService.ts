import { coursesData } from '../data/coursesData';
import { faqData } from '../data/faqData';
import { resourcesData } from '../data/resourcesData';
import { testimonialsData } from '../data/testimonialsData';
import type { Course, FAQItem, Resource, Testimonial } from '../types';

export interface AnnouncementConfig {
  enabled: boolean;
  badgeText: string;
  headline: string;
  buttonText: string;
  buttonAction: string;
}

export interface HeroConfig {
  topBadge: string;
  mainTitleLine1: string;
  mainTitleGradient: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  trustStats: Array<{ label: string; value: string }>;
  educatorBadge: string;
  photoUrl: string;
}

export interface CoursesConfig {
  sectionBadge: string;
  sectionTitle: string;
  sectionSubtitle: string;
  courses: Course[];
}

export interface AboutConfig {
  sectionBadge: string;
  name: string;
  headline: string;
  bioParagraphs: string[];
  qualifications: string[];
  photoUrl: string;
  stats: Array<{ label: string; value: string }>;
}

export interface FeaturesConfig {
  sectionBadge: string;
  sectionTitle: string;
  sectionSubtitle: string;
  items: Array<{ title: string; desc: string; icon: string }>;
}

export interface ResourcesConfig {
  sectionBadge: string;
  sectionTitle: string;
  sectionSubtitle: string;
  resources: Resource[];
}

export interface TestimonialsConfig {
  sectionBadge: string;
  sectionTitle: string;
  sectionSubtitle: string;
  testimonials: Testimonial[];
}

export interface FaqConfig {
  sectionBadge: string;
  sectionTitle: string;
  sectionSubtitle: string;
  faqs: FAQItem[];
}

export interface ContactConfig {
  instituteName: string;
  phonePrimary: string;
  phoneSecondary: string;
  whatsappNumber: string;
  email: string;
  address: string;
  youtubeUrl: string;
  telegramUrl: string;
  instagramUrl: string;
  footerCopyright: string;
}

export interface SiteContentConfig {
  version: number;
  lastUpdated: string;
  announcement: AnnouncementConfig;
  hero: HeroConfig;
  courses: CoursesConfig;
  about: AboutConfig;
  features: FeaturesConfig;
  resources: ResourcesConfig;
  testimonials: TestimonialsConfig;
  faq: FaqConfig;
  contact: ContactConfig;
}

export const DEFAULT_SITE_CONTENT: SiteContentConfig = {
  version: 4,
  lastUpdated: new Date().toISOString(),
  announcement: {
    enabled: true,
    badgeText: 'ADMISSIONS OPEN 🔥',
    headline: '⚡ New 2026 Target Batches (UGC NET Paper 1 & CDP 30/30) Starting Soon! Learn from Central University Gold Medalist',
    buttonText: 'Book Free Demo',
    buttonAction: 'demo_modal'
  },
  hero: {
    topBadge: '🌟 Rank 1 Gold Medalist & Asst. Professor (Central University)',
    mainTitleLine1: 'Crack UGC NET, CDP & Research',
    mainTitleGradient: 'In First Attempt',
    description: 'Transform your preparation with Online Live Classes, 24/7 Recorded Lectures, bilingual High-Yield PDF Notes, NTA CBT Mock Tests, and personal 1-on-1 Mentorship by Dr. Ankita Bisht (Ph.D. Home Science 2024, UGC-NET Qualified, Assistant Professor HNBGU).',
    primaryButtonText: 'Explore 2026 Batches',
    secondaryButtonText: 'Book Free Live Demo',
    trustStats: [
      { value: 'Ph.D. (2024)', label: 'Doctoral Degree' },
      { value: 'Rank 1', label: 'University Gold Medalist' },
      { value: '8+ Papers', label: 'UGC-CARE Published' },
      { value: 'Central Univ.', label: 'Assistant Professor' }
    ],
    educatorBadge: 'Dr. Ankita Bisht (Ph.D., Gold Medalist, Asst. Professor)',
    photoUrl: '/images/ankita-photo.png'
  },
  courses: {
    sectionBadge: 'Target Batches 2026',
    sectionTitle: 'Structured Programs Built for Top Percentiles',
    sectionSubtitle: 'Choose your examination goal and get end-to-end guidance with live lectures, bilingual notes & NTA mock test software.',
    courses: coursesData
  },
  about: {
    sectionBadge: 'Meet Your Chief Educator',
    name: 'Dr. Ankita Bisht',
    headline: 'Assistant Professor (Guest Faculty), Central University • Ph.D. in Home Science (2024) • Rank 1 Gold Medalist • UGC-NET Qualified',
    bioParagraphs: [
      'Hello and welcome! I am Dr. Ankita Bisht. I serve as an Assistant Professor (Guest Faculty) in the Department of Home Science at H.N.B. Garhwal Central University, Srinagar Garhwal, Uttarakhand (2023–2026).',
      'Having earned my Ph.D. in Home Science (2024), M.A. in Education (2026), and B.Ed. (2015), along with achieving Rank 1 Gold Medalist honours in M.A. Home Science (8.4 CGPA) and UGC-NET qualification, I understand exactly what it takes to master complex pedagogical subjects and crack competitive academic exams with top percentiles.',
      'I am also the published author of the academic research book “समृद्ध स्त्रियां, समृद्ध समाज: उत्तराखण्ड में स्वयं सहायता समूहों की भूमिका” and have published 8+ research papers in UGC-CARE Listed and international peer-reviewed journals. My teaching philosophy connects theoretical foundations directly with real-world empirical examples and scientific research insights.'
    ],
    qualifications: [
      'Assistant Professor (Guest Faculty), HNB Garhwal Central University (2023-2026)',
      'Doctoral Qualification: Ph.D. in Home Science (2024), H.N.B. Garhwal University',
      'Education Degrees: M.A. Education (2026) & B.Ed. (2015)',
      'Academic Distinction: Rank 1 - Gold Medalist (M.A. Home Science 2018, 8.4 CGPA)',
      'National Milestone: UGC-NET Qualified (NTA) in Home Science (2020)',
      'Published Author: Book "समृद्ध स्त्रियां, समृद्ध समाज" & 8+ UGC-CARE Papers',
      'Researcher Profiles: ORCID (0009-0008-5085-3278) & Academia.edu Verified'
    ],
    photoUrl: '/images/ankita-photo.png',
    stats: [
      { value: 'Ph.D. (2024)', label: 'Doctoral Degree' },
      { value: 'Rank 1', label: 'Gold Medalist' },
      { value: '8+ Papers', label: 'UGC-CARE Published' },
      { value: '1-on-1', label: 'Doubt Mentorship' }
    ]
  },
  features: {
    sectionBadge: 'The Ankita Bisht Method',
    sectionTitle: 'Why Our Academy Delivers Unmatched Results',
    sectionSubtitle: 'Every aspect of our learning pedagogy is crafted to maximize conceptual clarity, retention, and NTA CBT speed.',
    items: [
      {
        title: 'Daily Live Interactive Classes',
        desc: 'Engage with Dr. Ankita Bisht daily in HD live sessions with direct audio-chat doubt resolution.',
        icon: 'Video'
      },
      {
        title: 'Bilingual High-Yield PDF Notes',
        desc: 'Concise unit-wise notes, formula cheat sheets, and visual mindmaps in Hindi & English.',
        icon: 'FileText'
      },
      {
        title: 'NTA CBT Test Series & Solved PYQs',
        desc: 'Authentic online CBT test environment with question palette, negative marking, and detailed rank analysis.',
        icon: 'CheckCircle2'
      },
      {
        title: '1-on-1 Direct Doubt Mentorship',
        desc: 'Dedicated WhatsApp doubt portal and weekly personal strategy calls directly with faculty.',
        icon: 'MessageSquare'
      }
    ]
  },
  resources: {
    sectionBadge: '100% Free Study Material',
    sectionTitle: 'Free High-Yield Notes, Solved PYQs & Practice Hub',
    sectionSubtitle: 'Boost your daily preparation with curated revision mindmaps, solved exam archives, and diagnostic tests.',
    resources: resourcesData
  },
  testimonials: {
    sectionBadge: 'Hall of Fame',
    sectionTitle: 'Stories of Hard Work, Mentorship & Success',
    sectionSubtitle: 'Hear directly from our students who secured JRF AIR ranks, Assistant Professorships, and CTET top scores.',
    testimonials: testimonialsData
  },
  faq: {
    sectionBadge: 'Got Questions?',
    sectionTitle: 'Frequently Asked Questions',
    sectionSubtitle: 'Everything you need to know about our batches, live sessions, offline recordings, and enrollment.',
    faqs: faqData
  },
  contact: {
    instituteName: 'Dr. Ankita Bisht Academic Academy',
    phonePrimary: '+91 7417268651',
    phoneSecondary: '+91 8449137304',
    whatsappNumber: '917417268651',
    email: 'contact@learnwithdrankita.com',
    address: 'Kanoth, Uttarakhand, India - 246149',
    youtubeUrl: 'https://youtube.com/@learnwithdrankita',
    telegramUrl: 'https://t.me/drankitaeducator',
    instagramUrl: 'https://instagram.com/learnwithdrankita',
    footerCopyright: '© 2026 Dr. Ankita Bisht Academic Academy. All rights reserved.'
  }
};

const STORAGE_KEY = 'dr_ankita_site_content_config';

function removeSpssFromText(text: string): string {
  if (typeof text !== 'string') return text;
  return text
    .replace(/Hands-with practical data analysis/gi, 'Hands-on Statistical')
    .replace(/Hands-on\s*SPSS/gi, 'Hands-on Statistical')
    .replace(/Research Methodology\s*&\s*SPSS\s*Data Analysis/gi, 'Research Methodology & Data Analysis')
    .replace(/Research Methodology\s*&\s*SPSS/gi, 'Research Methodology & Data Analysis')
    .replace(/&\s*SPSS\s*(\(?Ph\.D\.\s*PET\)?)?/gi, '')
    .replace(/SPSS statistical tests/gi, 'advanced statistical tests')
    .replace(/SPSS statistical insights/gi, 'scientific research insights')
    .replace(/SPSS data analysis/gi, 'statistical data analysis')
    .replace(/SPSS Software/gi, 'Statistical Software')
    .replace(/SPSS practice datasets/gi, 'research practice datasets')
    .replace(/SPSS Output Interpretation/gi, 'Statistical Output Interpretation')
    .replace(/SPSS Decision Rule/gi, 'Statistical Decision Rule')
    .replace(/SPSS outputs/gi, 'analytical outputs')
    .replace(/on SPSS/gi, 'with practical data analysis')
    .replace(/in SPSS/gi, 'in statistical data analysis')
    .replace(/Research Statistics on SPSS/gi, 'Research Statistics')
    .replace(/\bSPSS\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function deepCleanSpss(obj: any): any {
  if (!obj) return obj;
  if (typeof obj === 'string') {
    return removeSpssFromText(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(deepCleanSpss);
  }
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const [key, val] of Object.entries(obj)) {
      if (key === 'id' && typeof val === 'string' && val.includes('spss')) {
        cleaned[key] = val;
      } else {
        cleaned[key] = deepCleanSpss(val);
      }
    }
    return cleaned;
  }
  return obj;
}

export const SiteContentService = {
  getSiteContent(): SiteContentConfig {
    if (typeof window === 'undefined') return DEFAULT_SITE_CONTENT;
    const local = localStorage.getItem(STORAGE_KEY);
    if (!local) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SITE_CONTENT));
      return DEFAULT_SITE_CONTENT;
    }
    try {
      const parsed = JSON.parse(local);
      // Auto-migrate if older version or contains legacy SPSS or Hands-with
      if (!parsed.version || parsed.version < 4 || local.includes('SPSS') || local.includes('Hands-with')) {
        const cleaned = deepCleanSpss({
          ...DEFAULT_SITE_CONTENT,
          ...parsed,
          version: 4,
          about: { ...DEFAULT_SITE_CONTENT.about, ...(parsed.about || {}) },
          resources: { ...DEFAULT_SITE_CONTENT.resources, ...(parsed.resources || {}) },
          courses: { ...DEFAULT_SITE_CONTENT.courses, ...(parsed.courses || {}) }
        });
        cleaned.version = 4;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
        return cleaned;
      }
      // Merge with defaults to ensure all keys exist
      const merged = {
        ...DEFAULT_SITE_CONTENT,
        ...parsed,
        announcement: { ...DEFAULT_SITE_CONTENT.announcement, ...(parsed.announcement || {}) },
        hero: { ...DEFAULT_SITE_CONTENT.hero, ...(parsed.hero || {}) },
        courses: { ...DEFAULT_SITE_CONTENT.courses, ...(parsed.courses || {}) },
        about: { ...DEFAULT_SITE_CONTENT.about, ...(parsed.about || {}) },
        features: { ...DEFAULT_SITE_CONTENT.features, ...(parsed.features || {}) },
        resources: { ...DEFAULT_SITE_CONTENT.resources, ...(parsed.resources || {}) },
        testimonials: { ...DEFAULT_SITE_CONTENT.testimonials, ...(parsed.testimonials || {}) },
        faq: { ...DEFAULT_SITE_CONTENT.faq, ...(parsed.faq || {}) },
        contact: { ...DEFAULT_SITE_CONTENT.contact, ...(parsed.contact || {}) }
      };
      return deepCleanSpss(merged);
    } catch {
      return DEFAULT_SITE_CONTENT;
    }
  },

  setSiteContent(config: SiteContentConfig): void {
    if (typeof window === 'undefined') return;
    const cleaned = deepCleanSpss(config);
    const updated = {
      ...cleaned,
      version: 4,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  async fetchRemoteContent(): Promise<SiteContentConfig> {
    try {
      const res = await fetch('/api/site-content');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.content) {
          const cleaned = deepCleanSpss(data.content);
          cleaned.version = 4;
          this.setSiteContent(cleaned);
          return cleaned;
        }
      }
    } catch (e) {
      console.warn('Site content remote fetch failed, using cache', e);
    }
    return this.getSiteContent();
  },

  async publishLiveContent(config: SiteContentConfig): Promise<boolean> {
    const cleaned = deepCleanSpss(config);
    cleaned.version = 4;
    this.setSiteContent(cleaned);
    try {
      const res = await fetch('/api/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: cleaned })
      });
      return res.ok;
    } catch (e) {
      console.warn('Remote publish failed, persisted locally', e);
      return false;
    }
  },

  resetToDefaults(): SiteContentConfig {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SITE_CONTENT));
    }
    // Automatically trigger cloud update
    fetch('/api/site-content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: DEFAULT_SITE_CONTENT })
    }).catch(() => {});
    return DEFAULT_SITE_CONTENT;
  }
};
