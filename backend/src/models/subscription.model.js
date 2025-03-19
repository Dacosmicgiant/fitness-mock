import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,  // in months
    required: true
  },
  features: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Subscription = mongoose.model('Subscription', SubscriptionSchema);

export default Subscription;