import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from './components/layout/Header';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import CategoryManagementPage from './pages/admin/CategoryManagementPage';
import ProductManagementPage from './pages/admin/ProductManagementPage';
import WishlistPage from './pages/WishlistPage';
import AddressesPage from './pages/AddressesPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import OrderManagementPage from './pages/admin/OrderManagementPage';
import DashboardPage from './pages/admin/DashboardPage';
import InventoryPage from './pages/admin/InventoryPage';
import CouponsPage from './pages/admin/CouponsPage';
import BannersPage from './pages/admin/BannersPage';
import UsersPage from './pages/admin/UsersPage';
import FloatingCart from './components/layout/FloatingCart';
import { fetchCart } from './redux/slices/cartSlice';
import { clearWishlist, fetchWishlist } from './redux/slices/wishlistSlice';
import AdminLoginPage from './pages/admin/AdminLoginPage';

export default function App() {
  const dispatch = useDispatch(); const { user, initialized } = useSelector((state) => state.auth);
  useEffect(() => { if (!initialized) return; if (user) { dispatch(fetchCart()); dispatch(fetchWishlist()); } else dispatch(clearWishlist()); }, [dispatch, initialized, user]);
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/addresses" element={<ProtectedRoute><AddressesPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminLayout /></ProtectedRoute>}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductManagementPage />} />
            <Route path="categories" element={<CategoryManagementPage />} />
            <Route path="orders" element={<OrderManagementPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="coupons" element={<CouponsPage />} />
            <Route path="banners" element={<BannersPage />} />
            <Route path="users" element={<UsersPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <FloatingCart />
    </div>
  );
}
