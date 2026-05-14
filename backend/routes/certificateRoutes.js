import express from 'express';
import { 
  issueCertificates, 
  getIssuedCertificates, 
  getMyCertificates, 
  getCertificateById,
  getCertificatesByUsername
} from '../controllers/certificateController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/verify/:credentialId', getCertificateById);
router.get('/user/:username', getCertificatesByUsername);

// Protected routes
router.use(protect);
router.post('/issue', issueCertificates);
router.get('/issued', getIssuedCertificates);
router.get('/my', getMyCertificates);

export default router;
