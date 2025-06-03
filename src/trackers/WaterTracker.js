import { useState, useEffect } from "react";
import "./WaterTracker.css";
import { toast } from "react-toastify";
import { FiSettings } from "react-icons/fi";


export default function WaterTracker() {
  const [glasses, setGlasses] = useState(0);
  const [goal, setGoal] = useState(8);
  const [unit, setUnit] = useState("glasses");
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const savedGlasses = localStorage.getItem("water-tracker-glasses");
    const savedGoal = localStorage.getItem("water-tracker-goal");
    const savedUnit = localStorage.getItem("water-tracker-unit");
    const savedQuantity = localStorage.getItem("water-tracker-quantity");
    if (savedGlasses) setGlasses(parseInt(savedGlasses, 10));
    if (savedGoal) setGoal(parseInt(savedGoal, 10));
    if (savedUnit) setUnit(savedUnit);
    if (savedQuantity) setQuantity(parseFloat(savedQuantity));
  }, []);
  

  useEffect(() => {
    localStorage.setItem("water-tracker-glasses", glasses.toString());
    localStorage.setItem("water-tracker-goal", goal.toString());
    localStorage.setItem("water-tracker-unit", unit);
    localStorage.setItem("water-tracker-quantity", quantity.toString());
  }, [glasses, goal, unit, quantity]);

  const handleAddGlass = () => {
    if (glasses < goal) setGlasses(glasses + 1);
    toast.success("Awesome!!");
  };

  const toggleModal = () => setShowModal(!showModal);

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}>
      <div className="header">
            <h1 className="headertitle">WATER REMINDER</h1>
          </div>
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
           <button className="settings-button" onClick={toggleModal} ><FiSettings style={{ marginRight: "8px" }} /> Settings</button>
        </div>
    <div className="water-container">
      <div className="tracker-card">
        <h1 className="title">Stay Hydrated!</h1>
    
        <div className="glasses-container" onClick={handleAddGlass}>
          {Array.from({ length: goal }).map((_, index) => (
            <div
              key={index}
              className={`glass ${index < glasses ? "fill-water" : ""}`}
            >
              <div className="water-animation" />
            </div>
          ))}
        </div>
        <button
          onClick={handleAddGlass}
          className="add-button"
        >
          Add {unit === "liters" ? `${quantity} L` : `a Glass`}
        </button>
            <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-picker"
          />
        <p className="progress-text">
          {unit === "liters"
            ? `${(glasses * quantity).toFixed(1)} / ${(goal * quantity).toFixed(1)} liters`
            : `${glasses} of ${goal} glasses`}
        </p>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Settings</h2>
            <label>
              Goal:
              <input
                type="number"
                min="1"
                value={goal}
                onChange={(e) => setGoal(Number(e.target.value))}
              />
            </label>
            <label>
              Unit:
              <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option value="glasses">Glasses</option>
                <option value="liters">Liters</option>
              </select>
            </label>
            <label>
              Quantity per unit:
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value))}
              />
            </label>
            <button className="close-button" onClick={toggleModal}>Close</button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
