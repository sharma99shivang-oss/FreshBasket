import multer from 'multer';

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 6 }, fileFilter: (_req, file, callback) => {
  if (allowedTypes.has(file.mimetype)) return callback(null, true);
  const error = new Error('Only JPEG, PNG, and WebP images are allowed'); error.statusCode = 422;
  return callback(error);
} });
export const productImagesUpload = upload.array('images', 6);
export const bannerImageUpload = upload.single('image');
