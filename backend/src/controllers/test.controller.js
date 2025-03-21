import TestAttempt from '../models/testAttempt.model.js';
import Question from '../models/question.model.js';
import User from '../models/user.model.js';
import Module from '../models/module.model.js';
import Certification from '../models/certification.model.js';

// @desc    Get user's test attempts
// @route   GET /api/tests/attempts
// @access  Private
export const getUserTestAttempts = async (req, res) => {
  try {
    const testAttempts = await TestAttempt.find({ user: req.user.id })
      .populate('certification', 'title')
      .populate('module', 'title')
      .sort('-completedAt');
    
    res.json(testAttempts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get test attempt by ID
// @route   GET /api/tests/attempts/:id
// @access  Private
export const getTestAttemptById = async (req, res) => {
  try {
    const testAttempt = await TestAttempt.findById(req.params.id)
      .populate('certification', 'title description')
      .populate('module', 'title description')
      .populate({
        path: 'responses.question',
        select: 'text options explanation'
      });
    
    if (!testAttempt) {
      return res.status(404).json({ message: 'Test attempt not found' });
    }
    
    // Check if the test belongs to the user
    if (testAttempt.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this test' });
    }
    
    res.json(testAttempt);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new test attempt (submit test)
// @route   POST /api/tests/attempts
// @access  Private
export const createTestAttempt = async (req, res) => {
  const {
    certificationId,
    moduleId,
    isFullTest,
    questionResponses,
    duration
  } = req.body;
  
  try {
    // Validate certification exists
    const certification = await Certification.findById(certificationId);
    if (!certification) {
      return res.status(404).json({ message: 'Certification not found' });
    }
    
    // Validate module if provided
    let module = null;
    if (moduleId) {
      module = await Module.findById(moduleId);
      if (!module) {
        return res.status(404).json({ message: 'Module not found' });
      }
    }
    
    // Get all question IDs from responses
    const questionIds = questionResponses.map(response => response.questionId);
    
    // Fetch questions with correct answers
    const questions = await Question.find({ _id: { $in: questionIds } });
    
    // Map of question ID to correct answer index
    const correctAnswersMap = {};
    questions.forEach(question => {
      correctAnswersMap[question._id.toString()] = question.options.findIndex(option => option.isCorrect);
    });
    
    // Calculate score
    let score = 0;
    const responses = questionResponses.map(response => {
      const questionId = response.questionId;
      const selectedOption = response.selectedOption;
      const isCorrect = correctAnswersMap[questionId] === selectedOption;
      
      if (isCorrect) {
        score++;
      }
      
      return {
        question: questionId,
        selectedOption,
        isCorrect
      };
    });
    
    // Create test attempt
    const testAttempt = new TestAttempt({
      user: req.user.id,
      certification: certificationId,
      module: moduleId,
      isFullTest,
      questionCount: questionResponses.length,
      score,
      maxScore: questionResponses.length,
      duration,
      responses
    });
    
    await testAttempt.save();
    
    res.status(201).json({
      _id: testAttempt._id,
      score,
      maxScore: questionResponses.length,
      percentage: (score / questionResponses.length) * 100,
      passed: (score / questionResponses.length) >= 0.7 // 70% passing threshold
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user's test statistics
// @route   GET /api/tests/stats
// @access  Private
export const getUserTestStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { certificationId } = req.query;
    
    // Build query
    const query = { user: userId };
    if (certificationId) {
      query.certification = certificationId;
    }
    
    // Get all user's test attempts
    const testAttempts = await TestAttempt.find(query);
    
    if (testAttempts.length === 0) {
      return res.json({
        totalTests: 0,
        averageScore: 0,
        accuracy: 0,
        testsRemaining: req.user.subscriptionStatus === 'free' ? req.user.testsRemaining : 'unlimited'
      });
    }
    
    // Calculate total tests
    const totalTests = testAttempts.length;
    
    // Calculate average score
    const totalScorePercentage = testAttempts.reduce((acc, test) => {
      return acc + (test.score / test.maxScore) * 100;
    }, 0);
    
    const averageScore = totalScorePercentage / totalTests;
    
    // Calculate overall accuracy
    const totalQuestions = testAttempts.reduce((acc, test) => acc + test.responses.length, 0);
    const correctAnswers = testAttempts.reduce((acc, test) => {
      return acc + test.responses.filter(response => response.isCorrect).length;
    }, 0);
    
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    
    // Get stats by difficulty if available
    const difficultyStats = {};
    
    // Get certification data
    let certificationStats = [];
    if (!certificationId) {
      // Get stats by certification
      const certifications = await Certification.find({ _id: { $in: [...new Set(testAttempts.map(t => t.certification))] } });
      
      certificationStats = await Promise.all(certifications.map(async (cert) => {
        const certTests = testAttempts.filter(t => t.certification.toString() === cert._id.toString());
        const certTotalScore = certTests.reduce((acc, test) => acc + (test.score / test.maxScore) * 100, 0);
        const certAvgScore = certTotalScore / certTests.length;
        
        return {
          id: cert._id,
          name: cert.title,
          attempts: certTests.length,
          averageScore: certAvgScore
        };
      }));
    }
    
    // Get user subscription status and tests remaining
    const user = await User.findById(userId);
    
    res.json({
      totalTests,
      averageScore,
      accuracy,
      certificationStats: certificationStats.length > 0 ? certificationStats : undefined,
      difficultyStats: Object.keys(difficultyStats).length > 0 ? difficultyStats : undefined,
      testsRemaining: user.subscriptionStatus === 'free' ? user.testsRemaining : 'unlimited',
      subscriptionStatus: user.subscriptionStatus
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};