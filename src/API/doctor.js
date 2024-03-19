import axios from "axios";

export const getDoctors = async () => {
  const { data } = await axios.get(
    import.meta.env.VITE_APP_BASE_URL + "/doctor/find-all"
  );
  return data;
};

export const deleteDoctor = async (id) => {
  const { data } = await axios.delete(
    `${import.meta.env.VITE_APP_BASE_URL}/doctor/delete/${id}`
  );
  return data;
};

export const createDoctor = async (doctor) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_APP_BASE_URL}/doctor/save`,
    doctor
  );
  return data;
};

export const updateDoctorFunction = async (doctor) => {
  const { data } = await axios.put(
    `${import.meta.env.VITE_APP_BASE_URL}/doctor/update/${doctor.id}`,
    doctor
  );
  return data;
};
