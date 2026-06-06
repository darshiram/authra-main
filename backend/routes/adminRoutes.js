import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { 
  broadcastFeature,
  getSystemStats,
  getAllUsers,
  updateUserPlan,
  getDesignRequests,
  getSystemSettings,
  updateSystemSettings,
  getSystemLogs,
  getUserDetails,
  updateUserDetails
} from '../controllers/adminController.js';

const router = express.Router();

// Middleware to ensure all routes in this file are admin-only
router.use(protect);
router.use(authorize('SuperAdmin', 'Admin'));

router.post('/broadcast', broadcastFeature);
router.get('/stats', getSystemStats);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetails);
router.put('/users/:id', updateUserDetails);
router.put('/users/:id/plan', updateUserPlan);
router.get('/design-requests', getDesignRequests);
router.get('/settings', getSystemSettings);
router.put('/settings', updateSystemSettings);
router.get('/logs', getSystemLogs);

export default router;
