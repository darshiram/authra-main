import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let user = await User.findById(decoded.userId).select('-password');

      if (user && user.plan !== 'free' && user.planExpiryDate && new Date() > new Date(user.planExpiryDate)) {
        user.plan = 'free';
        user.planExpiryDate = null;
        await user.save();
      }

      req.user = user;

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Role '${req.user?.role || 'undefined'}' is not authorized to access this route` 
      });
    }
    next();
  };
};
