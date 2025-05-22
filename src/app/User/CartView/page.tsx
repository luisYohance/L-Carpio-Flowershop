"use client";

import { useCart } from "~/app/context/CartContext";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { UploadDialog } from "~/app/Admin/_components/uploadDialog";

export default function CartView() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const { user } = useUser();
  const router = useRouter();
  const [proofOfPayment, setProofOfPayment] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirmOrder = async () => {
    if (!proofOfPayment) {
      setError("Please upload a proof of payment");
      return;
    }

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
      const orderData = {
        userEmail: user.emailAddresses[0].emailAddress,
        totalPrice: total + 50,
        proofOfPayment,
        items: items.map((item) => ({
          id: item.id,
          label: item.label,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          flowers: item.flowers,
          consumables: item.consumables,
        })),
      };

      const response = await fetch("/api/orders/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.error || data.details || "Failed to save order";
        throw new Error(errorMessage);
      }

      alert(
        "Order placed successfully! You will be notified via email once it is accepted.",
      );
      clearCart();
      router.push("/User/Shop");
    } catch (error) {
      console.error("Error placing order:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to place order. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative h-[200px] bg-cover bg-center"
        style={{ backgroundImage: "url('/Pictures/Banner-1.jpg')" }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Your Cart
          </h1>
          <p className="text-m text-white md:text-base">Home / Cart</p>
        </div>
      </section>

      {/* Main Cart Section */}
      <div className="min-h-screen bg-zinc-100 p-10">
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="mb-6 text-2xl font-bold text-gray-800">
            Your Shopping Cart
          </h1>

          {items.length === 0 ? (
            <div className="rounded-lg border border-gray-200 p-8 text-center">
              <p className="mb-4 text-gray-600">Your cart is empty</p>
              <Link
                href="/User/Shop"
                className="inline-block rounded bg-pink-600 px-6 py-2 text-white hover:bg-pink-700"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
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
                              <p>
                                Flowers:{" "}
                                {Object.entries(item.flowers)
                                  .map(([name, qty]) => `${name} (${qty})`)
                                  .join(", ")}
                              </p>
                              <p>Includes: {item.consumables.join(", ")}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">₱{item.price.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item.id, parseInt(e.target.value))
                            }
                            className="w-16 rounded border border-gray-300 p-1 text-center"
                          />
                        </td>
                        <td className="px-6 py-4">
                          ₱{(item.price * item.quantity).toFixed(2)}
                        </td>
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

              {/* Cart Totals and QR Code Side-by-Side */}
              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Cart Totals */}
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
                    <span className="text-rose-500">
                      ₱{(total + 50).toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-4">
                    <span className="mb-2 block font-bold">
                      Upload Proof of Payment:
                    </span>
                    {proofOfPayment && (
                      <img
                        src={proofOfPayment}
                        alt="Proof of Payment"
                        className="mb-2 max-h-48 rounded border"
                      />
                    )}
                    <UploadDialog
                      onImageUpload={(url) => {
                        console.log("Uploaded image:", url);
                        setProofOfPayment(url);
                      }}
                    />
                  </div>

                  <button
                    onClick={handleConfirmOrder}
                    disabled={isSubmitting}
                    className={`mt-4 w-full py-2 font-semibold text-white ${
                      isSubmitting
                        ? "cursor-not-allowed bg-gray-400"
                        : "bg-rose-300 hover:bg-rose-400"
                    }`}
                  >
                    {isSubmitting ? "Processing..." : "Confirm Order"}
                  </button>
                </div>

                {/* QR Code Section */}
                <div className="rounded border border-gray-200 p-4 text-center shadow-sm">
                  <h2 className="mb-4 text-lg font-semibold text-gray-800">
                    Scan QR Code to Pay (GCash)
                  </h2>
                  <img
                    src="/Pictures/FakeQr-Code.jpg"
                    alt="Fake QR Code"
                    className="mx-auto max-h-64 rounded border"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
