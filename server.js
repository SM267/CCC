const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/eventify", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
    const newBooking = new Booking({ eventTitle, userEmail });
    await newBooking.save();
    res.json({ message: "Booking stored successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking failed!" });
  }
});

// ✅ Fetch all bookings (optionally by userEmail)
app.get("/api/bookings", async (req, res) => {
  try {
    const { userEmail } = req.query;
    const filter = userEmail ? { userEmail } : {};
    const bookings = await Booking.find(filter);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://127.0.0.1:${PORT}`));
