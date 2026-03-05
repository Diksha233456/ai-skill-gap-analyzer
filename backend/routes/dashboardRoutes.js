const express = require("express");
const router = express.Router();
const User = require("../models/User");
const roleSkills = require("../services/roleSkills");

router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const requiredSkills = roleSkills[user.targetRole] || [];

    const missingSkills = requiredSkills.filter(
      skill => !user.skills.includes(skill)
    );

    res.status(200).json({
      success: true,
      name: user.name,
      targetRole: user.targetRole,
      readinessScore: user.readinessScore,
      skills: user.skills,
      missingSkills
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;