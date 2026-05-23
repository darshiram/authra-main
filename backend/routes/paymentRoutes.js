import express from 'express';
import { createOrder, verifyPayment, razorpayWebhook } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.post('/webhook', razorpayWebhook);

export default router;
