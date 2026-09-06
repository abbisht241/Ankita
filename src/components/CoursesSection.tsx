import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  Video, 
  CheckCircle2, 
  Star, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Users
} from 'lucide-react';
import { coursesData } from '../data/coursesData';
import type { Course } from '../types';

interface CoursesSectionProps {
  onSelectSyllabus: (course: Course) => void;
  onEnrollCourse: (course: Course) => void;
  onOpenDemoModal: () => void;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({ 
  onSelectSyllabus, 
  onEnrollCourse,
  onOpenDemoModal
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = [
    'All',
    'UGC NET',
    'Research',
    'Pedagogy & CDP',
    'Psychology'
  ];

  const filteredCourses = activeCategory === 'All' 
    ? coursesData 
    : coursesData.filter(c => c.category === activeCategory);

  return (
    <section id="courses" className="py-16 sm:py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-100/80 border border-brand-200 text-brand-800 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-3">
            <BookOpen className="w-4 h-4 text-brand-600" />
            <span>Structured Academic Programs</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
            Targeted Online Batches Designed for <span className="gradient-text">Top Scores &amp; JRF Ranks</span>
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            Choose your dedicated batch with live classes, full recording access, bilingual study notes, and NTA CBT mock test series.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-brand-700 text-white shadow-md shadow-brand-700/20 scale-102'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat === 'All' ? '🌟 All 6 Batches' : cat}
            </button>
          ))}
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => {
            const discountPercent = Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);

            return (
              <div 
                key={course.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-subtle hover:shadow-premium hover:border-brand-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group relative"
              >
                {/* Top Banner Tag */}
                {course.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full shadow-xs flex items-center gap-1 ${
                      course.badge.includes('Best') 
                        ? 'bg-amber-500 text-slate-950 font-extrabold'
                        : 'bg-brand-600 text-white'
                    }`}>
                      {course.badge}
                    </span>
                  </div>
                )}

                {/* Course Content Container */}
                <div className="p-6 sm:p-7 flex-1">
                  
                  {/* Category Pill */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-brand-700 mb-2.5">
                    <span className="bg-brand-50 px-2.5 py-0.5 rounded-md border border-brand-200/60">
                      {course.category}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">{course.medium}</span>
                  </div>

                  {/* Course Title */}
                  <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 leading-snug mb-3 group-hover:text-brand-700 transition-colors">
                    {course.title}
                  </h3>

                  {/* Rating and Enrolled Count */}
                  <div className="flex items-center gap-3 text-xs mb-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{course.rating}</span>
                      <span className="text-slate-400 font-normal">({course.reviewsCount})</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600 font-medium">
                      <Users className="w-3.5 h-3.5 text-brand-600" />
                      <span>{course.studentCount}</span>
                    </div>
                  </div>

                  {/* Short Description */}
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5">
                    {course.shortDesc}
                  </p>

                  {/* Metadata Chips: Duration & Hours */}
                  <div className="grid grid-cols-2 gap-2 mb-5 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <Clock className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                      <span className="font-medium truncate">{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <Video className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                      <span className="font-medium truncate">{course.liveHours}</span>
                    </div>
                  </div>

                  {/* Key Highlights Checklist */}
                  <div className="space-y-2 mb-6">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      What's Included:
                    </div>
                    {course.highlights.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-tight">{item}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Course Card Footer: Pricing & Action Buttons */}
                <div className="p-6 bg-slate-50/80 border-t border-slate-100">
                  
                  {/* Pricing Bar */}
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Special Batch Fee</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-slate-900">
                          ₹{course.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          ₹{course.originalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-md border border-emerald-200">
                        Save {discountPercent}%
                      </span>
                      <div className="text-[10px] text-slate-500 mt-0.5">GST Included</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => onSelectSyllabus(course)}
                      className="w-full bg-white hover:bg-slate-100 text-slate-700 hover:text-brand-700 font-bold text-xs py-2.5 px-3 rounded-xl border border-slate-200 shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Full Syllabus</span>
                    </button>

                    <button
                      onClick={() => onEnrollCourse(course)}
                      className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-md hover:shadow-brand-600/25 transition-all flex items-center justify-center gap-1 group/btn cursor-pointer"
                    >
                      <span>Enroll Now</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Helper Bar */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Confused which course suits your preparation level?</div>
              <div className="text-xs text-slate-500">Get personalized guidance from Dr. Ankita Bisht’s academic advisory team.</div>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={onOpenDemoModal}
              className="w-full md:w-auto bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-brand-200 transition-colors shrink-0 cursor-pointer"
            >
              Book Free Trial Class
            </button>
            <a
              href="tel:+919876543210"
              className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-colors shrink-0 text-center"
            >
              Call for Counseling
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
