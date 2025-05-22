"use client";

import { SignIn, SignedOut, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Facebook } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/User/Home");
    }
  }, [isSignedIn, router]);

  return (
    <div className="w-full font-sans">
      {/* Section with background image and sidebars */}
      <section className="relative z-0 h-[750px] w-full">
        {/* Background Image */}
        <div className="absolute inset-0 -z-10">
          <img
            src="/Pictures/Banner-1.jpg"
            alt="FlowerShop Background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="flex h-full w-full">
          {/* Left Sidebar */}
          <div className="flex w-[17rem] flex-col bg-white p-4">
            <h2 className="mb-2 border-b text-center text-sm font-semibold">
              Best Seller Flowers
            </h2>
            <div className="flex flex-1 flex-col gap-4">
              {[
                "/Pictures/rose-chinese.jpg",
                "/Pictures/lily-casa.jpg",
                "/Pictures/rose-legendary.jpg",
              ].map((src, i) => (
                <div key={i} className="flex-1">
                  <img
                    src={src}
                    alt={`Left Flower ${i + 1}`}
                    className="h-full w-full rounded-md object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Center Content */}
          <div className="mx-4 flex flex-1 flex-col items-center justify-center text-white">
            <SignedOut>
              <div className="mb-4 flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-white">
                <img
                  src="/Pictures/Lcarpio-logo.jpg"
                  alt="FlowerShop Logo"
                  className="h-32 w-32 object-contain"
                />
              </div>

              <div className="w-full max-w-md rounded-lg bg-white/90 p-6 text-black shadow-lg">
                <SignIn routing="hash" />
              </div>
            </SignedOut>
          </div>

          {/* Right Sidebar - now identical to left sidebar with smaller gap */}
          <div className="flex w-[17rem] flex-col bg-white p-4">
            <h2 className="mb-2 border-b text-center text-sm font-semibold">
              Best Seller Bouquets
            </h2>
            <div className="flex flex-1 flex-col gap-2">
              {[
                "/Pictures/Bouquet-1.jpg",
                "/Pictures/Bouquet-2.jpg",
                "/Pictures/Bouquet-3.jpg",
              ].map((src, i) => (
                <div key={i} className="flex-1">
                  <img
                    src={src}
                    alt={`Right Flower ${i + 1}`}
                    className="h-[230px] w-full rounded-md object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="w-full bg-white px-6 py-12 text-black">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 md:flex-row">
        <div className="mb-4 flex aspect-square h-40 w-80 items-center justify-center overflow-hidden rounded-full bg-white">
                <img
                  src="/Pictures/Lcarpio-logo.jpg"
                  alt="FlowerShop Logo"
                  className="h-32 w-32 object-contain"
                />
              </div>
          <div>
            <h2 className="mb-4 text-2xl font-semibold">
              Welcome to Lcarpio's Flower Shop
            </h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              We sell different kinds of flowers for all occasions. Our flowers
              are sourced from China and are guaranteed to be fresh and of the
              highest quality. Whether you're looking for a bouquet for a
              wedding or a gift for a loved one, we can create it for you.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-white py-10 text-center">
         <div className="mb-4 flex aspect-square h-20 w-40 items-center justify-center overflow-hidden rounded-full bg-white">
                <img
                  src="/Pictures/Lcarpio-logo.jpg"
                  alt="FlowerShop Logo"
                  className="h-18 w-18 object-contain"
                />
          </div>
        <div className="mt-6 flex justify-center space-x-4">
          <a
            href="https://www.facebook.com/profile.php?id=100075981939873"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#a6c48a] p-2 text-white"
          >
            <Facebook />
          </a>
        </div>
        <div className="mt-10 text-sm text-gray-500">
          Lcarpio&apos;s Flower Shop © 2025.{" "}
          <a href="#" className="hover:underline">
            Terms of Use
          </a>{" "}
          and{" "}
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
        </div>
      </footer>
    </div>
  );
}
