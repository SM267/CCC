const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ MongoDB Atlas connection (Render-compatible)
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error("❌ MONGODB_URI environment variable not found.");
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Define Booking Schema
const bookingSchema = new mongoose.Schema({
  eventTitle: String,
  userEmail: String,
  date: { type: Date, default: Date.now },
});

const Booking = mongoose.model("Booking", bookingSchema);

// ✅ Add a booking
app.post("/api/book", async (req, res) => {
  try {
    const { eventTitle, userEmail } = req.body;
    if (!eventTitle || !userEmail) {
      return res.status(400).json({ message: "Missing eventTitle or userEmail" });
    }
    const newBooking = new Booking({ eventTitle, userEmail });
    await newBooking.save();
    res.json({ message: "🎟️ Booking stored successfully!" });
  } catch (err) {
    console.error("❌ Error saving booking:", err);
    res.status(500).json({ message: "Booking failed!" });
  }
});

// ✅ Fetch bookings
app.get("/api/bookings", async (req, res) => {
  try {
    const { userEmail } = req.query;
    const filter = userEmail ? { userEmail } : {};
    const bookings = await Booking.find(filter);
    res.json(bookings);
  } catch (err) {
    console.error("❌ Error fetching bookings:", err);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// ✅ Start server (Render uses dynamic PORT)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
