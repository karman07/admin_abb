import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiBarChart2, FiActivity, FiLogOut, FiX } from 'react-icons/fi';
import useAuth from '../store/auth';

const navItems = [
  { to: '/dashboard',             label: 'Dashboard',   icon: FiHome },
  { to: '/dashboard/users',       label: 'Users',        icon: FiUsers },
  { to: '/dashboard/results',     label: 'Results',      icon: FiBarChart2 },
  { to: '/dashboard/performance', label: 'Performance',  icon: FiActivity },
];

export default function Sidebar({ isOpen, onClose }) {
  const { pathname } = useLocation();
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate('/');
  };

  return (
    <aside
      className={[
        'fixed lg:static inset-y-0 left-0 z-30',
        'w-64 bg-white shadow-sm flex flex-col border-r border-gray-100',
        'transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ].join(' ')}
    >
      {/* Brand */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm shrink-0">
            <span className="text-white font-bold text-base">A</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800 leading-tight">Admin Panel</p>
            <p className="text-xs text-gray-400">Abacus Platform</p>
          </div>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          aria-label="Close menu"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className={[
                'flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium',
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-500 hover:bg-blue-50 hover:text-blue-700',
              ].join(' ')}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
        >
          <FiLogOut className="w-4 h-4 shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
}
