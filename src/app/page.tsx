'use client';

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LandingPage from "./User/page";

export default function HomePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();


  useEffect(() => {
    if (!isLoaded) return;

    if (user) {
      const role = user.publicMetadata.role as string;
      if (role === "admin") {
        router.push("/Admin");
      } else {
        router.push("/User");
      }
    }
  }, [user, isLoaded, router]);
  return (
    <LandingPage />
  );
}
