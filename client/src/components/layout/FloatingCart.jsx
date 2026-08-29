import { ShoppingBasket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCartCount } from '../../redux/slices/cartSlice';

export default function FloatingCart() {
  const count = useSelector(selectCartCount); if (!count) return null;
  return <Link to="/cart" className="fixed bottom-5 right-5 z-20 inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-3 font-bold text-white shadow-lg shadow-brand-700/25 sm:hidden"><ShoppingBasket size={19} /> Cart <span className="rounded-full bg-white px-1.5 text-xs text-brand-700">{count}</span></Link>;
}
