// src/pages/Results.jsx
import { useEffect, useState } from 'react';
import API from '../services/api';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';

const COLORS = ['#82ca9d', '#f87171'];

const typeLabels = {
  '0': 'Accuracy Abacus',
  '1': 'Accuracy Mentally',
  '2': 'Speed',
};

export default function Results() {
  const [results, setResults] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    correct: '',
    wrong: '',
  });
  const [search, setSearch] = useState('');

  const fetchResults = async () => {
    const res = await API.get('/result');
    setResults(res.data);
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, type, correct, wrong } = formData;
    if (!name || type === '' || correct === '' || wrong === '') return;

    await API.post('/result', {
      name,
      type,
      correct: Number(correct),
      wrong: Number(wrong),
    });

    setFormData({ name: '', type: '', correct: '', wrong: '' });
    fetchResults();
  };

  const filtered = results.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      typeLabels[r.type]?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center">Dashboard</h1>

      {/* <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-lg shadow-md"
      >
        <div className="grid md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="border p-2 rounded w-full"
          />
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value })
            }
            className="border p-2 rounded w-full"
          >
            <option value="">Select Type</option>
            <option value="0">Accuracy Abacus</option>
            <option value="1">Accuracy Mentally</option>
            <option value="2">Speed</option>
          </select>
          <input
            type="number"
            placeholder="Correct"
            value={formData.correct}
            onChange={(e) =>
              setFormData({ ...formData, correct: e.target.value })
            }
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="Wrong"
            value={formData.wrong}
            onChange={(e) =>
              setFormData({ ...formData, wrong: e.target.value })
            }
            className="border p-2 rounded w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Submit Result
        </button>
      </form> */}

      {/* Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <input
          type="text"
          placeholder="Search by name or type"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-2 md:mt-0 border p-2 rounded w-full md:w-64"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow text-sm">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Correct / Wrong</th>
              <th className="p-3">Chart</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((res, idx) => {
              const chartData = [
                { name: 'Correct', value: res.correct },
                { name: 'Wrong', value: res.wrong },
              ];
              return (
                <tr key={idx} className="border-t">
                  <td className="p-3">{res.name}</td>
                  <td className="p-3">{typeLabels[res.type]}</td>
                  <td className="p-3">
                    ✅ {res.correct} / ❌ {res.wrong}
                  </td>
                  <td className="p-3">
                    <PieChart width={80} height={80}>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius={30}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
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
    </div>
  );
}
