import React, { useState } from 'react';
import { 
  Globe, 
  Megaphone, 
  Sparkles, 
  BookOpen, 
  User, 
  Award, 
  FileText, 
  MessageSquareQuote, 
  HelpCircle, 
  Phone, 
  Save, 
  RotateCcw, 
  Check, 
  Plus, 
  Trash2, 
  Eye,
  Link as LinkIcon,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSiteContent } from '../../context/SiteContentContext';
import type { SiteContentConfig } from '../../services/siteContentService';
import { AdminStorage } from '../../services/adminStorageService';
import type { Course, FAQItem, Resource, Testimonial } from '../../types';
import { CourseSyllabusEditorModal } from './CourseSyllabusEditorModal';

export const AdminCmsTab: React.FC = () => {
  const { content, publishContent, resetToDefaults } = useSiteContent();
  const [formData, setFormData] = useState<SiteContentConfig>(content);
  const [activeSubTab, setActiveSubTab] = useState<
    'announcement' | 'hero' | 'courses' | 'about' | 'features' | 'resources' | 'testimonials' | 'faq' | 'contact'
  >('announcement');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [editingSyllabusCourseIndex, setEditingSyllabusCourseIndex] = useState<number | null>(null);
  const [syllabusNotification, setSyllabusNotification] = useState<string | null>(null);

  // Sync when content loads
  React.useEffect(() => {
    setFormData(content);
  }, [content]);

  const handleSaveAndPublish = async () => {
    setIsPublishing(true);
    await publishContent(formData);
    setIsPublishing(false);
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 3000);


    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleReset = async () => {
    if (confirm('Kya aap Dr. Ankita Bisht ki authentic CV details (Ph.D. Home Science 2024, Assistant Professor Central University, Gold Medalist, Published Book & Research Papers, 6 Batches, Contact info) ko restore karke Live website par publish karna chahte hain?')) {
      const defaults = resetToDefaults();
      setFormData(defaults);
      setIsPublishing(true);
      await publishContent(defaults);
      setIsPublishing(false);
      setPublishSuccess(true);
      setTimeout(() => setPublishSuccess(false), 3000);
      try {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
      alert('✅ Dr. Ankita Bisht ki complete verified CV information successfully restore aur live website par publish ho chuki hai!');
    }
  };

  const subTabs = [
    { id: 'announcement', label: 'Top Banner', icon: Megaphone },
    { id: 'hero', label: 'Hero & Tagline', icon: Sparkles },
    { id: 'courses', label: 'Courses & Pricing', icon: BookOpen },
    { id: 'about', label: 'About Dr. Ankita', icon: User },
    { id: 'features', label: 'Teaching Pillars', icon: Award },
    { id: 'resources', label: 'Free Study Notes', icon: FileText },
    { id: 'testimonials', label: 'Testimonials & Reviews', icon: MessageSquareQuote },
    { id: 'faq', label: 'FAQs Manager', icon: HelpCircle },
    { id: 'contact', label: 'Contact & Socials', icon: Phone },
  ] as const;

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      
      {/* 1. Header Toolbar */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-indigo-950 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-brand-800/40 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-300 text-xs font-bold px-3 py-1 rounded-full border border-brand-500/30">
            <Globe className="w-3.5 h-3.5" />
            <span>Full Website Content Management System (CMS)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display">
            Manage &amp; Edit Live Website
          </h2>
          <p className="text-xs text-brand-200 max-w-xl">
            Edit every word, course, fee price, hero banner, FAQ, free PDF, and review on <strong>learnwithdrankita.com</strong> without writing a single line of code.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 flex-wrap">
          <button
            onClick={handleReset}
            className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-amber-500/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Restore official CV details from Dr. Ankita Bisht resume"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>🔄 Restore Official CV Details</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Site ↗</span>
          </a>

          <button
            onClick={handleSaveAndPublish}
            disabled={isPublishing}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-black px-5 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {publishSuccess ? (
              <>
                <Check className="w-4 h-4 text-slate-950" />
                <span>Published Successfully! ✓</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isPublishing ? 'Publishing Live...' : '🚀 Save & Publish Live'}</span>
              </>
            )}
          </button>
        </div>

        <div className="absolute right-0 top-0 w-80 h-80 bg-brand-500/10 blur-3xl rounded-full pointer-events-none" />
      </div>

      {/* 2. Sub-Tabs Navigation */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-subtle flex items-center gap-1.5 overflow-x-auto">
        {subTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-brand-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Sub-Tab Editors */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-subtle space-y-6">
        
        {/* SUBTAB 1: ANNOUNCEMENT BAR */}
        {activeSubTab === 'announcement' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-lg text-slate-900 font-display">
                Top Announcement Bar Settings
              </h3>
              <p className="text-xs text-slate-500">The banner displayed at the very top of all website pages.</p>
            </div>

            <div className="space-y-4 text-xs">
              <label className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.announcement.enabled}
                  onChange={(e) => setFormData({
                    ...formData,
                    announcement: { ...formData.announcement, enabled: e.target.checked }
                  })}
                  className="w-4 h-4 rounded text-brand-600"
                />
                <span className="font-bold text-slate-800">
                  Enable Top Announcement Bar on Website
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Badge Text (e.g. ADMISSIONS OPEN 🔥)</label>
                  <input
                    type="text"
                    value={formData.announcement.badgeText}
                    onChange={(e) => setFormData({
                      ...formData,
                      announcement: { ...formData.announcement, badgeText: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Button Label (e.g. Book Free Demo)</label>
                  <input
                    type="text"
                    value={formData.announcement.buttonText}
                    onChange={(e) => setFormData({
                      ...formData,
                      announcement: { ...formData.announcement, buttonText: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Announcement Message Headline</label>
                <textarea
                  rows={2}
                  value={formData.announcement.headline}
                  onChange={(e) => setFormData({
                    ...formData,
                    announcement: { ...formData.announcement, headline: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: HERO SECTION */}
        {activeSubTab === 'hero' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-lg text-slate-900 font-display">
                Hero &amp; Main Headline Section
              </h3>
              <p className="text-xs text-slate-500">The main banner at the top of the homepage.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Top Badge Label</label>
                <input
                  type="text"
                  value={formData.hero.topBadge}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, topBadge: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Main Heading (Part 1)</label>
                  <input
                    type="text"
                    value={formData.hero.mainTitleLine1}
                    onChange={(e) => setFormData({
                      ...formData,
                      hero: { ...formData.hero, mainTitleLine1: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gradient Highlight (Part 2)</label>
                  <input
                    type="text"
                    value={formData.hero.mainTitleGradient}
                    onChange={(e) => setFormData({
                      ...formData,
                      hero: { ...formData.hero, mainTitleGradient: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-bold text-brand-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description Paragraph</label>
                <textarea
                  rows={3}
                  value={formData.hero.description}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, description: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary CTA Button Label</label>
                  <input
                    type="text"
                    value={formData.hero.primaryButtonText}
                    onChange={(e) => setFormData({
                      ...formData,
                      hero: { ...formData.hero, primaryButtonText: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Secondary CTA Button Label</label>
                  <input
                    type="text"
                    value={formData.hero.secondaryButtonText}
                    onChange={(e) => setFormData({
                      ...formData,
                      hero: { ...formData.hero, secondaryButtonText: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium"
                  />
                </div>
              </div>

              {/* 4 Trust Stats */}
              <div>
                <label className="block font-bold text-slate-700 mb-2">4 Trust Metric Chips</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {formData.hero.trustStats.map((stat, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => {
                          const updated = [...formData.hero.trustStats];
                          updated[idx] = { ...updated[idx], value: e.target.value };
                          setFormData({ ...formData, hero: { ...formData.hero, trustStats: updated } });
                        }}
                        placeholder="e.g. 15,000+"
                        className="w-full px-2 py-1 text-xs font-black text-brand-900 border border-slate-300 rounded-lg bg-white"
                      />
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const updated = [...formData.hero.trustStats];
                          updated[idx] = { ...updated[idx], label: e.target.value };
                          setFormData({ ...formData, hero: { ...formData.hero, trustStats: updated } });
                        }}
                        placeholder="Label"
                        className="w-full px-2 py-1 text-[11px] text-slate-600 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: COURSES & PRICING */}
        {activeSubTab === 'courses' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 font-display">
                  Courses, Batches &amp; Pricing Manager ({formData.courses.courses.length} Batches)
                </h3>
                <p className="text-xs text-slate-500">Edit existing batches, add new courses, update discounted fees, or delete old offerings.</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newId = `course-${Date.now()}`;
                  const newCourse: Course = {
                    id: newId,
                    title: 'New UGC NET Masterclass Batch',
                    slug: `batch-${newId}`,
                    category: 'UGC NET Paper 1',
                    badge: 'New Batch 🔥',
                    isPopular: false,
                    shortDesc: 'Complete syllabus coverage with live evening classes, high-yield bilingual PDF notes, and NTA CBT mock tests.',
                    fullDesc: 'Comprehensive preparation batch designed and taught personally by Dr. Ankita Bisht.',
                    duration: '3 Months (60+ Hours)',
                    liveHours: '60+ Live Interactive Hours',
                    validity: '1 Year Full Access',
                    originalPrice: 2999,
                    price: 999,
                    rating: 4.95,
                    reviewsCount: 150,
                    studentCount: '500+ Enrolled',
                    medium: 'Bilingual (Hindi + English)',
                    targetExams: ['UGC NET JRF', 'SET Exams', 'Ph.D. Entrance PET'],
                    highlights: [
                      '100% Comprehensive Syllabus Coverage',
                      'Daily Live Classes & 24/7 Unlimited Recorded Lectures',
                      'High-Yield Unit-Wise PDF Notes in Hindi & English',
                      'Full NTA CBT Pattern Mock Test Series with Solutions'
                    ],
                    syllabusModules: [
                      {
                        unitNumber: 'Unit 1',
                        unitTitle: 'Teaching Aptitude & Core Concepts',
                        hours: '12 Hours',
                        topics: ['Levels of Teaching', 'Modern Evaluation Systems & ICT']
                      }
                    ],
                    keyBenefits: [
                      'Achieve top percentiles and JRF cut-off with ease',
                      '1-on-1 strategy doubt session with Dr. Ankita Bisht'
                    ]
                  };

                  setFormData({
                    ...formData,
                    courses: {
                      ...formData.courses,
                      courses: [newCourse, ...formData.courses.courses]
                    }
                  });
                }}
                className="bg-brand-700 hover:bg-brand-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:shadow-brand-700/20 transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add New Course</span>
              </button>
            </div>

            {syllabusNotification && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between animate-fadeIn shadow-xs">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{syllabusNotification}</span>
                </div>
                <button
                  type="button"
                  onClick={handleSaveAndPublish}
                  disabled={isPublishing}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors shrink-0 ml-2"
                >
                  Publish Live Now 🚀
                </button>
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={formData.courses.sectionTitle}
                    onChange={(e) => setFormData({
                      ...formData,
                      courses: { ...formData.courses, sectionTitle: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Section Subtitle</label>
                  <input
                    type="text"
                    value={formData.courses.sectionSubtitle}
                    onChange={(e) => setFormData({
                      ...formData,
                      courses: { ...formData.courses, sectionSubtitle: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Course Cards List */}
              <div className="space-y-4 pt-2">
                {formData.courses.courses.map((course, idx) => (
                  <div key={course.id || idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 relative group/card hover:border-brand-300 transition-colors">
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-brand-700 text-white font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div className="font-bold text-sm text-brand-900 truncate max-w-sm sm:max-w-md">
                          {course.title || `Course #${idx + 1}`}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-slate-400 hidden sm:inline">ID: {course.id}</span>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${course.title}"? This cannot be undone.`)) {
                              const updated = formData.courses.courses.filter((_, i) => i !== idx);
                              setFormData({
                                ...formData,
                                courses: { ...formData.courses, courses: updated }
                              });
                            }
                          }}
                          className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 p-1.5 rounded-lg transition-colors flex items-center gap-1 font-bold text-xs cursor-pointer border border-rose-200"
                          title="Delete this Course"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Course Title *</label>
                        <input
                          type="text"
                          required
                          value={course.title}
                          onChange={(e) => {
                            const updated = [...formData.courses.courses];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            setFormData({ ...formData, courses: { ...formData.courses, courses: updated } });
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Discounted Sale Fee (₹) *</label>
                        <input
                          type="number"
                          required
                          value={course.price}
                          onChange={(e) => {
                            const updated = [...formData.courses.courses];
                            updated[idx] = { ...updated[idx], price: Number(e.target.value) };
                            setFormData({ ...formData, courses: { ...formData.courses, courses: updated } });
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-black text-emerald-700 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Original Price (₹)</label>
                        <input
                          type="number"
                          value={course.originalPrice}
                          onChange={(e) => {
                            const updated = [...formData.courses.courses];
                            updated[idx] = { ...updated[idx], originalPrice: Number(e.target.value) };
                            setFormData({ ...formData, courses: { ...formData.courses, courses: updated } });
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-medium text-slate-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Category</label>
                        <select
                          value={course.category}
                          onChange={(e) => {
                            const updated = [...formData.courses.courses];
                            updated[idx] = { ...updated[idx], category: e.target.value };
                            setFormData({ ...formData, courses: { ...formData.courses, courses: updated } });
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-semibold text-slate-800"
                        >
                          <option value="UGC NET Paper 1">UGC NET Paper 1</option>
                          <option value="Research">Research Methodology</option>
                          <option value="Pedagogy & CDP">Pedagogy &amp; CDP</option>
                          <option value="Nutrition & Health">Nutrition &amp; Health</option>
                          <option value="Psychology">Psychology</option>
                          <option value="Teaching Aptitude">Teaching Aptitude</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Badge (e.g. Best Seller 🔥)</label>
                        <input
                          type="text"
                          value={course.badge || ''}
                          onChange={(e) => {
                            const updated = [...formData.courses.courses];
                            updated[idx] = { ...updated[idx], badge: e.target.value };
                            setFormData({ ...formData, courses: { ...formData.courses, courses: updated } });
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Duration &amp; Hours</label>
                        <input
                          type="text"
                          value={course.duration}
                          onChange={(e) => {
                            const updated = [...formData.courses.courses];
                            updated[idx] = { ...updated[idx], duration: e.target.value };
                            setFormData({ ...formData, courses: { ...formData.courses, courses: updated } });
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Validity</label>
                        <input
                          type="text"
                          value={course.validity}
                          onChange={(e) => {
                            const updated = [...formData.courses.courses];
                            updated[idx] = { ...updated[idx], validity: e.target.value };
                            setFormData({ ...formData, courses: { ...formData.courses, courses: updated } });
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">⭐ Rating (e.g. 4.95)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="1"
                          max="5"
                          value={course.rating ?? 4.95}
                          onChange={(e) => {
                            const updated = [...formData.courses.courses];
                            updated[idx] = { ...updated[idx], rating: parseFloat(e.target.value) || 4.95 };
                            setFormData({ ...formData, courses: { ...formData.courses, courses: updated } });
                          }}
                          placeholder="e.g. 4.95"
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold text-amber-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">💬 Reviews Count</label>
                        <input
                          type="number"
                          min="0"
                          value={course.reviewsCount ?? 1420}
                          onChange={(e) => {
                            const updated = [...formData.courses.courses];
                            updated[idx] = { ...updated[idx], reviewsCount: parseInt(e.target.value, 10) || 0 };
                            setFormData({ ...formData, courses: { ...formData.courses, courses: updated } });
                          }}
                          placeholder="e.g. 1420"
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-semibold text-slate-700"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Teaching Medium</label>
                        <input
                          type="text"
                          value={course.medium || 'Bilingual (Hindi + English)'}
                          onChange={(e) => {
                            const updated = [...formData.courses.courses];
                            updated[idx] = { ...updated[idx], medium: e.target.value };
                            setFormData({ ...formData, courses: { ...formData.courses, courses: updated } });
                          }}
                          placeholder="e.g. Bilingual (Hindi + English)"
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block font-semibold text-slate-700">Enrolled Count Badge</label>
                          <span className="text-[10px] bg-brand-50 text-brand-700 font-bold px-1.5 py-0.5 rounded">
                            Live DB: {AdminStorage.getCourseEnrollmentCount(course.id, course.title)}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={course.studentCount || '500+ Enrolled'}
                          onChange={(e) => {
                            const updated = [...formData.courses.courses];
                            updated[idx] = { ...updated[idx], studentCount: e.target.value };
                            setFormData({ ...formData, courses: { ...formData.courses, courses: updated } });
                          }}
                          placeholder="e.g. 1,500+ Enrolled"
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                        />
                        <div className="flex items-center justify-end mt-1">
                          <button
                            type="button"
                            onClick={() => {
                              const liveCount = AdminStorage.getCourseEnrollmentCount(course.id, course.title);
                              const raw = course.studentCount || '';
                              const match = raw.replace(/,/g, '').match(/\d+/);
                              const base = match ? parseInt(match[0], 10) : 0;
                              const newBadge = `${(base + liveCount).toLocaleString('en-IN')}+ Enrolled`;
                              const updated = [...formData.courses.courses];
                              updated[idx] = { ...updated[idx], studentCount: newBadge };
                              setFormData({ ...formData, courses: { ...formData.courses, courses: updated } });
                            }}
                            className="text-[10px] text-brand-700 hover:text-brand-900 font-bold underline cursor-pointer"
                            title="Set badge based on real enrollments"
                          >
                            ⚡ Sync from Students &amp; Enrollments
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Short Description</label>
                      <textarea
                        rows={2}
                        value={course.shortDesc}
                        onChange={(e) => {
                          const updated = [...formData.courses.courses];
                          updated[idx] = { ...updated[idx], shortDesc: e.target.value };
                          setFormData({ ...formData, courses: { ...formData.courses, courses: updated } });
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-xs"
                      />
                    </div>

                    {/* Full Syllabus & Curriculum Action Section */}
                    <div className="pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-gradient-to-r from-brand-50/70 via-slate-50 to-brand-50/70 p-3.5 rounded-xl border border-brand-200 shadow-xs">
                      <div>
                        <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-brand-700" />
                          <span>Detailed Syllabus &amp; Curriculum Breakdown</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap items-center gap-1.5">
                          <span className="bg-white text-brand-800 font-semibold px-2 py-0.5 rounded border border-brand-200">
                            {course.syllabusModules?.length || 0} Modules / Units
                          </span>
                          <span className="bg-white text-slate-700 font-medium px-2 py-0.5 rounded border border-slate-200">
                            {course.targetExams?.length || 0} Target Exams
                          </span>
                          <span className="bg-white text-slate-700 font-medium px-2 py-0.5 rounded border border-slate-200">
                            {course.keyBenefits?.length || 0} Outcomes
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setEditingSyllabusCourseIndex(idx)}
                        className="px-4 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all cursor-pointer shrink-0"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Edit Full Syllabus &amp; Curriculum</span>
                      </button>
                    </div>
                  </div>
                ))}

                {/* Bottom Add Course Action Card */}
                <button
                  type="button"
                  onClick={() => {
                    const newId = `course-${Date.now()}`;
                    const newCourse: Course = {
                      id: newId,
                      title: 'New UGC NET Masterclass Batch',
                      slug: `batch-${newId}`,
                      category: 'UGC NET Paper 1',
                      badge: 'New Batch 🔥',
                      isPopular: false,
                      shortDesc: 'Complete syllabus coverage with live evening classes, high-yield bilingual PDF notes, and NTA CBT mock tests.',
                      fullDesc: 'Comprehensive preparation batch designed and taught personally by Dr. Ankita Bisht.',
                      duration: '3 Months (60+ Hours)',
                      liveHours: '60+ Live Interactive Hours',
                      validity: '1 Year Full Access',
                      originalPrice: 2999,
                      price: 999,
                      rating: 4.95,
                      reviewsCount: 150,
                      studentCount: '500+ Enrolled',
                      medium: 'Bilingual (Hindi + English)',
                      targetExams: ['UGC NET JRF', 'SET Exams', 'Ph.D. Entrance PET'],
                      highlights: [
                        '100% Comprehensive Syllabus Coverage',
                        'Daily Live Classes & 24/7 Unlimited Recorded Lectures',
                        'High-Yield Unit-Wise PDF Notes in Hindi & English',
                        'Full NTA CBT Pattern Mock Test Series with Solutions'
                      ],
                      syllabusModules: [
                        {
                          unitNumber: 'Unit 1',
                          unitTitle: 'Teaching Aptitude & Core Concepts',
                          hours: '12 Hours',
                          topics: ['Levels of Teaching', 'Modern Evaluation Systems & ICT']
                        }
                      ],
                      keyBenefits: [
                        'Achieve top percentiles and JRF cut-off with ease',
                        '1-on-1 strategy doubt session with Dr. Ankita Bisht'
                      ]
                    };

                    setFormData({
                      ...formData,
                      courses: {
                        ...formData.courses,
                        courses: [...formData.courses.courses, newCourse]
                      }
                    });
                  }}
                  className="w-full py-4 border-2 border-dashed border-brand-300 hover:border-brand-500 bg-brand-50/50 hover:bg-brand-50 rounded-2xl text-brand-800 font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="w-5 h-5 text-brand-700" />
                  <span>+ Add Another Course / Batch</span>
                </button>

              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 4: ABOUT DR. ANKITA */}
        {activeSubTab === 'about' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-lg text-slate-900 font-display">
                About Dr. Ankita Bisht Section
              </h3>
              <p className="text-xs text-slate-500">Educator bio, achievements, qualifications, and profile credentials.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Educator Full Name</label>
                  <input
                    type="text"
                    value={formData.about.name}
                    onChange={(e) => setFormData({
                      ...formData,
                      about: { ...formData.about, name: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Profile Photo URL</label>
                  <input
                    type="text"
                    value={formData.about.photoUrl}
                    onChange={(e) => setFormData({
                      ...formData,
                      about: { ...formData.about, photoUrl: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Headline &amp; Title</label>
                <input
                  type="text"
                  value={formData.about.headline}
                  onChange={(e) => setFormData({
                    ...formData,
                    about: { ...formData.about, headline: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bio Paragraph 1</label>
                <textarea
                  rows={3}
                  value={formData.about.bioParagraphs[0] || ''}
                  onChange={(e) => {
                    const bio = [...formData.about.bioParagraphs];
                    bio[0] = e.target.value;
                    setFormData({ ...formData, about: { ...formData.about, bioParagraphs: bio } });
                  }}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bio Paragraph 2</label>
                <textarea
                  rows={3}
                  value={formData.about.bioParagraphs[1] || ''}
                  onChange={(e) => {
                    const bio = [...formData.about.bioParagraphs];
                    bio[1] = e.target.value;
                    setFormData({ ...formData, about: { ...formData.about, bioParagraphs: bio } });
                  }}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              {/* Qualifications */}
              <div>
                <label className="block font-bold text-slate-700 mb-2">Qualifications &amp; Degrees</label>
                <div className="space-y-2">
                  {formData.about.qualifications.map((q, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={q}
                        onChange={(e) => {
                          const updated = [...formData.about.qualifications];
                          updated[idx] = e.target.value;
                          setFormData({ ...formData, about: { ...formData.about, qualifications: updated } });
                        }}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                      />
                      <button
                        onClick={() => {
                          const updated = formData.about.qualifications.filter((_, i) => i !== idx);
                          setFormData({ ...formData, about: { ...formData.about, qualifications: updated } });
                        }}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        about: {
                          ...formData.about,
                          qualifications: [...formData.about.qualifications, 'New Credential / Gold Medalist']
                        }
                      });
                    }}
                    className="text-xs font-bold text-brand-700 hover:underline flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Qualification</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 5: TEACHING FEATURES */}
        {activeSubTab === 'features' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-lg text-slate-900 font-display">
                Teaching Features &amp; Pillars
              </h3>
              <p className="text-xs text-slate-500">The 4 core learning pillars shown in "The Ankita Bisht Method" section.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={formData.features.sectionTitle}
                    onChange={(e) => setFormData({
                      ...formData,
                      features: { ...formData.features, sectionTitle: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Section Subtitle</label>
                  <input
                    type="text"
                    value={formData.features.sectionSubtitle}
                    onChange={(e) => setFormData({
                      ...formData,
                      features: { ...formData.features, sectionSubtitle: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {formData.features.items.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-800 text-xs">Feature #{idx + 1}</div>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const updated = [...formData.features.items];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        setFormData({ ...formData, features: { ...formData.features, items: updated } });
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold bg-white"
                      placeholder="Title"
                    />
                    <textarea
                      rows={2}
                      value={item.desc}
                      onChange={(e) => {
                        const updated = [...formData.features.items];
                        updated[idx] = { ...updated[idx], desc: e.target.value };
                        setFormData({ ...formData, features: { ...formData.features, items: updated } });
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-xs"
                      placeholder="Description"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 6: FREE RESOURCES */}
        {activeSubTab === 'resources' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 font-display">
                  Free Study Material &amp; PDF Download Links
                </h3>
                <p className="text-xs text-slate-500">
                  Manage free revision PDFs, Google Drive download links, Telegram links, and student click behaviors.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newRes: Resource = {
                    id: `res-${Date.now().toString().slice(-4)}`,
                    title: 'New High-Yield Study PDF Notes 2026',
                    category: 'UGC NET Paper 1',
                    type: 'PDF Notes',
                    fileSize: '4.5 MB',
                    pageCount: 28,
                    downloadCount: '10,000+ Downloads',
                    isPopular: true,
                    downloadUrl: 'https://t.me/drankitaeducator',
                    downloadAction: 'modal',
                    downloadBtnText: 'Download PDF',
                    description: 'Comprehensive high-yield revision notes covering core examination concepts.',
                    topicsCovered: ['Core Exam Concepts & Mindmap', 'Solved Previous Year Questions (PYQs)'],
                    previewSnippet: 'Key revision summary points & formula shortcuts curated by Dr. Ankita Bisht.'
                  };
                  setFormData({
                    ...formData,
                    resources: {
                      ...formData.resources,
                      resources: [newRes, ...formData.resources.resources]
                    }
                  });
                }}
                className="bg-brand-700 hover:bg-brand-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add New PDF Resource</span>
              </button>
            </div>

            {/* Resources List */}
            <div className="space-y-5 text-xs">
              {formData.resources.resources.map((res, idx) => (
                <div key={res.id || idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
                  
                  {/* Top Bar: Title & Delete */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold bg-brand-100 text-brand-800 px-2 py-0.5 rounded">
                          #{idx + 1} • {res.type || 'PDF Notes'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{res.id}</span>
                      </div>
                      <input
                        type="text"
                        value={res.title}
                        onChange={(e) => {
                          const updated = [...formData.resources.resources];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setFormData({ ...formData, resources: { ...formData.resources, resources: updated } });
                        }}
                        placeholder="Resource Title (e.g. Teaching Aptitude Formula Cheat Sheet)"
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl bg-white font-bold text-slate-900 text-sm focus:border-brand-500 outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${res.title}"?`)) {
                          const updated = formData.resources.resources.filter((_, i) => i !== idx);
                          setFormData({ ...formData, resources: { ...formData.resources, resources: updated } });
                        }
                      }}
                      className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-xl border border-rose-100 cursor-pointer transition-colors mt-5 shrink-0"
                      title="Delete PDF Resource"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Type</label>
                      <select
                        value={res.type || 'PDF Notes'}
                        onChange={(e) => {
                          const updated = [...formData.resources.resources];
                          updated[idx] = { ...updated[idx], type: e.target.value };
                          setFormData({ ...formData, resources: { ...formData.resources, resources: updated } });
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-medium"
                      >
                        <option value="PDF Notes">PDF Notes</option>
                        <option value="Formula Sheet">Formula Sheet</option>
                        <option value="Mindmap">Mindmap</option>
                        <option value="PYQ Solved">PYQ Solved</option>
                        <option value="E-Book">E-Book</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Category</label>
                      <input
                        type="text"
                        value={res.category}
                        onChange={(e) => {
                          const updated = [...formData.resources.resources];
                          updated[idx] = { ...updated[idx], category: e.target.value };
                          setFormData({ ...formData, resources: { ...formData.resources, resources: updated } });
                        }}
                        placeholder="e.g. Teaching Aptitude"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">File Size</label>
                      <input
                        type="text"
                        value={res.fileSize}
                        onChange={(e) => {
                          const updated = [...formData.resources.resources];
                          updated[idx] = { ...updated[idx], fileSize: e.target.value };
                          setFormData({ ...formData, resources: { ...formData.resources, resources: updated } });
                        }}
                        placeholder="e.g. 4.2 MB"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Pages Count</label>
                      <input
                        type="number"
                        value={res.pageCount || 20}
                        onChange={(e) => {
                          const updated = [...formData.resources.resources];
                          updated[idx] = { ...updated[idx], pageCount: parseInt(e.target.value, 10) || 1 };
                          setFormData({ ...formData, resources: { ...formData.resources, resources: updated } });
                        }}
                        placeholder="e.g. 24"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Downloads Badge</label>
                      <input
                        type="text"
                        value={res.downloadCount || 'Free Study PDF'}
                        onChange={(e) => {
                          const updated = [...formData.resources.resources];
                          updated[idx] = { ...updated[idx], downloadCount: e.target.value };
                          setFormData({ ...formData, resources: { ...formData.resources, resources: updated } });
                        }}
                        placeholder="e.g. Free Study PDF"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                      />
                    </div>
                  </div>

                  {/* 🔥 HIGHLIGHTED: PDF LINK & CLICK ACTION CONFIGURATION */}
                  <div className="bg-white p-4 rounded-xl border-2 border-brand-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <LinkIcon className="w-4 h-4 text-brand-600" />
                        <span>PDF Download Link &amp; Click Action Settings</span>
                      </div>
                      <span className="text-[10px] bg-brand-50 text-brand-700 font-bold px-2 py-0.5 rounded">
                        Live Configured
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Download URL Input */}
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          📄 PDF Download URL / Link (Google Drive / Telegram / Direct PDF / Dropbox)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="url"
                            value={res.downloadUrl || ''}
                            onChange={(e) => {
                              const updated = [...formData.resources.resources];
                              updated[idx] = { ...updated[idx], downloadUrl: e.target.value };
                              setFormData({ ...formData, resources: { ...formData.resources, resources: updated } });
                            }}
                            placeholder="https://drive.google.com/file/d/... or https://t.me/..."
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs text-slate-800 bg-slate-50 focus:bg-white focus:border-brand-500 outline-none"
                          />
                          {res.downloadUrl && (
                            <a
                              href={res.downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-2 bg-slate-100 hover:bg-brand-50 text-brand-700 rounded-xl border border-slate-200 flex items-center gap-1 font-bold text-[11px] shrink-0"
                              title="Test link in new tab"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Test Link</span>
                            </a>
                          )}
                        </div>
                        
                        {/* Quick Preset Buttons */}
                        <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px]">
                          <span className="text-slate-400 font-medium">Quick Presets:</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...formData.resources.resources];
                              updated[idx] = { ...updated[idx], downloadUrl: 'https://t.me/drankitaeducator', downloadAction: 'telegram' };
                              setFormData({ ...formData, resources: { ...formData.resources, resources: updated } });
                            }}
                            className="text-brand-700 hover:underline font-bold cursor-pointer"
                          >
                            ⚡ Set Official Telegram
                          </button>
                          <span className="text-slate-300">•</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...formData.resources.resources];
                              updated[idx] = { ...updated[idx], downloadUrl: 'https://drive.google.com/drive/folders/1exampleDriveLink', downloadAction: 'modal' };
                              setFormData({ ...formData, resources: { ...formData.resources, resources: updated } });
                            }}
                            className="text-emerald-700 hover:underline font-bold cursor-pointer"
                          >
                            ⚡ Google Drive Folder
                          </button>
                        </div>
                      </div>

                      {/* Click Action Selector */}
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          ⚡ What happens when student clicks "Download PDF"?
                        </label>
                        <select
                          value={res.downloadAction || 'modal'}
                          onChange={(e) => {
                            const updated = [...formData.resources.resources];
                            updated[idx] = { ...updated[idx], downloadAction: e.target.value as Resource['downloadAction'] };
                            setFormData({ ...formData, resources: { ...formData.resources, resources: updated } });
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold text-slate-800 focus:border-brand-500 outline-none cursor-pointer"
                        >
                          <option value="modal">📋 Lead Form First + Direct Download Link (Recommended)</option>
                          <option value="direct">🚀 Direct Link Open (Opens URL in New Tab instantly)</option>
                          <option value="whatsapp">💬 WhatsApp Chat with Dr. Ankita</option>
                          <option value="telegram">📢 Open Telegram Channel</option>
                        </select>
                        <p className="text-[11px] text-slate-500 mt-1">
                          {res.downloadAction === 'direct'
                            ? '⚡ Clicking the button will directly open your provided PDF / Google Drive URL in a new tab without showing a form.'
                            : res.downloadAction === 'whatsapp'
                            ? '💬 Clicking the button will open WhatsApp with prefilled message asking for this PDF.'
                            : res.downloadAction === 'telegram'
                            ? '📢 Clicking the button will redirect student to your Telegram study channel.'
                            : '📋 Student will enter WhatsApp & Email (saved into Admin Leads), then get the direct PDF download link.'}
                        </p>
                      </div>
                    </div>

                    {/* Button Text */}
                    <div className="pt-1">
                      <label className="block font-semibold text-slate-600 mb-1">Card Button Label</label>
                      <input
                        type="text"
                        value={res.downloadBtnText || 'Download PDF'}
                        onChange={(e) => {
                          const updated = [...formData.resources.resources];
                          updated[idx] = { ...updated[idx], downloadBtnText: e.target.value };
                          setFormData({ ...formData, resources: { ...formData.resources, resources: updated } });
                        }}
                        placeholder="e.g. Download PDF, Get Free Notes, View Mindmap"
                        className="w-full sm:w-1/2 px-3 py-1.5 border border-slate-300 rounded-xl bg-white font-medium"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Short Description</label>
                    <textarea
                      rows={2}
                      value={res.description}
                      onChange={(e) => {
                        const updated = [...formData.resources.resources];
                        updated[idx] = { ...updated[idx], description: e.target.value };
                        setFormData({ ...formData, resources: { ...formData.resources, resources: updated } });
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-xs"
                      placeholder="High-yield revision capsule description..."
                    />
                  </div>

                  {/* Topics Covered (Snapshot) */}
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">
                      Contents Snapshot (Topics List - comma separated)
                    </label>
                    <input
                      type="text"
                      value={res.topicsCovered ? res.topicsCovered.join(', ') : ''}
                      onChange={(e) => {
                        const topics = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                        const updated = [...formData.resources.resources];
                        updated[idx] = { ...updated[idx], topicsCovered: topics };
                        setFormData({ ...formData, resources: { ...formData.resources, resources: updated } });
                      }}
                      placeholder="e.g. Bloom's Taxonomy, Levels of Teaching Matrix, Evaluation Systems"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    />
                  </div>

                  {/* Excerpt Preview Snippet */}
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Document Excerpt Preview Snippet</label>
                    <textarea
                      rows={2}
                      value={res.previewSnippet || ''}
                      onChange={(e) => {
                        const updated = [...formData.resources.resources];
                        updated[idx] = { ...updated[idx], previewSnippet: e.target.value };
                        setFormData({ ...formData, resources: { ...formData.resources, resources: updated } });
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-xs font-serif italic text-slate-700"
                      placeholder="Micro-Teaching Time Breakdown: Teach (6m) -> Feedback (6m)..."
                    />
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 7: TESTIMONIALS */}
        {activeSubTab === 'testimonials' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 font-display">
                  Results, Toppers &amp; Testimonials
                </h3>
                <p className="text-xs text-slate-500">Student success stories, scorecards, AIR ranks, and review quotes.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newTest: Testimonial = {
                    id: `test-${Date.now().toString().slice(-4)}`,
                    name: 'New Top Ranker',
                    exam: 'UGC NET JRF Qualified',
                    scoreOrRank: 'AIR 15 (Score: 218/300)',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250',
                    quote: 'Dr. Ankita Bisht ma\'am\'s lectures and mindmaps made my preparation seamless.',
                    year: '2026 Batch',
                    collegeOrRole: 'Assistant Professor Aspirant',
                    badge: 'JRF Qualified'
                  };
                  setFormData({
                    ...formData,
                    testimonials: {
                      ...formData.testimonials,
                      testimonials: [newTest, ...formData.testimonials.testimonials]
                    }
                  });
                }}
                className="bg-brand-700 hover:bg-brand-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Testimonial</span>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {formData.testimonials.testimonials.map((test, idx) => (
                <div key={test.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-sm">Review #{idx + 1}</span>
                    <button
                      onClick={() => {
                        const updated = formData.testimonials.testimonials.filter((_, i) => i !== idx);
                        setFormData({ ...formData, testimonials: { ...formData.testimonials, testimonials: updated } });
                      }}
                      className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={test.name}
                      onChange={(e) => {
                        const updated = [...formData.testimonials.testimonials];
                        updated[idx] = { ...updated[idx], name: e.target.value };
                        setFormData({ ...formData, testimonials: { ...formData.testimonials, testimonials: updated } });
                      }}
                      placeholder="Student Name"
                      className="px-3 py-1.5 border border-slate-300 rounded-xl bg-white font-bold"
                    />

                    <input
                      type="text"
                      value={test.exam}
                      onChange={(e) => {
                        const updated = [...formData.testimonials.testimonials];
                        updated[idx] = { ...updated[idx], exam: e.target.value };
                        setFormData({ ...formData, testimonials: { ...formData.testimonials, testimonials: updated } });
                      }}
                      placeholder="Exam / Target"
                      className="px-3 py-1.5 border border-slate-300 rounded-xl bg-white"
                    />

                    <input
                      type="text"
                      value={test.scoreOrRank}
                      onChange={(e) => {
                        const updated = [...formData.testimonials.testimonials];
                        updated[idx] = { ...updated[idx], scoreOrRank: e.target.value };
                        setFormData({ ...formData, testimonials: { ...formData.testimonials, testimonials: updated } });
                      }}
                      placeholder="Score / Rank"
                      className="px-3 py-1.5 border border-slate-300 rounded-xl bg-white font-semibold text-emerald-700"
                    />
                  </div>

                  <textarea
                    rows={2}
                    value={test.quote}
                    onChange={(e) => {
                      const updated = [...formData.testimonials.testimonials];
                      updated[idx] = { ...updated[idx], quote: e.target.value };
                      setFormData({ ...formData, testimonials: { ...formData.testimonials, testimonials: updated } });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-xs"
                    placeholder="Student Quote / Review"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 8: FAQS MANAGER */}
        {activeSubTab === 'faq' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 font-display">
                  Frequently Asked Questions (FAQs)
                </h3>
                <p className="text-xs text-slate-500">Add or edit questions and answers displayed in the FAQ section.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newFaq: FAQItem = {
                    id: `faq-${Date.now().toString().slice(-4)}`,
                    category: 'Courses & Syllabus',
                    question: 'New Question title?',
                    answer: 'Detailed answer explanation for student questions.'
                  };
                  setFormData({
                    ...formData,
                    faq: {
                      ...formData.faq,
                      faqs: [newFaq, ...formData.faq.faqs]
                    }
                  });
                }}
                className="bg-brand-700 hover:bg-brand-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add FAQ</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {formData.faq.faqs.map((faq, idx) => (
                <div key={faq.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => {
                        const updated = [...formData.faq.faqs];
                        updated[idx] = { ...updated[idx], question: e.target.value };
                        setFormData({ ...formData, faq: { ...formData.faq, faqs: updated } });
                      }}
                      className="flex-1 px-3 py-1.5 border border-slate-300 rounded-xl bg-white font-bold text-slate-900"
                      placeholder="Question"
                    />
                    <button
                      onClick={() => {
                        const updated = formData.faq.faqs.filter((_, i) => i !== idx);
                        setFormData({ ...formData, faq: { ...formData.faq, faqs: updated } });
                      }}
                      className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    value={faq.answer}
                    onChange={(e) => {
                      const updated = [...formData.faq.faqs];
                      updated[idx] = { ...updated[idx], answer: e.target.value };
                      setFormData({ ...formData, faq: { ...formData.faq, faqs: updated } });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-xs"
                    placeholder="Answer explanation"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 9: CONTACT & SOCIALS */}
        {activeSubTab === 'contact' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-lg text-slate-900 font-display">
                Contact Info, Helpline &amp; Social Links
              </h3>
              <p className="text-xs text-slate-500">Phone numbers, WhatsApp support, email, address, and social channels in header &amp; footer.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Academy Official Name</label>
                  <input
                    type="text"
                    value={formData.contact.instituteName}
                    onChange={(e) => setFormData({
                      ...formData,
                      contact: { ...formData.contact, instituteName: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Email Address</label>
                  <input
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => setFormData({
                      ...formData,
                      contact: { ...formData.contact, email: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary Phone</label>
                  <input
                    type="text"
                    value={formData.contact.phonePrimary}
                    onChange={(e) => setFormData({
                      ...formData,
                      contact: { ...formData.contact, phonePrimary: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Secondary Phone</label>
                  <input
                    type="text"
                    value={formData.contact.phoneSecondary}
                    onChange={(e) => setFormData({
                      ...formData,
                      contact: { ...formData.contact, phoneSecondary: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp Chat Number</label>
                  <input
                    type="text"
                    value={formData.contact.whatsappNumber}
                    onChange={(e) => setFormData({
                      ...formData,
                      contact: { ...formData.contact, whatsappNumber: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Physical Academy Address</label>
                <input
                  type="text"
                  value={formData.contact.address}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: { ...formData.contact, address: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">YouTube Channel URL</label>
                  <input
                    type="text"
                    value={formData.contact.youtubeUrl}
                    onChange={(e) => setFormData({
                      ...formData,
                      contact: { ...formData.contact, youtubeUrl: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telegram Community URL</label>
                  <input
                    type="text"
                    value={formData.contact.telegramUrl}
                    onChange={(e) => setFormData({
                      ...formData,
                      contact: { ...formData.contact, telegramUrl: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Instagram URL</label>
                  <input
                    type="text"
                    value={formData.contact.instagramUrl}
                    onChange={(e) => setFormData({
                      ...formData,
                      contact: { ...formData.contact, instagramUrl: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 4. Bottom Sticky Publish Bar */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-slate-300">
            Changes saved here will immediately update on <strong>learnwithdrankita.com</strong> live for all visitors.
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleSaveAndPublish}
            disabled={isPublishing}
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-black px-6 py-3 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {publishSuccess ? (
              <>
                <Check className="w-4 h-4 text-slate-950" />
                <span>Published Successfully! ✓</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isPublishing ? 'Publishing...' : '🚀 Save & Publish All Changes'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Course Syllabus & Curriculum Editor Modal */}
      {editingSyllabusCourseIndex !== null && formData.courses.courses[editingSyllabusCourseIndex] && (
        <CourseSyllabusEditorModal
          course={formData.courses.courses[editingSyllabusCourseIndex]}
          onClose={() => setEditingSyllabusCourseIndex(null)}
          onSave={(updatedCourse) => {
            const updated = [...formData.courses.courses];
            updated[editingSyllabusCourseIndex] = updatedCourse;
            setFormData({
              ...formData,
              courses: {
                ...formData.courses,
                courses: updated
              }
            });
            setEditingSyllabusCourseIndex(null);
            setSyllabusNotification(`✓ Syllabus & curriculum updated for "${updatedCourse.title}". Click "Save & Publish All Changes" to publish live!`);
            setTimeout(() => setSyllabusNotification(null), 8000);
          }}
        />
      )}

    </div>
  );
};
