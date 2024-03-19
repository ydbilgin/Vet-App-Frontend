import axios from "axios";

export const getVaccines = async () => {
  const { data } = await axios.get(
    import.meta.env.VITE_APP_BASE_URL + "/vaccine/find-all"
  );
  return data;
};

export const deleteVaccine = async (id) => {
  const { data } = await axios.delete(
    `${import.meta.env.VITE_APP_BASE_URL}/vaccine/delete/${id}`
  );
  return data;
};

export const createVaccine = async (vaccine) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_APP_BASE_URL}/vaccine/save`,
    vaccine
  );
  return data;
};

export const updateVaccineFunction = async (vaccine) => {
  const { data } = await axios.put(
    `${import.meta.env.VITE_APP_BASE_URL}/vaccine/update/${vaccine.id}`,
    vaccine
  );
  return data;
};
