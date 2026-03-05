const express = require("express");
const router = express.Router();
const multer = require("multer");
const pdfParse = require("pdf-parse");
const userController = require("../controllers/userController");

// Memory storage — no disk writes needed
const upload = multer({ storage: multer.memoryStorage() });

router.post("/create", userController.createUser);
router.get("/", userController.getUsers);
router.post("/upload-resume", userController.uploadResume);      // text-based
router.post("/upload-pdf", upload.single("resume"), userController.uploadPDF);  // file-based

module.exports = router;