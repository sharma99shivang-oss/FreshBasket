import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ShieldCheck } from "lucide-react";

import { loginUser } from "../../redux/slices/authSlice";

export default function AdminLoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, status } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Already logged in as admin
  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

 const submit = async (values) => {
  const result = await dispatch(loginUser(values));

  if (loginUser.fulfilled.match(result)) {
    // Redux payload se logged-in user nikalo
    const loggedUser = result.payload.data.user;

    if (loggedUser.role === "admin") {
      toast.success("Welcome Admin!");
      navigate("/admin"); // Admin dashboard open
    } else {
      toast.error("Access denied! This is not an admin account.");
      navigate("/"); // Customer ko home bhej do
    }
  } else {
    toast.error(result.payload || "Login failed");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-200 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-green-100 p-4 rounded-full mb-4">
            <ShieldCheck className="text-green-700" size={40} />
          </div>

          <h1 className="text-3xl font-bold text-green-700">
            FreshBasket Admin
          </h1>

          <p className="text-gray-500 mt-2 text-center">
            Sign in to manage products, orders and inventory.
          </p>
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Admin Email
            </label>

            <input
              type="email"
              placeholder="admin@freshbasket.com"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              {...register("email", {
                required: "Email is required",
              })}
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              {...register("password", {
                required: "Password is required",
              })}
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            disabled={status === "loading"}
            className="w-full rounded-xl bg-green-700 py-3 text-white font-bold hover:bg-green-800 transition"
          >
            {status === "loading" ? "Signing in..." : "Login as Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}