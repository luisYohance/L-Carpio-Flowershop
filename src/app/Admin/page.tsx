'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { is } from 'drizzle-orm';

export default function BouquetPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  if (!isLoaded) return;

  return (
    <div className='bg-gradient-to-b from-[#454446] to-[#1d1d22] h-screen flex flex-col items-center justify-center bg-gray-100'>
      <h1 className='text-4xl text-white font-bold'>Hello, {user?.firstName}.</h1>
      <h2 className='text-2xl text-white'>Welcome to the Admin Dashboard.</h2>
      <p className='text-gray-700 text-white'>Please select an option from the menu.</p>
    </div>
  )
}

/*
        <button
          onClick={toggleMenu}
          className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded w-full"
        >
          Edit
        </button>
        <ul
          id="menu"
          className="mt-2 bg-white text-black rounded shadow-lg hidden"
        >
          <li>
            <button
              onClick={() => {
                const row = { title: 'Row #'.concat(JSON.stringify((bouquetRows.value || []).length+1)), items: [] };
                const newRows = [...(bouquetRows.value || [])];
                newRows.push(row);
                bouquetRows.set(newRows);
              }}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Add Row
            </button>
          </li>
          <li>
            <a href="#" className="block px-4 py-2 hover:bg-gray-100">
              Choice 2
            </a>
          </li>
          <li>
            <a href="#" className="block px-4 py-2 hover:bg-gray-100">
              Choice 3
            </a>
          </li>
        </ul>
        */