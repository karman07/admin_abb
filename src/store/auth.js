import { create } from 'zustand'

const useAuth = create((set) => ({
  token: localStorage.getItem('token') || null,
  user: null,

  login: (token, user) => {
    localStorage.setItem('token', token);
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
}));

export default useAuth;
