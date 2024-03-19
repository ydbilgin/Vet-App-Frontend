import axios from "axios";

export const getAppointments = async () => {
  const { data } = await axios.get(
    import.meta.env.REACT_APP_BASE_URL + "/appointment/find-all"
  );
  return data;
};

export const deleteAppointment = async (id) => {
  const { data } = await axios.delete(
    `${import.meta.env.REACT_APP_BASE_URL}/appointment/delete/${id}`
  );
  return data;
};

export const createAppointment = async (appointment) => {
  const { data } = await axios.post(
    `${import.meta.env.REACT_APP_BASE_URL}/appointment/save`,
    appointment
  );
  return data;
};

export const updateAppointmentFunction = async (appointment) => {
  const { data } = await axios.put(
    `${import.meta.env.REACT_APP_BASE_URL}/appointment/update/${
      appointment.id
    }`,
    appointment
  );
  return data;
};
