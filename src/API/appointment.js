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

export const getAppointmentBetweenTwoDates = async (startDate, endDate) => {
  const { data } = await axios.get(
    `${BASE_URL}/appointment/expiring/${encodeURIComponent(
      startDate
    )}/${encodeURIComponent(endDate)}`
  );
  return data;
};

export const getAppointmentBetweenTwoDatesWithDoctor = async (
  startDate,
  endDate,
  name
) => {
  const { data } = await axios.get(
    `${BASE_URL}/appointment/expiring/${name}/${encodeURIComponent(
      startDate
    )}/${encodeURIComponent(endDate)}`
  );
  return data;
};

export const getAppointmentBeforeDate = async (endDate) => {
  const { data } = await axios.get(
    `${BASE_URL}/appointment/expiring-before/${encodeURIComponent(endDate)}`
  );
  return data;
};

export const getAppointmentBeforeDateWithDoctor = async (endDate, name) => {
  const { data } = await axios.get(
    `${BASE_URL}/appointment/expiring-before/${name}/${encodeURIComponent(
      endDate
    )}`
  );
  return data;
};

export const getAppointmentAfterDate = async (startDate) => {
  const { data } = await axios.get(
    `${BASE_URL}/appointment/expiring-after/${encodeURIComponent(startDate)}`
  );
  return data;
};
export const getAppointmentAfterDateWithDoctor = async (startDate, name) => {
  const { data } = await axios.get(
    `${BASE_URL}/appointment/expiring-after/${name}/${encodeURIComponent(
      startDate
    )}`
  );
  return data;
};

export const getAppointmentByDoctor = async (name) => {
  const { data } = await axios.get(
    `${BASE_URL}/appointment/doctor-name/${name}`
  );
  return data;
};
