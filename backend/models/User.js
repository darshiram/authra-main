import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
const userSchema = new mongoose.Schema({
  accountType: {
    type: String,
    enum: ['user', 'organization'],
    default: 'user',
  },
  // Common
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Individual Fields
  fullName: String,
  username: {
    type: String,
    unique: true,
    sparse: true,
  },
  // OAuth
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  githubId: {
    type: String,
    unique: true,
    sparse: true,
  },
  profilePicture: String,
  bio: String,
  college: String,
  degree: String,
  branch: String,
  year: String,
  location: String,
  skills: [String],
  careerGoals: [String],
  preferences: {
    alerts: { type: Boolean, default: true },
    workshops: { type: Boolean, default: true },
    personalized: { type: Boolean, default: true },
    updates: { type: Boolean, default: false }
  },
  projects: [{
    title: String,
    description: String,
    link: String,
    github: String,
    tags: [String]
  }],
  certificates: [{
    title: String,
    issuer: String,
    issueDate: String,
    skills: [String],
    link: String,
    fileUrl: String,
    verified: { type: Boolean, default: false }
  }],
  
  // Organization Fields
  orgName: String,
  mobileNo: String,
  website: String,
  linkedin: String,
  github: String,
  logoUrl: { type: String, default: '' },
  bannerUrl: { type: String, default: '' },
  aboutOrg: { type: String },
  gallery: [String],
  
  // Subscription fields
  plan: {
    type: String,
    enum: ['free', 'pro', 'enterprise', 'sponsor'],
    default: 'free',
  },
  planExpiryDate: {
    type: Date,
    default: null
  },
  extraCertificates: {
    type: Number,
    default: 0
  },
  lastRenewalReminderDate: {
    type: Date,
    default: null
  },
  
  // Roles (Admin, OrgOwner, User, etc)
  role: {
    type: String,
    enum: ['User', 'OrgOwner', 'Admin', 'SuperAdmin'],
    default: 'User',
  },
  
  // Password Reset
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in db
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
export default User;
