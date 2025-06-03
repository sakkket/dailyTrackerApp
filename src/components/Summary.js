import React from "react";
import "./Summary.css"; // Refer to CSS below

export default function Summary({ income, expenditure, month }) {
  const balance = income - expenditure;

  return (
    <div className="summary-container">
              <div className="summary-card balance">
        <div className="summary-label">Balance</div>
        <div className="summary-value">₹{balance}</div>
      </div>
       <div className="summary-card expenditure">
        <div className="summary-label">Total Expenditure</div>
        <div className="summary-value">₹{expenditure}</div>
      </div>
      <div className="summary-card income">
        <div className="summary-label">Total Income</div>
        <div className="summary-value">₹{income}</div>
      </div>
      <div className="summary-month">{month}</div>
    </div>
  );
}
