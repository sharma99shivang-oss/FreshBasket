import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const deliveryFor = (subtotal) => (subtotal === 0 || subtotal >= 500 ? 0 : 40);
const totals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + (item.product.discountPrice ?? item.product.price) * item.quantity, 0);
  const deliveryCharge = deliveryFor(subtotal); const gst = Number((subtotal * 0.05).toFixed(2));
  return { subtotal: Number(subtotal.toFixed(2)), deliveryCharge, gst, grandTotal: Number((subtotal + deliveryCharge + gst).toFixed(2)) };
};
const response = async (cart) => {
  await cart.populate({ path: 'items.product', select: 'title slug price discountPrice stock unit images category isAvailable' });
  const items = cart.items.filter((item) => item.product).map((item) => ({ ...item.product.toObject(), quantity: item.quantity }));
  return { items, totals: totals(items.map((item) => ({ product: item, quantity: item.quantity }))) };
};
const getCart = async (userId) => Cart.findOneAndUpdate({ user: userId }, { $setOnInsert: { user: userId } }, { new: true, upsert: true });
const availableProduct = async (id) => Product.findOne({ _id: id, isAvailable: true, stock: { $gt: 0 } });

export const getUserCart = async (req, res) => res.status(200).json({ success: true, data: await response(await getCart(req.user._id)) });
export const addCartItem = async (req, res) => {
  const product = await availableProduct(req.body.productId);
  if (!product) return res.status(404).json({ success: false, message: 'Product is unavailable' });
  const cart = await getCart(req.user._id); const item = cart.items.find((entry) => entry.product.equals(product._id)); const quantity = (item?.quantity || 0) + req.body.quantity;
  if (quantity > product.stock) return res.status(409).json({ success: false, message: `Only ${product.stock} units are currently in stock` });
  if (item) item.quantity = quantity; else cart.items.push({ product: product._id, quantity: req.body.quantity });
  await cart.save(); return res.status(200).json({ success: true, data: await response(cart), message: 'Added to cart' });
};
export const updateCartItem = async (req, res) => {
  const product = await availableProduct(req.params.productId);
  if (!product) return res.status(404).json({ success: false, message: 'Product is unavailable' });
  if (req.body.quantity > product.stock) return res.status(409).json({ success: false, message: `Only ${product.stock} units are currently in stock` });
  const cart = await getCart(req.user._id); const item = cart.items.find((entry) => entry.product.equals(product._id));
  if (!item) return res.status(404).json({ success: false, message: 'Cart item not found' });
  item.quantity = req.body.quantity; await cart.save(); return res.status(200).json({ success: true, data: await response(cart) });
};
export const removeCartItem = async (req, res) => { const cart = await getCart(req.user._id); cart.items = cart.items.filter((item) => !item.product.equals(req.params.productId)); await cart.save(); return res.status(200).json({ success: true, data: await response(cart), message: 'Removed from cart' }); };
export const clearUserCart = async (req, res) => { const cart = await getCart(req.user._id); cart.items = []; await cart.save(); return res.status(200).json({ success: true, data: await response(cart), message: 'Cart cleared' }); };
