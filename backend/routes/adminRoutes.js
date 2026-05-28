import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { broadcastFeature } from '../controllers/adminController.js';

const router = express.Router();

router.post('/broadcast', protect, broadcastFeature);

export default router;
