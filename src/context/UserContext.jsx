import { createContext, useContext, useEffect, useState } from 'react';
import API from '../services/api';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    setLoading(true);
    API.get('/users')
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false));
  };

  const addUser = async (user) => {
    await API.post('/users', user);
    fetchUsers();
  };

  const updateUser = async (id, data) => {
    await API.patch(`/users/${id}`, data);
    fetchUsers();
  };

  const deleteUser = async (id) => {
    await API.delete(`/users/${id}`);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UserContext.Provider value={{ users, loading, addUser, updateUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUsers = () => useContext(UserContext);
