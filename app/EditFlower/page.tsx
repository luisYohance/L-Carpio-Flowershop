"use client";

import { useState } from "react";
// import { UploadImageButton } from "../UploadImageButton";
// TODO: Uncomment and fix the import path below if UploadImageButton exists elsewhere
// import { UploadImageButton } from "../components/UploadImageButton";
// import { UploadDialog } from "../UploadDialog"; // Removed because module not found

export default function BouquetBuilder() {
  const [flowers, setFlowers] = useState<{ [name: string]: number }>({});
  const [consumables, setConsumables] = useState<{ [name: string]: number }>({});
  const [flower, setFlower] = useState("");
  const [flowerQty, setFlowerQty] = useState(1);

  const [consumable, setConsumable] = useState("");
  const [consumableQty, setConsumableQty] = useState(1);

  const [occasion, setOccasion] = useState("");
  const [price, setPrice] = useState("350 Pesos");
  const [doNotDisplay, setDoNotDisplay] = useState(false);

  const handleAddFlower = () => {
    if (flower && flowerQty > 0) {
      setFlowers((prev) => ({
        ...prev,
        [flower]: (prev[flower] || 0) + flowerQty,
      }));
    }
  };

  const handleRemoveFlower = (name: string) => {
    const updated = { ...flowers };
    delete updated[name];
    setFlowers(updated);
  };

  const handleAddConsumable = () => {
    if (consumable && consumableQty > 0) {
      setConsumables((prev) => ({
        ...prev,
        [consumable]: (prev[consumable] || 0) + consumableQty,
      }));
    }
  };

  const handleRemoveConsumable = (name: string) => {
    const updated = { ...consumables };
    delete updated[name];
    setConsumables(updated);
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#454446] to-[#1d1d22] text-white">
      <div className="container max-w-2xl flex flex-col gap-8 px-4 py-16">
        <h1 className="text-4xl font-bold text-center">Create Bouquet</h1>

        <div className="h-48 border-2 border-dashed border-gray-400 flex flex-col items-center justify-center rounded bg-white/10 gap-2 p-4">
          <span className="text-gray-300">Drag or Add Pictures</span>
          {/* <UploadImageButton /> */}
          {/* <UploadDialog /> */}
        </div>

        {/* Flower selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Flowers</label>
            <select
              value={flower}
              onChange={(e) => setFlower(e.target.value)}
              className="w-full rounded bg-white/20 px-2 py-1 text-white text-sm"
            >
              <option value="">Select Flower</option>
              <option value="Rose">Rose</option>
              <option value="Lily">Lily</option>
            </select>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={flowerQty}
              onChange={(e) => setFlowerQty(Number(e.target.value))}
              className="w-full rounded bg-white/20 px-2 py-1 text-white text-sm"
              placeholder="Qty"
            />
            <button
              onClick={handleAddFlower}
              className="px-3 py-1 bg-gray-700 rounded"
            >
              +
            </button>
          </div>
        </div>

        {/* Show added flowers */}
        {Object.entries(flowers).length > 0 && (
          <div>
            <label className="block mb-1 text-sm font-medium">Added Flowers</label>
            {Object.entries(flowers).map(([name, qty]) => (
              <div key={name} className="flex justify-between items-center text-sm my-1">
                <span>{name} x{qty}</span>
                <button
                  onClick={() => handleRemoveFlower(name)}
                  className="text-red-400 font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Consumable selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Consumables</label>
            <select
              value={consumable}
              onChange={(e) => setConsumable(e.target.value)}
              className="w-full rounded bg-white/20 px-2 py-1 text-white text-sm"
            >
              <option value="">Select Item</option>
              <option value="Ribbon">Ribbon</option>
              <option value="Wrapper">Wrapper</option>
            </select>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={consumableQty}
              onChange={(e) => setConsumableQty(Number(e.target.value))}
              className="w-full rounded bg-white/20 px-2 py-1 text-white text-sm"
              placeholder="Qty"
            />
            <button
              onClick={handleAddConsumable}
              className="px-3 py-1 bg-gray-700 rounded"
            >
              +
            </button>
          </div>
        </div>

        {/* Show added consumables */}
        {Object.entries(consumables).length > 0 && (
          <div>
            <label className="block mb-1 text-sm font-medium">Added Consumables</label>
            {Object.entries(consumables).map(([name, qty]) => (
              <div key={name} className="flex justify-between items-center text-sm my-1">
                <span>{name} x{qty}</span>
                <button
                  onClick={() => handleRemoveConsumable(name)}
                  className="text-red-400 font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Occasion */}
        <div>
          <label className="block mb-1 text-sm font-medium">Choose Occasion</label>
          <select
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            className="w-full rounded bg-white/20 px-2 py-1 text-white text-sm"
          >
            <option value="">Select Occasion</option>
            <option value="Funeral">For Funeral</option>
            <option value="Wedding">For Wedding</option>
          </select>
        </div>

        {/* Price and Save */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Price:</span>
            <input
              type="text"
              value={price}
              readOnly
              className="w-32 rounded bg-white/20 px-2 py-1 text-white text-sm"
            />
          </div>
          <button
            className="rounded bg-black px-4 py-2 text-sm hover:bg-gray-800"
            onClick={() => {
              alert(
                `Saved:\nFlowers: ${JSON.stringify(flowers)}\nConsumables: ${JSON.stringify(consumables)}\nOccasion: ${occasion}\nDo Not Display: ${doNotDisplay}`
              );
            }}
          >
            Save
          </button>
        </div>

        {/* Do not display checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="hideDisplay"
            checked={doNotDisplay}
            onChange={(e) => setDoNotDisplay(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="hideDisplay" className="text-sm">
            Do not display
          </label>
        </div>
      </div>
    </main>
  );
}
