import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FiMenu } from 'react-icons/fi';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/dashboard/users': 'User Management',
  '/dashboard/results': 'Results',
  '/dashboard/performance': 'Performance',
};

export default function Layout() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] || 'Admin Panel';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shrink-0">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors shrink-0"
            aria-label="Open menu"
          >
            <FiMenu className="w-5 h-5" />
          </button>

          <h1 className="flex-1 text-base font-semibold text-gray-800 truncate">{title}</h1>

          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xs">AD</span>
            </div>
            <div className="text-sm hidden sm:block">
              <p className="font-medium text-gray-700 leading-tight">Administrator</p>
              <p className="text-xs text-gray-400">admin</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
