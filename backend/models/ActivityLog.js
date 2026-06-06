import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: ['LOGIN', 'REGISTER', 'ISSUE_CERTIFICATE', 'BULK_ISSUE', 'UPDATE_PLAN', 'OTHER']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Sometimes we might log something without a strict user
  },
  details: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String
  }
}, {
  timestamps: true
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;
