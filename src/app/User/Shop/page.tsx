"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "~/app/context/CartContext";

interface Bouquet {
  id: number;
  label: string;
  image: string;
  price: number;
  flowers: { [key: string]: number };
  consumables: string[];
}

interface Row {
  id: number;
  title: string;
  items: Bouquet[];
}

export default function ShopPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    loadBouquets();
  }, []);

  const loadBouquets = async () => {
    try {
      const res = await fetch("/api/bouquets/load");
      if (!res.ok) throw new Error("Failed to fetch bouquets");
      const data = await res.json();
      setRows(data);
      setError(null);
    } catch (err) {
      console.error("Error loading bouquets:", err);
      setError("Failed to load bouquets. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (bouquet: Bouquet) => {
    addItem(bouquet);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="mb-8 text-3xl font-bold">Loading bouquets...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-8 text-3xl font-bold text-red-600">{error}</h1>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Preview Image Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Preview"
            className="max-h-[70%] max-w-[70%] rounded-lg shadow-lg"
          />
        </div>
      )}
    
      {/* Banner Section */}
      <section
        className="relative h-[200px] bg-cover bg-center opacity-90"
        style={{ backgroundImage: 'url("/Pictures/Banner-1.jpg")' }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Shop
          </h1>
          <p className="text-m text-white md:text-base">Home / Shop</p>
        </div>
      </section>

      {/* Main Container */}
      <div className="min-h-screen bg-gray-100 p-8 font-sans">
        <div className="mx-auto max-w-6xl">
          {/* Info Container */}
          <div className="mb-8 rounded-lg bg-white p-4 shadow-md">
            <p className="text-gray-800">
              All bouquets listed below are pre-made and ready for purchase.
              <br />
              Please refer to the{" "}
              <a
                href="/User/Contacts"
                className="text-blue-500 hover:underline"
              >
                Contacts page
              </a>{" "}
              if you are interested in a custom bouquet.
            </p>
          </div>

          {/* Row Mapping */}
          {rows.map((row) => (
            <div key={row.id} className="mb-12">
              {/* Row Title with semi-transparent background */}
              <div className="relative mb-6 overflow-hidden rounded-md text-center border-4 border-pink-600 bg-pink-600">
                {/* Background Image Layer */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-75"
                  style={{ backgroundImage: 'url("/Pictures/Banner-5.jpg")' }}
                  aria-hidden="true"
                />
                {/* Foreground Text */}
                <div className="font-bold text-2xl relative inline-block m-2 z-10 px-6 py-4 rounded bg-pink-600 text-white border-3 border-white">{row.title}</div>
              </div>

              {/* Bouquets Grid */}
              <div className="grid grid-cols-1 place-items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                {row.items.map((bouquet) => (
                  <div
                    key={bouquet.id}
                    className="w-[280px] rounded-lg bg-white shadow-md transition-transform hover:scale-105"
                  >
                    <div className="relative h-48 w-full">
                      
                      <Image
                        src={bouquet.image}
                        alt={bouquet.label}
                        fill
                        className="rounded-t-lg object-cover cursor-pointer"
                        onClick={() => setPreviewImage(bouquet.image)}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="mb-2 text-lg font-semibold">
                        {bouquet.label}
                      </h3>
                      <p className="mb-2 text-gray-600">
                        ₱{bouquet.price.toFixed(2)}
                      </p>
                    {/* Add to Cart Button */}
                    <button
                        onClick={() => handleAddToCart(bouquet)}
                        className="w-full rounded bg-pink-600 px-4 py-2 mb-5 text-white transition-colors hover:bg-pink-700"
                      >
                        Add to Cart
                      </button>
                      {/* Flowers List */}
                      <div className="mb-3">
                        <h4 className="text-sm font-medium">Flowers:</h4>
                        <ul className="text-sm text-gray-600">
                          {Object.entries(bouquet.flowers).map(
                            ([flower, quantity]) => (
                              <li key={flower}>
                                {flower} ({quantity})
                              </li>
                            ),
                          )}
                        </ul>
                      </div>

                      {/* Consumables List */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium">Includes:</h4>
                        <ul className="text-sm text-gray-600">
                          {bouquet.consumables.map((consumable) => (
                            <li key={consumable}>{consumable}</li>
                          ))}
                        </ul>
                      </div>

                      
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
