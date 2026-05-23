import Certificate from '../models/Certificate.js';
import User from '../models/User.js';
import crypto from 'crypto';

// Generate a unique credential ID like AUT-8X92-MLK1-009A
const generateCredentialId = () => {
  const parts = [];
  parts.push('AUT');
  parts.push(crypto.randomBytes(2).toString('hex').toUpperCase());
  parts.push(crypto.randomBytes(2).toString('hex').toUpperCase());
  parts.push(crypto.randomBytes(2).toString('hex').toUpperCase());
  return parts.join('-');
};

// @desc    Issue certificates (single or bulk)
// @route   POST /api/v1/certificates/issue
// @access  Private (Organization only)
export const issueCertificates = async (req, res) => {
  try {
    // Only organizations can issue certificates
    if (req.user.accountType !== 'organization') {
      return res.status(403).json({ message: 'Only organizations can issue certificates' });
    }

    const { templateId, issueDate, recipients, additionalDetails } = req.body;

    if (!templateId || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ message: 'Template ID and recipients are required' });
    }

    // Check plan limits
    if (req.user.plan !== 'enterprise') {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      
      const currentMonthCount = await Certificate.countDocuments({
        issuerId: req.user._id,
        createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }
      });

      const requestedCount = recipients.length;
      let allowedCount = 0;

      if (!req.user.plan || req.user.plan === 'free') {
        allowedCount = 100;
      } else if (req.user.plan === 'pro') {
        allowedCount = 1000 + (req.user.extraCertificates || 0);
      }

      if (currentMonthCount + requestedCount > allowedCount) {
        return res.status(403).json({ 
          message: `Monthly limit reached. You can only issue ${Math.max(0, allowedCount - currentMonthCount)} more certificates this month. Please upgrade your plan or buy extra certificates.` 
        });
      }
    }

    const issuedCertificates = [];

    // Process each recipient
    for (const recipient of recipients) {
      if (!recipient.name || !recipient.email) {
        continue; // Skip invalid recipients
      }

      // Check if recipient email matches an existing user
      const existingUser = await User.findOne({ email: recipient.email });

      const newCert = new Certificate({
        issuerId: req.user._id,
        recipientName: recipient.name,
        recipientEmail: recipient.email,
        recipientUserId: existingUser ? existingUser._id : null,
        templateId,
        issueDate: issueDate || Date.now(),
        credentialId: generateCredentialId(),
        additionalDetails: {
          skills: additionalDetails?.skills || '',
          college: additionalDetails?.college || '',
          eventName: additionalDetails?.eventName || ''
        }
      });

      await newCert.save();
      issuedCertificates.push(newCert);
    }

    res.status(201).json({
      message: `Successfully issued ${issuedCertificates.length} certificate(s)`,
      certificates: issuedCertificates
    });

  } catch (error) {
    console.error('Error issuing certificates:', error);
    res.status(500).json({ message: 'Server error while issuing certificates', error: error.message });
  }
};

// @desc    Get certificates issued by an organization
// @route   GET /api/v1/certificates/issued
// @access  Private (Organization only)
export const getIssuedCertificates = async (req, res) => {
  try {
    if (req.user.accountType !== 'organization') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const certificates = await Certificate.find({ issuerId: req.user._id }).sort({ createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    console.error('Error fetching issued certificates:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get certificates for the logged-in user
// @route   GET /api/v1/certificates/my
// @access  Private
export const getMyCertificates = async (req, res) => {
  try {
    // Find certificates where recipientEmail matches user's email or recipientUserId matches user's ID
    const certificates = await Certificate.find({
      $or: [
        { recipientUserId: req.user._id },
        { recipientEmail: req.user.email }
      ]
    }).populate('issuerId', 'name profilePicture organizationDetails').sort({ issueDate: -1 });
    
    res.json(certificates);
  } catch (error) {
    console.error('Error fetching my certificates:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single certificate by ID (Public)
// @route   GET /api/v1/certificates/verify/:credentialId
// @access  Public
export const getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ credentialId: req.params.credentialId })
      .populate('issuerId', 'name profilePicture organizationDetails');
      
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    res.json(certificate);
  } catch (error) {
    console.error('Error fetching certificate:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get certificates by username (Public)
// @route   GET /api/v1/certificates/user/:username
// @access  Public
export const getCertificatesByUsername = async (req, res) => {
  try {
    let param = req.params.username;
    if (param.startsWith('@')) {
      param = param.substring(1);
    }
    
    // First find the user
    const user = await User.findOne({ 
      $or: [
        { username: param },
        { email: param },
        { email: new RegExp(`^${param}@`, 'i') }
      ] 
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const certificates = await Certificate.find({
      $or: [
        { recipientUserId: user._id },
        { recipientEmail: user.email }
      ]
    }).populate('issuerId', 'name profilePicture organizationDetails').sort({ issueDate: -1 });
    
    res.json(certificates);
  } catch (error) {
    console.error('Error fetching user certificates:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
