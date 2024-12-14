// api/therapist.js
import axios from "../utils/axios";

export const getTherapists = async (fullname = '') => {
  const response = await axios.get(`/admin/get-therapist${fullname ? `?fullname=${fullname}` : ''}`);
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

// If you need these additional functions:
export const updateTherapist = async (id, data) => {
  const response = await axios.put(`/admin/update-therapist/${id}`, data);
  return response.data;
};

export const getTherapistById = async (id) => {
  const response = await axios.get(`/admin/get-therapist/${id}`);
  return response.data;
};