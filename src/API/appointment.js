import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export const getAppointments = async () => {
  const { data } = await axios.get(`${BASE_URL}/appointment/find-all`);
  return data;
};

export const deleteAppointment = async (id) => {
  const { data } = await axios.delete(`${BASE_URL}/appointment/delete/${id}`);
  return data;
};

export const createAppointment = async (appointment) => {
  const { data } = await axios.post(
    `${BASE_URL}/appointment/save`,
    appointment
  );
  return data;
};

export const updateAppointmentFunction = async (appointment) => {
  const { data } = await axios.put(
    `${BASE_URL}/appointment/update/${appointment.id}`,
    appointment
  );
  return data;
};
