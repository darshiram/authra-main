import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/User.js';

const getRazorpayInstance = () => {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    return new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return null;
};

// @desc    Create Razorpay Order
// @route   POST /api/v1/payments/order
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { amount, plan, extraCerts } = req.body;

    const rzp = getRazorpayInstance();
    if (!rzp) {
      return res.status(400).json({ message: 'Razorpay is not configured on this server. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env' });
    }

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        plan: plan || '',
        extraCerts: String(extraCerts || 0)
      }
    };

    const order = await rzp.orders.create(options);
    
    res.json({
      success: true,
      order,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating Razorpay order', error: error.message });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/v1/payments/verify
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan, extraCerts } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment successful, update user
      const user = await User.findById(req.user._id);
      
      if (plan) {
        user.plan = plan;
      }
      
      if (extraCerts) {
        user.extraCertificates = (user.extraCertificates || 0) + Number(extraCerts);
      }
      
      await user.save();

      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      console.error('Signature mismatch', { expectedSignature, receivedSignature: razorpay_signature, body });
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Error verifying payment', error: error.message, stack: error.stack });
  }
};

// @desc    Handle Razorpay Webhooks
// @route   POST /api/v1/payments/webhook
// @access  Public
export const razorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    // Verify signature using crypto on rawBody
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(req.rawBody || JSON.stringify(req.body))
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === 'order.paid') {
      const order = payload.order.entity;
      const notes = order.notes || {};
      
      const { userId, plan, extraCerts } = notes;

      if (userId) {
        const user = await User.findById(userId);
        if (user) {
          let updated = false;
          if (plan) {
            user.plan = plan;
            updated = true;
          }
          if (extraCerts && extraCerts !== '0') {
            user.extraCertificates = (user.extraCertificates || 0) + Number(extraCerts);
            updated = true;
          }
          
          if (updated) {
            await user.save();
            console.log(`Webhook: Successfully upgraded user ${userId}`);
          }
        }
      }
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ message: 'Webhook processing error' });
  }
};
