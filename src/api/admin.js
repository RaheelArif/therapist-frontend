// api/admin.js
import axios from "../utils/axios";


export const getAdmins = async ({ fullname = '', page = 1, pageSize = 10 } = {}) => {
  const response = await axios.get('/admin/get-admins', {
    params: {
      fullname, // Search by name
      page, // Pagination
      limit: pageSize, // Page size
    },
  });
  return response.data;
};


  export const createAdmin = async (data) => {
    const response = await axios.post("/admin/create-admin", data);
    return response.data;
  };
  export const deleteAdmin = async (id) => {
    const response = await axios.delete(`/admin/delete-admin/${id}`);
    return response.data;
  };

  export const getAllUsers = async () => {
    const response = await axios.get('/admin/get-all-user');
    return response.data;
  };
  export const getUserCounts = async () => {
    const response = await axios.get('/admin/count-by-role');
    return response.data;
  };