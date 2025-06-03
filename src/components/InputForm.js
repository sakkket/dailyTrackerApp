import React, { useState } from "react";
import styles from "./InputForm.module.css";
import { saveExpenditure } from "../API/APIService";
import moment from "moment";
import { toast } from "react-toastify";

const EXPENDITURE_CATEGORIES = [
  {
    key: "transport",
    label: "Transport",
  },
  {
    key: "food",
    label: "Food & Drinks",
  },
  {
    key: "groceries",
    label: "Groceries",
  },
  {
    key: "rent",
    label: "Rent",
  },
  {
    key: "loans",
    label: "Loans",
  },
  {
    key: "entertainment",
    label: "Entertainment",
  },
  {
    key: "clothes",
    label: "Clothes",
  },
  {
    key: "internet",
    label: "Internet & Phone",
  },
  {
    key: "na",
    label: "No Category",
  },
  {
    key: "transfer",
    label: "Fund Transfer",
  },
  {
    key: "gadget",
    label: "Gadget",
  },
  {
    key: "income",
    label: "Income",
  },
  {
    key: "car",
    label: "Car Fuel & Maintainance",
  },
];

export default function InputForm({ onExpenseAdded }) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedExpenditure, setSelectedExpenditure] = useState("food");
  const [expenditureAmount, setExpenditureAmount] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    onExpenseAdded();
    if (!expenditureAmount || expenditureAmount === 0) {
      toast.error("Failed: Amount is zero");
      return;
    }
    const payload = {
      amount: expenditureAmount,
      category: selectedExpenditure,
      date: date,
      day: moment.utc(date).format("YYYY-MM-DD"),
      month: moment.utc(date).format("YYYY-MM"),
      type: selectedExpenditure === "income" ? "CREDIT" : "DEBIT",
    };
    const res = await saveExpenditure(payload);
    if (res) {
      const message =
        selectedExpenditure === "income"
          ? "Income added successfully!"
          : "Expense added successfully!";
      toast.success(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.row}>
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className={styles.row}>
        <label>Category:</label>
        <select
          value={selectedExpenditure}
          onChange={(e) => setSelectedExpenditure(e.target.value)}
        >
          {EXPENDITURE_CATEGORIES.map((category) => (
            <option key={category.key} value={category.key}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.row}>
        <label>Amount (₹):</label>
        <input
          type="number"
          value={expenditureAmount}
          placeholder="Enter amount in INR"
          onChange={(e) => {
            const inputValue = e.target.value;
            const sanitizedValue = inputValue.replace(/^0+(?!\.)/, ""); // remove leading zeros
            setExpenditureAmount(sanitizedValue);
          }}
        />
      </div>

      <button type="submit" className={styles.button}>
        ADD
      </button>
    </form>
  );
}
