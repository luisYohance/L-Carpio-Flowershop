"use client";

import { useEffect, useState } from "react";
import { UploadDialog } from "../_components/uploadDialog";

export default function FlowersPage() {
  const [flowerList, setFlowerList] = useState<
    { id: number; name: string; quantity: number; image: string }[]
  >([]);
  const [newFlower, setNewFlower] = useState({ name: "", quantity: 0 });
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
      const data = await res.json();
      alert(data.message);

      if (!res.ok) throw new Error("Failed to add flower");

      setNewFlower({ name: "", quantity: 0 });
      await loadFlowers();
    } catch (err) {
      console.error("Error adding flower:", err);
      alert("Failed to add flower. Please try again.");
    }
  };

  const changeImage = async (name: string, image: string) => {
    if (!name || !image) {
      alert("Please enter a valid flower name and quantity");
      return;
    }

    try {
      const res = await fetch("/api/flowers/changeImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name, image: image }),
      });
      const data = await res.json();
      alert(data.message);
      if (!res.ok) throw new Error("Failed to change image");
      await loadFlowers();
    } catch (err) {
      console.error("Error changing image:", err);
      alert("Failed to change image. Please try again.");
    }
  };

  const takeFlower = async () => {
    if (!newFlower.name || newFlower.quantity < 0) {
      alert("Please enter a valid flower name and quantity");
      return;
    }

    try {
      const res = await fetch("/api/flowers/take", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFlower),
      });
      const data = await res.json();
      alert(data.message);
      if (!res.ok) throw new Error("Failed to take flower");
      setNewFlower({ name: "", quantity: 0 });
      await loadFlowers();
    } catch (err) {
      console.error("Error taking flower:", err);
      alert("Failed to take flower. Please try again.");
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
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-red-600">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 bg-gradient-to-b from-[#454446] to-[#1d1d22] p-6 text-gray-900">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold text-white">
          Flower Management
        </h1>

        {/* Add new flower form */}
        <div className="mb-8 rounded-lg bg-gray-500 p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Add New Flower
          </h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={newFlower.name}
              onChange={(e) =>
                setNewFlower({ ...newFlower, name: e.target.value })
              }
              placeholder="Flower name"
              className="flex-1 rounded border bg-white p-2"
            />
            <input
              type="number"
              value={newFlower.quantity}
              onChange={(e) =>
                setNewFlower({ ...newFlower, quantity: Number(e.target.value) })
              }
              placeholder="Quantity"
              min="0"
              className="w-32 rounded border bg-white p-2"
            />
            <button
              onClick={addFlower}
              className="rounded bg-gray-700 px-4 py-2 font-semibold text-white hover:bg-green-800"
            >
              Add Flower
            </button>
            <button
              onClick={takeFlower}
              className="rounded bg-gray-700 px-4 py-2 font-semibold text-white hover:bg-green-800"
            >
              Take Flower
            </button>
          </div>
        </div>

        {/* Flower list */}
        <div className="rounded-lg bg-gray-500 p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-white">Flower List</h2>
          <div className="space-y-4">
            {flowerList.map((flower) => (
              <div
                key={flower.name}
                className="flex items-center justify-between rounded border bg-white p-4 hover:bg-gray-50"
              >
                <div>
                  <h3 className="font-medium">{flower.name}</h3>
                  <p className="text-gray-600">Quantity: {flower.quantity}</p>
                  <p className="text-gray-600">Image:</p>
                  <img
                    src={flower.image}
                    alt={`Image of ${flower.name}`}
                    className="h-20 w-20"
                  />
                </div>
                <button
                  onClick={() => deleteFlower(flower.name)}
                  className="rounded bg-gray-700 px-4 py-2 font-semibold text-white hover:bg-green-800"
                >
                  Delete
                </button>
                <UploadDialog
                  onImageUpload={(url) => {
                    console.log("Setting flower image to:", url);
                    changeImage(flower.name, url);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
