import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export const getCustomers = async () => {
  const { data } = await axios.get(`${BASE_URL}/customer/find-all`);
  return data;
};

export const deleteCustomer = async (id) => {
  const { data } = await axios.delete(`${BASE_URL}/customer/delete/${id}`);
  return data;
};

export const createCustomer = async (customer) => {
  const { data } = await axios.post(`${BASE_URL}/customer/save`, customer);
  return data;
};

export const updateCustomerFunction = async (customer) => {
  const { data } = await axios.put(
    `${BASE_URL}/customer/update/${customer.id}`,
    customer
  );
  return data;
};

export const getCustomerById = async (id) => {
  const { data } = await axios.get(`${BASE_URL}/customer/${id}`);
  return data;
};

export const getCustomerByName = async (name) => {
  const { data } = await axios.get(`${BASE_URL}/customer/name/${name}`);
  return data;
};
