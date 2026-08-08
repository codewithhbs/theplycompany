const router = require("express").Router();
const protect = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  getBlogs,
  getBlogBySlug,
  getAllBlogsAdmin,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

// Public
router.get("/", getBlogs);
router.get("/slug/:slug", getBlogBySlug);

// Admin
router.get("/admin/all", protect, getAllBlogsAdmin);
router.post("/", protect, upload.single("image"), createBlog);
router.put("/:id", protect, upload.single("image"), updateBlog);
router.delete("/:id", protect, deleteBlog);

module.exports = router;
