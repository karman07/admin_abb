import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/dashboard/users': 'User Management',
  '/dashboard/results': 'Results',
  '/dashboard/performance': 'Performance',
};

export default function Layout() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] || 'Admin Panel';

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shrink-0">
          <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xs">AD</span>
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-700 leading-tight">Administrator</p>
              <p className="text-xs text-gray-400">admin</p>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
