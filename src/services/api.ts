import axios from 'axios';
import type { GraphData, UserInput } from '../types';

// 1. Get the base URL from our environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error(
    'Error: VITE_API_BASE_URL is not set in your .env file.'
  );
}

// 2. Create the axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. Export all our API functions
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
  const response = await api.post(`/api/users/${userId}/link`, { friendId });
  return response.data;
};

export const unlinkUsers = async (userId: string, friendId: string) => {
  const response = await api.delete(`/api/users/${userId}/unlink`, {
    data: { friendId }, // DELETE requests send body in 'data' field
  });
  return response.data;
};

// Export the default instance if needed
export default api;