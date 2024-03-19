import React, { useState, useEffect } from "react";
import {
  createAvailableDate,
  deleteAvailableDate,
  getAvailableDatesByDoctorId,
} from "../../API/available-date";
import "./AvailableDate.css";
import { getDoctors } from "../../API/doctor";
import Modal from "../../Components/Modal.jsx";

function AvailableDate() {
  const [doctor, setDoctor] = useState([]);
  const [reload, setReload] = useState(true);
  const [error, setError] = useState(null); // setError durumunu tanımlayın
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleCloseError = () => {
    setError(null); // Hata mesajını kapat
    setShowModal(false); // Modal popup'u kapat
  };

  useEffect(() => {
    getDoctors()
      .then((data) => {
        setDoctor(data);
      })
      .catch((error) => {
        setError(error.response.data); // createAvailableDate başarısız olursa hata ayarlayın
        setShowModal(true); // Varsayılan olarak setShowModal olduğunu varsayarak
      });
    setReload(false);
  }, [reload]);

  const [newAvailableDate, setNewAvailableDate] = useState({
    availableDate: "",
    doctor: {
      id: "",
    },
  });

  const handleNewAvailableDate = (event) => {
    const { name, value } = event.target;
    if (name === "doctorId") {
      setNewAvailableDate((prevAvailableDate) => ({
        ...prevAvailableDate,
        doctor: {
          id: value,
        },
      }));
    } else {
      setNewAvailableDate((prevAvailableDate) => ({
        ...prevAvailableDate,
        [name]: value,
      }));
    }
  };

  const handleCreateAvailableDate = () => {
    createAvailableDate(newAvailableDate)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data); // createAvailableDate başarısız olursa hata ayarlayın
        setShowModal(true); // Modalı aç
      });
    setNewAvailableDate({
      availableDate: "",
      doctor: {
        id: "",
      },
    });
  };

  return (
    <div className="available-date-add-container">
      {showModal && (
        <Modal handleCloseModal={handleCloseError}>
          {error.message ? <p>{error.message}</p> : <p>{error}</p>}
        </Modal>
      )}

      <h1>Çalışma Günü Ekle</h1>
      <div className="available-date-new-available-date">
        <input
          type="date"
          placeholder="availableDate"
          name="availableDate"
          value={newAvailableDate.availableDate}
          onChange={handleNewAvailableDate}
        />

        <select
          name="doctorId"
          value={newAvailableDate.doctor.id}
          onChange={handleNewAvailableDate}
        >
          <option value="" disabled>
            Doktor
          </option>
          {doctor.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
            </option>
          ))}
        </select>

        <button
          className="doctor-add-button"
          onClick={handleCreateAvailableDate}
        >
          Ekle
        </button>
      </div>
    </div>
  );
}

export default AvailableDate;
