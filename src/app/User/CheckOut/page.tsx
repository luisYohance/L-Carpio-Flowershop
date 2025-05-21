"use client";

import { useState } from "react";

export default function CheckoutPage() {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="bg-zinc-100 font-sans text-[#333]">
      {/* Hero Section */}
      <section
        className="relative h-[200px] bg-cover bg-center opacity-90"
        style={{ backgroundImage: "url('/Pictures/Banner-1.jpg')" }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Check Out
          </h1>
          <p className="text-m text-white md:text-base">Home / Checkout</p>
        </div>
      </section>

      {/* Checkout Form */}
      <div className="min-h-screen bg-white px-4 py-12 text-gray-800">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-md">
          <h1 className="mb-6 text-3xl font-bold text-[#7a9459]">Checkout</h1>

          <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <input
              type="text"
              placeholder="Full Name*"
              className="rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-[#7a9459]"
            />
            <input
              type="tel"
              placeholder="Phone Number*"
              className="rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-[#7a9459]"
            />
            <input
              type="email"
              placeholder="Email*"
              className="rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-[#7a9459]"
            />
            <input
              type="text"
              placeholder="City*"
              className="rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-[#7a9459]"
            />
            <textarea
              placeholder="Full Address*"
              rows={3}
              className="rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-[#7a9459] md:col-span-2"
            />
            <textarea
              placeholder="Order Notes (Optional)"
              rows={2}
              className="rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-[#7a9459] md:col-span-2"
            />
          </div>

          <div className="grid items-start gap-8 md:grid-cols-2">
            <div className="flex justify-center">
              <img
                src="/qr-code.png"
                alt="QR Code"
                className="h-48 w-48 object-contain"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Upload Payment Receipt*
              </label>
              <input
                type="file"
                accept="image/*"
                className="block w-full rounded-md border border-dashed border-gray-400 p-2"
              />
            </div>
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => setShowConfirm(true)}
              className="rounded-lg bg-[#f6a29d] px-8 py-3 font-semibold text-white hover:bg-[#e69087]"
            >
              Checkout
            </button>
          </div>
        </div>

        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="max-w-sm rounded-lg bg-white p-6 text-center shadow-lg">
              <h3 className="mb-4 text-lg font-semibold">Confirm Checkout?</h3>
              <p className="mb-6 text-sm text-gray-600">
                Are you sure you want to place this order?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    alert("Order Confirmed!");
                  }}
                  className="rounded bg-[#7a9459] px-4 py-2 text-white hover:bg-[#6d874f]"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
