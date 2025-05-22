"use client";

import { SignIn, SignedOut, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/User/Home");
    }
  }, [isSignedIn, router]);

  return (
    <div className="h-screen w-full font-sans">
      <section
        className="relative h-full w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/Pictures/Banner-1.jpg')" }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 px-4 text-center">
          <SignedOut>
            <img
              src="/Pictures/Lcarpio-logo.jpg"
              alt="FlowerShop Logo"
              className="mb-8 h-40 w-40 rounded-full object-cover"
            />

            <div className="rounded-lg bg-white/90 p-6 shadow-lg">
              <SignIn />
            </div>
          </SignedOut>
        </div>
      </section>
    </div>
  );
}
