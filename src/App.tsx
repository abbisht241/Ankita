import { useState } from 'react';
import { TopAnnouncementBar } from './components/TopAnnouncementBar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { CoursesSection } from './components/CoursesSection';
import { FeaturesSection } from './components/FeaturesSection';
import { FreeResourcesSection } from './components/FreeResourcesSection';
import { WhyChooseUsSection } from './components/WhyChooseUsSection';
import { FAQSection } from './components/FAQSection';
import { LeadContactSection } from './components/LeadContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsAppCall } from './components/FloatingWhatsAppCall';

// Modals
import { DemoBookingModal } from './components/modals/DemoBookingModal';
import { SyllabusModal } from './components/modals/SyllabusModal';
import { VideoTestimonialModal } from './components/modals/VideoTestimonialModal';
import { ResourceDownloadModal } from './components/modals/ResourceDownloadModal';
import { LegalModal } from './components/modals/LegalModal';
import { RazorpayCheckoutModal } from './components/modals/RazorpayCheckoutModal';

import { coursesData } from './data/coursesData';

import type { Course, Resource } from './types';

export function App() {
  // Modal states
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [selectedCourseForSyllabus, setSelectedCourseForSyllabus] = useState<Course | null>(null);
  const [selectedCourseForCheckout, setSelectedCourseForCheckout] = useState<Course | null>(null);
  const [selectedResourceForDownload, setSelectedResourceForDownload] = useState<Resource | null>(null);
  const [videoModalData, setVideoModalData] = useState<{ isOpen: boolean; name: string; exam: string }>({
    isOpen: false,
    name: '',
    exam: ''
  });
  const [legalModalData, setLegalModalData] = useState<{ isOpen: boolean; type: 'privacy' | 'terms' | null }>({
    isOpen: false,
    type: null
  });

  const [prefilledCourse, setPrefilledCourse] = useState<string>('');

  const handleOpenDemoModal = (defaultCourseName?: string) => {
    if (defaultCourseName) {
      setPrefilledCourse(defaultCourseName);
    }
    setDemoModalOpen(true);
  };

  const handleOpenVideoModal = (name: string, exam: string) => {
    setVideoModalData({
      isOpen: true,
      name,
      exam
    });
  };

  const handleEnrollCourse = (course: Course) => {
    setSelectedCourseForCheckout(course);
  };

  const handleSelectCourseModal = (courseId: string) => {
    const foundCourse = coursesData.find(c => c.id === courseId);
    if (foundCourse) {
      setSelectedCourseForCheckout(foundCourse);
    }
  };

  const handleDownloadSyllabus = () => {
    if (selectedCourseForSyllabus) {
      alert(`📥 Downloading full ${selectedCourseForSyllabus.title} syllabus PDF... Check your downloads folder.`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-brand-600 selection:text-white">
      
      {/* 1. Top Announcement Notification Bar */}
      <TopAnnouncementBar onOpenDemoModal={() => handleOpenDemoModal()} />

      {/* 2. Responsive Header & Navigation */}
      <Navbar 
        onOpenDemoModal={() => handleOpenDemoModal()} 
        onSelectCourseModal={handleSelectCourseModal}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Section 1: Hero Section */}
        <HeroSection 
          onOpenDemoModal={() => handleOpenDemoModal()}
          onOpenVideoModal={handleOpenVideoModal}
        />

        {/* Section 2: About Educator */}
        <AboutSection 
          onOpenDemoModal={() => handleOpenDemoModal()}
        />

        {/* Section 3: Courses Offered */}
        <CoursesSection 
          onSelectSyllabus={(course) => setSelectedCourseForSyllabus(course)}
          onEnrollCourse={handleEnrollCourse}
          onOpenDemoModal={() => handleOpenDemoModal()}
        />

        {/* Section 4: Features Section */}
        <FeaturesSection />

        {/* Section 5: Free Resources Hub & Practice Quiz */}
        <FreeResourcesSection 
          onOpenResourceModal={(res) => setSelectedResourceForDownload(res)}
          onOpenDemoModal={() => handleOpenDemoModal()}
        />

        {/* Section 7: Why Choose Us */}
        <WhyChooseUsSection 
          onOpenDemoModal={() => handleOpenDemoModal()}
        />

        {/* Section 8: FAQ Section */}
        <FAQSection />

        {/* Section 9: Contact & High-Converting Lead Generation */}
        <LeadContactSection 
          initialCourse={prefilledCourse}
        />

      </main>

      {/* Section 10: Footer */}
      <Footer 
        onOpenLegalModal={(type) => setLegalModalData({ isOpen: true, type })}
        onOpenDemoModal={() => handleOpenDemoModal()}
      />

      {/* Sticky Floating WhatsApp & Helpline Actions */}
      <FloatingWhatsAppCall 
        onOpenDemoModal={() => handleOpenDemoModal()}
      />

      {/* Modals */}
      <DemoBookingModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        defaultCourse={prefilledCourse}
      />

      <SyllabusModal
        course={selectedCourseForSyllabus}
        onClose={() => setSelectedCourseForSyllabus(null)}
        onEnroll={(c) => handleEnrollCourse(c)}
        onDownloadPdf={handleDownloadSyllabus}
      />

      <VideoTestimonialModal
        isOpen={videoModalData.isOpen}
        name={videoModalData.name}
        exam={videoModalData.exam}
        onClose={() => setVideoModalData({ isOpen: false, name: '', exam: '' })}
        onOpenDemo={() => handleOpenDemoModal()}
      />

      <ResourceDownloadModal
        resource={selectedResourceForDownload}
        onClose={() => setSelectedResourceForDownload(null)}
      />

      <LegalModal
        isOpen={legalModalData.isOpen}
        type={legalModalData.type}
        onClose={() => setLegalModalData({ isOpen: false, type: null })}
      />

      <RazorpayCheckoutModal
        course={selectedCourseForCheckout}
        isOpen={!!selectedCourseForCheckout}
        onClose={() => setSelectedCourseForCheckout(null)}
      />

    </div>
  );
}

export default App;
