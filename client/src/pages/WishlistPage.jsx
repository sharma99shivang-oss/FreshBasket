import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import ProductCard from '../components/products/ProductCard';
import { fetchWishlist } from '../redux/slices/wishlistSlice';

export default function WishlistPage() {
  const dispatch = useDispatch(); const { items, status } = useSelector((state) => state.wishlist); const user = useSelector((state) => state.auth.user);
  useEffect(() => { if (user) dispatch(fetchWishlist()); }, [dispatch, user]);
  if (!user) return <section className="py-20 text-center"><Heart className="mx-auto text-brand-600" size={36} /><h1 className="mt-4 text-3xl font-bold">Save your favourites</h1><p className="mt-2 text-stone-500">Sign in to build a wishlist across all your devices.</p><Link to="/login" className="mt-6 inline-block rounded-xl bg-brand-600 px-5 py-3 font-bold text-white">Sign in</Link></section>;
  return <section><h1 className="text-3xl font-bold">My wishlist</h1>{status === 'loading' && <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-64 animate-pulse rounded-2xl bg-stone-200" />)}</div>}{status !== 'loading' && !items.length && <div className="py-20 text-center"><Heart className="mx-auto text-stone-300" size={40} /><p className="mt-4 text-stone-500">Your wishlist is waiting for something fresh.</p><Link to="/" className="mt-5 inline-block font-bold text-brand-700">Browse groceries</Link></div>}{items.length > 0 && <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{items.map((product) => <ProductCard key={product._id} product={product} />)}</div>}</section>;
}
