// File 1: src/api/therapist.js
import axios from "../utils/axios";

export const getTherapists = async ({ fullname = '', page = 1, pageSize = 10 } = {}) => {
  const response = await axios.get('/admin/get-therapist', {
    params: {
      fullname,
      page,
      limit: pageSize
    }
  });
  return response.data;
};



export const createTherapist = async (data) => {
  const response = await axios.post("/admin/create-therapist", data);
  return response.data;
};

export const deleteTherapist = async (id) => {
  const response = await axios.delete(`/admin/delete-therapist/${id}`);
  return response.data;
};


