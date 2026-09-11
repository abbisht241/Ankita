import { useState, useEffect } from 'react';
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

// Admin Panel & Registration
import { AdminPanel } from './components/admin/AdminPanel';
import { StudentRegistrationPage } from './components/StudentRegistrationPage';
import { PublicInvoicePage } from './components/PublicInvoicePage';
import { CbtTestPortal } from './components/CbtTestPortal';
import { PublicLeaderboardPage } from './components/PublicLeaderboardPage';
import { StudentProfilePortal } from './components/StudentProfilePortal';

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
  // Route Detection
  const isPortalPath = () => {
    const p = window.location.pathname.toLowerCase();
    const h = window.location.hash.toLowerCase();
    return p === '/portal' || p === '/portal/' || p === '/student' || p === '/student/' || p === '/login' || p === '/login/' ||
           h === '#portal' || h === '#/portal' || h.startsWith('#portal') || h.startsWith('#/portal') ||
           h === '#student' || h === '#/student' || h === '#login' || h === '#/login';
  };

  const isPanelPath = () => {
    const p = window.location.pathname.toLowerCase();
    const h = window.location.hash.toLowerCase();
    return p === '/panel' || p === '/panel/' || h === '#panel' || h === '#/panel' || h.startsWith('#panel') || h.startsWith('#/panel');
  };

  const isRegisterPath = () => {
    const p = window.location.pathname.toLowerCase();
    const h = window.location.hash.toLowerCase();
    return p === '/register' || p === '/register/' || p === '/enroll' || p === '/enroll/' || h === '#register' || h === '#/register' || h === '#enroll' || h === '#/enroll';
  };

  const isInvoicePath = () => {
    const p = window.location.pathname.toLowerCase();
    const h = window.location.hash.toLowerCase();
    return p === '/invoice' || p === '/invoice/' || p.startsWith('/invoice') || h === '#invoice' || h.startsWith('#invoice') || h.startsWith('#/invoice');
  };

  const isTestPath = () => {
    const p = window.location.pathname.toLowerCase();
    const h = window.location.hash.toLowerCase();
    return p === '/test' || p === '/test/' || h === '#test' || h === '#/test' || h.startsWith('#test');
  };

  const isResultsPath = () => {
    const p = window.location.pathname.toLowerCase();
    const h = window.location.hash.toLowerCase();
    return p === '/results' || p === '/results/' || p === '/leaderboard' || p === '/leaderboard/' || h === '#results' || h === '#/results' || h === '#leaderboard';
  };

  const [isPortal, setIsPortal] = useState(isPortalPath);
  const [isPanel, setIsPanel] = useState(isPanelPath);
  const [isRegister, setIsRegister] = useState(isRegisterPath);
  const [isInvoice, setIsInvoice] = useState(isInvoicePath);
  const [isTest, setIsTest] = useState(isTestPath);
  const [isResults, setIsResults] = useState(isResultsPath);

  useEffect(() => {
    const handleLocationChange = () => {
      setIsPortal(isPortalPath());
      setIsPanel(isPanelPath());
      setIsRegister(isRegisterPath());
      setIsInvoice(isInvoicePath());
      setIsTest(isTestPath());
      setIsResults(isResultsPath());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleBackToWebsite = () => {
    window.history.pushState(null, '', '/');
    setIsPortal(false);
    setIsPanel(false);
    setIsRegister(false);
    setIsInvoice(false);
    setIsTest(false);
    setIsResults(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


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

  if (isPortal) {
    return <StudentProfilePortal onBackToWebsite={handleBackToWebsite} />;
  }

  if (isPanel) {
    return <AdminPanel onBackToWebsite={handleBackToWebsite} />;
  }

  if (isRegister) {
    return <StudentRegistrationPage onBackToWebsite={handleBackToWebsite} />;
  }

  if (isInvoice) {
    return <PublicInvoicePage onBackToWebsite={handleBackToWebsite} />;
  }

  if (isTest) {
    return <CbtTestPortal onBackToWebsite={handleBackToWebsite} />;
  }

  if (isResults) {
    return <PublicLeaderboardPage onBackToWebsite={handleBackToWebsite} />;
  }

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
