import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 100 },
  image: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, maxlength: 500, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true, versionKey: false });

categorySchema.index({ name: 1 });
export default mongoose.model('Category', categorySchema);
