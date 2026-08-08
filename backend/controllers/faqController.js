const Faq = require("../models/Faq");

exports.getFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find({ published: true }).sort({ order: 1, createdAt: 1 });
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllFaqsAdmin = async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ order: 1, createdAt: 1 });
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createFaq = async (req, res) => {
  try {
    const faq = await Faq.create(req.body);
    res.status(201).json(faq);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    res.json(faq);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    res.json({ message: "FAQ deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
