import axios from "../utils/axios";

export const getClients = async ({ fullname = '', page = 1, pageSize = 10 } = {}) => {
  const response = await axios.get('/admin/get-client', {
    params: {
      fullname,
      page,
      limit: pageSize
    }
  });
  return response.data;
};

export const createClient = async (data) => {
  const response = await axios.post("/admin/create-client", data);
  return response.data;
};

export const updateClient = async (id, data) => {
  const response = await axios.patch(`/admin/update-client/${id}`, data);
  return response.data;
};

export const deleteClient = async (id) => {
  const response = await axios.delete(`/admin/delete-client/${id}`);
  return response.data;
};