import { motion } from 'framer-motion';
import { Heart, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { addItem, addRemoteItem } from '../../redux/slices/cartSlice';
import { addWishlist, removeWishlist } from '../../redux/slices/wishlistSlice';

export default function ProductCard({ product }) {
  const dispatch = useDispatch(); const user = useSelector((state) => state.auth.user); const isWishlisted = useSelector((state) => state.wishlist.items.some((item) => item._id === product._id));
  const title = product.title || product.name; const image = product.images?.[0]?.url || product.image; const category = product.category?.name || product.category || 'Groceries'; const effectivePrice = product.discountPrice ?? product.price;
  const addToCart = async () => { if (!product.isAvailable) return toast.error('This product is unavailable'); if (!user) { dispatch(addItem({ ...product, name: title, image, price: effectivePrice })); return toast.success('Added to your cart'); } try { await dispatch(addRemoteItem({ productId: product._id })).unwrap(); toast.success('Added to your cart'); } catch (error) { toast.error(error); } };
  const toggleWishlist = async () => { if (!user) return toast.error('Sign in to save favourites'); try { await dispatch(isWishlisted ? removeWishlist(product._id) : addWishlist(product._id)).unwrap(); toast.success(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist'); } catch (error) { toast.error(error); } };
  return <motion.article layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200"><button onClick={toggleWishlist} className={`absolute right-3 top-3 z-10 rounded-full bg-white/95 p-2 shadow-sm ${isWishlisted ? 'text-red-500' : 'text-stone-500'}`} aria-label={isWishlisted ? `Remove ${title} from wishlist` : `Save ${title} to wishlist`}><Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} /></button><img src={image || 'https://placehold.co/600x400?text=FreshBasket'} alt={title} className="h-36 w-full object-cover" loading="lazy" />
    <div className="p-4"><p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{category}</p><h2 className="mt-1 truncate font-bold">{title}</h2><p className="mt-1 text-sm text-stone-500">{product.unit}</p><div className="mt-4 flex items-center justify-between"><span className="font-bold">₹{effectivePrice}</span><button onClick={addToCart} className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-2 text-sm font-bold text-white hover:bg-brand-700" aria-label={`Add ${title} to cart`}><Plus size={16} /> Add</button></div></div>
  </motion.article>;
}
