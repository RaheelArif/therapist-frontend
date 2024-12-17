// api/admin.js
import axios from "../utils/axios";

export const getAdmins = async () => {
  const response = await axios.get('/admin/get-admins');
  return response.data;
};