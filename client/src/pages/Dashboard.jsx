import {
  FiShoppingCart,
  FiUsers,
  FiDollarSign,
  FiBox,
} from "react-icons/fi";

const stats = [
  {
    title: "Revenue",
    value: "₹85,430",
    icon: FiDollarSign,
    color: "bg-green-500",
  },
  {
    title: "Orders",
    value: "245",
    icon: FiShoppingCart,
    color: "bg-blue-500",
  },
  {
    title: "Users",
    value: "138",
    icon: FiUsers,
    color: "bg-purple-500",
  },
  {
    title: "Products",
    value: "82",
    icon: FiBox,
    color: "bg-orange-500",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-700">
        Welcome Admin 👋
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-xl shadow p-5 flex justify-between items-center"
          >
            <div>
              <p className="text-gray-500">{item.title}</p>
              <h2 className="text-2xl font-bold mt-2">{item.value}</h2>
            </div>

            <div className={`${item.color} p-3 rounded-full text-white`}>
              <item.icon size={28} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow p-6 h-80 flex items-center justify-center text-gray-400 text-xl">
        Revenue Chart Coming Next Lesson
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold text-lg mb-4">Recent Orders</h2>

        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3">Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b">
              <td className="py-4">#FB001</td>
              <td>Shivang Sharma</td>
              <td>₹560</td>
              <td>
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                  Pending
                </span>
              </td>
            </tr>

            <tr>
              <td className="py-4">#FB002</td>
              <td>Rahul Verma</td>
              <td>₹870</td>
              <td>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  Delivered
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}