import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/db.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import products from './products.js';

try {
  await connectDatabase();
  const categoryNames = [...new Set(products.map((product) => product.category))];
  await Category.deleteMany({});
  const categories = await Category.insertMany(categoryNames.map((name) => ({ name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') })));
  const categoryIds = new Map(categories.map((category) => [category.name, category._id]));
  await Product.deleteMany({});
  await Product.insertMany(products.map(({ name, image, category, ...product }, index) => ({ ...product, title: name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), category: categoryIds.get(category), unit: product.unit.includes('kg') ? 'kg' : product.unit.includes('g') ? 'g' : product.unit.includes('litre') ? 'litre' : 'pcs', images: [{ url: image }], stock: 50, featured: index < 4, description: `${name} delivered fresh by FreshBasket.` })));
  console.info(`Seeded ${products.length} products.`);
} catch (error) { console.error('Seed failed:', error.message); process.exitCode = 1; }
finally { await mongoose.connection.close(); }
