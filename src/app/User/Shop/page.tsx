'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useCart } from '~/app/context/CartContext';

interface Bouquet {
  id: number;
  label: string;
  image: string;
  price: number;
  flowers: { [key: string]: number };
  consumables: string[];
}

interface Row {
  id: number;
  title: string;
  items: Bouquet[];
}

export default function ShopPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    loadBouquets();
  }, []);

  const loadBouquets = async () => {
    try {
      const res = await fetch('/api/bouquets/load');
      if (!res.ok) throw new Error('Failed to fetch bouquets');
      const data = await res.json();
      setRows(data);
      setError(null);
    } catch (err) {
      console.error('Error loading bouquets:', err);
      setError('Failed to load bouquets. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (bouquet: Bouquet) => {
    addItem(bouquet);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Loading bouquets...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-red-600">{error}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Our Bouquets</h1>
        
        {rows.map((row) => (
          <div key={row.id} className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">{row.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {row.items.map((bouquet) => (
                <div key={bouquet.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image
                      src={bouquet.image}
                      alt={bouquet.label}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{bouquet.label}</h3>
                    <p className="text-gray-600 mb-2">₱{bouquet.price.toFixed(2)}</p>
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-1">Flowers:</h4>
                      <ul className="text-sm text-gray-600">
                        {Object.entries(bouquet.flowers).map(([flower, quantity]) => (
                          <li key={flower}>
                            {flower} ({quantity})
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-1">Includes:</h4>
                      <ul className="text-sm text-gray-600">
                        {bouquet.consumables.map((consumable) => (
                          <li key={consumable}>{consumable}</li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={() => handleAddToCart(bouquet)}
                      className="w-full bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
