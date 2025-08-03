import { useState } from 'react';
import { useUsers } from '../context/UserContext';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import AddUserModal from '../components/AddUserModal';
import EditUserModal from '../components/EditUserModal';

export default function Users() {
  const { users, loading, deleteUser } = useUsers();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  if (loading) return <div className="p-6">Loading users...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">User Management</h1>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <FiPlus /> Add User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="text-left px-6 py-3">Username</th>
              <th className="text-left px-6 py-3">Role</th>
              <th className="text-left px-6 py-3">Level</th>
              <th className="text-left px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-3">{u.username}</td>
                <td className="px-6 py-3">{u.role}</td>
                <td className="px-6 py-3">{u.level || '-'}</td>
                <td className="px-6 py-3 space-x-4 text-lg">
                  <button
                    onClick={() => setEditUser(u)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => deleteUser(u._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddUserModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} />
      {editUser && (
        <EditUserModal user={editUser} onClose={() => setEditUser(null)} />
      )}
    </div>
  );
}
