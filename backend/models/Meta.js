const mongoose = require("mongoose");

const metaSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      unique: true,
      enum: ["home", "about", "blog", "gallery", "contact"],
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    keywords: { type: String, default: "" },
    ogImage: { type: String, default: "" },
    canonical: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meta", metaSchema);
