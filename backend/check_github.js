import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const checkGithub = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email: 'darshi@yopmail.com' });
    console.log('User found:', user);
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
checkGithub();
