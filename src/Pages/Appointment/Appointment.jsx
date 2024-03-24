import React, { useState, useEffect } from "react";
import "./Appointment.css";
import {
  deleteAppointment,
  getAppointments,
  createAppointment,
  updateAppointmentFunction,
  getAppointmentAfterDate,
  getAppointmentBeforeDate,
  getAppointmentBetweenTwoDates,
  getAppointmentByDoctor,
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
  const [reload, setReload] = useState(true);
  const [animals, setAnimals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [results, setResults] = useState([]);
  const [doctorSearchTerm, setDoctorSearchTerm] = useState("");
  const [startSearchTerm, setStartSearchTerm] = useState("");
  const [endSearchTerm, setEndSearchTerm] = useState("");
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "startSearchTerm" || name === "endSearchTerm") {
      const localDate = new Date(value);
      localDate.setHours(localDate.getHours() + 3);
      const isoDate = localDate.toISOString().slice(0, 16);
      if (name === "startSearchTerm") {
        setStartSearchTerm(isoDate);
      } else {
        setEndSearchTerm(isoDate);
      }
    } else {
      setDoctorSearchTerm(value);
    }
  };

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
        setResults(appointmentsData);
        setAnimals(animalsData);
        setDoctors(doctorsData);
      })
      .catch((error) => {
        setError(error.response.data); // Backendden gelen hatayı al
        setShowModal(true); // Modal popup'u göster
      });
    setReload(false);
  }, [reload]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        let results = [];
        if (doctorSearchTerm.trim() !== "") {
          const byDoctor = await getAppointmentByDoctor(doctorSearchTerm);
          results = [...results, ...byDoctor];
        }
        if (startSearchTerm.trim() !== "" && endSearchTerm.trim() !== "") {
          let tempDateStart = new Date(startSearchTerm);
          let tempDateEnd = new Date(endSearchTerm);
          tempDateStart.setHours(tempDateStart.getHours() + 3);
          tempDateEnd.setHours(tempDateEnd.getHours() + 3);
          const startDate = tempDateStart.toISOString().slice(0, 16);
          const endDate = tempDateEnd.toISOString().slice(0, 16);

          const betweenTwoDates = await getAppointmentBetweenTwoDates(
            startDate,
            endDate
          );
          results = betweenTwoDates;
        } else if (startSearchTerm.trim() !== "") {
          let tempDate = new Date(startSearchTerm);
          tempDate.setHours(tempDate.getHours() + 3);
          const startDates = await getAppointmentAfterDate(
            tempDate.toISOString().slice(0, 16)
          );
          results = startDates;
        } else if (endSearchTerm.trim() !== "") {
          let tempDate = new Date(endSearchTerm);
          tempDate.setHours(tempDate.getHours() + 3);

          const endDates = await getAppointmentBeforeDate(
            tempDate.toISOString().slice(0, 16)
          );

          results = endDates;
        } else if (
          doctorSearchTerm.trim() === "" &&
          startSearchTerm.trim() === "" &&
          endSearchTerm === ""
        ) {
          const data = await getAppointments();
          setResults(data);
          return;
        }
        setResults(results);
      } catch (error) {
        console.error(error);
        setResults([]);
      }
    };
    fetchResults();
  }, [doctorSearchTerm, startSearchTerm, endSearchTerm]);

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
            placeholder="Doktor ismi"
            value={doctorSearchTerm}
            onChange={(e) => setDoctorSearchTerm(e.target.value)}
          />
          <input
            type="datetime-local"
            value={startSearchTerm}
            onChange={handleInputChange}
            name="startSearchTerm"
          />
          <input
            type="datetime-local"
            value={endSearchTerm}
            onChange={handleInputChange}
            name="endSearchTerm"
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
            {results.map((appointment) => (
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

          <input
            type="datetime-local"
            id="appointmentDate"
            name="appointmentDate"
            placeholder="Tarih seçiniz"
            value={newAppointment.appointmentDate}
            onChange={handleNewAppointment}
            required
          />

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
