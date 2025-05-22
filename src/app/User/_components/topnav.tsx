import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { LogOut } from "lucide-react";

export function TopNav() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-green-300 p-4 font-bold text-black">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* 🔗 Centered Navigation Links */}
        <ul className="flex flex-1 list-none justify-center gap-6">
          <li>
            <a href="/User/Home" className="px-4 py-2 hover:underline">
              HOME
            </a>
          </li>
          <li>
            <a href="/User/Shop" className="px-4 py-2 hover:underline">
              SHOP
            </a>
          </li>
          <li>
            <a href="/User/OurServices" className="px-4 py-2 hover:underline">
              SERVICES
            </a>
          </li>
          <li>
            <a href="/User/Flowers" className="px-4 py-2 hover:underline">
              FLOWERS
            </a>
          </li>
          <li>
            <a href="/User/Contacts" className="px-4 py-2 hover:underline">
              CONTACTS
            </a>
          </li>
        </ul>

        {/* 🔐 Auth Buttons */}
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton />
          </SignedOut>

          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer items-center gap-2">
                <LogOut className="h-5 w-5 text-black" />
                <span className="text-m font-bold text-black">Logout</span>
              </div>
            </SignOutButton>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
