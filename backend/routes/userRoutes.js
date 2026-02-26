const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/create", userController.createUser);
router.get("/", userController.getUsers);
router.post("/upload-resume", userController.uploadResume);

module.exports = router;