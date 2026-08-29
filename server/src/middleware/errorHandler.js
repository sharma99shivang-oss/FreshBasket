export const errorHandler = (error, req, res, next) => {
  void req;
  void next;
  console.error(error);
  if (error.code === 11000) return res.status(409).json({ success: false, message: `A record with this ${Object.keys(error.keyPattern || {})[0] || 'value'} already exists` });
  if (error.name === 'CastError') return res.status(400).json({ success: false, message: 'Invalid resource ID' });
  if (error.name === 'ValidationError') return res.status(400).json({ success: false, message: error.message });
  if (error.name === 'MulterError') return res.status(422).json({ success: false, message: error.code === 'LIMIT_FILE_SIZE' ? 'Each image must be 5MB or smaller' : 'Invalid image upload' });
  if (error.name === 'JsonWebTokenError') return res.status(401).json({ success: false, message: 'Invalid authentication token' });
  if (error.name === 'TokenExpiredError') return res.status(401).json({ success: false, message: 'Authentication token has expired' });
  const status = error.statusCode || 500;
  return res.status(status).json({ success: false, message: status === 500 ? 'Internal server error' : error.message });
};
