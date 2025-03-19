import Module from '../models/module.model.js';
import Certification from '../models/certification.model.js';
import Question from '../models/question.model.js';

// @desc    Get all modules
// @route   GET /api/modules
// @access  Public
export const getAllModules = async (req, res) => {
  try {
    const modules = await Module.find({})
      .populate('certification', 'title');
    
    res.json(modules);
  } catch (error) {
    console.error('Get modules error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get module by ID
// @route   GET /api/modules/:id
// @access  Public
export const getModuleById = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id)
      .populate('certification', 'title description')
      .populate('questions', 'text difficulty');

    if (module) {
      res.json(module);
    } else {
      res.status(404).json({ message: 'Module not found' });
    }
  } catch (error) {
    console.error('Get module error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get modules by certification ID
// @route   GET /api/modules/certification/:certificationId
// @access  Public
export const getModulesByCertification = async (req, res) => {
  try {
    const modules = await Module.find({ certification: req.params.certificationId })
      .populate('certification', 'title');
    
    res.json(modules);
  } catch (error) {
    console.error('Get modules by certification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a module
// @route   POST /api/modules
// @access  Admin
export const createModule = async (req, res) => {
  try {
    const { title, description, certificationId } = req.body;

    // Check if certification exists
    const certification = await Certification.findById(certificationId);
    if (!certification) {
      return res.status(404).json({ message: 'Certification not found' });
    }

    const module = await Module.create({
      title,
      description,
      certification: certificationId
    });

    // Add module to certification
    certification.modules.push(module._id);
    await certification.save();

    res.status(201).json(module);
  } catch (error) {
    console.error('Create module error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a module
// @route   PUT /api/modules/:id
// @access  Admin
export const updateModule = async (req, res) => {
  try {
    const { title, description, certificationId } = req.body;

    const module = await Module.findById(req.params.id);

    if (module) {
      module.title = title || module.title;
      module.description = description || module.description;
      
      // If certification is changing, update relationships
      if (certificationId && certificationId !== module.certification.toString()) {
        // Remove module from old certification
        await Certification.findByIdAndUpdate(
          module.certification,
          { $pull: { modules: module._id } }
        );
        
        // Add module to new certification
        const newCertification = await Certification.findById(certificationId);
        if (!newCertification) {
          return res.status(404).json({ message: 'New certification not found' });
        }
        
        newCertification.modules.push(module._id);
        await newCertification.save();
        
        module.certification = certificationId;
      }

      const updatedModule = await module.save();
      res.json(updatedModule);
    } else {
      res.status(404).json({ message: 'Module not found' });
    }
  } catch (error) {
    console.error('Update module error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a module
// @route   DELETE /api/modules/:id
// @access  Admin
export const deleteModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);

    if (module) {
      // Remove module from certification
      await Certification.findByIdAndUpdate(
        module.certification,
        { $pull: { modules: module._id } }
      );

      // Delete all questions associated with this module
      await Question.deleteMany({ module: module._id });

      await module.deleteOne();
      res.json({ message: 'Module removed' });
    } else {
      res.status(404).json({ message: 'Module not found' });
    }
  } catch (error) {
    console.error('Delete module error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};