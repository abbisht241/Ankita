interface Env {
  ADMIN_KV?: KVNamespace;
}

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

const KV_KEY = 'global_students_db';

async function getStudentsList(env: Env): Promise<StudentEnrollment[]> {
  if (env.ADMIN_KV) {
    const raw = await env.ADMIN_KV.get(KV_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        // fallback
      }
    }
  }
  return INITIAL_STUDENTS;
}

async function saveStudentsList(env: Env, list: StudentEnrollment[]): Promise<void> {
  if (env.ADMIN_KV) {
    await env.ADMIN_KV.put(KV_KEY, JSON.stringify(list));
  }
}

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  const students = await getStudentsList(context.env);
  return new Response(JSON.stringify({ success: true, students }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store, no-cache, must-revalidate'
    }
  });
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const body = await context.request.json().catch(() => ({})) as Partial<StudentEnrollment>;
    
    if (!body.name || !body.phone || !body.courseTitle) {
      return new Response(JSON.stringify({ success: false, error: 'Name, Phone and Course are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const currentList = await getStudentsList(context.env);
    
    const newStudent: StudentEnrollment = {
      id: `ENR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: String(body.name).trim(),
      email: String(body.email || '').trim(),
      phone: String(body.phone).trim(),
      courseId: String(body.courseId || 'custom').trim(),
      courseTitle: String(body.courseTitle).trim(),
      amount: Number(body.amount) || 999,
      paymentId: String(body.paymentId || `pay_MANUAL_${Date.now()}`),
      orderId: body.orderId ? String(body.orderId) : undefined,
      paymentMode: (body.paymentMode as any) || 'razorpay',
      status: (body.status as any) || 'active',
      enrolledAt: new Date().toISOString(),
      notes: body.notes ? String(body.notes).trim() : 'Enrolled Online'
    };

    const updatedList = [newStudent, ...currentList.filter(item => item.id !== newStudent.id)];
    await saveStudentsList(context.env, updatedList);

    return new Response(JSON.stringify({ success: true, student: newStudent }), {
      status: 201,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
};

export const onRequestDelete = async (context: { request: Request; env: Env }) => {
  try {
    const url = new URL(context.request.url);
    let id = url.searchParams.get('id');

    if (!id) {
      const body = await context.request.json().catch(() => ({})) as { id?: string };
      id = body.id || null;
    }

    if (!id) {
      return new Response(JSON.stringify({ success: false, error: 'Student ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const currentList = await getStudentsList(context.env);
    const updatedList = currentList.filter(item => item.id !== id);
    await saveStudentsList(context.env, updatedList);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
};

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
};
