import axios from 'axios';

const API = axios.create({
  baseURL: 'https://abacus-comp-new.vercel.app', // Adjust if needed
});

console.log("hi")
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
