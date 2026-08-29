import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendPasswordResetEmail } from '../services/emailService.js';

const cookieOptions = () => ({ httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', path: '/api/auth', maxAge: 7 * 24 * 60 * 60 * 1000 });
const signAccessToken = (user) => jwt.sign({ role: user.role }, process.env.JWT_SECRET, { subject: user.id, expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' });
const signRefreshToken = (user) => jwt.sign({ type: 'refresh' }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, { subject: user.id, expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' });
const safeUser = (user) => user.toJSON();

const issueSession = async (user, res) => {
  const refreshToken = signRefreshToken(user);
  user.refreshTokens = [...(user.refreshTokens || []).slice(-4), refreshToken];
  await user.save({ validateBeforeSave: false });
  res.cookie('refreshToken', refreshToken, cookieOptions());
  return { accessToken: signAccessToken(user), user: safeUser(user) };
};

export const register = async (req, res) => {
  const { name, email, phone, password, avatar, address } = req.body;
  const existing = await User.exists({ email: email.toLowerCase() });
  if (existing) return res.status(409).json({ success: false, message: 'An account with this email already exists' });
 const user = await User.create({
  name,
  email: email.toLowerCase(),
  phone,
  password,
  avatar,
  address,
  role: "customer", // Always create customer account
});
  const session = await issueSession(user, res);
  return res.status(201).json({ success: true, data: session });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password +refreshTokens');
  if (!user || !(await user.comparePassword(password))) return res.status(401).json({ success: false, message: 'Email or password is incorrect' });
  const session = await issueSession(user, res);
  return res.status(200).json({ success: true, data: session });
};

export const refresh = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ success: false, message: 'Session expired. Please sign in again.' });
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
  if (decoded.type !== 'refresh') return res.status(401).json({ success: false, message: 'Invalid session token' });
  const user = await User.findById(decoded.sub).select('+refreshTokens');
  if (!user || !user.refreshTokens.includes(token)) return res.status(401).json({ success: false, message: 'Session expired. Please sign in again.' });
  user.refreshTokens = user.refreshTokens.filter((entry) => entry !== token);
  const session = await issueSession(user, res);
  return res.status(200).json({ success: true, data: session });
};

export const logout = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    const user = await User.findOne({ refreshTokens: token }).select('+refreshTokens');
    if (user) { user.refreshTokens = user.refreshTokens.filter((entry) => entry !== token); await user.save({ validateBeforeSave: false }); }
  }
  res.clearCookie('refreshToken', cookieOptions());
  return res.status(200).json({ success: true, message: 'You have been signed out' });
};

export const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase() }).select('+resetPasswordToken +resetPasswordExpires');
  if (!user) return res.status(200).json({ success: true, message: 'If an account exists, reset instructions have been sent.' });
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  if (process.env.NODE_ENV === 'production') await sendPasswordResetEmail({ email: user.email, name: user.name, token: resetToken });
  const data = { message: 'If an account exists, reset instructions have been sent.' };
  if (process.env.NODE_ENV !== 'production') data.resetToken = resetToken;
  return res.status(200).json({ success: true, data });
};

export const resetPassword = async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: new Date() } }).select('+password +refreshTokens +resetPasswordToken +resetPasswordExpires');
  if (!user) return res.status(400).json({ success: false, message: 'This reset link is invalid or has expired' });
  user.password = req.body.password; user.resetPasswordToken = undefined; user.resetPasswordExpires = undefined; user.refreshTokens = [];
  await user.save();
  const session = await issueSession(user, res);
  return res.status(200).json({ success: true, data: session, message: 'Your password has been reset' });
};

export const getCurrentUser = (req, res) => res.status(200).json({ success: true, data: { user: safeUser(req.user) } });
