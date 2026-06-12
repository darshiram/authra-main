import mongoose from 'mongoose';

const emailLogSchema = new mongoose.Schema({
  to: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  html: {
    type: String,
  },
  status: {
    type: String,
    enum: ['sent', 'failed'],
    required: true,
  },
  error: {
    type: String,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true
});

const EmailLog = mongoose.model('EmailLog', emailLogSchema);

export default EmailLog;
