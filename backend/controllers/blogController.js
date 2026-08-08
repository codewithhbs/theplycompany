const Blog = require("../models/Blog");

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Public: list published blogs
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true }).sort({ featured: -1, date: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Public: single blog by slug
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, published: true });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: list all (incl. unpublished)
exports.getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const body = req.body;
    if (!body.slug) body.slug = slugify(body.title);
    if (req.file) body.image = "/uploads/" + req.file.filename;
    body.featured = body.featured === "true" || body.featured === true;
    body.published = body.published === "false" || body.published === false ? false : true;

    const blog = await Blog.create(body);
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const body = req.body;
    if (body.title && !body.slug) body.slug = slugify(body.title);
    if (req.file) body.image = "/uploads/" + req.file.filename;
    if (body.featured !== undefined) body.featured = body.featured === "true" || body.featured === true;
    if (body.published !== undefined) body.published = body.published === "true" || body.published === true;

    const blog = await Blog.findByIdAndUpdate(req.params.id, body, { new: true });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
