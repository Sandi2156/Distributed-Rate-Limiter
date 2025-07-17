import mongoose from 'mongoose';

const ruleSchema = new mongoose.Schema({
  algorithmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Algorithm', required: true },
  name: { type: String, required: true }
});

export const Rule = mongoose.model('Rule', ruleSchema);
