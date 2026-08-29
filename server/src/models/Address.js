import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  fullName: { type: String, required: true, trim: true, maxlength: 100 },
  phone: { type: String, required: true, trim: true, maxlength: 20 },
  house: { type: String, required: true, trim: true, maxlength: 150 },
  street: { type: String, required: true, trim: true, maxlength: 180 },
  landmark: { type: String, trim: true, maxlength: 150, default: '' },
  city: { type: String, required: true, trim: true, maxlength: 80 },
  state: { type: String, required: true, trim: true, maxlength: 80 },
  pincode: { type: String, required: true, trim: true, match: /^\d{6}$/ },
  addressType: { type: String, enum: ['Home', 'Office', 'Other'], default: 'Home' },
  isDefault: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

addressSchema.index({ user: 1, isDefault: 1 });
export default mongoose.model('Address', addressSchema);
