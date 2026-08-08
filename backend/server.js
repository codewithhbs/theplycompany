require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploaded files (blog/gallery images, inquiry attachments)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));
app.use("/api/gallery", require("./routes/galleryRoutes"));
app.use("/api/faqs", require("./routes/faqRoutes"));
app.use("/api/inquiries", require("./routes/inquiryRoutes"));
app.use("/api/meta", require("./routes/metaRoutes"));

// Admin panel (static)
app.use("/admin", express.static(path.join(__dirname, "admin")));

// Frontend website (static) — served from ../frontend
// app.use(express.static(path.join(__dirname, "..", "frontend")));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

app.use("/", (req, res) => {
  res.send("Welcome to the backend API of Pradeep Timber!");
});
