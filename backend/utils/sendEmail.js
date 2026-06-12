import nodemailer from 'nodemailer';
import EmailLog from '../models/EmailLog.js';

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: parseInt(process.env.SMTP_PORT, 10) === 465,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Define email options
  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  try {
    // Send email
    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);

    // Log success
    await EmailLog.create({
      to: options.email,
      subject: options.subject,
      message: options.message,
      html: options.html,
      status: 'sent'
    });
  } catch (error) {
    console.error('Error sending email:', error);

    // Log failure
    await EmailLog.create({
      to: options.email,
      subject: options.subject,
      message: options.message,
      html: options.html,
      status: 'failed',
      error: error.message
    });

    throw error;
  }
};

export default sendEmail;
