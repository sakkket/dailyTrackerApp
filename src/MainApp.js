import React, { useState } from "react";
import InputForm from "./components/InputForm";
import Dashboard from "./components/Dashboard";
import styles from "./MainApp.module.css";
import { FaPlusCircle, FaMoneyBillWave } from "react-icons/fa";

export default function MainApp() {
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const openAddModal = () => {
    setShowForm(true);
  }
  const triggerRefresh = () => {
    setRefresh((prev) => !prev);
    setShowForm(false);
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}>
      <div style={{ display: "flex", gap: "1rem" }}>
        <div style={{ flex: 1 }}>
          <Dashboard refresh={refresh} openAddExpenseModal={openAddModal}/>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <InputForm onExpenseAdded={triggerRefresh} />
          </div>
        </div>
      )}
    </div>
  );
}
