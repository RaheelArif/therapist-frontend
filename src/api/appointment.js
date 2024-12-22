import axios from "../utils/axios";

export const getAppointments = async ({ therapistId, clientId, status } = {}) => {
  const response = await axios.get('/appointments', {
    params: { therapistId, clientId, status }
  });
  return response.data;
};

export const createAppointment = async (data) => {
  const response = await axios.post("/appointments", data);
  return response.data;
};

export const updateAppointment = async (id, data) => {
  const response = await axios.patch(`/appointments/${id}`, data);
  return response.data;
};

export const deleteAppointment = async (id) => {
  const response = await axios.delete(`/appointments/${id}`);
  return response.data;
};