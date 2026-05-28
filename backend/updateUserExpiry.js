import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

const updateExpiry = async () => {
  try {
    await connectDB();
    const user = await User.findOne({ email: 'iste@yopmail.com' });
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    user.planExpiryDate = tomorrow;
    // ensure they are on a paid plan
    if (user.plan === 'free') {
      user.plan = 'pro';
    }
    await user.save();
    console.log(`Updated user ${user.email} expiry to ${tomorrow}`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateExpiry();
