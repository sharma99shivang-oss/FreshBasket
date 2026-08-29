import Address from '../models/Address.js';

const normalizeDefault = async (userId, address, requestedDefault) => {
  const hasDefault = await Address.exists({ user: userId, isDefault: true });
  if (requestedDefault || !hasDefault) { await Address.updateMany({ user: userId, _id: { $ne: address._id } }, { isDefault: false }); address.isDefault = true; }
};

export const getAddresses = async (req, res) => res.json({ success: true, data: await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 }).lean() });
export const createAddress = async (req, res) => { const address = new Address({ ...req.body, user: req.user._id }); await normalizeDefault(req.user._id, address, req.body.isDefault); await address.save(); return res.status(201).json({ success: true, data: address }); };
export const updateAddress = async (req, res) => { const address = await Address.findOne({ _id: req.params.id, user: req.user._id }); if (!address) return res.status(404).json({ success: false, message: 'Address not found' }); Object.assign(address, req.body); await normalizeDefault(req.user._id, address, req.body.isDefault); await address.save(); return res.json({ success: true, data: address }); };
export const deleteAddress = async (req, res) => { const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id }); if (!address) return res.status(404).json({ success: false, message: 'Address not found' }); if (address.isDefault) { const next = await Address.findOne({ user: req.user._id }).sort({ createdAt: -1 }); if (next) { next.isDefault = true; await next.save(); } } return res.json({ success: true, message: 'Address deleted' }); };
