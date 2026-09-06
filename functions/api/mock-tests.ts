interface Env {
  ADMIN_KV?: KVNamespace;
}

const TESTS_KV_KEY = 'global_mock_tests_db';
const SUBS_KV_KEY = 'global_test_submissions_db';

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
      if (body.action === 'save_test' && body.test) {
        const raw = await context.env.ADMIN_KV.get(TESTS_KV_KEY);
        let list: any[] = raw ? JSON.parse(raw) : [];
        const idx = list.findIndex(t => t.id === body.test.id);
        if (idx >= 0) list[idx] = body.test;
        else list.unshift(body.test);
        await context.env.ADMIN_KV.put(TESTS_KV_KEY, JSON.stringify(list));
      } else if (body.action === 'save_submission' && body.submission) {
        const raw = await context.env.ADMIN_KV.get(SUBS_KV_KEY);
        let list: any[] = raw ? JSON.parse(raw) : [];
        list.unshift(body.submission);
        await context.env.ADMIN_KV.put(SUBS_KV_KEY, JSON.stringify(list.slice(0, 1000)));
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
