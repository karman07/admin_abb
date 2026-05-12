import { useState, useCallback } from 'react';
import API from '../services/api';
import {
  FiSearch, FiChevronRight, FiEdit2, FiTrash2, FiPlus,
  FiSave, FiX, FiCheck, FiAlertTriangle,
} from 'react-icons/fi';

const EXAM_TYPES = [
  { value: 'accuracy-abacus', typeKey: 'accuracy_abacus', label: 'Accuracy Abacus', endpoint: '/accuracy-abacus', color: 'bg-blue-50 text-blue-700', border: 'border-blue-500' },
  { value: 'accuracy-mentally', typeKey: 'accuracy_mentally', label: 'Accuracy Mentally', endpoint: '/accuracy-mentally', color: 'bg-purple-50 text-purple-700', border: 'border-purple-500' },
  { value: 'speed', typeKey: 'speed', label: 'Speed', endpoint: '/speed', color: 'bg-orange-50 text-orange-700', border: 'border-orange-500' },
];

const SUGGESTED_LEVELS = ['level1', 'level2', 'level3', 'level4', 'level5'];

// Default shape for a new entry
const blankEntry = () => ({ multiplication: false, division: false, Digit: 1, Questions: 10, Rows: 5 });

// Render a single cell value as an editable control
function FieldCell({ value, onChange }) {
  if (typeof value === 'boolean') {
    return (
      <select
        value={String(value)}
        onChange={(e) => onChange(e.target.value === 'true')}
        className="border border-gray-200 rounded-lg px-2 py-1 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 w-20"
      >
        <option value="false">false</option>
        <option value="true">true</option>
      </select>
    );
  }
  if (typeof value === 'number') {
    return (
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="border border-gray-200 rounded-lg px-2 py-1 text-xs w-20 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    );
  }
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-200 rounded-lg px-2 py-1 text-xs w-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  );
}

export default function Performance() {
  const [type, setType] = useState('accuracy-abacus');
  const [level, setLevel] = useState('level1');
  const [levelData, setLevelData] = useState(null); // { "1": {...}, "2": {...}, Total: n }
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveMsg, setSaveMsg] = useState('');
  const [editingKey, setEditingKey] = useState(null);   // key currently being edited
  const [editBuf, setEditBuf] = useState({});           // buffer for in-row edits
  const [addingNew, setAddingNew] = useState(false);
  const [newEntry, setNewEntry] = useState(blankEntry());
  const [newKey, setNewKey] = useState('');

  const selected = EXAM_TYPES.find((t) => t.value === type);

  const fetchData = async (lvl = level) => {
    if (!lvl.trim()) return;
    setLoading(true);
    setError('');
    setSaveMsg('');
    setLevelData(null);
    setEditingKey(null);
    setAddingNew(false);
    try {
      const res = await API.get(`${selected.endpoint}/${lvl}`);
      setLevelData(res.data.data);
    } catch {
      setError(`No data found for "${selected.label}" at level "${lvl}".`);
    } finally {
      setLoading(false);
    }
  };

  // Collect all field keys across all numeric entries
  const allFields = useCallback(() => {
    if (!levelData) return [];
    const keys = new Set();
    Object.entries(levelData).forEach(([k, v]) => {
      if (k !== 'Total' && typeof v === 'object') Object.keys(v).forEach((f) => keys.add(f));
    });
    return [...keys];
  }, [levelData]);

  const numericEntries = levelData
    ? Object.entries(levelData).filter(([k]) => k !== 'Total')
    : [];

  // Start editing a row
  const startEdit = (key, val) => {
    setEditingKey(key);
    setEditBuf({ ...val });
    setAddingNew(false);
  };

  const cancelEdit = () => { setEditingKey(null); setEditBuf({}); };

  const commitEdit = (key) => {
    setLevelData((prev) => ({ ...prev, [key]: { ...editBuf } }));
    setEditingKey(null);
    setEditBuf({});
  };

  const deleteEntry = (key) => {
    setLevelData((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const commitAdd = () => {
    if (!newKey.trim()) return;
    setLevelData((prev) => ({ ...prev, [newKey.trim()]: { ...newEntry } }));
    setAddingNew(false);
    setNewEntry(blankEntry());
    setNewKey('');
  };

  const saveChanges = async () => {
    if (!levelData) return;
    setSaving(true);
    setError('');
    setSaveMsg('');
    try {
      await API.put(`${selected.endpoint}/${level}`, levelData);
      setSaveMsg('Changes saved successfully.');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch {
      setError('Failed to save. Make sure you are logged in as admin.');
    } finally {
      setSaving(false);
    }
  };

  const fields = allFields();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Performance Data</h2>
        <p className="text-sm text-gray-400 mt-0.5">View and edit level-wise exam format data</p>
      </div>

      {/* Exam type selector */}
      <div className="grid grid-cols-3 gap-4">
        {EXAM_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => { setType(t.value); setLevelData(null); setError(''); setSaveMsg(''); setEditingKey(null); setAddingNew(false); }}
            className={`rounded-2xl p-4 text-left border-2 transition-all ${
              type === t.value ? `${t.border} bg-white shadow-sm` : 'border-transparent bg-white hover:border-gray-200 shadow-sm'
            }`}
          >
            <p className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block mb-2 ${t.color}`}>{t.label}</p>
            <p className="text-xs text-gray-400">PUT /{t.value}/:level</p>
          </button>
        ))}
      </div>

      {/* Level picker */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Select Level</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {SUGGESTED_LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => { setLevel(l); setLevelData(null); setError(''); setSaveMsg(''); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                level === l ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={level}
            onChange={(e) => { setLevel(e.target.value); setLevelData(null); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && fetchData()}
            placeholder="Custom level (e.g. level6)"
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
          />
          <button
            onClick={() => fetchData()}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm font-semibold disabled:opacity-60"
          >
            <FiSearch className="w-4 h-4" />
            {loading ? 'Loading...' : 'Load Level'}
          </button>
        </div>
      </div>

      {/* Feedback banners */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-2xl px-5 py-3 text-sm">
          <FiAlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}
      {saveMsg && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-2xl px-5 py-3 text-sm">
          <FiCheck className="w-4 h-4 shrink-0" /> {saveMsg}
        </div>
      )}

      {/* Editor table */}
      {levelData && !loading && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Table header bar */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${selected.color}`}>{selected.label}</span>
              <FiChevronRight className="w-4 h-4 text-gray-300" />
              <span className="text-sm font-semibold text-gray-700">{level}</span>
              {typeof levelData.Total === 'number' && (
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Total: {levelData.Total}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setAddingNew(true); setEditingKey(null); }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition"
              >
                <FiPlus className="w-3.5 h-3.5" /> Add Entry
              </button>
              <button
                onClick={saveChanges}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
              >
                <FiSave className="w-3.5 h-3.5" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Entry rows */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wide bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-3 w-16">#</th>
                  {fields.map((f) => (
                    <th key={f} className="px-4 py-3">{f}</th>
                  ))}
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {numericEntries.map(([key, val]) => {
                  const isEditing = editingKey === key;
                  return (
                    <tr key={key} className={`transition-colors ${isEditing ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                      <td className="px-5 py-3 font-bold text-blue-600">{key}</td>
                      {fields.map((f) => (
                        <td key={f} className="px-4 py-3">
                          {isEditing ? (
                            <FieldCell
                              value={editBuf[f] !== undefined ? editBuf[f] : ''}
                              onChange={(v) => setEditBuf((b) => ({ ...b, [f]: v }))}
                            />
                          ) : (
                            <span className={`text-gray-700 ${typeof val[f] === 'boolean' ? (val[f] ? 'text-green-600 font-medium' : 'text-gray-400') : ''}`}>
                              {val[f] !== undefined ? String(val[f]) : <span className="text-gray-200">—</span>}
                            </span>
                          )}
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => commitEdit(key)}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition"
                                title="Confirm"
                              >
                                <FiCheck className="w-4 h-4" />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition"
                                title="Cancel"
                              >
                                <FiX className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEdit(key, val)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Edit"
                              >
                                <FiEdit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteEntry(key)}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                title="Delete"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {/* Add new entry row */}
                {addingNew && (
                  <tr className="bg-green-50 border-t-2 border-green-200">
                    <td className="px-5 py-3">
                      <input
                        type="text"
                        placeholder="Key"
                        value={newKey}
                        onChange={(e) => setNewKey(e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-1 text-xs w-16 focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                    </td>
                    {fields.map((f) => (
                      <td key={f} className="px-4 py-3">
                        <FieldCell
                          value={newEntry[f] !== undefined ? newEntry[f] : ''}
                          onChange={(v) => setNewEntry((prev) => ({ ...prev, [f]: v }))}
                        />
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={commitAdd}
                          className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition"
                          title="Add"
                        >
                          <FiCheck className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setAddingNew(false); setNewKey(''); setNewEntry(blankEntry()); }}
                          className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition"
                          title="Cancel"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Total editor */}
          {typeof levelData.Total === 'number' && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3 bg-gray-50">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</span>
              <input
                type="number"
                value={levelData.Total}
                onChange={(e) => setLevelData((prev) => ({ ...prev, Total: Number(e.target.value) }))}
                className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
