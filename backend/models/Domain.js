const mongoose = require("mongoose");

const domainSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  skills: [String],
  difficulty: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium"
  },
  averageSalary: String,
  demandLevel: Number,
  growthRate: String
});

// ✅ Prevent OverwriteModelError
module.exports =
  mongoose.models.Domain ||
  mongoose.model("Domain", domainSchema);