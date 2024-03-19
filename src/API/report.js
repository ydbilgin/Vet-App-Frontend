import axios from "axios";

export const getReports = async () => {
  const { data } = await axios.get(
    import.meta.env.REACT_APP_BASE_URL + "/report/find-all"
  );
  return data;
};

export const deleteReport = async (id) => {
  const { data } = await axios.delete(
    `${import.meta.env.REACT_APP_BASE_URL}/report/delete/${id}`
  );
  return data;
};

export const createReport = async (report) => {
  const { data } = await axios.post(
    `${import.meta.env.REACT_APP_BASE_URL}/report/save`,
    report
  );
  return data;
};

export const updateReportFunction = async (report) => {
  const { data } = await axios.put(
    `${import.meta.env.REACT_APP_BASE_URL}/report/update/${report.id}`,
    report
  );
  return data;
};
