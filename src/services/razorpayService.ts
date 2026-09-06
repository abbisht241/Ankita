import type { Course } from '../types';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOrderResponse {
  order_id: string;
  amount: number;
  currency: string;
  receipt: string;
  key_id?: string;
}

export interface RazorpaySuccessPayload {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayVerifyResponse {
  success: boolean;
  message?: string;
  payment_id?: string;
  order_id?: string;
  error?: string;
}

export interface CheckoutParams {
  course: Course;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  onSuccess: (verifyResult: RazorpayVerifyResponse, payload: RazorpaySuccessPayload) => void;
  onFailure: (error: string) => void;
  onDismiss?: () => void;
}

/**
 * Ensures Razorpay SDK script is loaded
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Step 1: Call Backend to Create Order (POST /api/create-order)
 */
export const createRazorpayOrder = async (
  amountInPaise: number,
  courseId: string,
  studentInfo: { name: string; email: string; phone: string }
): Promise<RazorpayOrderResponse> => {
  const response = await fetch('/api/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}_${courseId.slice(0, 8)}`,
      notes: {
        course_id: courseId,
        student_name: studentInfo.name,
        student_email: studentInfo.email,
        student_phone: studentInfo.phone
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server error (${response.status}) while creating order`);
  }

  return response.json();
};

/**
 * Step 3: Call Backend to Verify Signature (POST /api/verify-payment)
 */
export const verifyRazorpayPayment = async (
  payload: RazorpaySuccessPayload
): Promise<RazorpayVerifyResponse> => {
  const response = await fetch('/api/verify-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Payment verification failed on server');
  }

  return data;
};

/**
 * Step 2: Open Standard Web Checkout Modal
 */
export const startRazorpayCheckout = async ({
  course,
  studentName,
  studentEmail,
  studentPhone,
  onSuccess,
  onFailure,
  onDismiss
}: CheckoutParams): Promise<void> => {
  try {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded || !window.Razorpay) {
      throw new Error('Razorpay SDK failed to load. Please check your internet connection and try again.');
    }

    // Amount in paise (e.g. ₹999 -> 999 * 100 = 99900 paise, min 100 paise)
    const amountInPaise = Math.max(100, Math.round(course.price * 100));

    // 1. Create order on backend
    const orderData = await createRazorpayOrder(amountInPaise, course.id, {
      name: studentName,
      email: studentEmail,
      phone: studentPhone
    });

    const keyId = orderData.key_id || (import.meta.env.VITE_RAZORPAY_KEY_ID as string) || 'rzp_live_TYq7MT4zXQd0Lo';

    // 2. Configure Razorpay Standard Checkout options
    const options = {
      key: keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Dr. Ankita Bisht Academy',
      description: `${course.title.slice(0, 50)}...`,
      image: window.location.origin + '/images/logo.png',
      order_id: orderData.order_id,
      prefill: {
        name: studentName,
        email: studentEmail,
        contact: studentPhone
      },
      notes: {
        course_id: course.id,
        course_name: course.title,
        student_name: studentName
      },
      theme: {
        color: '#1d4ed8' // Brand Navy/Blue
      },
      handler: async (response: RazorpaySuccessPayload) => {
        try {
          // 3. Verify signature on backend
          const verifyResult = await verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });

          onSuccess(verifyResult, response);
        } catch (verifyErr: any) {
          onFailure(verifyErr.message || 'Signature verification failed.');
        }
      },
      modal: {
        ondismiss: () => {
          if (onDismiss) {
            onDismiss();
          }
        },
        escape: true,
        backdropclose: false
      }
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', (res: any) => {
      const errorMsg = res.error?.description || res.error?.reason || 'Payment was declined or failed.';
      onFailure(`Payment Failed: ${errorMsg}`);
    });

    rzp.open();

  } catch (err: any) {
    onFailure(err.message || 'Failed to initiate checkout process.');
  }
};
