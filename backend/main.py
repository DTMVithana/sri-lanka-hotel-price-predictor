from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib

# Load trained model and label encoders
model = joblib.load("../models/model.pkl")
encoders = joblib.load("../models/encoders.pkl")

# Initialize FastAPI app
app = FastAPI()

# ✅ Enable CORS for React frontend on localhost
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request structure
class HotelInput(BaseModel):
    Location: str
    Hotel_Type: str
    Room_Type: str
    Season: str
    Month: str
    Num_Guests: int

# Endpoint for predicting hotel room price
@app.post("/predict")
def predict_price(data: HotelInput):
    try:
        # Ensure values exist in label encoder's known classes
        def safe_transform(col_name, value):
            value = str(value)
            if value not in encoders[col_name].classes_:
                raise ValueError(f"Invalid {col_name}: '{value}' not in training data")
            return encoders[col_name].transform([value])[0]

        input_vector = [
            safe_transform("Location", data.Location),
            safe_transform("Hotel_Type", data.Hotel_Type),
            safe_transform("Room_Type", data.Room_Type),
            safe_transform("Season", data.Season),
            safe_transform("Month", data.Month),
            data.Num_Guests
        ]

        prediction = model.predict([input_vector])[0]
        return {"predicted_price_LKR": round(prediction, 2)}

    except Exception as e:
        return {"error": f"Prediction failed: {str(e)}"}
