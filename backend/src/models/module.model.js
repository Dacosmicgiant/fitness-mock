import mongoose from 'mongoose';

const ModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  certification: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certification',
    required: true
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Module = mongoose.model('Module', ModuleSchema);

export default Module;