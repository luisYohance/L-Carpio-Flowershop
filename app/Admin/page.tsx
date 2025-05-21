'use client';

import { useEffect, useState } from "react";
import { type Bouquet, type Row, bouquetRows } from "../bouquetRows";

export default function BouquetPage() {
  const [rows, updateRows] = useState<Row[] | null>(null); // Defer rendering until mounted

  useEffect(() => {
    // Set initial rows from bouquetRows after mount
    updateRows(bouquetRows.value);
    bouquetRows.onChange(updateRows);
  }, []);

  const toggleMenu = () => {
    const menu = document.getElementById("menu");
    if (menu) {
      menu.classList.toggle("hidden");
    }
  };

  const addItem = (bouquet: Bouquet, bouquetIndex: number, rowIndex: number) => (
    <div
      key={bouquetIndex}
      className="relative border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer bg-white"
    >
      <button
        className="bg-gray-700 absolute p-1 right-0 font-bold"
        onClick={() => {
          const newRows = [...(bouquetRows.value || [])];
          const index = newRows[rowIndex].items.indexOf(bouquet);
          if (index > -1) {
            newRows[rowIndex].items.splice(index, 1);
          }
          bouquetRows.set(newRows);
        }}
      >
        ╳
      </button>
      <a href={`${window.location.href}/Edit?rowIndex=${rowIndex}&itemIndex=${bouquetIndex}`}>
        <div className="flex flex-col items-center">
          <img
            src={bouquet.image}
            alt={bouquet.label}
            className="w-24 h-24 rounded-full mb-2 object-cover"
          />
          <p className="text-center text-sm font-medium">{bouquet.label}</p>
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
        onClick={() => {
          const newRows = [...(bouquetRows.value || [])];
          const index = newRows.indexOf(row);
          if (index > -1) {
            newRows.splice(index, 1);
          }
          bouquetRows.set(newRows);
        }}
      >
        Delete Row
        </button>
        <button
          onClick={() => {
            const item = {
              label: `Bouquet #${row.items.length + 1}`,
              image: "IMAGE",
            };
            const newRows = [...(bouquetRows.value || [])];
            newRows[newRows.indexOf(row)]?.items.push(item);
            bouquetRows.set(newRows);
          }}
          className="bg-gray-700 hover:bg-gray-800 text-white font-semibold p-2 m-2 rounded w-auto float-right"
        >
          Add Item
        </button>
        <button
          onClick={() => {
            const newRows = [...(bouquetRows.value || [])];
            const index = newRows.indexOf(row);
            var title = prompt("Change the title:");
            if ((index > -1) && (title)) {
              newRows[index].title = title;
            }
            bouquetRows.set(newRows);
          }}
          className="bg-gray-700 hover:bg-gray-800 text-white font-semibold p-2 m-2 rounded w-auto float-right"
        >
          Rename Row
        </button>
        
        
      </div>
      <div className="grid grid-cols-3 gap-4">
        {row.items.map((bouquet, index) => addItem(bouquet, index, rowIndex))}
      </div>
    </div>
  );

  // Don't render until `rows` is set on client
  if (!rows) return null;

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900 p-6 space-x-6">
      <div className="flex-1 flex flex-col items-center space-y-8" id="rowsSpace">
        {rows.map((row, rowIndex) => addRow(row, rowIndex))}
      </div>

      <div className="w-40">
        <button
              onClick={() => {
                const row = { title: 'Row #'.concat(JSON.stringify((bouquetRows.value || []).length+1)), items: [] };
                const newRows = [...(bouquetRows.value || [])];
                newRows.push(row);
                bouquetRows.set(newRows);
              }}
              className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded w-auto"
            >
              Add Row
        </button>
        
      </div>
    </div>
  );
}

/*
        <button
          onClick={toggleMenu}
          className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded w-full"
        >
          Edit
        </button>
        <ul
          id="menu"
          className="mt-2 bg-white text-black rounded shadow-lg hidden"
        >
          <li>
            <button
              onClick={() => {
                const row = { title: 'Row #'.concat(JSON.stringify((bouquetRows.value || []).length+1)), items: [] };
                const newRows = [...(bouquetRows.value || [])];
                newRows.push(row);
                bouquetRows.set(newRows);
              }}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Add Row
            </button>
          </li>
          <li>
            <a href="#" className="block px-4 py-2 hover:bg-gray-100">
              Choice 2
            </a>
          </li>
          <li>
            <a href="#" className="block px-4 py-2 hover:bg-gray-100">
              Choice 3
            </a>
          </li>
        </ul>
        */