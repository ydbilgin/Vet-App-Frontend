import axios from "axios";

export const getAnimals = async () => {
  const { data } = await axios.get(
    import.meta.env.VITE_APP_BASE_URL + "/animal/find-all"
  );
  return data;
};

export const deleteAnimal = async (id) => {
  const { data } = await axios.delete(
    `${import.meta.env.VITE_APP_BASE_URL}/animal/delete/${id}`
  );
  return data;
};

export const createAnimal = async (animal) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_APP_BASE_URL}/animal/save`,
    animal
  );
  return data;
};

export const updateAnimalFunction = async (animal) => {
  const { data } = await axios.put(
    `${import.meta.env.VITE_APP_BASE_URL}/update/${animal.id}`,
    animal
  );
  return data;
};
