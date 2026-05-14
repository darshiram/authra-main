import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  issuerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipientName: {
    type: String,
    required: true
  },
  recipientEmail: {
    type: String,
    required: true
  },
  recipientUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  templateId: {
    type: String,
    enum: ['modern', 'cyberpunk', 'executive'],
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  credentialId: {
    type: String,
    required: true,
    unique: true
  },
  additionalDetails: {
    skills: {
      type: String,
      default: ''
    },
    college: {
      type: String,
      default: ''
    },
    eventName: {
      type: String,
      default: ''
    }
  }
}, { timestamps: true });

export default mongoose.model('Certificate', certificateSchema);
