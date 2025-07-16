import mongoose from 'mongoose';

const algorithmSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

export const Algorithm = mongoose.model('Algorithm', algorithmSchema);
