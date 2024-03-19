import React, { useState, useEffect } from "react";
import {
  getReports,
  createReport,
  deleteReport,
  updateReportFunction,
} from "../../API/report";
import { getAppointments } from "../../API/appointment";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import "./Report.css";
import Modal from "../../Components/Modal.jsx";

function Report() {
  const [report, setReport] = useState([]);
  const [appointment, setAppointment] = useState([]);
  const [reload, setReload] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isReportEditModalOpen, setIsReportEditModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const unassignedAppointments = appointment.filter(
    (appointment) =>
      !report.some((report) => report.appointment.id === appointment.id)
  );
  const handleSearch = (event) => {
    setSearchTerm(event.target.value); // Metin filtreleme terimini güncelle
  };
  const filteredReports = report.filter((item) =>
    Object.values(item).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const [newReport, setNewReport] = useState({
    title: "",
    diagnosis: "",
    price: "",
    appointment: {
      id: "",
    },
  });

  const [updateReport, setUpdateReport] = useState({
    title: "",
    diagnosis: "",
    price: "",
    appointment: {
      id: "",
    },
  });

  useEffect(() => {
    Promise.all([getReports(), getAppointments()])
      .then(([reportData, appointmentData]) => {
        setReport(reportData);
        setAppointment(appointmentData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    setReload(false);
  }, [reload]);

  const handleDelete = (id) => {
    deleteReport(id)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data);
        setShowModal(true);
      });
  };

  const handleNewReport = (event) => {
    const { name, value } = event.target;
    if (name === "appointmentId") {
      setNewReport((prevReport) => ({
        ...prevReport,
        appointment: {
          id: value,
        },
      }));
    } else {
      setNewReport((prevReport) => ({
        ...prevReport,
        [name]: value,
      }));
    }
  };
  const handleCreate = () => {
    createReport(newReport)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data);
        setShowModal(true);
      });
    setNewReport({
      title: "",
      diagnosis: "",
      price: "",
      appointment: {
        id: "",
      },
    });
  };

  const handleUpdateBtn = (report) => {
    setUpdateReport({
      id: report.id,
      title: report.title,
      diagnosis: report.diagnosis,
      price: report.price,
      appointment: {
        id: report.appointment.id,
      },
    });
    setIsReportEditModalOpen(true);
  };
  const handleUpdateAppointmentChange = (event) => {
    setUpdateReport({
      ...updateReport,
      appointment: {
        id: event.target.value,
      },
    });
  };
  const handleUpdateChange = (event) => {
    setUpdateReport({
      ...updateReport,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdate = () => {
    updateReportFunction(updateReport)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data);
        setShowModal(true);
      });
    setUpdateReport({
      title: "",
      diagnosis: "",
      price: "",
      appointment: {
        id: "",
      },
    });
    setIsReportEditModalOpen(false);
  };
  const handleCloseError = () => {
    setError(null); // Hata mesajını kapat
    setShowModal(false); // Modal popup'u kapat
  };
  const selectedAppointmentDate =
    updateReport.appointment.id &&
    report.find((item) => item.appointment.id === updateReport.appointment.id)
      ?.appointment.appointmentDate;

  return (
    <div className="report-container">
      {showModal && (
        <Modal handleCloseModal={handleCloseError}>
          {error.message ? <p>{error.message}</p> : <p>{error}</p>}
        </Modal>
      )}

      <div className="top">
        <div className="report-title">
          <h1>Rapor</h1>
        </div>
        <div className="report-search">
          <input
            type="text"
            placeholder="Ara"
            value={searchTerm}
            onChange={handleSearch}
          />{" "}
        </div>
      </div>

      <div className="report-list">
        <h1>Rapor listesi</h1>
        <table className="report-list-table">
          <thead>
            <tr>
              <th>Başlık</th>
              <th>Tanı</th>
              <th>Fiyat</th>
              <th>Randevu</th>
              <th>Doktor</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.id}>
                <td>{report.title}</td>
                <td>{report.diagnosis}</td>
                <td>{report.price}</td>
                <td>{report.appointment.appointmentDate}</td>
                <td>{report.appointment.doctor.name}</td>
                <td>
                  <span>
                    <DeleteIcon onClick={() => handleDelete(report.id)} />
                  </span>
                </td>
                <td>
                  <span>
                    <EditIcon onClick={() => handleUpdateBtn(report)} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="report-inputs">
        <input
          type="text"
          placeholder="Başlık"
          name="title"
          value={newReport.title}
          onChange={handleNewReport}
        />
        <input
          type="text"
          placeholder="Tanı"
          name="diagnosis"
          value={newReport.diagnosis}
          onChange={handleNewReport}
        />
        <input
          type="number"
          placeholder="Fiyat"
          name="price"
          value={newReport.price}
          onChange={handleNewReport}
        />
        <select
          name="appointmentId"
          value={newReport.appointment.id}
          onChange={handleNewReport}
        >
          <option value="" disabled>
            Randevu seçiniz
          </option>
          {unassignedAppointments.map((appointment) => (
            <option key={appointment.id} value={appointment.id}>
              {appointment.appointmentDate}
            </option>
          ))}
        </select>
        <button className="report-add-button" onClick={handleCreate}>
          Ekle
        </button>
      </div>
      <div className="report-update-div">
        {isReportEditModalOpen && (
          <Modal handleCloseModal={() => setIsReportEditModalOpen(false)}>
            <div className="report-inputs">
              <label htmlFor="">Başlık</label>
              <input
                type="text"
                placeholder="Başlık"
                name="title"
                value={updateReport.title}
                onChange={handleUpdateChange}
              />
              <label htmlFor="">Tanı</label>
              <input
                type="text"
                placeholder="Tanı"
                name="diagnosis"
                value={updateReport.diagnosis}
                onChange={handleUpdateChange}
              />
              <label htmlFor="">Fiyat</label>
              <input
                type="number"
                placeholder="Fiyat"
                name="price"
                value={updateReport.price}
                onChange={handleUpdateChange}
              />
              <label htmlFor="">Randevu</label>
              <select
                name="appointmentId"
                value={updateReport.appointment.id}
                onChange={handleUpdateAppointmentChange}
              >
                <option value="" disabled>
                  Randevu seçiniz
                </option>
                <option value="">{selectedAppointmentDate}</option>
                {unassignedAppointments.map((appointment) => (
                  <option key={appointment.id} value={appointment.id}>
                    {appointment.appointmentDate}
                  </option>
                ))}
              </select>
              <button className="report-update-button" onClick={handleUpdate}>
                Güncelle
              </button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
export default Report;
