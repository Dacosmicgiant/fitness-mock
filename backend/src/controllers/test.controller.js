import TestAttempt from '../models/testAttempt.model.js';
import User from '../models/user.model.js';
import Question from '../models/question.model.js';
import Module from '../models/module.model.js';

// @desc    Get all test attempts for a user
// @route   GET /api/tests/attempts
// @access  Private
export const getUserTestAttempts = async (req, res) => {
  try {
    const testAttempts = await TestAttempt.find({ user: req.user._id })
      .populate('certification', 'title')
      .populate('module', 'title')
      .sort({ completedAt: -1 });
    
    res.json(testAttempts);
  } catch (error) {
    console.error('Get test attempts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get test attempt by ID
// @route   GET /api/tests/attempts/:id
// @access  Private
export const getTestAttemptById = async (req, res) => {
  try {
    const testAttempt = await TestAttempt.findById(req.params.id)
      .populate('certification', 'title')
      .populate('module', 'title')
      .populate({
        path: 'responses.question',
        select: 'text options explanation difficulty'
      });

    if (!testAttempt) {
      return res.status(404).json({ message: 'Test attempt not found' });
    }

    // Check if the test attempt belongs to the user
    if (testAttempt.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this test attempt' });
    }

    res.json(testAttempt);
  } catch (error) {
    console.error('Get test attempt error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a test attempt
// @route   POST /api/tests/attempts
// @access  Private
export const createTestAttempt = async (req, res) => {
  try {
    const { 
      certificationId, 
      moduleId, 
      isFullTest, 
      questionCount, 
      duration, 
      responses 
    } = req.body;

    // Validate responses
    if (!responses || !Array.isArray(responses)) {
      return res.status(400).json({ message: 'Invalid responses format' });
    }

    // Check if user has free tests or subscription
    const user = await User.findById(req.user._id);
    if (user.subscriptionStatus === 'free' && user.testsRemaining <= 0) {
      return res.status(403).json({ 
        message: 'No tests remaining. Please subscribe to continue.' 
      });
    }

    // Calculate score
    let score = 0;
    const processedResponses = [];

    for (const response of responses) {
      const question = await Question.findById(response.questionId);
      if (!question) {
        continue;
      }

      const isCorrect = question.options[response.selectedOption]?.isCorrect || false;
      
      if (isCorrect) {
        score += 1;
      }

      processedResponses.push({
        question: question._id,
        selectedOption: response.selectedOption,
        isCorrect
      });
    }

    // Create test attempt
    const testAttempt = await TestAttempt.create({
      user: req.user._id,
      certification: certificationId,
      module: moduleId,
      isFullTest,
      questionCount,
      score,
      maxScore: responses.length,
      duration,
      responses: processedResponses
    });

    // Decrement tests remaining if free user
    if (user.subscriptionStatus === 'free') {
      user.testsRemaining -= 1;
      await user.save();
    }

    res.status(201).json(testAttempt);
  } catch (error) {
    console.error('Create test attempt error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get test statistics for a user
// @route   GET /api/tests/stats
// @access  Private
export const getUserTestStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Get enrolled certifications
    const enrolledCertifications = user.enrolledCertifications;
    
    // Get statistics for each certification
    const stats = [];
    
    for (const certId of enrolledCertifications) {
      const attempts = await TestAttempt.find({ 
        user: req.user._id,
        certification: certId
      });
      
      if (attempts.length === 0) {
        continue;
      }
      
      // Calculate average score
      const totalScore = attempts.reduce((sum, attempt) => sum + (attempt.score / attempt.maxScore), 0);
      const avgScore = attempts.length > 0 ? (totalScore / attempts.length) * 100 : 0;
      
      // Get best score
      const bestScore = Math.max(...attempts.map(attempt => (attempt.score / attempt.maxScore) * 100));
      
      // Get modules in certification
      const modules = await Module.find({ certification: certId });
      
      // Calculate module completion
      const moduleStats = [];
      for (const module of modules) {
        const moduleAttempts = attempts.filter(
          attempt => attempt.module && attempt.module.toString() === module._id.toString()
        );
        
        if (moduleAttempts.length > 0) {
          const moduleTotalScore = moduleAttempts.reduce(
            (sum, attempt) => sum + (attempt.score / attempt.maxScore), 0
          );
          const moduleAvgScore = moduleAttempts.length > 0 ? 
            (moduleTotalScore / moduleAttempts.length) * 100 : 0;
          
          moduleStats.push({
            moduleId: module._id,
            moduleName: module.title,
            attempts: moduleAttempts.length,
            avgScore: moduleAvgScore.toFixed(2)
          });
        }
      }
      
      // Get full test attempts
      const fullTestAttempts = attempts.filter(attempt => attempt.isFullTest);
      const fullTestAvgScore = fullTestAttempts.length > 0 ?
        (fullTestAttempts.reduce((sum, attempt) => sum + (attempt.score / attempt.maxScore), 0) / 
        fullTestAttempts.length) * 100 : 0;
      
      stats.push({
        certificationId: certId,
        totalAttempts: attempts.length,
        avgScore: avgScore.toFixed(2),
        bestScore: bestScore.toFixed(2),
        moduleStats,
        fullTestAttempts: fullTestAttempts.length,
        fullTestAvgScore: fullTestAvgScore.toFixed(2)
      });
    }
    
    res.json({
      testsRemaining: user.subscriptionStatus === 'free' ? user.testsRemaining : 'unlimited',
      subscriptionStatus: user.subscriptionStatus,
      stats
    });
  } catch (error) {
    console.error('Get test stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};