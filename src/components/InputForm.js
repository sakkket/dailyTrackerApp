import React, { useState } from "react";
import styles from "./InputForm.module.css";
import { saveExpenditure } from "../API/APIService";
import moment from "moment";
import { toast } from "react-toastify";
import { EXPENDITURE_CATEGORIES } from "../helpers/constants";

const GROUPED_EXPENDITURE_CATEGORIES = [
  {
    group: "Savings",
    items: EXPENDITURE_CATEGORIES.filter((cat) => cat.type === "SAVINGS"),
  },
  {
    group: "Income",
    items: EXPENDITURE_CATEGORIES.filter((cat) => cat.type === "CREDIT"),
  },
  {
    group: "Expenditure",
    items: EXPENDITURE_CATEGORIES.filter((cat) => cat.type === "DEBIT"),
  },
];
const GROUP = {
  DEBIT: "Expenditure",
  SAVINGS: "Savings",
  CREDIT: "Income",
};
const categoryColorMap = {
  Expenditure: "text-expenditure",
  Income: "text-income",
  Savings: "text-savings",
};

export default function InputForm({ onExpenseAdded }) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedExpenditure, setSelectedExpenditure] = useState("food");
  const [expenditureAmount, setExpenditureAmount] = useState();
  const [groupCategory, setGroupCategory] = useState("Expenditure");
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    onExpenseAdded();
    if (!expenditureAmount || expenditureAmount === 0) {
      toast.error("Failed: Amount is zero");
      return;
    }
    const exObj = EXPENDITURE_CATEGORIES.find(
      (ec) => ec.key === selectedExpenditure
    );
    const payload = {
      amount: parseInt(expenditureAmount),
      category: selectedExpenditure,
      date: date,
      day: moment.utc(date).format("YYYY-MM-DD"),
      month: moment.utc(date).format("YYYY-MM"),
      type: exObj.type,
      comment: comment
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
  const handleSelectedExpenditure = (value) => {
    setSelectedExpenditure(value);
    const expenditureObj = EXPENDITURE_CATEGORIES.find(
      (ec) => ec.key === value
    );
    setGroupCategory(GROUP[expenditureObj.type]);
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
        <label>
          Category:{" "}
          <span className={styles[categoryColorMap[groupCategory]] || ""}>
            {groupCategory}
          </span>
        </label>
        <select
          value={selectedExpenditure}
          onChange={(e) => handleSelectedExpenditure(e.target.value)}
        >
          {GROUPED_EXPENDITURE_CATEGORIES.map((group) => (
            <optgroup key={group.group} label={group.group}>
              {group.items.map((category) => (
                <option key={category.key} value={category.key}>
                  {category.label}
                </option>
              ))}
            </optgroup>
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

      <div className={styles.row}>
        <label>Comment</label>
        <input
          type="text"
          placeholder="Add a comment (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <button type="submit" className={styles.button}>
        ADD
      </button>
    </form>
  );
}
