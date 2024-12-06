import axios from "../utils/axios";

export const getClients = async (fullname = '') => {
    const response = await axios.get(`/admin/get-client${fullname ? `?fullname=${fullname}` : ''}`);
    return response.data;
  };
  

export const createClient = async (data) => {
  const response = await axios.post("/admin/create-client", data);
  return response.data;
};
