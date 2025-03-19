import User from '../models/user.model.js';
import { generateToken } from '../lib/utils.js';
import Certification from '../models/certification.model.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      // Generate JWT token
      const token = generateToken(user._id, res);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        subscriptionStatus: user.subscriptionStatus,
        testsRemaining: user.testsRemaining,
        token
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password is correct
    if (user && (await user.comparePassword(password))) {
      // Generate JWT token
      const token = generateToken(user._id, res);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        subscriptionStatus: user.subscriptionStatus,
        testsRemaining: user.testsRemaining,
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private

export const getUserProfile = async (req, res) => {
    try {
      if (!req.user || !req.user._id) {
        console.warn(`[${new Date().toISOString()}] [UserProfile] Unauthorized access attempt - No user in request`);
        return res.status(401).json({ message: 'Unauthorized access' });
      }
  
      console.log(`[${new Date().toISOString()}] [UserProfile] Fetching profile for User ID: ${req.user._id}`);
  
      const user = await User.findById(req.user._id)
        .select('-password')
        .populate('enrolledCertifications', 'title description');
  
      if (!user) {
        console.warn(`[${new Date().toISOString()}] [UserProfile] User not found: ${req.user._id}`);
        return res.status(404).json({ message: 'User not found' });
      }
  
      console.log(`[${new Date().toISOString()}] [UserProfile] Profile fetched successfully for User ID: ${req.user._id}`);
      res.json(user);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] [UserProfile] Get profile error for User ID: ${req.user?._id || 'Unknown'} -`, error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private

export const updateUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
  
      if (user) {
        // Update only if new values are provided in the request
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.subscriptionStatus = req.body.subscriptionStatus ?? user.subscriptionStatus;
        user.testsRemaining = req.body.testsRemaining ?? user.testsRemaining;
  
        if (req.body.password) {
          user.password = req.body.password;
        }
  
        const updatedUser = await user.save();
  
        res.json({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          subscriptionStatus: updatedUser.subscriptionStatus,
          testsRemaining: updatedUser.testsRemaining,
        });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  