const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    category: {
      type: String,
      enum: ["store", "products", "projects", "materials", "customer"],
      default: "products",
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);
