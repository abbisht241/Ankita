interface Env {
  ADMIN_KV?: KVNamespace;
}

export interface Invoice {
  id: string; // e.g. "INV-1001"
  invoiceNumber: string; // e.g. "INV-2026-001"
  studentId?: string;
  studentName: string;
  studentPhone: string;
  studentEmail: string;
  studentCity?: string;
  courseId: string;
  courseTitle: string;
  subtotal: number;
  discount: number;
  totalAmount: number;
  issueDate: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'cancelled';
  paymentMode?: 'razorpay' | 'upi_direct' | 'bank_transfer' | 'cash' | 'scholarship' | 'unpaid';
  paymentId?: string;
  notes?: string;
}

const KV_KEY = 'global_invoices_db';

async function getInvoicesList(env: Env): Promise<Invoice[]> {
  if (env.ADMIN_KV) {
    const raw = await env.ADMIN_KV.get(KV_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
  }

  // Fallback: Return seed invoice
  return [
    {
      id: 'INV-4917',
      invoiceNumber: 'INV-2026-001',
      studentId: 'ENR-4917',
      studentName: 'Munni devi',
      studentPhone: '6754675456',
      studentEmail: 'munni@gmail.com',
      studentCity: 'Kanoth',
      courseId: 'ugc-net-paper-1',
      courseTitle: 'UGC NET Paper 1 Complete Masterclass (Target 85+ Marks)',
      subtotal: 999,
      discount: 0,
      totalAmount: 999,
      issueDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      status: 'paid',
      paymentMode: 'upi_direct',
      paymentId: 'pay_REG_1788719300491',
      notes: 'Direct Registration via /register'
    },
    {
      id: 'INV-1001',
      invoiceNumber: 'INV-2026-002',
      studentId: 'ENR-1001',
      studentName: 'Anoop Negi',
      studentPhone: '8449137304',
      studentEmail: 'anoop@gmail.com',
      studentCity: 'Uttarakhand',
      courseId: 'ugc-net-paper-1',
      courseTitle: 'UGC NET Paper 1 Complete Masterclass (Target 85+ Marks)',
      subtotal: 999,
      discount: 0,
      totalAmount: 999,
      issueDate: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      status: 'paid',
      paymentMode: 'razorpay',
      paymentId: 'pay_TYq9AWcoJG09hC',
      notes: 'Enrolled via Razorpay Gateway'
    }
  ];
}

async function saveInvoicesList(env: Env, list: Invoice[]): Promise<void> {
  if (env.ADMIN_KV) {
    await env.ADMIN_KV.put(KV_KEY, JSON.stringify(list));
  }
}

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  const num = url.searchParams.get('num');

  const invoices = await getInvoicesList(context.env);

  if (id || num) {
    const found = invoices.find(inv => 
      (id && (inv.id.toLowerCase() === id.toLowerCase() || inv.invoiceNumber.toLowerCase() === id.toLowerCase())) ||
      (num && inv.invoiceNumber.toLowerCase() === num.toLowerCase())
    );

    if (found) {
      return new Response(JSON.stringify({ success: true, invoice: found }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      });
    }
  }

  return new Response(JSON.stringify({ success: true, invoices }), {
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
    const body = await context.request.json().catch(() => ({})) as Partial<Invoice>;
    
    if (!body.studentName || !body.studentPhone) {
      return new Response(JSON.stringify({ success: false, error: 'Student Name and Phone are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const currentList = await getInvoicesList(context.env);
    const newInv: Invoice = {
      id: body.id || `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceNumber: body.invoiceNumber || `INV-2026-${String(currentList.length + 1).padStart(3, '0')}`,
      studentId: body.studentId,
      studentName: String(body.studentName).trim(),
      studentPhone: String(body.studentPhone).trim(),
      studentEmail: String(body.studentEmail || '').trim(),
      studentCity: String(body.studentCity || 'India').trim(),
      courseId: String(body.courseId || 'ugc-net-paper-1'),
      courseTitle: String(body.courseTitle || 'Course Batch'),
      subtotal: Number(body.subtotal) || 999,
      discount: Number(body.discount) || 0,
      totalAmount: Number(body.totalAmount) || 999,
      issueDate: body.issueDate || new Date().toISOString(),
      dueDate: body.dueDate || new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      status: body.status || 'pending',
      paymentMode: body.paymentMode,
      paymentId: body.paymentId,
      notes: body.notes
    };

    const updatedList = [newInv, ...currentList.filter(item => item.id !== newInv.id)];
    await saveInvoicesList(context.env, updatedList);

    return new Response(JSON.stringify({ success: true, invoice: newInv }), {
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
    const body = await context.request.json().catch(() => ({})) as Partial<Invoice>;

    if (!body.id) {
      return new Response(JSON.stringify({ success: false, error: 'Invoice ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const currentList = await getInvoicesList(context.env);
    const updatedList = currentList.map(inv => {
      if (inv.id === body.id || inv.invoiceNumber === body.id) {
        return {
          ...inv,
          ...body
        };
      }
      return inv;
    });

    await saveInvoicesList(context.env, updatedList);

    return new Response(JSON.stringify({ success: true, invoices: updatedList }), {
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
