import Coupon from '../models/Coupon.js';

export const couponDiscount = async (code, subtotal) => {
  if (!code) return { coupon: null, discount: 0 };
  const coupon = await Coupon.findOne({ code: code.trim().toUpperCase(), isActive: true, expiryDate: { $gt: new Date() } });
  if (!coupon || coupon.usedCount >= coupon.usageLimit) { const error = new Error('This coupon is invalid or exhausted'); error.statusCode = 422; throw error; }
  if (subtotal < coupon.minimumOrderAmount) { const error = new Error(`This coupon requires an order of at least ₹${coupon.minimumOrderAmount}`); error.statusCode = 422; throw error; }
  const discount = coupon.discountType === 'percentage' ? subtotal * (coupon.discountValue / 100) : coupon.discountValue;
  return { coupon, discount: Number(Math.min(discount, subtotal).toFixed(2)) };
};
export const getCoupons = async (_req, res) => res.json({ success: true, data: await Coupon.find().sort({ createdAt: -1 }).lean() });
export const createCoupon = async (req, res) => res.status(201).json({ success: true, data: await Coupon.create({ ...req.body, code: req.body.code.toUpperCase() }) });
export const updateCoupon = async (req, res) => { const coupon = await Coupon.findByIdAndUpdate(req.params.id, { ...req.body, ...(req.body.code ? { code: req.body.code.toUpperCase() } : {}) }, { new: true, runValidators: true }); if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' }); return res.json({ success: true, data: coupon }); };
export const deleteCoupon = async (req, res) => { const coupon = await Coupon.findByIdAndDelete(req.params.id); if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' }); return res.json({ success: true, message: 'Coupon deleted' }); };
export const applyCoupon = async (req, res) => { const { discount, coupon } = await couponDiscount(req.body.code, req.body.subtotal); return res.json({ success: true, data: { code: coupon.code, discount, discountType: coupon.discountType } }); };
