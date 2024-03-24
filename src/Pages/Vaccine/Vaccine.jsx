import React, { useState, useEffect } from "react";
import {
  getVaccines,
  deleteVaccine,
  createVaccine,
  updateVaccineFunction,
  getVaccineBetweenTwoDates,
  getVaccineBeforeDate,
  getVaccineAfterDate,
  getVaccineByAnimal,
  getVaccineAfterDateWithAnimal,
  getVaccineBeforeDateWithAnimal,
  getVaccineBetweenTwoDatesWithAnimal,
} from "../../API/vaccine";
import { getReports } from "../../API/report";
import "./Vaccine.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { getAnimals } from "../../API/animal";
import Modal from "../../Components/Modal.jsx";

function Vaccine() {
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reload, setReload] = useState(true);
  const [isVaccineEditModalOpen, setIsVaccineEditModalOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [animalSearchTerm, setAnimalSearchTerm] = useState("");
  const [startSearchTerm, setStartSearchTerm] = useState("");
  const [endSearchTerm, setEndSearchTerm] = useState("");

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const [newVaccine, setNewVaccine] = useState({
    name: "",
    code: "",
    protectionStartDate: "",
    protectionFinishDate: "",
    animal: {
      id: "",
    },
    report: {
      id: "",
    },
  });
  const [animal, setAnimal] = useState([]);
  const [report, setReport] = useState([]);

  const [updateVaccine, setUpdateVaccine] = useState({
    name: "",
    code: "",
    protectionStartDate: "",
    protectionFinishDate: "",
    animal: {
      id: "",
    },
    report: {
      id: "",
    },
  });
  useEffect(() => {
    Promise.all([getVaccines(), getAnimals(), getReports()])
      .then(([vaccinesData, animalsData, reportsData]) => {
        setResults(vaccinesData);
        setAnimal(animalsData);
        setReport(reportsData);
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
        const animalTrim = animalSearchTerm.trim();
        const startTrim = startSearchTerm.trim();
        const endTrim = endSearchTerm.trim();

        // Temizleme
        setResults([]);

        if (animalTrim === "" && startTrim === "" && endTrim === "") {
          const data = await getVaccines();
          setResults(data);
          return;
        }

        if (animalTrim !== "") {
          const byAnimal = await getVaccineByAnimal(animalSearchTerm);
          results.push(...byAnimal);
        }

        if (startTrim !== "" && endTrim !== "") {
          const betweenTwoDatesWithAnimal =
            await getVaccineBetweenTwoDatesWithAnimal(
              startSearchTerm,
              endSearchTerm,
              animalSearchTerm
            );
          results.push(...betweenTwoDatesWithAnimal);
        } else {
          if (startTrim !== "") {
            const startDates = await getVaccineAfterDate(startSearchTerm);
            results.push(...startDates);
          }
          if (endTrim !== "") {
            const endDates = await getVaccineBeforeDate(endSearchTerm);
            results.push(...endDates);
          }
        }

        setResults(results);
      } catch (error) {
        console.error(error);
        setResults([]);
      }
    };
    fetchResults();
  }, [animalSearchTerm, startSearchTerm, endSearchTerm]);

  const handleDelete = (id) => {
    console.log(id);
    deleteVaccine(id)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data); // Backendden gelen hatayı al
        setShowModal(true); // Modal popup'u göster
      });
  };

  const handleNewVaccine = (event) => {
    const { name, value } = event.target;
    if (name === "animalId") {
      setNewVaccine((prevVaccine) => ({
        ...prevVaccine,
        animal: {
          id: value,
        },
      }));
    } else if (name === "reportId") {
      setNewVaccine((prevVaccine) => ({
        ...prevVaccine,
        report: {
          id: value,
        },
      }));
    } else {
      setNewVaccine((prevVaccine) => ({
        ...prevVaccine,
        [name]: value,
      }));
    }
    console.log(newVaccine.animal.id);
  };
  const handleCreate = () => {
    createVaccine(newVaccine)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data); // Backendden gelen hatayı al
        setShowModal(true); // Modal popup'u göster
      });
    setNewVaccine({
      name: "",
      code: "",
      protectionStartDate: "",
      protectionFinishDate: "",
      animal: {
        id: "",
      },
      report: {
        id: "",
      },
    });
  };

  const handleUpdateBtn = (vaccine) => {
    setUpdateVaccine({
      id: vaccine.id,
      name: vaccine.name,
      code: vaccine.code,
      protectionStartDate: vaccine.protectionStartDate,
      protectionFinishDate: vaccine.protectionFinishDate,
      animal: {
        id: vaccine.animal.id,
      },
      report: {
        id: vaccine.report.id,
      },
    });
    setIsVaccineEditModalOpen(true);
  };
  const handleUpdateAnimalChange = (event) => {
    setUpdateVaccine({
      ...updateVaccine,
      animal: {
        id: event.target.value,
      },
    });
  };
  const handleUpdateReportChange = (event) => {
    setUpdateVaccine({
      ...updateVaccine,
      report: {
        id: event.target.value,
      },
    });
  };

  const handleUpdateChange = (event) => {
    setUpdateVaccine({
      ...updateVaccine,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdate = () => {
    updateVaccineFunction(updateVaccine)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data); // Backendden gelen hatayı al
        setShowModal(true); // Modal popup'u göster
      });
    setUpdateVaccine({
      name: "",
      code: "",
      protectionStartDate: "",
      protectionFinishDate: "",
      animal: {
        id: "",
      },
      report: {
        id: "",
      },
    });
    setIsVaccineEditModalOpen(false);
  };
  const handleCloseError = () => {
    setError(null); // Hata mesajını kapat
    setShowModal(false); // Modal popup'u kapat
  };

  return (
    <div className="vaccine-container">
      {showModal && (
        <Modal handleCloseModal={handleCloseError}>
          {error.message ? <p>{error.message}</p> : <p>{error}</p>}
        </Modal>
      )}

      <div className="top">
        <div className="vaccine-title">
          <h1>Aşı</h1>
        </div>
        <div className="vaccine-search">
          <input
            type="text"
            placeholder="Ara"
            value={animalSearchTerm}
            onChange={(e) => setAnimalSearchTerm(e.target.value)}
          />
          <label htmlFor="">Başlangıç Tarihi:</label>
          <input
            type="date"
            placeholder="Start Date"
            value={startSearchTerm}
            onChange={(e) => setStartSearchTerm(e.target.value)}
          />
          <label htmlFor="">Bitiş Tarihi:</label>
          <input
            type="date"
            placeholder="End Date"
            value={endSearchTerm}
            onChange={(e) => setEndSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="vaccine-list">
        <h2>Aşı Listesi</h2>
        <table className="vaccine-list-table">
          <thead>
            <tr>
              <th>İsim</th>
              <th>Kod</th>
              <th>Koruma Başlangıç Tarihi</th>
              <th>Koruma Bitiş Tarihi</th>
              <th>Hayvan</th>
              <th>Rapor</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {results.map((vaccine) => (
              <tr key={vaccine.id}>
                <td>{vaccine.name}</td>
                <td>{vaccine.code}</td>
                <td>{vaccine.protectionStartDate}</td>
                <td>{vaccine.protectionFinishDate} </td>
                <td>{vaccine.animal.name}</td>
                <td>{vaccine.report.title}</td>
                <td>
                  <span>
                    <DeleteIcon onClick={() => handleDelete(vaccine.id)} />
                  </span>
                </td>
                <td>
                  <span>
                    <EditIcon onClick={() => handleUpdateBtn(vaccine)} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h1>Aşı Ekle</h1>
      <div className="vaccine-new-vaccine">
        <input
          type="text"
          placeholder="İsim"
          name="name"
          value={newVaccine.name}
          onChange={handleNewVaccine}
          required
        />
        <input
          type="text"
          placeholder="Kod"
          name="code"
          value={newVaccine.code}
          onChange={handleNewVaccine}
          required
        />
        <input
          type="date"
          placeholder="Koruma Başlangıç Tarihi"
          name="protectionStartDate"
          value={newVaccine.protectionStartDate}
          onChange={handleNewVaccine}
          required
        />
        <input
          type="date"
          placeholder="Koruma Bitiş Tarihi"
          name="protectionFinishDate"
          value={newVaccine.protectionFinishDate}
          onChange={handleNewVaccine}
          required
        />
        <select
          name="animalId"
          value={newVaccine.animal.id}
          onChange={handleNewVaccine}
          required
        >
          <option value="" disabled>
            Hayvan
          </option>
          {animal.map((animal) => (
            <option key={animal.id} value={animal.id}>
              {animal.name}
            </option>
          ))}
        </select>
        <select
          name="reportId"
          value={newVaccine.report.id}
          onChange={handleNewVaccine}
          required
        >
          <option value="" disabled>
            Rapor
          </option>
          {report.map((report) => (
            <option key={report.id} value={report.id}>
              {report.title}
            </option>
          ))}
        </select>

        <button className="vaccine-add-button" onClick={handleCreate}>
          Ekle
        </button>
      </div>
      <div className="vaccine-update-div">
        {isVaccineEditModalOpen && (
          <Modal handleCloseModal={() => setIsVaccineEditModalOpen(false)}>
            <div className="vaccine-new-vaccine">
              <label htmlFor="">İsim:</label>
              <input
                type="text"
                placeholder="İsim"
                name="name"
                value={updateVaccine.name}
                onChange={handleUpdateChange}
              />
              <label htmlFor="">Kod:</label>
              <input
                type="text"
                placeholder="Kod"
                name="code"
                value={updateVaccine.code}
                onChange={handleUpdateChange}
              />
              <label htmlFor="">Koruma Başlangıç Tarihi:</label>
              <input
                type="date"
                placeholder="Koruma Başlangıç Tarihi"
                name="protectionStartDate"
                value={updateVaccine.protectionStartDate}
                onChange={handleUpdateChange}
              />
              <label htmlFor="">Koruma Bitiş Tarihi:</label>
              <input
                type="date"
                placeholder="Protection Finish Date"
                name="protectionFinishDate"
                value={updateVaccine.protectionFinishDate}
                onChange={handleUpdateChange}
              />
              <label htmlFor="">Hayvan:</label>
              <select
                name="animalId"
                value={updateVaccine.animal.id}
                onChange={handleUpdateAnimalChange}
              >
                <option value="" disabled>
                  Hayvan Seçiniz
                </option>
                {animal.map((animal) => (
                  <option key={animal.id} value={animal.id}>
                    {animal.name}
                  </option>
                ))}
              </select>
              <label htmlFor="">Rapor:</label>
              <select
                name="reportId"
                value={updateVaccine.report.id}
                onChange={handleUpdateReportChange}
              >
                <option value="" disabled>
                  Rapor
                </option>
                {report.map((report) => (
                  <option key={report.id} value={report.id}>
                    {report.title}
                  </option>
                ))}
              </select>
              <button className="vaccine-add-button" onClick={handleUpdate}>
                Güncelle
              </button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default Vaccine;
