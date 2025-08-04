import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { 
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

export { User };

export async function createUser(email, passwordHash) {
  return await User.create({ email, passwordHash });
}

export async function findUserByEmail(email) {
  return await User.findOne({ email });
}
