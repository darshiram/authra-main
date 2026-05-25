import express from 'express';
import { login, register, logout, forgotPassword, resetPassword, googleAuth, githubAuth, linkGoogle, linkGithub } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:token', resetPassword);

router.post('/g-login', googleAuth);
router.post('/github', githubAuth);
router.post('/link/g-login', protect, linkGoogle);
router.post('/link/github', protect, linkGithub);

export default router;
