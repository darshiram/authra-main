# Email Notifications Testing Guide

This guide outlines how to manually verify the email notification system.

## 1. Prerequisites
Ensure your backend `.env` file has the following SMTP credentials correctly configured before starting:
```env
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_EMAIL=your_email@domain.com
SMTP_PASSWORD=your_app_password
FROM_NAME="Authra System"
FROM_EMAIL=noreply@authra.com
```

## 2. Testing Certificate Issuance Emails
1. Log into the Authra dashboard as an **Organization**.
2. Navigate to the **Issue New Certificates** tab.
3. Fill out the form, ensuring you use a **real, accessible email address** for at least one recipient.
4. Click **Issue Certificates**.
5. **Verify:**
   - Check the Organization's email inbox for a "Certificate Issuance Confirmation" email.
   - Check the Recipient's email inbox for a "You have received a new certificate" email.

## 3. Testing Razorpay Subscription Webhooks
To verify that emails are sent when subscriptions auto-renew or users upgrade:
1. Go to the "Upgrade Plan" or "Buy Extra Certificates" section on the frontend Dashboard.
2. Complete a test transaction using Razorpay's test mode credentials.
3. **Verify:**
   - The user who made the payment should receive a "Payment Successful" or "Subscription Renewed - Authra" email.

## 4. Testing Admin Broadcast Endpoint
To test broadcasting new feature updates to all organizations:
1. Ensure your user account has the `role` field set to `Admin` or `SuperAdmin` in MongoDB.
2. Obtain your authentication token (from the frontend's localStorage or cookies).
3. Open Postman, Thunder Client, or cURL.
4. Send a `POST` request to `http://localhost:5000/api/v1/admin/broadcast`.
5. Include the token in the `Authorization: Bearer <token>` header.
6. Provide a JSON body:
```json
{
  "subject": "Testing New Feature Broadcast!",
  "htmlContent": "<p>Hello Organizations, we just launched a new feature!</p>"
}
```
7. **Verify:**
   - The API should respond with `success: true` and the number of organizations emailed.
   - Check the inboxes of the registered organization accounts to confirm delivery.
