import { useState } from 'react';
import { useUsers } from '../context/UserContext';

export default function AddUserModal({ isOpen, onClose }) {
  const { addUser } = useUsers();
  const [form, setForm] = useState({ username: '', password: '', role: '', level: '' });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addUser(form);
    onClose();
    setForm({ username: '', password: '', role: '', level: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="username" required value={form.username} onChange={handleChange} placeholder="Username" className="w-full border rounded p-2" />
          <input name="password" required value={form.password} onChange={handleChange} type="password" placeholder="Password" className="w-full border rounded p-2" />
          <input name="role" required value={form.role} onChange={handleChange} placeholder="Role (e.g., admin)" className="w-full border rounded p-2" />
          <input name="level" value={form.level} onChange={handleChange} placeholder="Level (optional)" className="w-full border rounded p-2" />
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
}
