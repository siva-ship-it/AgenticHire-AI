import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { AppError, ok } from '../utils/api.js';

const safeUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role });
export async function signup(req, res) {
  if (await User.exists({ email: req.body.email })) throw new AppError(409, 'Email is already registered', 'EMAIL_EXISTS');
  const user = await User.create({ ...req.body, password: await bcrypt.hash(req.body.password, 12) });
  const token = jwt.sign(safeUser(user), env.JWT_SECRET, { expiresIn: '8h' }); return ok(res, { token, user: safeUser(user) }, 201);
}
export async function login(req, res) {
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) throw new AppError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
  const token = jwt.sign(safeUser(user), env.JWT_SECRET, { expiresIn: '8h' }); return ok(res, { token, user: safeUser(user) });
}
export async function me(req, res) { const user = await User.findById(req.user.id); if (!user) throw new AppError(404, 'User not found'); return ok(res, safeUser(user)); }
