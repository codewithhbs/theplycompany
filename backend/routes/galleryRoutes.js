const router = require("express").Router();
const protect = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  getGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} = require("../controllers/galleryController");

router.get("/", getGallery);
router.post("/", protect, upload.single("image"), createGalleryItem);
router.put("/:id", protect, upload.single("image"), updateGalleryItem);
router.delete("/:id", protect, deleteGalleryItem);

module.exports = router;
