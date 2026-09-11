interface Env {
  ADMIN_KV?: KVNamespace;
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
    targetExam: 'Research Methodology Bootcamp',
    source: 'contact_form',
    status: 'demo_scheduled',
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    notes: 'Ph.D. scholar needing Research guidance'
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

const KV_KEY = 'global_inquiries_db';

async function getInquiriesList(env: Env): Promise<LeadInquiry[]> {
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
  return INITIAL_INQUIRIES;
}

async function saveInquiriesList(env: Env, list: LeadInquiry[]): Promise<void> {
  if (env.ADMIN_KV) {
    await env.ADMIN_KV.put(KV_KEY, JSON.stringify(list));
  }
}

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  const inquiries = await getInquiriesList(context.env);
  return new Response(JSON.stringify({ success: true, inquiries }), {
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
    const body = await context.request.json().catch(() => ({})) as Partial<LeadInquiry>;
    
    if (!body.name || !body.phone) {
      return new Response(JSON.stringify({ success: false, error: 'Name and Phone are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const currentList = await getInquiriesList(context.env);
    
    const newInquiry: LeadInquiry = {
      id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
      name: String(body.name).trim(),
      email: String(body.email || '').trim(),
      phone: String(body.phone).trim(),
      targetExam: String(body.targetExam || 'General Inquiry').trim(),
      source: (body.source as any) || 'demo_modal',
      status: 'new',
      createdAt: new Date().toISOString(),
      notes: body.notes ? String(body.notes).trim() : 'Submitted from Website'
    };

    // Prepend new inquiry so latest appears first
    const updatedList = [newInquiry, ...currentList.filter(item => item.id !== newInquiry.id)];
    await saveInquiriesList(context.env, updatedList);

    return new Response(JSON.stringify({ success: true, inquiry: newInquiry }), {
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
    const body = await context.request.json().catch(() => ({})) as {
      id: string;
      status?: LeadInquiry['status'];
      notes?: string;
    };

    if (!body.id) {
      return new Response(JSON.stringify({ success: false, error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const currentList = await getInquiriesList(context.env);
    const updatedList = currentList.map(item => {
      if (item.id === body.id) {
        return {
          ...item,
          status: body.status !== undefined ? body.status : item.status,
          notes: body.notes !== undefined ? body.notes : item.notes
        };
      }
      return item;
    });

    await saveInquiriesList(context.env, updatedList);

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

export const onRequestDelete = async (context: { request: Request; env: Env }) => {
  try {
    const url = new URL(context.request.url);
    let id = url.searchParams.get('id');

    if (!id) {
      const body = await context.request.json().catch(() => ({})) as { id?: string };
      id = body.id || null;
    }

    if (!id) {
      return new Response(JSON.stringify({ success: false, error: 'Inquiry ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const currentList = await getInquiriesList(context.env);
    const updatedList = currentList.filter(item => item.id !== id);
    await saveInquiriesList(context.env, updatedList);

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
