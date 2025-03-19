import Question from '../models/question.model.js';
import Module from '../models/module.model.js';

// @desc    Get all questions
// @route   GET /api/questions
// @access  Admin
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find({})
      .populate('module', 'title');
    
    res.json(questions);
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get question by ID
// @route   GET /api/questions/:id
// @access  Admin
export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('module', 'title');

    if (question) {
      res.json(question);
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get questions by module ID
// @route   GET /api/questions/module/:moduleId
// @access  Private
export const getQuestionsByModule = async (req, res) => {
  try {
    const questions = await Question.find({ module: req.params.moduleId })
      .select('-options.isCorrect');  // Don't send correct answers to client
    
    res.json(questions);
  } catch (error) {
    console.error('Get questions by module error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a question
// @route   POST /api/questions
// @access  Admin
export const createQuestion = async (req, res) => {
  try {
    const { text, options, difficulty, explanation, moduleId } = req.body;

    // Check if module exists
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    // Validate options
    if (!options || options.length < 2) {
      return res.status(400).json({ message: 'At least 2 options are required' });
    }

    // Check if at least one option is correct
    const hasCorrectOption = options.some(option => option.isCorrect);
    if (!hasCorrectOption) {
      return res.status(400).json({ message: 'At least one option must be correct' });
    }

    const question = await Question.create({
      text,
      options,
      difficulty,
      explanation,
      module: moduleId
    });

    // Add question to module
    module.questions.push(question._id);
    await module.save();

    res.status(201).json(question);
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a question
// @route   PUT /api/questions/:id
// @access  Admin
export const updateQuestion = async (req, res) => {
  try {
    const { text, options, difficulty, explanation, moduleId } = req.body;

    const question = await Question.findById(req.params.id);

    if (question) {
      // Validate options if provided
      if (options) {
        if (options.length < 2) {
          return res.status(400).json({ message: 'At least 2 options are required' });
        }

        const hasCorrectOption = options.some(option => option.isCorrect);
        if (!hasCorrectOption) {
          return res.status(400).json({ message: 'At least one option must be correct' });
        }
      }

      question.text = text || question.text;
      question.options = options || question.options;
      question.difficulty = difficulty || question.difficulty;
      question.explanation = explanation || question.explanation;
      
      // If module is changing, update relationships
      if (moduleId && moduleId !== question.module.toString()) {
        // Remove question from old module
        await Module.findByIdAndUpdate(
          question.module,
          { $pull: { questions: question._id } }
        );
        
        // Add question to new module
        const newModule = await Module.findById(moduleId);
        if (!newModule) {
          return res.status(404).json({ message: 'New module not found' });
        }
        
        newModule.questions.push(question._id);
        await newModule.save();
        
        question.module = moduleId;
      }

      const updatedQuestion = await question.save();
      res.json(updatedQuestion);
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Admin
export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (question) {
      // Remove question from module
      await Module.findByIdAndUpdate(
        question.module,
        { $pull: { questions: question._id } }
      );

      await question.deleteOne();
      res.json({ message: 'Question removed' });
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get questions for a test
// @route   GET /api/questions/test
// @access  Private
export const getQuestionsForTest = async (req, res) => {
  try {
    const { moduleId, count = 25, isFullTest = false } = req.query;
    
    let query = {};
    
    if (isFullTest === 'true') {
      // For full test, get questions from all modules in the certification
      const module = await Module.findById(moduleId);
      if (!module) {
        return res.status(404).json({ message: 'Module not found' });
      }
      
      const modules = await Module.find({ certification: module.certification });
      const moduleIds = modules.map(m => m._id);
      
      query = { module: { $in: moduleIds } };
    } else {
      // For single module test
      query = { module: moduleId };
    }
    
    // Calculate counts for each difficulty level
    const easyCount = Math.floor(count * 0.5);
    const mediumCount = Math.floor(count * 0.3);
    const hardCount = count - easyCount - mediumCount;
    
    // Get questions by difficulty level
    const easyQuestions = await Question.aggregate([
      { $match: { ...query, difficulty: 'easy' } },
      { $sample: { size: easyCount } }
    ]);
    
    const mediumQuestions = await Question.aggregate([
      { $match: { ...query, difficulty: 'medium' } },
      { $sample: { size: mediumCount } }
    ]);
    
    const hardQuestions = await Question.aggregate([
      { $match: { ...query, difficulty: 'hard' } },
      { $sample: { size: hardCount } }
    ]);
    
    // Combine questions
    const questions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];
    
    // Shuffle questions
    const shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    
    // Remove correct answers from client response
    const testQuestions = shuffledQuestions.map(q => ({
      ...q,
      options: q.options.map(opt => ({
        text: opt.text,
        _id: opt._id
      }))
    }));
    
    res.json(testQuestions);
  } catch (error) {
    console.error('Get test questions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};