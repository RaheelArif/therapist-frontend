import axios from '../utils/axios';

export const login = async (credentials) => {
  const response = await axios.post('/auth/login', credentials);
  return response.data;
};