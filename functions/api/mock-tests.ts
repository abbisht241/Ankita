interface Env {
  ADMIN_KV?: KVNamespace;
}

const TESTS_KV_KEY = 'global_mock_tests_db';
const SUBS_KV_KEY = 'global_test_submissions_db';

const DEFAULT_SUBMISSIONS = [
  {
    id: 'SUB-5264-1',
    testId: 'test-ugc-net-paper1-cbt',
    testTitle: 'UGC NET Paper 1 - All India CBT Mock Test 2026 (Full Syllabus)',
    studentName: 'Anoop Negi',
    studentPhone: '8449137304',
    studentEmail: 'abbisht@gmail.com',
    score: 16,
    totalMarks: 20,
    percentage: 80,
    isPassed: true,
    correctCount: 8,
    incorrectCount: 2,
    unattemptedCount: 0,
    timeSpentSeconds: 385,
    answers: { q1: 1, q2: 1, q3: 1, q4: 2, q5: 2, q6: 0, q7: 2, q8: 3, q9: 0, q10: 1 },
    reviewStatus: {},
    submittedAt: '2026-09-10T14:30:00.000Z'
  },
  {
    id: 'SUB-5264-2',
    testId: 'test-ugc-net-paper1-cbt',
    testTitle: 'UGC NET Paper 1 - Teaching & Research Aptitude Practice Set',
    studentName: 'Anoop Negi',
    studentPhone: '8449137304',
    studentEmail: 'abbisht@gmail.com',
    score: 18,
    totalMarks: 20,
    percentage: 90,
    isPassed: true,
    correctCount: 9,
    incorrectCount: 1,
    unattemptedCount: 0,
    timeSpentSeconds: 410,
    answers: { q1: 1, q2: 1, q3: 1, q4: 2, q5: 2, q6: 0, q7: 2, q8: 3, q9: 1, q10: 2 },
    reviewStatus: {},
    submittedAt: '2026-09-11T16:15:00.000Z'
  }
];

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  try {
    const url = new URL(context.request.url);
    const type = url.searchParams.get('type') || 'tests';

    let data: any = null;
    if (context.env.ADMIN_KV) {
      const key = type === 'submissions' ? SUBS_KV_KEY : TESTS_KV_KEY;
      const raw = await context.env.ADMIN_KV.get(key);
      if (raw) {
        try {
          data = JSON.parse(raw);
        } catch (e) {}
      }
    }

    if (type === 'submissions') {
      let list: any[] = Array.isArray(data) ? data : [];
      DEFAULT_SUBMISSIONS.forEach(def => {
        if (!list.some(s => s.id === def.id)) {
          list.push(def);
        }
      });
      data = list;
    }

    return new Response(JSON.stringify({ 
      success: true, 
      type,
      data: data || [] 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const body = await context.request.json().catch(() => ({})) as any;

    if (!body || !body.action) {
      return new Response(JSON.stringify({ success: false, error: 'Action is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    if (context.env.ADMIN_KV) {
      if (body.action === 'save_all_tests' && Array.isArray(body.tests)) {
        await context.env.ADMIN_KV.put(TESTS_KV_KEY, JSON.stringify(body.tests));
      } else if (body.action === 'save_test' && body.test) {
        const raw = await context.env.ADMIN_KV.get(TESTS_KV_KEY);
        let list: any[] = raw ? JSON.parse(raw) : [];
        const idx = list.findIndex(t => t.id === body.test.id);
        if (idx >= 0) list[idx] = body.test;
        else list.unshift(body.test);
        await context.env.ADMIN_KV.put(TESTS_KV_KEY, JSON.stringify(list));
      } else if (body.action === 'save_submission' && body.submission) {
        const raw = await context.env.ADMIN_KV.get(SUBS_KV_KEY);
        let list: any[] = raw ? JSON.parse(raw) : [];
        const cleanPhone = (body.submission.studentPhone || '').replace(/\D/g, '');
        const existingIdx = list.findIndex((s: any) => 
          s.id === body.submission.id || 
          (cleanPhone && (s.studentPhone || '').replace(/\D/g, '') === cleanPhone && s.testId === body.submission.testId)
        );
        if (existingIdx >= 0) {
          list[existingIdx] = body.submission;
        } else {
          list.unshift(body.submission);
        }
        await context.env.ADMIN_KV.put(SUBS_KV_KEY, JSON.stringify(list.slice(0, 1000)));
      } else if (body.action === 'delete_submission' && body.id) {
        const raw = await context.env.ADMIN_KV.get(SUBS_KV_KEY);
        let list: any[] = raw ? JSON.parse(raw) : [];
        list = list.filter((s: any) => s.id !== body.id);
        await context.env.ADMIN_KV.put(SUBS_KV_KEY, JSON.stringify(list));
      } else if (body.action === 'delete_test' && body.id) {
        const raw = await context.env.ADMIN_KV.get(TESTS_KV_KEY);
        let list: any[] = raw ? JSON.parse(raw) : [];
        list = list.filter((t: any) => t.id !== body.id);
        await context.env.ADMIN_KV.put(TESTS_KV_KEY, JSON.stringify(list));
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Mock test data synced successfully' 
    }), {
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
    const action = url.searchParams.get('action');
    const id = url.searchParams.get('id');

    if (context.env.ADMIN_KV && id) {
      if (action === 'delete_submission') {
        const raw = await context.env.ADMIN_KV.get(SUBS_KV_KEY);
        let list: any[] = raw ? JSON.parse(raw) : [];
        list = list.filter((s: any) => s.id !== id);
        await context.env.ADMIN_KV.put(SUBS_KV_KEY, JSON.stringify(list));
      } else if (action === 'delete_test') {
        const raw = await context.env.ADMIN_KV.get(TESTS_KV_KEY);
        let list: any[] = raw ? JSON.parse(raw) : [];
        list = list.filter((t: any) => t.id !== id);
        await context.env.ADMIN_KV.put(TESTS_KV_KEY, JSON.stringify(list));
      }
    }

    return new Response(JSON.stringify({ success: true, message: 'Deleted successfully' }), {
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
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
};
