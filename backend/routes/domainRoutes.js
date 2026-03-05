const express = require("express");
const router = express.Router();
const { getDomains } = require("../controllers/domainController");

router.get("/", getDomains);

module.exports = router;