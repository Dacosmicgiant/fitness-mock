import mongoose from 'mongoose';

const TestAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  certification: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certification',
    required: true
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module'
  },
  isFullTest: {
    type: Boolean,
    default: false
  },
  questionCount: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  maxScore: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,  // in minutes
    required: true
  },
  responses: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    selectedOption: Number,
    isCorrect: Boolean
  }],
  completedAt: {
    type: Date,
    default: Date.now
  }
});

const TestAttempt = mongoose.model('TestAttempt', TestAttemptSchema);

export default TestAttempt;