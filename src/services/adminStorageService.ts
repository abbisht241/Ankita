export interface StudentEnrollment {
  id: string;
  name: string;
  email: string;
  phone: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  paymentId: string;
  orderId?: string;
  paymentMode: 'razorpay' | 'cash' | 'upi_direct' | 'scholarship';
  status: 'active' | 'completed' | 'refunded';
  enrolledAt: string;
  notes?: string;
}

export interface LeadInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  targetExam: string;
  source: 'demo_modal' | 'contact_form' | 'resource_download' | 'manual';
  status: 'new' | 'contacted' | 'demo_scheduled' | 'enrolled' | 'closed';
  createdAt: string;
  notes?: string;
}

export interface BatchConfig {
  id: string;
  courseId: string;
  title: string;
  timing: string;
  startDate: string;
  liveClassLink: string;
  whatsappGroupLink: string;
  status: 'active' | 'upcoming' | 'completed';
}

const STORAGE_KEYS = {
  STUDENTS: 'dr_ankita_admin_students',
  INQUIRIES: 'dr_ankita_admin_inquiries',
  BATCHES: 'dr_ankita_admin_batches',
  PASSCODE: 'dr_ankita_admin_passcode',
  AUTH_SESSION: 'dr_ankita_admin_session'
};

const DEFAULT_PASSCODE = 'ankita2026';

const INITIAL_STUDENTS: StudentEnrollment[] = [
  {
    id: 'ENR-1001',
    name: 'Anoop Negi',
    email: 'anoop@gmail.com',
    phone: '8449137304',
    courseId: 'ugc-net-paper-1',
    courseTitle: 'UGC NET Paper 1 Complete Masterclass (Target 85+ Marks)',
    amount: 999,
    paymentId: 'pay_TYq9AWcoJG09hC',
    orderId: 'order_TYq9AWcoJG09hC',
    paymentMode: 'razorpay',
    status: 'active',
    enrolledAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    notes: 'Enrolled via Razorpay Gateway'
  },
  {
    id: 'ENR-1002',
    name: 'Pooja Rawat',
    email: 'pooja.rawat92@gmail.com',
    phone: '9876543210',
    courseId: 'child-development-pedagogy',
    courseTitle: 'Child Development & Pedagogy (CDP) Super Batch',
    amount: 999,
    paymentId: 'pay_TYp78a9x71629d',
    orderId: 'order_TYp78a9x71629d',
    paymentMode: 'razorpay',
    status: 'active',
    enrolledAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    notes: 'Targeting CTET & State Assistant Professor'
  },
  {
    id: 'ENR-1003',
    name: 'Rohit Joshi',
    email: 'rohit.joshi.hnb@gmail.com',
    phone: '7417268651',
    courseId: 'research-methodology-spss',
    courseTitle: 'Research Methodology & SPSS Data Analysis Masterclass',
    amount: 999,
    paymentId: 'pay_UPI_DIR_8849',
    paymentMode: 'upi_direct',
    status: 'active',
    enrolledAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    notes: 'Ph.D. Entrance PET Aspirant'
  }
];

const INITIAL_INQUIRIES: LeadInquiry[] = [
  {
    id: 'INQ-501',
    name: 'Meenakshi Sundaram',
    email: 'meenakshi.s@gmail.com',
    phone: '9845123456',
    targetExam: 'UGC NET Paper 1 (Evening Batch)',
    source: 'demo_modal',
    status: 'new',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    notes: 'Requested demo link for Evening Batch (7:00 PM)'
  },
  {
    id: 'INQ-502',
    name: 'Deepak Bhatt',
    email: 'deepak.bhatt@yahoo.co.in',
    phone: '7417268651',
    targetExam: 'Research Methodology & SPSS Bootcamp',
    source: 'contact_form',
    status: 'demo_scheduled',
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    notes: 'Ph.D. scholar needing SPSS guidance'
  },
  {
    id: 'INQ-503',
    name: 'Kavita Semwal',
    email: 'kavita.semwal@gmail.com',
    phone: '9412098765',
    targetExam: 'Child Development & Pedagogy (CDP 30/30)',
    source: 'demo_modal',
    status: 'contacted',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    notes: 'Followed up on WhatsApp'
  }
];

const INITIAL_BATCHES: BatchConfig[] = [
  {
    id: 'batch-1',
    courseId: 'ugc-net-paper-1',
    title: 'UGC NET Paper 1 - Super 50 Batch (June/Dec)',
    timing: 'Mon to Fri 7:00 PM - 8:30 PM',
    startDate: '10th Sept 2026',
    liveClassLink: 'https://meet.google.com/ugc-net-paper1-live',
    whatsappGroupLink: 'https://chat.whatsapp.com/DrAnkitaPaper1Batch',
    status: 'active'
  },
  {
    id: 'batch-2',
    courseId: 'research-methodology-spss',
    title: 'Research Methodology & SPSS Ph.D. Bootcamp',
    timing: 'Sat & Sun 8:00 PM - 9:30 PM',
    startDate: '12th Sept 2026',
    liveClassLink: 'https://meet.google.com/res-mthd-spss',
    whatsappGroupLink: 'https://chat.whatsapp.com/DrAnkitaResearchBatch',
    status: 'active'
  },
  {
    id: 'batch-3',
    courseId: 'child-development-pedagogy',
    title: 'Child Development & Pedagogy (CDP 30/30)',
    timing: 'Tue, Thu, Sat 6:00 PM - 7:30 PM',
    startDate: '15th Sept 2026',
    liveClassLink: 'https://meet.google.com/cdp-pedagogy-live',
    whatsappGroupLink: 'https://chat.whatsapp.com/DrAnkitaCDPBatch',
    status: 'active'
  },
  {
    id: 'batch-4',
    courseId: 'food-nutrition-dietetics',
    title: 'Food Science, Nutrition & Maternal Health',
    timing: 'Mon, Wed 4:00 PM - 5:30 PM',
    startDate: '18th Sept 2026',
    liveClassLink: 'https://meet.google.com/food-nutrition-live',
    whatsappGroupLink: 'https://chat.whatsapp.com/DrAnkitaNutritionBatch',
    status: 'upcoming'
  },
  {
    id: 'batch-5',
    courseId: 'educational-psychology',
    title: 'Educational Psychology & Learning Theories',
    timing: 'Tue, Thu 4:00 PM - 5:30 PM',
    startDate: '20th Sept 2026',
    liveClassLink: 'https://meet.google.com/edu-psychology-live',
    whatsappGroupLink: 'https://chat.whatsapp.com/DrAnkitaPsychologyBatch',
    status: 'upcoming'
  },
  {
    id: 'batch-6',
    courseId: 'teaching-aptitude-mastery',
    title: 'Teaching Aptitude Masterclass',
    timing: 'Weekend Special (Sat & Sun 10:00 AM)',
    startDate: '14th Sept 2026',
    liveClassLink: 'https://meet.google.com/teaching-aptitude-live',
    whatsappGroupLink: 'https://chat.whatsapp.com/DrAnkitaTeachingBatch',
    status: 'active'
  }
];

export const AdminStorage = {
  // Authentication
  getPasscode(): string {
    return localStorage.getItem(STORAGE_KEYS.PASSCODE) || DEFAULT_PASSCODE;
  },

  setPasscode(newPasscode: string): void {
    localStorage.setItem(STORAGE_KEYS.PASSCODE, newPasscode);
  },

  isAuthenticated(): boolean {
    return localStorage.getItem(STORAGE_KEYS.AUTH_SESSION) === 'true';
  },

  login(passcode: string): boolean {
    const valid = passcode === this.getPasscode() || passcode === DEFAULT_PASSCODE;
    if (valid) {
      localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, 'true');
    }
    return valid;
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
  },

  // Students - Local
  getStudents(): StudentEnrollment[] {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_STUDENTS;
    }
  },

  // Students - Remote Fetch
  async fetchRemoteStudents(): Promise<StudentEnrollment[]> {
    try {
      const res = await fetch('/api/students');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.students)) {
          localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(data.students));
          return data.students;
        }
      }
    } catch (err) {
      console.warn('Using local students cache', err);
    }
    return this.getStudents();
  },

  async addStudent(student: Omit<StudentEnrollment, 'id' | 'enrolledAt'>): Promise<StudentEnrollment> {
    const students = this.getStudents();
    const newStudent: StudentEnrollment = {
      ...student,
      id: `ENR-${Math.floor(1000 + Math.random() * 9000)}`,
      enrolledAt: new Date().toISOString()
    };
    students.unshift(newStudent);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));

    // Send to Cloud API in background
    try {
      await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
      });
    } catch (e) {
      console.warn('Remote sync failed, stored locally', e);
    }

    return newStudent;
  },

  async deleteStudent(id: string): Promise<void> {
    const students = this.getStudents().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));

    try {
      await fetch(`/api/students?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    } catch (e) {}
  },

  // Inquiries / Leads - Local
  getInquiries(): LeadInquiry[] {
    const data = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(INITIAL_INQUIRIES));
      return INITIAL_INQUIRIES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_INQUIRIES;
    }
  },

  // Inquiries - Remote Fetch
  async fetchRemoteInquiries(): Promise<LeadInquiry[]> {
    try {
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.inquiries)) {
          localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(data.inquiries));
          return data.inquiries;
        }
      }
    } catch (err) {
      console.warn('Using local inquiries cache', err);
    }
    return this.getInquiries();
  },

  async addInquiry(inquiry: Omit<LeadInquiry, 'id' | 'createdAt'>): Promise<LeadInquiry> {
    const inquiries = this.getInquiries();
    const newInquiry: LeadInquiry = {
      ...inquiry,
      id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString()
    };
    inquiries.unshift(newInquiry);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));

    // Send to Cloud API in background
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInquiry)
      });
    } catch (e) {
      console.warn('Remote inquiry sync failed, stored locally', e);
    }

    return newInquiry;
  },

  async updateInquiryStatus(id: string, status: LeadInquiry['status'], notes?: string): Promise<void> {
    const inquiries = this.getInquiries().map(item => {
      if (item.id === id) {
        return {
          ...item,
          status,
          notes: notes !== undefined ? notes : item.notes
        };
      }
      return item;
    });
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));

    try {
      await fetch('/api/inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, notes })
      });
    } catch (e) {}
  },

  async deleteInquiry(id: string): Promise<void> {
    const inquiries = this.getInquiries().filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));

    try {
      await fetch(`/api/inquiries?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    } catch (e) {}
  },

  // Batches - Local
  getBatches(): BatchConfig[] {
    const data = localStorage.getItem(STORAGE_KEYS.BATCHES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(INITIAL_BATCHES));
      return INITIAL_BATCHES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_BATCHES;
    }
  },

  // Batches - Remote Fetch
  async fetchRemoteBatches(): Promise<BatchConfig[]> {
    try {
      const res = await fetch('/api/batches');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.batches)) {
          localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(data.batches));
          return data.batches;
        }
      }
    } catch (err) {}
    return this.getBatches();
  },

  async updateBatch(id: string, updates: Partial<BatchConfig>): Promise<void> {
    const batches = this.getBatches().map(b => b.id === id ? { ...b, ...updates } : b);
    localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(batches));

    try {
      await fetch('/api/batches', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates })
      });
    } catch (e) {}
  },

  // Export to CSV
  exportStudentsCSV(): void {
    const students = this.getStudents();
    const headers = ['Enrollment ID', 'Student Name', 'Email', 'WhatsApp Phone', 'Course', 'Amount (INR)', 'Payment ID', 'Payment Mode', 'Status', 'Date'];
    const rows = students.map(s => [
      `"${s.id}"`,
      `"${s.name}"`,
      `"${s.email}"`,
      `"${s.phone}"`,
      `"${s.courseTitle.replace(/"/g, '""')}"`,
      `"${s.amount}"`,
      `"${s.paymentId}"`,
      `"${s.paymentMode}"`,
      `"${s.status}"`,
      `"${new Date(s.enrolledAt).toLocaleString('en-IN')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Dr_Ankita_Students_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Reset to initial seed
  resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.INQUIRIES);
    localStorage.removeItem(STORAGE_KEYS.BATCHES);
  }
};
