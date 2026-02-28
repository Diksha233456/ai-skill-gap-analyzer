const express = require("express");
const router = express.Router();
const { generateDomainInsights } = require("../services/llmService");

router.post("/roadmap", async (req, res) => {
  try {
    const { domain, level, goal, time } = req.body;

    if (!domain) {
      return res.status(400).json({ success: false, message: "Domain required" });
    }

    const insights = await generateDomainInsights(domain, {
      level,
      goal,
      time,
    });

    res.json({
      success: true,
      insights,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "AI generation failed"
    });
  }
});

module.exports = router;