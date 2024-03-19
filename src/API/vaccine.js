import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export const getVaccines = async () => {
  const { data } = await axios.get(`${BASE_URL}/vaccine/find-all`);
  return data;
};

export const deleteVaccine = async (id) => {
  const { data } = await axios.delete(`${BASE_URL}/vaccine/delete/${id}`);
  return data;
};

export const createVaccine = async (vaccine) => {
  const { data } = await axios.post(`${BASE_URL}/vaccine/save`, vaccine);
  return data;
};

export const updateVaccineFunction = async (vaccine) => {
  const { data } = await axios.put(
    `${BASE_URL}/vaccine/update/${vaccine.id}`,
    vaccine
  );
  return data;
};
