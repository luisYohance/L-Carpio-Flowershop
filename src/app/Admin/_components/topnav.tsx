import { SignedOut, SignedIn, SignInButton, SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
export function TopNav() {
    return (
        <nav className="sticky top-0 z-50 w-full flex items-center justify-between p-4 bg-black text-white">
            <div className="text-xl font-bold">Lcarpio's Flower Shop</div>
            
            <div className="flex gap-4 list-none text-white font-semibold">
                <div className="relative group">
                    <a href="/Admin/Bouquet" className="px-4 py-2 rounded hover:bg-gray-500">Shop</a>
                </div>
                <div className="relative group">
                    <a href="/Admin/Flowers" className="px-4 py-2 rounded hover:bg-gray-500">Flowers</a>
                </div>
                <div className="relative group">
                    <a href="/Admin/Orders" className="px-4 py-2 rounded hover:bg-gray-500">Orders</a>
                </div>
            </div>

            <div className="flex gap-2">
                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>
                    <SignOutButton>
                    <div className="flex cursor-pointer items-center gap-2">
                            <LogOut className="h-5 w-5 text-white" />
                            <span className="text-m font-bold text-white">Logout</span>
                        </div>
                    </SignOutButton>
                </SignedIn>
            </div>
        </nav>
    );
}