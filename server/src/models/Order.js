import mongoose from 'mongoose';

const addressSnapshotSchema = new mongoose.Schema({ fullName: String, phone: String, house: String, street: String, landmark: String, city: String, state: String, pincode: String, addressType: String }, { _id: false });
const orderItemSchema = new mongoose.Schema({ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, title: { type: String, required: true }, image: { type: String, default: '' }, unit: { type: String, default: '' }, price: { type: Number, required: true, min: 0 }, quantity: { type: Number, required: true, min: 1 } }, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  address: { type: addressSnapshotSchema, required: true }, items: { type: [orderItemSchema], required: true },
  paymentMethod: { type: String, enum: ['COD', 'RAZORPAY'], required: true }, paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refunded'], default: 'Pending' },
  orderStatus: { type: String, enum: ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending', index: true },
  subtotal: { type: Number, required: true }, discount: { type: Number, default: 0 }, deliveryFee: { type: Number, required: true }, gst: { type: Number, required: true }, totalAmount: { type: Number, required: true },
}, { timestamps: true, versionKey: false });

orderSchema.index({ createdAt: -1 });
export default mongoose.model('Order', orderSchema);
