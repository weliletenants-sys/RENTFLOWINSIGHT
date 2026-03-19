import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await api.post('/login', credentials);
  return response.data;
};

export const registerUser = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  phone?: string;
}) => {
  const response = await api.post('/register', userData);
  return response.data;
};
