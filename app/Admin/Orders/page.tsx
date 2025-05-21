"use client";

import { useEffect, useState } from "react";

interface Order {
  id: number;
  user_email: string;
  total_price: number;
  items: Array<{
    label: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  status: string;
  created_at: string;
}

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleCloseOrder = async (orderId: number) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/delete`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete order");
      }
      setOrders(orders.filter(order => order.id !== orderId));
    } catch (err) {
      alert("Failed to delete order. Please try again.");
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders/load");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error("Error loading orders:", err);
        setError("Failed to load orders. Please try again later.");
      }
    };

    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/update-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status. Please try again.");
    }
  };

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#454446] to-[#1d1d22] text-white px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Orders</h1>
      
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex w-full max-w-6xl flex-col md:flex-row gap-6 rounded-lg bg-white/10 p-6 shadow-lg relative"
        >
          {(order.status === 'accepted' || order.status === 'rejected') && (
            <button
              onClick={() => handleCloseOrder(order.id)}
              className="absolute top-2 right-2 text-white bg-black/40 hover:bg-black/70 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold"
              title="Close"
            >
              ×
            </button>
          )}
          <div className="flex flex-col flex-1 gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Order #{order.id}</h2>
              <span className={`px-3 py-1 rounded-full text-sm ${
                order.status === 'pending' ? 'bg-yellow-500' :
                order.status === 'accepted' ? 'bg-green-500' :
                'bg-red-500'
              }`}>
                {order.status.toUpperCase()}
              </span>
            </div>

            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 border-t border-white/20 pt-4">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="w-20 h-20 rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.label}</p>
                    <p className="text-gray-300">₱{item.price.toFixed(2)} × {item.quantity}</p>
                  </div>
                  <div className="font-bold">
                    ₱{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-right font-bold text-xl mt-4">
              Total: ₱{order.total_price.toFixed(2)}
            </div>
          </div>

          <div className="flex-1 rounded bg-white/20 p-4">
            <h3 className="text-2xl font-bold mb-4">Customer Details</h3>
            <p>
              <span className="font-semibold">Email:</span> {order.user_email}
            </p>
            <p>
              <span className="font-semibold">Order Date:</span>{" "}
              {new Date(order.created_at).toLocaleDateString()}
            </p>

            <div className="flex gap-4 mt-6">
              {order.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(order.id, 'accepted')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Accept Order
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(order.id, 'rejected')}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    Reject Order
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}
