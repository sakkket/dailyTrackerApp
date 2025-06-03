import React, { useState } from "react";
import InputForm from "./components/InputForm";
import Dashboard from "./components/Dashboard";
import styles from "./MainApp.module.css"
import { FaPlusCircle, FaMoneyBillWave } from "react-icons/fa";

export default function MainApp() {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const triggerRefresh = () => {
    setRefresh(prev => !prev);
    setShowForm(false);
  }
  const addEntry = (entry) => {
    setData((prev) => [...prev, entry]);
    setShowForm(false);
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}>
      <div className={styles.header}>
      <h1 className={styles.headertitle}>EXPENDITURE TRACKER</h1>
    </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
        <button
          onClick={() => setShowForm(true)}
          className={styles.inputButton}
          
        >
           <FaPlusCircle style={{ marginRight: '8px' }} />
          Add Expenses or Income
        </button>
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <div style={{ flex: 1 }}>
          <Dashboard refresh={refresh} />
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
