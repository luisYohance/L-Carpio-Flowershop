import React from "react";

export default function WeddingPage() {
  return (
    <>
      {/* Hero Banner */}
      <section
        className="relative h-[200px] bg-cover bg-center opacity-90"
        style={{ backgroundImage: 'url("/Pictures/Banner-1.jpg")' }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Wedding Arrangements
          </h1>
          <p className="text-m text-white md:text-base">
            Home / Services / Wedding Arrangements
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-12 px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-widest uppercase">
            Wedding Arrangements
          </h1>
          <p className="mt-4 text-gray-600">
            Elegant and customized floral arrangements designed for weddings to
            make your day extra special.
          </p>
        </div>

        <div className="flex flex-col items-center gap-8 md:flex-row">
          <img
            src="/Pictures/Wedding-Arrangement.jpg"
            alt="Wedding Flowers"
            className="w-full rounded shadow-md md:w-1/2"
          />
          <div className="space-y-4 text-gray-700">
            <p>
              From bouquets to centerpieces, our wedding arrangements are
              crafted with passion and attention to detail.
            </p>
            <p>
              Choose from a variety of blooms and styles to match your wedding
              theme and bring your dream vision to life.
            </p>
          </div>
        </div>

        {/* Contact Section (Mini Hero Style) */}
        <div className="flex justify-center">
          <div
            className="relative h-[200px] w-full rounded bg-cover bg-center shadow-md md:w-[100%]"
            style={{ backgroundImage: 'url("/Pictures/Wedding-designs.jpg")' }}
          >
            <div className="absolute inset-0 flex items-center justify-center rounded bg-black/40">
              <a href="/User/Contacts">
                <button className="bg-opacity-70 hover:bg-opacity-90 rounded bg-pink-600 px-6 py-3 font-semibold text-white shadow-lg hover:bg-pink-700">
                  Contact Us for Wedding Services
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
