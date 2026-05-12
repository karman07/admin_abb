import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiFileText, FiActivity, FiTrendingUp } from 'react-icons/fi';
import API from '../services/api';
import { useUsers } from '../context/UserContext';

const typeLabels = {
  '0': 'Accuracy Abacus',
  '1': 'Accuracy Mentally',
  '2': 'Speed',
};

const typeBadge = {
  '0': 'bg-blue-50 text-blue-600',
  '1': 'bg-purple-50 text-purple-600',
  '2': 'bg-orange-50 text-orange-600',
};

export default function Dashboard() {
  const { users } = useUsers();
  const [results, setResults] = useState([]);

  useEffect(() => {
    API.get('/result')
      .then((res) => setResults(res.data))
      .catch(() => {});
  }, []);

  const adminCount = users.filter((u) => u.role === 'admin').length;
  const recent = [...results].reverse().slice(0, 5);

  const stats = [
    {
      label: 'Total Users',
      value: users.length,
      icon: FiUsers,
      bg: 'bg-blue-50',
      color: 'text-blue-600',
      link: '/dashboard/users',
    },
    {
      label: 'Total Results',
      value: results.length,
      icon: FiFileText,
      bg: 'bg-green-50',
      color: 'text-green-600',
      link: '/dashboard/results',
    },
    {
      label: 'Admins',
      value: adminCount,
      icon: FiTrendingUp,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
      link: '/dashboard/users',
    },
    {
      label: 'Exam Types',
      value: 3,
      icon: FiActivity,
      bg: 'bg-orange-50',
      color: 'text-orange-600',
      link: '/dashboard/performance',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(({ label, value, icon: Icon, bg, color, link }) => (
          <Link
            key={label}
            to={link}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg}`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Results */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Recent Results</h2>
          <Link to="/dashboard/results" className="text-sm text-blue-600 hover:underline font-medium">
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="p-6 text-gray-400 text-sm text-center">No results recorded yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wide bg-gray-50">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Correct</th>
                <th className="px-6 py-3">Wrong</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recent.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-medium text-gray-700">{r.name}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${typeBadge[r.type] || 'bg-gray-100 text-gray-500'}`}>
                      {typeLabels[r.type] || r.type}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-green-600 font-semibold">{r.correct}</td>
                  <td className="px-6 py-3 text-red-400 font-semibold">{r.wrong}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/dashboard/users"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-5 flex items-center gap-4 transition-all shadow-sm"
        >
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <FiUsers className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">Manage Users</p>
            <p className="text-xs text-blue-200 mt-0.5">Add, edit, delete users</p>
          </div>
        </Link>

        <Link
          to="/dashboard/results"
          className="bg-white hover:shadow-md text-gray-700 border border-gray-100 rounded-2xl p-5 flex items-center gap-4 transition-all shadow-sm"
        >
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
            <FiFileText className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-800">View Results</p>
            <p className="text-xs text-gray-400 mt-0.5">Exam scores and charts</p>
          </div>
        </Link>

        <Link
          to="/dashboard/performance"
          className="bg-white hover:shadow-md text-gray-700 border border-gray-100 rounded-2xl p-5 flex items-center gap-4 transition-all shadow-sm"
        >
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
            <FiActivity className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-800">Performance Data</p>
            <p className="text-xs text-gray-400 mt-0.5">Level-wise accuracy & speed</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
