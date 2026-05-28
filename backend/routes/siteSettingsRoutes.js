import express from 'express';
import { getSiteSettings, submitContactForm } from '../controllers/siteSettingsController.js';

const router = express.Router();

router.get('/', getSiteSettings);
router.post('/contact', submitContactForm);

export default router;
