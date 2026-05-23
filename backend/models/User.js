import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
  profilePicture: String,
  bio: String,
  college: String,
  location: String,
  skills: [String],
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
  logoUrl: String,
  aboutOrg: String,
  gallery: [String],
  
  // Subscription fields
  plan: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free',
  },
  extraCertificates: {
    type: Number,
    default: 0
  },
  
  // Roles (Admin, OrgOwner, User, etc)
  role: {
    type: String,
    enum: ['User', 'OrgOwner', 'Admin', 'SuperAdmin'],
    default: 'User',
  }
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

const User = mongoose.model('User', userSchema);
export default User;
