'use client';

import { useEffect, useState } from "react";
import { flowers } from "~/server/db/schema";
import { db } from "~/server/db";

export default function FlowersPage() {
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
  };

  const addFlower = async () => {
    if (!newFlower.name || newFlower.quantity < 0) {
      alert("Please enter a valid flower name and quantity");
      return;
    }

    try {
      const res = await fetch("/api/flowers/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFlower),
      });

      if (!res.ok) throw new Error("Failed to add flower");
      
      setNewFlower({ name: '', quantity: 0 });
      await loadFlowers();
    } catch (err) {
      console.error("Error adding flower:", err);
      alert("Failed to add flower. Please try again.");
    }
  };

  const deleteFlower = async (name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      const res = await fetch("/api/flowers/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Failed to delete flower");
      
      await loadFlowers();
    } catch (err) {
      console.error("Error deleting flower:", err);
      alert("Failed to delete flower. Please try again.");
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
    <div className="flex h-screen bg-gray-100 text-gray-900 p-6">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Flower Management</h1>
        
        {/* Add new flower form */}
        <div className="bg-gray-500 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-white text-xl font-semibold mb-4">Add New Flower</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={newFlower.name}
              onChange={(e) => setNewFlower({ ...newFlower, name: e.target.value })}
              placeholder="Flower name"
              className="flex-1 p-2 border rounded bg-white"
            />
            <input
              type="number"
              value={newFlower.quantity}
              onChange={(e) => setNewFlower({ ...newFlower, quantity: Number(e.target.value) })}
              placeholder="Quantity"
              min="0"
              className="w-32 p-2 border rounded bg-white"
            />
            <button
              onClick={addFlower}
              className="bg-gray-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded"
            >
              Add Flower
            </button>
          </div>
        </div>

        {/* Flower list */}
        <div className="bg-gray-500 p-6 rounded-lg shadow-md">
          <h2 className="text-white text-xl font-semibold mb-4">Flower List</h2>
          <div className="space-y-4">
            {flowerList.map((flower) => (
              <div
                key={flower.name}
                className="bg-white flex items-center justify-between p-4 border rounded hover:bg-gray-50"
              >
                <div>
                  <h3 className="font-medium">{flower.name}</h3>
                  <p className="text-gray-600">Quantity: {flower.quantity}</p>
                </div>
                <button
                  onClick={() => deleteFlower(flower.name)}
                  className="bg-gray-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 