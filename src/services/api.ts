import axios from 'axios';
import type { GraphData, UserInput } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    'VITE_API_BASE_URL is not set. Please configure it in your .env file.'
  );
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getGraphData = async () => {
  const response = await api.get<GraphData>('/api/graph');
  return response.data;
};

export const createUser = async (userData: UserInput) => {
  const response = await api.post('/api/users', userData);
  return response.data;
};

export const updateUser = async (id: string, userData: Partial<UserInput>) => {
  const response = await api.put(`/api/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await api.delete(`/api/users/${id}`);
  return response.data;
};

export const linkUsers = async (userId: string, friendId: string) => {
  const response = await api.post(`/api/users/${userId}/link`, { friend_id: friendId }); 
  return response.data;
};

export const unlinkUsers = async (userId: string, friendId: string) => {
  const response = await api.delete(`/api/users/${userId}/unlink`, {
    data: { friendId }, 
  });
  return response.data;
};

export default api;