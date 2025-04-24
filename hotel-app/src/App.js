import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const locations = [
    "Colombo",
    "Kandy",
    "Galle",
    "Negombo",
    "Nuwara Eliya",
    "Anuradhapura",
  ];
  const hotelTypes = [
    "Resort",
    "City Hotel",
    "Villa",
    "Boutique",
    "Guest House",
  ];
  const roomTypes = ["Standard", "Deluxe", "Suite"];
  const seasons = ["High", "Low", "Shoulder"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const [form, setForm] = useState({
    Location: "",
    Hotel_Type: "",
    Room_Type: "",
    Season: "",
    Month: "",
    Num_Guests: 1,
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
      const res = await axios.post("http://127.0.0.1:8000/predict", form);
      setPrediction(res.data.predicted_price_LKR);
    } catch (err) {
      setError(err.response?.data?.error || "Prediction failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "30px",
          maxWidth: "500px",
          width: "100%",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            textAlign: "center",
            color: "#2563eb",
            marginBottom: "20px",
          }}
        >
          🏨 Hotel Room Price Predictor
        </h2>

        <form onSubmit={handleSubmit}>
          {[
            { label: "Location", options: locations },
            { label: "Hotel_Type", options: hotelTypes },
            { label: "Room_Type", options: roomTypes },
            { label: "Season", options: seasons },
            { label: "Month", options: months },
          ].map(({ label, options }) => (
            <div key={label} style={{ marginBottom: "15px" }}>
              <label
                style={{
                  fontWeight: "600",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                {label.replace("_", " ")}:
              </label>
              <select
                name={label}
                value={form[label]}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                <option value="">-- Select --</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                fontWeight: "600",
                display: "block",
                marginBottom: "5px",
              }}
            >
              Number of Guests:
            </label>
            <input
              type="number"
              name="Num_Guests"
              value={form.Num_Guests}
              onChange={handleChange}
              min="1"
              required
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: "#2563eb",
              color: "#fff",
              padding: "12px",
              border: "none",
              borderRadius: "4px",
              width: "100%",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
          >
            Predict Price
          </button>
        </form>

        {prediction && (
          <h3
            style={{
              color: "#16a34a",
              fontWeight: "600",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            Predicted Price: LKR {prediction}
          </h3>
        )}
        {error && (
          <p
            style={{ color: "#dc2626", textAlign: "center", marginTop: "15px" }}
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
