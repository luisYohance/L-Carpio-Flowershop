'use client';

import { useEffect, useState } from "react";
import { type Bouquet, type Row, bouquetRows } from "../../bouquetRows";

export default function BouquetPage() {
  const [rows, updateRows] = useState<Row[] | null>(null); // Defer rendering until mounted
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Load data from API on mount
    async function loadFromApi() {
      try {
        const res = await fetch("/api/bouquets/load");
        if (res.status === 401) {
          setError("Please log in as an admin to view this page");
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch bouquets");
        const data: Row[] = await res.json();
        // Ensure each row has an items array
        const validData = data.map(row => ({
          ...row,
          items: row.items || []
        }));
        bouquetRows.set(validData);  // update global store
        updateRows(validData);       // update local state
      } catch (err) {
        console.error("Error loading bouquets:", err);
        setError("Failed to load bouquets. Please try again later.");
        // fallback: load from localStorage store if available
        const fallbackData = bouquetRows.value?.map(row => ({
          ...row,
          items: row.items || []
        })) || [];
        updateRows(fallbackData);
      }
    }
    loadFromApi();

    // 2. Subscribe to bouquetRows changes to update local state
    bouquetRows.onChange((newRows) => {
      const validRows = newRows?.map(row => ({
        ...row,
        items: row.items || []
      })) || [];
      updateRows(validRows);
    });

  }, []);

  // Toggle menu helper (unchanged)
  const toggleMenu = () => {
    const menu = document.getElementById("menu");
    if (menu) {
      menu.classList.toggle("hidden");
    }
  };

  // addItem, addRow - unchanged except minor fix to addItem key
  const addItem = (bouquet: Bouquet, bouquetIndex: number, rowIndex: number) => (
    <div
      key={`${rowIndex}-${bouquetIndex}`} // safer unique key
      className="relative border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer bg-white"
    >
      <button
        className="absolute top-2 right-2 text-white bg-black/40 hover:bg-black/70 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold"
        onClick={() => {
          const newRows = [...(bouquetRows.value || [])];
          const index = newRows[rowIndex]?.items?.indexOf(bouquet);
          if (index > -1) {
            newRows[rowIndex].items.splice(index, 1);
          }
          bouquetRows.set(newRows);
        }}
      >
        ×
      </button>
      <a 
        href={bouquet.id ? `/Admin/Bouquet/Edit?rowIndex=${rowIndex}&itemIndex=${bouquetIndex}` : '#'}
        onClick={(e) => {
          if (!bouquet.id) {
            e.preventDefault();
            alert("Please save your changes to the database before editing bouquets.");
          }
        }}
      >
        <div className="flex flex-col items-center">
          <img
            src={bouquet.image || "/placeholder-image.png"}
            alt={bouquet.label}
            className="w-24 h-24 rounded-full mb-2 object-cover"
          />
          <p className="text-center text-sm font-medium">{bouquet.label}</p>
          {!bouquet.id && (
            <span className="text-xs text-red-500 mt-1">(Unsaved)</span>
          )}
        </div>
      </a>
    </div>
  );

  const addRow = (row: Row, rowIndex: number) => (
    <div key={rowIndex} className="w-full max-w-5xl" data-id="row">
      <div className="inline-block align-middle w-full m-2">
        <h2 className="text-lg font-semibold float-left">{row.title}</h2>
        <button
          className="bg-gray-700 hover:bg-gray-800 text-white font-semibold p-2 m-2 rounded w-auto float-right"
          onClick={async () => {
            try {
              console.log('Attempting to delete row:', row);
              
              // For unsaved rows, just update the frontend state
              if (!row.id) {
                console.log('Row appears to be unsaved, removing from frontend state');
                const newRows = [...(bouquetRows.value || [])];
                const index = newRows.findIndex(r => r.title === row.title);
                if (index > -1) {
                  newRows.splice(index, 1);
                  bouquetRows.set(newRows);
                  console.log('Row removed from frontend state');
                } else {
                  console.log('Row not found in frontend state');
                }
                return;
              }

              // For saved rows, make the API call
              console.log('Row appears to be saved, making API call');
              const res = await fetch("/api/bouquets/delete-row", {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ rowId: row.id }),
              });

              if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.details || 'Failed to delete row');
              }

              // Update local state after successful deletion
              const newRows = [...(bouquetRows.value || [])];
              const index = newRows.findIndex(r => r.id === row.id);
              if (index > -1) {
                newRows.splice(index, 1);
                bouquetRows.set(newRows);
                console.log('Saved row removed from frontend state');
              } else {
                console.log('Saved row not found in frontend state');
              }
            } catch (err) {
              console.error("Error deleting row:", err);
              alert(err instanceof Error ? err.message : "Failed to delete row");
            }
          }}
        >
          Delete Row
        </button>
        <button
          onClick={() => {
            const item = {
              label: `Bouquet #${(row.items || []).length + 1}`,
              image: "/placeholder-image.png",
              price: 0,
              flowers: {},
              consumables: []
            };
            const newRows = [...(bouquetRows.value || [])];
            if (!newRows[rowIndex].items) {
              newRows[rowIndex].items = [];
            }
            newRows[rowIndex].items.push(item);
            bouquetRows.set(newRows);
          }}
          className="bg-gray-700 hover:bg-gray-800 text-white font-semibold p-2 m-2 rounded w-auto float-right"
        >
          Add Item
        </button>
        <button
          onClick={() => {
            const newTitle = prompt("Change the title:");
            if (!newTitle) return; // User cancelled

            const newRows = [...(bouquetRows.value || [])];
            const index = newRows.findIndex(r => r.id === row.id || r.title === row.title);
            
            if (index > -1) {
              newRows[index] = {
                ...newRows[index],
                title: newTitle
              };
              bouquetRows.set(newRows);
              console.log('Row renamed:', { oldTitle: row.title, newTitle });
            } else {
              console.log('Row not found for renaming');
            }
          }}
          className="bg-gray-700 hover:bg-gray-800 text-white font-semibold p-2 m-2 rounded w-auto float-right"
        >
          Rename Row
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {(row.items || []).map((bouquet, index) => addItem(bouquet, index, rowIndex))}
      </div>
    </div>
  );

  // Don't render until `rows` is set on client
  if (!rows) return null;

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
    <div className="flex h-screen bg-gray-100 text-gray-900 p-6 space-x-6">
      <div className="flex-1 flex flex-col items-center space-y-8" id="rowsSpace">
        {rows.map((row, rowIndex) => addRow(row, rowIndex))}
      </div>

      <div className="w-40 flex flex-col space-y-4">
        <button
          onClick={() => {
            const row = { 
              title: 'Row #'.concat(JSON.stringify((bouquetRows.value || []).length+1)), 
              items: [] 
            };
            const newRows = [...(bouquetRows.value || [])];
            newRows.push(row);
            bouquetRows.set(newRows);
          }}
          className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded w-auto"
        >
          Add Row
        </button>

        {/* Save to DB button */}
        <button
          onClick={async () => {
            try {
              console.log('Saving bouquets:', bouquetRows.value);
              const res = await fetch("/api/bouquets/save", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(bouquetRows.value),
              });
              
              if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.details || 'Failed to save bouquets');
              }
              
              // After successful save, reload from database
              const loadRes = await fetch("/api/bouquets/load");
              if (!loadRes.ok) {
                const errorData = await loadRes.json();
                throw new Error(errorData.details || 'Failed to fetch bouquets');
              }
              const data: Row[] = await loadRes.json();
              const validData = data.map(row => ({
                ...row,
                items: row.items || []
              }));
              bouquetRows.set(validData);
              updateRows(validData);
              
              alert("Bouquets saved and reloaded successfully!");
            } catch (err) {
              console.error("Error saving bouquets:", err);
              alert(err instanceof Error ? err.message : "Failed to save bouquets to database");
            }
          }}
          className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded w-auto"
        >
          Save to DB
        </button>

        {/* Load from DB button */}
        <button
          onClick={async () => {
            try {
              const res = await fetch("/api/bouquets/load");
              if (!res.ok) throw new Error("Failed to fetch bouquets");
              const data: Row[] = await res.json();
              const validData = data.map(row => ({
                ...row,
                items: row.items || []
              }));
              bouquetRows.set(validData);
              updateRows(validData);
            } catch (err) {
              console.error("Error loading bouquets:", err);
              alert("Failed to load bouquets from server");
            }
          }}
          className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded w-auto"
        >
          Load from DB
        </button>
      </div>
    </div>
  );
}