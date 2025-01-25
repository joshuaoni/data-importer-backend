const express = require("express");
const { uploadFile, importData } = require("../controllers/fileController");
const router = express.Router();

router.post("/upload", uploadFile);
router.post("/import", importData);

module.exports = router;
