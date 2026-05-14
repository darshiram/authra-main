import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedProjects = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email: 'darshi@yopmail.com' });
    if (user) {
      user.projects = [
        {
          title: 'Authra Access Control',
          description: 'A comprehensive role-based access control system featuring real-time permission management and distributed architecture.',
          link: 'https://authra.dev',
          github: 'https://github.com/darshi/authra',
          tags: ['React', 'Node.js', 'Redis']
        },
        {
          title: 'CloudOps Dashboard',
          description: 'An interactive monitoring dashboard integrating AWS CloudWatch metrics into a unified, dark-mode focused UI.',
          link: 'https://demo.cloudops.net',
          github: 'https://github.com/darshi/cloudops',
          tags: ['TypeScript', 'Next.js', 'AWS']
        },
        {
          title: 'Nexus Data Pipeline',
          description: 'A high-throughput serverless data processing pipeline capable of handling 10M+ events per day.',
          link: '',
          github: 'https://github.com/darshi/nexus',
          tags: ['Python', 'Kafka', 'Docker']
        }
      ];
      await user.save();
      console.log('Projects seeded successfully!');
    } else {
      console.log('User not found.');
    }
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
seedProjects();
