import mongoose from 'mongoose';

const fixedWindowConfigSchema = new mongoose.Schema({
  ruleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Rule', required: true },
  windowSeconds: { type: Number, required: true },
  limit: { type: Number, required: true }
});

export const FixedWindowConfig = mongoose.model('FixedWindowConfig', fixedWindowConfigSchema);
