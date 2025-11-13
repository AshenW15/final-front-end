import { useEffect, useState } from 'react';

interface Order {
  id: number;
  order_number: string;
  customer: string;
  date: string;
  amount: number;
  status: string;
}

const Orders = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [orders, setOrders] = useState<Order[]>([]);
 

  useEffect(() => {
    fetch(`${baseUrl}/getAllOrders.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setOrders(res.orders);
      })
      .catch((err) => console.error(err));
  }, [baseUrl]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Orders</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Order List</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Order ID</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Date</th>
              <th className="p-2">Total</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id}>
                  <td className="p-2">{order.order_number}</td>
                  <td className="p-2">{order.customer}</td>
                  <td className="p-2">{order.date}</td>
                  <td className="p-2">Rs.{order.amount}</td>
                  <td
                    className={`p-2 ${
                      order.status === 'Delivered' ? 'text-green-500' : 'text-yellow-500'
                    }`}
                  >
                    {order.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-2 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
