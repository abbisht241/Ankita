interface Env {
  RAZORPAY_KEY_ID?: string;
  RAZORPAY_KEY_SECRET?: string;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const keyId = context.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || 'rzp_test_TYpzkUMoTQDDVW';
    const keySecret = context.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET || 'YijPGr0A5rXwCZsE30g4sHdK';

    if (!keyId || !keySecret) {
      return new Response(JSON.stringify({ error: 'Razorpay credentials not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const body = await context.request.json().catch(() => ({})) as {
      amount?: number;
      currency?: string;
      receipt?: string;
      notes?: Record<string, string>;
    };

    const amount = Number(body.amount);
    const currency = body.currency || 'INR';
    const receipt = body.receipt || `rcpt_${Date.now()}`;
    const notes = body.notes || {};

    // Validate amount (in paise, minimum 100 paise = 1 INR)
    if (!amount || isNaN(amount) || amount < 100) {
      return new Response(JSON.stringify({ 
        error: 'Invalid amount. Minimum amount is 100 paise (₹1.00).' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const authHeader = 'Basic ' + btoa(`${keyId}:${keySecret}`);

    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: Math.round(amount),
        currency,
        receipt,
        notes
      })
    });

    const data = await razorpayResponse.json() as any;

    if (!razorpayResponse.ok) {
      const status = razorpayResponse.status === 401 ? 401 : 500;
      return new Response(JSON.stringify({ 
        error: data.error?.description || 'Failed to create Razorpay order',
        details: data
      }), {
        status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    return new Response(JSON.stringify({
      order_id: data.id,
      amount: data.amount,
      currency: data.currency,
      receipt: data.receipt,
      key_id: keyId
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal Server Error' 
    }), {
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
};
