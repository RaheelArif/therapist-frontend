// File 1: src/api/therapist.js
import axios from "../utils/axios";

export const getTherapists = async ({
  fullname = "",
  page = 1,
  pageSize = 10,
  therapistType,
} = {}) => {
  const response = await axios.get("/admin/get-therapist", {
    params: {
      fullname,
      page,
      limit: pageSize,
      therapistType,
    },
  });
  return response.data;
};

export const createTherapist = async (data) => {
  const response = await axios.post("/admin/create-therapist", data);
  return response.data;
};

export const updateTherapist = async (id, data) => {
  const response = await axios.patch(`/admin/update-therapist/${id}`, data);
  return response.data;
};

export const deleteTherapist = async (id) => {
  const response = await axios.delete(`/admin/delete-therapist/${id}`);
  return response.data;
};
