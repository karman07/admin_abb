import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiBarChart2, FiActivity, FiLogOut } from 'react-icons/fi';
import useAuth from '../store/auth';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/dashboard/users', label: 'Users', icon: FiUsers },
  { to: '/dashboard/results', label: 'Results', icon: FiBarChart2 },
  { to: '/dashboard/performance', label: 'Performance', icon: FiActivity },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate('/');
  };

  return (
    <aside className="w-64 bg-white shadow-sm flex flex-col border-r border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-base">A</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800 leading-tight">Admin Panel</p>
            <p className="text-xs text-gray-400">Abacus Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-500 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
        >
          <FiLogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
