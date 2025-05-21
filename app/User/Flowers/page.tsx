import React from "react";

const bouquets = [
  {
    id: 1,
    name: "Bouquet 1",
    quantity: 1,
    image: "/Pictures/lily-casa.jpg",
  },
  {
    id: 2,
    name: "Bouquet 2",
    quantity: 1,
    image: "/Pictures/rose-chinese.jpg",
  },
  {
    id: 3,
    name: "Bouquet 3",
    quantity: 1,
    image: "/Pictures/rose-legendary.jpg",
  },
];

export default function FlowerPage() {
  return (
    <div>
      <section
        className="relative mb-12 h-[200px] bg-cover bg-center opacity-90"
        style={{ backgroundImage: "url('/Pictures/Banner-1.jpg')" }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Shop
          </h1>
          <p className="text-m text-white md:text-base">Home / Shop</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl p-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {bouquets.map(({ id, name, quantity, image }) => (
            <div
              key={id}
              className="grid grid-cols-2 items-center gap-6 rounded-lg bg-white p-6 shadow-sm"
            >
              <img
                src={image}
                alt={name}
                className="h-40 w-full rounded-lg object-cover shadow-md"
              />

              <div className="flex flex-col items-start space-y-2 text-sm md:text-base">
                <p className="font-semibold text-gray-800">{name}</p>

                <div className="flex w-28 items-center justify-center rounded-lg border px-4 py-1">
                  <span className="font-semibold">Quantity: {quantity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
