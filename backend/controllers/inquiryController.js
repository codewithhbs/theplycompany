const Inquiry = require("../models/Inquiry");

// Public: create inquiry (from contact form)
exports.createInquiry = async (req, res) => {
  try {
    const body = req.body;
    if (req.file) {
      body.attachmentUrl = "/uploads/" + req.file.filename;
      body.attachmentName = req.file.originalname;
    }
    const inquiry = await Inquiry.create(body);
    res.status(201).json({ message: "Inquiry submitted", inquiry });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin: list all inquiries
exports.getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: update status
exports.updateInquiryStatus = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
    res.json(inquiry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin: delete inquiry
exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
    res.json({ message: "Inquiry deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
