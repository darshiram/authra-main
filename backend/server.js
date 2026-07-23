import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { initCronJobs } from './utils/cronJobs.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import siteSettingsRoutes from './routes/siteSettingsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import designRequestRoutes from './routes/designRequestRoutes.js';
import path from 'path';

dotenv.config();

// Connect to Database
connectDB();

// Initialize scheduled background jobs
initCronJobs();

const app = express();

// Trust proxy is required for Express to set secure cookies behind a reverse proxy like Render
app.set('trust proxy', 1);

// Middleware
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));
app.use(cookieParser());
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CLIENT_URL,
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000'
    ];
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(null, true); // For development, allow all origins to prevent CORS blocks
    }
    return callback(null, true);
  },
  credentials: true
}));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/certificates', certificateRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/careers', careerRoutes);
app.use('/api/v1/settings', siteSettingsRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/design-requests', designRequestRoutes);

// Make uploads folder static
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Base route
app.get('/', (req, res) => {
  res.send('Authra API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
