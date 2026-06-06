import ActivityLog from '../models/ActivityLog.js';

export const logActivity = async (req, action, details, userId = null) => {
  try {
    const ipAddress = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'Unknown';
    const finalUserId = userId || (req.user ? req.user._id : null);

    await ActivityLog.create({
      action,
      userId: finalUserId,
      details,
      ipAddress
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};
