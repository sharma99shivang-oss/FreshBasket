import {
  Heart,
  LogOut,
  MapPin,
  Package,
  ShoppingBasket,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import { selectCartCount } from "../../redux/slices/cartSlice";
import { logoutUser } from "../../redux/slices/authSlice";
import { clearWishlist } from "../../redux/slices/wishlistSlice";

export default function Header() {
  const dispatch = useDispatch();

  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector(
    (state) => state.wishlist.items.length
  );
  const user = useSelector((state) => state.auth.user);

  const signOut = async () => {
    const result = await dispatch(logoutUser());

    dispatch(clearWishlist());

    if (logoutUser.fulfilled.match(result)) {
      toast.success("Signed out successfully");
    } else {
      toast.error(result.payload || "Signed out locally");
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-brand-700"
        >
          <ShoppingBasket size={24} />
          FreshBasket
        </Link>

        {/* Right Menu */}
        <div className="flex items-center gap-3 text-sm font-semibold text-stone-600 sm:gap-5">
          {/* Shop */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "text-brand-700" : "hover:text-brand-700"
            }
          >
            Shop
          </NavLink>

          {user && (
            <>
              {/* Wishlist */}
              <NavLink
                to="/wishlist"
                className="relative hover:text-brand-700"
              >
                <Heart
                  size={20}
                  fill={wishlistCount > 0 ? "currentColor" : "none"}
                />

                {wishlistCount > 0 && (
                  <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white">
                    {wishlistCount}
                  </span>
                )}
              </NavLink>

              {/* Orders */}
              <NavLink to="/orders" className="hover:text-brand-700">
                <Package size={20} />
              </NavLink>

              {/* Addresses */}
              <NavLink
                to="/addresses"
                className="hidden hover:text-brand-700 sm:block"
              >
                <MapPin size={20} />
              </NavLink>
            </>
          )}

          {/* Cart */}
          <NavLink
            to="/cart"
            className="relative flex items-center gap-1 hover:text-brand-700"
          >
            <ShoppingBasket size={20} />

            <span className="hidden sm:inline">Cart</span>

            {cartCount > 0 && (
              <span className="rounded-full bg-brand-600 px-1.5 py-0.5 text-xs text-white">
                {cartCount}
              </span>
            )}
          </NavLink>

          {/* User Section */}
          {user ? (
            <>
              {/* Username */}
              <span className="hidden max-w-28 truncate sm:inline">
                Hi, {user.name.split(" ")[0]}
              </span>

              {/* Logout */}
              <button
                onClick={signOut}
                className="flex items-center gap-1 hover:text-brand-700"
                aria-label="Logout"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "text-brand-700" : "hover:text-brand-700"
              }
            >
              Sign in
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}