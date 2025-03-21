import Certification from '../models/certification.model.js';
import User from '../models/user.model.js';

// @desc    Get all certifications
// @route   GET /api/certifications
// @access  Public
export const getAllCertifications = async (req, res) => {
  try {
    const certifications = await Certification.find();
    res.json(certifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get certification by ID
// @route   GET /api/certifications/:id
// @access  Public
export const getCertificationById = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id)
      .populate('modules');
    
    if (!certification) {
      return res.status(404).json({ message: 'Certification not found' });
    }
    
    res.json(certification);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new certification
// @route   POST /api/certifications
// @access  Admin
export const createCertification = async (req, res) => {
  const { title, description, image } = req.body;
  
  try {
    const certification = new Certification({
      title,
      description,
      image,
    });
    
    await certification.save();
    res.status(201).json(certification);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update certification
// @route   PUT /api/certifications/:id
// @access  Admin
export const updateCertification = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);
    
    if (!certification) {
      return res.status(404).json({ message: 'Certification not found' });
    }
    
    const { title, description, image } = req.body;
    
    certification.title = title || certification.title;
    certification.description = description || certification.description;
    certification.image = image || certification.image;
    
    await certification.save();
    res.json(certification);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete certification
// @route   DELETE /api/certifications/:id
// @access  Admin
export const deleteCertification = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);
    
    if (!certification) {
      return res.status(404).json({ message: 'Certification not found' });
    }
    
    await certification.remove();
    res.json({ message: 'Certification removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Enroll user in a certification
// @route   POST /api/certifications/:id/enroll
// @access  Private
export const enrollInCertification = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);
    
    if (!certification) {
      return res.status(404).json({ message: 'Certification not found' });
    }
    
    const user = await User.findById(req.user.id);
    
    // Check if user is already enrolled
    if (user.enrolledCertifications.includes(certification._id)) {
      return res.status(400).json({ message: 'Already enrolled in this certification' });
    }
    
    // Add certification to user's enrolled certifications
    user.enrolledCertifications.push(certification._id);
    await user.save();
    
    res.json({ message: 'Successfully enrolled in certification', certification });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all certifications user is enrolled in
// @route   GET /api/certifications/user/enrolled
// @access  Private
export const getEnrolledCertifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('enrolledCertifications');
    
    res.json(user.enrolledCertifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};