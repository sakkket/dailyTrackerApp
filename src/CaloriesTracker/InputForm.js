import React, { useState } from "react";
import styles from "./InputForm.module.css";

const CALORIE_CATEGORIES = ["cycling", "walking", "running"];

export default function InputForm({ onSubmit }) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedCalorie, setSelectedCalorie] = useState("cycling");
  const [calorieAmount, setCalorieAmount] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      date,
      calories: { [selectedCalorie]: calorieAmount }
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.row}>
        <label>Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className={styles.row}>
        <label>Calories Activity:</label>
        <select value={selectedCalorie} onChange={(e) => setSelectedCalorie(e.target.value)}>
          {CALORIE_CATEGORIES.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className={styles.row}>
        <label>Calories Burnt (KCAL):</label>
        <input
          type="number"
          value={calorieAmount}
          onChange={(e) => setCalorieAmount(Number(e.target.value))}
        />
      </div>

      <button type="submit" className={styles.button}>ADD</button>
    </form>
  );
}
