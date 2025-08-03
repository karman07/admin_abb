import { useState } from 'react';
import { useUsers } from '../context/UserContext';

export default function EditUserModal({ user, onClose }) {
  const { updateUser } = useUsers();
  const [form, setForm] = useState({ ...user });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUser(user._id, form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="username" value={form.username} onChange={handleChange} placeholder="Username" className="w-full border rounded p-2" />
          <input name="password" type="password" onChange={handleChange} placeholder="New Password (optional)" className="w-full border rounded p-2" />
          <input name="role" value={form.role} onChange={handleChange} placeholder="Role" className="w-full border rounded p-2" />
          <input name="level" value={form.level} onChange={handleChange} placeholder="Level" className="w-full border rounded p-2" />
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
