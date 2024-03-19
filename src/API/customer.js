import axios from "axios";

export const getCustomers = async () => {
  const { data } = await axios.get(
    import.meta.env.VITE_APP_BASE_URL + "/customer/find-all"
  );
  return data;
};

export const deleteCustomer = async (id) => {
  const { data } = await axios.delete(
    `${import.meta.env.VITE_APP_BASE_URL}/customer/delete/${id}`
  );
  return data;
};

export const createCustomer = async (customer) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_APP_BASE_URL}/customer/save`,
    customer
  );
  return data;
};

export const updateCustomerFunction = async (customer) => {
  const { data } = await axios.put(
    `${import.meta.env.VITE_APP_BASE_URL}customer/update/${customer.id}`,
    customer
  );
  return data;
};

export const getCustomerById = async (id) => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_APP_BASE_URL}/customer/${id}`
  );
  return data;
};
