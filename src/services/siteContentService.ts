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
  version: 1,
  lastUpdated: new Date().toISOString(),
  announcement: {
    enabled: true,
    badgeText: 'ADMISSIONS OPEN 🔥',
    headline: '⚡ New 2026 Target Batches (UGC NET Paper 1 & CDP 30/30) Starting Soon! Flat 50% Scholarship',
    buttonText: 'Book Free Demo',
    buttonAction: 'demo_modal'
  },
  hero: {
    topBadge: '🌟 #1 Trusted Online Academy for UGC NET & Pedagogy',
    mainTitleLine1: 'Crack UGC NET, CDP & Research',
    mainTitleGradient: 'In First Attempt',
    description: 'Learn directly from Dr. Ankita Bisht (Ph.D., UGC NET JRF, Gold Medalist). Live interactive classes, high-yield PDF notes, NTA CBT mock test series & personalized 1-on-1 mentorship.',
    primaryButtonText: 'Explore 2026 Masterclasses',
    secondaryButtonText: 'Book Free Live Demo',
    trustStats: [
      { value: '15,000+', label: 'Aspirants Mentored' },
      { value: '94.8%', label: 'Exam Success Rate' },
      { value: '88+', label: 'Avg. Paper 1 Score' },
      { value: '100%', label: 'Live Doubt Support' }
    ],
    educatorBadge: 'Dr. Ankita Bisht (Ph.D., Gold Medalist)',
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
    headline: 'Ph.D., UGC NET JRF Qualified, University Gold Medalist & Senior Academic Mentor',
    bioParagraphs: [
      'Dr. Ankita Bisht is an accomplished educator, author, and researcher with over a decade of specialized experience in preparing aspirants for UGC NET General Paper 1, Child Development & Pedagogy (CDP 30/30), and advanced Research Methodology with SPSS data analysis.',
      'Having mentored over 15,000 students across India, her pedagogy focuses on dismantling complex theoretical concepts into visual memory frameworks, logical reasoning shortcuts, and practical real-world analogies.',
      'Her mission is to provide affordable, highest-quality higher education coaching to every aspiring Assistant Professor, Ph.D. scholar, and school educator nationwide.'
    ],
    qualifications: [
      'Ph.D. in Education & Applied Sciences',
      'UGC NET JRF Qualified (Top Percentile Ranker)',
      'University Gold Medalist in Post-Graduation',
      'Author of multiple UGC-CARE indexed research papers & academic books',
      '10+ Years of proven teaching & mentorship track record'
    ],
    photoUrl: '/images/ankita-photo.png',
    stats: [
      { value: '10+ Years', label: 'Teaching Experience' },
      { value: '15,000+', label: 'Successful Students' },
      { value: '250+', label: 'JRF & NET Selections' },
      { value: '98%', label: 'Positive Feedback' }
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
    sectionTitle: 'Download High-Yield PDF Notes & Solved PYQs',
    sectionSubtitle: 'Free sample revision notes, formula sheets, and past year question papers to supercharge your preparation.',
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
    telegramUrl: 'https://t.me/DrAnkitaBishtUGC',
    instagramUrl: 'https://instagram.com/learnwithdrankita',
    footerCopyright: '© 2026 Dr. Ankita Bisht Academic Academy. All rights reserved.'
  }
};

const STORAGE_KEY = 'dr_ankita_site_content_config';

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
      // Merge with defaults to ensure all keys exist
      return {
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
    } catch {
      return DEFAULT_SITE_CONTENT;
    }
  },

  setSiteContent(config: SiteContentConfig): void {
    if (typeof window === 'undefined') return;
    const updated = {
      ...config,
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
          this.setSiteContent(data.content);
          return this.getSiteContent();
        }
      }
    } catch (e) {
      console.warn('Site content remote fetch failed, using cache', e);
    }
    return this.getSiteContent();
  },

  async publishLiveContent(config: SiteContentConfig): Promise<boolean> {
    this.setSiteContent(config);
    try {
      const res = await fetch('/api/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: config })
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
    return DEFAULT_SITE_CONTENT;
  }
};
