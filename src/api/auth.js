import axios from '../utils/axios';

export const login = async (credentials) => {
  const response = await axios.post('/auth/login', credentials);
  return response.data;
};
export const getProfile = async () => {
  const response = await axios.get('/auth/profile');
  return response.data;
};
