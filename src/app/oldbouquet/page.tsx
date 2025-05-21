"use client";
import Link from "next/link";

export default function oldBouquetPage() {
  const toggleMenu = () => {
    const menu = document.getElementById("menu");
    if (menu) {
      menu.classList.toggle("hidden");
    }
  };

  const bouquetRows = [
    {
      title: "Simple Bouquet",
      items: [
        { label: "1", image: "#"},
        { label: "2", image: "#" },
        { label: "3", image: "#" },
      ],
    },
    {
      title: "Premium Bouquet",
      items: [
        { label: "1", image: "#" },
        { label: "2", image: "#" },
        { label: "3", image: "#" },
      ],
    },
    {
      title: "Special Bouquet",
      items: [
        { label: "1", image: "#" },
        { label: "2", image: "#" },
        { label: "3", image: "#" },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900 p-6 space-x-6">
      <div className="flex-1 flex flex-col items-center space-y-8">
        {bouquetRows.map((row, rowIndex) => (
          <div key={rowIndex} className="w-full max-w-5xl">
            <h2 className="text-lg font-semibold">{row.title}</h2>
            <div className="grid grid-cols-3 gap-4">
              {row.items.map((item, index) => (
                <a href={`/page-${rowIndex * 3 + index + 1}`} key={index}>
                  <div className="flex flex-col items-center p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer bg-white">
                    <img
                      src={item.image}
                      alt={item.label}
                      className="w-24 h-24 rounded-full mb-2 object-cover"
                    />
                    <p className="text-center text-sm font-medium">{item.label}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="w-40">
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
            <a href="/EditFlower" className="block px-4 py-2 hover:bg-gray-100">
              Choice 1
            </a>
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
      </div>
    </div>
  );
}
