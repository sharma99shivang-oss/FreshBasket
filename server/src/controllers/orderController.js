import Address from '../models/Address.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Coupon from '../models/Coupon.js';
import { couponDiscount } from './couponController.js';

const deliveryFor = (subtotal) => (subtotal >= 500 ? 0 : 40);
const orderDetails = (query) => query.populate('user', 'name email phone').populate('items.product', 'slug').lean();
const pricing = (items, couponValue = 0) => {
  const subtotal = items.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
  const discounted = items.reduce((sum, { product, quantity }) => sum + (product.discountPrice ?? product.price) * quantity, 0);
  const discount = Number((subtotal - discounted + couponValue).toFixed(2)); const payable = Number((discounted - couponValue).toFixed(2)); const deliveryFee = deliveryFor(payable); const gst = Number((payable * 0.05).toFixed(2));
  return { subtotal: Number(subtotal.toFixed(2)), discount, deliveryFee, gst, totalAmount: Number((payable + deliveryFee + gst).toFixed(2)) };
};

export const placeOrder = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart?.items.length) return res.status(422).json({ success: false, message: 'Your cart is empty' });
  const address = await Address.findOne({ _id: req.body.addressId, user: req.user._id }).lean();
  if (!address) return res.status(404).json({ success: false, message: 'Delivery address not found' });
  const invalid = cart.items.find((item) => !item.product || !item.product.isAvailable || item.product.stock < item.quantity);
  if (invalid) return res.status(409).json({ success: false, message: `${invalid.product?.title || 'A cart item'} is no longer available in the requested quantity` });
  const reserved = [];
  try {
    for (const item of cart.items) {
      const product = await Product.findOneAndUpdate({ _id: item.product._id, isAvailable: true, stock: { $gte: item.quantity } }, { $inc: { stock: -item.quantity } }, { new: true });
      if (!product) throw Object.assign(new Error(`${item.product.title} is no longer available in the requested quantity`), { statusCode: 409 });
      reserved.push({ id: item.product._id, quantity: item.quantity });
    }
    const saleSubtotal = cart.items.reduce((sum, item) => sum + (item.product.discountPrice ?? item.product.price) * item.quantity, 0); const couponResult = await couponDiscount(req.body.couponCode, saleSubtotal);
    if (couponResult.coupon) { const usedCoupon = await Coupon.findOneAndUpdate({ _id: couponResult.coupon._id, isActive: true, expiryDate: { $gt: new Date() }, $expr: { $lt: ['$usedCount', '$usageLimit'] } }, { $inc: { usedCount: 1 } }, { new: true }); if (!usedCoupon) throw Object.assign(new Error('This coupon is no longer available'), { statusCode: 422 }); }
    const totals = pricing(cart.items, couponResult.discount); const order = await Order.create({ user: req.user._id, address: { fullName: address.fullName, phone: address.phone, house: address.house, street: address.street, landmark: address.landmark, city: address.city, state: address.state, pincode: address.pincode, addressType: address.addressType }, items: cart.items.map(({ product, quantity }) => ({ product: product._id, title: product.title, image: product.images?.[0]?.url || '', unit: product.unit, price: product.discountPrice ?? product.price, quantity })), paymentMethod: req.body.paymentMethod, paymentStatus: req.body.paymentMethod === 'COD' ? 'Pending' : 'Pending', ...totals });
    cart.items = []; await cart.save();
    return res.status(201).json({ success: true, data: await orderDetails(Order.findById(order._id)), message: 'Order placed successfully' });
  } catch (error) {
    await Promise.allSettled(reserved.map(({ id, quantity }) => Product.updateOne({ _id: id }, { $inc: { stock: quantity } })));
    throw error;
  }
};

export const getMyOrders = async (req, res) => res.json({ success: true, data: await orderDetails(Order.find({ user: req.user._id }).sort({ createdAt: -1 })) });
export const getMyOrder = async (req, res) => { const order = await orderDetails(Order.findOne({ _id: req.params.id, user: req.user._id })); if (!order) return res.status(404).json({ success: false, message: 'Order not found' }); return res.json({ success: true, data: order }); };
export const cancelMyOrder = async (req, res) => { const order = await Order.findOneAndUpdate({ _id: req.params.id, user: req.user._id, orderStatus: { $in: ['Pending', 'Confirmed', 'Packed'] } }, [{ $set: { orderStatus: 'Cancelled', paymentStatus: { $cond: [{ $eq: ['$paymentStatus', 'Paid'] }, 'Refunded', '$paymentStatus'] } } }], { new: true }); if (!order) { const exists = await Order.exists({ _id: req.params.id, user: req.user._id }); return res.status(exists ? 409 : 404).json({ success: false, message: exists ? 'This order can no longer be cancelled' : 'Order not found' }); } await Promise.all(order.items.map((item) => Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } }))); return res.json({ success: true, data: await orderDetails(Order.findById(order._id)), message: 'Order cancelled' }); };
export const getAllOrders = async (req, res) => { const filter = req.query.status ? { orderStatus: req.query.status } : {}; if (req.query.search) { const users = await User.find({ $or: [{ name: { $regex: req.query.search, $options: 'i' } }, { email: { $regex: req.query.search, $options: 'i' } }] }).select('_id'); filter.user = { $in: users.map((user) => user._id) }; } return res.json({ success: true, data: await orderDetails(Order.find(filter).sort({ createdAt: -1 })) }); };
export const updateOrderStatus = async (req, res) => { const order = await Order.findById(req.params.id); if (!order) return res.status(404).json({ success: false, message: 'Order not found' }); if (order.orderStatus === 'Cancelled' || order.orderStatus === 'Delivered') return res.status(409).json({ success: false, message: 'Completed or cancelled orders cannot be updated' }); order.orderStatus = req.body.orderStatus; if (req.body.orderStatus === 'Cancelled') await Promise.all(order.items.map((item) => Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } }))); if (req.body.orderStatus === 'Delivered' && order.paymentMethod === 'COD') order.paymentStatus = 'Paid'; await order.save(); return res.json({ success: true, data: await orderDetails(Order.findById(order._id)) }); };
