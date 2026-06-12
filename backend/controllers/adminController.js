import User from '../models/User.js';
import Certificate from '../models/Certificate.js';
import SiteSettings from '../models/SiteSettings.js';
import DesignRequest from '../models/DesignRequest.js';
import ActivityLog from '../models/ActivityLog.js';
import EmailLog from '../models/EmailLog.js';
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

    const { subject, htmlContent, targetAudience = 'organization' } = req.body;

    if (!subject || !htmlContent) {
      return res.status(400).json({ message: 'Subject and HTML content are required' });
    }

    // Determine audience
    let query = {};
    if (targetAudience === 'organization') {
      query.accountType = 'organization';
    } else if (targetAudience === 'user') {
      query.accountType = 'user';
    } // if 'all', query is empty (selects everyone)

    // Find all users matching the audience
    const targetUsers = await User.find(query).select('email fullName username orgName');

    if (targetUsers.length === 0) {
      return res.status(404).json({ message: `No accounts found matching audience '${targetAudience}' to broadcast to.` });
    }

    // Send emails
    const emailPromises = targetUsers.map(user => {
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

    res.json({ success: true, message: `Broadcast successfully sent to ${targetUsers.length} accounts.` });
  } catch (error) {
    console.error('Error broadcasting feature:', error);
    res.status(500).json({ message: 'Server error while broadcasting', error: error.message });
  }
};

// @desc    Get system wide stats
// @route   GET /api/v1/admin/stats
// @access  Private/Admin
export const getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ accountType: 'user' });
    const totalOrgs = await User.countDocuments({ accountType: 'organization' });
    const totalCertificates = await Certificate.countDocuments();
    
    // Group by plan
    const planDistribution = await User.aggregate([
      { $match: { accountType: 'organization' } },
      { $group: { _id: '$plan', count: { $sum: 1 } } }
    ]);
    
    // Recent signups (last 5)
    const recentSignups = await User.find().sort({ createdAt: -1 }).limit(5).select('fullName email accountType createdAt');

    res.json({
      totalUsers,
      totalOrgs,
      totalCertificates,
      planDistribution,
      recentSignups
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all users with pagination
// @route   GET /api/v1/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    const query = {};
    if (req.query.search) {
      query.$or = [
        { email: { $regex: req.query.search, $options: 'i' } },
        { fullName: { $regex: req.query.search, $options: 'i' } },
        { orgName: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    if (req.query.accountType) {
      query.accountType = req.query.accountType;
    }
    
    if (req.query.plan) {
      query.plan = req.query.plan;
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password -resetPasswordToken -resetPasswordExpire')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: users
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user plan
// @route   PUT /api/v1/admin/users/:id/plan
// @access  Private/Admin
export const updateUserPlan = async (req, res) => {
  try {
    const { plan, durationMonths, extraCertificates } = req.body;
    
    if (!['free', 'pro', 'enterprise', 'sponsor'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (plan === 'sponsor' && user.accountType !== 'organization') {
      return res.status(400).json({ message: 'Sponsorship can only be issued to organization accounts.' });
    }

    user.plan = plan;
    
    if (plan !== 'free') {
      if (durationMonths) {
        // Set expiry date exactly durationMonths from now
        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + parseInt(durationMonths, 10));
        user.planExpiryDate = expiry;
      } else {
        // Default to 1 year
        user.planExpiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      }
    } else {
      user.planExpiryDate = null;
    }
    
    if (extraCertificates !== undefined) {
      user.extraCertificates = parseInt(extraCertificates, 10);
    }
    
    await user.save();
    
    res.json({ success: true, message: `User plan updated to ${plan}` });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all design requests
// @route   GET /api/v1/admin/design-requests
// @access  Private/Admin
export const getDesignRequests = async (req, res) => {
  try {
    const requests = await DesignRequest.find()
      .populate('userId', 'email fullName orgName')
      .sort({ createdAt: -1 });
      
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get system logs
// @route   GET /api/v1/admin/logs
// @access  Private/Admin
export const getSystemLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    const query = {};
    if (req.query.search) {
      query.$or = [
        { details: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    if (req.query.actionType) {
      query.action = req.query.actionType;
    }

    const total = await ActivityLog.countDocuments(query);
    const logs = await ActivityLog.find(query)
      .populate('userId', 'email fullName orgName')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.json({
      success: true,
      count: logs.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: logs
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get system settings
// @route   GET /api/v1/admin/settings
// @access  Private/Admin
export const getSystemSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne({ singletonId: 'authra_global_settings' });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update system settings
// @route   PUT /api/v1/admin/settings
// @access  Private/Admin
export const updateSystemSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.findOneAndUpdate(
      { singletonId: 'authra_global_settings' },
      req.body,
      { new: true, runValidators: true }
    );
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single user details
// @route   GET /api/v1/admin/users/:id
// @access  Private/Admin
export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -resetPasswordToken -resetPasswordExpire');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update single user details
// @route   PUT /api/v1/admin/users/:id
// @access  Private/Admin
export const updateUserDetails = async (req, res) => {
  try {
    // Prevent updating sensitive core fields like password or role through this endpoint
    const updates = { ...req.body };
    delete updates.password;
    delete updates.role;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password -resetPasswordToken -resetPasswordExpire');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get email logs
// @route   GET /api/v1/admin/email-logs
// @access  Private/Admin
export const getEmailLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    const query = {};
    if (req.query.search) {
      query.$or = [
        { to: { $regex: req.query.search, $options: 'i' } },
        { subject: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    if (req.query.status) {
      query.status = req.query.status;
    }

    const total = await EmailLog.countDocuments(query);
    const logs = await EmailLog.find(query)
      .sort({ sentAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.json({
      success: true,
      count: logs.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: logs
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
