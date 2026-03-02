const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { analyzeCodingStats } = require("../services/llmService");

/* ─── Auth helper ─── */
function getUser(req, res) {
    const auth = req.headers.authorization;
    if (!auth) { res.status(401).json({ success: false, message: "No token." }); return null; }
    try {
        return jwt.verify(auth.replace("Bearer ", ""), process.env.JWT_SECRET);
    } catch {
        res.status(401).json({ success: false, message: "Invalid token." });
        return null;
    }
}

/* ─── GET: fetch saved coding stats ─── */
router.get("/", async (req, res) => {
    try {
        const decoded = getUser(req, res);
        if (!decoded) return;
        const user = await User.findById(decoded.id).select("codingStats");
        if (!user) return res.status(404).json({ success: false, message: "User not found." });
        res.json({ success: true, codingStats: user.codingStats || {} });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/* ─── POST: save stats + run AI analysis ─── */
router.post("/analyze", async (req, res) => {
    try {
        const decoded = getUser(req, res);
        if (!decoded) return;

        const { easy, medium, hard, platform, targetRole } = req.body;

        // Basic validation
        if (easy === undefined && medium === undefined && hard === undefined)
            return res.status(400).json({ success: false, message: "Provide at least one problem count." });

        const statsPayload = {
            easy: Math.max(0, Number(easy) || 0),
            medium: Math.max(0, Number(medium) || 0),
            hard: Math.max(0, Number(hard) || 0),
            platform: platform || "LeetCode",
            targetRole: targetRole || "Software Engineer",
        };

        // Run AI analysis
        const analysis = await analyzeCodingStats(statsPayload);

        // Persist to DB
        const user = await User.findByIdAndUpdate(
            decoded.id,
            {
                "codingStats.easy": statsPayload.easy,
                "codingStats.medium": statsPayload.medium,
                "codingStats.hard": statsPayload.hard,
                "codingStats.platform": statsPayload.platform,
                "codingStats.targetRole": statsPayload.targetRole,
                "codingStats.lastAnalysis": analysis,
                "codingStats.updatedAt": new Date(),
            },
            { new: true }
        );

        res.json({ success: true, stats: statsPayload, analysis });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
