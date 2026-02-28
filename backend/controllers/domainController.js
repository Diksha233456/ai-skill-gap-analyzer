const Domain = require("../models/Domain");

// GET all domains
exports.getDomains = async (req, res) => {
  try {
    const search = req.query.search || "";

    const domains = await Domain.find({
      name: { $regex: search, $options: "i" }
    });

    res.json({ success: true, domains });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};