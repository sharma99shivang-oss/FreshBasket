import { Readable } from 'stream';
import cloudinary, { cloudinaryConfigured } from '../config/cloudinary.js';
import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

const pageDetails = (query) => ({ page: Math.max(Number(query.page) || 1, 1), limit: Math.min(Math.max(Number(query.limit) || 12, 1), 100) });
const isTrue = (value) => value === true || value === 'true';
const uploadImage = (file) => new Promise((resolve, reject) => { const stream = cloudinary.uploader.upload_stream({ folder: 'freshbasket/products', resource_type: 'image' }, (error, result) => error ? reject(error) : resolve({ url: result.secure_url, publicId: result.public_id })); Readable.from(file.buffer).pipe(stream); });
const parseBody = (body) => ({ ...body, featured: body.featured === 'true' || body.featured === true, isAvailable: body.isAvailable === 'true' || body.isAvailable === true });
const populate = (query) => query.populate('category', 'name slug image').lean();

export const getProducts = async (req, res) => {
  const { page, limit } = pageDetails(req.query); const showUnavailable = isTrue(req.query.includeUnavailable) && req.user?.role === 'admin'; const filter = showUnavailable ? {} : { isAvailable: true };
  if (req.query.search) { const expression = { $regex: req.query.search, $options: 'i' }; filter.$or = [{ title: expression }, { brand: expression }]; }
  if (req.query.category) {
    const categorySelector = mongoose.isObjectIdOrHexString(req.query.category)
      ? { $or: [{ _id: req.query.category }, { slug: req.query.category }] }
      : { slug: req.query.category };
    const category = await Category.findOne(categorySelector).select('_id');
    filter.category = category?._id || null;
  }
  if (req.query.minPrice !== undefined || req.query.maxPrice !== undefined) filter.price = { ...(req.query.minPrice !== undefined ? { $gte: Number(req.query.minPrice) } : {}), ...(req.query.maxPrice !== undefined ? { $lte: Number(req.query.maxPrice) } : {}) };
  if (isTrue(req.query.featured)) filter.featured = true;
  if (isTrue(req.query.available)) filter.isAvailable = true;
  if (req.query.available === false || req.query.available === 'false') { if (req.user?.role === 'admin') filter.isAvailable = false; }
  const sortMap = { price_asc: { price: 1 }, price_desc: { price: -1 }, rating: { rating: -1, reviewsCount: -1 }, newest: { createdAt: -1 } };
  const sort = sortMap[req.query.sort] || sortMap.newest;
  const [products, total] = await Promise.all([populate(Product.find(filter).sort(sort).skip((page - 1) * limit).limit(limit)), Product.countDocuments(filter)]);
  return res.status(200).json({ success: true, data: products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
};

export const getProductSuggestions = async (req, res) => {
  const query = req.query.q?.trim(); if (!query) return res.status(200).json({ success: true, data: [] });
  const expression = { $regex: query, $options: 'i' };
  const products = await Product.find({ isAvailable: true, $or: [{ title: expression }, { brand: expression }] }).select('title slug brand images price discountPrice').limit(8).lean();
  return res.status(200).json({ success: true, data: products });
};

export const getProduct = async (req, res) => { const selector = mongoose.isObjectIdOrHexString(req.params.id) ? { $or: [{ _id: req.params.id }, { slug: req.params.id }] } : { slug: req.params.id }; const product = await populate(Product.findOne(selector)); if (!product) return res.status(404).json({ success: false, message: 'Product not found' }); return res.status(200).json({ success: true, data: product }); };
export const createProduct = async (req, res) => { if (req.files?.length && !cloudinaryConfigured()) return res.status(503).json({ success: false, message: 'Cloudinary is not configured' }); const uploaded = req.files?.length ? await Promise.all(req.files.map(uploadImage)) : []; const product = await Product.create({ ...parseBody(req.body), images: uploaded }); return res.status(201).json({ success: true, data: await populate(Product.findById(product._id)) }); };
export const updateProduct = async (req, res) => { const product = await Product.findById(req.params.id); if (!product) return res.status(404).json({ success: false, message: 'Product not found' }); if (req.files?.length && !cloudinaryConfigured()) return res.status(503).json({ success: false, message: 'Cloudinary is not configured' }); const uploaded = req.files?.length ? await Promise.all(req.files.map(uploadImage)) : []; Object.assign(product, { ...parseBody(req.body), ...(uploaded.length ? { images: [...product.images, ...uploaded] } : {}) }); await product.save(); return res.status(200).json({ success: true, data: await populate(Product.findById(product._id)) }); };
export const deleteProduct = async (req, res) => { const product = await Product.findByIdAndDelete(req.params.id); if (!product) return res.status(404).json({ success: false, message: 'Product not found' }); if (cloudinaryConfigured()) await Promise.allSettled(product.images.filter((image) => image.publicId).map((image) => cloudinary.uploader.destroy(image.publicId))); return res.status(200).json({ success: true, message: 'Product deleted' }); };
export const uploadProductImages = async (req, res) => { if (!cloudinaryConfigured()) return res.status(503).json({ success: false, message: 'Cloudinary is not configured' }); if (!req.files?.length) return res.status(422).json({ success: false, message: 'Select at least one image' }); const images = await Promise.all(req.files.map(uploadImage)); return res.status(201).json({ success: true, data: images }); };
