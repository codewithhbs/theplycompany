const router = require("express").Router();
const protect = require("../middleware/auth");
const {
  getFaqs,
  getAllFaqsAdmin,
  createFaq,
  updateFaq,
  deleteFaq,
} = require("../controllers/faqController");

router.get("/", getFaqs);
router.get("/admin/all", protect, getAllFaqsAdmin);
router.post("/", protect, createFaq);
router.put("/:id", protect, updateFaq);
router.delete("/:id", protect, deleteFaq);

module.exports = router;
