import React, { useState, useEffect, useRef } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import "./MonthYearPicker.css";
import moment from "moment";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const MonthYearPicker = ({ onMonthChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedMonthYear, setSelectedMonthYear] = useState(moment().format("YYYY-MM").toString());
  const pickerRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const handleSelection = (monthIndex) => {
    const monthValue = `${selectedYear}-${String(monthIndex + 1).padStart(2, "0")}`;
    console.log("monthValue",monthValue);
    setSelectedMonthYear(monthValue);
    setShowPicker(false);
    onMonthChange(monthValue);
  };

  const handleClickOutside = (e) => {
    if (pickerRef.current && !pickerRef.current.contains(e.target)) {
      setShowPicker(false);
    }
  };

  useEffect(() => {
    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  return (
    <div className="month-year-container" ref={pickerRef}>
      <button className="trigger-button" onClick={() => setShowPicker(!showPicker)}>
        <FaRegCalendarAlt className="calendar-icon" />
        <span>{selectedMonthYear || "Select Month"}</span>
      </button>

      {showPicker && (
        <div className="custom-picker-popup">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="year-dropdown"
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <div className="month-grid">
            {months.map((month, index) => (
              <button
                key={month}
                onClick={() => handleSelection(index)}
                className="month-button"
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthYearPicker;
