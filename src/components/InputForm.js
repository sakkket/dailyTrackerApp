import React, { useState } from "react";
import styles from "./InputForm.module.css";
import { saveExpenditure } from "../API/APIService";
import moment from "moment";
import { toast } from "react-toastify";
import { EXPENDITURE_CATEGORIES } from "../helpers/constants";
import { useGlobalStore } from "../store/globalStore";

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
  const currencySymbol = useGlobalStore((state) => state.currencySymbol);
  const currencyCode = useGlobalStore((state) => state.currencyCode);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!expenditureAmount || expenditureAmount === 0) {
      toast.error("Failed: Amount is zero");
      return;
    }
    try {
      const exObj = EXPENDITURE_CATEGORIES.find(
        (ec) => ec.key === selectedExpenditure
      );
      const payload = {
        amount: parseInt(expenditureAmount),
        category: selectedExpenditure,
        date: date,
        day: moment(date).format("YYYY-MM-DD"),
        month: moment(date).format("YYYY-MM"),
        year: moment(date).format("YYYY"),
        type: exObj.type,
        currencyCode: currencyCode || "INR",
        comment: comment,
      };
      const res = await saveExpenditure(payload);
      if (res) {
        onExpenseAdded();
        const message =
          selectedExpenditure === "income"
            ? "Income added successfully!"
            : "Expense added successfully!";
        toast.success(message);
      }
    } catch (error) {
      toast.error("Failed to add expense. Please try again.");
      setLoading(false);
      return;
    } finally {
      setLoading(false);
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
        <label>Amount ({currencySymbol || "₹"}):</label>
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

      <button type="submit" className={styles.button} disabled={loading}>
        {loading ? <span className={styles.spinner}></span> : "ADD"}
      </button>
    </form>
  );
}
