"use client";

import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

const services = [
  {
    title: "Wedding Arrangements",
    image: "/Pictures/Wedding-Arrangement.jpg",
    description: "Bridal bouquets, venue decor & more.",
    link: "/User/OurServices/wedding-details",
  },
  {
    title: "Funeral Arrangements",
    image: "/Pictures/Funeral-Arrangement.jpg",
    description: "Elegant floral tributes for farewells.",
    link: "/User/OurServices/funeral-details",
  },
  {
    title: "Church Events",
    image: "/Pictures/Church-Arrangement.jpg",
    description: "Arrangements for religious ceremonies.",
    link: "/User/OurServices/church-details",
  },
];

export default function Services() {
  const router = useRouter();

  return (
    <>
      {/* Hero Banner */}
      <section
        className="relative h-[200px] bg-cover bg-center opacity-90"
        style={{ backgroundImage: 'url("/Pictures/Banner-1.jpg")' }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Our Services
          </h1>
          <p className="text-m text-white md:text-base">Home / Services</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-zinc-200 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {services.map((service, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border bg-white shadow-md transition-shadow hover:shadow-xl"
              >
                <div className="relative h-60 w-full">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {service.description}
                  </p>
                  <button
                    onClick={() => router.push(service.link)}
                    className="mt-4 rounded bg-rose-200 px-4 py-2 font-semibold text-rose-800 transition hover:bg-rose-300"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
