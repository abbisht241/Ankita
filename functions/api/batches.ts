interface Env {
  ADMIN_KV?: KVNamespace;
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

const KV_KEY = 'global_batches_db';
const KV_TIMINGS_KEY = 'global_batch_timings_db';

export const DEFAULT_BATCH_TIMINGS: string[] = [
  'Evening Batch (7:00 PM - 8:30 PM)',
  'Night Batch (8:45 PM - 10:00 PM)',
  'Morning Batch (10:00 AM - 11:30 AM)',
  'Weekend Special (Sat & Sun)'
];

async function getBatchesList(env: Env): Promise<BatchConfig[]> {
  if (env.ADMIN_KV) {
    const raw = await env.ADMIN_KV.get(KV_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
  }
  return INITIAL_BATCHES;
}

async function getBatchTimingsList(env: Env): Promise<string[]> {
  if (env.ADMIN_KV) {
    const raw = await env.ADMIN_KV.get(KV_TIMINGS_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
  }
  return DEFAULT_BATCH_TIMINGS;
}

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  const [batches, timings] = await Promise.all([
    getBatchesList(context.env),
    getBatchTimingsList(context.env)
  ]);
  return new Response(JSON.stringify({ success: true, batches, timings }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store, no-cache, must-revalidate'
    }
  });
};

export const onRequestPut = async (context: { request: Request; env: Env }) => {
  try {
    const body = await context.request.json().catch(() => ({})) as any;

    // 1. Handle updating registration form preferred batch timings
    if (body.action === 'update_timings' || Array.isArray(body.timings)) {
      const cleanTimings = (body.timings || [])
        .map((t: any) => (typeof t === 'string' ? t.trim() : ''))
        .filter(Boolean);
      const finalList = cleanTimings.length > 0 ? cleanTimings : DEFAULT_BATCH_TIMINGS;

      if (context.env.ADMIN_KV) {
        await context.env.ADMIN_KV.put(KV_TIMINGS_KEY, JSON.stringify(finalList));
      }

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Preferred batch timings updated successfully',
        timings: finalList 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // 2. Handle updating single batch schedule / class link
    if (!body.id) {
      return new Response(JSON.stringify({ success: false, error: 'Batch ID or timings is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const currentList = await getBatchesList(context.env);
    const updatedList = currentList.map(b => b.id === body.id ? { ...b, ...(body.updates || {}) } : b);

    if (context.env.ADMIN_KV) {
      await context.env.ADMIN_KV.put(KV_KEY, JSON.stringify(updatedList));
    }

    return new Response(JSON.stringify({ success: true, batches: updatedList }), {
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

export const onRequestPost = onRequestPut;

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
};
