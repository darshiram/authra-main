import Certificate from '../models/Certificate.js';
import User from '../models/User.js';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';

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

    // Send emails
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    // Email to Organization
    sendEmail({
      email: req.user.email,
      subject: `Certificate Issuance Confirmation`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #10b981; padding: 20px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0;">Certificates Issued Successfully</h2>
          </div>
          <div style="padding: 30px; background-color: #ffffff; color: #334155;">
            <p>Hi ${req.user.name || req.user.username},</p>
            <p>You have successfully issued <strong>${issuedCertificates.length}</strong> certificate(s).</p>
            <p>Thank you for using Authra!</p>
          </div>
        </div>
      `
    }).catch(err => console.error("Failed to send organization email:", err));

    // Email to Recipients
    for (const cert of issuedCertificates) {
      const verifyUrl = `${frontendUrl}/verify/${cert.credentialId}`;
      const title = cert.additionalDetails?.title || cert.eventName || 'Certificate';
      
      sendEmail({
        email: cert.recipientEmail,
        subject: `You have received a new certificate: ${title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #0f172a; padding: 20px; text-align: center;">
              <h2 style="color: #ffffff; margin: 0;">${req.user.name || req.user.username} issued you a certificate!</h2>
            </div>
            <div style="padding: 30px; background-color: #ffffff; color: #334155;">
              <p>Hi ${cert.recipientName},</p>
              <p>You have been awarded the <strong>${title}</strong> certificate.</p>
              <p>You can view, verify, and download your certificate using the link below:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verifyUrl}" style="background-color: #3b82f6; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Certificate</a>
              </div>
              <p>Credential ID: <code>${cert.credentialId}</code></p>
            </div>
          </div>
        `
      }).catch(err => console.error("Failed to send recipient email:", err));
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
