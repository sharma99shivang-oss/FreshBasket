import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Please sign in to continue' });
  const token = header.slice(7);
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.sub);
  if (!user) return res.status(401).json({ success: false, message: 'This account no longer exists' });
  req.user = user;
  return next();
};

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ success: false, message: 'You do not have permission to perform this action' });
  return next();
};

// Public catalogue endpoints can use this to expose extra data to an admin
// without turning a normal shopper request into an authentication failure.
export const optionalProtect = async (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next();

  try {
    const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    req.user = await User.findById(decoded.sub);
  } catch {
    // The regular protected routes remain the authority for invalid sessions.
  }
  return next();
};
