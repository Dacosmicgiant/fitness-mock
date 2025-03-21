import Question from '../models/question.model.js';
import Module from '../models/module.model.js';
import User from '../models/user.model.js';
import Certification from '../models/certification.model.js';

import mongoose from 'mongoose';

// @desc    Get all questions
// @route   GET /api/questions
// @access  Admin
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('module', 'title certification');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get question by ID
// @route   GET /api/questions/:id
// @access  Admin
export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('module', 'title certification');
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get questions by module ID
// @route   GET /api/questions/module/:moduleId
// @access  Private
export const getQuestionsByModule = async (req, res) => {
  try {
    const questions = await Question.find({ module: req.params.moduleId });
    
    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: 'No questions found for this module' });
    }
    
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new question
// @route   POST /api/questions
// @access  Admin
export const createQuestion = async (req, res) => {
  const { text, options, difficulty, explanation, module } = req.body;
  
  try {
    // Check if module exists
    const moduleExists = await Module.findById(module);
    
    if (!moduleExists) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    // Validate options - ensure at least one correct answer
    const hasCorrectOption = options.some(option => option.isCorrect);
    
    if (!hasCorrectOption) {
      return res.status(400).json({ message: 'Question must have at least one correct answer' });
    }
    
    const question = new Question({
      text,
      options,
      difficulty,
      explanation,
      module
    });
    
    const savedQuestion = await question.save();
    
    // Update module with the new question
    moduleExists.questions.push(savedQuestion._id);
    await moduleExists.save();
    
    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Admin
export const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    const { text, options, difficulty, explanation } = req.body;
    
    // Validate options if provided - ensure at least one correct answer
    if (options) {
      const hasCorrectOption = options.some(option => option.isCorrect);
      
      if (!hasCorrectOption) {
        return res.status(400).json({ message: 'Question must have at least one correct answer' });
      }
    }
    
    question.text = text || question.text;
    question.options = options || question.options;
    question.difficulty = difficulty || question.difficulty;
    question.explanation = explanation || question.explanation;
    
    await question.save();
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Admin
export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Remove question from module
    await Module.findByIdAndUpdate(
      question.module,
      { $pull: { questions: question._id } }
    );
    
    await question.remove();
    res.json({ message: 'Question removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get questions for a test
// @route   GET /api/questions/test
// @access  Private

export const getQuestionsForTest = async (req, res) => {
  console.log("Query parameters:", req.query); // Add this line
  const { certificationId, moduleId, count, difficulty } = req.query;

  try {
    // Validate certificationId
    if (!mongoose.Types.ObjectId.isValid(certificationId)) {
      return res.status(400).json({ message: "Invalid certification ID" });
    }

    // Validate moduleId (if provided)
    if (moduleId && !mongoose.Types.ObjectId.isValid(moduleId)) {
      return res.status(400).json({ message: "Invalid module ID" });
    }

    // Validate user has tests remaining
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.testsRemaining <= 0 && user.subscriptionStatus === "free") {
      return res.status(403).json({
        message: "No tests remaining. Upgrade to premium to continue.",
      });
    }

    // Retrieve certification details and modules
    const certification = await Certification.findById(certificationId).lean();
    if (!certification) {
      return res.status(404).json({ message: "Certification not found" });
    }

    // Build query for fetching questions
    const query = {};

    if (moduleId) {
      query.module = new mongoose.Types.ObjectId(moduleId);
    } else {
      // If no moduleId provided, get all module IDs from certification
      if (!certification.modules || certification.modules.length === 0) {
        return res.status(404).json({ message: "No modules found for this certification" });
      }
      query.module = { $in: certification.modules.map(id => new mongoose.Types.ObjectId(id)) };
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    // Fetch questions
    let questions = await Question.find(query)
      .populate("module", "title certification")
      .lean();

    // Randomize and limit results
    questions = questions.sort(() => 0.5 - Math.random()).slice(0, parseInt(count) || 10);

    // If no questions found
    if (!questions.length) {
      return res.status(404).json({ message: "No questions found for the specified criteria" });
    }

    // Decrement tests remaining for free users
    if (user.subscriptionStatus === "free") {
      user.testsRemaining -= 1;
      await user.save();
    }

    // Remove correct answers before sending to the client
    const clientQuestions = questions.map(({ _id, text, module, difficulty, options }) => ({
      _id,
      text,
      module,
      difficulty,
      options: options.map(({ _id, text }) => ({ _id, text })),
    }));

    res.json({
      questions: clientQuestions,
      testsRemaining: user.testsRemaining,
      questionIds: questions.map((q) => q._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};