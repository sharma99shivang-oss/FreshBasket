import bcrypt from 'bcrypt';
import crypto from 'crypto';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  phone: { type: String, required: true, trim: true, minlength: 7, maxlength: 20 },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ['customer', 'admin', 'delivery'], default: 'customer' },
  avatar: { type: String, trim: true, default: '' },
  address: { type: String, trim: true, maxlength: 300, default: '' },
  refreshTokens: { type: [String], select: false, default: [] },
  resetPasswordToken: { type: String, select: false },
  resetPasswordExpires: { type: Date, select: false },
}, { timestamps: true, versionKey: false });

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.createPasswordResetToken = function createPasswordResetToken() {
  const token = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  this.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
  return token;
};

userSchema.set('toJSON', { transform: (_doc, ret) => {
  delete ret.password; delete ret.refreshTokens; delete ret.resetPasswordToken; delete ret.resetPasswordExpires;
  return ret;
} });

export default mongoose.model('User', userSchema);
