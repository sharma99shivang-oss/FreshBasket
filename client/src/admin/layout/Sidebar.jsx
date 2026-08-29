import {
  FiGrid,
  FiBox,
  FiShoppingBag,
  FiUsers,
  FiTag,
  FiArchive,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: FiGrid },
  { name: "Products", path: "/admin/products", icon: FiBox },
  { name: "Categories", path: "/admin/categories", icon: FiArchive },
  { name: "Orders", path: "/admin/orders", icon: FiShoppingBag },
  { name: "Users", path: "/admin/users", icon: FiUsers },
  { name: "Coupons", path: "/admin/coupons", icon: FiTag },
  { name: "Inventory", path: "/admin/inventory", icon: FiArchive },
  { name: "Settings", path: "/admin/settings", icon: FiSettings },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-green-700 text-white min-h-screen p-5 hidden lg:block">
      <h1 className="text-2xl font-bold mb-10">FreshBasket Admin</h1>

      <nav className="space-y-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-white text-green-700 font-semibold"
                  : "hover:bg-green-600"
              }`
            }
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <button className="flex items-center gap-3 mt-10 text-red-200 hover:text-white">
        <FiLogOut size={20} />
        Logout
      </button>
    </aside>
  );
}