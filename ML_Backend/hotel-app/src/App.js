import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const roomTypes = ["Deluxe", "Suite", "Standard"];
  const seasons = ["Winter", "Summer", "Spring", "Fall"];
  const months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const weekdays = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  const [form, setForm] = useState({
    Base_Price: "",
    Year: "",
    Room_Type: "",
    Season: "",
    Month: "",
    Weekday: "",
    No_of_Guests: 1,
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPrediction(null);
    setError("");

    try {
      const payload = {
        ...form,
        Base_Price: parseFloat(form.Base_Price),
        Year: parseInt(form.Year),
        No_of_Guests: parseInt(form.No_of_Guests),
      };

      const res = await axios.post("http://127.0.0.1:8000/predict", payload);
      setPrediction(res.data.predicted_price_LKR);
    } catch (err) {
      setError(err.response?.data?.error || "Prediction failed");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
      <div style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "30px", maxWidth: "500px", width: "100%", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold", textAlign: "center", color: "#2563eb", marginBottom: "20px" }}>
          🏨 Hotel Room Price Predictor
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "600" }}>Base Price (LKR):</label>
            <input type="number" name="Base_Price" value={form.Base_Price} onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "600" }}>Year:</label>
            <input type="number" name="Year" value={form.Year} onChange={handleChange} required style={inputStyle} />
          </div>

          {[
            { name: "Room_Type", options: roomTypes },
            { name: "Season", options: seasons },
            { name: "Month", options: months },
            { name: "Weekday", options: weekdays },
          ].map(({ name, options }) => (
            <div key={name} style={{ marginBottom: "15px" }}>
              <label style={{ fontWeight: "600" }}>{name.replace("_", " ")}:</label>
              <select name={name} value={form[name]} onChange={handleChange} required style={inputStyle}>
                <option value="">-- Select --</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}

          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "600" }}>Number of Guests:</label>
            <input type="number" name="No_of_Guests" value={form.No_of_Guests} onChange={handleChange} min="1" required style={inputStyle} />
          </div>

          <button type="submit" style={buttonStyle}>
            Predict Price
          </button>
        </form>

        {prediction !== null && (
          <h3 style={{ color: "#16a34a", fontWeight: "600", textAlign: "center", marginTop: "20px" }}>
            Predicted Price: LKR {prediction}
          </h3>
        )}

        {error && (
          <p style={{ color: "#dc2626", textAlign: "center", marginTop: "15px" }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px"
};

const buttonStyle = {
  backgroundColor: "#2563eb",
  color: "#fff",
  padding: "12px",
  border: "none",
  borderRadius: "4px",
  width: "100%",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "background 0.3s"
};

export default App;
