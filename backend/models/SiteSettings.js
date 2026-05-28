import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  // Singleton pattern identifier
  singletonId: {
    type: String,
    default: 'authra_global_settings',
    unique: true
  },
  careersEmail: {
    type: String,
    default: 'authra@yopmail.com'
  },
  contactEmail: {
    type: String,
    default: 'support@authra.com'
  },
  contactPhone: {
    type: String,
    default: '+1 (555) 123-4567'
  },
  contactAddress: {
    type: String,
    default: '123 Trust Avenue,\nSan Francisco, CA 94103'
  },
  contactLiveChatHours: {
    type: String,
    default: 'Available Mon-Fri, 9am-5pm EST'
  },
  socialLinks: {
    linkedin: { type: String, default: 'https://linkedin.com' },
    twitter: { type: String, default: 'https://twitter.com' },
    instagram: { type: String, default: 'https://instagram.com' }
  },
  privacyPolicyText: [{
    title: String,
    content: String
  }],
  termsOfServiceText: [{
    title: String,
    content: String
  }],
  pricingPlans: [{
    name: String,
    description: String,
    monthlyPrice: Number,
    yearlyPrice: Number,
    features: [String],
    isPopular: { type: Boolean, default: false }
  }],
  jobOpenings: [{
    title: String,
    department: String,
    location: String,
    type: String
  }]
}, {
  timestamps: true
});

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
export default SiteSettings;
