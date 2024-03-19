import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export const getReports = async () => {
  const { data } = await axios.get(`${BASE_URL}/report/find-all`);
  return data;
};

export const deleteReport = async (id) => {
  const { data } = await axios.delete(`${BASE_URL}/report/delete/${id}`);
  return data;
};

export const createReport = async (report) => {
  const { data } = await axios.post(`${BASE_URL}/report/save`, report);
  return data;
};

export const updateReportFunction = async (report) => {
  const { data } = await axios.put(
    `${BASE_URL}/report/update/${report.id}`,
    report
  );
  return data;
};
