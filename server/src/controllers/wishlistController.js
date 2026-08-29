import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

const populate = (wishlist) => wishlist.populate({ path: 'products', populate: { path: 'category', select: 'name slug' } });
const getWishlist = async (userId) => Wishlist.findOneAndUpdate({ user: userId }, { $setOnInsert: { user: userId } }, { new: true, upsert: true });
const response = async (wishlist) => { await populate(wishlist); return wishlist.products.filter(Boolean); };

export const getUserWishlist = async (req, res) => res.status(200).json({ success: true, data: await response(await getWishlist(req.user._id)) });
export const addWishlistProduct = async (req, res) => {
  const product = await Product.findById(req.body.productId); if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  const wishlist = await getWishlist(req.user._id); if (wishlist.products.some((id) => id.equals(product._id))) return res.status(200).json({ success: true, data: await response(wishlist), message: 'Product is already in your wishlist' });
  wishlist.products.push(product._id); await wishlist.save(); return res.status(201).json({ success: true, data: await response(wishlist), message: 'Added to wishlist' });
};
export const removeWishlistProduct = async (req, res) => { const wishlist = await getWishlist(req.user._id); wishlist.products = wishlist.products.filter((id) => !id.equals(req.params.productId)); await wishlist.save(); return res.status(200).json({ success: true, data: await response(wishlist), message: 'Removed from wishlist' }); };
