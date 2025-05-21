import { SignedOut, SignInButton } from "@clerk/nextjs";

export function TopNav() {
    return (
        <nav className="sticky top-0 z-50 w-full flex items-center justify-between p-4 bg-black text-white">
            <div className="text-xl font-bold">Lcarpio's Flower Shop</div>
            
            <div className="flex gap-4 list-none">
                <div className="relative group">
                    <a href="/Admin/Bouquet" className="text-white px-4 py-2 rounded hover:bg-gray-500">Shop</a>
                </div>
                <div className="relative group">
                    <a href="/Admin/Flowers" className="text-white px-4 py-2 rounded hover:bg-gray-500">Flowers</a>
                </div>
                <div className="relative group">
                    <a href="/Admin/Orders" className="text-white px-4 py-2 rounded hover:bg-gray-500">Orders</a>
                </div>
            </div>

            <div className="flex gap-2">
                <SignedOut>
                    <SignInButton />
                </SignedOut>
            </div>
        </nav>
    );
}