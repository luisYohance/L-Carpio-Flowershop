'use client';
import { useEffect, useState } from "react";
import { type Row, bouquetRows } from "../../../bouquetRows";
import { inventory } from "../../../inventory";
import { UploadDialog } from "../../_components/uploadDialog";
import { useSearchParams } from "next/navigation";

export default function EditPage() {
  const searchParams = useSearchParams();
  const rowIndex = Number(searchParams.get('rowIndex'));
  const itemIndex = Number(searchParams.get('itemIndex'));

  const [rows, updateRows] = useState<Row[] | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [tempImage, setTempImage] = useState<string>("");
  const [tempLabel, setTempLabel] = useState<string | null>(null);
  const [tempFlowers, setTempFlowers] = useState<{ [key: string]: number }>({});
  const [tempConsumables, setTempConsumables] = useState<string[]>([]);
  const [checked, setChecked] = useState<boolean>(false);
  const [selectedFlower, setSelectedFlower] = useState<string | null>(null);
  const [selectedConsumable, setSelectedConsumable] = useState<string | null>(null);
  const [bouquetId, setBouquetId] = useState<number | null>(null);

  useEffect(() => {
    // Initialize rows from localStorage only once
    const storedRows = localStorage.getItem("bouquetRows");
    if (storedRows && !rows) {
      const parsedRows = JSON.parse(storedRows);
      updateRows(parsedRows);
    }
  }, []); // Empty dependency array - only run once on mount

  useEffect(() => {
    async function loadBouquet() {
      try {
        if (!rows) {
          console.error('Rows not loaded yet');
          return;
        }

        const currentItem = rows[rowIndex]?.items[itemIndex];
        console.log('Loading bouquet for item:', currentItem);
        
        if (!currentItem?.id) {
          console.error('No bouquet ID found for item:', currentItem);
          return;
        }

        const rowId = rows[rowIndex]?.id;
        if (!rowId) {
          console.error('No row ID found for row:', rowIndex);
          return;
        }

        console.log('Fetching bouquet with IDs:', { rowId, bouquetId: currentItem.id });

        const res = await fetch(`/api/bouquets/get?rowId=${rowId}&bouquetId=${currentItem.id}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(`Failed to fetch bouquet: ${errorData.error || res.statusText}`);
        }
        
        const data = await res.json();
        console.log('Loaded bouquet data:', data);
        
        if (!data.id) {
          console.error('No ID in loaded bouquet data:', data);
          return;
        }

        setBouquetId(data.id);
        setTempPrice(data.price);
        setTempImage(data.image);
        setTempLabel(data.label);
        setTempFlowers(data.flowers || {});
        setTempConsumables(data.consumables || []);
        setSelectedFlower(Object.keys(inventory.flowers)[0] ?? null);
        setSelectedConsumable(inventory.consumables[0] ?? null);
      } catch (err) {
        console.error("Error loading bouquet:", err);
        alert("Failed to load bouquet data");
      }
    }

    if (rows && rowIndex >= 0 && itemIndex >= 0) {
      loadBouquet();
    }
  }, [rowIndex, itemIndex, rows]); // Only depend on these values

  // Set up the onChange listener once
  useEffect(() => {
    bouquetRows.onChange(updateRows);
    return () => {
      // Clean up the listener if needed
      bouquetRows.onChange(() => {});
    };
  }, []); // Empty dependency array - only run once on mount

  if (!rows) return null;

  const handleSave = async () => {
    try {
      console.log('Current bouquet state:', {
        bouquetId,
        tempLabel,
        tempImage,
        tempPrice,
        tempFlowers,
        tempConsumables
      });

      if (!bouquetId) {
        console.error('No bouquet ID found in state');
        alert("No bouquet ID found. Please try refreshing the page.");
        return;
      }

      const res = await fetch("/api/bouquets/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: bouquetId,
          label: tempLabel ?? "Sample Bouquet",
          image: tempImage,
          price: tempPrice,
          flowers: tempFlowers,
          consumables: tempConsumables,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Failed to update bouquet: ${errorData.error || res.statusText}`);
      }

      // Update local state
      const newRows = [...bouquetRows.value];
      const currentItem = newRows[rowIndex].items[itemIndex];
      currentItem.label = tempLabel ?? "Sample Bouquet";
      currentItem.image = tempImage;
      currentItem.price = tempPrice;
      currentItem.flowers = tempFlowers;
      currentItem.consumables = tempConsumables;
      currentItem.doNotDisplay = checked;
      bouquetRows.set(newRows);

      alert("Saved changes!");
    } catch (err) {
      console.error("Error saving bouquet:", err);
      alert("Failed to save changes");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#454446] to-[#1d1d22] text-white">
      <div className="container max-w-2xl flex flex-col gap-8 px-4 py-16">
        <h1 className="text-4xl font-bold text-center">Edit Bouquet</h1>

        {/* Image Upload */}
        <div className="h-48 border-2 border-dashed border-gray-400 flex flex-col items-center justify-center rounded bg-white/10 gap-2 p-4">
          {tempImage ? (
            <div className="relative w-full h-full">
              <img
                src={tempImage}
                alt="Bouquet"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <span className="text-gray-300">Drag or Add Pictures</span>
          )}
          <UploadDialog 
            onImageUpload={(url) => {
              console.log('Setting temp image to:', url);
              setTempImage(url);
            }} 
          />
        </div>

        {/* Label */}
        <div>
          <label className="block mb-1 text-sm font-medium">Label</label>
          <input
            type="text"
            value={tempLabel ?? ""}
            onChange={(e) => setTempLabel(e.target.value)}
            className="w-full rounded bg-zinc-600 px-2 py-1 text-white text-sm"
            placeholder="Bouquet Label"
          />
        </div>

        {/* Flowers Section */}
        <div className="grid grid-cols-2 gap-4">
          {/* Existing Flowers */}
          <div>
            <label className="block mb-1 text-sm font-medium">Flowers</label>
            {Object.entries(tempFlowers).map(([key, value]) => (
              <div key={key}>
                <label className="block mb-1 text-sm font-medium">{key}</label>
                <div className="flex">
                  <input
                    type="number"
                    min="0"
                    value={value}
                    onChange={(e) => {
                      const newVal = Number(e.target.value);
                      setTempFlowers({ ...tempFlowers, [key]: newVal });
                    }}
                    className="w-full rounded bg-zinc-600 px-2 py-1 text-white text-sm"
                    placeholder="Qty"
                  />
                  <button
                    className="w-10 mx-2 bg-gray-700 font-bold"
                    onClick={() => {
                      const { [key]: _, ...rest } = tempFlowers;
                      setTempFlowers(rest);
                    }}
                  >╳</button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Flower */}
          <div>
            <label className="block mb-1 text-sm font-medium">Add Flower</label>
            <div className="flex">
              <select
                value={selectedFlower ?? ""}
                onChange={(e) => setSelectedFlower(e.target.value)}
                className="w-full rounded bg-zinc-600 px-2 py-1 text-white text-sm"
              >
                {Object.keys(inventory.flowers).map((flower, index) => (
                  <option key={index} value={flower}>{flower}</option>
                ))}
              </select>
              <button
                className="w-10 mx-2 bg-gray-700 font-bold"
                onClick={() => {
                  if (selectedFlower) {
                    setTempFlowers({ ...tempFlowers, [selectedFlower]: (tempFlowers[selectedFlower] || 0) + 1 });
                  }
                }}
              >+</button>
            </div>
          </div>
        </div>

        {/* Consumables Section */}
        <div className="grid grid-cols-2 gap-4">
          {/* Existing Consumables */}
          <div>
            <label className="block mb-1 text-sm font-medium">Consumables</label>
            {tempConsumables.map((name) => (
              <div key={name} className="flex justify-between items-center">
                <span className="text-sm">{name}</span>
                <button
                  className="w-10 mx-2 bg-gray-700 font-bold"
                  onClick={() => {
                    setTempConsumables(tempConsumables.filter(c => c !== name));
                  }}
                >╳</button>
              </div>
            ))}
          </div>

          {/* Add Consumable */}
          <div>
            <label className="block mb-1 text-sm font-medium">Add Consumable</label>
            <div className="flex">
              <select
                value={selectedConsumable ?? ""}
                onChange={(e) => setSelectedConsumable(e.target.value)}
                className="w-full rounded bg-zinc-600 px-2 py-1 text-white text-sm"
              >
                {inventory.consumables.map((consumable, index) => (
                  <option key={index} value={consumable}>{consumable}</option>
                ))}
              </select>
              <button
                className="w-10 mx-2 bg-gray-700 font-bold"
                onClick={() => {
                  if (selectedConsumable && !tempConsumables.includes(selectedConsumable)) {
                    setTempConsumables([...tempConsumables, selectedConsumable]);
                  }
                }}
              >+</button>
            </div>
          </div>
        </div>

        {/* Price and Save */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Price:</span>
            <input
              type="number"
              value={tempPrice}
              onChange={(e) => setTempPrice(Number(e.target.value) || 0)}
              className="w-32 rounded bg-zinc-600 px-2 py-1 text-white text-sm"
            />
          </div>
          <button
            className="rounded bg-black px-4 py-2 text-sm hover:bg-gray-800"
            onClick={handleSave}
          >
            Save
          </button>
        </div>

        {/* Do Not Display Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="hideDisplay"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
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
