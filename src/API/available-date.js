import axios from "axios";

export const createAvailableDate = async (availableDate) => {
  const { data } = await axios.post(
    `${import.meta.env.REACT_APP_BASE_URL}/available-dates/save`,
    availableDate
  );
  return data;
};

export const getAvailableDatesByDoctorId = async (doctorId) => {
  const { data } = await axios.get(
    `${import.meta.env.REACT_APP_BASE_URL}/available-dates/${doctorId}`
  );
  return data;
};

export const deleteAvailableDate = async (id) => {
  const { data } = await axios.delete(
    `${import.meta.env.REACT_APP_BASE_URL}/available-dates/delete/${id}`
  );
  return data;
};

export const updateAvailableDateFunction = async (availableDate) => {
  const { data } = await axios.put(
    `${import.meta.env.REACT_APP_BASE_URL}/available-dates/update/${
      availableDate.id
    }`,
    availableDate
  );
  return data;
};
