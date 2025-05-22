"use client";
import React, { useEffect, useState } from "react";

export default function FlowerPage() {
  const [flowerList, setFlowerList] = useState<
    { id: number; name: string; quantity: number; image: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    loadFlowers();
  }, []);

  const loadFlowers = async () => {
    try {
      const res = await fetch("/api/flowers/load");
      if (!res.ok) throw new Error("Failed to fetch flowers");
      const data = await res.json();
      setFlowerList(data);
    } catch (err) {
      console.error("Error loading flowers:", err);
      setError("Failed to load flowers. Please try again later.");
    }
  };

  if (!flowerList.length && !error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-200">
        <p className="text-lg font-medium">Loading flowers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-200">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100">
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

      {/* Banner */}
      <section
        className="relative mb-12 h-[200px] bg-cover bg-center opacity-90"
        style={{ backgroundImage: "url('/Pictures/Banner-1.jpg')" }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Flowers
          </h1>
          <p className="text-m text-white md:text-base">Home / Flowers</p>
        </div>
      </section>

      {/* Info & Table */}
      <div className="mx-auto max-w-5xl p-6">
        <div className="mb-8 rounded-lg bg-zinc-100 p-4 shadow-md">
          <p className="text-gray-800">
            Lcarpio's Flowershop has a wide array of flowers in stock.
            <br />
            Please refer to this page when considering the availability of your
            order.
            <br />
            <br />
            Listed below are the flowers and their current stock.
          </p>
        </div>

        <table className="w-full border-collapse border border-black">
          <thead>
            <tr>
              <th className="bg-gray-400 p-2">Flower</th>
              <th className="bg-gray-400 p-2">Quantity</th>
              <th className="bg-gray-400 p-2">
                Preview Example <br />
                (click the image to preview.)
              </th>
            </tr>
          </thead>
          <tbody>
            {flowerList.map(({ id, name, quantity, image }) => (
              <tr key={id}>
                <td className="border border-black bg-gray-200 p-4 font-semibold">
                  {name}
                </td>
                <td className="border border-black bg-gray-200 p-4">
                  {quantity} in stock
                </td>
                <td className="border border-black bg-gray-200 p-4">
                  <div className="flex items-center justify-center">
                    <img
                      src={image}
                      alt={name}
                      className="h-20 w-20 cursor-pointer rounded-md object-cover transition hover:scale-105"
                      onClick={() => setPreviewImage(image)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
