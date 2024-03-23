import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export const getAnimals = async () => {
  const { data } = await axios.get(`${BASE_URL}/animal/find-all`);
  return data;
};

export const deleteAnimal = async (id) => {
  const { data } = await axios.delete(`${BASE_URL}/animal/delete/${id}`);
  return data;
};

export const createAnimal = async (animal) => {
  const { data } = await axios.post(`${BASE_URL}/animal/save`, animal);
  return data;
};

export const updateAnimalFunction = async (animal) => {
  const { data } = await axios.put(
    `${BASE_URL}/animal/update/${animal.id}`,
    animal
  );
  return data;
};

export const getAnimalByName = async (name) => {
  const { data } = await axios.get(`${BASE_URL}/animal/name/${name}`);
  return data;
};

export const getAnimalByCustomerName = async (name) => {
  const { data } = await axios.get(`${BASE_URL}/animal/customer-name/${name}`);
  return data;
};

export const getAnimalByNameAndCustomerName = async (
  animalName,
  customerName
) => {
  const { data } = await axios.get(
    `${BASE_URL}/animal/customer-animal/${animalName}-${customerName}`
  );
  return data;
};
