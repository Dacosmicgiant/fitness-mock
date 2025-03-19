import Certification from '../models/certification.model.js';
import Module from '../models/module.model.js';
import User from '../models/user.model.js';

// @desc    Get all certifications
// @route   GET /api/certifications
// @access  Public
export const getAllCertifications = async (req, res) => {
  try {
    const certifications = await Certification.find({}).populate('modules', 'title description');
    res.json(certifications);
  } catch (error) {
    console.error('Get certifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get certification by ID
// @route   GET /api/certifications/:id
// @access  Public
export const getCertificationById = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id)
      .populate({
        path: 'modules',
        select: 'title description'
      });

    if (certification) {
      res.json(certification);
    } else {
      res.status(404).json({ message: 'Certification not found' });
    }
  } catch (error) {
    console.error('Get certification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a certification
// @route   POST /api/certifications
// @access  Admin
export const createCertification = async (req, res) => {
  try {
    const { title, description, image } = req.body;

    const certification = await Certification.create({
      title,
      description,
      image
    });

    res.status(201).json(certification);
  } catch (error) {
    console.error('Create certification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a certification
// @route   PUT /api/certifications/:id
// @access  Admin
export const updateCertification = async (req, res) => {
  try {
    const { title, description, image } = req.body;

    const certification = await Certification.findById(req.params.id);

    if (certification) {
      certification.title = title || certification.title;
      certification.description = description || certification.description;
      certification.image = image || certification.image;

      const updatedCertification = await certification.save();
      res.json(updatedCertification);
    } else {
      res.status(404).json({ message: 'Certification not found' });
    }
  } catch (error) {
    console.error('Update certification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a certification
// @route   DELETE /api/certifications/:id
// @access  Admin
export const deleteCertification = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);

    if (certification) {
      // Remove references from modules
      await Module.updateMany(
        { certification: certification._id },
        { $set: { certification: null } }
      );

      // Remove certification from users' enrolledCertifications
      await User.updateMany(
        { enrolledCertifications: certification._id },
        { $pull: { enrolledCertifications: certification._id } }
      );

      await certification.deleteOne();
      res.json({ message: 'Certification removed' });
    } else {
      res.status(404).json({ message: 'Certification not found' });
    }
  } catch (error) {
    console.error('Delete certification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Enroll user in certification
// @route   POST /api/certifications/:id/enroll
// @access  Private
export const enrollInCertification = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);
    
    if (!certification) {
      return res.status(404).json({ message: 'Certification not found' });
    }

    const user = await User.findById(req.user._id);

    // Check if user is already enrolled
    if (user.enrolledCertifications.includes(certification._id)) {
      return res.status(400).json({ message: 'Already enrolled in this certification' });
    }

    // Add certification to user's enrollments
    user.enrolledCertifications.push(certification._id);
    await user.save();

    res.status(200).json({ 
      message: 'Successfully enrolled',
      enrolledCertifications: user.enrolledCertifications
    });
  } catch (error) {
    console.error('Enroll certification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's enrolled certifications
// @route   GET /api/certifications/enrolled
// @access  Private
export const getEnrolledCertifications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'enrolledCertifications',
        select: 'title description image',
        populate: {
          path: 'modules',
          select: 'title description'
        }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.enrolledCertifications);
  } catch (error) {
    console.error('Get enrolled certifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};