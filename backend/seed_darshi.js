import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedDarshi = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const email = 'darshi@yopmail.com';
    let user = await User.findOne({
      $or: [
        { email: 'darshi@yopmail.com' },
        { email: 'darshi@yopmail' }
      ]
    });

    if (user) {
      console.log('User found, updating...');
      user.fullName = 'Darshi Developer';
      user.username = 'darshi';
      user.password = '1234567890'; // This will be hashed by pre-save hook
      user.bio = 'Passionate developer building scalable web applications and exploring the latest in cloud technologies.';
      user.college = 'Tech University';
      user.location = 'San Francisco, CA';
      user.skills = ['React', 'Node.js', 'MongoDB', 'AWS', 'Docker', 'TypeScript'];
      user.website = 'https://darshidev.com';
      user.linkedin = 'https://linkedin.com/in/darshiram0';
      await user.save();
      console.log('User updated successfully');
    } else {
      console.log('User not found, creating new...');
      user = await User.create({
        email: email,
        password: '1234567890',
        accountType: 'user',
        fullName: 'Darshi Developer',
        username: 'darshi',
        bio: 'Passionate developer building scalable web applications and exploring the latest in cloud technologies.',
        college: 'Tech University',
        location: 'San Francisco, CA',
        skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'Docker', 'TypeScript'],
        website: 'https://darshidev.com',
        linkedin: 'https://linkedin.com/in/darshi'
      });
      console.log('User created successfully');
    }

    mongoose.connection.close();
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDarshi();
