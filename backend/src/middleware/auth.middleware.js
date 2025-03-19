import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Middleware to protect routes

export const protectRoute = async (req, res, next) => {
  try {
    let token = null;

    // ✅ Ensure cookies exist before accessing
    if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // ❌ No token found
    if (!token) {
      console.warn(`[${new Date().toISOString()}] [Auth] Unauthorized access attempt from IP: ${req.ip}`);
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
      // 🔐 Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 🔍 Find user and exclude password
      req.user = await User.findById(decoded.userId).select('-password');

      // ❌ User not found
      if (!req.user) {
        console.warn(`[${new Date().toISOString()}] [Auth] Token valid but user not found: ${decoded.userId}`);
        return res.status(401).json({ message: 'User not found' });
      }

      console.log(`[${new Date().toISOString()}] [Auth] Authorized user: ${req.user.email} from IP: ${req.ip}`);
      next();
    } catch (error) {
      console.error(`[${new Date().toISOString()}] [Auth] Token verification failed:`, error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] [Auth] Middleware error:`, error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// Middleware to check subscription status
export const checkSubscription = async (req, res, next) => {
  try {
    const user = req.user;

    // Allow free tests
    if (user.testsRemaining > 0) {
      return next();
    }

    // Check if user has a valid subscription
    if (user.subscriptionStatus === 'premium' && user.subscriptionExpiry > new Date()) {
      return next();
    }

    // No valid subscription
    return res.status(403).json({ 
      message: 'Subscription required', 
      testsRemaining: user.testsRemaining,
      subscriptionStatus: user.subscriptionStatus
    });
  } catch (error) {
    console.error('Subscription check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};