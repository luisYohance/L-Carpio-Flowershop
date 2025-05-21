"use client";

import { LogOut, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "~/app/context/CartContext";

export function Header() {
  const { total } = useCart();

  return (
    <header className="w-full bg-zinc-50 px-4 py-4">
      <div className="flex items-center justify-between">
        {/* Left Spacer */}
        <div className="w-1/3 items-center justify-start" />

        {/* Center Logo */}
        <div className="rounded-m flex w-1/3 justify-center">
          <img
            src="/Pictures/Lcarpio-logo.jpg"
            alt="Logo"
            className="h-20 object-contain"
          />
        </div>

        {/* Right Section */}
        <div className="flex w-1/3 items-center justify-end space-x-10">
          {/* Cart Link */}
          <Link href="/User/CartView" className="flex items-center space-x-2">
            <div className="rounded-full bg-rose-300 p-2 text-white">
              <ShoppingBag size={16} />
            </div>
            <div className="text-left text-sm">
              <p className="text-m font-bold text-gray-600">Your cart:</p>
              <p className="font-semibold">₱{total.toFixed(2)}</p>
            </div>
          </Link>

          <LogOut />
        </div>
      </div>
    </header>
  );
}
