import mongoose from 'mongoose';

const apiRegistrationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  apiUrl: {
    type: String,
    required: true
  },
  ruleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rule',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Optional: Add index to make sure user cannot register same API twice
apiRegistrationSchema.index({ userId: 1, apiUrl: 1 }, { unique: true });

export const ApiRegistration = mongoose.model('ApiRegistration', apiRegistrationSchema);
