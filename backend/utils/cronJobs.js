import User from '../models/User.js';
import sendEmail from './sendEmail.js';

const checkExpiringSubscriptions = async () => {
  try {
    const now = new Date();
    // Find users with a paid plan and an expiry date within the next 7 days
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    // We also don't want to spam them every day if we already sent one recently, 
    // but for simplicity, we'll just check if the expiry is exactly 7 days, 3 days, or 1 day away.
    // Since this runs periodically, we'll find users whose expiry date is between (X - 1 hour) and (X + 1 hour) 
    // to avoid sending multiple emails, or we just rely on a daily check and a flag.
    // Let's implement a simple daily check. We'll find users whose expiry is > now and < 7 days from now.
    // To avoid spam, let's add a "lastRenewalEmailSent" field to the User model, but since we can't easily modify the schema 
    // without knowing it, let's check the schema.
    
    // Actually, let's just do a simple check. If their expiry is less than 7 days away, and we haven't sent an email today.
    // For now, let's just log it and send an email if they are exactly 7, 3, or 1 days away.
    // A simpler way: just run this once a day, and find users whose expiry is exactly in 7 days, 3 days, or 1 day.
    
    const users = await User.find({
      accountType: 'organization',
      plan: { $in: ['pro', 'enterprise'] },
      planExpiryDate: { $gt: now, $lte: sevenDaysFromNow }
    });

    for (const user of users) {
      const daysLeft = Math.ceil((new Date(user.planExpiryDate) - now) / (1000 * 60 * 60 * 24));
      
      // Send email if days left is 7, 3, or 1
      if (daysLeft === 7 || daysLeft === 3 || daysLeft === 1) {
        // Check if we already sent a reminder today
        const lastSent = user.lastRenewalReminderDate;
        if (lastSent && lastSent.toDateString() === now.toDateString()) {
          continue; // Already sent today
        }
        
        // Send email
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const pricingUrl = `${frontendUrl}/pricing`;
        
        try {
          await sendEmail({
            email: user.email,
            subject: `Action Required: Your Authra ${user.plan.toUpperCase()} plan expires in ${daysLeft} days`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
                <div style="background-color: #f59e0b; padding: 20px; text-align: center;">
                  <h2 style="color: #ffffff; margin: 0;">Subscription Expiring Soon</h2>
                </div>
                <div style="padding: 30px; background-color: #ffffff; color: #334155;">
                  <p>Hi ${user.name || user.username},</p>
                  <p>Your <strong>${user.plan.toUpperCase()}</strong> plan is set to expire in <strong>${daysLeft} days</strong> (on ${new Date(user.planExpiryDate).toLocaleDateString()}).</p>
                  <p>To avoid any interruption in issuing certificates and using premium features, please renew your subscription.</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${pricingUrl}" style="background-color: #3b82f6; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Renew Subscription</a>
                  </div>
                  <p>Thank you for using Authra!</p>
                </div>
              </div>
            `
          });
          
          // Update DB so we don't send again today if server restarts
          user.lastRenewalReminderDate = now;
          await user.save();
          console.log(`Sent renewal reminder to ${user.email} (${daysLeft} days left)`);
        } catch (err) {
          console.error("Failed to send subscription renewal email:", err);
        }
      }
    }
  } catch (error) {
    console.error('Error checking expiring subscriptions:', error);
  }
};

export const initCronJobs = () => {
  // Run immediately on startup
  checkExpiringSubscriptions();
  
  // Then run every 24 hours
  setInterval(checkExpiringSubscriptions, 24 * 60 * 60 * 1000);
  
  console.log('Cron jobs initialized: Subscription renewal checks scheduled.');
};
