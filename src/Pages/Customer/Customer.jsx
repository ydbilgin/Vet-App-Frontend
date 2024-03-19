import React, { useState, useEffect } from "react";
import {
  deleteCustomer,
  getCustomers,
  createCustomer,
  updateCustomerFunction,
} from "../../API/customer";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import "./Customer.css";
import Modal from "../../Components/Modal.jsx";

function Customer() {
  const [customer, setCustomer] = useState([]);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isCustomerEditModalOpen, setIsCustomerEditModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const filterCustomers = (customer) => {
    return (
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.mail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  const filteredCustomers = customer.filter(filterCustomers);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    mail: "",
    address: "",
    city: "",
    phone: "",
  });
  const [updateCustomer, setUpdateCustomer] = useState({
    name: "",
    mail: "",
    address: "",
    city: "",
    phone: "",
  });
  useEffect(() => {
    getCustomers()
      .then((data) => {
        setCustomer(data);
      })
      .catch((error) => {
        setError(error.response.data);
        setShowModal(true);
      });
    setReload(false);
  }, [reload]);

  const handleDelete = (id) => {
    deleteCustomer(id)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data); // Backendden gelen hatayı al
        setShowModal(true); // Modal popup'u göster
      });
  };

  const handleNewCustomer = (event) => {
    setNewCustomer({
      ...newCustomer,
      [event.target.name]: event.target.value,
    });
  };

  const handleCreate = () => {
    createCustomer(newCustomer)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data); // Backendden gelen hatayı al
        setShowModal(true); // Modal popup'u göster
      });
    setNewCustomer({
      name: "",
      mail: "",
      address: "",
      city: "",
      phone: "",
    });
  };

  const handleUpdateBtn = (customer) => {
    setUpdateCustomer({
      id: customer.id,
      name: customer.name,
      mail: customer.mail,
      address: customer.address,
      city: customer.city,
      phone: customer.phone,
    });
    setIsCustomerEditModalOpen(true);
  };

  const handleUpdateChange = (event) => {
    setUpdateCustomer({
      ...updateCustomer,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdate = () => {
    updateCustomerFunction(updateCustomer)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data); // Backendden gelen hatayı al
        setShowModal(true); // Modal popup'u göster
      });
    setUpdateCustomer({
      name: "",
      mail: "",
      address: "",
      city: "",
      phone: "",
    });
    setIsCustomerEditModalOpen(false);
  };
  const handleCloseError = () => {
    setError(null); // Hata mesajını kapat
    setShowModal(false); // Modal popup'u kapat
  };

  return (
    <div className="customer-container">
      {showModal && (
        <Modal handleCloseModal={handleCloseError}>
          {error.message ? <p>{error.message}</p> : <p>{error}</p>}
        </Modal>
      )}

      <div className="top">
        <div className="customer-title">
          <h1>Müşteri</h1>
        </div>
        <div className="customer-search">
          <input
            type="text"
            placeholder="Ara"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="customer-list">
        <h2>Müşteri Listesi</h2>
        <table className="customer-list-table">
          <thead>
            <tr>
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
            {filteredCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.mail}</td>
                <td>{customer.address}</td>
                <td>{customer.city} </td>
                <td>{customer.phone}</td>
                <td>
                  <span>
                    <DeleteIcon onClick={() => handleDelete(customer.id)} />
                  </span>
                </td>
                <td>
                  <span>
                    <EditIcon onClick={() => handleUpdateBtn(customer)} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h1>Müşteri Ekle</h1>
      <div className="customer-new-customer">
        <input
          type="text"
          placeholder="İsim"
          name="name"
          value={newCustomer.name}
          onChange={handleNewCustomer}
        />
        <input
          type="text"
          placeholder="Email"
          name="mail"
          value={newCustomer.mail}
          onChange={handleNewCustomer}
        />
        <input
          type="text"
          placeholder="Adres"
          name="address"
          value={newCustomer.address}
          onChange={handleNewCustomer}
        />
        <input
          type="text"
          placeholder="Şehir"
          name="city"
          value={newCustomer.city}
          onChange={handleNewCustomer}
        />
        <input
          type="text"
          placeholder="Telefon"
          name="phone"
          value={newCustomer.phone}
          onChange={handleNewCustomer}
        />

        <button className="customer-add-button" onClick={handleCreate}>
          Ekle
        </button>
      </div>
      {isCustomerEditModalOpen && (
        <Modal handleCloseModal={() => setIsCustomerEditModalOpen(false)}>
          <div className="customer-new-customer">
            <label htmlFor="">İsim:</label>
            <input
              type="text"
              placeholder="İsim"
              name="name"
              value={updateCustomer.name}
              onChange={handleUpdateChange}
            />
            <label htmlFor="">Email:</label>
            <input
              type="text"
              placeholder="Email"
              name="mail"
              value={updateCustomer.mail}
              onChange={handleUpdateChange}
            />
            <label htmlFor="">Adres:</label>
            <input
              type="text"
              placeholder="Adres"
              name="address"
              value={updateCustomer.address}
              onChange={handleUpdateChange}
            />
            <label htmlFor="">Şehir:</label>

            <input
              type="text"
              placeholder="Şehir"
              name="city"
              value={updateCustomer.city}
              onChange={handleUpdateChange}
            />
            <label htmlFor="">Telefon:</label>

            <input
              type="text"
              placeholder="Telefon"
              name="phone"
              value={updateCustomer.phone}
              onChange={handleUpdateChange}
            />
            <button className="customer-add-button" onClick={handleUpdate}>
              Güncelle
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Customer;
