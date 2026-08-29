import { Link } from 'react-router-dom';
import { ShoppingBasket } from 'lucide-react';

export function Field({ label, error, children }) {
  return <label className="block text-sm font-semibold text-stone-700"><span>{label}</span>{children}{error && <span className="mt-1 block text-xs font-medium text-red-600">{error.message}</span>}</label>;
}

export default function AuthShell({ title, subtitle, children, footer }) {
  return <section className="mx-auto flex min-h-[calc(100vh-9.5rem)] max-w-md items-center py-8"><div className="w-full rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200 sm:p-8"><Link to="/" className="inline-flex items-center gap-2 text-lg font-bold text-brand-700"><ShoppingBasket size={23} /> FreshBasket</Link><h1 className="mt-6 text-3xl font-bold tracking-tight">{title}</h1><p className="mt-2 text-sm text-stone-500">{subtitle}</p>{children}<p className="mt-6 text-center text-sm text-stone-600">{footer}</p></div></section>;
}

export const inputClass = 'mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-3 text-base outline-none transition placeholder:text-stone-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-100';
