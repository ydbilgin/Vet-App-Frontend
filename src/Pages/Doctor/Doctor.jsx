import React, { useState, useEffect } from "react";
import {
  getDoctors,
  deleteDoctor,
  createDoctor,
  updateDoctorFunction,
} from "../../API/doctor";
import {
  createAvailableDate,
  deleteAvailableDate,
  getAvailableDatesByDoctorId,
  updateAvailableDateFunction,
} from "../../API/available-date";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import "./Doctor.css";
import AvailableDate from "./AvailableDate.jsx";
import Modal from "../../Components/Modal.jsx";

function Doctor() {
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [doctor, setDoctor] = useState([]);
  const [reload, setReload] = useState(true);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedDoctorAvailableDates, setSelectedDoctorAvailableDates] =
    useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAvailableDateEditModalOpen, setIsAvailableDateEditModalOpen] =
    useState(false);
  const [isDoctorEditModalOpen, setIsDoctorEditModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    getDoctors().then((data) => {
      setDoctor(data);
    });
    fetchDoctors();
    console.log(doctor);
    setReload(false);
  }, [reload]);

  useEffect(() => {
    const results = doctor.filter((item) => {
      return (
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.mail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setSearchResults(results);
  }, [searchTerm, doctor]);

  const fetchDoctors = async () => {
    const doctorsData = await getDoctors();
    setDoctor(doctorsData)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data);
        setShowModal(true);
      });
  };

  const handleDoctorSelect = (doctorId) => {
    setSelectedDoctorId(doctorId);
    fetchAvailableDatesForSelectedDoctor(doctorId);
  };
  const fetchAvailableDatesForSelectedDoctor = async (doctorId) => {
    const availableDates = await getAvailableDatesByDoctorId(doctorId);
    setSelectedDoctorAvailableDates(availableDates)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data);
        setShowModal(true);
      });
  };

  const [newDoctor, setNewDoctor] = useState({
    name: "",
    mail: "",
    address: "",
    city: "",
    phone: "",
  });
  const [updateDoctor, setUpdateDoctor] = useState({
    name: "",
    mail: "",
    address: "",
    city: "",
    phone: "",
  });

  const [newAvailableDate, setNewAvailableDate] = useState({
    availableDate: "",
    doctor: {
      id: "",
    },
  });
  const [updateAvailableDate, setUpdateAvailableDate] = useState({
    availableDate: "",
    doctor: {
      id: "",
    },
  });

  const handleDelete = (id) => {
    deleteDoctor(id)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data); // Backendden gelen hatayı al
        setShowModal(true); // Modal popup'u göster
      });
  };

  const handleNewDoctor = (event) => {
    setNewDoctor({
      ...newDoctor,
      [event.target.name]: event.target.value,
    });
  };

  const handleCreate = () => {
    createDoctor(newDoctor)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data); // Backendden gelen hatayı al
        setShowModal(true); // Modal popup'u göster
      });
    setNewDoctor({
      name: "",
      mail: "",
      address: "",
      city: "",
      phone: "",
    });
  };
  const handleUpdateBtn = (doctor) => {
    setUpdateDoctor({
      id: doctor.id,
      name: doctor.name,
      mail: doctor.mail,
      address: doctor.address,
      city: doctor.city,
      phone: doctor.phone,
    });
    setIsDoctorEditModalOpen(true);
  };
  const handleUpdateChange = (event) => {
    setUpdateDoctor({
      ...updateDoctor,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdate = () => {
    updateDoctorFunction(updateDoctor)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data); // Backendden gelen hatayı al
        setShowModal(true); // Modal popup'u göster
      });
    setUpdateDoctor({
      name: "",
      mail: "",
      address: "",
      city: "",
      phone: "",
    });
    setIsDoctorEditModalOpen(false);
  };

  const handleAvailableDateUpdateBtn = (availableDate) => {
    setUpdateAvailableDate({
      id: availableDate.id,
      availableDate: availableDate.availableDate,
      doctor: {
        id: availableDate.doctor.id,
      },
    });
    setIsAvailableDateEditModalOpen(true);
  };
  const handleDeleteAvailableDate = (id) => {
    deleteAvailableDate(id)
      .then(() => {
        setReload(true);
        handleDoctorSelect(selectedDoctorId);
      })
      .catch((error) => {
        setError(error.response.data);
        setShowModal(true);
      });
  };
  const handleUpdateAvailableDate = () => {
    updateAvailableDateFunction(updateAvailableDate)
      .then(() => {
        setReload(true);
        handleDoctorSelect(selectedDoctorId);
      })
      .catch((error) => {
        setError(error.response.data); // Backendden gelen hatayı al
        setShowModal(true); // Modal popup'u göster
      });
    setUpdateAvailableDate({
      availableDate: "",
      doctor: {
        id: "",
      },
    });
    setIsAvailableDateEditModalOpen(false);
  };
  const handleUpdateAvailableDateDoctorChange = (event) => {
    setUpdateAvailableDate({
      ...updateAvailableDate,
      doctor: {
        id: event.target.value,
      },
    });
  };

  const handleUpdateAvailableDateChange = (event) => {
    setUpdateAvailableDate({
      ...updateAvailableDate,
      [event.target.name]: event.target.value,
    });
  };

  const handleNewAvailableDate = (event) => {
    setNewAvailableDate({
      ...newAvailableDate,
      [event.target.name]: event.target.value,
    });
  };

  const handleCloseError = () => {
    setError(null); // Hata mesajını kapat
    setShowModal(false); // Modal popup'u kapat
  };

  return (
    <div className="doctor-container">
      {showModal && (
        <Modal handleCloseModal={handleCloseError}>
          {error.message ? <p>{error.message}</p> : <p>{error}</p>}
        </Modal>
      )}

      <div className="top">
        <div className="doctor-title">
          <h1>Doktor</h1>
        </div>

        <div className="doctor-search search">
          <input
            type="text"
            placeholder="Ara"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="available-add-button-div">
            <button
              className="available-date-add-button"
              onClick={handleOpenModal}
            >
              Çalışma günü ekle
            </button>
            {isModalOpen && (
              <Modal handleCloseModal={handleCloseModal}>
                <AvailableDate />
              </Modal>
            )}
          </div>
        </div>
      </div>
      <div className="doctor-appointment-div">
        <div className="doctor-list">
          <h2>Doktor Listesi</h2>

          <table className="doctor-list-table list-table">
            <thead>
              <tr>
                <th></th>
                <th>İsim</th>
                <th>E-mail</th>
                <th>Adres</th>
                <th>Şehir</th>
                <th>Telefon</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((doctor) => (
                <tr key={doctor.id}>
                  <td>
                    <button
                      className="show-dates-button"
                      onClick={() => handleDoctorSelect(doctor.id)}
                    >
                      Günleri Göster
                    </button>
                  </td>
                  <td>{doctor.name}</td>
                  <td>{doctor.mail}</td>
                  <td>{doctor.address}</td>
                  <td>{doctor.city} </td>
                  <td>{doctor.phone}</td>
                  <td>
                    <span>
                      <DeleteIcon onClick={() => handleDelete(doctor.id)} />
                    </span>
                  </td>
                  <td>
                    <span>
                      <EditIcon onClick={() => handleUpdateBtn(doctor)} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="available-date-list">
          <h2>Doktor Müsait Günleri</h2>

          <table className="available-date-list-table list-table">
            <thead>
              <tr>
                <th>Doktor</th>
                <th>Çalışma Tarihleri</th>
                <th></th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {selectedDoctorAvailableDates.map((date, index) => (
                <tr key={index}>
                  <td>{date.doctor.name}</td>
                  <td>{date.availableDate}</td>
                  <td>
                    <span>
                      <DeleteIcon
                        onClick={() => handleDeleteAvailableDate(date.id)}
                      />
                    </span>
                  </td>
                  <td>
                    <span>
                      <EditIcon
                        className="available-date-update-button"
                        onClick={() => handleAvailableDateUpdateBtn(date)}
                      />
                    </span>
                    {isModalOpen && (
                      <Modal handleCloseModal={handleCloseModal}>
                        <AvailableDate />
                      </Modal>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h1>Doktor Ekle</h1>
      <div className="doctor-new-doctor">
        <input
          type="text"
          placeholder="İsim"
          name="name"
          value={newDoctor.name}
          onChange={handleNewDoctor}
        />
        <input
          type="text"
          placeholder="Email"
          name="mail"
          value={newDoctor.mail}
          onChange={handleNewDoctor}
        />
        <input
          type="text"
          placeholder="Adres"
          name="address"
          value={newDoctor.address}
          onChange={handleNewDoctor}
        />
        <input
          type="text"
          placeholder="Şehir"
          name="city"
          value={newDoctor.city}
          onChange={handleNewDoctor}
        />
        <input
          type="text"
          placeholder="Telefon"
          name="phone"
          value={newDoctor.phone}
          onChange={handleNewDoctor}
        />

        <button className="doctor-add-button" onClick={handleCreate}>
          Ekle
        </button>
      </div>
      {isDoctorEditModalOpen && (
        <Modal handleCloseModal={() => setIsDoctorEditModalOpen(false)}>
          <div className="doctor-update-doctor update-screen">
            <label htmlFor="">İsim</label>
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={updateDoctor.name}
              onChange={handleUpdateChange}
            />
            <label htmlFor="">E-mail</label>
            <input
              type="text"
              placeholder="Email"
              name="mail"
              value={updateDoctor.mail}
              onChange={handleUpdateChange}
            />
            <label htmlFor="">Adres</label>
            <input
              type="text"
              placeholder="Address"
              name="address"
              value={updateDoctor.address}
              onChange={handleUpdateChange}
            />
            <label htmlFor="">Şehir</label>
            <input
              type="text"
              placeholder="City"
              name="city"
              value={updateDoctor.city}
              onChange={handleUpdateChange}
            />
            <label htmlFor="">Telefon</label>
            <input
              type="text"
              placeholder="Phone"
              name="phone"
              value={updateDoctor.phone}
              onChange={handleUpdateChange}
            />
            <button className="doctor-update-button" onClick={handleUpdate}>
              Güncelle
            </button>
          </div>
        </Modal>
      )}

      {isAvailableDateEditModalOpen && (
        <Modal handleCloseModal={() => setIsAvailableDateEditModalOpen(false)}>
          <div className="available-date-new-available-date">
            <input
              type="date"
              placeholder="availableDate"
              name="availableDate" //
              value={updateAvailableDate.availableDate}
              onChange={handleUpdateAvailableDateChange}
            />

            <select
              name="doctorId"
              value={updateAvailableDate.doctor.id}
              onChange={handleUpdateAvailableDateDoctorChange}
            >
              {doctor.map((doctor) => (
                <option key={doctor.id} value={doctor.id} disabled>
                  {doctor.name}
                </option>
              ))}
            </select>

            <button
              className="doctor-add-button"
              onClick={handleUpdateAvailableDate}
            >
              Güncelle
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Doctor;
