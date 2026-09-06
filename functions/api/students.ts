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
  amount: number; // Actual amount received (0 if unpaid)
  feeDue: number; // Course fee / balance due (e.g. 999)
  paymentId: string;
  orderId?: string;
  paymentMode: 'razorpay' | 'cash' | 'upi_direct' | 'unpaid' | 'scholarship';
  paymentStatus: 'paid' | 'pending' | 'partially_paid';
  status: 'active' | 'pending_payment' | 'completed' | 'refunded';
  enrolledAt: string;
  notes?: string;
  upiRefOrUtr?: string;
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
    feeDue: 0,
    paymentId: 'pay_TYq9AWcoJG09hC',
    orderId: 'order_TYq9AWcoJG09hC',
    paymentMode: 'razorpay',
    paymentStatus: 'paid',
    status: 'active',
    enrolledAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    notes: 'Enrolled via Razorpay Gateway'
  }
];

const KV_KEY = 'global_students_db';

async function getStudentsList(env: Env): Promise<StudentEnrollment[]> {
  if (env.ADMIN_KV) {
    const raw = await env.ADMIN_KV.get(KV_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.map((s: any) => {
            const paymentStatus = s.paymentStatus || (s.paymentMode === 'razorpay' || (Number(s.amount) > 0 && s.status === 'active') ? 'paid' : 'pending');
            const isPaid = paymentStatus === 'paid';
            const amount = isPaid ? (Number(s.amount) > 0 ? Number(s.amount) : 999) : 0;
            const feeDue = s.feeDue !== undefined ? Number(s.feeDue) : (isPaid ? 0 : 999);
            const status = s.status || (isPaid ? 'active' : 'pending_payment');

            return {
              ...s,
              amount,
              feeDue,
              paymentStatus,
              status
            };
          });
        }
      } catch (e) {}
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

    const isPaid = body.paymentStatus === 'paid' || body.paymentMode === 'razorpay';
    const amountPaid = isPaid ? (Number(body.amount) || 999) : 0;
    const feeDue = isPaid ? 0 : (Number(body.feeDue) || 999);

    const currentList = await getStudentsList(context.env);
    
    const newStudent: StudentEnrollment = {
      id: `ENR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: String(body.name).trim(),
      email: String(body.email || '').trim(),
      phone: String(body.phone).trim(),
      courseId: String(body.courseId || 'custom').trim(),
      courseTitle: String(body.courseTitle).trim(),
      amount: amountPaid,
      feeDue: feeDue,
      paymentId: String(body.paymentId || `pay_MANUAL_${Date.now()}`),
      orderId: body.orderId ? String(body.orderId) : undefined,
      paymentMode: (body.paymentMode as any) || (isPaid ? 'razorpay' : 'upi_direct'),
      paymentStatus: isPaid ? 'paid' : 'pending',
      status: isPaid ? 'active' : 'pending_payment',
      enrolledAt: new Date().toISOString(),
      notes: body.notes ? String(body.notes).trim() : (isPaid ? 'Paid Online' : 'Fee Pending Verification'),
      upiRefOrUtr: body.upiRefOrUtr ? String(body.upiRefOrUtr).trim() : undefined
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

export const onRequestPut = async (context: { request: Request; env: Env }) => {
  try {
    const body = await context.request.json().catch(() => ({})) as Partial<StudentEnrollment>;

    if (!body.id) {
      return new Response(JSON.stringify({ success: false, error: 'Student ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const currentList = await getStudentsList(context.env);
    const updatedList = currentList.map(s => {
      if (s.id === body.id) {
        const newPaymentStatus = body.paymentStatus !== undefined ? body.paymentStatus : (body.status === 'active' ? 'paid' : s.paymentStatus);
        const isPaid = newPaymentStatus === 'paid';
        const newAmount = body.amount !== undefined ? Number(body.amount) : (isPaid ? (Number(s.amount) > 0 ? Number(s.amount) : 999) : 0);
        const newFeeDue = body.feeDue !== undefined ? Number(body.feeDue) : (isPaid ? 0 : 999);
        const newStatus = body.status !== undefined ? body.status : (isPaid ? 'active' : 'pending_payment');

        return {
          ...s,
          ...body,
          amount: newAmount,
          feeDue: newFeeDue,
          paymentStatus: newPaymentStatus,
          status: newStatus,
          paymentMode: body.paymentMode !== undefined ? body.paymentMode : s.paymentMode,
          notes: body.notes !== undefined ? body.notes : s.notes
        };
      }
      return s;
    });

    await saveStudentsList(context.env, updatedList);

    return new Response(JSON.stringify({ success: true, students: updatedList }), {
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
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
};
