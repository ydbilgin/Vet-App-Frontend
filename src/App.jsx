import { useState } from "react";
import "./App.css";
import Home from "./Pages/Home/Home";
import Doctor from "./Pages/Doctor/Doctor";
import { Route, Routes } from "react-router-dom";
import Customer from "./Pages/Customer/Customer";
import Animal from "./Pages/Animal/Animal";
import Appointment from "./Pages/Appointment/Appointment";
import Vaccine from "./Pages/Vaccine/Vaccine";
import Report from "./Pages/Report/Report";
import Navbar from "./Components/Navbar";

function App() {
  const [page, setPage] = useState("");
  const handleMenuChange = (selectedMenu) => {
    setMenu(selectedMenu);
  };
  const menuItems = document.querySelectorAll(".header .menuItem");
  return (
    <div className="app">
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/report" element={<Report />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/doctor" element={<Doctor />} />
          <Route path="/animal" element={<Animal />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/vaccine" element={<Vaccine />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
