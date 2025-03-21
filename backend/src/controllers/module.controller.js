import Module from '../models/module.model.js';
import Certification from '../models/certification.model.js';

// @desc    Get all modules
// @route   GET /api/modules
// @access  Public
export const getAllModules = async (req, res) => {
  try {
    const modules = await Module.find();
    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get module by ID
// @route   GET /api/modules/:id
// @access  Public
export const getModuleById = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id)
      .populate('certification', 'title description')
      .populate('questions');
    
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    res.json(module);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get modules by certification ID
// @route   GET /api/modules/certification/:certificationId
// @access  Public
export const getModulesByCertification = async (req, res) => {
  try {
    const modules = await Module.find({ certification: req.params.certificationId });
    
    if (!modules || modules.length === 0) {
      return res.status(404).json({ message: 'No modules found for this certification' });
    }
    
    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new module
// @route   POST /api/modules
// @access  Admin
export const createModule = async (req, res) => {
  const { title, description, certification } = req.body;
  
  try {
    // Check if certification exists
    const certificationExists = await Certification.findById(certification);
    
    if (!certificationExists) {
      return res.status(404).json({ message: 'Certification not found' });
    }
    
    const module = new Module({
      title,
      description,
      certification
    });
    
    const savedModule = await module.save();
    
    // Update certification with the new module
    certificationExists.modules.push(savedModule._id);
    await certificationExists.save();
    
    res.status(201).json(savedModule);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update module
// @route   PUT /api/modules/:id
// @access  Admin
export const updateModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    const { title, description } = req.body;
    
    module.title = title || module.title;
    module.description = description || module.description;
    
    await module.save();
    res.json(module);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete module
// @route   DELETE /api/modules/:id
// @access  Admin
export const deleteModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    // Remove module from certification
    await Certification.findByIdAndUpdate(
      module.certification,
      { $pull: { modules: module._id } }
    );
    
    await module.remove();
    res.json({ message: 'Module removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};