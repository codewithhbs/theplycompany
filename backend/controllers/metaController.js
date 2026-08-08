const Meta = require("../models/Meta");

exports.getMetaByPage = async (req, res) => {
  try {
    const meta = await Meta.findOne({ page: req.params.page });
    if (!meta) return res.status(404).json({ message: "Not set" });
    res.json(meta);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllMetaAdmin = async (req, res) => {
  try {
    const items = await Meta.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Upsert by page
exports.saveMeta = async (req, res) => {
  try {
    const { title, description, keywords, ogImage, canonical } = req.body;
    const meta = await Meta.findOneAndUpdate(
      { page: req.params.page },
      { page: req.params.page, title, description, keywords, ogImage, canonical },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(meta);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
