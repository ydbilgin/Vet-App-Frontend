import React, { useState, useEffect } from "react";
import {
  deleteAnimal,
  getAnimals,
  createAnimal,
  updateAnimalFunction,
  getAnimalByName,
  getAnimalByCustomerName,
  getAnimalByNameAndCustomerName,
} from "../../API/animal";
import { getCustomers } from "../../API/customer";
import Modal from "../../Components/Modal.jsx";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import "./Animal.css";

function Animal() {
  const [animal, setAnimal] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [reload, setReload] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnimalEditModalOpen, setIsAnimalEditModalOpen] = useState(false);
  const [animalSearchTerm, setAnimalSearchTerm] = useState("");
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const [newAnimal, setNewAnimal] = useState({
    name: "",
    breed: "",
    colour: "",
    dateOfBirth: "",
    gender: "",
    species: "",
    customer: {
      id: "",
    },
  });
  const [updateAnimal, setUpdateAnimal] = useState({
    name: "",
    breed: "",
    colour: "",
    dateOfBirth: "",
    gender: "",
    species: "",
    customer: {
      id: "",
    },
  });

  useEffect(() => {
    Promise.all([getAnimals(), getCustomers()])
      .then(([animalsData, customersData]) => {
        setResults(animalsData);
        setCustomer(customersData);
      })
      .catch((error) => {
        setError(error.response.data);
        setShowModal(true);
      });
    setReload(false);
  }, [reload]);
  useEffect(() => {
    const fetchResults = async () => {
      try {
        let results = [];

        if (
          animalSearchTerm.trim() !== "" &&
          customerSearchTerm.trim() !== ""
        ) {
          const animalsAndCustomers = await getAnimalByNameAndCustomerName(
            animalSearchTerm,
            customerSearchTerm
          );
          results = [...results, ...animalsAndCustomers];
        } else if (animalSearchTerm.trim() !== "") {
          const animals = await getAnimalByName(animalSearchTerm);
          results = [...results, ...animals];
        } else if (customerSearchTerm.trim() !== "") {
          const customers = await getAnimalByCustomerName(customerSearchTerm);
          results = [...results, ...customers];
        } else {
          results = await getAnimals();
        }

        setResults(results);
      } catch (error) {
        console.error(error);
        setResults([]);
      }
    };
    fetchResults();
  }, [reload, animalSearchTerm, customerSearchTerm]);

  const handleDelete = (id) => {
    deleteAnimal(id)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data); // Backendden gelen hatayı al
        setShowModal(true); // Modal popup'u göster
      });
  };

  const handleNewAnimal = (event) => {
    const { name, value } = event.target;
    if (name === "customerId") {
      setNewAnimal((prevAnimal) => ({
        ...prevAnimal,
        customer: {
          id: value,
        },
      }));
    } else {
      setNewAnimal((prevAnimal) => ({
        ...prevAnimal,
        [name]: value,
      }));
    }
  };
  const handleCreate = () => {
    createAnimal(newAnimal)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data);
        setShowModal(true);
      });
    setNewAnimal({
      name: "",
      breed: "",
      colour: "",
      dateOfBirth: "",
      gender: "",
      species: "",
      customer: {
        id: "",
      },
    });
  };
  const handleCloseError = () => {
    setError(null);
    setShowModal(false);
  };
  const handleUpdateBtn = (animal) => {
    setUpdateAnimal({
      id: animal.id,
      name: animal.name,
      breed: animal.breed,
      colour: animal.colour,
      dateOfBirth: animal.dateOfBirth,
      gender: animal.gender,
      species: animal.species,
      customer: {
        id: animal.customer.id,
      },
    });
    setIsAnimalEditModalOpen(true);
  };

  const handleUpdateChange = (event) => {
    setUpdateAnimal({
      ...updateAnimal,
      [event.target.name]: event.target.value,
    });
  };
  const handleUpdateCustomerChange = (event) => {
    setUpdateAnimal({
      ...updateAnimal,
      customer: {
        id: event.target.value,
      },
    });
  };

  const handleUpdate = () => {
    updateAnimalFunction(updateAnimal)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data); // Backendden gelen hatayı al
        setShowModal(true); // Modal popup'u göster
      });
    setUpdateAnimal({
      name: "",
      breed: "",
      colour: "",
      dateOfBirth: "",
      gender: "",
      species: "",
      customer: {
        id: "",
      },
    });
    setIsAnimalEditModalOpen(false);
  };

  return (
    <div className="animal-container">
      {showModal && (
        <Modal handleCloseModal={handleCloseError}>
          {error.message ? <p>{error.message}</p> : <p>{error}</p>}
        </Modal>
      )}

      <div className="top">
        <div className="animal-title">
          <h1>Animal</h1>
        </div>
        <div className="animal-search">
          <input
            type="text"
            placeholder="Hayvan ara"
            value={animalSearchTerm}
            onChange={(e) => setAnimalSearchTerm(e.target.value)}
          />
          <input
            type="text"
            placeholder="Müşteri ara"
            value={customerSearchTerm}
            onChange={(e) => setCustomerSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="animal-list">
        <h1>Hayvan listesi</h1>
        <table className="animal-list-table">
          <thead>
            <tr>
              <th>İsim</th>
              <th>Tür</th>
              <th>Cins</th>
              <th>Renk</th>
              <th>Doğum Tarihi</th>
              <th>Cinsiyet</th>
              <th>Müşteri Adı</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {results.map((animal) => (
              <tr key={animal.id}>
                <td>{animal.name}</td>
                <td>{animal.species}</td>
                <td>{animal.breed}</td>
                <td>{animal.gender}</td>
                <td>{animal.colour}</td>
                <td>{animal.dateOfBirth}</td>
                <td>{animal.customer.name}</td>
                <td>
                  <span>
                    <DeleteIcon onClick={() => handleDelete(animal.id)} />
                  </span>
                </td>
                <td>
                  <span>
                    <EditIcon onClick={() => handleUpdateBtn(animal)} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="animal-inputs">
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={newAnimal.name}
          onChange={handleNewAnimal}
        />
        <input
          type="text"
          placeholder="Breed"
          name="breed"
          value={newAnimal.breed}
          onChange={handleNewAnimal}
        />
        <input
          type="text"
          placeholder="Colour"
          name="colour"
          value={newAnimal.colour}
          onChange={handleNewAnimal}
        />
        <input
          type="date"
          placeholder="Birth Date"
          name="dateOfBirth"
          value={newAnimal.dateOfBirth}
          onChange={handleNewAnimal}
        />
        <select
          name="gender"
          value={newAnimal.gender}
          onChange={handleNewAnimal}
        >
          <option value="" disabled>
            Select gender
          </option>
          <option typeof="text" value="Male">
            Male
          </option>
          <option typeof="text" value="Female">
            Female
          </option>
        </select>

        <input
          type="text"
          placeholder="Species"
          name="species"
          value={newAnimal.species}
          onChange={handleNewAnimal}
        />
        <select
          name="customerId"
          value={newAnimal.customer.id}
          onChange={handleNewAnimal}
        >
          <option value="" disabled>
            Select a customer
          </option>
          {customer.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
        <button className="animal-add-button" onClick={handleCreate}>
          Create
        </button>
      </div>
      {isAnimalEditModalOpen && (
        <Modal handleCloseModal={() => setIsAnimalEditModalOpen(false)}>
          <div className="animal-update-div">
            <div className="animal-update-inputs">
              <label htmlFor="">İsim</label>
              <input
                type="text"
                placeholder="İsim"
                name="name"
                value={updateAnimal.name}
                onChange={handleUpdateChange}
              />
              <label htmlFor="">Cins</label>
              <input
                type="text"
                placeholder="Cins"
                name="breed"
                value={updateAnimal.breed}
                onChange={handleUpdateChange}
              />
              <label htmlFor="">Renk</label>
              <input
                type="text"
                placeholder="Renk"
                name="colour"
                value={updateAnimal.colour}
                onChange={handleUpdateChange}
              />
              <label htmlFor="">Doğum Günü</label>
              <input
                type="date"
                placeholder="Doğum Günü"
                name="dateOfBirth"
                value={updateAnimal.dateOfBirth}
                onChange={handleUpdateChange}
              />
              <label htmlFor="">Cinsiyet</label>
              <select
                name="gender"
                value={updateAnimal.gender}
                onChange={handleUpdateChange}
              >
                <option value="" disabled>
                  Select gender
                </option>
                <option typeof="text" value="Male">
                  Male
                </option>
                <option typeof="text" value="Female">
                  Female
                </option>
              </select>
              <label htmlFor="">Tür</label>
              <input
                type="text"
                placeholder="Tür"
                name="species"
                value={updateAnimal.species}
                onChange={handleUpdateChange}
              />
              <label htmlFor="">Müşteri İsmi</label>
              <select
                name="customerId"
                value={updateAnimal.customer.id}
                onChange={handleUpdateCustomerChange}
              >
                <option value="" disabled>
                  Select a customer
                </option>
                {customer.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              <button className="animal-add-button" onClick={handleUpdate}>
                Update
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Animal;
