const router = require("express").Router();
const protect = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
} = require("../controllers/inquiryController");

// Public: contact form submit
router.post("/", upload.single("attachment"), createInquiry);

// Admin
router.get("/", protect, getInquiries);
router.put("/:id", protect, updateInquiryStatus);
router.delete("/:id", protect, deleteInquiry);

module.exports = router;
