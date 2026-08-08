const router = require("express").Router();
const protect = require("../middleware/auth");
const { getMetaByPage, getAllMetaAdmin, saveMeta } = require("../controllers/metaController");

router.get("/admin/all", protect, getAllMetaAdmin);
router.get("/:page", getMetaByPage);
router.put("/:page", protect, saveMeta);

module.exports = router;
