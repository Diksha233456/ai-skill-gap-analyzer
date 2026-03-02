const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    targetRole: { type: String, default: "" },
    skills: { type: [String], default: [] },
    readinessScore: { type: Number, default: 0 },
    lastAnalysis: { type: mongoose.Schema.Types.Mixed, default: null },
    settings: {
      notifications: { type: Boolean, default: true },
      autoSave: { type: Boolean, default: true },
      privateProfile: { type: Boolean, default: false },
      showInSearch: { type: Boolean, default: true },
      animations: { type: Boolean, default: true },
    }
  },
  { timestamps: true }
);

// Hash password before save (Mongoose 9+ async middleware — no next param)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model("User", userSchema);