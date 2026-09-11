interface Env {
  ADMIN_KV?: KVNamespace;
}

const KV_KEY = 'global_site_content_db';

function removeSpssFromText(text: string): string {
  if (typeof text !== 'string') return text;
  return text
    .replace(/Hands-with practical data analysis/gi, 'Hands-on Statistical')
    .replace(/Hands-on\s*SPSS/gi, 'Hands-on Statistical')
    .replace(/Research Methodology\s*&\s*SPSS\s*Data Analysis/gi, 'Research Methodology & Data Analysis')
    .replace(/Research Methodology\s*&\s*SPSS/gi, 'Research Methodology & Data Analysis')
    .replace(/&\s*SPSS\s*(\(?Ph\.D\.\s*PET\)?)?/gi, '')
    .replace(/SPSS statistical tests/gi, 'advanced statistical tests')
    .replace(/SPSS statistical insights/gi, 'scientific research insights')
    .replace(/SPSS data analysis/gi, 'statistical data analysis')
    .replace(/SPSS Software/gi, 'Statistical Software')
    .replace(/SPSS practice datasets/gi, 'research practice datasets')
    .replace(/SPSS Output Interpretation/gi, 'Statistical Output Interpretation')
    .replace(/SPSS Decision Rule/gi, 'Statistical Decision Rule')
    .replace(/SPSS outputs/gi, 'analytical outputs')
    .replace(/on SPSS/gi, 'with practical data analysis')
    .replace(/in SPSS/gi, 'in statistical data analysis')
    .replace(/Research Statistics on SPSS/gi, 'Research Statistics')
    .replace(/\bSPSS\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function deepCleanSpss(obj: any): any {
  if (!obj) return obj;
  if (typeof obj === 'string') {
    return removeSpssFromText(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(deepCleanSpss);
  }
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const [key, val] of Object.entries(obj)) {
      if (key === 'id' && typeof val === 'string' && val.includes('spss')) {
        cleaned[key] = val;
      } else {
        cleaned[key] = deepCleanSpss(val);
      }
    }
    return cleaned;
  }
  return obj;
}

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  try {
    let content = null;
    if (context.env.ADMIN_KV) {
      const raw = await context.env.ADMIN_KV.get(KV_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          const cleaned = deepCleanSpss(parsed);
          cleaned.version = 4;
          // Auto-heal KV database in background if SPSS or Hands-with was present
          if (raw.includes('SPSS') || raw.includes('Hands-with')) {
            await context.env.ADMIN_KV.put(KV_KEY, JSON.stringify(cleaned));
          }
          content = cleaned;
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

    const cleaned = deepCleanSpss(body.content);
    cleaned.version = 4;

    if (context.env.ADMIN_KV) {
      await context.env.ADMIN_KV.put(KV_KEY, JSON.stringify(cleaned));
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Website content published successfully to Cloudflare KV',
      content: cleaned 
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
