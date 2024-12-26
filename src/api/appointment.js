import axios from "../utils/axios";

export const getAppointments = async ({
  therapistId,
  clientId,
  status,
} = {}) => {
  const response = await axios.get("/appointments", {
    params: { therapistId, clientId, status },
  });
  return response.data;
};

export const getAppointmentById = async (id) => {
  const response = await axios.get(`/appointments/${id}`);
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

export const createClientNote = async (appointmentId, data) => {
  const response = await axios.post(
    `/appointments/create-client-note/${appointmentId}`,
    data
  );
  return response.data;
};

export const getClientNotes = async (appointmentId) => {
  const response = await axios.get(
    `/appointments/client-notes/${appointmentId}`
  );
  return response.data;
};

export const addDocumentNote = async (appointmentId, data) => {
  const response = await axios.post(
    `/appointments/add-document-note/${appointmentId}`,
    data
  );
  return response.data;
};
