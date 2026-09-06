interface Env {
  ADMIN_KV?: KVNamespace;
}

const KV_KEY = 'global_site_content_db';

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  try {
    let content = null;
    if (context.env.ADMIN_KV) {
      const raw = await context.env.ADMIN_KV.get(KV_KEY);
      if (raw) {
        try {
          content = JSON.parse(raw);
        } catch (e) {}
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      content: content 
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

export const onRequestPut = async (context: { request: Request; env: Env }) => {
  try {
    const body = await context.request.json().catch(() => ({})) as any;

    if (!body || !body.content) {
      return new Response(JSON.stringify({ success: false, error: 'Content payload is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    if (context.env.ADMIN_KV) {
      await context.env.ADMIN_KV.put(KV_KEY, JSON.stringify(body.content));
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Website content published successfully to Cloudflare KV',
      content: body.content 
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
