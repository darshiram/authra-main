import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import DesignRequest from '../models/DesignRequest.js';

const router = express.Router();

// @desc    Submit a design request
// @route   POST /api/v1/design-requests
// @access  Private (OrgOwner)
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'OrgOwner') {
      return res.status(403).json({ message: 'Only organizations can request custom designs' });
    }

    const { description, link } = req.body;

    if (!description) {
      return res.status(400).json({ message: 'Description is required' });
    }

    const request = await DesignRequest.create({
      userId: req.user._id,
      description,
      link
    });

    res.status(201).json({ success: true, request });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
