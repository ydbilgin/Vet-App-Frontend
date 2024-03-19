import React, { useState, useEffect } from "react";
import "./Appointment.css";
import {
  deleteAppointment,
  getAppointments,
  createAppointment,
  updateAppointmentFunction,
} from "../../API/appointment";
import { getAvailableDatesByDoctorId } from "../../API/available-date";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { getDoctors } from "../../API/doctor";
import { getAnimals } from "../../API/animal";
import Modal from "../../Components/Modal.jsx";

const Appointment = () => {
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [reload, setReload] = useState(true);
  const [animals, setAnimals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");
  const [isAppointmentEditModalOpen, setIsAppointmentEditModalOpen] =
    useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAvailableDates([]);
  };
  const handleCloseUpdateModal = () => {
    setIsAppointmentEditModalOpen(false); // Update modalı kapat
    setUpdateAppointment({
      // Doktor seçimini sıfırla
      appointmentDate: "",
      animal: {
        id: "",
      },
      doctor: {
        id: "",
      },
    });
    setAvailableDates([]); // Doktorun müsait günlerini sıfırla
  };

  const filterAppointments = (appointment) => {
    const startDateMatch =
      !searchStartDate ||
      new Date(appointment.appointmentDate) >= new Date(searchStartDate);
    const endDateMatch =
      !searchEndDate ||
      new Date(appointment.appointmentDate) <= new Date(searchEndDate);
    const termMatch =
      !searchTerm ||
      appointment.animal.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
    return startDateMatch && endDateMatch && termMatch;
  };
  const filteredAppointments = appointments.filter(filterAppointments);
  const [newAppointment, setNewAppointment] = useState({
    appointmentDate: "",
    animal: {
      id: "",
    },
    doctor: {
      id: "",
    },
  });
  const [updateAppointment, setUpdateAppointment] = useState({
    appointmentDate: "",
    animal: {
      id: "",
    },
    doctor: {
      id: "",
    },
  });

  useEffect(() => {
    Promise.all([getAppointments(), getAnimals(), getDoctors()])
      .then(([appointmentsData, animalsData, doctorsData]) => {
        setAppointments(appointmentsData);
        setAnimals(animalsData);
        setDoctors(doctorsData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    setReload(false);
  }, [reload]);

  const handleDelete = (id) => {
    console.log(id);
    deleteAppointment(id)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data); // Backendden gelen hatayı al
        setShowModal(true); // Modal popup'u göster
      });
  };

  const handleNewAppointment = (event) => {
    const { name, value } = event.target;
    if (name === "doctorId") {
      setNewAppointment((prevAppointment) => ({
        ...prevAppointment,
        doctor: {
          id: value,
        },
      }));
      const doctorId = value;
      getAvailableDatesByDoctorId(doctorId).then((dates) => {
        setAvailableDates(dates);
      });
    } else if (name === "animalId") {
      setNewAppointment((prevAppointment) => ({
        ...prevAppointment,
        animal: {
          id: value,
        },
      }));
    } else {
      setNewAppointment((prevAppointment) => ({
        ...prevAppointment,
        [name]: value,
      }));
    }
  };

  const handleCreate = () => {
    createAppointment(newAppointment)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data); // Backendden gelen hatayı al
        setShowModal(true); // Modal popup'u göster
      });

    setNewAppointment({
      appointmentDate: "",
      animal: {
        id: "",
      },
      doctor: {
        id: "",
      },
    });
    setAvailableDates(null);
  };

  const handleCloseError = () => {
    setError(null); // Hata mesajını kapat
    setShowModal(false); // Modal popup'u kapat
  };

  const handleUpdateBtn = (appointment) => {
    setUpdateAppointment({
      id: appointment.id,
      appointmentDate: appointment.appointmentDate,
      animal: {
        id: appointment.animal.id,
      },
      doctor: {
        id: appointment.doctor.id,
      },
    });

    const doctorId = appointment.doctor.id;
    getAvailableDatesByDoctorId(doctorId)
      .then((dates) => {
        setAvailableDates(dates);
      })
      .catch((error) => {
        setError(error.response.data);
        setShowModal(true);
      });

    setIsAppointmentEditModalOpen(true);
  };
  const handleUpdateChange = (event) => {
    setUpdateAppointment({
      ...updateAppointment,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdate = () => {
    updateAppointmentFunction(updateAppointment)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data); // Backendden gelen hatayı al
        setShowModal(true); // Modal popup'u göster
      });
    setUpdateAppointment({
      appointmentDate: "",
      animal: {
        id: "",
      },
      doctor: {
        id: "",
      },
    });
    setIsAppointmentEditModalOpen(false);
  };

  const handleUpdateAnimalChange = (event) => {
    setUpdateAppointment({
      ...updateAppointment,
      animal: {
        id: event.target.value,
      },
    });
  };
  const handleUpdateDoctorChange = (event) => {
    setUpdateAppointment({
      ...updateAppointment,
      doctor: {
        id: event.target.value,
      },
    });
    const doctorId = event.target.value;
    getAvailableDatesByDoctorId(doctorId)
      .then((dates) => {
        setAvailableDates(dates);
      })
      .catch((error) => {
        setError(error.response.data);
        setShowModal(true);
      });
  };

  return (
    <div className="appointment-container">
      {showModal && (
        <Modal handleCloseModal={handleCloseError}>
          {error.message ? <p>{error.message}</p> : <p>{error}</p>}
        </Modal>
      )}

      <div className="top">
        <div className="appointment-title">
          <h1>Randevu Yönetimi</h1>
        </div>
        <div className="appointment-search">
          <input
            type="text"
            placeholder="Hayvan veya Doktor ismi"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="date"
            value={searchStartDate}
            onChange={(e) => setSearchStartDate(e.target.value)}
          />
          <input
            type="date"
            value={searchEndDate}
            onChange={(e) => setSearchEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="appointment-list">
        <h3>Randevu Listesi</h3>
        <table className="appointment-list-table">
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Doktor</th>
              <th>Hayvan</th>
              <th></th> {/* Empty header for deletion function */}
              <th></th> {/* Empty header for edit function */}
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.appointmentDate}</td>
                <td>{appointment.doctor.name}</td>
                <td>{appointment.animal.name}</td>
                <td>
                  <span>
                    <DeleteIcon onClick={() => handleDelete(appointment.id)} />
                  </span>
                </td>
                <td>
                  <span>
                    <EditIcon onClick={() => handleUpdateBtn(appointment)} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="appointment-add-container">
        <div className="appointment-add">
          <h3>Randevu Ekle</h3>

          <input
            type="datetime-local"
            id="appointmentDate"
            name="appointmentDate"
            placeholder="Tarih seçiniz"
            value={newAppointment.appointmentDate}
            onChange={handleNewAppointment}
            required
          />

          <select
            name="doctorId"
            value={newAppointment.doctor.id}
            onChange={handleNewAppointment}
            required
          >
            <option value="" disabled>
              Doktor
            </option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </select>

          <select
            name="animalId"
            value={newAppointment.animal.id}
            onChange={handleNewAppointment}
            required
          >
            <option value="" disabled>
              Hayvan
            </option>
            {animals.map((animal) => (
              <option key={animal.id} value={animal.id}>
                {animal.name}
              </option>
            ))}
          </select>

          <button className="appointment-add-button" onClick={handleCreate}>
            Add
          </button>
        </div>
        <div className="appointment-doctor-available-date-list">
          <h3>Doktorun Müsait Günleri</h3>
          <ul>
            {availableDates !== null &&
              availableDates.map((date, index) => (
                <li key={index}>{date.availableDate} </li>
              ))}
          </ul>
        </div>
      </div>
      {isAppointmentEditModalOpen && (
        <Modal
          handleCloseModal={() => {
            setIsAppointmentEditModalOpen(false);
            handleCloseUpdateModal();
          }}
        >
          <div className="appointment-update-container">
            <div className="appointment-update">
              <h3>Randevu Güncelle</h3>
              <label htmlFor="">Tarih:</label>

              <input
                type="datetime-local"
                id="appointmentDate"
                name="appointmentDate"
                placeholder="Tarih seçiniz"
                value={updateAppointment.appointmentDate}
                onChange={handleUpdateChange}
                required
              />
              <label htmlFor="">Doktor:</label>

              <select
                name="doctorId"
                value={updateAppointment.doctor.id}
                onChange={handleUpdateDoctorChange}
                required
              >
                <option value="" disabled>
                  Doktor
                </option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
              <label htmlFor="">Hayvan:</label>
              <select
                name="animalId"
                value={updateAppointment.animal.id}
                onChange={handleUpdateAnimalChange}
                required
              >
                <option value="" disabled>
                  Hayvan
                </option>
                {animals.map((animal) => (
                  <option key={animal.id} value={animal.id}>
                    {animal.name}
                  </option>
                ))}
              </select>

              <button className="appointment-add-button" onClick={handleUpdate}>
                Update
              </button>
            </div>
            <div className="appointment-doctor-available-date-list">
              <h3>Doktorun Müsait Günleri</h3>
              <ul>
                {availableDates !== null &&
                  availableDates.map((date, index) => (
                    <li key={index}>{date.availableDate} </li>
                  ))}
              </ul>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Appointment;
