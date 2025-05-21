export function TopNav() {
  return (
    <nav className="bg-green-300 py-6">
      <ul className="text-m flex justify-center space-x-9 font-bold text-gray-800">
        <li className="hover:underline">
          <a href="/User/Home">HOME</a>
        </li>
        <li className="hover:underline">
          <a href="/User/Shop">SHOP</a>
        </li>
        <li className="hover:underline">
          <a href="/User/OurServices">SERVICES</a>
        </li>
        <li className="hover:underline">
          <a href="/User/Flowers">FLOWERS</a>
        </li>
        <li className="hover:underline">
          <a href="/User/Contacts">CONTACTS</a>
        </li>
      </ul>
    </nav>
  );
}
