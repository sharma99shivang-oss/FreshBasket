import { FiBell, FiSearch, FiMenu } from "react-icons/fi";

export default function Header() {
  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button className="lg:hidden">
          <FiMenu size={24} />
        </button>

        <h2 className="text-xl font-semibold text-gray-700">
          Admin Dashboard
        </h2>
      </div>

      <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-80">
        <FiSearch className="text-gray-500" />

        <input
          type="text"
          placeholder="Search products..."
          className="bg-transparent outline-none ml-2 w-full"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative">
          <FiBell size={22} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
            3
          </span>
        </button>

        <div className="flex items-center gap-2">
          <img
            src="https://i.pravatar.cc/40"
            alt="Admin"
            className="rounded-full w-10 h-10"
          />

          <div className="hidden md:block">
            <p className="font-medium">Admin</p>
            <p className="text-xs text-gray-500">FreshBasket</p>
          </div>
        </div>
      </div>
    </header>
  );
}