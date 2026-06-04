import { useEffect, useState } from 'react';
import API from '../services/api';
import { FiSearch } from 'react-icons/fi';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#3b82f6', '#f87171'];

const typeLabels = {
  '0': 'Accuracy Abacus',
  '1': 'Accuracy Mentally',
  '2': 'Speed',
};

const typeBadgeColors = {
  '0': 'bg-blue-50 text-blue-700',
  '1': 'bg-purple-50 text-purple-700',
  '2': 'bg-orange-50 text-orange-700',
};

export default function Results() {
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/result')
      .then((res) => setResults(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = results.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      (typeLabels[r.type] || '').toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === '' || r.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Results</h2>
        <p className="text-sm text-gray-400 mt-0.5">{results.length} total exam results</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[160px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 min-w-[130px]"
          >
            <option value="">All Types</option>
            <option value="0">Accuracy Abacus</option>
            <option value="1">Accuracy Mentally</option>
            <option value="2">Speed</option>
          </select>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">No results found.</div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 uppercase tracking-wide bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Score</th>
                    <th className="px-6 py-3">Accuracy</th>
                    <th className="px-6 py-3">Chart</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((res, idx) => {
                    const total = (res.correct || 0) + (res.wrong || 0);
                    const pct = total > 0 ? Math.round((res.correct / total) * 100) : 0;
                    const chartData = [
                      { name: 'Correct', value: res.correct || 0 },
                      { name: 'Wrong', value: res.wrong || 0 },
                    ];
                    return (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-800">{res.name}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${typeBadgeColors[res.type] || 'bg-gray-100 text-gray-600'}`}>
                            {typeLabels[res.type] || res.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-green-600 font-semibold">{res.correct}</span>
                          <span className="text-gray-300 mx-1">/</span>
                          <span className="text-red-400 font-semibold">{res.wrong}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-100 rounded-full h-1.5">
                              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs font-semibold text-gray-600">{pct}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <PieChart width={60} height={60}>
                            <Pie data={chartData} dataKey="value" cx="50%" cy="50%" outerRadius={25}>
                              {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {filtered.map((res, idx) => {
                const total = (res.correct || 0) + (res.wrong || 0);
                const pct = total > 0 ? Math.round((res.correct / total) * 100) : 0;
                return (
                  <div key={idx} className="px-4 py-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-gray-800 text-sm truncate">{res.name}</p>
                      <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${typeBadgeColors[res.type] || 'bg-gray-100 text-gray-600'}`}>
                        {typeLabels[res.type] || res.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex gap-3 font-semibold">
                        <span className="text-green-600">✓ {res.correct}</span>
                        <span className="text-red-400">✗ {res.wrong}</span>
                      </div>
                      <span className="text-xs font-bold text-blue-600">{pct}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
