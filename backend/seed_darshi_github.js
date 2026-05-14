import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedGithub = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email: 'darshi@yopmail.com' });
    if (user) {
      user.github = 'https://github.com/grubersjoe'; // Using the author of the repo so we get real data
      await user.save();
      console.log('GitHub seeded!');
    }
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
seedGithub();
