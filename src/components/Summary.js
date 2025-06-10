import React from "react";
import "./Summary.css"; // Refer to CSS below

export default function Summary({ income, expenditure, saving, month }) {
  const balance = income - (expenditure + saving);

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
        <div className="summary-label">Total Income/Budget</div>
        <div className="summary-value">₹{income}</div>
      </div>
      <div className="summary-card income">
        <div className="summary-label">Total Savings</div>
        <div className="summary-value">₹{saving}</div>
      </div>
      <div className="summary-month">{month}</div>
    </div>
  );
}
