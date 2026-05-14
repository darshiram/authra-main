import mongoose from 'mongoose';
import dotenv from 'dotenv';
import crypto from 'crypto';
import User from './models/User.js';
import Certificate from './models/Certificate.js';

dotenv.config();

const generateCredentialId = () => {
  const parts = ['AUT'];
  parts.push(crypto.randomBytes(2).toString('hex').toUpperCase());
  parts.push(crypto.randomBytes(2).toString('hex').toUpperCase());
  parts.push(crypto.randomBytes(2).toString('hex').toUpperCase());
  return parts.join('-');
};

const seedCertificates = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // 1. Get or create an Organization User
    let org = await User.findOne({ accountType: 'organization' });
    if (!org) {
      console.log('No organization found. Creating a dummy org...');
      org = await User.create({
        email: 'org@authra.com',
        password: 'password123', // Will be hashed
        accountType: 'organization',
        name: 'TechCorp Academy',
        username: 'techcorp',
        organizationDetails: {
          website: 'https://techcorp.academy',
          industry: 'Education'
        }
      });
    }

    // 2. Get the target User
    let darshi = await User.findOne({ username: 'darshi' });
    if (!darshi) {
      console.log('User darshi not found. Please run seed_darshi.js first, or use a different user.');
      process.exit(1);
    }

    // 3. Clear existing certificates for Darshi to prevent duplicates if seeded multiple times
    await Certificate.deleteMany({ recipientUserId: darshi._id });
    console.log('Cleared old certificates for darshi.');

    // 4. Create 3 Certificates
    const certsToSeed = [
      {
        issuerId: org._id,
        recipientName: darshi.fullName || 'Darshi Developer',
        recipientEmail: darshi.email,
        recipientUserId: darshi._id,
        templateId: 'modern',
        credentialId: generateCredentialId(),
        issueDate: new Date('2026-05-12'),
        additionalDetails: {
          skills: 'React, Node.js, System Design, AWS',
          college: darshi.college || 'Tech University',
          eventName: 'Advanced Full-Stack Engineering Bootcamp'
        }
      },
      {
        issuerId: org._id,
        recipientName: darshi.fullName || 'Darshi Developer',
        recipientEmail: darshi.email,
        recipientUserId: darshi._id,
        templateId: 'cyberpunk',
        credentialId: generateCredentialId(),
        issueDate: new Date('2026-05-10'),
        additionalDetails: {
          skills: 'Kubernetes, Docker, Go, gRPC, Microservices',
          college: darshi.college || 'Tech University',
          eventName: 'Cloud Native Architecture Certification'
        }
      },
      {
        issuerId: org._id,
        recipientName: darshi.fullName || 'Darshi Developer',
        recipientEmail: darshi.email,
        recipientUserId: darshi._id,
        templateId: 'executive',
        credentialId: generateCredentialId(),
        issueDate: new Date('2026-04-15'),
        additionalDetails: {
          skills: 'Risk Assessment, Compliance, Auditing, Cryptography',
          college: darshi.college || 'Tech University',
          eventName: 'Cybersecurity Risk Management'
        }
      }
    ];

    await Certificate.insertMany(certsToSeed);
    console.log(`Successfully seeded ${certsToSeed.length} certificates for ${darshi.username}!`);
    console.log('Credential IDs to verify:');
    certsToSeed.forEach(c => console.log(`- /verify/${c.credentialId}`));

    mongoose.connection.close();
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedCertificates();
