import React, { useState } from "react";
import InputForm from "./InputForm";
import Dashboard from "./Dashboard";
import styles from "./Calories.module.css"


export default function Calories() {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const addEntry = (entry) => {
    setData((prev) => [...prev, entry]);
    setShowForm(false);
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}>
       <div className={styles.header}>
            <h1 className={styles.headertitle}>CALORIES TRACKER</h1>
          </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
        <button
          onClick={() => setShowForm(true)}
          className={styles.inputButton}
        >
          Add Calories Burnt
        </button>
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <div style={{ flex: 1 }}>
          <Dashboard data={data} />
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <InputForm onSubmit={addEntry} />
          </div>
        </div>
      )}
    </div>
  );
}
