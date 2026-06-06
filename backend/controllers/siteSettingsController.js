import SiteSettings from '../models/SiteSettings.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Get site settings
// @route   GET /api/v1/settings
// @access  Public
export const getSiteSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne({ singletonId: 'authra_global_settings' });
    
    // If settings document doesn't exist, create it with defaults
    if (!settings) {
      settings = await SiteSettings.create({
        singletonId: 'authra_global_settings',
        pricingPlans: [
          {
            name: "Starter",
            description: "Perfect for individuals and small teams.",
            monthlyPrice: 0,
            yearlyPrice: 0,
            features: [
              "100 certificates per month",
              "Standard email templates",
              "Community support",
              "Basic analytics"
            ]
          },
          {
            name: "Professional",
            description: "For growing organizations needing brand control.",
            monthlyPrice: 999,
            yearlyPrice: 833,
            isPopular: true,
            features: [
              "1,000 certificates per month",
              "Custom email domains & templates",
              "API access",
              "Priority email support",
              "Custom certificate design"
            ]
          },
          {
            name: "Enterprise",
            description: "Unlimited potential for large institutions.",
            monthlyPrice: -1, // -1 can mean custom pricing
            yearlyPrice: -1,
            features: [
              "Unlimited certificates",
              "Dedicated account manager",
              "Custom integrations (HR/LMS)",
              "SLA guarantees",
              "On-premise deployment options"
            ]
          }
        ]
      });
    }

    res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({ message: 'Failed to fetch site settings.' });
  }
};

// @desc    Submit contact form
// @route   POST /api/v1/settings/contact
// @access  Public
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, category, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    let settings = await SiteSettings.findOne({ singletonId: 'authra_global_settings' });
    if (!settings) {
      settings = await SiteSettings.create({ singletonId: 'authra_global_settings' });
    }

    const supportEmail = settings.contactEmail || 'support@authra.com';

    // Send email to Support
    await sendEmail({
      email: supportEmail,
      subject: `[${category || 'General'}] New Contact Form Submission: ${subject}`,
      html: `
        <h2>New Message from Contact Form</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Category:</strong> ${category || 'Not specified'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h3>Message:</h3>
        <p style="white-space: pre-wrap;">${message}</p>
      `
    });

    // Send auto-reply to User
    await sendEmail({
      email,
      subject: 'We received your message - Authra Support',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #0D0F16; padding: 20px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0;">Message Received</h2>
          </div>
          <div style="padding: 30px; background-color: #ffffff; color: #334155;">
            <p>Hi ${name},</p>
            <p>Thank you for reaching out to Authra Support!</p>
            <p>We have successfully received your message regarding "<strong>${subject}</strong>" under the category <strong>${category || 'General'}</strong>. Our team will review it and get back to you as soon as possible.</p>
            <p>Here is a copy of your message:</p>
            <blockquote style="background: #f8fafc; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0; white-space: pre-wrap;">${message}</blockquote>
          </div>
        </div>
      `
    });

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ message: 'Failed to send message.' });
  }
};
