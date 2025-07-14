import { findUserByEmail, createUser } from '../models/userModel.js';
import { hashPassword, comparePasswords } from '../utils/hashUtils.js';
import { generateToken } from '../utils/jwtUtils.js';

export async function registerUser(email, password) {
  const existing = await findUserByEmail(email);
  if (existing) throw new Error("User already exists");

  const passwordHash = await hashPassword(password);
  const user = await createUser(email, passwordHash);
  return generateToken({ userId: user._id, email: user.email });
}

export async function loginUser(email, password) {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await comparePasswords(password, user.passwordHash);
  if (!isMatch) throw new Error("Invalid credentials");

  return generateToken({ userId: user._id, email: user.email });
}
