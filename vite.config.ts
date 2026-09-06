import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import { cloudflare } from "@cloudflare/vite-plugin";
import crypto from 'crypto';

function razorpayDevApiPlugin(): Plugin {
  return {
    name: 'razorpay-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');
        const keyId = env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || 'rzp_live_TYq7MT4zXQd0Lo';
        const keySecret = env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET || 'wt8GOSCSNbcUFwBsojIVNXLp';

        if (req.url === '/api/create-order' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk: Buffer) => { bodyStr += chunk.toString(); });
          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              const amount = Number(body.amount);
              if (!amount || isNaN(amount) || amount < 100) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid amount. Minimum amount is 100 paise.' }));
                return;
              }

              const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
              const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
                method: 'POST',
                headers: {
                  'Authorization': authHeader,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  amount: Math.round(amount),
                  currency: body.currency || 'INR',
                  receipt: body.receipt || `rcpt_${Date.now()}`,
                  notes: body.notes || {}
                })
              });
              const data = await rzpRes.json() as any;
              if (!rzpRes.ok) {
                res.writeHead(rzpRes.status, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: data.error?.description || 'Failed to create Razorpay order', details: data }));
                return;
              }

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                order_id: data.id,
                amount: data.amount,
                currency: data.currency,
                receipt: data.receipt,
                key_id: keyId
              }));
            } catch (err: any) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        if (req.url === '/api/verify-payment' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk: Buffer) => { bodyStr += chunk.toString(); });
          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
              if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Missing required parameters' }));
                return;
              }

              const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
              const generatedSignature = crypto
                .createHmac('sha256', keySecret)
                .update(payload)
                .digest('hex');

              if (generatedSignature !== razorpay_signature) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Invalid payment signature. Verification failed.' }));
                return;
              }

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                success: true,
                message: 'Payment verified successfully',
                payment_id: razorpay_payment_id,
                order_id: razorpay_order_id
              }));
            } catch (err: any) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cloudflare(), razorpayDevApiPlugin()],
});