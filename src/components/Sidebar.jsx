import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white shadow-lg flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        Admin Panel
      </div>
      <nav className="flex-1 p-4 space-y-4">
        <Link
          to="/dashboard/users"
          className="block px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          Users
        </Link>
        <Link
          to="/dashboard/results"
          className="block px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          Results
        </Link>
      </nav>
    </aside>
  );
}
