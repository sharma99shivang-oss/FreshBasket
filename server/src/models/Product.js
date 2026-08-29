import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({ url: { type: String, required: true }, publicId: { type: String, default: '' } }, { _id: false });
const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 140 }, slug: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 160 },
  description: { type: String, trim: true, maxlength: 2000, default: '' }, category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true }, brand: { type: String, trim: true, maxlength: 80, default: '' },
  price: { type: Number, required: true, min: 0 }, discountPrice: { type: Number, min: 0, default: null }, stock: { type: Number, required: true, min: 0, default: 0 },
  unit: { type: String, required: true, enum: ['kg', 'g', 'litre', 'ml', 'pcs'] }, images: { type: [imageSchema], default: [] },
  rating: { type: Number, min: 0, max: 5, default: 0 }, reviewsCount: { type: Number, min: 0, default: 0 }, featured: { type: Boolean, default: false }, isAvailable: { type: Boolean, default: true },
}, { timestamps: true, versionKey: false });

productSchema.index({ title: 'text', brand: 'text' });
productSchema.index({ price: 1, createdAt: -1, rating: -1 });
export default mongoose.model('Product', productSchema);
