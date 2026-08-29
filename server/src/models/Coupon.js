import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true, maxlength: 40 }, description: { type: String, trim: true, maxlength: 300, default: '' },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true }, discountValue: { type: Number, required: true, min: 0 }, minimumOrderAmount: { type: Number, min: 0, default: 0 },
  expiryDate: { type: Date, required: true }, usageLimit: { type: Number, min: 1, default: 1 }, usedCount: { type: Number, min: 0, default: 0 }, isActive: { type: Boolean, default: true },
}, { timestamps: true, versionKey: false });
couponSchema.index({ isActive: 1, expiryDate: 1 });
export default mongoose.model('Coupon', couponSchema);
