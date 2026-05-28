import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Broadcast a feature update to all organizations
// @route   POST /api/v1/admin/broadcast
// @access  Private/Admin
export const broadcastFeature = async (req, res) => {
  try {
    // Check if user is an admin or superadmin
    if (req.user.role !== 'Admin' && req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const { subject, htmlContent } = req.body;

    if (!subject || !htmlContent) {
      return res.status(400).json({ message: 'Subject and HTML content are required' });
    }

    // Find all organization users
    const orgUsers = await User.find({ accountType: 'organization' }).select('email fullName username orgName');

    if (orgUsers.length === 0) {
      return res.status(404).json({ message: 'No organizations found to broadcast to.' });
    }

    // Send emails
    const emailPromises = orgUsers.map(user => {
      const displayName = user.orgName || user.fullName || user.username || 'Organization';
      return sendEmail({
        email: user.email,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #6366f1; padding: 20px; text-align: center;">
              <h2 style="color: #ffffff; margin: 0;">Authra Platform Update</h2>
            </div>
            <div style="padding: 30px; background-color: #ffffff; color: #334155;">
              <p>Hi ${displayName},</p>
              ${htmlContent}
              <p style="margin-top: 30px; font-size: 12px; color: #94a3b8;">This is a mandatory service announcement from Authra.</p>
            </div>
          </div>
        `
      }).catch(err => console.error(`Broadcast failed for ${user.email}:`, err));
    });

    await Promise.all(emailPromises);

    res.json({ success: true, message: `Broadcast successfully sent to ${orgUsers.length} organizations.` });
  } catch (error) {
    console.error('Error broadcasting feature:', error);
    res.status(500).json({ message: 'Server error while broadcasting', error: error.message });
  }
};
