import SiteSettings from '../models/SiteSettings.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Submit career application
// @route   POST /api/v1/careers/apply
// @access  Public
export const submitApplication = async (req, res) => {
  try {
    const { fullName, email, portfolioUrl, coverLetter } = req.body;

    if (!fullName || !email || !portfolioUrl || !coverLetter) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    // Get the global site settings to find the careers email
    let settings = await SiteSettings.findOne({ singletonId: 'authra_global_settings' });
    
    // If settings document doesn't exist, create it with the default
    if (!settings) {
      settings = await SiteSettings.create({
        singletonId: 'authra_global_settings',
        careersEmail: 'authra@yopmail.com'
      });
    }

    const targetEmail = settings.careersEmail;

    // Construct the email body
    const emailSubject = `New Job Application from ${fullName}`;
    const emailMessage = `
You have received a new job application!

Name: ${fullName}
Email: ${email}
Portfolio/Resume URL: ${portfolioUrl}

Cover Letter:
${coverLetter}
    `;

    const emailHtml = `
      <h2>New Job Application Received</h2>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Portfolio/Resume URL:</strong> <a href="${portfolioUrl}">${portfolioUrl}</a></p>
      <h3>Cover Letter:</h3>
      <p style="white-space: pre-wrap;">${coverLetter}</p>
    `;

    // Send the email to HR/Admin
    await sendEmail({
      email: targetEmail,
      subject: emailSubject,
      message: emailMessage,
      html: emailHtml
    });

    // Construct the confirmation email for the applicant
    const applicantSubject = "Application Received - Authra";
    const applicantHtml = `
      <div style="background-color: #0D0F16; padding: 40px 20px; font-family: 'Inter', Helvetica, Arial, sans-serif; color: #ffffff;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #111522; border: 1px solid #2A3155; border-radius: 16px; padding: 40px; text-align: center;">
          <div style="margin-bottom: 24px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">Authra</h1>
          </div>
          
          <h2 style="color: #ffffff; font-size: 24px; font-weight: 500; margin-bottom: 16px;">Application Received</h2>
          
          <p style="color: #9AA8D6; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Hi ${fullName},<br><br>
            Thank you for applying to join the Authra team! We have successfully received your application.
          </p>
          
          <div style="background-color: rgba(115, 135, 197, 0.1); border: 1px solid rgba(115, 135, 197, 0.2); border-radius: 12px; padding: 24px; margin-bottom: 32px;">
            <p style="color: #7387C5; font-size: 16px; font-weight: 500; margin: 0;">
              Our team will carefully review your profile and get back to you within <strong>5 working business days</strong>.
            </p>
          </div>
          
          <p style="color: #9AA8D6; font-size: 14px; line-height: 1.6;">
            In the meantime, feel free to explore more about what we do at Authra.
          </p>
          
          <hr style="border: none; border-top: 1px solid #2A3155; margin: 32px 0;">
          
          <p style="color: #4B5563; font-size: 12px; margin: 0;">
            &copy; ${new Date().getFullYear()} Authra. All rights reserved.
          </p>
        </div>
      </div>
    `;

    // Send confirmation email to applicant
    await sendEmail({
      email: email,
      subject: applicantSubject,
      message: "Thank you for applying to join the Authra team! We have successfully received your application. Our team will carefully review your profile and get back to you within 5 working business days.",
      html: applicantHtml
    });

    res.status(200).json({ message: 'Application submitted successfully!' });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ message: 'Failed to submit application. Please try again later.' });
  }
};
