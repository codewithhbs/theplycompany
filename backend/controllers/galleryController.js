const Gallery = require("../models/Gallery");

exports.getGallery = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createGalleryItem = async (req, res) => {
  try {
    const body = req.body;
    if (req.file) body.image = "/uploads/" + req.file.filename;
    if (!body.image) return res.status(400).json({ message: "Image required" });
    const item = await Gallery.create(body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateGalleryItem = async (req, res) => {
  try {
    const body = req.body;
    if (req.file) body.image = "/uploads/" + req.file.filename;
    const item = await Gallery.findByIdAndUpdate(req.params.id, body, { new: true });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Gallery item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
