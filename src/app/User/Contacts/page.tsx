"use client";

import { MailOpen, MapPin, PhoneCall } from "lucide-react";

export default function Contact() {
  return (
    <div className="bg-zinc-100 font-sans text-[#333]">
      {/* Hero Section */}
      <section
        className="relative h-[200px] bg-cover bg-center opacity-90"
        style={{ backgroundImage: "url('/Pictures/Banner-1.jpg')" }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Shop
          </h1>
          <p className="text-m text-white md:text-base">Home / Shop</p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="bg-white px-4 py-16 text-center">
        {/* Contact Info Cards */}
        <div className="mx-auto mb-16 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-md bg-[#f1f5f4] p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#a6c48a]">
              <MapPin />
            </div>
            <h3 className="mb-2 font-semibold tracking-widest text-gray-800">
              ADDRESS
            </h3>
            <p className="text-sm leading-tight text-gray-600">
              Sampaga, Apalit, Philippines
              <br />
              2016
            </p>
          </div>

          <div className="rounded-md bg-[#f1f5f4] p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#a6c48a]">
              <PhoneCall className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-2 font-semibold tracking-widest text-gray-800">
              PHONE
            </h3>
            <p className="text-sm text-pink-500">0967 360 8776</p>
          </div>

          <div className="rounded-md bg-[#f1f5f4] p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#a6c48a]">
              <MailOpen className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-2 font-semibold tracking-widest text-gray-800">
              EMAIL ADDRESS
            </h3>
            <p className="text-sm text-pink-500">lcarpiocfs@gmail.com</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-2 text-2xl font-semibold text-gray-800 md:text-3xl">
            Have a Question?
          </h2>

          <form className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <input
                type="text"
                placeholder="Name*"
                className="border-b border-gray-400 bg-transparent p-2 placeholder-gray-700 outline-none"
                required
              />
              <input
                type="email"
                placeholder="E-mail*"
                className="border-b border-gray-400 bg-transparent p-2 placeholder-gray-700 outline-none"
                required
              />
            </div>
            <textarea
              placeholder="Message*"
              rows={4}
              className="w-full border-b border-gray-400 bg-transparent p-2 placeholder-gray-700 outline-none"
              required
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="consent"
                className="accent-[#a6c48a]"
              />
              <label htmlFor="consent" className="text-sm text-gray-600">
                I agree that my submitted data is being collected and stored.
              </label>
            </div>
            <button
              type="submit"
              className="mt-2 rounded bg-[#f4b8ac] px-6 py-2 text-sm tracking-widest text-white uppercase transition hover:bg-[#eba99a]"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
