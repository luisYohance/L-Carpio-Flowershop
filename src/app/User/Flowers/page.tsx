'use client';
import React, { useEffect, useState } from "react";

export default function FlowerPage() {
  const [flowerList, setFlowerList] = useState<{ id: number; name: string; quantity: number }[]>([]);
  const [newFlower, setNewFlower] = useState({ name: '', quantity: 0 });
  const [error, setError] = useState<string | null>(null);

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
  }

  if (flowerList===null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <section
        className="relative mb-12 h-[200px] bg-cover bg-center opacity-90"
        style={{ backgroundImage: "url('/Pictures/Banner-1.jpg')" }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Flowers
          </h1>
          <p className="text-m text-white md:text-base">User / Flowers</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl p-6">
        <p className="text-gray-800 m-2">Lcarpio's Flowershop has a wide array of flowers in stock. 
          <br />
          Please refer to this page when considering the availability of your order.
          <br />
          <br />
          Listed below are the flowers and their current stock.
        </p>
        <table className="w-full border-collapse border border-black">
  <thead>
    <tr>
      <th className="bg-gray-400 p-2">Flower</th>
      <th className="bg-gray-400 p-2">Quantity</th>
    </tr>
  </thead>
  <tbody>
    {flowerList.map(({ id, name, quantity }) => (
      <tr key={id}>
        <td className="font-semibold bg-gray-300 p-4 border border-black">{name}</td>
        <td className="bg-gray-300 p-4 border border-black">{quantity} in stock</td>
      </tr>
    ))}
  </tbody>
</table>
          
      </div>
    </div>
  );
}
