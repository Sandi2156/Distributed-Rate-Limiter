import bcrypt from 'bcryptjs';

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function comparePasswords(raw, hash) {
  return await bcrypt.compare(raw, hash);
}
