import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SiteSettings from './models/SiteSettings.js';

dotenv.config();

const privacyPolicyData = [
  { title: "1. Information We Collect", content: "We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, items requested (for delivery services), delivery notes, and other information you choose to provide." },
  { title: "2. How We Use Information", content: "We may use the information we collect about you to provide, maintain, and improve our services, including, for example, to facilitate payments, send receipts, provide products and services you request (and send related information), develop new features, provide customer support to Users and Drivers, develop safety features, authenticate users, and send product updates and administrative messages." },
  { title: "3. Sharing of Information", content: "We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including as follows: with third parties to provide you a service you requested through a partnership or promotional offering made by a third party or us; with the general public if you submit content in a public forum, such as blog comments, social media posts, or other features of our Services that are viewable by the general public." },
  { title: "4. Data Security", content: "We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction." },
  { title: "5. Your Choices", content: "You may correct your account information at any time by logging into your online or in-app account. If you wish to cancel your account, please email us. Please note that in some cases we may retain certain information about you as required by law, or for legitimate business purposes to the extent permitted by law." },
  { title: "6. Contact Us", content: "If you have any questions about this Privacy Policy, please contact us at privacy@authra.com." }
];

const termsData = [
  { title: "1. Acceptance of Terms", content: "By accessing and using Authra's services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you are prohibited from using our services." },
  { title: "2. Use of License", content: "Permission is granted to temporarily download one copy of the materials (information or software) on Authra's website for personal, non-commercial transitory viewing only." },
  { title: "3. Disclaimer", content: "The materials on Authra's website are provided on an 'as is' basis. Authra makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights." },
  { title: "4. Limitations", content: "In no event shall Authra or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Authra's website." },
  { title: "5. Revisions and Errata", content: "The materials appearing on Authra's website could include technical, typographical, or photographic errors. Authra does not warrant that any of the materials on its website are accurate, complete, or current. Authra may make changes to the materials contained on its website at any time without notice." },
  { title: "6. Contact Us", content: "If you have any questions about these Terms, please contact us at support@authra.com." }
];

const pricingData = [
  {
    name: "Starter",
    description: "Perfect for small organizations trying out the platform.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: ["100 Certificates / month", "Basic Templates", "No API Access"],
    isPopular: false
  },
  {
    name: "Professional",
    description: "For growing organizations that need more power.",
    monthlyPrice: 999,
    yearlyPrice: 799,
    features: ["1,000 Certificates / month", "Full API Access", "Custom Branding & Logos", "Buy Extra: ₹10 per 100 certs", "Priority Email Support"],
    isPopular: true
  },
  {
    name: "Enterprise",
    description: "For large scale issuance with custom requirements.",
    monthlyPrice: -1, // Use -1 to represent 'Custom' pricing
    yearlyPrice: -1,
    features: ["Unlimited Certificates", "Dedicated Account Manager", "Custom Integration Solutions", "SLA Guarantee"],
    isPopular: false
  }
];

const jobsData = [
  { title: "Senior Frontend Engineer", department: "Engineering", location: "Remote", employmentType: "Full-time" },
  { title: "Product Designer", department: "Design", location: "San Francisco, CA", employmentType: "Full-time" },
  { title: "Developer Advocate", department: "Developer Relations", location: "Remote", employmentType: "Contract" }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    const existingSettings = await SiteSettings.findOne({ singletonId: 'authra_global_settings' });
    if (existingSettings) {
      console.log('Dropping existing settings...');
      await SiteSettings.deleteOne({ singletonId: 'authra_global_settings' });
    }

    console.log('Creating new settings document...');
    await SiteSettings.create({
      singletonId: 'authra_global_settings',
      socialLinks: {
        linkedin: 'https://linkedin.com/company/authra',
        twitter: 'https://twitter.com/authra',
        instagram: 'https://instagram.com/authra'
      },
      privacyPolicyText: privacyPolicyData,
      termsOfServiceText: termsData,
      pricingPlans: pricingData,
      jobOpenings: jobsData
    });

    console.log('Data successfully seeded!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
