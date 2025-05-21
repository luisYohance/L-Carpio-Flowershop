// app/CartView/page.tsx
"use client";

import { useCart } from '~/app/context/CartContext';
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function CartView() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const { user } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirmOrder = async () => {
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      setError("Please sign in to place an order");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Log the data being sent
      const orderData = {
        userEmail: user.emailAddresses[0].emailAddress,
        totalPrice: total + 50, // Include shipping cost
        items: items.map(item => ({
          id: item.id,
          label: item.label,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          flowers: item.flowers,
          consumables: item.consumables
        })),
      };
      console.log('Sending order data:', JSON.stringify(orderData, null, 2));

      const response = await fetch("/api/orders/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      console.log('Server response:', JSON.stringify(data, null, 2));

      if (!response.ok) {
        const errorMessage = data.error || data.details || 'Failed to save order';
        console.error('Server error details:', data);
        throw new Error(errorMessage);
      }

      alert("Order placed successfully!");
      clearCart();
      router.push("/User/Shop");
    } catch (error) {
      console.error("Error placing order:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to place order. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white p-10">
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="mb-6 text-2xl font-bold text-gray-800">Your Shopping Cart</h1>
          <div className="rounded-lg border border-gray-200 p-8 text-center">
            <p className="mb-4 text-gray-600">Your cart is empty</p>
            <Link href="/User/Shop" className="inline-block rounded bg-pink-600 px-6 py-2 text-white hover:bg-pink-700">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-10">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Your Shopping Cart</h1>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-hidden border border-gray-200 shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-rose-200 text-gray-700">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Subtotal</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="flex items-center space-x-4 px-6 py-4">
                    <div className="relative h-16 w-16">
                      <Image
                        src={item.image}
                        alt={item.label}
                        fill
                        className="rounded object-cover"
                      />
                    </div>
                    <div>
                      <span className="font-medium">{item.label}</span>
                      <div className="mt-1 text-xs text-gray-500">
                        <p>Flowers: {Object.entries(item.flowers).map(([name, qty]) => `${name} (${qty})`).join(', ')}</p>
                        <p>Includes: {item.consumables.join(', ')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">₱{item.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="w-16 rounded border border-gray-300 p-1 text-center"
                    />
                  </td>
                  <td className="px-6 py-4">₱{(item.price * item.quantity).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded border border-gray-200 p-4 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold">Cart Totals</h2>
            <div className="flex justify-between py-1">
              <span>Subtotal:</span>
              <span>₱{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Shipping:</span>
              <span>₱50.00</span>
            </div>
            <div className="flex justify-between py-1 font-bold">
              <span>Total:</span>
              <span className="text-rose-500">₱{(total + 50).toFixed(2)}</span>
            </div>
            <button
              onClick={handleConfirmOrder}
              disabled={isSubmitting}
              className={`mt-4 w-full py-2 font-semibold text-white ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-rose-300 hover:bg-rose-400'
              }`}
            >
              {isSubmitting ? 'Processing...' : 'Confirm Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
