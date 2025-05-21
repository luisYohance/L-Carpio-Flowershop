import { SignInButton } from "@clerk/nextjs";

import { SignedOut } from "@clerk/nextjs";

import { SignOutButton } from "@clerk/nextjs";

import { SignedIn } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

export function TopNav() {
  return (
    
    <nav className=" sticky top-0 z-50 w-full flex items-center justify-between p-4 text-black font-bold bg-green-300">

      <div className="flex gap-4 list-none">
                <div className="relative group">
                    <a href="/User" className="text-black px-4 py-2 hover:underline">HOME</a>
                </div>
                <div className="relative group">
                    <a href="/User/Shop" className="text-black px-4 py-2 hover:underline">SHOP</a>
                </div>
                <div className="relative group">
                    <a href="/User/OurServices" className="text-black px-4 py-2 hover:underline">SERVICES</a>
                </div>
                <div className="relative group">
                    <a href="/User/Flowers" className="text-black px-4 py-2 hover:underline">FLOWERS</a>
                </div>
                <div className="relative group">
                    <a href="/User/Contacts" className="text-black px-4 py-2 hover:underline">CONTACTS</a>
                </div>
      </div>

      <div className="flex gap-2">
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
              <SignOutButton>
                <LogOut className="h-6 w-6 text-white" />
              </SignOutButton>
            </SignedIn>
      </div>
    </nav>
  );
}
