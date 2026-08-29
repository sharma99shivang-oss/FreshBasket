import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 }, subtitle: { type: String, trim: true, maxlength: 240, default: '' }, image: { url: { type: String, required: true }, publicId: { type: String, default: '' } },
  link: { type: String, trim: true, maxlength: 300, default: '' }, isActive: { type: Boolean, default: true }, sortOrder: { type: Number, min: 0, default: 0 },
}, { timestamps: true, versionKey: false });
bannerSchema.index({ isActive: 1, sortOrder: 1 });
export default mongoose.model('Banner', bannerSchema);
