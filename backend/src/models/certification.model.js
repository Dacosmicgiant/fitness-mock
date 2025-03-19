import mongoose from 'mongoose';

const CertificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  modules: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Certification = mongoose.model('Certification', CertificationSchema);

export default Certification;