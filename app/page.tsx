"use client";

import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      // Redirect to Clerk sign-in page if user is not authenticated
      window.location.href = "https://helping-skylark-84.accounts.dev/sign-in";
      return;
    }

    // Check user role and redirect accordingly
    const role = user.publicMetadata.role as string;
    if (role === "admin") {
      router.push("/Admin/Bouquet");
    } else {
      router.push("/User/CartView");
    }
  }, [user, isLoaded, router]);

  // Show loading state while checking authentication
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-semibold">Loading...</h1>
        <p className="text-gray-600">Please wait while we redirect you...</p>
      </div>
    </div>
  );
}
